
import React, {lazy, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Clock,
  ThermometerSnowflake,
  ThermometerSun,
  BedDouble,
  Armchair,
  IndianRupee,
  ChevronRight,
  Wifi,
  BatteryCharging,
  Droplets,
  X,

} from "lucide-react";
import BookingForm from "./BookingForm";
import { motion, AnimatePresence } from "framer-motion";

const amenityIconMap = {
  wifi: { icon: Wifi, label: "Wi-Fi" },
  charging: { icon: BatteryCharging, label: "Charging" },
  water: { icon: Droplets, label: "Water" },
  blanket: { icon: Droplets, label: "Blanket" },
  pillow: { icon: Droplets, label: "Pillow" },
  reading_light: { icon: Droplets, label: "Reading Light"},
  snacks: {icon: Droplets, label: "Snacks"},
};
const calculateDuration = (dep, arr) => {
  if (!dep || !arr) return "";

  const parseTime = (timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m; // total minutes
  };

  let depMinutes, arrMinutes;
  if (/^\d{1,2}:\d{2}$/.test(dep) && /^\d{1,2}:\d{2}$/.test(arr)) {
    depMinutes = parseTime(dep);
    arrMinutes = parseTime(arr);
    if (arrMinutes < depMinutes) arrMinutes += 24 * 60; // next day
    const diff = arrMinutes - depMinutes;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return `${hours}h ${minutes}m`;
  }

  const depDate = new Date(dep);
  const arrDate = new Date(arr);
  if (isNaN(depDate) || isNaN(arrDate)) return "";

  const diff = arrDate - depDate;
  if (diff <= 0) return "";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};


const formatTimeOnly = (timeStr) => {
  if (!timeStr) return "";

  // Handle plain "HH:mm" (e.g., "21:30")
  if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
    let [hours, minutes] = timeStr.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }

  // Handle full datetime string
  const date = new Date(timeStr);
  if (isNaN(date)) return "";
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};


const SearchResults = () => {
    const [selectedBus, setSelectedBus] = useState(null);
  const { state } = useLocation();

  const navigate = useNavigate();
  

  if (!state) return <div className="text-center py-10">No search data found.</div>;

  const { buses, fromCity, toCity, date } = state;

  const handleSelectBus = (bus) => {
    setSelectedBus(bus); // ✅ Open modal
  };

  const closeModal = () => setSelectedBus(null);

  const getSeatType = (seatConfigs = []) => {
    const hasSleeper = seatConfigs.some((s) => s.type === "sleeper");
    const hasSeater = seatConfigs.some((s) => s.type === "seater");
    if (hasSleeper && hasSeater) return "Mixed";
    if (hasSleeper) return "Sleeper";
    if (hasSeater) return "Seater";
    return "Bus";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold text-gray-900">
          Buses from <span className="text-blue-600 capitalize">{fromCity}</span> to{" "}
          <span className="text-blue-600 capitalize">{toCity}</span>
        </h1>
        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mt-2">
          <CalendarDays size={18} />
          <span>{date}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{buses.length} bus(es) found</p>
      </div>

      {/* Bus Cards */}
      <div className="space-y-6">
        {buses.map((schedule) => {
          const bus = schedule.busId;
          const totalSeats = bus.totalSeats || 0;
          const availableSeats = schedule.availableSeats;
          const isAc = bus.acType?.toLowerCase().includes("ac");
          const seatType = getSeatType(bus.seatConfigs);
          const fare = bus.seatConfigs?.[0]?.fare || 0;
          const busAmenities = bus.amenities || [];
          const duration = calculateDuration(bus.departureTime, bus.arrivalTime);

          const ribbonText = fare <= 500 ? "Best Price" : "Popular";

          return (
            <div
              key={schedule._id}
              className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-blue-300 hover:border-blue-500 overflow-hidden group hover:-translate-y-1"
            >
              {/* 🎀 Diagonal Ribbon */}
<div className="absolute top-0 right-0 bg-blue-500 bg-[length:200%_100%] text-white text-xs font-semibold px-4 py-2  rounded-bl-lg shadow-md z-10 animate-[shimmer_3s_infinite]">
  {ribbonText}
</div>

              <div className="p-5 md:p-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                {/* Left Section */}
                <div className="flex flex-col gap-3 w-full md:w-2/3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {bus.name || "Bus"}
                      </h2>
                      <p className="text-sm text-gray-500 uppercase tracking-wide">
                        {bus.number}
                      </p>
                    </div>
<div className="flex items-center gap-1 bg-blue-50 px-3 py-1 mt-5 rounded-full text-blue-700 font-bold text-lg ml-auto relative z-20">
  <IndianRupee size={16} />
  {fare}
</div>

                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin size={18} className="text-blue-600" />
                    <span className="font-medium capitalize">{schedule.route.from}</span>
                    <ChevronRight size={20} className="text-gray-400" />
                    <MapPin size={18} className="text-red-500" />
                    <span className="font-medium capitalize">{schedule.route.to}</span>
                  </div>

                  {/* Timings */}
                  <div className="flex gap-6 mt-1 text-sm text-gray-600 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>Dep: {formatTimeOnly(bus.departureTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>Arr: {formatTimeOnly(bus.arrivalTime)}</span>
                    </div>
                    {duration && (
                      <div className="bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                        ⏳ {duration}
                      </div>
                    )}
                  </div>

                  {/* Type & Seats */}
                  <div className="flex gap-6 mt-2 text-sm text-gray-700 flex-wrap">
                    <div className="flex items-center gap-2">
                      {isAc ? (
                        <ThermometerSnowflake size={16} className="text-blue-600" />
                      ) : (
                        <ThermometerSun size={16} className="text-orange-500" />
                      )}
                      <span>{isAc ? "AC" : "Non-AC"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {seatType === "Sleeper" && <BedDouble size={18} />}
                      {seatType === "Seater" && <Armchair size={18} />}
                      {seatType === "Mixed" && (
                        <>
                          <Armchair size={18} />
                          <BedDouble size={18} />
                        </>
                      )}
                      <span className="capitalize">{seatType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-semibold">
                        {availableSeats}
                      </span>
                      <span className="text-gray-500">/ {totalSeats} seats</span>
                    </div>
                  </div>

                  {/* Amenities with Animation */}
                  {busAmenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 opacity-100 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                      {busAmenities.map((amenity, idx) => {
                        const amenityData = amenityIconMap[amenity.toLowerCase()];
                        if (!amenityData) return null;
                        const Icon = amenityData.icon;
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full text-xs text-gray-600 border hover:bg-blue-50 hover:text-blue-600 transition-all"
                          >
                            <Icon size={14} />
                            {amenityData.label}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Section CTA */}
                <div className="w-full md:w-auto mt-4 md:mt-0 flex items-center justify-end">
                  <button onClick={() => handleSelectBus(schedule)}
                    className="bg-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    View Seats & Book
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Booking Modal */}
      <AnimatePresence>
        {selectedBus && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
              >
                <X size={22} />
              </button>

              {/* Booking Form (pass selected bus info) */}
              <BookingForm scheduleId={selectedBus._id} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchResults;
