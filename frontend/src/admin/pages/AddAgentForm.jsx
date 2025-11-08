import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import API from "../../api";

const AddAgentForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // success | error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");
  setStatus("");

  try {
    const token = localStorage.getItem("adminToken");
console.log("Admin token:", token);
// or sessionStorage
    if (!token) {
      setMessage("⚠️ Admin not logged in");
      setStatus("error");
      setLoading(false);
      return;
    }

    const res = await API.post(
      "/api/admin/create-agent",
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile: formData.phone,
        company: formData.company,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Include token
        },
      }
    );

    setMessage("✅ Agent created successfully!");
    setStatus("success");
    setFormData({
      name: "",
      company: "",
      email: "",
      password: "",
      phone: "",
    });

    if (onSuccess) onSuccess();
  } catch (err) {
    console.error("❌ Create agent error:", err.response?.data || err);
    setMessage(err.response?.data?.message || "❌ Failed to create agent");
    setStatus("error");
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto bg-white shadow-xl border border-gray-300 p-6 backdrop-blur-xl rounded-2xl"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Add New Agent
      </h2>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center justify-center gap-2 mb-3 px-3 py-2 rounded-lg text-sm font-medium ${
              status === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {status === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <XCircle size={18} />
            )}
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Agent Name */}
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            name="name"
            placeholder="Agent Name"
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Company Name */}
        <div className="relative">
          <Building2 className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Creating...
            </>
          ) : (
            "Create Agent"
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default AddAgentForm;
