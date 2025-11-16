import express from "express";
import Schedule from "../models/Schedule.js";
import Booking from "../models/Booking.js";
import Bus from "../models/Bus.js";
import { verifyToken } from "../middleware/auth.js";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import { generateTicketPDF } from "../utils/ticketGenerator.js";
import { sendTicketEmail } from "../utils/sendMail.js";
import { sendWhatsAppMessage } from "../utils/sendWhatsapp.js";
import { uploadTicketToCloudinary } from "../utils/uploadToCloudinary.js";
import path from "path";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("🧾 About to send email using sendTicketEmail:", typeof sendTicketEmail);

router.get("/schedule/:id", verifyToken, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate("busId");

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // ✅ Prepare seatStatus if missing
    if (!schedule.seatStatus || Object.keys(schedule.seatStatus).length === 0) {
      const seatStatus = {};
      const bus = schedule.busId;

      if (!bus || !Array.isArray(bus.seatConfigs) || bus.seatConfigs.length === 0) {
        return res.status(400).json({ message: "Bus seat configuration missing" });
      }

      bus.seatConfigs.forEach((config) => {
        for (let i = 0; i < config.total; i++) {
          const seatKey = `${config.type}_${config.deck || "main"}_${config.category || "single"}_${i}`;
          seatStatus[seatKey] = 0;
        }
      });

      schedule.seatStatus = seatStatus;
      await schedule.save();
    }

    // ✅ Include driver and boarding details
    res.json({
      ...schedule.toObject(),
      seatConfigs: schedule.busId.seatConfigs,
      drivers: schedule.drivers || schedule.busId.drivers,
      boardingPoints: schedule.boardingPoints || schedule.busId.boardingPoints,
      droppingPoints: schedule.droppingPoints || schedule.busId.droppingPoints,
    });
  } catch (err) {
    console.error("❌ Error fetching schedule:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/lock-seats", verifyToken, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userRole = req.user.role;
    const { busId, scheduleId, passengers, seatKeys, totalAmount, contact } = req.body;

    if (!seatKeys?.length)
      return res.status(400).json({ message: "No seats selected" });

    const schedule = await Schedule.findById(scheduleId)
      .populate("busId")
      .session(session);

    if (!schedule)
      return res.status(404).json({ message: "Schedule not found" });

    // Check seat availability
    const alreadyLocked = seatKeys.some(
      (key) => [1, 2].includes(Number(schedule.seatStatus[key]))
    );
    if (alreadyLocked) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(409)
        .json({ message: "Some selected seats are already booked or locked" });
    }

    // ✅ Seat status: booked for agent, locked for user
    const newStatus = userRole === "agent" ? 1 : 2;
    const seatUpdate = seatKeys.reduce((acc, key) => {
      acc[`seatStatus.${key}`] = newStatus;
      return acc;
    }, {});
    await Schedule.updateOne({ _id: scheduleId }, { $set: seatUpdate }, { session });

    const seatsObject = seatKeys.reduce((acc, key) => {
      acc[key] = 1;
      return acc;
    }, {});

    let booking;

    // ✅ Agent booking logic
    if (userRole === "agent") {
      booking = new Booking({
        busId,
        scheduleId,
        agentId: req.user.id,
        passengers,
        seats: seatsObject,
        totalAmount,
        paid: false,
        status: "booked",
        bookedBy: "agent",
        contact,
      });

      await booking.save({ session });
      await session.commitTransaction();
      session.endSession();

      console.log("✅ Agent booking created:", booking._id);

      // 🧾 Generate ticket PDF with bus + driver + boarding details
      try {
        const pdfPath = await generateTicketPDF({
          ...booking.toObject(),
          bus: schedule.busId, // include populated bus info
          schedule, // include route/times
        });

        console.log("📄 Agent Ticket PDF ready at:", pdfPath);

        const recipientEmail = booking.contact?.email || req.user.email;
        console.log("📧 Agent recipient email:", recipientEmail);

        if (recipientEmail) {
          await sendTicketEmail(recipientEmail, booking, pdfPath);
          console.log("✅ Ticket email sent successfully to:", recipientEmail);
        } else {
          console.warn("⚠️ No recipient email found for agent booking");
        }
      } catch (err) {
        console.error("❌ Agent ticket email error:", err);
      }

      return res.json({
        success: true,
        message: "✅ Seat booked successfully by agent & ticket sent via email",
        booking,
      });
    }

    // ✅ Normal user (payment flow)
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    booking = new Booking({
      busId,
      scheduleId,
      userId: req.user.id,
      passengers,
      seats: seatsObject,
      totalAmount,
      paid: false,
      status: "pending",
      bookedBy: "user",
      razorpayOrderId: razorpayOrder.id,
      contact,
    });

    await booking.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      message: "✅ Seats locked, please complete payment",
      booking,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Booking error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
});

