import React from "react";
import Login from "./Login";

const LoginModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg relative w-96">
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
        >
          ✕
        </button>
        <Login onClose={onClose} />
      </div>
    </div>
  );
};

export default LoginModal;
