import React, { useEffect, useState } from "react";
import API from "../api";

const AgentDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/agent/my-bookings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("agentToken")}` },
      });
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("❌ Failed to fetch agent bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">🧾 Agent Dashboard</h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-2">Bus</th>
                <th className="px-4 py-2">Route</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Seats</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{b.busName}</td>
                  <td className="px-4 py-2">
                    {b.origin} → {b.destination}
                  </td>
                  <td className="px-4 py-2">{b.date}</td>
                  <td className="px-4 py-2">{b.seatNos?.join(", ")}</td>
                  <td className="px-4 py-2">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
