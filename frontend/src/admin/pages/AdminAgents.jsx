import React, { useEffect, useState } from "react";
import API from "../../api";
import {
  Loader2,
  Bus,
  MapPin,
  CalendarDays,
  Ticket,
  Wallet,
  XCircle,
  CheckCircle2,
  Building2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [bookingFilter, setBookingFilter] = useState("all");

  const filteredBookings =
    selectedAgent?.bookings?.filter((b) => {
      if (bookingFilter === "active") {
        // Show only booked AND have schedule
        return b.status === "booked" && b.scheduleId;
      }
      if (bookingFilter === "cancelled") {
        return b.status === "cancelled";
      }
      if (bookingFilter === "missing") {
        // Show bookings where schedule is null
        return !b.scheduleId;
      }
      return true; // 'All' filter
    }) || [];

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data } = await API.get("/api/admin/agents");
        setAgents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching agents:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-12 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading Agents...
      </div>
    );

  return (
    <div className="p-8 bg-gradient-to-b from-slate-50 to-indigo-100 min-h-screen rounded-xl">
      <h2 className="text-3xl font-bold mb-8 text-indigo-700">
        👥 Agent Overview
      </h2>

      {agents.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No agents found</div>
      ) : (
        <div className="space-y-6">
          {agents.map((agent) => (
            <motion.div
              key={agent._id}
              layout
              className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Agent Summary */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 py-5">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-1 capitalize">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-gray-600">{agent.email}</p>
                  <p className="text-sm text-gray-600">{agent.mobile}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                    <Building2 size={16} className="text-indigo-600" />
                    {agent.company || "N/A"}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-3 mt-4 md:mt-2">
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium flex items-center gap-1 shadow-sm">
                    <CheckCircle2 size={16} /> {agent.stats.activeBookings}{" "}
                    Active
                  </div>
                  <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium flex items-center gap-1 shadow-sm">
                    <XCircle size={16} /> {agent.stats.cancelledBookings}{" "}
                    Cancelled
                  </div>
                  <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium flex items-center gap-1 shadow-sm">
                    <Ticket size={16} /> {agent.stats.totalSeats} Seats
                  </div>
                  {/* <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-medium flex items-center gap-1 shadow-sm">
                    <Wallet size={16} /> ₹{agent.stats.totalRevenue}
                  </div> */}
                </div>

                {/* Modal Trigger */}
                <button
                  onClick={() => setSelectedAgent(agent)}
                  className="mt-5 md:mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-md"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedAgent && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.div
              className="fixed inset-0 z-50 flex justify-center items-center p-4"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-5xl p-6 overflow-y-auto max-h-[90vh]">
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800 capitalize">
                      {selectedAgent.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {selectedAgent.email} • {selectedAgent.mobile}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedAgent(null)}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Agent Summary Info */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium flex items-center gap-1 shadow-sm">
                    <CheckCircle2 size={16} /> Active:{" "}
                    {selectedAgent.stats.activeBookings}
                  </div>
                  <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium flex items-center gap-1 shadow-sm">
                    <XCircle size={16} /> Cancelled:{" "}
                    {selectedAgent.stats.cancelledBookings}
                  </div>
                  <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium flex items-center gap-1 shadow-sm">
                    <Ticket size={16} /> Seats: {selectedAgent.stats.totalSeats}
                  </div>
                  <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-medium flex items-center gap-1 shadow-sm">
                    <Wallet size={16} /> ₹{selectedAgent.stats.totalRevenue}
                  </div>
                </div>

                {/* 🔍 Filter Bar */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {[
                    {
                      key: "all",
                      label: "📋 All Bookings",
                      count: selectedAgent?.bookings?.length || 0,
                    },
                    {
                      key: "active",
                      label: "🟢 Active",
                      count: selectedAgent?.bookings?.filter(
                        (b) => b.status === "booked" && b.scheduleId
                      ).length,
                    },
                    {
                      key: "cancelled",
                      label: "🔴 Cancelled",
                      count: selectedAgent?.bookings?.filter(
                        (b) => b.status === "cancelled"
                      ).length,
                    },
                    {
                      key: "missing",
                      label: "⚠️ Missing",
                      count: selectedAgent?.bookings?.filter(
                        (b) => !b.scheduleId
                      ).length,
                    },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setBookingFilter(filter.key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition ${
                        bookingFilter === filter.key
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {filter.label}{" "}
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Filtered Bookings */}
                {filteredBookings.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center italic">
                    No {bookingFilter !== "all" ? bookingFilter : ""} bookings
                    found.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((b) => {
                      const hasSchedule = !!b.scheduleId;
                      const busName =
                        b.scheduleId?.busId?.name || "Unknown Bus";
                      const busNumber = b.scheduleId?.busId?.number || "-";
                      const from = b.scheduleId?.route?.from || "-";
                      const to = b.scheduleId?.route?.to || "-";
                      const date = b.scheduleId?.date || "N/A";

                      return (
                        <motion.div
                          key={b._id}
                          layout
                          className={`border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition ${
                            hasSchedule
                              ? "bg-gradient-to-br from-slate-50 to-indigo-50"
                              : "bg-gray-50 opacity-80"
                          }`}
                        >
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            {/* Bus + Route Info */}
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-800 flex items-center gap-1">
                                  <Bus size={15} /> {busName} ({busNumber})
                                </p>
                                {!hasSchedule && (
                                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                    ⚠️ Schedule Missing
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <MapPin size={15} />
                                {from} → {to}
                              </p>

                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <CalendarDays size={15} /> {date}
                              </p>
                            </div>

                            {/* Seat + Passenger Info */}
                            <div className="text-sm text-gray-700">
                              <p className="flex items-center gap-1 font-medium">
                                <Ticket size={14} /> Seats:
                                <span className="ml-1 text-indigo-700">
                                  {b.passengers
                                    .map((p) => p.seatLabel)
                                    .join(", ") || "-"}
                                </span>
                              </p>
                              <p>
                                <strong>Passengers:</strong>{" "}
                                {b.passengers.map((p) => p.name).join(", ") ||
                                  "-"}
                              </p>
                              <p className="text-gray-600 font-medium">
                                Status:{" "}
                                <span
                                  className={`font-semibold ${
                                    b.status === "booked"
                                      ? "text-green-600"
                                      : b.status === "cancelled"
                                      ? "text-red-600"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {b.status?.toUpperCase() || "-"}
                                </span>
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAgents;
