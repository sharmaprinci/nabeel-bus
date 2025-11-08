import jsPDF from "jspdf";
import "jspdf-autotable";
import QRCode from "qrcode";
import API from "../api";

export const generateBusTicket = async (booking) => {
  try {
    const schedule = booking.scheduleId || {};
    const doc = new jsPDF("p", "mm", "a4");
    const PAGE_WIDTH = doc.internal.pageSize.getWidth();

    // 🟩 HEADER
    doc.setFillColor(0, 74, 173);
    doc.rect(0, 0, PAGE_WIDTH, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("🚌 Nabeel Bus Service", 14, 16);
    doc.setFontSize(10);
    doc.text("support@nabeelbus.com | +91-9876543210", 14, 22);

    // 🧾 TITLE
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("E-Ticket / Booking Confirmation", 14, 36);

    // Basic Info
    doc.setFontSize(10);
    doc.text(`Ticket No: TKT${booking._id}`, 14, 44);
    doc.text(`PNR No: ${String(booking._id).slice(-8)}`, 14, 50);
    doc.text(`Issued On: ${new Date().toLocaleString()}`, 14, 56);

    // 🧠 Smart QR
    const qrData = await QRCode.toDataURL(`https://nabeelbus.com/ticket/${booking._id}`);
    doc.addImage(qrData, "PNG", PAGE_WIDTH - 40, 35, 25, 25);

    // Unified Trip Data
    const trip = schedule || {};
    const bus = trip.busId || {};
    const route = trip.route || {};

    const busNumber = bus.number || booking.busNumber || "N/A";
    const from = route.from || booking.from || "N/A";
    const to = route.to || booking.to || "N/A";
    const travelDate = trip.date
      ? new Date(trip.date).toLocaleString()
      : "N/A";

    // 🧍 Fetch driver / points
    let driverInfo = null, boardingPoint = null, droppingPoint = null;
    try {
      const busId = booking.busId?._id || schedule.busId?._id;
      if (busId) {
        const { data: busData } = await API.get(`/api/buses/${busId}`);
        driverInfo = busData.drivers?.[0];
        boardingPoint = busData.boardingPoints?.[0];
        droppingPoint = busData.droppingPoints?.[0];
      }
    } catch (err) {
      console.warn("⚠️ Could not fetch bus details:", err.message);
    }

    // 🛣️ Trip Details
    const tripDetails = [
      ["Bus Number", busNumber],
      ["From", from],
      ["To", to],
      ["Travel Date", travelDate],
      ["Status", booking.status === "booked" ? "✅ Confirmed" : "⏳ Pending"],
      ["Booked By", booking.bookedBy || "User"],
    ];

    doc.autoTable({
      startY: 65,
      body: tripDetails,
      theme: "plain",
      styles: { fontSize: 11, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: "bold", textColor: [0, 74, 173], cellWidth: 40 },
        1: { cellWidth: 120 },
      },
    });

    // 🧍 Driver & Boarding
    doc.setFontSize(13);
    doc.setTextColor(0, 74, 173);
    doc.text("Driver & Boarding Details", 14, doc.lastAutoTable.finalY + 10);

    const driverTable = [
      ["Driver Name", driverInfo?.name || "N/A"],
      ["Driver Contact", driverInfo?.phone || "N/A"],
      ["Boarding Point", boardingPoint?.location || "N/A"],
      ["Boarding Time", boardingPoint?.time || "N/A"],
      ["Dropping Point", droppingPoint?.location || "N/A"],
      ["Dropping Time", droppingPoint?.time || "N/A"],
    ];

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 14,
      body: driverTable,
      theme: "plain",
      styles: { fontSize: 11 },
      columnStyles: {
        0: { fontStyle: "bold", textColor: [0, 74, 173], cellWidth: 45 },
      },
    });

    // 👥 PASSENGERS
    doc.setFontSize(13);
    doc.setTextColor(0, 74, 173);
    doc.text("Passenger Details", 14, doc.lastAutoTable.finalY + 10);

    const passengers = booking.passengers?.map((p, i) => [
      i + 1,
      p.name || "-",
      p.gender || "-",
      p.age || "-",
      p.seatLabel || "-",
      `₹${p.fare}`,
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 14,
      head: [["#", "Name", "Gender", "Age", "Seat", "Fare"]],
      body: passengers,
      theme: "grid",
      styles: { fontSize: 11 },
      headStyles: { fillColor: [0, 74, 173], textColor: [255, 255, 255] },
    });

    // 💰 PAYMENT
    doc.setFontSize(13);
    doc.setTextColor(0, 74, 173);
    doc.text("Payment Summary", 14, doc.lastAutoTable.finalY + 12);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 16,
      body: [
        ["Total Fare", `₹${booking.totalAmount}`],
        ["Payment Status", booking.paid ? "✅ Paid" : "❌ Pending"],
      ],
      theme: "plain",
      styles: { fontSize: 11 },
      columnStyles: {
        0: { fontStyle: "bold", textColor: [0, 74, 173], cellWidth: 50 },
      },
    });

    // 🧮 Dynamic Cancellation Policy
    const tripDate = new Date(trip.date);
    const totalFare = booking.totalAmount || 0;

    const slab1 = new Date(tripDate);
    slab1.setDate(tripDate.getDate() - 14);
    const slab2 = new Date(tripDate);
    slab2.setDate(tripDate.getDate() - 7);
    const slab3 = new Date(tripDate);
    slab3.setDate(tripDate.getDate() - 2);

    const formatDT = (d) =>
      d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });

    const cancelRows = [
      [`Before ${formatDT(slab1)}`, `₹0 (0%)`],
      [`After ${formatDT(slab1)} & Before ${formatDT(slab2)}`, `₹${(totalFare * 0.25).toFixed(2)} (25%)`],
      [`After ${formatDT(slab2)} & Before ${formatDT(slab3)}`, `₹${(totalFare * 0.5).toFixed(2)} (50%)`],
      [`After ${formatDT(slab3)} & Before ${formatDT(tripDate)}`, `₹${(totalFare * 0.75).toFixed(2)} (75%)`],
    ];

    doc.setFontSize(13);
    doc.setTextColor(0, 74, 173);
    doc.text("Cancellation Policy", 14, doc.lastAutoTable.finalY + 12);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 16,
      head: [["Cancellation Time", "Cancellation Charges"]],
      body: cancelRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 74, 173], textColor: [255, 255, 255] },
    });

    // Terms & Conditions
    const terms = [
      "Nabeel Bus Service is an online ticketing platform and not a bus operator.",
      "We are responsible for issuing valid tickets, providing refund support, and customer care.",
      "We are NOT responsible for operator delays, staff behavior, or bus quality.",
      "Passengers must carry a valid e-ticket/m-ticket and ID proof.",
      "Departure/arrival times are tentative and subject to change.",
      "Fare differences are refunded if operator changes bus type.",
      "Complaints must be reported to support@nabeelbus.com within 7 days.",
      "Cancellation after bus departure is not allowed.",
    ];

    doc.setFontSize(13);
    doc.setTextColor(0, 74, 173);
    doc.text("Terms & Conditions", 14, doc.lastAutoTable.finalY + 12);

    doc.setFontSize(10);
    doc.setTextColor(50);
    let y = doc.lastAutoTable.finalY + 18;
    terms.forEach((t, i) => {
      doc.text(`${i + 1}. ${t}`, 14, y);
      y += 6;
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Thank you for choosing Nabeel Bus Service.", 14, y + 8);
    doc.text("For help, contact support@nabeelbus.com | +91-9876543210", 14, y + 14);
    doc.text("Website: www.nabeelbus.com", 14, y + 20);

    // ✅ Save PDF
    doc.save(`Ticket_${booking._id}.pdf`);
  } catch (err) {
    console.error("PDF Generation Error:", err);
    alert("❌ Failed to generate ticket. Please try again.");
  }
};

