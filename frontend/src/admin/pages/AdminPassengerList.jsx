import React, { useEffect, useState } from "react";
import API from "../../api";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  Loader2,
  Users,
  Wallet,
  CheckCircle2,
  Clock3,
  Building2,
} from "lucide-react";

  import jsPDF from "jspdf";
import "jspdf-autotable";


const AdminPassengerList = () => {
  const [busId, setBusId] = useState("");
  const [date, setDate] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [passengers, setPassengers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPassengers: 0,
    totalRevenue: 0,
    agentRevenue: 0,
    paidCount: 0,
    pendingCount: 0,
  });

  useEffect(() => {
    fetchBuses();
  }, []);


      const token = localStorage.getItem("adminToken")

  const fetchBuses = async () => {
    try {
      const { data } = await API.get("/api/buses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuses(data);
    } catch (err) {
      console.error("Error fetching buses:", err);
    }
  };

  const fetchPassengers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/api/admin/passenger-list", {
        params: { busId, date, origin, destination },
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = data.passengers || [];
      setPassengers(list);

      // 🧮 Calculate stats
      const totalPassengers = list.length;
      const totalRevenue = list
        .filter((p) => p.bookedBy === "user")
        .reduce((sum, p) => sum + (p.fare || 0), 0);
      const agentRevenue = list
        .filter((p) => p.bookedBy === "agent")
        .reduce((sum, p) => sum + (p.fare || 0), 0);
      const paidCount = list.filter((p) => p.paymentStatus === "Paid").length;
      const pendingCount = list.filter(
        (p) => p.paymentStatus === "Pending"
      ).length;

      setStats({
        totalPassengers,
        totalRevenue,
        agentRevenue,
        paidCount,
        pendingCount,
      });
    } catch (err) {
      console.error("Error fetching passengers:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(passengers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Passenger List");
    XLSX.writeFile(wb, `Passenger_List_${date || "All"}.xlsx`);
  };

