// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";
// import QRCode from "qrcode"; // 📦 npm install qrcode

// export const generateTicketPDF = async (booking) => {
//   // Ensure tickets folder exists
//   if (!fs.existsSync("tickets")) fs.mkdirSync("tickets");

//   const doc = new PDFDocument({ margin: 50 });
//   const filePath = path.join("tickets", `Ticket_${booking._id}.pdf`);
//   const stream = fs.createWriteStream(filePath);
//   doc.pipe(stream);

//   // Generate QR code link (to Cloudinary or app)
//   const qrData = `https://nabeelbus.com/ticket/${booking._id}`;
//   const qrImage = await QRCode.toDataURL(qrData);

//   // ================== 🚌 HEADER ==================
//   doc
//     .fontSize(22)
//     .fillColor("#1E88E5")
//     .text("🚌 Nabeel Bus Service", { align: "center" })
//     .moveDown(0.2);

//   doc
//     .fontSize(12)
//     .fillColor("black")
//     .text("support@nabeelbus.com | +91-9876543210", { align: "center" })
//     .moveDown(1.2);

//   // Draw a line
//   doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#CCCCCC").stroke();
//   doc.moveDown(1);

//   // ================== 🧾 BOOKING DETAILS ==================
//   doc.fontSize(14).fillColor("#1E88E5").text("Booking Details", { underline: true });
//   doc.moveDown(0.5);
//   doc.fontSize(12).fillColor("black");
//   doc.text(`Booking ID: ${booking._id}`);
//   doc.text(`Date of Issue: ${new Date().toLocaleString()}`);
//   doc.text(`Booked By: ${booking.bookedBy.toUpperCase()}`);
//   doc.text(`Status: ${booking.status === "booked" ? "✅ Confirmed" : "⏳ Pending"}`);
//   doc.moveDown(1);

//   // ================== 🛣️ TRIP INFORMATION ==================
// // ================== 🛣️ TRIP INFORMATION ==================
// const trip = booking.schedule || booking.scheduleId || {};
// const bus = booking.bus || trip.busId || {};

// doc.fontSize(14).fillColor("#1E88E5").text("Trip Information", { underline: true });
// doc.moveDown(0.5);
// doc.fontSize(12).fillColor("black");

// doc.text(`Bus Name: ${bus.name || "N/A"}`);
// doc.text(`Bus Number: ${bus.number || "N/A"}`);
// doc.text(`Route: ${trip.route?.from || "—"} → ${trip.route?.to || "—"}`);
// doc.text(`Travel Date: ${new Date(trip.date).toLocaleDateString()}`);
// doc.text(`Departure Time: ${bus.departureTime || "—"}`);
// doc.text(`Arrival Time: ${bus.arrivalTime || "—"}`);
// doc.moveDown(1);

// // ================== 🚏 Boarding & Dropping ==================
// doc.fontSize(14).fillColor("#1E88E5").text("Boarding & Dropping Points", { underline: true });
// doc.moveDown(0.5);
// doc.fontSize(12).fillColor("black");
// doc.text(`Boarding: ${bus.boardingPoints?.[0]?.location || "—"} at ${bus.boardingPoints?.[0]?.time || "—"}`);
// doc.text(`Dropping: ${bus.droppingPoints?.[0]?.location || "—"} at ${bus.droppingPoints?.[0]?.time || "—"}`);
// doc.moveDown(1);

// // ================== 🧑‍✈️ Driver Details ==================
// if (bus.drivers?.length) {
//   const driver = bus.drivers[0];
//   doc.fontSize(14).fillColor("#1E88E5").text("Driver Details", { underline: true });
//   doc.moveDown(0.5);
//   doc.fontSize(12).fillColor("black");
//   doc.text(`Name: ${driver.name}`);
//   doc.text(`Phone: ${driver.phone}`);
//   doc.text(`License: ${driver.licenseNumber}`);
//   doc.text(`Experience: ${driver.experience} years`);
//   doc.moveDown(1);
// }

//   // ================== 👥 PASSENGER TABLE ==================
//   doc.fontSize(14).fillColor("#1E88E5").text("Passenger Details", { underline: true });
//   doc.moveDown(0.5);

//   const tableTop = doc.y;
//   const startX = 50;
//   const colWidths = [30, 150, 80, 80, 80];

//   // Table Header
//   doc.fontSize(12).fillColor("white").rect(startX, tableTop, 480, 20).fill("#1E88E5");
//   doc
//     .fillColor("white")
//     .text("#", startX + 5, tableTop + 4)
//     .text("Name", startX + 35, tableTop + 4)
//     .text("Gender", startX + 185, tableTop + 4)
//     .text("Seat", startX + 265, tableTop + 4)
//     .text("Fare", startX + 345, tableTop + 4);

