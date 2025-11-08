import React, { useEffect, useState } from "react";
import API from "../../api";
import {
  Trash2,
  Pencil,
  ThermometerSun,
  Loader2,
  Shuffle,
  Star,
  MapPin,
  Info,
  X,
  BusFront,
  Ticket,
  Layers,
  Calendar,
  IndianRupee,
  Clock,
  Wifi,
  Zap,
  Droplet,
  Snowflake,
  BedSingle,
  Armchair,
  BookOpen,
  CupSoda,
  LampDesk,
  Upload,
} from "lucide-react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../ui/ColorfulButton";

const ViewBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    number: "",
    acType: "AC",
    totalSeats: 0,
    alternating: false,
      drivers: [],
  boardingPoints: [],
  droppingPoints: [],
    isSpecial: false,
    remarks: "",
  });
        const token = localStorage.getItem("adminToken")

  const amenityIcons = {
    wifi: { icon: Wifi, label: "Wi-Fi", color: "text-green-600" },
    charging: { icon: Zap, label: "Charging", color: "text-yellow-500" },
    water: { icon: Droplet, label: "Water Bottle", color: "text-blue-500" },
    blanket: { icon: Snowflake, label: "Blanket", color: "text-cyan-500" },
    reading_light: {
      icon: LampDesk,
      label: "Reading Light",
      color: "text-amber-500",
    },
    snacks: { icon: CupSoda, label: "Snacks", color: "text-rose-500" },
  };

  const formatTo12Hour = (datetime) => {
    if (!datetime) return "";
    const date = new Date(datetime);
    let hour = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12; // 0 becomes 12
    return `${hour}:${minutes} ${ampm}`;
  };

  // ✅ Fetch all buses
  const fetchBuses = async () => {
    try {
      const { data } = await API.get("/api/buses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  useEffect(() => {
    if (selectedBus) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedBus]);

  // 🗑️ Delete bus
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Bus?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      await API.delete(`/api/buses/${id}`, {
         headers: { Authorization: `Bearer ${token}` },
      });
      setBuses((prev) => prev.filter((bus) => bus._id !== id));
      Swal.fire("Deleted!", "Bus has been removed.", "success");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to delete",
        "error"
      );
    }
  };

  // 📝 View details modal
  const handleViewDetails = (bus) => {
    setSelectedBus(bus);
    setEditMode(false);
    setForm({
      name: bus.name,
      number: bus.number,
      acType: bus.acType,
      totalSeats: bus.totalSeats,
      alternating: bus.alternating,
      drivers: bus.drivers,
  boardingPoints: bus.boardingPoints,
  droppingPoints:bus.droppingPoints,
      isSpecial: bus.isSpecial,
      remarks: bus.remarks || "",
    });
  };

  // ✏️ Edit bus
  const handleEditBus = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      number: form.number,
      acType: form.acType,
      totalSeats: form.totalSeats,
      departureTime: form.departureTime,
      arrivalTime: form.arrivalTime,
      remarks: form.remarks,
      routes: form.routes,
      seatConfigs: form.seatConfigs,
      amenities: form.amenities || [],
            drivers: form.drivers || [],
  boardingPoints: form.boardingPoints || [],
  droppingPoints:form.droppingPoints || [],
      updatedGallery: form.updatedGallery || [],
      imageUrl: form.imageUrl || "",
      gallery: form.gallery || [],
    };

    try {
      await API.put(`/api/buses/${selectedBus._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("✅ Success", "Bus updated successfully!", "success");
      setEditMode(false);
      // refreshBuses();
    } catch (err) {
      console.log(err);
      Swal.fire(
        "❌ Error",
        err.response?.data?.message || err.message || "Update failed",
        "error"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-gray-500">
        <Loader2 className="animate-spin mr-2" />
        Loading buses...
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200 mt-8">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
        🧾 Manage Buses
      </h2>

      {buses.length === 0 ? (
        <div className="text-center text-gray-500 py-6">No buses found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-indigo-100 text-gray-800 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Number</th>
                <th className="p-3">AC Type</th>
                <th className="p-3">Seats</th>
                <th className="p-3">Routes</th>
                <th className="p-3">Alt</th>
                <th className="p-3">Special</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr
                  key={bus._id}
                  className="border-b hover:bg-indigo-50 transition"
                >
                  <td className="p-3 font-medium">{bus.name}</td>
                  <td className="p-3">{bus.number}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bus.acType === "AC"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      <ThermometerSun size={12} className="inline mr-1" />
                      {bus.acType}
                    </span>
                  </td>
                  <td className="p-3">{bus.totalSeats}</td>
                  <td className="p-3">
                    {bus.routes?.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {bus.routes.map((r, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-gray-600 text-xs bg-indigo-50 px-2 py-1 rounded-full"
                          >
                            <MapPin size={12} className="text-indigo-500" />
                            {r.from} → {r.to}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic">
                        No route
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {bus.alternating ? (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                        <Shuffle size={14} /> Yes
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">No</span>
                    )}
                  </td>
                  <td className="p-3">
                    {bus.isSpecial ? (
                      <span className="flex items-center gap-1 text-yellow-600 text-xs font-medium">
                        <Star size={14} /> Special
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Normal</span>
                    )}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleViewDetails(bus)}
                      className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
                      title="View Bus"
                    >
                      <Info size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(bus._id)}
                      className="p-2 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-600 transition"
                      title="Delete Bus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🪄 View / Edit Modal */}
      <AnimatePresence>
        {selectedBus && (
          <>
            {/* 🌫️ Background Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBus(null)}
            />

            {/* 🪟 Modal Container (Centered) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 grid place-items-center p-4 mt-24"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto border border-gray-100"
              >
                {/* ❌ Close Button */}
                <button
                  onClick={() => setSelectedBus(null)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  {editMode ? "Edit Bus" : "Bus Details"}
                </h2>

                {/* 📝 Modal Content */}
                {!editMode ? (
                  <div className="space-y-6 text-gray-800">
                    {/* 🚌 Header */}
                    <div className="bg-indigo-600 text-white rounded-xl p-5 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                          <BusFront size={26} /> {selectedBus.name}
                        </h2>
                        <p className="text-sm opacity-90">
                          {selectedBus.number}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block bg-white/20 rounded-lg px-3 py-1 text-sm font-medium mr-2">
                          {selectedBus.acType}
                        </span>
                        {selectedBus.alternating && (
                          <span className="inline-block bg-green-500/20 text-green-200 rounded-lg px-3 py-1 text-sm font-medium">
                            Alternating
                          </span>
                        )}
                        {selectedBus.isSpecial && (
                          <span className="inline-block bg-yellow-500/20 text-yellow-200 rounded-lg px-3 py-1 text-sm font-medium ml-2">
                            Special
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ✨ Dynamic Amenities Row */}
                    {selectedBus.amenities?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-4 bg-gray-50 border rounded-lg p-3 shadow-sm">
                        {selectedBus.amenities.map((a) => {
                          const {
                            icon: Icon,
                            label,
                            color,
                          } = amenityIcons[a] || {};
                          return (
                            <div
                              key={a}
                              className="flex items-center gap-2 text-gray-700"
                            >
                              {Icon && <Icon size={20} className={color} />}
                              <span className="text-sm font-medium">
                                {label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {/* ⏰ Timing + Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 bg-gray-50 border rounded-lg p-3 shadow-sm">
                        <Clock className="text-blue-600" size={22} />
                        <div>
                          <p className="font-semibold">Departure</p>
                          <p className="text-sm">
                            {selectedBus.departureTime || "—"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 border rounded-lg p-3 shadow-sm">
                        <Clock className="text-indigo-600" size={22} />
                        <div>
                          <p className="font-semibold">Arrival</p>
                          <p className="text-sm">
                            {selectedBus.arrivalTime || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 🧭 Routes */}
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                        <MapPin size={20} className="text-blue-600" /> Routes
                      </h3>
                      {selectedBus.routes?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedBus.routes.map((r, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-full bg-blue-50 border text-blue-700 text-sm shadow-sm"
                            >
                              {r.from} → {r.to}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">No routes</p>
                      )}
                    </div>

                    {/* 🪑 Seat Configurations with Fare */}
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                        <Layers size={20} className="text-green-600" /> Seat
                        Configurations
                      </h3>
                      {selectedBus.seatConfigs?.length ? (
                        <div className="grid grid-cols-1 divide-y rounded-xl overflow-hidden border bg-white shadow-sm">
                          {selectedBus.seatConfigs.map((config, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center py-3 px-4 hover:bg-gray-50 transition"
                            >
                              <div>
                                <p className="font-semibold capitalize">
                                  {config.type}{" "}
                                  {config.category && `(${config.category})`}
                                  {config.deck && ` - ${config.deck}`}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {config.total} seats
                                </p>
                              </div>
                              <div className="flex items-center gap-1 text-green-700 font-semibold">
                                <IndianRupee size={18} /> {config.fare || 0}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">
                          No seat configurations
                        </p>
                      )}
                    </div>

                    {/* 🚍 Driver Details */}
{/* 🚍 Driver Details */}
{selectedBus.drivers?.length > 0 && (
  <div>
    <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
      <BusFront size={20} className="text-green-600" /> Driver Details
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {selectedBus.drivers.map((d, i) => (
        <div
          key={i}
          className="border rounded-lg p-4 bg-gray-50 shadow-sm flex flex-col items-start"
        >
          {d.photoUrl && (
            <img
              src={d.photoUrl}
              alt={d.name}
              className="h-20 w-20 object-cover rounded-full mb-2 border"
            />
          )}
          <p className="font-semibold text-gray-800">{d.name}</p>
          <p className="text-sm text-gray-600">📞 {d.phone}</p>
          {d.licenseNumber && (
            <p className="text-sm text-gray-600">
              License: {d.licenseNumber}
            </p>
          )}
          {d.experience && (
            <p className="text-sm text-gray-600">
              Experience: {d.experience} yrs
            </p>
          )}
          {d.address && (
            <p className="text-sm text-gray-600">🏠 {d.address}</p>
          )}
          {d.emergencyContact && (
            <p className="text-sm text-gray-600">
              🚨 Emergency: {d.emergencyContact}
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
)}

{/* 🏁 Boarding Points */}
{selectedBus.boardingPoints?.length > 0 && (
  <div>
    <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
      <MapPin size={20} className="text-indigo-600" /> Boarding Points
    </h3>
    <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
      {selectedBus.boardingPoints.map((bp, i) => (
        <li key={i}>
          {bp.location} — {bp.time || "N/A"}
        </li>
      ))}
    </ul>
  </div>
)}

{/* 🎯 Dropping Points */}
{selectedBus.droppingPoints?.length > 0 && (
  <div>
    <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
      <MapPin size={20} className="text-rose-600" /> Dropping Points
    </h3>
    <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
      {selectedBus.droppingPoints.map((dp, i) => (
        <li key={i}>
          {dp.location} — {dp.time || "N/A"}
        </li>
      ))}
    </ul>
  </div>
)}


                    {/* 📅 Special Dates */}
                    {selectedBus.specialDates?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                          <Calendar size={20} className="text-indigo-600" />{" "}
                          Special Dates
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedBus.specialDates.map((date, i) => (
                            <span
                              key={i}
                              className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full shadow-sm"
                            >
                              {date}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 📝 Remarks */}
                    {selectedBus.remarks && (
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                          <Info size={20} className="text-gray-600" /> Remarks
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedBus.remarks}
                        </p>
                      </div>
                    )}

                    {/* 🖼 Image Section */}
                    {selectedBus.imageUrl && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Bus Image
                        </h3>
                        <div className="rounded-xl overflow-hidden shadow-lg border">
                          <img
                            src={selectedBus.imageUrl}
                            alt={selectedBus.name}
                            className="w-full h-56 object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* 🖼 Gallery */}
                    {selectedBus.gallery?.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Gallery</h3>
                        <div className="grid grid-cols-3 gap-2">
                          {selectedBus.gallery.map((img, i) => (
                            <div
                              key={i}
                              className="overflow-hidden rounded-lg shadow-sm"
                            >
                              <img
                                src={img}
                                alt={`Gallery ${i + 1}`}
                                className="w-full h-24 object-cover hover:scale-105 transition"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <Button
                      onClick={() => setEditMode(true)}
                      variant="solid"
                      color="purple"
                    >
                      Edit Bus
                    </Button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleEditBus}
                    className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
                  >
                    {/* Basic Info */}
                    <div className="space-y-2">
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Bus Name"
                        className="w-full border p-2 rounded"
                      />
                      <input
                        type="text"
                        name="number"
                        value={form.number}
                        onChange={handleChange}
                        placeholder="Bus Number"
                        className="w-full border p-2 rounded"
                      />
                      <select
                        name="acType"
                        value={form.acType}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                      >
                        <option value="AC">AC</option>
                        <option value="Non-AC">Non-AC</option>
                      </select>
                      <input
                        type="number"
                        name="totalSeats"
                        value={form.totalSeats}
                        onChange={handleChange}
                        placeholder="Total Seats"
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    {/* ⏰ Timings */}
                    {/* ⏰ Timings */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Departure */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Departure Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          name="departureTime"
                          value={form.departureTime || ""}
                          onChange={handleChange}
                          className="w-full border p-2 rounded"
                        />
                        {form.departureTime && (
                          <p className="mt-1 text-sm text-gray-700">
                            🕒 {formatTo12Hour(form.departureTime)}
                          </p>
                        )}
                      </div>

                      {/* Arrival */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Arrival Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          name="arrivalTime"
                          value={form.arrivalTime || ""}
                          onChange={handleChange}
                          className="w-full border p-2 rounded"
                        />
                        {form.arrivalTime && (
                          <p className="mt-1 text-sm text-gray-700">
                            🕒 {formatTo12Hour(form.arrivalTime)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 🪑 Seat Configurations */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-800">
                          Seat Configurations
                        </h3>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              seatConfigs: [
                                ...(prev.seatConfigs || []),
                                {
                                  type: "",
                                  category: "",
                                  deck: "",
                                  total: 0,
                                  fare: 0,
                                },
                              ],
                            }))
                          }
                          className="text-sm bg-indigo-100 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-200"
                        >
                          + Add
                        </button>
                      </div>
                      {(form.seatConfigs || []).map((config, idx) => (
                        <div key={idx} className="flex gap-2 mb-2 flex-wrap">
                          <select
                            value={config.type}
                            onChange={(e) => {
                              const updated = [...form.seatConfigs];
                              updated[idx].type = e.target.value;
                              setForm({ ...form, seatConfigs: updated });
                            }}
                            className="border p-2 rounded flex-1 min-w-[100px]"
                          >
                            <option value="">Type</option>
                            <option value="sleeper">Sleeper</option>
                            <option value="seater">Seater</option>
                          </select>

                          <select
                            value={config.category}
                            onChange={(e) => {
                              const updated = [...form.seatConfigs];
                              updated[idx].category = e.target.value;
                              setForm({ ...form, seatConfigs: updated });
                            }}
                            className="border p-2 rounded flex-1 min-w-[100px]"
                          >
                            <option value="">Category</option>
                            <option value="single">Single</option>
                            <option value="double">Double</option>
                          </select>

                          <input
                            type="text"
                            placeholder="Deck"
                            value={config.deck || ""}
                            onChange={(e) => {
                              const updated = [...form.seatConfigs];
                              updated[idx].deck = e.target.value;
                              setForm({ ...form, seatConfigs: updated });
                            }}
                            className="border p-2 rounded flex-1 min-w-[100px]"
                          />

                          <input
                            type="number"
                            placeholder="Total"
                            value={config.total}
                            onChange={(e) => {
                              const updated = [...form.seatConfigs];
                              updated[idx].total = e.target.value;
                              setForm({ ...form, seatConfigs: updated });
                            }}
                            className="border p-2 rounded flex-1 min-w-[80px]"
                          />

                          <input
                            type="number"
                            placeholder="Fare ₹"
                            value={config.fare || ""}
                            onChange={(e) => {
                              const updated = [...form.seatConfigs];
                              updated[idx].fare = e.target.value;
                              setForm({ ...form, seatConfigs: updated });
                            }}
                            className="border p-2 rounded flex-1 min-w-[80px]"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              const updated = form.seatConfigs.filter(
                                (_, i) => i !== idx
                              );
                              setForm({ ...form, seatConfigs: updated });
                            }}
                            className="text-rose-600 hover:text-rose-800"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* 🧭 Routes */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-800">Routes</h3>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              routes: [
                                ...(prev.routes || []),
                                { from: "", to: "" },
                              ],
                            }))
                          }
                          className="text-sm bg-indigo-100 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-200"
                        >
                          + Add
                        </button>
                      </div>
                      {(form.routes || []).map((route, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="From"
                            value={route.from}
                            onChange={(e) => {
                              const updated = [...form.routes];
                              updated[idx].from = e.target.value;
                              setForm({ ...form, routes: updated });
                            }}
                            className="border p-2 rounded w-1/2"
                          />
                          <input
                            type="text"
                            placeholder="To"
                            value={route.to}
                            onChange={(e) => {
                              const updated = [...form.routes];
                              updated[idx].to = e.target.value;
                              setForm({ ...form, routes: updated });
                            }}
                            className="border p-2 rounded w-1/2"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = form.routes.filter(
                                (_, i) => i !== idx
                              );
                              setForm({ ...form, routes: updated });
                            }}
                            className="text-rose-600 hover:text-rose-800"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

{/* 🚍 Driver Details */}
<div>
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold text-gray-800">Driver Details</h3>
    <button
      type="button"
      onClick={() =>
        setForm((prev) => ({
          ...prev,
          drivers: [
            ...(prev.drivers || []),
            {
              name: "",
              phone: "",
              licenseNumber: "",
              experience: "",
              address: "",
              emergencyContact: "",
              photoUrl: "",
            },
          ],
        }))
      }
      className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded hover:bg-green-200"
    >
      + Add
    </button>
  </div>

  {(form.drivers || []).map((d, idx) => (
    <div
      key={idx}
      className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2 p-3 border rounded-lg bg-gray-50"
    >
      <input
        type="text"
        placeholder="Driver Name"
        value={d.name}
        onChange={(e) => {
          const updated = [...form.drivers];
          updated[idx].name = e.target.value;
          setForm({ ...form, drivers: updated });
        }}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Phone"
        value={d.phone || ""}
        onChange={(e) => {
          const updated = [...form.drivers];
          updated[idx].phone = e.target.value;
          setForm({ ...form, drivers: updated });
        }}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="License Number"
        value={d.licenseNumber || ""}
        onChange={(e) => {
          const updated = [...form.drivers];
          updated[idx].licenseNumber = e.target.value;
          setForm({ ...form, drivers: updated });
        }}
        className="border p-2 rounded"
      />
      <input
        type="number"
        placeholder="Experience (yrs)"
        value={d.experience || ""}
        onChange={(e) => {
          const updated = [...form.drivers];
          updated[idx].experience = e.target.value;
          setForm({ ...form, drivers: updated });
        }}
        className="border p-2 rounded"
      />
      <input
        type="text"
        placeholder="Address"
        value={d.address || ""}
        onChange={(e) => {
          const updated = [...form.drivers];
          updated[idx].address = e.target.value;
          setForm({ ...form, drivers: updated });
        }}
        className="border p-2 rounded sm:col-span-2"
      />
      <input
        type="text"
        placeholder="Emergency Contact"
        value={d.emergencyContact || ""}
        onChange={(e) => {
          const updated = [...form.drivers];
          updated[idx].emergencyContact = e.target.value;
          setForm({ ...form, drivers: updated });
        }}
        className="border p-2 rounded"
      />
      <input
        type="url"
        placeholder="Photo URL"
        value={d.photoUrl || ""}
        onChange={(e) => {
          const updated = [...form.drivers];
          updated[idx].photoUrl = e.target.value;
          setForm({ ...form, drivers: updated });
        }}
        className="border p-2 rounded"
      />
      {d.photoUrl && (
        <div className="col-span-2 flex justify-center mt-2">
          <img
            src={d.photoUrl}
            alt={d.name}
            className="h-20 w-20 rounded-full border object-cover"
          />
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          const updated = form.drivers.filter((_, i) => i !== idx);
          setForm({ ...form, drivers: updated });
        }}
        className="text-rose-600 hover:text-rose-800 text-sm col-span-2 text-right"
      >
        ✕ Remove
      </button>
    </div>
  ))}
</div>

{/* 🏁 Boarding Points */}
<div>
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold text-gray-800">Boarding Points</h3>
    <button
      type="button"
      onClick={() =>
        setForm((prev) => ({
          ...prev,
          boardingPoints: [
            ...(prev.boardingPoints || []),
            { location: "", time: "" },
          ],
        }))
      }
      className="text-sm bg-indigo-100 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-200"
    >
      + Add
    </button>
  </div>
  {(form.boardingPoints || []).map((bp, idx) => (
    <div key={idx} className="flex gap-2 mb-2">
      <input
        type="text"
        placeholder="Location"
        value={bp.location}
        onChange={(e) => {
          const updated = [...form.boardingPoints];
          updated[idx].location = e.target.value;
          setForm({ ...form, boardingPoints: updated });
        }}
        className="border p-2 rounded w-1/2"
      />
      <input
        type="time"
        value={bp.time}
        onChange={(e) => {
          const updated = [...form.boardingPoints];
          updated[idx].time = e.target.value;
          setForm({ ...form, boardingPoints: updated });
        }}
        className="border p-2 rounded w-1/2"
      />
      <button
        type="button"
        onClick={() => {
          const updated = form.boardingPoints.filter((_, i) => i !== idx);
          setForm({ ...form, boardingPoints: updated });
        }}
        className="text-rose-600 hover:text-rose-800"
      >
        ✕
      </button>
    </div>
  ))}
</div>

{/* 🎯 Dropping Points */}
<div>
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold text-gray-800">Dropping Points</h3>
    <button
      type="button"
      onClick={() =>
        setForm((prev) => ({
          ...prev,
          droppingPoints: [
            ...(prev.droppingPoints || []),
            { location: "", time: "" },
          ],
        }))
      }
      className="text-sm bg-rose-100 text-rose-600 px-2 py-1 rounded hover:bg-rose-200"
    >
      + Add
    </button>
  </div>
  {(form.droppingPoints || []).map((dp, idx) => (
    <div key={idx} className="flex gap-2 mb-2">
      <input
        type="text"
        placeholder="Location"
        value={dp.location}
        onChange={(e) => {
          const updated = [...form.droppingPoints];
          updated[idx].location = e.target.value;
          setForm({ ...form, droppingPoints: updated });
        }}
        className="border p-2 rounded w-1/2"
      />
      <input
        type="time"
        value={dp.time}
        onChange={(e) => {
          const updated = [...form.droppingPoints];
          updated[idx].time = e.target.value;
          setForm({ ...form, droppingPoints: updated });
        }}
        className="border p-2 rounded w-1/2"
      />
      <button
        type="button"
        onClick={() => {
          const updated = form.droppingPoints.filter((_, i) => i !== idx);
          setForm({ ...form, droppingPoints: updated });
        }}
        className="text-rose-600 hover:text-rose-800"
      >
        ✕
      </button>
    </div>
  ))}
</div>

                    {/* 🖼 Edit Image Section */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Bus Images
                      </h3>

                      {/* Main Image Preview / Upload */}
                      <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-1">
                          Main Image
                        </label>
                        <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition">
                          <label className="cursor-pointer flex flex-col items-center gap-2">
                            {form.mainImagePreview || selectedBus.imageUrl ? (
                              <img
                                src={
                                  form.mainImagePreview || selectedBus.imageUrl
                                }
                                alt="Main Bus"
                                className="mx-auto h-48 object-cover rounded-lg shadow"
                              />
                            ) : (
                              <>
                                <Upload size={24} className="text-gray-400" />
                                <span className="text-sm text-gray-500">
                                  Click to upload main image
                                </span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setForm({
                                    ...form,
                                    newMainImage: file,
                                    mainImagePreview: URL.createObjectURL(file),
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Gallery Section */}
                      <div className="mb-2">
                        <label className="block text-sm text-gray-600 mb-1">
                          Gallery Images
                        </label>
                        <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition">
                          <label className="cursor-pointer flex flex-col items-center gap-2">
                            <Upload size={24} className="text-gray-400" />
                            <span className="text-sm text-gray-500">
                              Click to upload more images
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                const files = Array.from(e.target.files);
                                const previews = files.map((file) =>
                                  URL.createObjectURL(file)
                                );
                                setForm({
                                  ...form,
                                  newGalleryImages: [
                                    ...(form.newGalleryImages || []),
                                    ...files,
                                  ],
                                  galleryPreviews: [
                                    ...(form.galleryPreviews || []),
                                    ...previews,
                                  ],
                                });
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Gallery Preview & Remove */}
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {[
                          ...(form.galleryPreviews || []),
                          ...(selectedBus.gallery || []),
                        ].map((src, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={src}
                              alt={`Gallery ${idx}`}
                              className="rounded-lg h-24 w-full object-cover shadow"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                // if it's newly added
                                if (idx < (form.galleryPreviews?.length || 0)) {
                                  const updatedPreviews = [
                                    ...form.galleryPreviews,
                                  ];
                                  updatedPreviews.splice(idx, 1);
                                  const updatedFiles = [
                                    ...form.newGalleryImages,
                                  ];
                                  updatedFiles.splice(idx, 1);
                                  setForm({
                                    ...form,
                                    galleryPreviews: updatedPreviews,
                                    newGalleryImages: updatedFiles,
                                  });
                                } else {
                                  // if it's an existing image, mark for deletion
                                  const existingIdx =
                                    idx - (form.galleryPreviews?.length || 0);
                                  const updatedExisting =
                                    selectedBus.gallery.filter(
                                      (_, i) => i !== existingIdx
                                    );
                                  setForm({
                                    ...form,
                                    updatedGallery: updatedExisting,
                                  });
                                }
                              }}
                              className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full px-1 py-0.5 opacity-0 group-hover:opacity-100 transition"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 🔁 Alternating / Special */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="alternating"
                          checked={form.alternating}
                          onChange={handleChange}
                        />
                        Alternating Bus
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="isSpecial"
                          checked={form.isSpecial}
                          onChange={handleChange}
                        />
                        Special Bus
                      </label>
                      <textarea
                        name="remarks"
                        value={form.remarks}
                        onChange={handleChange}
                        placeholder="Remarks"
                        className="w-full border p-2 rounded"
                      ></textarea>
                    </div>

                    {/* ✅ Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => setEditMode(false)}
                        variant="solid"
                        color="red"
                      >
                        Cancel
                      </Button>

                      <Button type="submit" variant="solid" color="purple">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewBuses;
