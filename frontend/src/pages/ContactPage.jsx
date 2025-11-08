import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import API from "../api";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setStatus({ type: "", message: "" });

  const token = localStorage.getItem("token");

  try {
    // If token is required to submit contact form
    if (!token) {
      setStatus({
        type: "error",
        message: "You must be logged in to submit this form.",
      });
      setLoading(false);
      return;
    }

    const res = await API.post(
      "/api/contact/add",
      {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        subject: form.subject,
        message: form.message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = res.data;

    if (data.success) {
      setStatus({ type: "success", message: data.message });
      setForm({ name: "", email: "", mobile: "", subject: "", message: "" });
    } else {
      setStatus({ type: "error", message: data.message });
    }
  } catch (err) {
    console.error("❌ Contact Submit Error:", err);
    setStatus({ type: "error", message: "Something went wrong." });
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col items-center py-12 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-2xl mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Get in <span className="text-blue-600">Touch</span>
        </h1>
        <p className="text-gray-600 text-lg">
          We’d love to hear from you. Fill out the form below or reach us
          through any of the contact methods.
        </p>
      </motion.div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white shadow-xl rounded-2xl p-8"
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Full Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Mobile (optional)
              </label>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Subject *
              </label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                placeholder="Subject of your message"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Message *
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Write your message..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
              ></textarea>
            </div>

            {status.message && (
              <div
                className={`p-3 rounded-lg text-center text-sm ${
                  status.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {status.message}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </form>
        </motion.div>

        {/* Contact Info + Map */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col space-y-6"
        >
          <div className="bg-white shadow-lg rounded-2xl p-8 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <MapPin className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Address</h4>
                <p className="text-gray-600">123 Modern St, New Delhi, India</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Phone className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Phone</h4>
                <p className="text-gray-600">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Mail className="text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Email</h4>
                <p className="text-gray-600">contact@example.com</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden shadow-lg h-64">
            <iframe
              title="Google Maps"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14012.3056824061!2d77.21672135!3d28.6448002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd1b5de68b27%3A0x5a661d6e6c4c1e2!2sNew%20Delhi!5e0!3m2!1sen!2sin!4v1698252000000!5m2!1sen!2sin"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
