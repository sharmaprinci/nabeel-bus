import React, { useEffect, useState } from "react";
import API from "../../api";
import {
  Loader2,
  ChevronDown,
  Bus,
  MapPin,
  CalendarDays,
  Ticket,
  Wallet,
  AlertTriangle,
  User,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [bookingFilter, setBookingFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get("/api/admin/users");
        setUsers(data || []);
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center py-16 text-gray-500 text-lg">
        <Loader2 className="animate-spin mr-2" /> Loading users...
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-slate-50 to-indigo-100 p-6 rounded-2xl shadow-md min-h-screen">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
        <User size={26} /> User Overview
      </h2>

      {users.length === 0 ? (
        <div className="text-center text-gray-500 italic py-12">
          No users found
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg overflow-hidden">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-indigo-100 text-indigo-900 uppercase text-xs font-semibold">
              <tr>
                <th className="p-3 text-left w-[20%]">Name</th>
                <th className="p-3 text-left w-[25%]">Email</th>
                <th className="p-3 text-left w-[20%]">Phone</th>
                <th className="p-3 text-left w-[15%]">City</th>
                <th className="p-3 text-center w-[10%]">Bookings</th>
                <th className="p-3 text-center w-[10%]">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-indigo-50 transition-all">
                  <td className="p-3 font-semibold text-gray-800 capitalize align-middle">
                    {u.name}
                  </td>
                  <td className="p-3 align-middle text-gray-700 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-indigo-600" />
                      {u.email}
                    </div>
                  </td>
                  <td className="p-3 align-middle text-gray-700 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-indigo-600" />
                      {u.mobile || "—"}
                    </div>
                  </td>
                  <td className="p-3 align-middle">{u.city || "—"}</td>
                  <td className="p-3 text-center font-medium align-middle">
                    {u.bookings?.length || 0}
                  </td>
                  <td className="p-3 text-center align-middle">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-medium shadow-sm transition flex items-center justify-center mx-auto gap-1"
                    >
                      <ChevronDown size={14} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 💠 Stylish Modal */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex justify-center items-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-indigo-500 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
                  <div>
                    <h3 className="text-xl font-semibold capitalize">
                      {selectedUser.name}
                    </h3>
                    <p className="text-sm opacity-90">
                      {selectedUser.email} • {selectedUser.mobile}
                    </p>
                    <p className="text-xs opacity-75">
                      City: {selectedUser.city || "—"}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 rounded-full hover:bg-white/20 transition"
                  >
                    <X size={22} />
                  </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 space-y-5">
                  {/* Filter Buttons */}
                  <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    {[
                      { key: "all", label: "📋 All" },
                      { key: "active", label: "🟢 Active" },
                      { key: "pending", label: "🟡 Pending" },
                      { key: "cancelled", label: "🔴 Cancelled" },
                      { key: "missing", label: "⚠️ Missing" },
                    ].map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setBookingFilter(f.key)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition ${
                          bookingFilter === f.key
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Booking List */}
                  {selectedUser.bookings?.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center italic">
                      No bookings found for this user.
                    </p>
                  ) : (
                    <div className="grid sm:grid-cols-1 gap-4">
                      {selectedUser.bookings
                        .filter((b) => {
                          if (bookingFilter === "active")
                            return b.status === "booked";
                          if (bookingFilter === "pending")
                            return b.status === "pending";
                          if (bookingFilter === "cancelled")
                            return b.status === "cancelled";
                          if (bookingFilter === "missing") return !b.scheduleId;
                          return true;
                        })
                        .map((b) => {
                          const hasSchedule = !!b.scheduleId;
                          const busName =
                            b.scheduleId?.busId?.name || "Unknown Bus";
                          const busNumber =
                            b.scheduleId?.busId?.number || "-";
                          const from = b.scheduleId?.route?.from || "—";
                          const to = b.scheduleId?.route?.to || "—";
                          const date = b.scheduleId?.date || "N/A";

                          return (
                            <motion.div
                              key={b._id}
                              layout
                              className={`rounded-2xl p-5 shadow-md border transition ${
                                hasSchedule
                                  ? "bg-white hover:shadow-lg border-gray-200"
                                  : "bg-yellow-50 border-yellow-300"
                              }`}
                            >
                              <div className="flex justify-between flex-wrap gap-2">
                                <div>
                                  <p className="font-semibold text-gray-800 flex items-center gap-1">
                                    <Bus
                                      size={15}
                                      className="text-indigo-600"
                                    />
                                    {busName} ({busNumber})
                                    {!hasSchedule && (
                                      <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                        <AlertTriangle size={12} /> Missing
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <MapPin size={14} /> {from} → {to}
                                  </p>
                                  <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <CalendarDays size={14} /> {date}
                                  </p>
                                </div>

                                <div className="text-sm text-gray-700 text-right">
                                  <p className="flex items-center justify-end gap-1">
                                    <Ticket size={14} /> Seats:{" "}
                                    <span className="text-indigo-700 font-medium">
                                      {b.passengers
                                        ?.map((p) => p.seatLabel)
                                        .join(", ") ||
                                        Object.keys(b.seats || {}).join(", ") ||
                                        "-"}
                                    </span>
                                  </p>
                                  <p>
                                    Passengers:{" "}
                                    {b.passengers
                                      ?.map((p) => p.name)
                                      .join(", ") || "—"}
                                  </p>
                                  <p>
                                    <Wallet
                                      size={13}
                                      className="inline text-indigo-600 mr-1"
                                    />
                                    ₹{b.totalAmount || 0} |{" "}
                                    <span
                                      className={`font-semibold ${
                                        b.status === "booked"
                                          ? "text-green-600"
                                          : b.status === "pending"
                                          ? "text-yellow-600"
                                          : b.status === "cancelled"
                                          ? "text-red-600"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {b.status?.toUpperCase()}
                                    </span>
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Booked on:{" "}
                                    {new Date(b.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
