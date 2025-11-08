import mongoose from "mongoose";
import dotenv from "dotenv";
import Bus from "./models/Bus.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nabeelBus";

const buses = [
  new Bus({
    name: "Nabeel Bus",
    number: "UP 27 CT 9292",
    acType: "AC",
    totalSeats: 38,
    alternating: true,
    routes: [
      { from: "Bareilly", to: "Delhi" },
      { from: "Delhi", to: "Bareilly" }
    ],
    seatConfigs: [
    { type: "sleeper", category: "single", deck: "upper", total: 5 },
    { type: "sleeper", category: "single", deck: "lower", total: 5 },
    { type: "sleeper", category: "double", deck: "upper", total: 5 },
    { type: "sleeper", category: "double", deck: "lower", total: 1 },
    { type: "seater", category: "single", deck: null, total: 16 },
  ]
  }),
  new Bus({
    name: "Nabeel Bus",
    number: "UP 27 CT 9494",
    acType: "AC",
    totalSeats: 38,
    alternating: true,
    routes: [
      { from: "Bareilly", to: "Delhi" },
      { from: "Delhi", to: "Bareilly" }
    ],
    seatConfigs: [
    { type: "sleeper", category: "single", deck: "upper", total: 5 },
    { type: "sleeper", category: "single", deck: "lower", total: 5 },
    { type: "sleeper", category: "double", deck: "upper", total: 5 },
    { type: "sleeper", category: "double", deck: "lower", total: 1 },
    { type: "seater", category: "double", deck: "lower", total: 16 },
  ]
  })
];

const seedBuses = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    // Remove existing buses if needed
    // await Bus.deleteMany({});

    await Bus.insertMany(buses);
    console.log("Buses added successfully");

    mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding buses:", err);
    mongoose.disconnect();
  }
};

seedBuses();