router.post("/confirm-booking", verifyToken, async (req, res) => {
  console.log("🧾 /confirm-booking hit!", req.body);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bookingId, paymentId, totalAmount } = req.body;

    // ✅ STEP 1: Fetch full booking with nested data
    let booking = await Booking.findById(bookingId)
      .populate({
        path: "scheduleId",
        populate: {
          path: "busId",
          model: "Bus",
        },
      })
      .populate("userId", "email mobile name")
      .populate("agentId", "email mobile name")
      .session(session);

    if (!booking) {
      await session.endSession();
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🚫 Prevent reconfirming same booking
    if (booking.status === "booked") {
      await session.endSession();
      return res.status(400).json({ message: "Booking already confirmed" });
    }

    // ✅ STEP 2: Update seat status in schedule
    const seatUpdate = Object.keys(booking.seats).reduce((acc, key) => {
      acc[`seatStatus.${key}`] = 1; // booked
      return acc;
    }, {});

    await Schedule.findByIdAndUpdate(
      booking.scheduleId._id,
      {
        $set: seatUpdate,
        $inc: { availableSeats: -Object.keys(booking.seats).length },
      },
      { session }
    );

    // ✅ STEP 3: Update booking status
    booking.paid = booking.bookedBy === "agent" ? false : true;
    booking.status = "booked";
    booking.paymentId = booking.bookedBy === "user" ? paymentId : null;
    booking.totalAmount = totalAmount || booking.totalAmount;
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    // ✅ STEP 4: Ensure bus/schedule data are complete for email
    if (!booking.scheduleId?.busId?.drivers) {
      booking = await Booking.findById(bookingId)
        .populate({
          path: "scheduleId",
          populate: {
            path: "busId",
            model: "Bus",
          },
        })
        .populate("userId", "email mobile name")
        .populate("agentId", "email mobile name");
    }

    // 🧾 Generate PDF Ticket
    const pdfPath = await generateTicketPDF(booking);
    console.log("📄 Ticket PDF generated at:", pdfPath);

    // ✅ Recipient Info
    const recipientEmail =
      booking.contact?.email ||
      (booking.bookedBy === "agent"
        ? booking.agentId?.email
        : booking.userId?.email);

    const recipientMobile =
      booking.contact?.phone ||
      (booking.bookedBy === "agent"
        ? booking.agentId?.mobile
        : booking.userId?.mobile);

    console.log("📧 Email:", recipientEmail, "| 📱 Mobile:", recipientMobile);

    // ✅ STEP 5: Send Email with PDF (fully populated data)
    try {
      if (recipientEmail) {
        console.log("📨 Sending ticket email to:", recipientEmail);
        await sendTicketEmail(recipientEmail, booking, pdfPath);
        console.log("✅ Ticket email sent to:", recipientEmail);
      } else {
        console.warn("⚠️ No recipient email found.");
      }
    } catch (emailErr) {
      console.error("❌ Email sending error:", emailErr);
    }

    // ✅ STEP 6: Send WhatsApp message (optional)
    try {
      if (recipientMobile) {
        const routeInfo = booking.scheduleId.route || {};
        const busInfo = booking.scheduleId.busId || {};
        await sendWhatsAppMessage(
          recipientMobile,
          `🎫 Your Nabeel Bus ticket is confirmed!\n\n🚌 ${busInfo.name} (${busInfo.number})\n🛣 Route: ${routeInfo.from} → ${routeInfo.to}\n📅 Date: ${new Date(
            booking.scheduleId.date
          ).toLocaleDateString()}\n💺 Seats: ${Object.keys(
            booking.seats
          ).join(", ")}\n\nTicket sent to your email.`,
          null
        );
        console.log("✅ WhatsApp message sent successfully");
      }
    } catch (waErr) {
      console.error("❌ WhatsApp send error:", waErr);
    }

    // ✅ STEP 7: Final response
    res.json({
      success: true,
      message:
        booking.bookedBy === "agent"
          ? "✅ Agent booking confirmed — ticket sent via Email & WhatsApp"
          : "✅ User booking confirmed — ticket sent via Email & WhatsApp",
      booking,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("❌ Booking confirm error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/release-lock", verifyToken, async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    // 🟡 Never release agent bookings
    if (booking.bookedBy === "agent") {
      return res
        .status(403)
        .json({ message: "Agent bookings cannot be released." });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Booking already confirmed" });
    }

    // Mark seats back as available (0)
    const releaseUpdate = Object.keys(booking.seats).reduce((acc, key) => {
      acc[`seatStatus.${key}`] = 0;
      return acc;
    }, {});

    await Schedule.findByIdAndUpdate(booking.scheduleId, { $set: releaseUpdate });
    await Booking.findByIdAndDelete(bookingId);

    res.json({ message: "🚫 Booking cancelled and seats released" });
  } catch (err) {
    console.error("Release lock error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get logged-in user's bookings
router.get("/me", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("scheduleId")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Cancel Booking (User only)
router.put("/:id/cancel", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // 🟡 Prevent agent cancellations
    if (booking.bookedBy === "agent") {
      return res
        .status(403)
        .json({ message: "Agent bookings cannot be cancelled manually." });
    }

    if (booking.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    if (booking.status === "cancelled")
      return res.status(400).json({ message: "Booking already cancelled" });

    // Restore seat availability
    const schedule = await Schedule.findById(booking.scheduleId);
    if (schedule && booking.seats) {
      for (const [seatKey] of Object.entries(booking.seats)) {
        schedule.seatStatus[seatKey] = 0;
        schedule.availableSeats += 1;
      }
      await schedule.save();
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "🚫 Booking cancelled successfully", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/api/razorpay/webhook", verifyToken, (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET; // "test_secret"
  const body = JSON.stringify(req.body);
  const signature = req.headers["x-razorpay-signature"];

  const expectedSig = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (signature === expectedSig) {
    console.log("✅ Webhook verified:", req.body.event);
    // handle the event (e.g., mark booking paid)
    res.status(200).send("ok");
  } else {
    console.log("❌ Invalid signature!");
    res.status(400).send("Invalid signature");
  }
});

router.get("/stats", verifyToken, async (req, res) => {
  console.log("📊 /api/bookings/stats hit — role:", req.user.role, "ID:", req.user.id);

  try {
    const role = req.user.role;
    const userId = req.user.id;

    let filter = {};

    if (role === "agent") {
      filter.agentId = userId;
    } else if (role === "user") {
      filter.userId = userId;
    } else {
      return res.status(403).json({ message: "Access denied: invalid role" });
    }

    // 🔍 Log filter to verify
    console.log("🧩 Fetching stats with filter:", filter);

    const bookings = await Booking.find(filter);
    console.log("📦 Found bookings:", bookings.length);

    const totalBookings = bookings.length;
    const booked = bookings.filter((b) => b.status === "booked").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const totalAmount = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    res.json({
      success: true,
      stats: { role, totalBookings, booked, cancelled, pending, totalAmount },
    });
  } catch (err) {
    console.error("❌ Booking stats error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching stats",
      error: err.message,
    });
  }
});

// 📝 Get single booking by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "scheduleId"
    );
    if (!booking || booking.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
