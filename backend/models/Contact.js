import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "admin"], default: "admin" },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: {
      type: String,
      enum: ["new", "resolved"],
      default: "new",
    },
    replies: [replySchema],
  createdAt: { type: Date, default: Date.now },
},{ timestamps: true });

export default mongoose.model("Contact", contactSchema);
