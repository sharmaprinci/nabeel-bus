import React, { useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; // ✅ added useNavigate

const Header = ({ toggleSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate(); // ✅ initialize navigate

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login"); // ✅ will now redirect properly
  };

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-40">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-indigo-600 hover:text-indigo-800"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          Admin Panel
        </h1>
      </div>

      {/* Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-full shadow-sm hover:shadow-md transition-all"
        >
          <img
            src="/images/admin-avatar.png"
            alt="Admin Avatar"
            className="w-8 h-8 rounded-full border border-gray-200"
          />
          <span className="font-medium text-gray-700 hidden sm:block">
            Admin
          </span>
        </button>

        {profileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50"
          >
            <Link
              to="/admin/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              My Profile
            </Link>
            <Link
              to="/admin/settings"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
