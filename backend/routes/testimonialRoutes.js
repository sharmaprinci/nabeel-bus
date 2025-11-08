// backend/routes/testimonialRoutes.js
import express from "express";
import Testimonial from "../models/Testimonials.js";

const router = express.Router();

// GET all testimonials
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new testimonial
router.post("/", async (req, res) => {
  try {
    const { name, message, rating, location } = req.body;
    const testimonial = new Testimonial({ name, message, rating, location });
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
