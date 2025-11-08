import React, { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

const Signup = ({ onClose, switchForm  }) => {
  const { setUser, setToken } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 👁️ new state for toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      const v = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, mobile: v }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/signup", {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        city: form.city,
        password: form.password,
      });

      // setUser(data.user);
      // setToken(data.token);
      setMessage("✅ Signup successful!");
      setTimeout(() => {
    // ⬇️ instead of just closing, go to login modal
    switchForm("login");
  }, 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ visible }) => (
    visible ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.29.244-2.523.69-3.658M15 15l-3-3m0 0L9 9m3 3l6.364 6.364M12 12l-6.364-6.364" />
      </svg>
    )
  );

  return (
    <div className="max-w-[70%] mx-auto mt-10 p-10 bg-white rounded-2xl shadow-lg relative">
      {/* Close */}
      <button
        onClick={onClose}
        type="button"
        className="absolute top-4 right-4 text-gray-500 text-2xl font-bold hover:text-gray-700"
      >
        ✕
      </button>

      <h1 className="text-4xl font-bold text-blue-600 mb-1 text-center">
        Nabeel Bus
      </h1>
      <p className="text-gray-500 text-center mb-6">Create your account</p>

      {message && (
        <div
          className={`mb-5 text-center text-sm font-medium ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="flex md:justify-between gap-5 ">
          {/* Left Column */}
          <div className="w-full md:w-1/2 space-y-5">
            <div className="flex w-full p-3 border border-blue-600 rounded-xl">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full outline-none"
                required
              />
            </div>

            <div className="flex w-full p-3 border border-blue-600 rounded-xl">
              <span className="text-gray-500 mr-2">+91</span>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Mobile Number"
                className="w-full outline-none"
                required
              />
            </div>

            {/* Password field */}
            <div className="flex items-center w-full p-3 border border-blue-600 rounded-xl">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 text-gray-500 hover:text-blue-600 focus:outline-none"
              >
                <EyeIcon visible={!showPassword} />
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 space-y-5">
            <div className="flex w-full p-3 border border-blue-600 rounded-xl">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full outline-none"
                required
              />
            </div>

            <div className="flex w-full p-3 border border-blue-600 rounded-xl">
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full outline-none"
                required
              />
            </div>

            {/* Confirm password */}
            <div className="flex items-center w-full p-3 border border-blue-600 rounded-xl">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="ml-2 text-gray-500 hover:text-blue-600 focus:outline-none"
              >
                <EyeIcon visible={!showConfirmPassword} />
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl text-white text-lg ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600">
  Already have an account?{" "}
  <button
    type="button"
    onClick={() => switchForm("login")}
    className="text-blue-600 hover:underline"
  >
    Login
  </button>
</p>

      </form>
    </div>
  );

};

export default Signup;