// import QRCode from "qrcode";
// import html2pdf from "html2pdf.js";
// import API from "../api"; // ✅ your axios instance

// export const generateBusTicket = async (booking) => {
//   try {
//     // 🧠 STEP 1: Ensure full booking data
//     const schedule = booking.scheduleId || {};

//     if (typeof booking === "string" || !booking.scheduleId) {
//       const { data } = await API.get(`/api/bookings/${booking}`);
//       booking = data?.booking || data;
//     }

//     // const schedule = booking.scheduleId || {};
//     let bus = schedule.busId || {};
//     let route = schedule.route || {};

//     // 🧠 STEP 2: Fetch Bus Details (driver, points, etc.)
//     if (!bus?.drivers || !bus.boardingPoints) {
//       try {
//         const busId = booking.busId?._id || schedule.busId?._id || bus?._id;
//         if (busId) {
//           const { data: busData } = await API.get(`/api/buses/${busId}`);
//           bus = busData || {};
//         }
//       } catch (err) {
//         console.warn("⚠️ Could not fetch bus details:", err.message);
//       }
//     }

//     // 🧠 STEP 3: Resolve All Fields
//     const busNumber = bus.number || booking.busNumber || "—";
//     const from = route.from || booking.from || "Bareilly";
//     const to = route.to || booking.to || "Delhi";
//     const travelDate = schedule.date
//       ? new Date(schedule.date).toLocaleString("en-IN", {
//           weekday: "short",
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : "—";

