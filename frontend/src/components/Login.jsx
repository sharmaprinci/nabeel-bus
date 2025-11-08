
// import React, { useState, useContext } from "react";
// import api from "../api";
// import { AuthContext } from "../context/AuthContext";

// const Login = ({ onClose, switchForm }) => {
//   const { setUser, setToken } = useContext(AuthContext);
//   const [form, setForm] = useState({ mobile: "", password: "" });
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

  // // 👇 Forgot password states
  // const [forgotMode, setForgotMode] = useState(false);
  // const [resetEmail, setResetEmail] = useState("");
  // const [resetMessage, setResetMessage] = useState("");
  // const [resetLoading, setResetLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     try {
//       const { data } = await api.post("/api/auth/login", form);
//       setUser(data.user);
//       setToken(data.token);
//       setMessage("✅ Login successful!");
//       setTimeout(() => onClose(), 800);
//     } catch (err) {
//       setMessage(err.response?.data?.message || "Login failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

  // // 👇 Forgot password submit
  // const handleResetSubmit = async (e) => {
  //   e.preventDefault();
  //   setResetMessage("");
  //   setResetLoading(true);

  //   try {
  //     const { data } = await api.post("/api/auth/request-password-reset", { email: resetEmail });
  //     setResetMessage(`✅ ${data.message}`);
  //   } catch (err) {
  //     setResetMessage(err.response?.data?.message || "Failed to send reset link.");
  //   } finally {
  //     setResetLoading(false);
  //   }
  // };

//   return (
//     <div className="max-w-[30rem] w-full mx-auto mt-10 p-10 bg-white rounded-2xl shadow-lg relative">
//       {/* Close Button */}
//       <button
//         onClick={onClose}
//         type="button"
//         className="absolute top-4 right-4 text-gray-500 text-2xl font-bold hover:text-gray-700"
//       >
//         ✕
//       </button>

//       {/* Title */}
//       <h1 className="text-4xl font-bold text-blue-600 mb-1 text-center">
//         Nabeel Bus
//       </h1>
//       <p className="text-gray-500 text-center mb-6">
//         {forgotMode ? "Reset your password" : "Login to your account"}
//       </p>

      // {/* Message */}
      // {!forgotMode && message && (
      //   <div
      //     className={`mb-5 text-center text-sm font-medium ${
      //       message.startsWith("✅") ? "text-green-600" : "text-red-600"
      //     }`}
      //   >
      //     {message}
      //   </div>
      // )}
      // {forgotMode && resetMessage && (
      //   <div
      //     className={`mb-5 text-center text-sm font-medium ${
      //       resetMessage.startsWith("✅") ? "text-green-600" : "text-red-600"
      //     }`}
      //   >
      //     {resetMessage}
      //   </div>
      // )}

      // {/* 👇 Login Form */}
      // {!forgotMode && (
      //   <form onSubmit={handleSubmit} className="space-y-6">
      //     {/* Mobile Field */}
      //     <div className="flex w-full p-3 border border-blue-600 rounded-xl">
      //       <input
      //         type="tel"
      //         name="mobile"
      //         value={form.mobile}
      //         onChange={handleChange}
      //         placeholder="Enter Mobile Number"
      //         className="w-full outline-none"
      //         required
      //       />
      //     </div>

      //     {/* Password Field */}
      //     <div className="flex items-center w-full p-3 border border-blue-600 rounded-xl">
      //       <input
      //         type={showPassword ? "text" : "password"}
      //         name="password"
      //         value={form.password}
      //         onChange={handleChange}
      //         placeholder="Password"
      //         className="w-full outline-none"
      //         required
      //       />
      //       <button
      //         type="button"
      //         onClick={() => setShowPassword((prev) => !prev)}
      //         className="ml-2 text-gray-500 hover:text-blue-600 focus:outline-none"
      //       >
      //         {showPassword ? (
      //           // Hide password icon
      //           <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.29.244-2.523.69-3.658M15 15l-3-3m0 0L9 9m3 3l6.364 6.364M12 12l-6.364-6.364" />
      //           </svg>
      //         ) : (
      //           // Show password icon
      //           <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      //             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
      //           </svg>
      //         )}
      //       </button>
      //     </div>

      //     {/* Forgot Password Link */}
      //     <div className="text-right">
      //       <button
      //         type="button"
      //         onClick={() => setForgotMode(true)}
      //         className="text-sm text-blue-600 hover:underline"
      //       >
      //         Forgot Password?
      //       </button>
      //     </div>

      //     {/* Submit Button */}
      //     <button
      //       type="submit"
      //       disabled={loading}
      //       className={`w-full py-4 rounded-xl text-white text-lg ${
      //         loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      //       }`}
      //     >
      //       {loading ? "Logging in..." : "Login"}
      //     </button>

      //     <p className="text-center text-sm text-gray-600">
      //       Don't have an account?{" "}
      //       <button
      //         type="button"
      //         onClick={() => switchForm("signup")}
      //         className="text-blue-600 hover:underline"
      //       >
      //         Sign up
      //       </button>
      //     </p>
      //   </form>
      // )}

      // {/* 👇 Forgot Password Form */}
      // {forgotMode && (
      //   <form onSubmit={handleResetSubmit} className="space-y-6">
      //     <div className="flex w-full p-3 border border-blue-600 rounded-xl">
      //       <input
      //         type="email"
      //         value={resetEmail}
      //         onChange={(e) => setResetEmail(e.target.value)}
      //         placeholder="Enter your registered email"
      //         className="w-full outline-none"
      //         required
      //       />
      //     </div>

      //     <button
      //       type="submit"
      //       disabled={resetLoading}
      //       className={`w-full py-4 rounded-xl text-white text-lg ${
      //         resetLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      //       }`}
      //     >
      //       {resetLoading ? "Sending..." : "Send Reset Link"}
      //     </button>

      //     <button
      //       type="button"
      //       onClick={() => setForgotMode(false)}
      //       className="w-full text-sm text-blue-600 hover:underline text-center mt-2"
      //     >
      //       Back to Login
      //     </button>
      //   </form>
      // )}