//   // Table Rows
//   let y = tableTop + 25;
//   doc.fontSize(11).fillColor("black");
//   booking.passengers.forEach((p, i) => {
//     doc
//       .text(i + 1, startX + 5, y)
//       .text(p.name, startX + 35, y)
//       .text(p.gender || "—", startX + 185, y)
//       .text(p.seatLabel || "—", startX + 265, y)
//       .text(`₹${p.fare}`, startX + 345, y);
//     y += 20;
//   });

//   doc.moveDown(2);

//   // ================== 💰 PAYMENT SUMMARY ==================
//   doc.fontSize(14).fillColor("#1E88E5").text("Payment Summary", { underline: true });
//   doc.moveDown(0.5);
//   doc.fontSize(12).fillColor("black");
//   doc.text(`Total Fare: ₹${booking.totalAmount}`);
//   doc.text(`Payment Status: ${booking.paid ? "Paid ✅" : "Pending ❌"}`);
//   if (booking.paymentId) doc.text(`Payment ID: ${booking.paymentId}`);
//   doc.moveDown(1);

//   // ================== 🔗 QR CODE ==================
//   const qrX = 230;
//   const qrY = doc.y;
//   doc.image(qrImage, qrX, qrY, { width: 100, height: 100 });
//   doc.text("Scan to view your ticket online", qrX - 20, qrY + 110, { align: "center" });
//   doc.moveDown(6);

//   // ================== FOOTER ==================
//   doc.fontSize(10).fillColor("gray");
//   doc.text("Thank you for choosing Nabeel Bus Service!", { align: "center" });
//   doc.text("For help, contact support@nabeelbus.com or WhatsApp us.", { align: "center" });

//   doc.end();

//   // Wait for file to finish writing
//   return new Promise((resolve, reject) => {
//     stream.on("finish", () => resolve(filePath));
//     stream.on("error", reject);
//   });
// };


// import pdf from "html-pdf-node";
// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";
// import QRCode from "qrcode";
// import htmlPdf from "html-pdf-node";
// import nodemailer from "nodemailer";
// import Booking from "../models/Booking.js";
// import Bus from "../models/Bus.js";
// import Schedule from "../models/Schedule.js";
// import dotenv from "dotenv";
// dotenv.config();
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// import "../models/Schedule.js";
// import "../models/Bus.js";

// import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config(); // Load .env variables

// // 🧠 Connect to MongoDB manually
// await mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// console.log("✅ Connected to MongoDB");

// export const generateTicketPDF = async (booking) => {
//   if (!fs.existsSync("tickets")) fs.mkdirSync("tickets");

//   const doc = new PDFDocument({ margin: 40 });
// const filePath = path.join("tickets", `Ticket_${String(booking._id)}.pdf`);
//   const stream = fs.createWriteStream(filePath);
//   doc.pipe(stream);

// const qrData = `https://nabeelbus.com/ticket/${String(booking._id)}`;

//   const qrImage = await QRCode.toDataURL(qrData);

//   const blue = "#004AAD";
//   const gray = "#f5f5f5";

//   // ================= HEADER =================
//   doc.rect(0, 0, doc.page.width, 65).fill(blue);
//   doc
//     .fillColor("white")
//     .fontSize(18)
//     .text("Nabeel Bus Service Ticket Information", 50, 25);
//   doc
//     .fontSize(11)
//     .text("Bareilly (Uttar Pradesh) → Delhi", 50, 45)
//     .text("support@nabeelbus.com | +91-9876543210", 350, 45);

//   doc.moveDown(2.5);

//   // ================= BOOKING INFO =================
//   doc.fillColor("black").fontSize(11);
// doc.text(`Ticket Number: TKT${String(booking._id)}`);
// doc.text(`PNR No: ${String(booking._id).slice(-8)}`);
// doc.moveDown(0.8);
// doc.text(
//   `Thank you for booking your bus with Nabeel Bus Service. Below are the ticket details for your upcoming trip.`,
//   { align: "left" }
// );

//   doc.moveDown(1);

//   // ================= TICKET DETAILS BOX =================
//   doc.rect(40, doc.y, 520, 22).fill(gray).stroke(gray);
//   doc
//     .fillColor(blue)
//     .fontSize(13)
//     .text("Ticket Details", 50, doc.y - 17, { bold: true });
//   doc.moveDown(2);

//   const trip = booking.scheduleId || {};
//   const bus = trip.busId || {};
//   const route = trip.route || {};

