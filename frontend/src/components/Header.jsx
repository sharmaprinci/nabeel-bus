import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import Signup from "./Signup";
import Login from "./Login";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [showOptions, setShowOptions] = useState(false);
  const [formType, setFormType] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false); // 👈 for dropdown toggle
  const profileRef = useRef(null); // 👈 ref for outside click
  const navigate = useNavigate();

  const handleOpen = (type) => {
    setFormType(type);
    setShowOptions(false);
  };

  const handleClose = () => {
    setFormType("");
  };

  const switchForm = (type) => {
    setFormType(type);
  };

  // ✅ Close modal if click outside the inner modal box
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // 👇 Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="w-full bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4 relative">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/images/logo.png" alt="logo" className="w-auto h-14" />
          </div>

          {/* Signup/Login Trigger */}
          {/* ✅ Right Section */}
          <div className="relative">
            {!user ? (
              <>
                {/* Signup / Login trigger */}
                <button
                  className="flex items-center space-x-2 border border-blue-300 rounded-full px-3 py-1 hover:bg-blue-50 transition-colors"
                  onClick={() => setShowOptions(!showOptions)}
                >
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.12 17.804z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-blue-600 text-sm font-medium">
                      Signup Here
                    </div>
                  </div>
                </button>

                {/* {showOptions && !formType && (
                <div className="absolute top-full mt-2 right-0 bg-white shadow-lg rounded-xl w-72 z-50 p-4">
                  <h3 className="text-lg font-semibold mb-2">Hi Traveller</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Signup now & get your <strong>first booking</strong>
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleOpen("signup")}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={() => handleOpen("login")}
                      className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition"
                    >
                      Login
                    </button>
                  </div>
                </div>
              )} */}
                {showOptions && !formType && (
                  <div
                    className="absolute top-full mt-2 right-0 w-72 z-50 p-5
                  backdrop-blur-xl bg-white/70 shadow-2xl
                  rounded-2xl border border-white/40"
                  >
                    <h3 className="text-lg font-semibold mb-1 text-gray-800">
                      Hi Traveller 👋
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 leading-snug">
                      Sign up now and enjoy your <strong>first booking</strong>{" "}
                      with ease.
                    </p>

                    <div className="flex flex-col gap-3">
                      {/* Sign Up Button */}
                      <button
                        onClick={() => handleOpen("signup")}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                   bg-blue-500
                   text-white font-medium
                   shadow-md hover:shadow-lg hover:scale-[1.02]
                   transition-all duration-200"
                      >
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Sign Up
                      </button>

                      {/* Login Button */}
                      <button
                        onClick={() => handleOpen("login")}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                   border border-blue-500 text-blue-600 font-medium
                   hover:bg-blue-50 transition-all duration-200
                   shadow-sm hover:shadow-md hover:scale-[1.02]"
                      >
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
                            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Login
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // 👤 Logged in: show user name & profile dropdown
              <div className="relative" ref={profileRef}>
                <motion.button
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  whileTap={{ scale: 0.95 }} // slight press effect
                  animate={showProfileMenu ? { scale: 1.05 } : { scale: 1 }} // 👈 bounce when dropdown opens
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="flex items-center space-x-2 bg-blue-50 rounded-full px-3 py-1 hover:bg-blue-100 transition"
                >
                  <motion.div
                    layout
                    className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold uppercase"
                  >
                    {user.name?.charAt(0)}
                  </motion.div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      showProfileMenu ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.button>

                {/* <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl overflow-hidden z-50"
                    >
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate("/profile");
                        }}
                      >
                        👤 Profile
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate("/bookings");
                        }}
                      >
                        🧾 My Bookings
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
                        onClick={() => {
                          setShowProfileMenu(false); // 👈 close dropdown
                          logout();
                        }}
                      >
                        🚪 Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence> */}
                <AnimatePresence>
  {showProfileMenu && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl overflow-hidden z-50"
    >
      {/* 💎 Agent Mode Badge */}
      {user?.role === "agent" && (
        <div className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border-b border-indigo-100">
          💎 Agent Mode
        </div>
      )}

      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
        onClick={() => {
          setShowProfileMenu(false);
          navigate("/profile");
        }}
      >
        👤 Profile
      </button>
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
        onClick={() => {
          setShowProfileMenu(false);
          navigate("/bookings");
        }}
      >
        🧾 My Bookings
      </button>
      <button
        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
        onClick={() => {
          setShowProfileMenu(false);
          logout();
        }}
      >
        🚪 Logout
      </button>
    </motion.div>
  )}
</AnimatePresence>

              </div>
            )}
          </div>
        </div>

        {/* Signup Modal */}
        <AnimatePresence>
          {formType === "signup" && (
            <motion.div
              key="signup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleBackdropClick}
              className="fixed inset-0 flex items-center justify-center z-50 
             bg-black/30 backdrop-blur-md backdrop-saturate-150"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] max-w-[1200px] mx-auto"
                // className="relative w-[90%] max-w-[1200px] mx-auto"
              >
                <Signup onClose={handleClose} switchForm={switchForm} />
              </motion.div>
            </motion.div>
          )}

          {/* Login Modal */}
          {formType === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={handleBackdropClick}
              className="fixed inset-0 flex items-center justify-center z-50 
             bg-black/30 backdrop-blur-md backdrop-saturate-150"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative w-[90%] max-w-[500px] mx-auto"
              >
                <Login onClose={handleClose} switchForm={switchForm} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
