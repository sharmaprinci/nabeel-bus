import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyAccount = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const { user, token, setUser, logout } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email, password: "" });
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const updateData = { name: form.name };
      if (form.password) updateData.password = form.password;

      const res = await axios.put(`${apiUrl}/api/users/${user.email}`, updateData, config);

      setMessage("Profile updated successfully!");
      setUser({ ...user, name: form.name });
      setForm({ ...form, password: "" });
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data.message || "Update failed");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user)
    return (
      <div className="text-center mt-20 text-lg">
        Please login first to access your account.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">My Account</h1>

      {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            disabled
            className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">New Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <hr className="my-6" />

      <div className="flex justify-between items-center">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>

        <div className="text-gray-500 text-sm">
          Account created on: {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
