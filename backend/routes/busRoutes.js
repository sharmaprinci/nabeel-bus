import express from "express";
import Bus from "../models/Bus.js";
import Schedule from "../models/Schedule.js";
import  { generateAutomaticSchedules } from "../utils/autoScheduleGenerator.js";
const router = express.Router();
import adminAuth from "../middleware/adminAuth.js"

/** 🚌 Add New Bus (URLs only, no multer) */

// router.post("/add", async (req, res) => {
//   console.log(req.body);  
//   try {
//     const totalBuses = await Bus.countDocuments({});
//     const {
//       name,
//       number,
//       acType,
//       totalSeats,
//       seatConfigs,
//       routes,
//       amenities,
//       imageUrl,
//       gallery,
//       alternating,
//       isSpecial,
//       remarks,
//       departureTime,
//       arrivalTime,
//     } = req.body;

//     const bus = new Bus({
//       name,
//       number,
//       acType,
//       totalSeats,
//       seatConfigs,
//       routes,
//       amenities,
//       imageUrl,
//       gallery,
//       alternating,
//       isSpecial,
//       remarks,
//       departureTime,
//       arrivalTime,
//       priority: totalBuses,
//     });

//     await bus.save();
//     await generateAutomaticSchedules(7);
//     res.json({ success: true, message: "Bus added successfully", bus });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Error adding bus" });
//   }
// });

// /** ✏️ Update Bus + Sync Schedules */
// router.put("/:id", async (req, res) => {
//   try {
//     const updateData = { ...req.body };

//     // 🧩 Parse JSON fields if sent as strings
//     ["seatConfigs", "routes", "amenities", "gallery"].forEach((key) => {
//       if (updateData[key] && typeof updateData[key] === "string") {
//         updateData[key] = JSON.parse(updateData[key]);
//       }
//     });

//     const bus = await Bus.findByIdAndUpdate(req.params.id, updateData, { new: true });
//     if (!bus) return res.status(404).json({ message: "Bus not found" });

//     // ✅ Update all future schedules for this bus
//     const now = new Date();
//     const updateFields = {};

//     if (bus.departureTime) updateFields["busDetails.departureTime"] = bus.departureTime;
//     if (bus.arrivalTime) updateFields["busDetails.arrivalTime"] = bus.arrivalTime;
//     if (bus.routes) updateFields.route = bus.routes[0];
//     if (bus.totalSeats) updateFields.availableSeats = bus.totalSeats;

//     await Schedule.updateMany(
//       { busId: bus._id, date: { $gte: now } },
//       { $set: updateFields }
//     );

//     res.json({ success: true, message: "Bus updated and schedules synced", bus });
//   } catch (err) {
//     console.error("❌ Error updating bus:", err);
//     res.status(500).json({ success: false, message: "Error updating bus" });
//   }
// });

/** 🚌 Add New Bus */
router.post("/add", adminAuth, async (req, res) => {
  try {
    const totalBuses = await Bus.countDocuments({});
    const {
      name,
      number,
      acType,
      totalSeats,
      seatConfigs,
      routes,
      amenities,
      alternating,
      isSpecial,
      remarks,
      departureTime,
      arrivalTime,
      drivers,
      boardingPoints,
      droppingPoints,
    } = req.body;

    const bus = new Bus({
      name,
      number,
      acType,
      totalSeats,
      seatConfigs,
      routes,
      amenities,
      alternating,
      isSpecial,
      remarks,
      departureTime,
      arrivalTime,
      priority: totalBuses,
      drivers,
      boardingPoints,
      droppingPoints,
    });

    await bus.save();

    // ✅ Generate upcoming schedules (include driver + stops)
    await generateAutomaticSchedules(7);

    res.json({ success: true, message: "Bus added successfully", bus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error adding bus" });
  }
});

/** ✏️ Update Bus + Sync Schedules */
router.put("/:id",adminAuth, async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Parse JSON arrays if sent as strings
    ["seatConfigs", "routes", "amenities", "drivers", "boardingPoints", "droppingPoints"].forEach((key) => {
      if (updateData[key] && typeof updateData[key] === "string") {
        updateData[key] = JSON.parse(updateData[key]);
      }
    });

    const bus = await Bus.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    // ✅ Update all future schedules for this bus
    const now = new Date();
    const updateFields = {};

    if (bus.departureTime) updateFields.departureTime = bus.departureTime;
    if (bus.arrivalTime) updateFields.arrivalTime = bus.arrivalTime;
    if (bus.routes) updateFields.route = bus.routes[0];
    if (bus.totalSeats) updateFields.availableSeats = bus.totalSeats;
    if (bus.drivers) updateFields.drivers = bus.drivers;
    if (bus.boardingPoints) updateFields.boardingPoints = bus.boardingPoints;
    if (bus.droppingPoints) updateFields.droppingPoints = bus.droppingPoints;

    await Schedule.updateMany(
      { busId: bus._id, date: { $gte: now } },
      { $set: updateFields }
    );

    res.json({ success: true, message: "Bus updated and schedules synced", bus });
  } catch (err) {
    console.error("❌ Error updating bus:", err);
    res.status(500).json({ success: false, message: "Error updating bus" });
  }
});

