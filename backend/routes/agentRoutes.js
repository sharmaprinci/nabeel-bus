import express from "express";
import jwt from "jsonwebtoken";
import Booking from "../models/Booking.js";
import Schedule from "../models/Schedule.js";
import Bus from "../models/Bus.js";
import { verifyToken } from "../middleware/auth.js";
import Agent from "../models/Agent.js";

const router = express.Router();

/**
 * 🧑‍💻 Agent Login
 */
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const Agent = (await import("../models/Agent.js")).default;

    // ✅ Correct field name
    const agent = await Agent.findOne({ mobile });
    if (!agent) return res.status(400).json({ message: "Invalid credentials" });

    const bcrypt = (await import("bcryptjs")).default;
    const isMatch = await bcrypt.compare(password, agent.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: agent._id, role: "agent" },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.json({
      success: true,
      token,
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,  // ✅ keep consistent with schema
        company: agent.company,
      },
    });
  } catch (err) {
    console.error("❌ Agent login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/profile", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "agent")
      return res.status(403).json({ message: "Access denied: Agents only" });

    const agent = await Agent.findById(req.user.id).select("-password");
    if (!agent)
      return res.status(404).json({ message: "Agent not found" });

    res.json({ success: true, user: agent });
  } catch (err) {
    console.error("❌ Fetch agent profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/profile", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "agent")
      return res.status(403).json({ message: "Access denied: Agents only" });

    const { name, email, mobile, company } = req.body;

    const updated = await Agent.findByIdAndUpdate(
      req.user.id,
      { name, email, mobile, company },
      { new: true }
    ).select("-password");

    res.json({ success: true, user: updated });
  } catch (err) {
    console.error("❌ Update agent profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// /api/agents/my-bookings
router.get("/my-bookings", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "agent") {
      return res.status(403).json({ message: "Access denied: Agents only" });
    }

    // 🧠 Populate deeply through schedule -> bus + route
    const bookings = await Booking.find({ agentId: req.user.id })
      .populate({
        path: "scheduleId",
        populate: [
          {
            path: "busId",
            select:
              "name number acType amenities drivers boardingPoints droppingPoints departureTime arrivalTime routes",
          },
          {
            path: "route",
            select: "from to distance",
          },
        ],
      })
      .sort({ createdAt: -1 });

    if (!bookings.length)
      return res.json({ success: true, bookings: [] });

    // ✅ Flatten all data for frontend + ticket generation
    const formatted = bookings.map((b) => {
      const schedule = b.scheduleId;
      const bus = schedule?.busId;
      const route = schedule?.route || bus?.routes?.[0] || {};

      const driver = bus?.drivers?.[0] || {};
      const boarding = bus?.boardingPoints?.[0] || {};
      const dropping = bus?.droppingPoints?.[0] || {};

      return {
        _id: b._id,
        bookingId: b._id,
        busId: bus?._id,
        busName: bus?.name || "—",
        busNumber: bus?.number || "—",
        acType: bus?.acType || "—",
        amenities: bus?.amenities || [],
        origin: route?.from || "—",
        destination: route?.to || "—",
        date: schedule?.date || "—",
        departureTime: schedule?.departureTime || bus?.departureTime || "",
        arrivalTime: schedule?.arrivalTime || bus?.arrivalTime || "",
        driver: {
          name: driver?.name || "—",
          phone: driver?.phone || "—",
          licenseNumber: driver?.licenseNumber || "—",
        },
        boardingPoint: {
          location: boarding?.location || "—",
          time: boarding?.time || "—",
        },
        droppingPoint: {
          location: dropping?.location || "—",
          time: dropping?.time || "—",
        },
        passengers: b.passengers || [],
        seats: b.seats || {},
        seatNos: Object.keys(b.seats || {}),
        totalAmount: b.totalAmount,
        status: b.status,
        paid: b.paid,
        paymentStatus: b.paid ? "Paid" : "Not Required (Agent)",
        bookedBy: b.bookedBy,
      };
    });

    res.json({ success: true, bookings: formatted });
  } catch (err) {
    console.error("❌ Agent booking fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
