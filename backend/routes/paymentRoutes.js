import express from "express";
import Razorpay from "razorpay";
import Booking from "../models/Booking.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post("/create-order", async (req, res) => {
  const { bookingId, amount } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: bookingId
    });

    await Booking.findByIdAndUpdate(bookingId, { paymentId: order.id });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Razorpay error" });
  }
});

router.post("/verify", verifyToken, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    // 🪙 Step 1: verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // 🧾 Step 2: update booking as paid
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentId = razorpay_payment_id;
    booking.paid = true;
    await booking.save();

    return res.json({ success: true, message: "Payment verified", booking });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