//     const boardingPoint = bus.boardingPoints?.[0]?.location || "—";
//     const droppingPoint = bus.droppingPoints?.[0]?.location || "—";
//     const totalFare = booking.totalAmount || 0;
//     const driverInfo = bus.drivers?.[0] || null;

//     // 🧮 Dynamic Cancellation Policy (exact backend logic)
//     const journeyDate = schedule.date ? new Date(schedule.date) : null;
//     const slab1 = journeyDate ? new Date(journeyDate) : null;
//     const slab2 = journeyDate ? new Date(journeyDate) : null;
//     const slab3 = journeyDate ? new Date(journeyDate) : null;

//     if (journeyDate) {
//       slab1.setDate(journeyDate.getDate() - 14);
//       slab2.setDate(journeyDate.getDate() - 7);
//       slab3.setDate(journeyDate.getDate() - 2);
//     }

//     const formatDT = (d) =>
//       d
//         ? d.toLocaleString("en-IN", {
//             day: "2-digit",
//             month: "short",
//             hour: "2-digit",
//             minute: "2-digit",
//           })
//         : "—";

//     const cancellationRows = journeyDate
//       ? [
//           { label: `Before ${formatDT(slab1)}`, charge: `₹0 (0%)` },
//           {
//             label: `After ${formatDT(slab1)} & Before ${formatDT(slab2)}`,
//             charge: `₹${(totalFare * 0.25).toFixed(2)} (25%)`,
//           },
//           {
//             label: `After ${formatDT(slab2)} & Before ${formatDT(slab3)}`,
//             charge: `₹${(totalFare * 0.5).toFixed(2)} (50%)`,
//           },
//           {
//             label: `After ${formatDT(slab3)} & Before ${formatDT(journeyDate)}`,
//             charge: `₹${(totalFare * 0.75).toFixed(2)} (75%)`,
//           },
//         ]
//           .map((r) => `<tr><td>${r.label}</td><td>${r.charge}</td></tr>`)
//           .join("")
//       : `<tr><td colspan="2">Invalid or missing journey date</td></tr>`;

//     // 🧾 Generate QR Code
//     const qrImage = await QRCode.toDataURL(
//       `https://nabeelbus.com/ticket/${booking._id}`
//     );

//     // 🧱 SAME HTML AS BACKEND
//     const html = `
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
//       .header h1 { margin: 0; font-size: 20px; }
//       .header small { display: block; margin-top: 3px; font-size: 12px; }
//       .container { padding: 20px 40px; }
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
//       td, th { padding: 6px 10px; vertical-align: top; }
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
//       .qr img { width: 100px; height: 100px; }
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
//       .terms ol { padding-left: 18px; }
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
//       .section { margin-top: 25px; }
//     </style>
//   </head>
//   <body>
//     <div class="header">
//       <h1>Nabeel Bus Service Ticket Information</h1>
//       <small>${from} → ${to} | support@nabeelbus.com | +91-9876543210</small>
//     </div>

//     <div class="container">
//       <p><b>Ticket Number:</b> TKT${String(booking._id)}<br/>
//       <b>PNR No:</b> ${String(booking._id).slice(-8)}</p>