//   doc.fillColor("black").fontSize(11);
//   doc.text(`Journey Date & Time: ${new Date(trip.date).toLocaleString()}`);
//   doc.text(`Travels: ${bus.name || "Nabeel Bus"}`);
//   doc.text(`Bus Type: ${bus.type || "A/C Seater / Sleeper"}`);
//   doc.text(`Ticket Price: ₹${booking.totalAmount || 0}`);
//   doc.moveDown(1);

//   // Boarding & Dropping Points
//   doc.text(`Boarding Point: ${bus.boardingPoints?.[0]?.location || "—"}`);
//   doc.text(`Dropping Point: ${bus.droppingPoints?.[0]?.location || "—"}`);
//   doc.moveDown(1);

//   // Passenger Details
//   doc.text("Passenger Details", { underline: true, fill: blue });
//   doc.moveDown(0.5);

//   const startX = 50;
//   const tableTop = doc.y;
//   const tableWidth = 480;

//   doc
//     .fillColor(blue)
//     .rect(startX, tableTop, tableWidth, 20)
//     .fill(blue)
//     .fillColor("white")
//     .fontSize(11)
//     .text("Name", startX + 10, tableTop + 5)
//     .text("Gender", startX + 150, tableTop + 5)
//     .text("Seat No", startX + 240, tableTop + 5)
//     .text("Fare", startX + 330, tableTop + 5);

//   let y = tableTop + 25;
//   doc.fillColor("black");
//   booking.passengers.forEach((p) => {
//     doc
//       .text(p.name, startX + 10, y)
//       .text(p.gender || "—", startX + 150, y)
//       .text(p.seatLabel || "—", startX + 240, y)
//       .text(`₹${p.fare}`, startX + 330, y);
//     y += 18;
//   });

//   doc.moveDown(2);

//   // ================= PAYMENT =================
//   doc.rect(40, doc.y, 520, 22).fill(gray);
//   doc
//     .fillColor(blue)
//     .fontSize(13)
//     .text("Payment Summary", 50, doc.y - 17);
//   doc.moveDown(2);

//   doc.fillColor("black").fontSize(11);
//   doc.text(`Total Fare: ₹${booking.totalAmount}`);
//   doc.text(`Payment Status: ${booking.paid ? "Paid ✅" : "Pending ❌"}`);
//   if (booking.paymentId) doc.text(`Payment ID: ${booking.paymentId}`);
//   doc.moveDown(2);

//   // ================= QR CODE =================
//   doc.image(qrImage, 250, doc.y, { width: 100, height: 100 });
//   doc.fontSize(10).fillColor("gray");
//   doc.text("Scan to view your ticket online", 0, doc.y + 110, {
//     align: "center",
//   });
//   doc.moveDown(3);

//   // ================= CANCELLATION POLICY =================
//   doc.rect(40, doc.y, 520, 22).fill(gray);
//   doc
//     .fillColor(blue)
//     .fontSize(13)
//     .text("Cancellation Policy", 50, doc.y - 17);
//   doc.moveDown(2);

//   doc.fontSize(10).fillColor("black");
//   doc.text(
//     "Your current cancellation charges according to the policy are highlighted below:",
//     { align: "left" }
//   );

//   const policyTop = doc.y + 5;
//   doc.rect(40, policyTop, 520, 60).stroke("#cccccc");
//   doc
//     .fontSize(9)
//     .fillColor("black")
//     .text("Before 30th Sep 06:15 AM - ₹0 (0%)", 50, policyTop + 10)
//     .text("After 30th Sep & Before 7th Oct - ₹122.01 (25%)", 50, policyTop + 25)
//     .text("After 7th Oct & Before 12th Oct - ₹244.02 (50%)", 50, policyTop + 40)
//     .text("After 12th Oct & Before 14th Oct - ₹366.03 (75%)", 50, policyTop + 55);

//   doc.moveDown(6);

//   // ================= TERMS & CONDITIONS =================
//   doc.rect(40, doc.y, 520, 22).fill(gray);
//   doc.fillColor(blue).fontSize(13).text("Terms and Conditions", 50, doc.y - 17);
//   doc.moveDown(2);

//   doc.fontSize(9).fillColor("black");
//   doc.text(
//     "1. Nabeel Bus Service is an online ticketing platform and does not operate bus services of its own."
//   );
//   doc.text(
//     "2. Nabeel Bus Service acts as a facilitator for bus operators to provide booking, refund, and support."
//   );
//   doc.text(
//     "3. Passengers must carry a valid e-ticket or m-ticket along with government ID proof."
//   );
//   doc.text(
//     "4. Departure and arrival timings are tentative and may vary due to traffic or weather."
//   );
//   doc.text(
//     "5. Cancellation and refund policies are subject to bus operator terms."
//   );
//   doc.text(
//     "6. Grievances must be reported within 7 days of the travel date to support@nabeelbus.com."
//   );

