// import React, { useEffect, useState, useContext } from "react";
// import API from "../api";
// import { AuthContext } from "../context/AuthContext";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Calendar,
//   MapPin,
//   CreditCard,
//   Clock,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";
// import { generateBusTicket } from "../utils/ticketGenerator";
// import jsPDF from "../utils/pdf";
// import Swal from "sweetalert2";
// import { toast } from "react-hot-toast";

// export default function Bookings() {
//   const { token } = useContext(AuthContext);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [role, setRole] = useState("user"); // ✅ detect role from token

//   // ✅ Decode role from token (same logic as Profile.jsx)
//   useEffect(() => {
//     if (token) {
//       try {
//         const decoded = JSON.parse(atob(token.split(".")[1]));
//         setRole(decoded.role || "user");
//       } catch (err) {
//         console.warn("Invalid token or missing role, defaulting to user");
//         setRole("user");
//       }
//     }
//   }, [token]);

//   // ✅ Fetch Bookings (based on detected role)
//   useEffect(() => {
//     if (!token) return;

//     const fetchBookings = async () => {
//       try {
//         setLoading(true);

//         // Choose correct endpoint dynamically
//         const endpoint =
//           role === "agent" ? "/api/agent/my-bookings" : "/api/bookings/me";

//         const { data } = await API.get(endpoint, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const bookingData = data.bookings || data;
//         setBookings(bookingData);
//       } catch (err) {
//         console.error("❌ Fetch bookings error:", err);
//         Swal.fire("Error", "Failed to load bookings", "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [token, role]);

//   // ✅ Cancel booking (only available for users, not agents)
//   const handleCancelBooking = async (bookingId) => {
//     if (role === "agent") {
//       return Swal.fire(
//         "Agents cannot cancel bookings",
//         "Agent bookings are confirmed instantly.",
//         "info"
//       );
//     }

//     try {
//       await API.put(
//         `/api/bookings/${bookingId}/cancel`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       toast.success("Booking cancelled successfully ✅");

//       setBookings((prev) =>
//         prev.map((b) =>
//           b._id === bookingId ? { ...b, status: "cancelled" } : b
//         )
//       );

//       setSelectedBooking(null);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to cancel booking");
//     }
//   };

//   // 🕒 Loading state
//   if (loading)
//     return (
//       <div className="text-center text-gray-600 mt-10">
//         Loading your bookings...
//       </div>
//     );

//   // 🚫 No bookings found
//   if (!bookings.length)
//     return (
//       <div className="text-center text-gray-500 mt-10">No bookings found.</div>
//     );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">
//           {role === "agent" ? "Agent Bookings" : "My Bookings"}
//         </h1>

//         {bookings.length === 0 ? (
//           <div className="bg-white rounded-xl p-8 shadow text-center text-gray-500">
//             You don't have any bookings yet.
//           </div>
//         ) : (
//           <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//             {bookings.map((booking) => {
//               const schedule = booking.scheduleId;
//               const isCompleted =
//                 booking.paid && new Date(schedule?.departureTime) < new Date();
//               const isCancelled = booking.status === "cancelled";

//               return (
//                 <motion.div
//                   key={booking._id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 hover:shadow-2xl transition cursor-pointer"
//                   onClick={() => setSelectedBooking(booking)}
//                 >
//                   <div className="flex justify-between items-center mb-3">
//                     <h3 className="font-semibold text-lg text-gray-800">
//                       {booking.busName ? `${booking.busName}` : "Bus Trip"}
//                     </h3>

//                     {isCancelled ? (
//                       <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-600 flex items-center gap-1">
//                         <XCircle size={16} /> Cancelled
//                       </span>
//                     ) : isCompleted ? (
//                       <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-600 flex items-center gap-1">
//                         <CheckCircle size={16} /> Completed
//                       </span>
//                     ) : (
//                       <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-600 flex items-center gap-1">
//                         <Clock size={16} /> Upcoming
//                       </span>
//                     )}
//                   </div>