//     </div>
//   );
// };

// export default Login;


import React, { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

const Login = ({ onClose, switchForm }) => {
  const { setUser, setToken } = useContext(AuthContext);
  const [form, setForm] = useState({ mobile: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

    // 👇 Forgot password states
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Unified login logic (for both User and Agent)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // 1️⃣ Try normal user login
      const { data } = await api.post("/api/auth/login", form);

      setUser({ ...data.user, role: "user" });
      setToken(data.token);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", "user");

      setMessage("✅ Login successful!");
      setTimeout(() => onClose(), 600);
    } catch (userErr) {
      try {
        // 2️⃣ Try agent login using same credentials
        const { data } = await api.post("/api/agent/login", form);

        setUser({ ...data.agent, role: "agent" });
        setToken(data.token);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userRole", "agent");

        setMessage("✅ Agent login successful!");
        setTimeout(() => onClose(), 600);
      } catch (agentErr) {
        setMessage("❌ Invalid mobile number or password");
      }
    } finally {
      setLoading(false);
    }
  };

    // 👇 Forgot password submit
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetMessage("");
    setResetLoading(true);

    try {
      const { data } = await API.post("/api/auth/request-password-reset", { email: resetEmail });
      setResetMessage(`✅ ${data.message}`);
    } catch (err) {
      setResetMessage(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="max-w-[30rem] w-full mx-auto mt-10 p-10 bg-white rounded-2xl shadow-lg relative">
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
      <p className="text-gray-500 text-center mb-6">Login to your account</p>

      {/* Message */}
      {!forgotMode && message && (
        <div
          className={`mb-5 text-center text-sm font-medium ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}
      {forgotMode && resetMessage && (
        <div
          className={`mb-5 text-center text-sm font-medium ${
            resetMessage.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {resetMessage}
        </div>
      )}

      {/* 👇 Login Form */}
      {!forgotMode && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mobile Field */}
          <div className="flex w-full p-3 border border-blue-600 rounded-xl">
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Enter Mobile Number"
              className="w-full outline-none"
              required
            />
          </div>

          {/* Password Field */}
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
              {showPassword ? (
                // Hide password icon
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.29.244-2.523.69-3.658M15 15l-3-3m0 0L9 9m3 3l6.364 6.364M12 12l-6.364-6.364" />
                </svg>
              ) : (
                // Show password icon
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => setForgotMode(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white text-lg ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => switchForm("signup")}
              className="text-blue-600 hover:underline"
            >
              Sign up
            </button>
          </p>
        </form>
      )}

      {/* 👇 Forgot Password Form */}
      {forgotMode && (
        <form onSubmit={handleResetSubmit} className="space-y-6">
          <div className="flex w-full p-3 border border-blue-600 rounded-xl">
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="w-full outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={resetLoading}
            className={`w-full py-4 rounded-xl text-white text-lg ${
              resetLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {resetLoading ? "Sending..." : "Send Reset Link"}
          </button>

          <button
            type="button"
            onClick={() => setForgotMode(false)}
            className="w-full text-sm text-blue-600 hover:underline text-center mt-2"
          >
            Back to Login
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;


