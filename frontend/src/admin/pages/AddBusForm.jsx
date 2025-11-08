import React, { useState } from "react";
import API from "../../api";
import Swal from "sweetalert2";
import {
  BusFront,
  Layers,
  MapPin,
  Clock,
  Info,
  Plus,
  Trash2,
  Upload,
  Zap,
  Wifi,
  Droplet,
  Snowflake,
  LampDesk,
  CupSoda,
  Image as ImageIcon,
} from "lucide-react";
import Button from "../../ui/ColorfulButton";


const AddBusForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    number: "",
    acType: "AC",
    totalSeats: "",
    alternating: false,
    isSpecial: false,
    remarks: "",
    departureTime: "",
    arrivalTime: "",
    seatConfigs: [],
    routes: [],
    amenities: [],
    drivers: [],             // 🆕 Added
  boardingPoints: [],      // 🆕 Added
  droppingPoints: [],      // 🆕 Added
    imageUrl: "",
    gallery: [],
  });

  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const availableAmenities = [
    { key: "wifi", label: "Wi-Fi", icon: Wifi, color: "text-green-600" },
    { key: "charging", label: "Charging", icon: Zap, color: "text-yellow-500" },
    {
      key: "water",
      label: "Water Bottle",
      icon: Droplet,
      color: "text-blue-500",
    },
    {
      key: "blanket",
      label: "Blanket",
      icon: Snowflake,
      color: "text-cyan-500",
    },
    {
      key: "reading_light",
      label: "Reading Light",
      icon: LampDesk,
      color: "text-amber-500",
    },
    { key: "snacks", label: "Snacks", icon: CupSoda, color: "text-rose-500" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSeatConfigChange = (idx, field, value) => {
    const updated = [...form.seatConfigs];
    updated[idx][field] = value;
    setForm({ ...form, seatConfigs: updated });
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImagePreview(URL.createObjectURL(file));
      setForm({ ...form, imageUrl: file });
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setGalleryPreviews((prev) => [...prev, ...previews]);
    setForm((prev) => ({ ...prev, gallery: [...prev.gallery, ...files] }));
  };

  const removeGalleryImage = (index) => {
    const updatedPreviews = galleryPreviews.filter((_, i) => i !== index);
    const updatedFiles = form.gallery.filter((_, i) => i !== index);
    setGalleryPreviews(updatedPreviews);
    setForm({ ...form, gallery: updatedFiles });
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("adminToken")
  e.preventDefault();
  try {
    const payload = {
      name: form.name,
      number: form.number,
      acType: form.acType,
      totalSeats: form.totalSeats,
      seatConfigs: form.seatConfigs,
      routes: form.routes,
      amenities: form.amenities,
      drivers: form.drivers,               // 🆕 Added
  boardingPoints: form.boardingPoints, // 🆕 Added
  droppingPoints: form.droppingPoints, // 🆕 Added
      imageUrl: form.imageUrl,   // if image URL already stored (e.g. AWS)
      gallery: form.gallery,     // array of URLs if multiple
      alternating: form.alternating,
      isSpecial: form.isSpecial,
      remarks: form.remarks,
      departureTime: form.departureTime,
      arrivalTime: form.arrivalTime,
    };

    const { data } = await API.post("/api/buses/add", payload, {
       headers: { Authorization: `Bearer ${token}` },
    }); // ✅ JSON body

    Swal.fire("✅ Success", "Bus added successfully!", "success");
    setForm({
      name: "",
      number: "",
      acType: "AC",
      totalSeats: "",
      alternating: false,
      isSpecial: false,
      remarks: "",
      seatConfigs: [],
      routes: [],
      amenities: [],
      departureTime: "",
      arrivalTime: "",
      imageUrl: "",
      gallery: [],
    });
    setMainImagePreview(null);
    setGalleryPreviews([]);
    if (onSuccess) onSuccess(data);
  } catch (err) {
    Swal.fire(
      "❌ Error",
      err.response?.data?.message || "Failed to add bus",
      "error"
    );
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-3xl mx-auto"
    >
      {/* 🟦 Header */}
      <div className="bg-indigo-600 text-white rounded-xl p-4 mb-4 shadow">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BusFront size={28} /> Add New Bus
        </h2>
        <p className="text-sm opacity-90">
          Fill out details to register a new bus
        </p>
      </div>

      {/* 🖼️ Image Upload Section */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <ImageIcon size={18} className="text-indigo-600" /> Bus Images
        </h3>

        {/* Main Image */}
        <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 mb-4 text-center cursor-pointer hover:border-blue-400">
          <label className="cursor-pointer">
            {mainImagePreview ? (
              <img
                src={mainImagePreview}
                alt="Main Preview"
                className="mx-auto h-48 object-cover rounded-lg shadow"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <Upload size={24} />
                <span className="text-sm">Click to upload main image</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Gallery Images */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Gallery Images
        </label>
        <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 mb-2 text-center hover:border-blue-400">
          <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-500">
            <Upload size={24} />
            <span className="text-sm">Click to upload multiple images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleGalleryUpload}
              className="hidden"
            />
          </label>
        </div>

        {galleryPreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {galleryPreviews.map((src, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={src}
                  alt={`Gallery ${idx}`}
                  className="rounded-lg h-24 w-full object-cover shadow"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(idx)}
                  className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded-full px-1 py-0.5 opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🚌 Basic Bus Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Bus Name"
          required
          className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="number"
          value={form.number}
          onChange={handleChange}
          placeholder="Bus Number"
          required
          className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="acType"
          value={form.acType}
          onChange={handleChange}
          className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
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
          required
          className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ⏰ Timings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1">
            <Clock size={16} /> Departure Time
          </label>
          <input
            type="time"
            name="departureTime"
            value={form.departureTime}
            onChange={handleChange}
            required
            className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1 flex items-center gap-1">
            <Clock size={16} /> Arrival Time
          </label>
          <input
            type="time"
            name="arrivalTime"
            value={form.arrivalTime}
            onChange={handleChange}
            required
            className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 🧾 Amenities */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <Info size={18} className="text-blue-600" /> Amenities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {availableAmenities.map((a) => (
            <label
              key={a.key}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={form.amenities?.includes(a.key)}
                onChange={() => {
                  const updated = form.amenities || [];
                  setForm({
                    ...form,
                    amenities: updated.includes(a.key)
                      ? updated.filter((am) => am !== a.key)
                      : [...updated, a.key],
                  });
                }}
              />
              <a.icon size={18} className={a.color} />
              {a.label}
            </label>
          ))}
        </div>
      </div>

      {/* 🪑 Seat Configurations */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Layers size={18} className="text-green-600" /> Seat Configurations
          </h3>
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                seatConfigs: [
                  ...prev.seatConfigs,
                  { type: "", category: "", deck: "", total: "", fare: "" },
                ],
              }))
            }
            className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        {form.seatConfigs.map((config, idx) => (
          <div
            key={idx}
            className="flex flex-wrap gap-2 mb-2 p-2 border rounded-lg bg-gray-50"
          >
            <select
              value={config.type}
              onChange={(e) =>
                handleSeatConfigChange(idx, "type", e.target.value)
              }
              className="border p-2 rounded flex-1 min-w-[100px]"
            >
              <option value="">Type</option>
              <option value="sleeper">Sleeper</option>
              <option value="seater">Seater</option>
            </select>

            <select
              value={config.category}
              onChange={(e) =>
                handleSeatConfigChange(idx, "category", e.target.value)
              }
              className="border p-2 rounded flex-1 min-w-[100px]"
            >
              <option value="">Category</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
            </select>

            <input
              type="text"
              placeholder="Deck"
              value={config.deck}
              onChange={(e) =>
                handleSeatConfigChange(idx, "deck", e.target.value)
              }
              className="border p-2 rounded flex-1 min-w-[100px]"
            />

            <input
              type="number"
              placeholder="Total"
              value={config.total}
              onChange={(e) =>
                handleSeatConfigChange(idx, "total", e.target.value)
              }
              className="border p-2 rounded flex-1 min-w-[80px]"
            />

            <input
              type="number"
              placeholder="Fare ₹"
              value={config.fare}
              onChange={(e) =>
                handleSeatConfigChange(idx, "fare", e.target.value)
              }
              className="border p-2 rounded flex-1 min-w-[80px]"
            />

            <button
              type="button"
              onClick={() => {
                const updated = form.seatConfigs.filter((_, i) => i !== idx);
                setForm({ ...form, seatConfigs: updated });
              }}
              className="text-rose-600 hover:text-rose-800 px-2 flex items-center"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* 🧭 Routes */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <MapPin size={18} className="text-indigo-600" /> Routes
          </h3>
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                routes: [...(prev.routes || []), { from: "", to: "" }],
              }))
            }
            className="flex items-center gap-1 text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        {(form.routes || []).map((route, idx) => (
          <div
            key={idx}
            className="flex gap-2 mb-2 p-2 border rounded-lg bg-gray-50"
          >
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
                const updated = form.routes.filter((_, i) => i !== idx);
                setForm({ ...form, routes: updated });
              }}
              className="text-rose-600 hover:text-rose-800 flex items-center"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
      {/* 🧍 Driver Details */}
{/* 🧍 Driver Details */}
<div>
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
      Drivers
    </h3>
    <button
      type="button"
      onClick={() =>
        setForm((prev) => ({
          ...prev,
          drivers: [
            ...prev.drivers,
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
      className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 flex items-center gap-1"
    >
      <Plus size={14} /> Add
    </button>
  </div>

  {form.drivers.map((driver, idx) => (
    <div
      key={idx}
      className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2 p-3 border rounded-lg bg-gray-50"
    >
      <input
        type="text"
        placeholder="Name"
        value={driver.name}
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
        value={driver.phone}
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
        value={driver.licenseNumber}
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
        value={driver.experience}
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
        value={driver.address}
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
        value={driver.emergencyContact}
        onChange={(e) => {
          const updated = [...form.drivers];
          updated[idx].emergencyContact = e.target.value;
          setForm({ ...form, drivers: updated });
        }}
        className="border p-2 rounded"
      />
      <input
        type="url"
        placeholder="Photo URL (optional)"
        value={driver.photoUrl}
        onChange={(e) => {
          const updated = [...form.drivers];
          updated[idx].photoUrl = e.target.value;
          setForm({ ...form, drivers: updated });
        }}
        className="border p-2 rounded"
      />
      {driver.photoUrl && (
        <div className="col-span-2 flex justify-center mt-2">
          <img
            src={driver.photoUrl}
            alt="Driver"
            className="h-24 w-24 rounded-full object-cover border"
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

{/* 🅿️ Boarding Points */}
<div>
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
      Boarding Points
    </h3>
    <button
      type="button"
      onClick={() =>
        setForm((prev) => ({
          ...prev,
          boardingPoints: [...prev.boardingPoints, { location: "", time: "", landmark: "" }],
        }))
      }
      className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 flex items-center gap-1"
    >
      <Plus size={14} /> Add
    </button>
  </div>

  {form.boardingPoints.map((point, idx) => (
    <div key={idx} className="flex flex-wrap gap-2 mb-2 p-2 border rounded-lg bg-gray-50">
      <input
        type="text"
        placeholder="Location"
        value={point.location}
        onChange={(e) => {
          const updated = [...form.boardingPoints];
          updated[idx].location = e.target.value;
          setForm({ ...form, boardingPoints: updated });
        }}
        className="border p-2 rounded flex-1"
      />
      <input
        type="time"
        value={point.time}
        onChange={(e) => {
          const updated = [...form.boardingPoints];
          updated[idx].time = e.target.value;
          setForm({ ...form, boardingPoints: updated });
        }}
        className="border p-2 rounded flex-1"
      />
      <input
        type="text"
        placeholder="Landmark"
        value={point.landmark}
        onChange={(e) => {
          const updated = [...form.boardingPoints];
          updated[idx].landmark = e.target.value;
          setForm({ ...form, boardingPoints: updated });
        }}
        className="border p-2 rounded flex-1"
      />
      <button
        type="button"
        onClick={() => {
          const updated = form.boardingPoints.filter((_, i) => i !== idx);
          setForm({ ...form, boardingPoints: updated });
        }}
        className="text-rose-600 hover:text-rose-800"
      >
        <Trash2 size={18} />
      </button>
    </div>
  ))}
</div>

{/* 🏁 Dropping Points */}
<div>
  <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
      Dropping Points
    </h3>
    <button
      type="button"
      onClick={() =>
        setForm((prev) => ({
          ...prev,
          droppingPoints: [...prev.droppingPoints, { location: "", time: "", landmark: "" }],
        }))
      }
      className="text-sm bg-rose-100 text-rose-700 px-2 py-1 rounded hover:bg-rose-200 flex items-center gap-1"
    >
      <Plus size={14} /> Add
    </button>
  </div>

  {form.droppingPoints.map((point, idx) => (
    <div key={idx} className="flex flex-wrap gap-2 mb-2 p-2 border rounded-lg bg-gray-50">
      <input
        type="text"
        placeholder="Location"
        value={point.location}
        onChange={(e) => {
          const updated = [...form.droppingPoints];
          updated[idx].location = e.target.value;
          setForm({ ...form, droppingPoints: updated });
        }}
        className="border p-2 rounded flex-1"
      />
      <input
        type="time"
        value={point.time}
        onChange={(e) => {
          const updated = [...form.droppingPoints];
          updated[idx].time = e.target.value;
          setForm({ ...form, droppingPoints: updated });
        }}
        className="border p-2 rounded flex-1"
      />
      <input
        type="text"
        placeholder="Landmark"
        value={point.landmark}
        onChange={(e) => {
          const updated = [...form.droppingPoints];
          updated[idx].landmark = e.target.value;
          setForm({ ...form, droppingPoints: updated });
        }}
        className="border p-2 rounded flex-1"
      />
      <button
        type="button"
        onClick={() => {
          const updated = form.droppingPoints.filter((_, i) => i !== idx);
          setForm({ ...form, droppingPoints: updated });
        }}
        className="text-rose-600 hover:text-rose-800"
      >
        <Trash2 size={18} />
      </button>
    </div>
  ))}
</div>


      {/* 🔁 Flags & Remarks */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            name="alternating"
            checked={form.alternating}
            onChange={handleChange}
          />
          Alternating Bus
        </label>
        <label className="flex items-center gap-2 text-gray-700">
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
          placeholder="Remarks (optional)"
          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
<Button type="submit" variant="solid" color="purple">
        <Plus size={18}/> Add Bus
      </Button>
    </form>
  );
};

export default AddBusForm;