//       <p>Thank you for booking your bus with <b>Nabeel Bus Service</b>. Here are the ticket details for your upcoming trip from 
//       ${from} to ${to}.</p>

//       <div class="box">Ticket Details</div>
//       <table>
//         <tr><td><b>Journey Date and Time:</b></td><td>${travelDate}</td></tr>
//         <tr><td><b>Travels:</b></td><td>${bus.name || "Nabeel Bus"}</td></tr>
//         <tr><td><b>Bus Type:</b></td><td>${bus.type || "A/C Seater / Sleeper"}</td></tr>
//         <tr><td><b>Bus Number:</b></td><td>${busNumber}</td></tr>
//         <tr><td><b>Driver:</b></td><td>${driverInfo?.name || "—"} (${driverInfo?.phone || "—"})</td></tr>
//         <tr><td><b>Ticket Price:</b></td><td>₹${totalFare}</td></tr>
//         <tr><td><b>Boarding Point:</b></td><td>${boardingPoint}</td></tr>
//         <tr><td><b>Dropping Point:</b></td><td>${droppingPoint}</td></tr>
//       </table>

//       <div class="box">Passenger Details</div>
//       <table>
//         <tr><th>Name</th><th>Gender</th><th>Seat No</th><th>Fare</th></tr>
//         ${booking.passengers
//           ?.map(
//             (p) =>
//               `<tr><td>${p.name}</td><td>${p.gender}</td><td>${p.seatLabel}</td><td>₹${p.fare}</td></tr>`
//           )
//           .join("")}
//       </table>

//       <div class="box">Payment Summary</div>
//       <table>
//         <tr><td><b>Total Fare:</b></td><td>₹${totalFare}</td></tr>
//         <tr><td><b>Payment Status:</b></td><td>${booking.paid ? "Paid ✅" : "Pending ❌"}</td></tr>
//       </table>

//       <div class="qr">
//         <img src="${qrImage}" alt="QR Code" />
//         <div style="font-size:10px; color:gray;">Scan to view your ticket online</div>
//       </div>

//       <div class="section">
//         <div class="box">Cancellation Policy</div>
//         <p>Your current cancellation charges according to the policy are highlighted below:</p>
//         <table class="cancel-table">
//           <tr><th>Cancellation Time</th><th>Cancellation Charges</th></tr>
//           ${cancellationRows}
//         </table>
//         <ul style="font-size:11px; margin-top:10px; line-height:1.5;">
//           <li>Cancellation charges are computed on a per-seat basis.</li>
//           <li>For group bookings, cancellation of individual seats is not allowed.</li>
//           <li>Cancellation charges mentioned above exclude GST.</li>
//           <li>To cancel your ticket, go to My Bookings on the Nabeel Bus website and select Cancel Ticket.</li>
//         </ul>
//       </div>

//       <div class="section">
//         <div class="box">Terms and Conditions</div>
//         <div class="terms">
//           <ol>
//             <li>Nabeel Bus Service is an online ticketing platform. It does not operate bus services of its own.</li>
//             <li>Responsibilities include issuing valid tickets, refund support, and customer service.</li>
//             <li>We are not responsible for delays, staff behavior, or bus quality.</li>
//             <li>Passengers must carry a valid e-ticket/m-ticket and ID proof.</li>
//             <li>Departure and arrival times are tentative.</li>
//             <li>Fare differences are refunded if bus type changes.</li>
//             <li>Complaints must be reported to <b>support@nabeelbus.com</b> within 7 days of travel date.</li>
//             <li>Cancellation after bus departure is not allowed.</li>
//           </ol>
//         </div>
//       </div>

//       <div class="footer">
//         Thank you for choosing Nabeel Bus Service.<br/>
//         For help, contact: support@nabeelbus.com | +91-9876543210
//       </div>
//     </div>
//   </body>
//   </html>`;

//     // ✅ Generate and Download
//     const element = document.createElement("div");
//     element.innerHTML = html;
//     const options = {
//       filename: `Ticket_${booking._id}.pdf`,
//       html2canvas: { scale: 2 },
//       jsPDF: { format: "a4", orientation: "portrait" },
//     };
//     await html2pdf().from(element).set(options).save();
//   } catch (err) {
//     console.error("❌ Ticket generation failed:", err);
//   }
// };
