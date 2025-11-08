import { Server } from "socket.io";
import http from "http";
// import app from "./app.js"; // your express app
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import Schedule from "./models/Schedule.js";
import Admin from "./models/Admin.js";
import cron from "node-cron";
import { generateAutomaticSchedules, generateScheduleForDate } from "./utils/autoScheduleGenerator.js";


dotenv.config();

const BOOKING_WINDOW_DAYS = parseInt(process.env.BOOKING_WINDOW_DAYS) || 60;

// 🚀 On server startup, generate schedules for the entire booking window
(async () => {
  console.log(`🚀 Generating schedules for the next ${BOOKING_WINDOW_DAYS} days...`);
  await generateAutomaticSchedules(BOOKING_WINDOW_DAYS);
})();

// 🕛 Every night at midnight, add the next day at the end of the window
cron.schedule("0 0 * * *", async () => {
  const target = new Date();
  target.setDate(target.getDate() + BOOKING_WINDOW_DAYS);
  console.log(`🕛 Generating schedule for ${target.toISOString().split("T")[0]}...`);
  await generateScheduleForDate(target);
});

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // ✅ parses JSON bodies
app.use(express.urlencoded({ extended: true })); // ✅ parses URL-encoded form data

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB connection error:", err));

  const server = http.createServer(app);

// 🚀 Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // or specific frontend URL
    methods: ["GET", "POST"],
  },
});

// Store bus positions and seat statuses in-memory (or Redis)
let busTracking = {}; // { busId: { lat, lng, speed, lastUpdate } }
let seatStatus = {};  // { busId: { "L1": "booked", "L2": "available", ... } }

io.on("connection", (socket) => {
  console.log("🧩 New client connected", socket.id);

  socket.on("joinBus", async (busId) => {
    socket.join(busId);
    console.log(`Client joined bus ${busId}`);

    // 🪑 Load seat status from DB if not cached
    if (!seatStatus[busId]) {
      const schedule = await Schedule.findOne({ busId }).sort({ date: -1 }); // latest schedule
      if (schedule && schedule.seatStatus) {
        seatStatus[busId] = schedule.seatStatus;
      } else {
        // fallback - empty seat layout
        seatStatus[busId] = {};
      }
    }

    // 🚀 Send data to client
    socket.emit("seatStatus", seatStatus[busId]);
    socket.emit("busLocation", busTracking[busId] || {});
  });

  socket.on("updateLocation", ({ busId, lat, lng, speed }) => {
    busTracking[busId] = { lat, lng, speed, lastUpdate: Date.now() };
    io.to(busId).emit("busLocation", busTracking[busId]);
  });

  socket.on("seatUpdate", async ({ busId, seatKey, status }) => {
    if (!seatStatus[busId]) seatStatus[busId] = {};
    seatStatus[busId][seatKey] = status;

    // ✅ Broadcast to all clients in the same bus room
    io.to(busId).emit("seatStatus", seatStatus[busId]);

    // ✅ Persist to DB
    await Schedule.updateOne({ busId }, { $set: { [`seatStatus.${seatKey}`]: status } });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// ✅ Auto-create default admin
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      const admin = new Admin({
        name: "Super Admin",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
      });
      await admin.save();
      console.log("✅ Default admin created:", process.env.ADMIN_EMAIL);
    } else {
      console.log("ℹ️ Default admin already exists");
    }
  } catch (err) {
    console.error("❌ Error creating default admin:", err);
  }
};
createDefaultAdmin();

// Public routes
app.use("/api/auth", authRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes);
// app.use("/api/payments", paymentRoutes);

// Admin routes
// Admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/agent", agentRoutes);

// ✅ Use the combined server, not app.listen
server.listen(PORT, () => console.log(`🚀 Server + Socket.IO running on http://localhost:${PORT}`));