//   doc.moveDown(2);
//   doc.fontSize(10).fillColor("gray");
//   doc.text("For support, contact: support@nabeelbus.com", {
//     align: "center",
//   });

//   doc.end();

//   return new Promise((resolve, reject) => {
//     stream.on("finish", () => resolve(filePath));
//     stream.on("error", reject);
//   });
// };


import QRCode from "qrcode";
import pdf from "html-pdf-node";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Booking from "../models/Booking.js";
import "../models/Bus.js";
import "../models/Schedule.js";
dotenv.config();

/**
 * Generate Nabeel Bus Ticket PDF (returns Buffer only)
 * @param {Object} booking - populated booking document
 * @returns {Buffer} PDF buffer
 */
export const generateTicketPDF = async (booking) => {
  try {
    // ✅ Extract info
    const trip = booking.scheduleId || {};
    const bus = trip.busId || {};
    const route = trip.route || bus.routes?.[0] || {};
    const totalFare = booking.totalAmount || 0;

    // ✅ Journey Date
    const journeyDate = trip.date ? new Date(trip.date) : null;
    const formattedDate = journeyDate
      ? journeyDate.toLocaleString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Invalid Date";

    // ✅ Dynamic Cancellation Policy
    let cancellationRows = `<tr><td colspan="2">Invalid or missing journey date</td></tr>`;
    if (journeyDate) {
      const slabs = [14, 7, 2].map((days) => {
        const d = new Date(journeyDate);
        d.setDate(d.getDate() - days);
        return d;
      });
      const [slab1, slab2, slab3] = slabs;
      const fmt = (d) =>
        d.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
      cancellationRows = [
        { label: `Before ${fmt(slab1)}`, charge: `₹0 (0%)` },
        {
          label: `After ${fmt(slab1)} & Before ${fmt(slab2)}`,
          charge: `₹${(totalFare * 0.25).toFixed(2)} (25%)`,
        },
        {
          label: `After ${fmt(slab2)} & Before ${fmt(slab3)}`,
          charge: `₹${(totalFare * 0.5).toFixed(2)} (50%)`,
        },
        {
          label: `After ${fmt(slab3)} & Before ${fmt(journeyDate)}`,
          charge: `₹${(totalFare * 0.75).toFixed(2)} (75%)`,
        },
      ]
        .map((r) => `<tr><td>${r.label}</td><td>${r.charge}</td></tr>`)
        .join("");
    }

    // ✅ QR Code
    const qrData = `https://nabeelbus.com/ticket/${booking._id}`;
    const qrImage = await QRCode.toDataURL(qrData);

    // ✅ Agent booking: always Paid ✅
    const paymentStatus =
      booking.bookedBy === "agent"
        ? "Paid ✅"
        : booking.paid
        ? "Paid ✅"
        : "Pending ❌";

    // ✅ Ticket HTML
const html = `
<html>
<head>
  <style>
    @page {
      margin: 20mm;
    }

    body {
      font-family: Arial, sans-serif;
      color: #333;
      font-size: 13px;
      margin: 0;
      padding: 0;
      counter-reset: page;
    }

    /* Page Number Styling */
    .page-number:after {
      content: "Page " counter(page);
      counter-increment: page;
      position: fixed;
      bottom: 10mm;
      right: 15mm;
      font-size: 11px;
      color: gray;
    }

    /* --- Fix: Keep header + intro together --- */
    .page-block {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    .header {
      background: #004AAD;
      color: white;
      padding: 20px 30px;
      margin-top: -20mm; /* remove top margin effect only for header */
      margin-left: -20mm;
      margin-right: -20mm;
      border-bottom: 3px solid #00327a;
    }
    .header h1 {
      margin: 0;
      font-size: 20px;
    }
    .header small {
      display: block;
      margin-top: 3px;
      font-size: 12px;
    }

    .container {
      padding: 20px 40px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th, td {
      padding: 6px 10px;
      border: 1px solid #ccc;
      vertical-align: top;
    }
    th {
      background: #004AAD;
      color: white;
      text-align: left;
    }

    .box {
      background: #f2f2f2;
      padding: 8px;
      color: #004AAD;
      font-weight: bold;
      border-radius: 3px;
      margin-top: 25px;
    }

    .qr {
      text-align: center;
      margin-top: 20px;
      page-break-inside: avoid;
    }
    .qr img {
      width: 100px;
      height: 100px;
    }

    .footer {
      text-align: center;
      font-size: 11px;
      color: gray;
      margin-top: 30px;
      page-break-inside: avoid;
    }

    .cancel-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 11px;
    }
    .cancel-table th, .cancel-table td {
      border: 1px solid #ccc;
      padding: 6px;
    }

    .terms {
      font-size: 11px;
      color: #333;
      margin-top: 15px;
      line-height: 1.5;
    }

    .section {
      margin-top: 25px;
      page-break-before: auto;
    }

  </style>
</head>
<body>
  <div class="page-number"></div>

  <!-- ✅ FIXED BLOCK: Header + Ticket Intro stay on same page -->
  <div class="page-block">
    <div class="header">
      <h1>Nabeel Bus Service Ticket Information</h1>
      <small>${route.from || "Bareilly"} → ${route.to || "Delhi"} | support@nabeelbus.com | +91-9876543210</small>
    </div>

    <div class="container">
      <p><b>Ticket Number:</b> TKT${booking._id}<br/>
      <b>PNR No:</b> ${String(booking._id).slice(-8)}</p>

      <p>Thank you for booking your bus with <b>Nabeel Bus Service</b>. Here are the ticket details for your upcoming trip from 
      ${route.from || "Bareilly"} to ${route.to || "Delhi"}.</p>
    </div>
  </div>


        <div class="box">Ticket Details</div>
        <table>
          <tr><td><b>Journey Date and Time:</b></td><td>${formattedDate}</td></tr>
          <tr><td><b>Travels:</b></td><td>${bus.name || "Nabeel Bus"}</td></tr>
          <tr><td><b>Bus Number:</b></td><td>${bus.number || "—"}</td></tr>
          <tr><td><b>Bus Type:</b></td><td>${bus.type || "A/C Seater / Sleeper"}</td></tr>
          <tr><td><b>Driver:</b></td><td>${bus.drivers?.[0]?.name || "—"} (${bus.drivers?.[0]?.phone || "—"})</td></tr>
          <tr><td><b>Boarding Point:</b></td><td>${bus.boardingPoints?.[0]?.location || "—"}</td></tr>
          <tr><td><b>Dropping Point:</b></td><td>${bus.droppingPoints?.[0]?.location || "—"}</td></tr>
        </table>

        <div class="box">Passenger Details</div>
        <table>
          <tr><th>Name</th><th>Gender</th><th>Seat No</th><th>Fare</th></tr>
          ${booking.passengers
            .map(
              (p) =>
                `<tr><td>${p.name}</td><td>${p.gender}</td><td>${p.seatLabel}</td><td>₹${p.fare}</td></tr>`
            )
            .join("")}
        </table>

        <div class="box">Payment Summary</div>
        <table>
          <tr><td><b>Total Fare:</b></td><td>₹${totalFare}</td></tr>
          <tr><td><b>Payment Status:</b></td><td>${paymentStatus}</td></tr>
        </table>

        <div class="qr">
          <img src="${qrImage}" alt="QR Code" />
          <div style="font-size:10px; color:gray;">Scan to view your ticket online</div>
        </div>

        <div class="box">Cancellation Policy</div>
        <p>Your current cancellation charges according to the policy are highlighted below:</p>
        <table class="cancel-table">
          <tr><th>Cancellation Time</th><th>Cancellation Charges</th></tr>
          ${cancellationRows}
        </table>

        <div class="section">
          <div class="box">Terms and Conditions</div>
          <div class="terms">
            <ol>
              <li>Nabeel Bus Service is an online ticketing platform. It does not operate bus services of its own. To offer choices of operators, departure times, and fares, it has tied up with multiple bus operators.</li>
              <li>Nabeel Bus Service’s responsibilities include:
                <ul>
                  <li>(a) Issuing a valid ticket accepted by the operator.</li>
                  <li>(b) Providing refunds and support in case of cancellation.</li>
                  <li>(c) Providing customer support and information in case of inconvenience.</li>
                </ul>
              </li>
              <li>Nabeel Bus Service’s responsibilities do NOT include:
                <ul>
                  <li>(a) The bus operator’s failure to depart/reach on time.</li>
                  <li>(b) The bus operator’s staff behavior.</li>
                  <li>(c) The bus operator’s bus quality or condition.</li>
                  <li>(d) Loss or damage of customer’s belongings.</li>
                </ul>
              </li>
              <li>Passengers must carry a valid e-ticket/m-ticket and valid ID proof to board the bus.</li>
              <li>Departure and arrival times are tentative; buses may leave earlier or later than scheduled.</li>
              <li>If an operator changes the type of bus, Nabeel Bus Service will refund fare differences if applicable.</li>
              <li>Complaints must be reported to <b>support@nabeelbus.com</b> within 7 days of the travel date.</li>
              <li>Cancellation after bus departure is not allowed.</li>
            </ol>
          </div>
        </div>

        <div class="footer">
          Thank you for choosing Nabeel Bus Service.<br/>
          For help, contact: support@nabeelbus.com | +91-9876543210
        </div>
      </div>
    </body>
    </html>`;

    // ✅ Generate PDF with safe margins and page number support
    const buffer = await pdf.generatePdf(
      { content: html },
      { format: "A4", printBackground: true, margin: { top: "20mm", bottom: "20mm" } }
    );

    console.log("✅ Ticket PDF generated (multi-page safe + page numbers)");
    return buffer;
  } catch (err) {
    console.error("💥 Ticket generation failed:", err);
    throw err;
  }
};