/** 🗑️ Delete bus + its schedules */
router.delete("/:id",adminAuth, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    // 🧹 Delete all schedules for this bus
    const deleteResult = await Schedule.deleteMany({ busId: bus._id });

    // 🚌 Delete the bus itself
    await bus.deleteOne();

    res.json({
      success: true,
      message: `Bus and ${deleteResult.deletedCount} associated schedule(s) deleted successfully`,
    });
  } catch (err) {
    console.error("❌ Error deleting bus:", err);
    res.status(500).json({ success: false, message: "Error deleting bus" });
  }
});

// Get all routes (for HeroSection suggestions)
router.get("/routes",adminAuth, async (req, res) => {
  try {
    const schedules = await Schedule.find({});
    const origins = [...new Set(schedules.map((s) => s.route.from))];
    const destinations = [...new Set(schedules.map((s) => s.route.to))];
    res.json({ origins, destinations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Search buses by from, to, and date
router.get("/search",adminAuth, async (req, res) => {
  const { from, to, date } = req.query;

  if (!from || !to || !date) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  try {
    const buses = await Schedule.find({
  "route.from": { $regex: new RegExp(`^${from}$`, "i") },
  "route.to": { $regex: new RegExp(`^${to}$`, "i") },
  date,
}).populate("busId"); // if you want to return bus details too

    res.json(buses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/** 📋 Get all buses */
router.get("/", adminAuth, async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.json(buses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching buses" });
  }
});


/** 📌 Get single bus */
router.get("/:id", adminAuth, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.json(bus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching bus" });
  }
});

/**
 * 🗓 Generate schedules (daily + special)
 */
// 📅 Generate schedule for a specific bus (by number)
router.post("/generate-schedule", adminAuth, async (req, res) => {
  try {
    const { busNumber, date } = req.body;
    if (!busNumber || !date) return res.status(400).json({ message: "Bus number and date are required" });

    const bus = await Bus.findOne({ number: busNumber });
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const dateStr = new Date(date).toISOString().split("T")[0];
    const existing = await Schedule.findOne({ busId: bus._id, date: dateStr });
    if (existing) return res.status(400).json({ message: "Schedule already exists" });

    const route = bus.routes?.[0];
    if (!route) return res.status(400).json({ message: "No route found for this bus" });

    const schedule = new Schedule({
      busId: bus._id,
      busNumber: bus.number,
      date: dateStr,
      route,
      availableSeats: bus.totalSeats,
      amenities: bus.amenities,
      drivers: bus.drivers,
      boardingPoints: bus.boardingPoints,
      droppingPoints: bus.droppingPoints,
      special: bus.isSpecial,
      remarks: bus.remarks,
    });

    await schedule.save();
    res.json({ success: true, message: "Schedule generated successfully", schedule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error generating schedule" });
  }
});

// router.post("/generate-schedule", async (req, res) => {
//   try {
//     const { busNumber, date } = req.body;

//     if (!busNumber || !date) {
//       return res.status(400).json({ message: "Bus number and date are required" });
//     }

//     const bus = await Bus.findOne({ number: busNumber });
//     if (!bus) {
//       return res.status(404).json({ message: "Bus not found" });
//     }

//     const dateStr = new Date(date).toISOString().split("T")[0];

//     // Prevent duplicate schedule for same bus + date
//     const existing = await Schedule.findOne({ busId: bus._id, date: dateStr });
//     if (existing) {
//       return res.status(400).json({ message: "Schedule already exists for this date" });
//     }

//     const route = bus.routes?.[0];
//     if (!route) {
//       return res.status(400).json({ message: "No route found for this bus" });
//     }

//     const schedule = new Schedule({
//       busId: bus._id,
//       busNumber: bus.number, 
//       date: dateStr,
//       route,
//       availableSeats: bus.totalSeats,
//       special: bus.isSpecial,
//       remarks: bus.remarks,
//     });

//     await schedule.save();
//     res.json({ success: true, message: "Schedule generated successfully", schedule });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Error generating schedule" });
//   }
// });

/**
 * 📅 Get all schedules
 */
router.get("/schedules", adminAuth, async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("busId");
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching schedules" });
  }
});

export default router;