//                   <div className="text-sm space-y-2 text-gray-600">
//                     <h2 className="font-semibold text-md text-gray-800">
//                       {booking.busName ? ` ${booking.busNumber}` : "Bus No"}
//                     </h2>
//                     <div className="flex items-center gap-2">
//                       <Calendar size={16} />
//                       {new Date(booking.date).toLocaleDateString()}
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <MapPin size={16} />
//                       {booking.origin} → {booking.destination}
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <CreditCard size={16} />₹ {booking.totalAmount}
//                     </div>
//                   </div>

//                   <div className="mt-3 text-xs text-gray-500">
//                     Seats:{" "}
//                     {booking.passengers?.map((p) => p.seatLabel).join(", ")}
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* 🪄 Booking Details Modal */}
//       <AnimatePresence>
//         {selectedBooking && (
//           <>
//             <motion.div
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setSelectedBooking(null)}
//             />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               transition={{ duration: 0.2 }}
//               className="fixed inset-0 flex justify-center items-center z-50 px-4"
//             >
//               <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
//                 <button
//                   onClick={() => setSelectedBooking(null)}
//                   className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
//                 >
//                   ✕
//                 </button>
//                 <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
//                 <div className="space-y-3 text-gray-700">
//                   <p>
//                     <strong>Route:</strong> {selectedBooking.origin} →{" "}
//                     {selectedBooking.destination}
//                   </p>
//                   <p>
//                     <strong>Date:</strong>{" "}
//                     {new Date(selectedBooking.date).toLocaleDateString()}
//                   </p>

//                   <p>
//                     <strong>From:</strong>{" "}
//                     {selectedBooking.origin}
//                   </p>
//                   <p>
//                     <strong>To:</strong> {selectedBooking.destination}
//                   </p>
//                   <p>
//                     <strong>Seats:</strong>{" "}
//                     {selectedBooking.passengers
//                       ?.map((p) => p.seatLabel)
//                       .join(", ")}
//                   </p>
//                   <p>
//                     <strong>Amount:</strong> ₹{selectedBooking.totalAmount}
//                   </p>
//                   <p>
//                     <strong>Status:</strong>{" "}
//                     {selectedBooking.paid ? "Paid" : "Pending"}
//                   </p>

//                   {/* ✅ Agent doesn’t need cancel or payment options */}
//                   {role === "agent" ? (
//                     <button
//                       onClick={() => generateBusTicket(selectedBooking)}
//                       className="mt-4 w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:opacity-90 transition"
//                     >
//                       🧾 Download Ticket
//                     </button>
//                   ) : (
//                     <>
//                       <button
//                         onClick={() => generateBusTicket(selectedBooking)}
//                         className="mt-4 w-full py-2 rounded-lg bg-emerald-600 text-white font-medium hover:opacity-90 transition"
//                       >
//                         🧾 Download Ticket
//                       </button>

//                       {selectedBooking.status !== "cancelled" && (
//                         <button
//                           onClick={() =>
//                             handleCancelBooking(selectedBooking._id)
//                           }
//                           className="mt-4 w-full py-2 rounded-lg bg-rose-600 text-white font-medium hover:opacity-90 transition"
//                         >
//                           ❌ Cancel Booking
//                         </button>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