// 🧩 CLI usage — node ./utils/ticketGenerator.js <bookingId>
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// if (process.argv[1] === __filename) {
//   (async () => {
//     try {
//       const bookingId = process.argv[2];
//       if (!bookingId) {
//         console.error("❌ Please provide a booking ID");
//         process.exit(1);
//       }

//       await mongoose.connect(process.env.MONGO_URI);
//       const booking = await Booking.findById(bookingId)
//         .populate({
//           path: "scheduleId",
//           populate: [
//             {
//               path: "busId",
//               populate: ["drivers", "boardingPoints", "droppingPoints", "routes"],
//             },
//             { path: "route" },
//           ],
//         })
//         .lean();

//       if (!booking) throw new Error("Booking not found");
//       console.log("📄 Generating ticket for:", booking._id);

//       const buffer = await generateTicketPDF(booking);
//       console.log(`✅ Ticket generated in memory (${buffer.length} bytes)`);
//     } catch (err) {
//       console.error("💥 Error:", err);
//     } finally {
//       mongoose.connection.close();
//       process.exit(0);
//     }
//   })();
// }

// export const generateTicketPDF = async (booking) => {
//   if (!fs.existsSync("tickets")) fs.mkdirSync("tickets");

//   const qrData = `https://nabeelbus.com/ticket/${booking._id}`;
//   const qrImage = await QRCode.toDataURL(qrData);
//   const filePath = path.join("tickets", `Ticket_${booking._id}.pdf`);

