// src/pages/ResetPassword.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const ResetPassword = ({ onClose }) => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validToken, setValidToken] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Step 1: Verify token when page loads
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/auth/verify-reset-token/${token}`
        );
        if (res.data.message === "Valid token") setValidToken(true);
      } catch (err) {
        Swal.fire(
          "Invalid Link",
          "This reset link has expired or is invalid.",
          "error"
        );
        navigate("/forgot-password");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  // ✅ Step 2: Submit new password
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return Swal.fire("Error", "Passwords do not match", "error");
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password/${token}`,
        { password }
      );

      Swal.fire(
        "Success",
        res.data.message || "Password reset successfully!",
        "success"
      );
      navigate("/login");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to reset password",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🧭 Step 3: Render UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Verifying reset link...
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Invalid or expired reset link.
      </div>
    );
  }

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-[30rem] w-full mx-auto p-10 bg-white rounded-2xl shadow-lg relative">
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
      <p className="text-gray-500 text-center mb-6">Reset Password</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 w-full max-w-md mx-auto"
      >
        {/* Password Field */}
        <div className="flex items-center w-full p-3 border border-blue-600 rounded-xl mb-5">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.29.244-2.523.69-3.658M15 15l-3-3m0 0L9 9m3 3l6.364 6.364M12 12l-6.364-6.364"
                />
              </svg>
            ) : (
              // Show password icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="flex items-center w-full p-3 border border-blue-600 rounded-xl mb-5">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.29.244-2.523.69-3.658M15 15l-3-3m0 0L9 9m3 3l6.364 6.364M12 12l-6.364-6.364"
                />
              </svg>
            ) : (
              // Show password icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  </div>
);

};

export default ResetPassword;
