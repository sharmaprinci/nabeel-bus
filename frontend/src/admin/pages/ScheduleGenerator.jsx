import React, { useState, useEffect } from "react";
import API from "../../api";
import { CalendarDays, Bus, PlusCircle } from "lucide-react";
import Button from "../../ui/ColorfulButton";

const ScheduleGenerator = () => {
  const [busNumber, setBusNumber] = useState("");
  const [date, setDate] = useState("");
  const [busNumbers, setBusNumbers] = useState([]);
  
    const token = localStorage.getItem("adminToken")
  // 🔹 Fetch all bus numbers for dropdown
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const { data } = await API.get("/api/buses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBusNumbers(data.map((b) => b.number));
      } catch (err) {
        console.error("Failed to fetch buses", err);
      }
    };
    fetchBuses();
  }, []);

  const handleGenerate = async () => {
    if (!busNumber || !date) {
      alert("❌ Please select a bus number and date.");
      return;
    }
    try {
      await API.post("/api/buses/generate-schedule", { busNumber, date }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Schedule generated successfully!");
      setBusNumber("");
      setDate("");
    } catch (err) {
      alert(err.response?.data?.message || "Error generating schedule");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
        <CalendarDays size={24} className="text-green-600" /> Generate Schedule
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Bus Number Dropdown */}
        <div>
          <label className="text-sm text-gray-600 flex items-center gap-1 mb-1">
            <Bus size={14} /> Bus Number
          </label>
          <select
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value)}
            className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Bus Number</option>
            {busNumbers.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Date Picker */}
        <div>
          <label className="text-sm text-gray-600 flex items-center gap-1 mb-1">
            <CalendarDays size={14} /> Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Button */}
        <div className="md:col-span-2">
          {/* <button
            onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 hover:opacity-90 transition"
          >
            <PlusCircle size={20} />
            Generate Schedule
          </button> */}
          <Button onClick={handleGenerate} variant="solid" color="purple">
                  <PlusCircle size={20} /> Generate Schedule
                </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleGenerator;
