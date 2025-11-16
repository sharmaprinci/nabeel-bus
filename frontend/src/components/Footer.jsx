import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-blue-700 border-t border-gray-300">
      {/* Outer full-width wrapper */}
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        {/* Contact & Socials */}
        <div className="flex flex-wrap justify-center items-center text-center text-xl gap-6 py-1">
          <p className="text-white">
            ISBT Anand Vihar Bus Terminal, Delhi, India
          </p>
          <p className="text-white">📞 +91 7052598585</p>
          <p className="text-white">✉️ support@nabeelbus.com</p>
          
        </div>
        <div className="flex flex-wrap justify-center items-center text-center text-md gap-6 py-2">
          <Link
            to="/"
            className="text-white hover:text-yellow-300 transition font-medium"
            >
              Home
            </Link>
            <Link
            to="/admin/login"
            className="text-white hover:text-yellow-300 transition font-medium"
            >
              Admin 
            </Link>
            <Link
            to="/login"
            className="text-white hover:text-yellow-300 transition font-medium"
            >
              Agent
            </Link>
          <Link
            to="/contact-us"
            className="text-white hover:text-yellow-300 transition font-medium"
          >
            Contact Us
          </Link>
          <Link
            to="/terms-and-conditions"
            className="text-white hover:text-yellow-300 transition font-medium"
          >
            Terms & Conditions
          </Link>
          <Link
            to="/privacy-policy"
            className="text-white hover:text-yellow-300 transition font-medium"
          >
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 w-full py-6 text-center text-lg font-bold text-gray-200">
        © {new Date().getFullYear()} Nabeel Bus. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;




