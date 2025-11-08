import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // ✅ added useNavigate
import {
  LayoutDashboard,
  BusFront,
  Users,
  Mail,
  CalendarDays,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen, collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ initialize navigate

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login"); // ✅ will now work
  };

  const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/buses", label: "Buses", icon: BusFront },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/agents", label: "Agents", icon: Users },
    { to: "/admin/messages", label: "Messages", icon: Mail },
    { to: "/admin/schedule", label: "Schedule", icon: CalendarDays },
    { to: "/admin/total-bookings", label: "Total Bookings", icon: BarChart3 },
    { to: "/admin/passenger-list", label: "Passenger List", icon: Users },
  ];

  return (
    <aside className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="logo"
            className="w-10 h-10 rounded-full"
          />
          {!collapsed && (
            <span className="font-semibold text-gray-800 text-lg tracking-tight">
              Admin
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="hidden md:flex items-center justify-center text-gray-600 hover:text-indigo-600 transition"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Links */}
      <nav className="flex flex-col mt-5 gap-1 px-2">
        {links.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
          

            <Link
  key={label}
  to={to}
  onClick={() => {
    if (window.innerWidth < 768) setSidebarOpen(false); // ✅ Only hide on mobile
  }}
  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
    ${
      active
        ? "bg-indigo-100 text-indigo-700 shadow-sm"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  title={collapsed ? label : ""}
>
  <Icon
    size={18}
    className={`flex-shrink-0 ${
      active ? "text-indigo-600" : "text-gray-500"
    }`}
  />
  {!collapsed && <span>{label}</span>}
</Link>

          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto px-3 pb-6 border-t border-gray-100 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-red-600 font-medium hover:bg-red-50 rounded-lg px-3 py-2 transition-all duration-200"
          title={collapsed ? "Logout" : ""}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
