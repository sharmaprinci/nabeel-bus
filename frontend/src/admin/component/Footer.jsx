import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white/70 backdrop-blur-md border-t border-gray-100 shadow-inner py-3 px-6 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} <span className="font-semibold text-indigo-600">Nabeel Bus Admin</span>.  
       All rights reserved.
    </footer>
  );
};

export default Footer;
