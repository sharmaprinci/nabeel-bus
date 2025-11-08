import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  licenseNumber: String,
  experience: { type: Number, default: 0 },
});

const pointSchema = new mongoose.Schema({
  location: { type: String, required: true },
  landmark: String,
  time: String,
  contactPerson: String,
});

const scheduleSchema = new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  busNumber: { type: String, required: true },
  date: { type: String, required: true },
  route: { from: String, to: String },
  availableSeats: { type: Number, default: 0 },
  seatStatus: { type: Object, default: {} },
  amenities: {
    type: [String],
    default: [],
  },

  // 🧍‍♂️ Driver for that trip (could change per day)
  drivers: [driverSchema],

  // 🅿️ Boarding & Dropping Points (specific to this date/trip)
  boardingPoints: [pointSchema],
  droppingPoints: [pointSchema],

  // 🛠️ Additional operational info
  conductorName: String,
  conductorPhone: String,
  vehicleStatus: {
    type: String,
    enum: ["On-Time", "Delayed", "Cancelled"],
    default: "On-Time",
  },
  special: { type: Boolean, default: false },
  remarks: String,

  createdAt: { type: Date, default: Date.now },
});

scheduleSchema.index({ busId: 1, date: 1 }, { unique: true });

export default mongoose.model("Schedule", scheduleSchema);

// import mongoose from "mongoose";

// const scheduleSchema = new mongoose.Schema({
//   busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
//   busNumber: { type: String, required: true },  // 🆕 new field
//   date: { type: String, required: true },
//   route: { from: String, to: String },
//   availableSeats: { type: Number, default: 0 },
//   seatStatus: { type: Object, default: {} },
//   amenities: {
//     type: [String], // e.g. ['wifi', 'charging', 'water', 'blanket']
//     default: [],
//   },
//   special: { type: Boolean, default: false },
//   remarks: { type: String }
  
// });


// scheduleSchema.index({ busId: 1, date: 1 }, { unique: true });

// export default mongoose.model("Schedule", scheduleSchema);
