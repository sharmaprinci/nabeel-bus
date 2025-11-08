import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import API from "../../api";
import { motion, AnimatePresence } from "framer-motion";
import AdminLiveBusView from "../AdminLiveBusView"; // adjust path as needed
import {
  BusFront,
  Clock,
  Users,
  Download,
  Eye,
  CalendarDays,
  MapPin,
  Wallet,
  Zap,
  CircleCheck,
  CircleDashed,
} from "lucide-react";
import AdminLiveMap from "../AdminLiveMap";

export default function AdminBookingSummary() {
  const [summary, setSummary] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    origin: "",
    destination: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("passengers");

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("User not authenticated");

      const params = new URLSearchParams(filters);
      const res = await API.get(
        `/api/admin/booking-summary?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSummary(res.data.summary || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(summary);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BookingSummary");
    XLSX.writeFile(wb, `BookingSummary_${filters.date || "All"}.xlsx`);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const openModal = (bus) => {
    setSelectedBus(bus);
    setBookings(bus.passengers || []);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const totalRevenue = summary.reduce(
    (acc, s) => acc + (s.totalAmountCollected || 0),
    0
  );
  const totalAgentRevenue = summary.reduce(
    (acc, s) => acc + (s.totalRevenueByRole?.agents || 0),
    0
  );
  const totalUserRevenue = summary.reduce(
    (acc, s) => acc + (s.totalRevenueByRole?.users || 0),
    0
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2"
      >
        🚌 Admin Booking Summary
      </motion.h2>

      {/* 🔍 Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className="border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="origin"
          placeholder="Origin"
          value={filters.origin}
          onChange={handleFilterChange}
          className="border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={filters.destination}
          onChange={handleFilterChange}
          className="border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchSummary}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          🔍 Filter
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-5 bg-white shadow-md rounded-xl flex items-center gap-4 border-l-4 border-blue-500"
        >
          <Wallet className="text-blue-600 w-8 h-8" />
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h3 className="text-xl font-semibold text-gray-800">
              ₹{totalRevenue.toLocaleString()}
            </h3>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-5 bg-white shadow-md rounded-xl flex items-center gap-4 border-l-4 border-green-500"
        >
          <Users className="text-green-600 w-8 h-8" />
          <div>
            <p className="text-sm text-gray-500">Agent Revenue</p>
            <h3 className="text-xl font-semibold text-gray-800">
              ₹{totalAgentRevenue.toLocaleString()}
            </h3>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-5 bg-white shadow-md rounded-xl flex items-center gap-4 border-l-4 border-purple-500"
        >
          <Users className="text-purple-600 w-8 h-8" />
          <div>
            <p className="text-sm text-gray-500">User Revenue</p>
            <h3 className="text-xl font-semibold text-gray-800">
              ₹{totalUserRevenue.toLocaleString()}
            </h3>
          </div>
        </motion.div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">Bus</th>
              <th className="p-3 text-left">Route</th>
              <th className="p-3 text-center">Date</th>
              <th className="p-3 text-center">Time</th>
              <th className="p-3 text-center">Seats</th>
              <th className="p-3 text-center">Revenue</th>
              <th className="p-3 text-center">Agents</th>
              <th className="p-3 text-center">Users</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {summary.length > 0 ? (
              summary.map((bus, i) => (
                <tr
                  key={i}
                  className="border-b hover:bg-blue-50 transition-all duration-200"
                >
                  <td className="p-3 font-medium flex items-center gap-2">
                    <BusFront className="w-4 h-4 text-blue-600" />{" "}
                    {bus.busNumber || "-"}
                  </td>
                  <td className="p-3">
                    <MapPin className="inline w-4 h-4 text-red-500 mr-1" />
                    {bus.origin} → {bus.destination}
                  </td>
                  <td className="p-3 text-center">{bus.date}</td>
                  <td className="p-3 text-center">
                    {bus.departureTime} → {bus.arrivalTime}
                  </td>
                  <td className="p-3 text-center">
                    {bus.totalBookedSeats}/{bus.totalSeats}
                  </td>
                  <td className="p-3 text-center text-blue-700 font-semibold">
                    ₹{bus.totalAmountCollected}
                  </td>
                  <td className="p-3 text-center text-green-600">
                    ₹{bus.totalRevenueByRole?.agents || 0}
                  </td>
                  <td className="p-3 text-center text-purple-600">
                    ₹{bus.totalRevenueByRole?.users || 0}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          setViewMode("passengers");
                          openModal(bus);
                        }}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" /> Passengers
                      </button>
                      <button
                        onClick={() => {
                          setViewMode("layout");
                          openModal(bus);
                        }}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition flex items-center gap-1"
                      >
                        Seat Layout
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="p-4 text-center text-gray-500 font-medium"
                >
                  📝 No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Export */}
      {summary.length > 0 && (
        <div className="mt-6 text-right">
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 ml-auto"
          >
            <Download className="w-4 h-4" /> Export to Excel
          </button>
        </div>
      )}

      {/* Action Buttons + Modal */}
      <AnimatePresence>
        {showModal && selectedBus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-auto p-6"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-xl font-bold text-gray-800">
                  🚌 {selectedBus.busNumber} — {selectedBus.origin} →{" "}
                  {selectedBus.destination}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-red-500 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setViewMode("passengers")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    viewMode === "passengers"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  👥 Passengers
                </button>
                <button
                  onClick={() => setViewMode("layout")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    viewMode === "layout"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  🪑 Seat Layout
                </button>
              </div>

              {/* Animate Between Views */}
              <AnimatePresence mode="wait">
                {viewMode === "passengers" ? (
                  <motion.div
                    key="passenger-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Passenger Table */}
                    <table className="min-w-full border text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 border">Seat</th>
                          <th className="p-2 border">Name</th>
                          <th className="p-2 border">Age</th>
                          <th className="p-2 border">Gender</th>
                          <th className="p-2 border">Fare</th>
                          <th className="p-2 border">Booked By</th>
                          <th className="p-2 border">Payment</th>
                          <th className="p-2 border">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.length > 0 ? (
                          bookings.map((p, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="p-2 border">{p.seatNo}</td>
                              <td className="p-2 border">{p.passengerName}</td>
                              <td className="p-2 border">{p.age}</td>
                              <td className="p-2 border">{p.gender}</td>
                              <td className="p-2 border text-blue-600 font-semibold">
                                ₹{p.fare}
                              </td>
                              <td className="p-2 border">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    p.bookedBy === "agent"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-purple-100 text-purple-700"
                                  }`}
                                >
                                  {p.bookedByName || p.bookedBy}
                                </span>
                              </td>
                              <td
                                className={`p-2 border font-semibold ${
                                  p.paymentStatus === "Paid"
                                    ? "text-green-600"
                                    : "text-yellow-600"
                                }`}
                              >
                                {p.paymentStatus}
                              </td>
                              <td className="p-2 border">
                                {new Date(p.bookingDate).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="8"
                              className="text-center p-4 text-gray-500 font-medium"
                            >
                              No passenger data
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </motion.div>
                ) : (
                  <motion.div
                    key="seat-layout-view"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* ==============================
                  🪑 LIVE SEAT LAYOUT (ADMIN VIEW)
              ============================== */}
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      🪑 Seat Configuration & Live Status
                    </h4>

                    <div className="border rounded-lg bg-gray-50 p-4 shadow-inner">
                      <AdminLiveBusView
                        scheduleId={selectedBus.scheduleId || selectedBus._id}
                        passengers={selectedBus.passengers || []}
                      />
                    </div>
                    {/* <div className="grid md:grid-cols-2 gap-6">
  <div className="border rounded-lg bg-gray-50 p-4 shadow-inner">
    <AdminLiveBusView
      scheduleId={selectedBus.scheduleId || selectedBus._id}
      passengers={selectedBus.passengers || []}
    />
  </div>

  <div className="border rounded-lg bg-gray-50 p-4 shadow-inner">
    <h4 className="text-base font-semibold mb-2 text-gray-700 flex items-center gap-1">
      🛰️ Live Bus Tracking
    </h4>
    <AdminLiveMap
      scheduleId={selectedBus.scheduleId || selectedBus._id}
      route={selectedBus.route}
    />
  </div>
</div> */}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
