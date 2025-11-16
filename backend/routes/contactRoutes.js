
import express from "express";
import Contact from "../models/Contact.js";
import adminAuth from "../middleware/adminAuth.js";
import  { sendContactEmail } from "../utils/sendMail.js"; // Optional if you want email replies

const router = express.Router();

/** ✉️ Create a new contact message (Public) */
router.post("/add", async (req, res) => {
  try {
    const { name, email, mobile, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All required fields must be filled." });
    }

    const contact = new Contact({ name, email, mobile, subject, message });
    await contact.save();

    res.json({
      success: true,
      message: "Your message has been submitted successfully!",
    });
  } catch (err) {
    console.error("❌ Contact error:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

/** 📬 Get all contact messages (Admin only) */
router.get("/all", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "all" } = req.query;

    const query = {};
    if (status !== "all") query.status = status;

    if (search) {
      query.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { subject: new RegExp(search, "i") },
        { message: new RegExp(search, "i") },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Contact.countDocuments(query);

    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      messages,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/** 💬 Admin sends a reply to a user message (threaded replies) */
router.post("/reply", adminAuth, async (req, res) => {
  try {
    const { messageId, reply } = req.body;

    if (!messageId || !reply) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const message = await Contact.findById(messageId);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    // ✅ Add new reply to replies array
    message.replies.push({
      sender: "admin",
      content: reply,
      timestamp: new Date(),
    });

    // Optionally mark as resolved
    message.status = "resolved";

    await message.save();

    // Optional Email Notification to User
    
    await sendContactEmail({
      to: message.email,
      subject: `Reply to your message: ${message.subject}`,
      text: reply,
    });
    

    res.json({
      success: true,
      message: "Reply added successfully",
      replies: message.replies,
    });
  } catch (err) {
    console.error("❌ Reply error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

/** 🔁 Update message status */
router.patch("/:id", adminAuth, async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, message: "Status updated", updated });
  } catch (err) {
    console.error("❌ Status update error:", err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

/** 🗑️ Delete a message */
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

export default router;

