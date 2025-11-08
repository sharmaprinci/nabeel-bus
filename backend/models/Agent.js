import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  company: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  role: { type: String, default: "agent" },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
agentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("Agent", agentSchema);
