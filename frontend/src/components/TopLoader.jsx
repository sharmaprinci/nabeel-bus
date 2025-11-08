import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const TopLoader = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Start loading when route changes
    setLoading(true);

    // Simulate smooth loading end after short delay
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timeout);
  }, [location]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed top-0 left-0 h-[3px] z-[9999] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
        />
      )}
    </AnimatePresence>
  );
};

export default TopLoader;
