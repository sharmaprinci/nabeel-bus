import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Schedule from "../models/Schedule.js";
import Bus from "../models/Bus.js";
import Agent from "../models/Agent.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// ✅ Admin Login
router.post(
  "/login",
  async (req, res) => {
    const { email, password } = req.body;

    try {
      console.log("🟡 Login attempt:", email);

      const admin = await Admin.findOne({ email });
      if (!admin) {
        console.log("❌ No admin found for email:", email);
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        console.log("❌ Password mismatch for:", email);
        return res.status(400).json({ message: "Invalid credentials" });
      }

      if (!process.env.JWT_SECRET) {
        console.log("🚨 Missing JWT_SECRET in .env file");
        return res.status(500).json({ message: "Server misconfiguration" });
      }

      const token = jwt.sign(
  { id: admin._id, email: admin.email },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);


      console.log("✅ Login successful:", email);
      res.json({ token });
    } catch (error) {
      console.error("💥 Detailed server error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// 👑 GET all users with their bookings
router.get("/users", adminAuth,  async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    const userIds = users.map((u) => u._id);
    const bookings = await Booking.find({ userId: { $in: userIds } })
      .populate({
        path: "scheduleId",
        populate: { path: "busId", select: "name number " }
      })
      .sort({ createdAt: -1 });

    // Group bookings by user
    const bookingsByUser = bookings.reduce((acc, b) => {
      if (!acc[b.userId]) acc[b.userId] = [];
      acc[b.userId].push(b);
      return acc;
    }, {});

    const result = users.map((user) => ({
      ...user.toObject(),
      bookings: bookingsByUser[user._id] || [],
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ✅ Admin creates an Agent
router.post("/create-agent", adminAuth,  async (req, res) => {
  try {
    const { name, email, password, mobile, company } = req.body;

    const existing = await Agent.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Agent with this email already exists" });
    }

    const agent = new Agent({
      name,
      email,
      password,
      mobile,
      company,
      createdBy: req.adminId || null,
    });

    await agent.save();
    res.json({ success: true, message: "Agent created successfully", agent });
  } catch (err) {
    console.error("❌ Agent creation error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 👑 GET all agents with their bookings and stats
router.get("/agents", adminAuth, async (req, res) => {
  try {
    // 1️⃣ Get all agents
    const agents = await Agent.find({ role: "agent" }).sort({ createdAt: -1 });
    if (!agents.length) return res.status(200).json([]);

    const agentIds = agents.map((a) => a._id);

    // 2️⃣ Get all bookings for these agents (userId or agentId)
    const bookings = await Booking.find({
      $or: [
        { userId: { $in: agentIds } },
        { agentId: { $in: agentIds } },
      ],
    })
      .populate({
        path: "scheduleId",
        populate: {
          path: "busId",
          select: "name number acType amenities drivers boardingPoints droppingPoints",
        },
      })
      .populate({
        path: "scheduleId.route",
        select: "from to distance",
      })
      .sort({ createdAt: -1 });

    // 3️⃣ Group bookings by agent
    const bookingsByAgent = bookings.reduce((acc, b) => {
      const agentKey = b.agentId || b.userId;
      if (!agentKey) return acc;
      const keyStr = agentKey.toString();
      if (!acc[keyStr]) acc[keyStr] = [];
      acc[keyStr].push(b);
      return acc;
    }, {});

    // 4️⃣ Build agent summary + stats
    const result = agents.map((agent) => {
      const agentBookings = bookingsByAgent[agent._id.toString()] || [];

      const totalSeats = agentBookings.reduce(
        (sum, b) => sum + Object.keys(b.seats || {}).length,
        0
      );
      const totalRevenue = agentBookings.reduce(
        (sum, b) => sum + (b.totalAmount || 0),
        0
      );
      const activeBookings = agentBookings.filter((b) => b.status === "booked").length;
      const cancelledBookings = agentBookings.filter((b) => b.status === "cancelled").length;

      return {
        ...agent.toObject(),
        bookings: agentBookings,
        stats: {
          totalBookings: agentBookings.length,
          activeBookings,
          cancelledBookings,
          totalSeats,
          totalRevenue,
        },
      };
    });

    res.json(result);
  } catch (err) {
    console.error("❌ Failed to fetch agents:", err);
    res.status(500).json({ message: "Failed to fetch agents" });
  }
});

router.get("/agents-summary", adminAuth, async (req, res) => {
  try {
    const agents = await User.find({ role: "agent" });
    const agentIds = agents.map((a) => a._id);

    const bookings = await Booking.find({ userId: { $in: agentIds } });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalSeats = bookings.reduce((sum, b) => sum + Object.keys(b.seats || {}).length, 0);

    res.json({ totalAgents: agents.length, totalBookings, totalSeats, totalRevenue });
  } catch (err) {
    res.status(500).json({ message: "Failed to get agent summary" });
  }
});

// GET /api/admin/passenger-summary
router.get("/passenger-summary", adminAuth, async (req, res) => {
  try {
    const { date, origin, destination, busId } = req.query;

    const query = {};
    if (date) query.date = date;
    if (origin) query["route.from"] = origin;
    if (destination) query["route.to"] = destination;
    if (busId) query.busId = busId;

    // ✅ Populate bus info from Bus collection
    const schedules = await Schedule.find(query)
      .populate({
        path: "busId",
        select: "name number route.from route.to",
      })
      .lean();

    const summary = await Promise.all(
      schedules.map(async (s) => {
        const bookings = await Booking.find({ scheduleId: s._id })
          .populate("userId", "name role email")
          .populate("busId", "name number route.from route.to")
          .lean();

        const passengers = bookings.flatMap((b) =>
          (b.passengers || []).map((p) => ({
            passengerName: p.name,
            seatNo: p.seatLabel,
            fare: p.fare,
            bookedBy: b.bookedBy,
            bookedByName:
              b.bookedBy === "agent"
                ? b.userId?.name || "Unknown Agent"
                : b.userId?.name || "User",
            paymentStatus: b.paid ? "Paid" : "Pending",
          }))
        );

        const totalPassengers = passengers.length;
        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce(
          (sum, b) => sum + (b.totalAmount || 0),
          0
        );

        const revenueByRole = {
          agents: bookings
            .filter((b) => b.bookedBy === "agent")
            .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
          users: bookings
            .filter((b) => b.bookedBy === "user")
            .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        };

        // ✅ Detect field names dynamically (works regardless of schema naming)
        const bus = s.busId || {};
        const route = bus.route || {};

        return {
          scheduleId: s._id,
          busId: bus._id,
          busName: bus.name || bus.busName || "Unknown Bus",
          busNumber: bus.number || bus.busNumber || "-",
          origin:
            route.from ||
            s.route?.from ||
            bus.origin ||
            s.origin ||
            "-",
          destination:
            route.to ||
            s.route?.to ||
            bus.destination ||
            s.destination ||
            "-",
          date: s.date,
          totalBookings,
          totalPassengers,
          revenue: totalRevenue,
          passengers,
          revenueByRole,
        };
      })
    );

    res.json({ success: true, summary });
  } catch (err) {
    console.error("❌ Passenger summary error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📊 ADMIN DASHBOARD STATS
router.get("/dashboard-stats", adminAuth, async (req, res) => {
  try {
    // 1️⃣ Get totals
    const [totalBuses, totalAgents, totalUsers, totalBookings] = await Promise.all([
      Bus.countDocuments(),
      Agent.countDocuments(),
      User.countDocuments(),
      Booking.countDocuments(),
    ]);

    // 2️⃣ Combine user + agent revenue and booking status counts
    const userLookups = await Booking.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $lookup: {
          from: "agents",
          localField: "userId",
          foreignField: "_id",
          as: "agentData",
        },
      },
      {
        $addFields: {
          combined: { $concatArrays: ["$userData", "$agentData"] },
        },
      },
      { $unwind: "$combined" },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$combined.role", "user"] }, { $eq: ["$paid", true] }] },
                "$totalAmount",
                0,
              ],
            },
          },
          unpaidRevenue: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$combined.role", "user"] }, { $eq: ["$paid", false] }] },
                "$totalAmount",
                0,
              ],
            },
          },
          confirmedBookings: { $sum: { $cond: [{ $eq: ["$status", "booked"] }, 1, 0] } },
          pendingBookings: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          cancelledBookings: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
        },
      },
    ]);

    const totals = {
      totalBuses,
      totalAgents,
      totalUsers,
      totalBookings,
      totalRevenue: userLookups[0]?.totalRevenue || 0,
      unpaidRevenue: userLookups[0]?.unpaidRevenue || 0,
      confirmedBookings: userLookups[0]?.confirmedBookings || 0,
      pendingBookings: userLookups[0]?.pendingBookings || 0,
      cancelledBookings: userLookups[0]?.cancelledBookings || 0,
      todayBookings: await Booking.countDocuments({
        createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
      }),
    };

    // 3️⃣ Monthly trends (Bookings + Revenue)
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const monthlyData = await Booking.aggregate([
      { $match: { createdAt: { $gte: startOfYear } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalBookings: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$paid", true] }, "$totalAmount", 0],
            },
          },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ];

    const monthlyTrends = monthNames.map((m, i) => {
      const found = monthlyData.find((d) => d._id.month === i + 1);
      return {
        name: m,
        bookings: found?.totalBookings || 0,
        revenue: found?.totalRevenue || 0,
      };
    });

    // 4️⃣ Bus type distribution
    const busTypeDistribution = await Bus.aggregate([
      {
        $project: {
          seatTypes: { $setUnion: "$seatConfigs.type" },
          acType: 1,
        },
      },
      {
        $project: {
          seatTypeLabel: {
            $reduce: {
              input: "$seatTypes",
              initialValue: "",
              in: {
                $concat: [
                  "$$value",
                  { $cond: [{ $eq: ["$$value", ""] }, "", " + "] },
                  { $toUpper: "$$this" },
                ],
              },
            },
          },
          acType: 1,
        },
      },
      {
        $project: {
          type: { $concat: ["$acType", " ", "$seatTypeLabel"] },
        },
      },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    const busTypeData = busTypeDistribution.map((t) => ({
      name: t._id || "Unknown",
      value: t.count,
    }));

    // 5️⃣ Agent performance summary
    const agentBookings = await Booking.aggregate([
      {
        $lookup: {
          from: "agents",
          localField: "userId",
          foreignField: "_id",
          as: "agent",
        },
      },
      { $unwind: { path: "$agent", preserveNullAndEmptyArrays: true } },
      { $match: { "agent._id": { $exists: true } } },
      {
        $group: {
          _id: "$agent._id",
          name: { $first: "$agent.name" },
          totalBookings: { $sum: 1 },
          totalSeats: { $sum: { $size: "$passengers" } },
        },
      },
    ]);

    const agents = {
      totalAgentBookings: agentBookings.reduce((a, b) => a + b.totalBookings, 0),
      totalAgentSeats: agentBookings.reduce((a, b) => a + b.totalSeats, 0),
      activeAgents: totalAgents,
    };

    // 6️⃣ Bookings per Bus (via schedule → bus)
// 6️⃣ Bookings per Bus (via schedule → bus, exclude agent revenue)
const bookingsPerBus = await Booking.aggregate([
  // Join schedules
  {
    $lookup: {
      from: "schedules",
      localField: "scheduleId",
      foreignField: "_id",
      as: "schedule",
    },
  },
  { $unwind: "$schedule" },

  // Join buses
  {
    $lookup: {
      from: "buses",
      localField: "schedule.busId",
      foreignField: "_id",
      as: "bus",
    },
  },
  { $unwind: "$bus" },

  // Join users and agents (to determine who made the booking)
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userData",
    },
  },
  {
    $lookup: {
      from: "agents",
      localField: "userId",
      foreignField: "_id",
      as: "agentData",
    },
  },

  // Merge user + agent
  {
    $addFields: {
      combined: { $concatArrays: ["$userData", "$agentData"] },
    },
  },
  { $unwind: "$combined" },

  // Group per bus
  {
    $group: {
      _id: "$bus.name",
      busNumber: { $first: "$bus.number" },
      totalBookings: { $sum: 1 },
      totalPassengers: { $sum: { $size: "$passengers" } },

      // ✅ Exclude agent revenue
      totalRevenue: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$combined.role", "user"] },
                { $eq: ["$paid", true] },
                { $ne: ["$status", "cancelled"] },
              ],
            },
            "$totalAmount",
            0,
          ],
        },
      },
    },
  },
  { $sort: { totalBookings: -1 } },
]);

// 7️⃣ Bookings per Bus by Date (includes bus number + route, excludes agent revenue)
const bookingsPerBusByDate = await Booking.aggregate([
  // Join schedules
  {
    $lookup: {
      from: "schedules",
      localField: "scheduleId",
      foreignField: "_id",
      as: "schedule",
    },
  },
  { $unwind: "$schedule" },

  // Join buses
  {
    $lookup: {
      from: "buses",
      localField: "schedule.busId",
      foreignField: "_id",
      as: "bus",
    },
  },
  { $unwind: "$bus" },

  // Join users (for excluding agents)
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userData",
    },
  },

  // Join agents
  {
    $lookup: {
      from: "agents",
      localField: "userId",
      foreignField: "_id",
      as: "agentData",
    },
  },

  // Merge user + agent info
  {
    $addFields: {
      combined: { $concatArrays: ["$userData", "$agentData"] },

      // ✅ Parse date safely (string → Date)
      parsedDate: {
        $cond: [
          { $eq: [{ $type: "$schedule.date" }, "string"] },
          { $dateFromString: { dateString: "$schedule.date" } },
          "$schedule.date",
        ],
      },

      // ✅ Safe field extraction to avoid dot errors
      routeFrom: {
        $getField: {
          field: "from",
          input: { $getField: { field: "route", input: "$schedule" } },
        },
      },
      routeTo: {
        $getField: {
          field: "to",
          input: { $getField: { field: "route", input: "$schedule" } },
        },
      },
    },
  },

  { $unwind: "$combined" },

  // ✅ Group by bus name, number, route, and date
  {
    $group: {
      _id: {
        busName: "$bus.name",
        busNumber: "$bus.number",
        routeFrom: "$routeFrom",
        routeTo: "$routeTo",
        date: { $dateToString: { format: "%Y-%m-%d", date: "$parsedDate" } },
      },
      totalBookings: { $sum: 1 },
      totalPassengers: { $sum: { $size: "$passengers" } },
      totalRevenue: {
        $sum: {
          $cond: [
            {
              $and: [
                { $eq: ["$combined.role", "user"] }, // ✅ only normal users
                { $eq: ["$paid", true] },
                { $ne: ["$status", "cancelled"] },
              ],
            },
            "$totalAmount",
            0,
          ],
        },
      },
    },
  },
  { $sort: { "_id.date": 1 } },
]);

// 🧩 Transform for frontend
const dateWise = {};
bookingsPerBusByDate.forEach((b) => {
  const { date, busName, busNumber, routeFrom, routeTo } = b._id;
  const route = `${routeFrom} → ${routeTo}`;
  const key = `${busName} (${busNumber})`;

  if (!dateWise[date]) dateWise[date] = { date, route };
  dateWise[date][`${key}_Bookings`] = b.totalBookings;
  dateWise[date][`${key}_Passengers`] = b.totalPassengers;
  dateWise[date][`${key}_Revenue`] = b.totalRevenue;
});

const bookingsPerBusByDateData = Object.values(dateWise);

    // ✅ Final combined response
    res.json({
      totals,
      trends: { monthlyTrends, busTypeData },
      agents,
      performance: {
        bookingsPerBus,
        bookingsPerBusByDate: bookingsPerBusByDateData,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
});

router.get("/agent-bookings", adminAuth,  async (req, res) => {
  const bookings = await Booking.find({ bookedBy: "agent" })
    .populate("busId")
    .populate("userId")
    .populate("scheduleId");

  res.json({ success: true, bookings });
});

router.get("/passenger-list", adminAuth, async (req, res) => {
  try {
    const { date, origin, destination, busId } = req.query;
    const filter = {};

    // Step 1: Filter schedules if needed
    if (date || origin || destination || busId) {
      const scheduleFilter = {};
      if (date) scheduleFilter.date = date;
      if (origin) scheduleFilter["route.from"] = origin;
      if (destination) scheduleFilter["route.to"] = destination;
      if (busId) scheduleFilter.busId = busId;

      const schedules = await Schedule.find(scheduleFilter).select("_id");
      if (schedules.length > 0) {
        filter.scheduleId = { $in: schedules.map((s) => s._id) };
      }
    }

    // Step 2: Populate all relations
    const bookings = await Booking.find(filter)
      .populate({
        path: "scheduleId",
        populate: { path: "busId", model: "Bus" },
      })
      .populate("userId")
      .populate("agentId")
      .sort({ createdAt: -1 });

    // Step 3: Flatten passenger data
    const passengers = bookings.flatMap((b) => {
      const schedule = b.scheduleId || {};
      const bus = schedule.busId || {};
      const user = b.userId || {};
      const agent = b.agentId || {};

      const bookedBy = b.bookedBy || "user";

      let contactName = "—";
      let contactPhone = "—";
      let contactEmail = "—";
      let contactCompany = "—";
      let contactCity = "—";

      if (bookedBy === "agent" && agent) {
        contactName = agent.name || "Agent";
        contactPhone = agent.mobile || agent.phone || "—";
        contactEmail = agent.email || "—";
        contactCompany = agent.company || "—";
      } else if (user) {
        contactName = user.name || "—";
        contactPhone = user.mobile || user.phone || "—";
        contactEmail = user.email || "—";
        contactCity = user.city || "—";
      }

      if (b.passengers?.length > 0) {
        return b.passengers.map((p) => ({
          passengerName: p.name,
          age: p.age,
          gender: p.gender,
          seatNo: p.seatLabel,
          fare: p.fare,
          contactName,
          contactPhone,
          contactEmail,
          contactCompany,
          contactCity,
          busNumber: bus.number || "—",
          busName: bus.name || "—",
          origin: schedule?.route?.from || "—",
          destination: schedule?.route?.to || "—",
          travelDate: schedule?.date || "—",
          bookingDate: b.createdAt,
          paymentStatus: b.paid ? "Paid" : "Pending",
          bookingStatus: b.status,
          bookedBy,
        }));
      }

      return Object.entries(b.seats || {}).map(([seatLabel, fare]) => ({
        passengerName: contactName,
        age: "-",
        gender: "-",
        seatNo: seatLabel,
        fare,
        contactName,
        contactPhone,
        contactEmail,
        contactCompany,
        contactCity,
        busNumber: bus.number || "—",
        busName: bus.name || "—",
        origin: schedule?.route?.from || "—",
        destination: schedule?.route?.to || "—",
        travelDate: schedule?.date || "—",
        bookingDate: b.createdAt,
        paymentStatus: b.paid ? "Paid" : "Pending",
        bookingStatus: b.status,
        bookedBy,
      }));
    });

    res.json({ success: true, passengers });
  } catch (err) {
    console.error("❌ Passenger List Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/booking-summary", adminAuth, async (req, res) => {
  try {
    const { date, origin, destination } = req.query;

    const query = {};
    if (date) query.date = date;
    if (origin) query["route.from"] = new RegExp(`^${origin}$`, "i");
    if (destination) query["route.to"] = new RegExp(`^${destination}$`, "i");

    const schedules = await Schedule.find(query).populate("busId");

    if (!schedules.length)
      return res.json({ success: true, summary: [] });

    const summary = [];

    for (const schedule of schedules) {
      const bus = schedule.busId;
      if (!bus) continue;

      // ✅ Populate both agent and user for each booking
      const bookings = await Booking.find({ scheduleId: schedule._id })
        .populate("userId", "name email mobile role")
        .populate("agentId", "name email mobile company")
        .sort({ createdAt: -1 });

      let confirmedSeats = 0;
      let pendingSeats = 0;
      let totalAmountCollected = 0;
      const passengers = [];
      const agentBookings = [];
      const userBookings = [];

      for (const b of bookings) {
        // ✅ Determine who booked
        const isAgentBooking = !!b.agentId;
        const bookedBy = isAgentBooking ? "agent" : "user";
        const bookedByName =
          isAgentBooking
            ? b.agentId.agencyName || b.agentId.name
            : b.userId?.name || "-";

        // ✅ Payment Status Logic
        const paymentStatus = isAgentBooking
          ? "Pending"
          : b.paid
          ? "Paid"
          : "Pending";

        for (const p of b.passengers) {
          passengers.push({
            passengerName: p.name,
            age: p.age,
            gender: p.gender,
            seatNo: p.seatLabel,
            fare: p.fare,
            contactName: b.contact?.name || b.userId?.name || "—",
            contactPhone: b.contact?.phone || b.userId?.mobile || "—",
            contactEmail: b.contact?.email || b.userId?.email || "—",
            bookingDate: b.createdAt,
            paymentStatus,
            bookingStatus: b.status,
            bookedBy,
            bookedByName,
          });

          // 🧮 Counting logic
          if (isAgentBooking) {
            pendingSeats++; // agents never mark as confirmed
            agentBookings.push(p);
          } else if (b.paid) {
            confirmedSeats++;
            userBookings.push(p);
            totalAmountCollected += p.fare;
          } else {
            pendingSeats++;
          }
        }
      }

      const totalSeats = Object.keys(schedule.seatStatus || {}).length;
      const totalBookedSeats = confirmedSeats + pendingSeats;
      const availableSeats = totalSeats - totalBookedSeats;

      summary.push({
        scheduleId: schedule._id,
        busId: bus._id,
        busNumber: bus.number,
        busName: bus.name,
        origin: schedule.route?.from || "-",
        destination: schedule.route?.to || "-",
        date: schedule.date,
        departureTime: bus.departureTime,
        arrivalTime: bus.arrivalTime,
        totalSeats,
        confirmedSeats,
        pendingSeats,
        totalBookedSeats,
        availableSeats,
        totalAmountCollected,
        totalRevenueByRole: {
          agents: agentBookings.reduce((sum, p) => sum + p.fare, 0),
          users: userBookings.reduce((sum, p) => sum + p.fare, 0),
        },
        amenities: bus.amenities || [],
        passengers,
      });
    }

    res.json({ success: true, summary });
  } catch (err) {
    console.error("❌ Error fetching booking summary:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ All bookings & seat availability for a specific bus
router.get("/bus-all-bookings/:busId", adminAuth, async (req, res) => {
  try {
    const { busId } = req.params;
    const { date } = req.query; // optional ?date=YYYY-MM-DD

    // 🎯 1️⃣ Find schedules for that bus (optional date filter)
    const scheduleQuery = { busId };
    if (date) scheduleQuery.date = date;

    const schedules = await Schedule.find(scheduleQuery).populate("busId");

    if (!schedules.length) {
      return res.json({
        success: true,
        passengers: [],
        bookedSeats: [],
        availableSeats: [],
        totalSeats: 0,
      });
    }

    // Choose latest or first schedule (for now)
    const schedule = schedules[schedules.length - 1];

    // 🎯 2️⃣ Fetch all bookings linked to this bus/schedule
    const bookings = await Booking.find({
      $or: [{ busId }, { scheduleId: schedule._id }],
    })
      .populate("busId", "name number")
      .populate("scheduleId", "route date")
      .populate("userId", "name email mobile role")
      .sort({ createdAt: -1 });

    if (!bookings.length) {
      return res.json({
        success: true,
        passengers: [],
        bookedSeats: [],
        availableSeats: Object.keys(schedule.seatStatus || {}),
        totalSeats: Object.keys(schedule.seatStatus || {}).length,
      });
    }

    // 🎯 3️⃣ Map bookings → passenger details
    const passengers = bookings.flatMap((b) => {
      const scheduleData = b.scheduleId;
      const bus = b.busId;
      const user = b.userId;

      return (b.passengers || []).map((p) => ({
        passengerName: p.name,
        age: p.age,
        gender: p.gender,
        seatNo: p.seatLabel,
        fare: p.fare,
        contactName: b.contact?.name || user?.name || "—",
        contactPhone: b.contact?.phone || user?.mobile || "—",
        contactEmail: b.contact?.email || user?.email || "—",
        busNumber: bus?.number || "—",
        busName: bus?.name || "—",
        origin: scheduleData?.route?.from || "—",
        destination: scheduleData?.route?.to || "—",
        travelDate: scheduleData?.date || "—",
        bookingDate: b.createdAt,
        paymentStatus: b.paid ? "Paid" : "Pending",
        bookingStatus: b.status || "Confirmed",
      }));
    });

    // 🎯 4️⃣ Compute seat availability
    const allSeats = Object.keys(schedule.seatStatus || {});
    const bookedSeats = passengers.map((p) => p.seatNo);
    const availableSeats = allSeats.filter((s) => !bookedSeats.includes(s));

    // 🎯 5️⃣ Return complete structured response
    res.json({
      success: true,
      passengers,
      totalSeats: allSeats.length,
      bookedSeats,
      availableSeats,
    });
  } catch (err) {
    console.error("❌ Bus bookings error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
