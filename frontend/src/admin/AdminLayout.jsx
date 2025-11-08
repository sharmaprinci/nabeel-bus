
import React, { useState, useEffect, useRef } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./component/Sidebar";
import Header from "./component/Header";
import Footer from "./component/Footer";
import TopLoader from "../components/TopLoader";

const pageVariants = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -30, scale: 0.98 },
};

const AdminLayout = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(() => {
    return localStorage.getItem("sidebarVisible") === "true";
  });
  const [isCollapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });
  const location = useLocation();
  const sidebarRef = useRef(null);

  // ✅ Toggle sidebar on mobile
  const toggleSidebar = () => setSidebarVisible((prev) => !prev);

  // ✅ Persist sidebar visibility & collapse state
  useEffect(() => {
    localStorage.setItem("sidebarVisible", isSidebarVisible);
  }, [isSidebarVisible]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed);
  }, [isCollapsed]);

  // ✅ Close sidebar when clicking outside (mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        window.innerWidth < 768 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setSidebarVisible(false);
      }
    };

    if (isSidebarVisible)
      document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarVisible]);

  // ✅ Show sidebar on desktop by default (first time)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarVisible(true);
      else setSidebarVisible(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-indigo-50">
      <TopLoader />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`transition-all duration-300 ease-in-out
          ${isSidebarVisible ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "md:w-20" : "md:w-64"}
          fixed md:relative z-30 md:z-10 h-full bg-white border-r border-gray-200 shadow-lg md:shadow-none`}
      >
        <Sidebar
          sidebarOpen={isSidebarVisible}
          setSidebarOpen={setSidebarVisible}
          collapsed={isCollapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      {/* Overlay (Mobile Only) */}
      {isSidebarVisible && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarVisible(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${
          isCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;

