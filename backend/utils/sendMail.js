// backend/utils/email.js
import  Booking  from "../models/Booking.js";
import  Schedule  from "../models/Schedule.js";
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { generateTicketPDF } from "../utils/ticketGenerator.js";

/**
 * 📧 Configure SMTP transporter
 * Works with Titan Email, Brevo, Gmail, etc.
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
  // logger: true, // ✅ add this
  // debug: true,  // ✅ add this
});

transporter.verify((err, success) => {
  if (err) console.error("❌ Email connection failed:", err.message);
  else console.log("✅ Email service connected via GoDaddy SMTP");
});

// ✅ Universal reusable mail function
export const sendEmail = async ({ to, subject, html, attachments }) => {
  try {
    if (!to) {
      console.error("❌ Email not sent: No recipient provided.");
      return;
    }

    const mailOptions = {
      from: `"Nabeel Bus Service" <${process.env.EMAIL_USER}>`,
      to,
      subject: subject || "(No subject)",
      html: html || "<p>No content</p>",
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}:`, info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    throw err;
  }
};

/**
 * 🔐 Password reset email
 */
export const sendResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const html = `
    <div style="font-family:Arial, sans-serif;color:#333;">
      <h2 style="color:#007bff;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>You requested a password reset. Click below to set a new password:</p>
      <a href="${resetUrl}" 
        style="background:#007bff;color:#fff;padding:10px 15px;text-decoration:none;border-radius:4px;display:inline-block;">
        Reset Password
      </a>
      <p>This link expires in 15 minutes.</p>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    </div>
  `;
  await sendEmail({
    to: email,
    subject: "Password Reset Request",
    html,
  });

};

/**
 * 🎫 Ticket confirmation email
 */

export const sendTicketEmail = async (to, booking) => {
  try {
    // ✅ 1. Ensure booking is fully populated
    let fullBooking = booking;

    if (!booking.scheduleId?.busId || !booking.scheduleId?.route) {
      fullBooking = await Booking.findById(booking._id)
        .populate({
          path: "scheduleId",
          populate: [
            {
              path: "busId",
              populate: ["drivers", "boardingPoints", "droppingPoints", "routes"],
            },
            { path: "route" },
          ],
        })
        .lean();
    }

    const schedule = fullBooking.scheduleId || {};
    const bus = schedule.busId || {};
    const route = schedule.route || {};
    const driver = bus.drivers?.[0];
    const boarding = bus.boardingPoints?.[0];
    const dropping = bus.droppingPoints?.[0];

    // ✅ 2. Passenger & trip data
    const passengerNames =
      fullBooking.passengers?.map((p) => p.name).join(", ") || "Passenger(s)";
    const seatLabels =
      fullBooking.passengers?.map((p) => p.seatLabel).join(", ") || "N/A";
    const travelDate = schedule.date
      ? new Date(schedule.date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

    // ✅ 3. Generate ticket PDF (in-memory)
    const pdfBuffer = await generateTicketPDF(fullBooking);

    // ✅ 4. Build beautiful email
    const html = `
      <div style="font-family:Arial, sans-serif; color:#333;">
        <h2 style="color:#004AAD;">🎫 Your Bus Ticket - Nabeel Bus Service</h2>
        <p>Dear <strong>${passengerNames}</strong>,</p>

        <p>Your trip from <strong>${route.from || "N/A"}</strong> 
        to <strong>${route.to || "N/A"}</strong> has been confirmed.</p>

        <table style="border-collapse:collapse;margin-top:15px;">
          <tr><td><strong>Bus Name:</strong></td><td>${bus.name || "Nabeel Bus"}</td></tr>
          <tr><td><strong>Bus Number:</strong></td><td>${bus.number || "N/A"}</td></tr>
          <tr><td><strong>Travel Date:</strong></td><td>${travelDate}</td></tr>
          <tr><td><strong>Seat(s):</strong></td><td>${seatLabels}</td></tr>
          <tr><td><strong>Total Fare:</strong></td><td>₹${fullBooking.totalAmount}</td></tr>
        </table>

        <hr style="margin:20px 0;"/>

        <h3 style="color:#004AAD;">🧑‍✈️ Driver & Boarding Details</h3>
        <table style="border-collapse:collapse;">
          <tr><td><strong>Driver Name:</strong></td><td>${driver?.name || "N/A"}</td></tr>
          <tr><td><strong>Driver Contact:</strong></td><td>${driver?.phone || "N/A"}</td></tr>
          <tr><td><strong>Boarding Point:</strong></td><td>${boarding?.location || "N/A"}</td></tr>
          <tr><td><strong>Boarding Time:</strong></td><td>${boarding?.time || "N/A"}</td></tr>
          <tr><td><strong>Dropping Point:</strong></td><td>${dropping?.location || "N/A"}</td></tr>
          <tr><td><strong>Dropping Time:</strong></td><td>${dropping?.time || "N/A"}</td></tr>
        </table>

        <p style="margin-top:20px;">
          Please find your ticket attached as a PDF below.
        </p>
        <p style="margin-top:20px;">Thank you for booking with <strong>Nabeel Bus Service</strong>!</p>
        <hr/>
        <small>This is an automated email. Please do not reply.</small>
      </div>
    `;

    // ✅ 5. Send email with PDF buffer attachment
    const mailOptions = {
      from: `"Nabeel Bus Service" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🎫 Your Bus Ticket - Nabeel Bus Service",
      html,
      attachments: [
        {
          filename: `Ticket_${fullBooking._id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    console.log(`📧 Sending ticket email to: ${to}`);
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Ticket email sent successfully:", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("❌ Failed to send ticket email:", err);
    return { success: false, error: err.message };
  }
};

/**
 * 📬 Contact / Support email
 */
export const sendContactEmail = async ({ to, subject, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Support Team" <${
        process.env.EMAIL_FROM || process.env.EMAIL_USER
      }>`,
      to,
      subject,
      text,
    });
    console.log("✅ Contact email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Error sending contact email:", err);
    throw err;
  }
};