import React, { useEffect, useState, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { generateBusTicket } from "../utils/ticketGenerator";
import jsPDF from "../utils/pdf";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

export default function Bookings() {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [role, setRole] = useState("user");

  // ✅ Decode role from token
  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setRole(decoded.role || "user");
      } catch {
        setRole("user");
      }
    }
  }, [token]);

  // ✅ Fetch bookings
  useEffect(() => {
    if (!token) return;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const endpoint =
          role === "agent" ? "/api/agent/my-bookings" : "/api/bookings/me";

        const { data } = await API.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const bookingData = data.bookings || data;

        // ✅ Normalize shape for both agent & user
        const normalized = bookingData.map((b) => {
          if (b.bookedBy === "agent") return b; // already flat

          const s = b.scheduleId || {};
          return {
            _id: b._id,
            bookingId: b._id,
            bookedBy: b.bookedBy || "user",
            busName: s.busName || s.busId?.name || "—",
            busNumber: s.busNumber || s.busId?.number || "—",
            origin: s.route?.from || "—",
            destination: s.route?.to || "—",
            date: s.date || b.date || "—",
            departureTime: s.departureTime || "",
            arrivalTime: s.arrivalTime || "",
            passengers: b.passengers || [],
            seats: b.seats || {},
            totalAmount: b.totalAmount || 0,
            status: b.status,
            paid: b.paid,
          };
        });

        setBookings(normalized);
      } catch (err) {
        console.error("❌ Fetch bookings error:", err);
        Swal.fire("Error", "Failed to load bookings", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token, role]);

  // ✅ Cancel booking
  const handleCancelBooking = async (bookingId) => {
    if (role === "agent") {
      return Swal.fire(
        "Agents cannot cancel bookings",
        "Agent bookings are confirmed instantly.",
        "info"
      );
    }

    try {
      await API.put(
        `/api/bookings/${bookingId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Booking cancelled successfully ✅");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
      setSelectedBooking(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  // 🕒 Loading
  if (loading)
    return (
      <div className="text-center text-gray-600 mt-10">
        Loading your bookings...
      </div>
    );

  // 🚫 No bookings
  if (!bookings.length)
    return (
      <div className="text-center text-gray-500 mt-10">No bookings found.</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {role === "agent" ? "Agent Bookings" : "My Bookings"}
        </h1>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => {
            const isCancelled = booking.status === "cancelled";
            const isCompleted =
              booking.paid &&
              booking.date &&
              new Date(booking.date) < new Date();

            return (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-5 border border-gray-100 hover:shadow-2xl transition cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {booking.busName
                      ? `${booking.busName} (${booking.busNumber})`
                      : "Bus Trip"}
                  </h3>

                  {isCancelled ? (
                    <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-600 flex items-center gap-1">
                      <XCircle size={16} /> Cancelled
                    </span>
                  ) : isCompleted ? (
                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-600 flex items-center gap-1">
                      <CheckCircle size={16} /> Completed
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-600 flex items-center gap-1">
                      <Clock size={16} /> Upcoming
                    </span>
                  )}
                </div>

                <div className="text-sm space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {booking.date
                      ? new Date(booking.date).toLocaleDateString()
                      : "—"}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {booking.origin} → {booking.destination}
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} />₹ {booking.totalAmount}
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Seats: {booking.passengers?.map((p) => p.seatLabel).join(", ")}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 🪄 Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 flex justify-center items-center z-50 px-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ✕
                </button>
                <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Route:</strong> {selectedBooking.origin} →{" "}
                    {selectedBooking.destination}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {selectedBooking.date
                      ? new Date(selectedBooking.date).toLocaleDateString()
                      : "—"}
                  </p>
                  <p>
                    <strong>Seats:</strong>{" "}
                    {selectedBooking.passengers
                      ?.map((p) => p.seatLabel)
                      .join(", ")}
                  </p>
                  <p>
                    <strong>Amount:</strong> ₹{selectedBooking.totalAmount}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {selectedBooking.paid ? "Paid" : "Pending"}
                  </p>

                  {role === "agent" ? (
                    <button
                      onClick={() => generateBusTicket(selectedBooking)}
                      className="mt-4 w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:opacity-90 transition"
                    >
                      🧾 Download Ticket
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => generateBusTicket(selectedBooking)}
                        className="mt-4 w-full py-2 rounded-lg bg-emerald-600 text-white font-medium hover:opacity-90 transition"
                      >
                        🧾 Download Ticket
                      </button>
                      {selectedBooking.status !== "cancelled" && (
                        <button
                          onClick={() =>
                            handleCancelBooking(selectedBooking._id)
                          }
                          className="mt-4 w-full py-2 rounded-lg bg-rose-600 text-white font-medium hover:opacity-90 transition"
                        >
                          ❌ Cancel Booking
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

