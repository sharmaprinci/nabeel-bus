import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, Moon, Sun } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

localStorage.setItem("adminToken", data.token);
console.log("Generated Admin Token:", data.token);

      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${
        darkMode
          ? "bg-[#0d0d0d]"
          : "bg-gradient-to-br from-[#151347] via-[#1e1b4b] to-[#151347]"
      }`}
    >
      {/* ✨ Glowing Orbs */}
      <div className="absolute -top-32 -left-40 w-[450px] h-[450px] bg-[#60a5fa]/40 blur-[120px] rounded-full animate-[float1_12s_ease-in-out_infinite]" />
      <div className="absolute bottom-0 right-0 w-[550px] h-[550px] bg-[#c084fc]/40 blur-[140px] rounded-full animate-[float2_14s_ease-in-out_infinite]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 blur-[200px] rounded-full pointer-events-none" />

      {/* 🌓 Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(transparent_60%,rgba(0,0,0,0.65)_100%)]" />

      {/* 🌗 Dark/Light Mode Toggle */}
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        className={`absolute top-6 right-6 p-3 rounded-full transition ${
          darkMode ? "bg-[#1a1a1a] hover:bg-[#262626]" : "bg-white/80 hover:bg-white"
        } shadow-lg backdrop-blur-md`}
      >
        {darkMode ? (
          <Sun className="text-yellow-300" size={22} />
        ) : (
          <Moon className="text-gray-800" size={22} />
        )}
      </button>

      {/* 🧊 Login Card */}
      <div
        className={`relative p-8 rounded-2xl shadow-2xl w-full max-w-md border transition-all duration-500
        backdrop-blur-2xl animate-[floatCard_6s_ease-in-out_infinite] mx-5
        ${
          darkMode
            ? "bg-[#1a1a1a]/90 border-[#2e2e2e] text-white"
            : "bg-[#1e1b4b]/60 border-white/30 text-white"
        }`}
      >
        {/* 🏷️ Header */}
        <div className="text-center mb-8">
          <div
            className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg mb-4 ${
              darkMode ? "bg-[#262626]" : "bg-[#1e1b4b]/80"
            }`}
          >
            <Lock size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Login</h2>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-300"
            }`}
          >
            Welcome back! Please enter your credentials.
          </p>
        </div>

        {/* 🛑 Error */}
        {error && (
          <div className="mb-4 text-red-200 bg-red-500/20 p-2 rounded-lg text-center text-sm border border-red-400/30">
            {error}
          </div>
        )}

        {/* 📝 Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div className="relative flex items-center">
            <span className="absolute left-3 flex items-center justify-center h-full pointer-events-none">
              <Mail
                size={20}
                className={`${
                  darkMode ? "text-gray-500" : "text-gray-300"
                } transition-colors`}
              />
            </span>
            <input
              type="email"
              placeholder="Email address"
              className={`w-full h-12 pl-12 pr-4 rounded-xl bg-transparent backdrop-blur-sm border focus:outline-none focus:ring-2 transition-all
              ${
                darkMode
                  ? "border-[#3a3a3a] text-white placeholder-gray-500 focus:ring-[#3b82f6] focus:shadow-[0_0_12px_#3b82f680]"
                  : "border-white/30 text-white placeholder-gray-300 focus:ring-[#3b82f6] focus:shadow-[0_0_12px_#3b82f680]"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative flex items-center">
            <span className="absolute left-3 flex items-center justify-center h-full pointer-events-none">
              <Lock
                size={20}
                className={`${
                  darkMode ? "text-gray-500" : "text-gray-300"
                } transition-colors`}
              />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full h-12 pl-12 pr-12 rounded-xl bg-transparent backdrop-blur-sm border focus:outline-none focus:ring-2 transition-all
              ${
                darkMode
                  ? "border-[#3a3a3a] text-white placeholder-gray-500 focus:ring-[#3b82f6] focus:shadow-[0_0_12px_#3b82f680]"
                  : "border-white/30 text-white placeholder-gray-300 focus:ring-[#3b82f6] focus:shadow-[0_0_12px_#3b82f680]"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={`absolute right-3 flex items-center justify-center h-full transition ${
                darkMode
                  ? "text-gray-500 hover:text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold shadow-2xl border hover:shadow-xl hover:scale-[1.02] transition-all bg-[#151347] text-white"
          >
            Login
          </button>
        </form>

        {/* 🧾 Footer */}
        <div
          className={`mt-6 text-center text-sm ${
            darkMode ? "text-gray-500" : "text-gray-300"
          }`}
        >
          © {new Date().getFullYear()} Nabeel Bus Admin Panel
        </div>
      </div>

      {/* ✨ Animations */}
      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, 20px) scale(1.05); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, -25px) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
