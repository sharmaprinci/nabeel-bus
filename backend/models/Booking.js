// models/Booking.js
import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  seatLabel: String,
  fare: Number,
  mobile: Number,
});

const bookingSchema = new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
  passengers: [passengerSchema],
  seats: { type: Object, required: true },
   bookedBy: { type: String, enum: ["user", "agent"], default: "user" },
   contact: {
      name: String,
      phone: String,
      email: String,
    },
  totalAmount: { type: Number, required: true },
  paid: { type: Boolean, default: false },
  paymentId: String,
  status: { type: String, enum: ["pending", "booked", "cancelled"], default: "booked" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Booking", bookingSchema);