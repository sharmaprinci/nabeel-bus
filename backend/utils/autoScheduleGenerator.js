import dotenv from "dotenv";
import Bus from "../models/Bus.js";
import Schedule from "../models/Schedule.js";


dotenv.config();


const BOOKING_WINDOW_DAYS = parseInt(process.env.BOOKING_WINDOW_DAYS) || 60;

/**
 * 🪑 Helper: Generate initial seatStatus object
 * based on bus.seatConfigs
 * 
 * 0 → available ✅
 * 1 → booked ❌
 * 2 → locked ⏳
 */
const generateSeatStatusFromBus = (bus) => {
  const seatStatus = {};
  let seatCounter = 0;

  if (!bus.seatConfigs || bus.seatConfigs.length === 0) {
    console.warn(`⚠️ No seat configuration found for bus ${bus.number}`);
    return seatStatus;
  }

  for (const config of bus.seatConfigs) {
    const { type, category, deck, total } = config;

    for (let i = 0; i < total; i++) {
      const seatKey = `${type}_${deck || "none"}_${category || "single"}_${i}`;
      seatStatus[seatKey] = 0; // ✅ 0 = available
      seatCounter++;
    }
  }

  console.log(`🪑 Generated ${seatCounter} available seats for bus ${bus.number}`);
  return seatStatus;
};


 /*🚍 Determine correct route for a bus based on index + day parity
 */
const getRouteForBus = (bus, index, isEvenDay) => {
  const baseRoute = bus.routes || [];
  if (baseRoute.length < 2) return null;

  // Even day → even index uses route[0], odd index uses route[1]
  // Odd day  → even index uses route[1], odd index uses route[0]
  return isEvenDay
    ? baseRoute[index % 2 === 0 ? 0 : 1]
    : baseRoute[index % 2 === 0 ? 1 : 0];
};

/**
 * 🚌 Generate schedules for a range of days starting from today
 */
export const generateAutomaticSchedules = async (daysAhead = BOOKING_WINDOW_DAYS) => {
  const today = new Date();
  const regularBuses = await Bus.find({ alternating: true, active: true }).sort({ priority: 1, _id: 1 });
  const specialBuses = await Bus.find({ isSpecial: true, active: true });

  for (let i = 0; i <= daysAhead; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + i);
    const dateStr = targetDate.toISOString().split("T")[0];

    const isEvenDay =
      Math.floor(
        (targetDate - new Date(targetDate.getFullYear(), 0, 1)) /
          (1000 * 60 * 60 * 24)
      ) %
        2 ===
      0;

    const schedules = [];

    // 🚌 Regular buses — alternate per bus index
    for (let index = 0; index < regularBuses.length; index++) {
      const bus = regularBuses[index];
      const route = getRouteForBus(bus, index, isEvenDay);
      if (!route) continue;

      const exists = await Schedule.findOne({ busId: bus._id, date: dateStr });
      if (!exists) {
        schedules.push({
          busId: bus._id,
          busNumber: bus.number,
          date: dateStr,
          route,
          availableSeats: bus.totalSeats,
          seatStatus: generateSeatStatusFromBus(bus),
          departureTime: bus.departureTime,   // ⏰ Added
  arrivalTime: bus.arrivalTime,       // ⏰ Added
          special: false,
          remarks: bus.remarks,
        });
      }
    }

    // 🚌 Special buses
    for (const bus of specialBuses) {
      const route = bus.routes[0];
      const exists = await Schedule.findOne({ busId: bus._id, date: dateStr });
      if (!exists) {
        schedules.push({
          busId: bus._id,
          busNumber: bus.number,
          date: dateStr,
          route,
          availableSeats: bus.totalSeats,
          seatStatus: generateSeatStatusFromBus(bus),
          special: true,
          remarks: bus.remarks,
        });
      }
    }

    if (schedules.length) {
      await Schedule.insertMany(schedules);
      console.log(`✅ ${schedules.length} schedules created for ${dateStr}`);
    }
  }
};

/**
 * 🕛 Generate schedules for a specific date (used by cron)
 */
export const generateScheduleForDate = async (targetDate) => {
  const regularBuses = await Bus.find({ alternating: true, active: true }).sort({ priority: 1, _id: 1 });
  const specialBuses = await Bus.find({ isSpecial: true, active: true });

  const dateStr = targetDate.toISOString().split("T")[0];
  const isEvenDay =
    Math.floor(
      (targetDate - new Date(targetDate.getFullYear(), 0, 1)) /
        (1000 * 60 * 60 * 24)
    ) %
      2 ===
    0;

  const schedules = [];

  // 🚌 Regular buses — alternate per bus index
  for (let index = 0; index < regularBuses.length; index++) {
    const bus = regularBuses[index];
    const route = getRouteForBus(bus, index, isEvenDay);
    if (!route) continue;

    const exists = await Schedule.findOne({ busId: bus._id, date: dateStr });
    if (!exists) {
      schedules.push({
        busId: bus._id,
        busNumber: bus.number,
        date: dateStr,
        route,
        availableSeats: bus.totalSeats,
        seatStatus: generateSeatStatusFromBus(bus),
        special: false,
        remarks: bus.remarks,
      });
    }
  }

  // 🚌 Special buses
  for (const bus of specialBuses) {
    const route = bus.routes[0];
    const exists = await Schedule.findOne({ busId: bus._id, date: dateStr });
    if (!exists) {
      schedules.push({
        busId: bus._id,
        busNumber: bus.number,
        date: dateStr,
        route,
        availableSeats: bus.totalSeats,
        seatStatus: generateSeatStatusFromBus(bus),
        special: true,
        remarks: bus.remarks,
      });
    }
  }

  if (schedules.length) {
    await Schedule.insertMany(schedules);
    console.log(`✅ ${schedules.length} schedules created for ${dateStr}`);
  }
};