const downloadPDF = () => {
  if (passengers.length === 0) return;

  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 30;
  const logoUrl = "/images/logo.png";
  const officeAddress = "ANAND VIHAR ISBT TO SHAHJAHANPUR ROADWAYS";

  // 🔹 HEADER (Repeated Each Page)
  const addHeader = (busName, busNumber, date, route, totalPassengers, totalAgents) => {
    // Outer Border
    doc.setDrawColor(60);
    doc.setLineWidth(0.8);
    doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2);

    try {
      doc.addImage(logoUrl, "PNG", margin + 10, margin + 10, 45, 35);
    } catch {
      console.warn("Logo missing — skipping image");
    }

    const safeBusName = String(busName || "Unknown Bus");
    const safeBusNumber = String(busNumber || "—");
    const safeDate =
      typeof date === "string"
        ? date
        : date instanceof Date
        ? date.toISOString().slice(0, 10)
        : String(date || "—");

    // === TOP ROW ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);

    doc.text(safeBusName, margin + 70, margin + 25);
    const busNumberText = `Bus No: ${safeBusNumber}`;
    const busNumberWidth = doc.getTextWidth(busNumberText);
    doc.text(busNumberText, pageWidth / 2 - busNumberWidth / 2, margin + 25);
    const dateText = `Date: ${safeDate}`;
    const dateWidth = doc.getTextWidth(dateText);
    doc.text(dateText, pageWidth - margin - 15 - dateWidth, margin + 25);

    // === SECOND ROW ===
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text(officeAddress, margin + 70, margin + 45);

    const generatedText = `Generated: ${new Date().toLocaleString()}`;
    const generatedWidth = doc.getTextWidth(generatedText);
    doc.text(generatedText, pageWidth - margin - 15 - generatedWidth, margin + 45);

    // === THIRD ROW ===
    const safeRoute = String(route || "—");
    const totalsText = `Total Passengers: ${totalPassengers} | Total Agents: ${totalAgents}`;
    const totalsWidth = doc.getTextWidth(totalsText);

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Route: ${safeRoute}`, margin + 70, margin + 63);
    doc.text(totalsText, pageWidth - margin - 15 - totalsWidth, margin + 63);

    // Divider (moved slightly upward for more white space)
    doc.setDrawColor(180);
    doc.line(margin + 10, margin + 80, pageWidth - margin - 10, margin + 80);
  };

  // 🔹 FOOTER (Repeated Each Page)
  const addFooter = (pageNum, totalPages) => {
    doc.setFontSize(9);
    doc.setTextColor(130);
    const footerY = pageHeight - margin - 10;
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2 - 20, footerY);
    doc.text("Powered by Nabeel Bus", pageWidth - margin - 170, footerY);
  };

  // 🔹 Group by Bus + Date
  const grouped = passengers.reduce((acc, p) => {
    const key = `${p.busName || "Unknown Bus"}|${p.busNumber || "—"}|${p.travelDate || "—"}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  Object.entries(grouped).forEach(([key, list]) => {
    const [busName, busNumber, date] = key.split("|");
    const route =
      list[0]?.origin && list[0]?.destination
        ? `${list[0].origin} → ${list[0].destination}`
        : "—";
    const totalPassengers = list.length;
    const totalAgents = list.filter((p) => p.bookedBy === "agent").length;

    // Add Header
    addHeader(busName, busNumber, date, route, totalPassengers, totalAgents);

    const tableData = list.map((p, i) => [
      i + 1,
      String(p.passengerName || "—"),
      String(p.contactPhone || "—"),
      String(p.seatNo || "—"),
      `₹${p.fare || 0}`,
      p.bookedBy === "agent" ? `Agent (${String(p.agentName || "—")})` : "User",
      p.paymentStatus === "Paid" ? "Paid" : "Unpaid",
    ]);

    // 🚀 Adjusted table start Y (now 105 to prevent overlap)
    const tableStartY = margin + 105;

    doc.autoTable({
      startY: tableStartY,
      head: [["#", "Name", "Mobile", "Seat", "Amount", "Booked By", "Payment"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
        fontSize: 10,
      },
      styles: {
        fontSize: 9,
        cellPadding: 5,
        halign: "center",
        valign: "middle",
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 120, halign: "left" },
        2: { cellWidth: 100, halign: "left" },
        3: { cellWidth: 50 },
        4: { cellWidth: 60 },
        5: { cellWidth: 110, halign: "left" },
        6: { cellWidth: 70 },
      },
      margin: { left: margin + 10, right: margin + 10 },
      didDrawPage: () => {
        const totalPages = doc.internal.getNumberOfPages();
        const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
        addHeader(busName, busNumber, date, route, totalPassengers, totalAgents);
        addFooter(currentPage, totalPages);
      },
    });
  });

  const totalPages = doc.internal.getNumberOfPages();
  addFooter(totalPages, totalPages);

  doc.save(`Passenger_List_${new Date().toISOString().slice(0, 10)}.pdf`);
};

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            🧾 Passenger List
          </h2>

          <div className="flex gap-3">
            <button
              onClick={fetchPassengers}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center gap-2 shadow-sm transition"
            >
              <Search size={16} /> Fetch List
            </button>
            {passengers.length > 0 && (
              <>
<button
                onClick={downloadExcel}
                className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center gap-2 shadow-sm transition"
              >
                <Download size={16} /> Download Excel
              </button>
  <button
    onClick={downloadPDF}
    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg flex items-center gap-2 shadow-sm transition"
  >
    🧾 Download PDF
  </button>

              </>
              
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            className="border p-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">All Buses</option>
            {buses.map((b) => {
              const from = b?.route?.from || b?.routes?.[0]?.from || "—";
              const to = b?.route?.to || b?.routes?.[0]?.to || "—";
              return (
                <option key={b._id} value={b._id}>
                  {b.name || b.busName || "Bus"} ({b.number || b.busNumber}) —{" "}
                  {from} → {to}
                </option>
              );
            })}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            type="text"
            placeholder="Origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="border p-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border p-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        {/* 🧮 Summary Cards */}
{/* 🧮 Summary Cards */}
{passengers.length > 0 && (
  <div className="mt-8 mb-10">
    <div
      className="grid gap-5 w-full"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      }}
    >
      <SummaryCard
        title="Total Passengers"
        value={stats.totalPassengers}
        icon={<Users size={22} />}
        color="bg-indigo-50 text-indigo-700"
      />
      <SummaryCard
        title="Total Revenue (User)"
        value={`₹${stats.totalRevenue.toLocaleString()}`}
        icon={<Wallet size={22} />}
        color="bg-green-50 text-green-700"
      />
      <SummaryCard
        title="Agent Bookings Value"
        value={`₹${stats.agentRevenue.toLocaleString()}`}
        icon={<Building2 size={22} />}
        color="bg-blue-50 text-blue-700"
      />
      <SummaryCard
        title="Paid Bookings"
        value={stats.paidCount}
        icon={<CheckCircle2 size={22} />}
        color="bg-emerald-50 text-emerald-700"
      />
      <SummaryCard
        title="Pending Payments"
        value={stats.pendingCount}
        icon={<Clock3 size={22} />}
        color="bg-yellow-50 text-yellow-700"
      />
    </div>
  </div>
)}

        {/* Table Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-gray-600">
            <Loader2 className="animate-spin mr-2" /> Loading Passenger Data...
          </div>
        ) : passengers.length === 0 ? (
          <div className="text-center text-gray-500 py-16 text-lg">
            No passenger data found 🕊️
          </div>
        ) : (
          <div className="overflow-auto rounded-xl border border-gray-200 shadow-sm max-h-[75vh]">
            <table className="min-w-[1200px] w-full text-sm text-left">
              <thead className="sticky top-0 bg-indigo-600 text-white z-10">
                <tr>
                  <th className="p-3">Seat</th>
                  <th className="p-3">Passenger</th>
                  <th className="p-3">Age</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Fare</th>
                  <th className="p-3">Booked By</th>
                  <th className="p-3">Contact Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Bus</th>
                  <th className="p-3">Route</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Booking Time</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {passengers.map((p, i) => (
                  <tr
                    key={i}
                    className={`border-b hover:bg-indigo-50 transition-colors duration-200 ${
                      i % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <td className="p-3">{p.seatNo}</td>
                    <td className="p-3 font-medium text-gray-800">
                      {p.passengerName}
                    </td>
                    <td className="p-3">{p.age}</td>
                    <td className="p-3">{p.gender}</td>
                    <td className="p-3 font-semibold text-gray-700">
                      ₹{p.fare}
                    </td>

                    {/* 🧾 Booked By */}
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span
                          className={`px-2.5 py-1 w-fit rounded-full text-xs font-semibold border ${
                            p.bookedBy === "agent"
                              ? "bg-blue-50 text-blue-700 border-blue-300"
                              : "bg-green-50 text-green-700 border-green-300"
                          }`}
                        >
                          {p.bookedBy === "agent" ? "Agent" : "User"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="text-sm text-gray-800 mt-1 font-medium">
                        {p.contactName}
                      </p>
                    </td>

                    <td className="p-3">{p.contactPhone}</td>
                    <td className="p-3">{p.contactEmail}</td>
                    <td className="p-3 font-medium text-gray-800">
                      {p.busName} ({p.busNumber})
                    </td>
                    <td className="p-3">
                      {p.origin} → {p.destination}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {p.travelDate || "—"}
                    </td>
                    <td className="p-3 text-gray-600 whitespace-nowrap">
                      {new Date(p.bookingDate).toLocaleString()}
                    </td>

                    {/* 💰 Payment Status */}
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          p.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                        }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* ✅ Summary Card Component */
const SummaryCard = ({ title, value, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`rounded-xl shadow-md border border-gray-200 p-5 flex flex-col justify-between ${color}`}
  >
    <div className="flex items-center gap-2 text-sm font-semibold mb-1">
      {icon} <span>{title}</span>
    </div>
    <div className="text-2xl font-extrabold leading-snug mt-1">{value}</div>
  </motion.div>
);

export default AdminPassengerList;
