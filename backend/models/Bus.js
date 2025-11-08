import mongoose from "mongoose";

const seatConfigSchema = new mongoose.Schema({
  type: { type: String, enum: ["seater", "sleeper"], required: true },
  category: { type: String, enum: ["single", "double", null], default: null },
  deck: { type: String, enum: ["upper", "lower", null], default: null },
  total: { type: Number, required: true },
  fare: Number,
});

const routeSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
});

// 🧍‍♂️ Driver Info Schema
const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String },
  experience: { type: Number, default: 0 }, // years
  address: String,
  emergencyContact: String,
  photoUrl: String, // optional driver photo
});

const busSchema = new mongoose.Schema({
  name: String,
  number: { type: String, unique: true, required: true },
  acType: { type: String, enum: ["AC", "Non-AC"], default: "AC" },
  totalSeats: Number,
  seatLayout: String,
  seatConfigs: [seatConfigSchema],
  amenities: {
    type: [String],
    default: [],
  },
  routes: [routeSchema],
  alternating: { type: Boolean, default: true },
  isSpecial: { type: Boolean, default: false },
  pairBusId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", default: null },
  specialDates: [String],
  remarks: String,
  active: { type: Boolean, default: true },
  priority: { type: Number, default: 0 },
  departureTime: { type: String, default: "10:00" },
  arrivalTime: { type: String, default: "04:00" },

  // 🧑‍✈️ Driver details (can be one or multiple drivers)
  drivers: [driverSchema],

  // 🅿️ Common boarding & pickup points (used in schedules too)
  boardingPoints: [
    {
      location: { type: String, required: true },
      landmark: String,
      time: String,
      contactPerson: String,
    },
  ],
  droppingPoints: [
    {
      location: { type: String, required: true },
      landmark: String,
      time: String,
      contactPerson: String,
    },
  ],

  // Optional admin fields
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model("Bus", busSchema);

// import mongoose from "mongoose";

// const seatConfigSchema = new mongoose.Schema({
//   type: { type: String, enum: ["seater", "sleeper"], required: true },
//   category: { type: String, enum: ["single", "double", null], default: null },
//   deck: { type: String, enum: ["upper", "lower", null], default: null },
//   total: { type: Number, required: true },
//   fare: Number, // 🆕 fare based on this seat type
// });

// const routeSchema = new mongoose.Schema({
//   from: { type: String, required: true },
//   to: { type: String, required: true }
// });

// const busSchema = new mongoose.Schema({
//   name: String,
//   number: { type: String, unique: true },
//   acType: { type: String, enum: ["AC", "Non-AC"], default: "AC" },
//   totalSeats: Number,
//   seatLayout: String,
//   seatConfigs: [seatConfigSchema],
//   // 🆕 Dynamic amenities field
//   amenities: {
//     type: [String], // e.g. ['wifi', 'charging', 'water', 'blanket']
//     default: [],
//   },
//   routes: [routeSchema],
//   alternating: { type: Boolean, default: true },   // 🚦 for automatic schedule
//   isSpecial: { type: Boolean, default: false },    // 🆕 special bus flag
//   pairBusId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", default: null },
//   specialDates: [String],
//   remarks: String,
//   active: { type: Boolean, default: true },
//   priority: { type: Number, default: 0 },
//   departureTime: { type: String, default: "10:00" },  // 🆕
//   arrivalTime: { type: String, default: "04:00" },    // 🆕
// });

// export default mongoose.model("Bus", busSchema);