//   const trip = booking.scheduleId || {};
//   const bus = trip.busId || {};
//   const route = trip.route || {};

//   // ============ 🧮 Dynamic Cancellation Policy =============
// const journeyDate = new Date(trip.date);
// const bookingDate = new Date(booking.createdAt || Date.now());
// const totalFare = booking.totalAmount || 0;

// // Calculate time slabs backward from journey date
// const slab1 = new Date(journeyDate);
// slab1.setDate(journeyDate.getDate() - 14); // >14 days = 0%
// const slab2 = new Date(journeyDate);
// slab2.setDate(journeyDate.getDate() - 7);  // 7–14 days = 25%
// const slab3 = new Date(journeyDate);
// slab3.setDate(journeyDate.getDate() - 2);  // 2–7 days = 50%

// const formatDateTime = (date) =>
//   date.toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     hour: "2-digit",
//     minute: "2-digit",
//   });

// // Dynamic policy rows
// const cancellationRows = [
//   { label: `Before ${formatDateTime(slab1)}`, charge: `₹0 (0%)` },
//   {
//     label: `After ${formatDateTime(slab1)} & Before ${formatDateTime(slab2)}`,
//     charge: `₹${(totalFare * 0.25).toFixed(2)} (25%)`,
//   },
//   {
//     label: `After ${formatDateTime(slab2)} & Before ${formatDateTime(slab3)}`,
//     charge: `₹${(totalFare * 0.5).toFixed(2)} (50%)`,
//   },
//   {
//     label: `After ${formatDateTime(slab3)} & Before ${formatDateTime(journeyDate)}`,
//     charge: `₹${(totalFare * 0.75).toFixed(2)} (75%)`,
//   },
// ].map(
//   (r) => `<tr><td>${r.label}</td><td>${r.charge}</td></tr>`
// ).join("");


