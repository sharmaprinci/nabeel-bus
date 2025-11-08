// backend/models/Testimonial.js
import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    message: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    location: { type: String },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;
