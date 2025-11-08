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
          <p className="text-white">📞 +91 98765 43210</p>
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

// import React from "react";
// import { Link } from "react-router-dom";
// import { Mail, Phone, MapPin } from "lucide-react";

// const Footer = () => {
//   return (
//     <footer className="w-full bg-blue-800 text-white border-t border-blue-600 relative z-50">
//       {/* Top Section */}
//       <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-3 text-xs sm:text-sm">
//         {/* Contact */}
//         <div className="flex flex-col md:flex-row items-center gap-2 text-gray-200">
//           <div className="flex items-center gap-1">
//             <MapPin size={14} />
//             <span>ISBT Anand Vihar, Delhi</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Phone size={14} />
//             <span>+91 98765 43210</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Mail size={14} />
//             <span>support@nabeelbus.com</span>
//           </div>
//         </div>

//         {/* Links */}
//         <div className="flex flex-wrap justify-center md:justify-end gap-4 font-medium">
//           <Link
//             to="/contact-us"
//             className="hover:text-yellow-300 transition-colors duration-200"
//           >
//             Contact
//           </Link>
//           <Link
//             to="/terms-and-conditions"
//             className="hover:text-yellow-300 transition-colors duration-200"
//           >
//             Terms
//           </Link>
//           <Link
//             to="/privacy-policy"
//             className="hover:text-yellow-300 transition-colors duration-200"
//           >
//             Privacy
//           </Link>
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="bg-blue-900/90 text-center py-2 text-xs sm:text-sm text-gray-300 border-t border-blue-700">
//         © {new Date().getFullYear()} <span className="font-semibold text-white">Nabeel Bus</span>. All rights reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;