//   const html = `
//   <html>
//   <head>
//     <style>
//       body {
//         font-family: Arial, sans-serif;
//         color: #333;
//         font-size: 13px;
//         margin: 0;
//         padding: 0;
//       }
//       .header {
//         background: #004AAD;
//         color: white;
//         padding: 20px 30px;
//       }
//       .header h1 {
//         margin: 0;
//         font-size: 20px;
//       }
//       .header small {
//         display: block;
//         margin-top: 3px;
//         font-size: 12px;
//       }
//       .container {
//         padding: 20px 40px;
//       }
//       h2 {
//         color: #004AAD;
//         border-bottom: 1px solid #ccc;
//         padding-bottom: 5px;
//         margin-top: 25px;
//       }
//       table {
//         width: 100%;
//         border-collapse: collapse;
//         margin-top: 10px;
//       }
//       td, th {
//         padding: 6px 10px;
//         vertical-align: top;
//       }
//       th {
//         background: #004AAD;
//         color: white;
//         text-align: left;
//       }
//       .box {
//         background: #f2f2f2;
//         padding: 8px;
//         color: #004AAD;
//         font-weight: bold;
//         border-radius: 3px;
//         margin-top: 25px;
//       }
//       .qr {
//         text-align: center;
//         margin-top: 20px;
//       }
//       .qr img {
//         width: 100px;
//         height: 100px;
//       }
//       .footer {
//         text-align: center;
//         font-size: 11px;
//         color: gray;
//         margin-top: 30px;
//       }
//       .terms {
//         font-size: 11px;
//         color: #333;
//         margin-top: 15px;
//         line-height: 1.5;
//       }
//       .terms ol {
//         padding-left: 18px;
//       }
//       .cancel-table {
//         width: 100%;
//         border-collapse: collapse;
//         margin-top: 10px;
//         font-size: 11px;
//       }
//       .cancel-table th, .cancel-table td {
//         border: 1px solid #ccc;
//         padding: 6px;
//       }
//       .section {
//         margin-top: 25px;
//       }
//     </style>
//   </head>
//   <body>
//     <div class="header">
//       <h1>Nabeel Bus Service Ticket Information</h1>
//       <small>Bareilly (Uttar Pradesh) → Delhi | support@nabeelbus.com | +91-9876543210</small>
//     </div>

//     <div class="container">
//       <p><b>Ticket Number:</b> TKT${String(booking._id)}<br/>
//       <b>PNR No:</b> ${String(booking._id).slice(-8)}</p>

//       <p>Thank you for booking your bus with <b>Nabeel Bus Service</b>. Here are the ticket details for your upcoming trip from 
//       ${route.from || "Bareilly"} to ${route.to || "Delhi"}.</p>

//       <div class="box">Ticket Details</div>
//       <table>
//         <tr><td><b>Journey Date and Time:</b></td><td>${new Date(trip.date).toLocaleString()}</td></tr>
//         <tr><td><b>Travels:</b></td><td>${bus.name || "Nabeel Bus"}</td></tr>
//         <tr><td><b>Bus Type:</b></td><td>${bus.type || "A/C Seater / Sleeper"}</td></tr>
//         <tr><td><b>Ticket Price:</b></td><td>₹${booking.totalAmount}</td></tr>
//         <tr><td><b>Boarding Point:</b></td><td>${bus.boardingPoints?.[0]?.location || "—"}</td></tr>
//         <tr><td><b>Dropping Point:</b></td><td>${bus.droppingPoints?.[0]?.location || "—"}</td></tr>
//       </table>

//       <div class="box">Passenger Details</div>
//       <table>
//         <tr><th>Name</th><th>Gender</th><th>Seat No</th><th>Fare</th></tr>
//         ${booking.passengers
//           .map(
//             (p) =>
//               `<tr><td>${p.name}</td><td>${p.gender}</td><td>${p.seatLabel}</td><td>₹${p.fare}</td></tr>`
//           )
//           .join("")}
//       </table>

//       <div class="box">Payment Summary</div>
//       <table>
//         <tr><td><b>Total Fare:</b></td><td>₹${booking.totalAmount}</td></tr>
//         <tr><td><b>Payment Status:</b></td><td>${
//           booking.paid ? "Paid ✅" : "Pending ❌"
//         }</td></tr>
//       </table>

//       <div class="qr">
//         <img src="${qrImage}" alt="QR Code" />
//         <div style="font-size:10px; color:gray;">Scan to view your ticket online</div>
//       </div>

