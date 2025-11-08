
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BusFront,
  Users,
  CalendarDays,
  BarChart3,
  PlusCircle,
  UserPlus,
  TrendingUp,
  PieChart as PieIcon,
  X,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  IndianRupee,
  ChevronDown,
  ChevronUp,
  User,
  UserCog,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import ViewBuses from "./ViewBuses";
import AddBusForm from "./AddBusForm";
import ScheduleGenerator from "./ScheduleGenerator";
import AddAgentForm from "./AddAgentForm";
import Button from "../../ui/ColorfulButton";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
} from "recharts";
// import {CartesianGrid, } from "recharts";
import { TextField, MenuItem, Box } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import API from "../../api";

const chartColors = {
  bookings: "#6366F1", // Indigo
  passengers: "#F59E0B", // Amber
  revenue: "#10B981", // Green
};

export const BusPerformanceChart = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState("Bookings");
  const [selectedBus, setSelectedBus] = useState("All");
  const [selectedRoute, setSelectedRoute] = useState("All");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // ✅ Extract all bus names dynamically
  const busNames = Array.from(
    new Set(
      data.flatMap((entry) =>
        Object.keys(entry)
          .filter((k) => k.includes("_Bookings"))
          .map((k) => k.split("_")[0])
      )
    )
  );

  // ✅ Extract routes (if present in your backend data)
  const routeNames = Array.from(
    new Set(data.map((d) => d.route || "Unknown Route"))
  );

  // ✅ Filtered dataset based on selected filters
  const filteredData = useMemo(() => {
    return data
      .filter((entry) => {
        if (selectedBus !== "All") {
          const hasBus = Object.keys(entry).some((k) =>
            k.includes(selectedBus)
          );
          if (!hasBus) return false;
        }

        if (selectedRoute !== "All" && entry.route !== selectedRoute)
          return false;

        if (fromDate && new Date(entry.date) < fromDate) return false;
        if (toDate && new Date(entry.date) > toDate) return false;

        return true;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data, selectedBus, selectedRoute, fromDate, toDate]);

  const getKey = (bus) => `${bus}_${selectedMetric}`;

  return (
    <motion.div
      className="bg-gradient-to-br from-white/90 via-indigo-50/70 to-white/80 border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all backdrop-blur-md mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* ================= Header ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <h2 className="text-lg font-semibold text-gray-800">
          🗓️ Bookings Per Bus by Date
        </h2>

        {/* Metric Toggle */}
        <div className="flex items-center gap-2">
          {["Bookings", "Passengers", "Revenue"].map((label) => (
            <button
              key={label}
              onClick={() => setSelectedMetric(label)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition ${
                selectedMetric === label
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= Filters ================= */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Bus Filter */}
        <TextField
          select
          label="Select Bus"
          value={selectedBus}
          onChange={(e) => setSelectedBus(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="All">All Buses</MenuItem>
          {busNames.map((bus) => (
            <MenuItem key={bus} value={bus}>
              {bus}
            </MenuItem>
          ))}
        </TextField>

        {/* Route Filter */}
        <TextField
          select
          label="Select Route"
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="All">All Routes</MenuItem>
          {routeNames.map((route) => (
            <MenuItem key={route} value={route}>
              {route}
            </MenuItem>
          ))}
        </TextField>

        {/* Date Pickers */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box className="flex items-center gap-3">
            <DatePicker
              label="From"
              value={fromDate}
              onChange={setFromDate}
              slotProps={{ textField: { size: "small" } }}
            />
            <DatePicker
              label="To"
              value={toDate}
              onChange={setToDate}
              slotProps={{ textField: { size: "small" } }}
            />
          </Box>
        </LocalizationProvider>
      </div>

      {/* ================= Chart ================= */}
      {filteredData?.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#4b5563" }}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#4b5563" }}
              tickFormatter={(val) =>
                selectedMetric === "Revenue" ? `₹${val}` : val
              }
            />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
              }}
              formatter={(val, name) => {
                const parts = name.split("_");
                const metric = parts[1];
                if (metric === "Revenue") return [`₹${val}`, "Revenue"];
                if (metric === "Passengers") return [val, "Passengers"];
                return [val, "Bookings"];
              }}
            />
            <Legend />

            {busNames.map((bus, idx) => (
              <Line
                key={bus}
                type="monotone"
                dataKey={getKey(bus)}
                stroke={
                  selectedMetric === "Bookings"
                    ? chartColors.bookings
                    : selectedMetric === "Passengers"
                    ? chartColors.passengers
                    : chartColors.revenue
                }
                strokeWidth={3}
                dot={{ r: 4 }}
                name={`${bus} (${selectedMetric})`}
                isAnimationActive={true}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-gray-500 py-10">
          No matching booking data found
        </div>
      )}
    </motion.div>
  );
};

// Simple animation variants for grouped fade-up entry
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, duration: 0.4, ease: "easeOut" },
  },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const DashboardOverview = ({ stats }) => {
  return (
    <div className="space-y-10 mt-6">
      {/* ======================= 🧩 SYSTEM OVERVIEW ======================= */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold text-gray-800 tracking-wide border-b border-gray-200 pb-2">
           System Overview
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: BusFront,
              label: "Total Buses",
              value: stats.totals.totalBuses,
              bg: "bg-blue-600 text-white",
            },
            {
              icon: Users,
              label: "Total Users",
              value: stats.totals.totalUsers,
              bg: "bg-indigo-600 text-white",
            },
            {
              icon: Users,
              label: "Total Agents",
              value: stats.totals.totalAgents,
              bg: "bg-emerald-600 text-white",
            },
            {
              icon: Users,
              label: "Active Agents",
              value: stats.agents?.activeAgents,
              bg: "bg-teal-600 text-white",
            },
          ].map(({ icon: Icon, label, value, bg }) => (
            <motion.div
              key={label}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
              }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
              className={`p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${bg}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm opacity-90">{label}</h3>
                  <p className="text-3xl font-bold mt-1">{value ?? 0}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon size={26} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ======================= 📊 BOOKINGS OVERVIEW ======================= */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold text-gray-800 tracking-wide border-b border-gray-200 pb-2">
         Bookings Overview
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: BarChart3,
              label: "Total Bookings",
              value: stats.totals.totalBookings,
              bg: "bg-pink-600 text-white",
            },
            {
              icon: BarChart3,
              label: "Today’s Bookings",
              value: stats.totals.todayBookings,
              bg: "bg-rose-600 text-white",
            },
            {
              icon: CheckCircle,
              label: "Confirmed Bookings",
              value: stats.totals.confirmedBookings,
              bg: "bg-green-600 text-white",
            },
            {
              icon: XCircle,
              label: "Cancelled Bookings",
              value: stats.totals.cancelledBookings,
              bg: "bg-red-600 text-white",
            },
          ].map(({ icon: Icon, label, value, bg }) => (
            <motion.div
              key={label}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
              }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
              className={`p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${bg}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm opacity-90">{label}</h3>
                  <p className="text-3xl font-bold mt-1">{value ?? 0}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon size={26} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ======================= 💰 REVENUE & AGENTS ======================= */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold text-gray-800 tracking-wide border-b border-gray-200 pb-2">
          Revenue & Agents
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: TrendingUp,
              label: "Total Revenue (₹)",
              value: stats.totals.totalRevenue.toLocaleString(),
              bg: "bg-amber-600 text-white",
            },
            {
              icon: Clock,
              label: "Pending Payments (₹)",
              value: stats.totals.unpaidRevenue.toLocaleString(),
              bg: "bg-yellow-600 text-white",
            },
            {
              icon: BarChart3,
              label: "Agent Bookings",
              value: stats.agents?.totalAgentBookings,
              bg: "bg-lime-600 text-white",
            },
            {
              icon: CheckCircle,
              label: "Seats Booked by Agents",
              value: stats.agents?.totalAgentSeats,
              bg: "bg-green-600 text-white",
            },
          ].map(({ icon: Icon, label, value, bg }) => (
            <motion.div
              key={label}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
              }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
              className={`p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${bg}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm opacity-90">{label}</h3>
                  <p className="text-3xl font-bold mt-1">{value ?? 0}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon size={26} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

const modalVariants = {
  hidden: { opacity: 0, y: -50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, y: -50, scale: 0.95 },
};

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showAddBusModal, setShowAddBusModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);

  const [stats, setStats] = useState({
    totals: {
      totalBuses: 0,
      totalAgents: 0,
      totalUsers: 0,
      totalBookings: 0,
      confirmedBookings: 0,
      pendingBookings: 0,
      cancelledBookings: 0,
      totalRevenue: 0,
      unpaidRevenue: 0,
      todayBookings: 0,
    },
    trends: {
      monthlyTrends: [],
      busTypeData: [],
    },
    agents: {
      activeAgents: 0,
      totalAgentBookings: 0,
      totalAgentSeats: 0,
    },
    performance: {
      bookingsPerBus: [],
    },
  });

const [summaryData, setSummaryData] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    origin: "",
    destination: "",
    busId: "",
  });
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const fetchPassengerSummary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const params = new URLSearchParams(filters);
      const res = await API.get(`/api/admin/passenger-summary?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummaryData(res.data.summary || []);
    } catch (err) {
      console.error("❌ Error fetching passenger summary:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengerSummary();
  }, []);

  const toggleExpand = (index) =>
    setExpanded(expanded === index ? null : index);

  const getDateStatus = (dateStr) => {
    const today = new Date();
    const tripDate = new Date(dateStr);
    if (
      tripDate.getFullYear() === today.getFullYear() &&
      tripDate.getMonth() === today.getMonth() &&
      tripDate.getDate() === today.getDate()
    )
      return "today";
    else if (tripDate < today) return "past";
    else return "upcoming";
  };

  // ✅ Total Summary Row
  const totalBookings = summaryData.reduce((sum, s) => sum + s.totalBookings, 0);
  const totalPassengers = summaryData.reduce((sum, s) => sum + s.totalPassengers, 0);
  const totalRevenue = summaryData.reduce((sum, s) => sum + s.revenue, 0);
  const totalAgentRevenue = summaryData.reduce(
    (sum, s) => sum + (s.revenueByRole?.agents || 0),
    0
  );
  const totalUserRevenue = summaryData.reduce(
    (sum, s) => sum + (s.revenueByRole?.users || 0),
    0
  );


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const { data } = await API.get("/api/admin/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data); // ✅ direct structure match
      } catch (err) {
        console.error("Dashboard stats error:", err);
      }
    };
    fetchStats();
  }, []);

  const COLORS = {
    "AC SEATER": "#4F46E5",
    "AC SLEEPER": "#6366F1",
    "AC SEATER + SLEEPER": "#4338CA",
    "Non-AC SEATER": "#F59E0B",
    "Non-AC SLEEPER": "#EA580C",
    "Non-AC SEATER + SLEEPER": "#B45309",
  };

  const chartColors = {
    primary: "#6366F1", // Indigo
    success: "#10B981", // Green
    warning: "#F59E0B", // Amber
    danger: "#EF4444", // Red
    purple: "#8B5CF6", // Purple
    gradientStart: "#EEF2FF",
    gradientEnd: "#C7D2FE",
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-6 md:p-10">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-extrabold text-gray-800"
        >
          Welcome Back, <span className="text-indigo-600">Admin</span>
        </motion.h1>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="neon"
            color="blue"
            onClick={() => setShowAddBusModal(true)}
          >
            <PlusCircle size={18} /> Add Bus
          </Button>
          <Button
            variant="glass"
            color="green"
            onClick={() => setShowAddAgentModal(true)}
          >
            <UserPlus size={18} /> Add Agent
          </Button>
        </div>
      </div>

      {/* 🌟 OVERVIEW CARDS */}
      
      <DashboardOverview stats={stats} />


      {/* ===================== Charts ===================== */}
      <div className="grid md:grid-cols-2 gap-8 mt-10">
        {/* Monthly Trends Chart */}
        <motion.div
          className="relative bg-gradient-to-br from-white/90 via-indigo-50/80 to-white/70 border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all backdrop-blur-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              📈 Monthly Booking Trends
            </h2>
            <div className="text-sm text-gray-500">Last 12 months</div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={stats.trends.monthlyTrends}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartColors.primary}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColors.primary}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartColors.success}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartColors.success}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                }}
              />

              <Line
                type="monotone"
                dataKey="bookings"
                name="Bookings"
                stroke={chartColors.primary}
                strokeWidth={3}
                dot={{ r: 5, fill: chartColors.primary }}
                fill="url(#colorBookings)"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue (₹)"
                stroke={chartColors.success}
                strokeWidth={3}
                dot={{ r: 5, fill: chartColors.success }}
                fill="url(#colorRevenue)"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bus Type Distribution Chart */}
        <motion.div
          className="relative bg-white/80 border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all backdrop-blur-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              🚌 Bus Type Distribution
            </h2>
            <div className="text-sm text-gray-500">All active buses</div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={stats.trends.busTypeData || []}
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label={({ name }) => name}
              >
                {(stats.trends.busTypeData || []).map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][
                        index % 5
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 10, backgroundColor: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ===================== Booking Status Breakdown ===================== */}
      <div className="grid md:grid-cols-2 gap-8 mt-10">
        <motion.div
          className="bg-gradient-to-br from-white/90 via-emerald-50/60 to-white/80 border border-gray-200 rounded-2xl p-6 mt-10 shadow-md hover:shadow-lg transition-all backdrop-blur-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              📊 Booking Status Breakdown
            </h2>
            <span className="text-sm text-gray-500">
              Overall booking distribution
            </span>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={[
                  { name: "Confirmed", value: stats.totals.confirmedBookings },
                  { name: "Pending", value: stats.totals.pendingBookings },
                  { name: "Cancelled", value: stats.totals.cancelledBookings },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {[
                  chartColors.success,
                  chartColors.warning,
                  chartColors.danger,
                ].map((c, i) => (
                  <Cell key={i} fill={c} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>

              {/* Center Label */}
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xl font-bold fill-gray-700"
              >
                {stats.totals.totalBookings}
              </text>

              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div
          className="bg-gradient-to-br from-white/90 via-indigo-50/70 to-white/80 border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all backdrop-blur-md mt-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              🚌 Bus Performance Overview
            </h2>
            <span className="text-sm text-gray-500">
              Bookings, Revenue & Passengers
            </span>
          </div>

          {stats.performance?.bookingsPerBus?.length > 0 ? (
            <ResponsiveContainer width="100%" height={360}>
              <BarChart
                data={stats.performance.bookingsPerBus.map((bus) => ({
                  ...bus,
                  revenue: bus.totalRevenue,
                  passengers: bus.totalPassengers,
                }))}
                margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="_id"
                  tick={{ fontSize: 12, fill: "#4b5563" }}
                  angle={-15}
                  textAnchor="end"
                />
                <XAxis
                  dataKey="_id"
                  tickFormatter={(value, index) => {
                    const bus = stats.performance.bookingsPerBus[index];
                    return `${value} (${bus.busNumber})`;
                  }}
                  tick={{ fontSize: 11, fill: "#4b5563" }}
                  angle={-15}
                  textAnchor="end"
                />

                <YAxis
                  tick={{ fontSize: 12, fill: "#4b5563" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    padding: "10px 14px",
                  }}
                  formatter={(value, name) => {
                    if (name === "totalBookings")
                      return [`${value}`, "Bookings"];
                    if (name === "passengers")
                      return [`${value}`, "Passengers"];
                    if (name === "revenue")
                      return [`₹${value.toLocaleString()}`, "Revenue"];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `🚌 ${label}`}
                />
                <Legend
                  verticalAlign="top"
                  wrapperStyle={{ paddingBottom: 10 }}
                  iconType="circle"
                />

                {/* Bars */}
                <Bar
                  dataKey="totalBookings"
                  name="Bookings"
                  fill="url(#barBookings)"
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                />
                <Bar
                  dataKey="passengers"
                  name="Passengers"
                  fill="url(#barPassengers)"
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                />
                <Bar
                  dataKey="revenue"
                  name="Revenue (₹)"
                  fill="url(#barRevenue)"
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                />

                {/* Gradients */}
                <defs>
                  <linearGradient id="barBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient
                    id="barPassengers"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.2} />
                  </linearGradient>
                  <linearGradient id="barRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-gray-500 py-10">
              No booking data available
            </div>
          )}
        </motion.div>
      </div>

      {/* ===================== Bookings & Revenue per Bus ===================== */}

      <BusPerformanceChart
        data={stats.performance?.bookingsPerBusByDate || []}
      />

      {/* ===================== Passenger Summary Table ===================== */}
 <motion.div
      className="bg-white/90 border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all backdrop-blur-md mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            👥 Passenger Summary per Bus
          </h2>
          <span className="text-sm text-gray-500">
            Click any bus to expand and view passenger details
          </span>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="border p-2 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            name="origin"
            placeholder="Origin"
            value={filters.origin}
            onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
            className="border p-2 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={filters.destination}
            onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
            className="border p-2 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={fetchPassengerSummary}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm"
          >
            🔍 Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Bus</th>
              <th className="px-4 py-3 text-center font-semibold">Route</th>
              <th className="px-4 py-3 text-center font-semibold">Date</th>
              <th className="px-4 py-3 text-center font-semibold">Bookings</th>
              <th className="px-4 py-3 text-center font-semibold">Passengers</th>
              <th className="px-4 py-3 text-center font-semibold">Revenue (₹)</th>
              <th className="px-4 py-3 text-center font-semibold text-green-700">
                Agent ₹
              </th>
              <th className="px-4 py-3 text-center font-semibold text-indigo-700">
                User ₹
              </th>
              <th className="px-4 py-3 text-center font-semibold">Expand</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td
                  colSpan="9"
                  className="py-6 text-center text-gray-500 italic"
                >
                  Loading data...
                </td>
              </tr>
            ) : summaryData?.length > 0 ? (
              summaryData.map((bus, i) => {
                const status = getDateStatus(bus.date);
                const statusColor =
                  status === "today"
                    ? "bg-blue-100 text-blue-700"
                    : status === "past"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-green-100 text-green-700";

                return (
                  <>
                    <tr
                      key={i}
                      onClick={() => toggleExpand(i)}
                      className="hover:bg-indigo-50 transition-all duration-200 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-indigo-500" />
                          {bus.busName}
                          <span className="text-gray-400 text-xs">
                            ({bus.busNumber})
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center text-gray-700">
                        <div className="flex justify-center items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span className="px-2 py-1 bg-red-50 rounded text-red-600 text-xs font-medium">
                            {bus.origin}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="px-2 py-1 bg-green-50 rounded text-green-600 text-xs font-medium">
                            {bus.destination}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                        >
                          <CalendarDays className="inline w-3 h-3 mr-1" />
                          {bus.date}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center font-medium text-blue-700">
                        {bus.totalBookings}
                      </td>

                      <td className="px-4 py-3 text-center font-medium text-green-700">
                        {bus.totalPassengers}
                      </td>

                      <td className="px-4 py-3 text-center font-semibold text-indigo-600">
                        ₹{bus.revenue.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 text-center text-green-600 font-semibold">
                        ₹{bus.revenueByRole?.agents?.toLocaleString() || 0}
                      </td>

                      <td className="px-4 py-3 text-center text-indigo-600 font-semibold">
                        ₹{bus.revenueByRole?.users?.toLocaleString() || 0}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {expanded === i ? (
                          <ChevronUp className="w-4 h-4 text-gray-600 inline" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-600 inline" />
                        )}
                      </td>
                    </tr>

                    {/* Expand Row */}
                    <AnimatePresence>
                      {expanded === i && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td colSpan="9" className="p-4 bg-gray-50">
                            {bus.passengers?.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-xs border rounded-lg">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="p-2 border">Seat</th>
                                      <th className="p-2 border">Name</th>
                                      <th className="p-2 border">Fare</th>
                                      <th className="p-2 border">Booked By</th>
                                      <th className="p-2 border">Payment</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {bus.passengers.map((p, idx) => (
                                      <tr key={idx} className="hover:bg-white">
                                        <td className="p-2 border text-center">
                                          {p.seatNo || "-"}
                                        </td>
                                        <td className="p-2 border">{p.passengerName}</td>
                                        <td className="p-2 border text-blue-600 font-medium text-center">
                                          ₹{p.fare}
                                        </td>
                                        <td className="p-2 border text-center">
                                          <span
                                            className={`px-2 py-1 rounded text-xs font-semibold ${
                                              p.bookedBy === "agent"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-purple-100 text-purple-700"
                                            }`}
                                          >
                                            {p.bookedBy === "agent" ? (
                                              <>
                                                <UserCog className="inline w-3 h-3 mr-1" />
                                                Agent
                                              </>
                                            ) : (
                                              <>
                                                <User className="inline w-3 h-3 mr-1" />
                                                User
                                              </>
                                            )}
                                          </span>
                                        </td>
                                        <td
                                          className={`p-2 border text-center font-semibold ${
                                            p.paymentStatus === "Paid"
                                              ? "text-green-600"
                                              : "text-yellow-600"
                                          }`}
                                        >
                                          {p.paymentStatus}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-gray-500 text-center italic">
                                No passenger data available
                              </p>
                            )}
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-4 py-5 text-center text-gray-500 italic"
                >
                  No data available for selected filters
                </td>
              </tr>
            )}
          </tbody>

          {/* ✅ Totals Row */}
          {summaryData.length > 0 && (
            <tfoot className="bg-gray-100 font-semibold text-gray-700">
              <tr>
                <td className="p-3 text-right" colSpan="3">
                  Totals:
                </td>
                <td className="text-center text-blue-700">{totalBookings}</td>
                <td className="text-center text-green-700">{totalPassengers}</td>
                <td className="text-center text-indigo-600">
                  ₹{totalRevenue.toLocaleString()}
                </td>
                <td className="text-center text-green-600">
                  ₹{totalAgentRevenue.toLocaleString()}
                </td>
                <td className="text-center text-indigo-600">
                  ₹{totalUserRevenue.toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </motion.div>
    
      {/* MODALS (UNCHANGED) */}
      <AnimatePresence>
        {showAddBusModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddBusModal(false)}
            />
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 grid place-items-center p-4"
            >
              <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Add Bus</h2>
                  <button
                    onClick={() => setShowAddBusModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={22} />
                  </button>
                </div>
                <AddBusForm />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScheduleModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScheduleModal(false)}
            />
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 grid place-items-center p-4"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Generate Schedule
                  </h2>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={22} />
                  </button>
                </div>
                <ScheduleGenerator />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddAgentModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddAgentModal(false)}
            />
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 grid place-items-center p-4"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Add Agent</h2>
                  <button
                    onClick={() => setShowAddAgentModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={22} />
                  </button>
                </div>
                <AddAgentForm />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
