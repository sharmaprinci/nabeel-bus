import express from "express";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import crypto from "crypto";
import { sendResetEmail } from "../utils/sendMail.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, mobile, city } = req.body;

    if (!name || !email || !password || !mobile || !city) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, mobile, city });
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        city: user.city,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({ message: "mobile number and password are required" });
    }

    const user = await User.findOne({ mobile });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid mobile number or password" });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        city: user.city,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============== EXAMPLE PROTECTED ROUTE =================
router.get("/profile", (req, res) => {
  res.json({ message: "This is a protected route!" });
});

router.post("/request-password-reset", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account with this email" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    await sendResetEmail(email, token);
    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send reset link." });
  }
});

router.get("/verify-reset-token/:token", async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  res.json({ message: "Valid token" });
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // ❌ Remove manual hash
    // user.password = await bcrypt.hash(password, 10);

    // ✅ Just set the new password (pre-save hook will hash it)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reset password" });
  }
});


export default router;