//       <div class="section">
//   <div class="box">Cancellation Policy</div>
//   <p>Your current cancellation charges according to the policy are highlighted below:</p>
//   <table class="cancel-table">
//     <tr><th>Cancellation Time</th><th>Cancellation Charges</th></tr>
//     ${cancellationRows}
//   </table>
//   <ul style="font-size:11px; margin-top:10px; line-height:1.5;">
//     <li>Cancellation charges are computed on a per-seat basis.</li>
//     <li>For group bookings, cancellation of individual seats is not allowed.</li>
//     <li>Cancellation charges mentioned above exclude GST.</li>
//     <li>To cancel your ticket, go to My Bookings on the Nabeel Bus website and select Cancel Ticket.</li>
//   </ul>
// </div>


      // <div class="section">
      //   <div class="box">Terms and Conditions</div>
      //   <div class="terms">
      //     <ol>
      //       <li>Nabeel Bus Service is an online ticketing platform. It does not operate bus services of its own. To offer choices of operators, departure times, and fares, it has tied up with multiple bus operators.</li>
      //       <li>Nabeel Bus Service’s responsibilities include:
      //         <ul>
      //           <li>(a) Issuing a valid ticket accepted by the operator.</li>
      //           <li>(b) Providing refunds and support in case of cancellation.</li>
      //           <li>(c) Providing customer support and information in case of inconvenience.</li>
      //         </ul>
      //       </li>
      //       <li>Nabeel Bus Service’s responsibilities do NOT include:
      //         <ul>
      //           <li>(a) The bus operator’s failure to depart/reach on time.</li>
      //           <li>(b) The bus operator’s staff behavior.</li>
      //           <li>(c) The bus operator’s bus quality or condition.</li>
      //           <li>(d) Loss or damage of customer’s belongings.</li>
      //         </ul>
      //       </li>
      //       <li>Passengers must carry a valid e-ticket/m-ticket and valid ID proof to board the bus.</li>
      //       <li>Departure and arrival times are tentative; buses may leave earlier or later than scheduled.</li>
      //       <li>If an operator changes the type of bus, Nabeel Bus Service will refund fare differences if applicable.</li>
      //       <li>Complaints must be reported to <b>support@nabeelbus.com</b> within 7 days of the travel date.</li>
      //       <li>Cancellation after bus departure is not allowed.</li>
      //     </ol>
      //   </div>
      // </div>

//       <div class="footer">
//         Thank you for choosing Nabeel Bus Service.<br/>
//         For help, contact: support@nabeelbus.com | +91-9876543210
//       </div>
//     </div>
//   </body>
//   </html>`;

//   const options = { format: "A4", printBackground: true };
//   const file = { content: html };
//   const buffer = await pdf.generatePdf(file, options);
//   // Close any previous lock if file exists
// // 🧠 Safe PDF write: avoid overwriting if locked
// try {
//   // Write to a temp file first
//   const tempPath = path.join("tickets", `temp_${booking._id}.pdf`);
//   fs.writeFileSync(tempPath, buffer);

//   // Try renaming (overwrite only if unlocked)
//   try {
//     if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
//     fs.renameSync(tempPath, filePath);
//   } catch (renameErr) {
//     console.warn("⚠️ Ticket file currently open — saving as backup instead.");
//     const backupPath = path.join("tickets", `Ticket_${booking._id}_new.pdf`);
//     fs.renameSync(tempPath, backupPath);
//     console.log(`✅ Backup saved at: ${backupPath}`);
//     return backupPath;
//   }

//   console.log(`✅ Ticket saved successfully at: ${filePath}`);
//   return filePath;
// } catch (err) {
//   console.error("💥 File write error:", err);
// }


//   return filePath;
// };


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// ✅ Run directly: node ./utils/ticketGenerator.js <bookingId>
// if (process.argv[1] === __filename) {
//   import("../models/Booking.js").then(async ({ default: Booking }) => {
//     try {
//       const bookingId = process.argv[2];
//       if (!bookingId) {
//         console.error("❌ Please provide a booking ID");
//         process.exit(1);
//       }

//       const booking = await Booking.findById(bookingId)
//         .populate({
//           path: "scheduleId",
//           populate: [{ path: "busId" }],
//         })
//         .lean();

//       if (!booking) {
//         console.error("❌ Booking not found!");
//         process.exit(1);
//       }

//       console.log("📄 Generating ticket for:", booking._id);
//       const filePath = await generateTicketPDF(booking);
//       console.log(`✅ Ticket saved at: ${filePath}`);

// // import("child_process").then(({ spawn }) => {
// //   const absolutePath = path.resolve(filePath);

// //   // Wait a moment before opening (important for Windows)
// //   setTimeout(() => {
// //     try {
// //       if (process.platform === "win32") {
// //         spawn("cmd.exe", ["/c", "start", "", absolutePath], {
// //           shell: true,
// //           detached: true,
// //           stdio: "ignore",
// //         });
// //       } else if (process.platform === "darwin") {
// //         spawn("open", [absolutePath], { detached: true });
// //       } else {
// //         spawn("xdg-open", [absolutePath], { detached: true });
// //       }

// //       console.log("📂 Ticket opened successfully!");
// //     } catch (openErr) {
// //       console.warn("⚠️ Could not auto-open file:", openErr.message);
// //       console.log(`👉 Please open manually: ${absolutePath}`);
// //     }
// //   }, 1500); // 🕐 Wait 1.5 seconds to ensure file write completes
// // });


//     } catch (err) {
//       console.error("💥 Error:", err);
//     } finally {
//       process.exit(0);
//     }
//   });
// }
