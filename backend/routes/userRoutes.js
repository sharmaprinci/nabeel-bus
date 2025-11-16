import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";
import Agent from "../models/Agent.js";
import bcrypt from "bcryptjs";

const router = express.Router();

/**
 * ✅ GET Unified Profile (works for both user & agent)
 */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    let profile = null;

    if (req.user.role === "agent") {
      profile = await Agent.findById(req.user.id).select("-password");
    } else {
      profile = await User.findById(req.user.id).select("-password");
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ PUT Update Unified Profile (works for both user & agent)
 */
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const Model = req.user.role === "agent" ? Agent : User;
    const profile = await Model.findById(req.user.id);

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // Common fields
    profile.name = req.body.name || profile.name;
    profile.mobile = req.body.mobile || profile.mobile;
    profile.city = req.body.city || profile.city;

    // Agent-only field
    if (req.user.role === "agent") {
      profile.companyName = req.body.companyName || profile.companyName;
      profile.phone = req.body.phone || profile.phone;
    }

    // Update password if provided
    if (req.body.password) profile.password = req.body.password;

    const updatedProfile = await profile.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedProfile._id,
        name: updatedProfile.name,
        email: updatedProfile.email,
        mobile: updatedProfile.mobile,
        city: updatedProfile.city,
        ...(req.user.role === "agent" && {
          phone: updatedProfile.phone,
          companyName: updatedProfile.companyName,
        }),
        createdAt: updatedProfile.createdAt,
        updatedAt: updatedProfile.updatedAt,
      },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both old and new password are required" });
    }

    // Detect whether it's a user or an agent
    const isAgent = req.user.role === "agent";
    const Model = isAgent ? Agent : User;

    // Find the correct account
    const account = await Model.findById(req.user.id);
    if (!account)
      return res.status(404).json({ message: `${isAgent ? "Agent" : "User"} not found` });

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, account.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    // Save new password (hash automatically if schema has pre-save hook)
    account.password = newPassword;
    await account.save();

    res.json({
      message: "✅ Password changed successfully",
      role: isAgent ? "agent" : "user",
    });
  } catch (err) {
    console.error("❌ Change password error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
