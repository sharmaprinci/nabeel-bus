// import React, { useEffect, useState, useContext } from "react";
// import API from "../api";
// import { AuthContext } from "../context/AuthContext";
// import {
//   Eye,
//   EyeOff,
//   LogOut,
//   User,
//   Ticket,
//   Settings,
//   Menu,
//   X,
// } from "lucide-react";
// import { motion, AnimatePresence, complex } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import Button from "../ui/ColorfulButton";

// export default function Profile() {
//   const { token, setUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState("profile");
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [role, setRole] = useState("user");
//   const [profile, setProfile] = useState(null);
//   const [stats, setStats] = useState({ total: 0, completed: 0, cancelled: 0 });

//   const [editMode, setEditMode] = useState(false);
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     city: "",
//     company: "",
//   });
//   const [message, setMessage] = useState("");

//   const [passwordForm, setPasswordForm] = useState({
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [passwordMsg, setPasswordMsg] = useState("");
//   const [passwordVisibility, setPasswordVisibility] = useState({
//     old: false,
//     new: false,
//     confirm: false,
//   });
//   const [passwordModalOpen, setPasswordModalOpen] = useState(false);

//   const togglePassword = (field) =>
//     setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));

//   useEffect(() => {
//   if (token) {
//     const role = JSON.parse(atob(token.split(".")[1]))?.role || "user"; // decode JWT safely

//     const profileEndpoint =
//       role === "agent" ? "/api/agent/profile" : "/api/user/profile";

//     API.get(profileEndpoint, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then((res) => {
//         const data = res.data.user || res.data; // backend may wrap user in { user: ... }
//         setProfile(data);
//         setRole(role);
//         setForm({
//           name: data.name || "",
//           email: data.email || "",
//           mobile: data.mobile || "",
//           city: data.city || "",
//           company: data.company || "",
//         });
//       })
//       .catch(console.error);

//     // bookings stats (same for both)
//    API.get("/api/bookings/stats", {
//   headers: { Authorization: `Bearer ${token}` },
// })
//   .then((res) => setStats(res.data.stats)) // ✅ pick correct nested data
//   .catch(console.error);
//   }
// }, [token]);

//   const bookingCompletion = stats.total
//     ? Math.round((stats.completed / stats.total) * 100)
//     : 0;
//   const bookingCancel = stats.total
//     ? Math.round((stats.cancelled / stats.total) * 100)
//     : 0;

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   useEffect(() => {
//     if (!passwordModalOpen) {
//       setPasswordForm({
//         oldPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//       setPasswordMsg("");
//     }
//   }, [passwordModalOpen]);

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const endpoint =
//     role === "agent" ? "/api/agent/profile" : "/api/user/profile";

//   try {
//     const { data } = await API.put(endpoint, form, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     setUser(data.user);
//     setProfile(data.user);
//     setMessage("✅ Profile updated successfully");

//     setForm({
//       name: "",
//       email: "",
//       mobile: "",
//       city: "",
//       company: "",
//     });

//     setEditMode(false);
//   } catch (err) {
//     console.error(err);
//     setMessage("❌ Failed to update profile");
//   }
// };


//   const handlePasswordSubmit = async (e) => {
//     e.preventDefault();
//     setPasswordMsg("");

//     if (
//       !passwordForm.oldPassword ||
//       !passwordForm.newPassword ||
//       !passwordForm.confirmPassword
//     ) {
//       return setPasswordMsg("⚠️ All fields are required");
//     }
//     if (passwordForm.newPassword.length < 6) {
//       return setPasswordMsg("⚠️ New password must be at least 6 characters");
//     }
//     if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//       return setPasswordMsg("⚠️ New passwords do not match");
//     }

//     try {
//       const { data } = await API.put(
//         "/api/user/change-password",
//         {
//           oldPassword: passwordForm.oldPassword,
//           newPassword: passwordForm.newPassword,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPasswordMsg(data.message);
//       // 🧼 Clear fields
//       setPasswordForm({
//         oldPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });

//       // ✅ Close modal
//       setPasswordModalOpen(false);
//     } catch (err) {
//       setPasswordMsg(
//         err.response?.data?.message || "❌ Failed to change password"
//       );
//     }
//   };

//   useEffect(() => {
//     if (editMode) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//   }, [editMode]);

//   // 🎯 Sidebar Navigation Button (colorful hover)
//   const NavButton = ({ active, icon: Icon, label, onClick, color }) => (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full transition
//       ${
//         active
//           ? `bg-indigo-600 text-white shadow-md scale-[1.02]`
//           : "hover:bg-gray-100 text-gray-800 hover:scale-[1.02] transition-all"
//       }`}
//     >
//       <Icon size={20} />
//       <span className="font-medium">{label}</span>
//     </button>
//   );

//   const Sidebar = () => (
//     <motion.aside
//   initial={{ x: -300 }}
//   animate={{ x: 0 }}
//   exit={{ x: -300 }}
//   transition={{ duration: 0.3 }}
//   className="w-72 bg-white h-full p-6 flex flex-col justify-between shadow-2xl md:shadow-none md:static md:h-screen"
// >

//       <div>
//         <div className="flex justify-between items-center mb-6 md:hidden">
//           <h2 className="text-lg font-bold text-gray-700">Menu</h2>
//           <button onClick={() => setSidebarOpen(false)}>
//             <X size={28} />
//           </button>
//         </div>
//         <div className="flex flex-col items-center mb-8">
//           <div className="bg-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold">
//             {profile?.name?.charAt(0).toUpperCase()}
//           </div>
//           <h2 className="mt-3 text-lg font-semibold text-gray-800">
//             {profile?.name}
//           </h2>
//           <p className="text-sm text-gray-500">{profile?.email}</p>
//         </div>
//         <nav className="space-y-3">
//           <NavButton
//             active={activeTab === "profile"}
//             icon={User}
//             label="Profile"
//             onClick={() => {
//               setActiveTab("profile");
//               setSidebarOpen(false);
//             }}
//             color="indigo-600"
//           />

//           <NavButton
//             active={activeTab === "bookings"}
//             icon={Ticket}
//             label="My Bookings"
//             onClick={() => {
//               navigate("/bookings");
//               setSidebarOpen(false);
//             }}
//             color="orange-600"
//           />

//           <NavButton
//             active={activeTab === "password"}
//             icon={Settings}
//             label="Change Password"
//             onClick={() => {
//               setPasswordModalOpen(true);
//               setSidebarOpen(false);
//             }}
//             color="rose-600"
//           />
//         </nav>
//       </div>
//       <Button
//         onClick={() => {
//           localStorage.removeItem("token");
//           setUser(null);
//           navigate("/");
//         }}
//         variant="solid"
//         color="red"
//       >
//         <LogOut size={20} />
//         Logout
//       </Button>
//     </motion.aside>
//   );

//   if (!profile)
//     return <div className="p-10 text-center text-gray-500">Loading...</div>;

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row bg-blue-50">

//       {/* 🍔 Mobile Header */}
//       <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-sm">
//         <div className="flex items-center gap-2">
//           <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
//             {profile?.name?.charAt(0).toUpperCase()}
//           </div>
//           <h1 className="text-lg font-semibold">{profile?.name}</h1>
//         </div>
//         <button onClick={() => setSidebarOpen(true)}>
//           <Menu size={28} />
//         </button>
//       </div>

// {/* 🧭 Sidebar Layout for Desktop */}
// <div className="hidden md:block fixed top-0 left-0 h-screen w-72 bg-white shadow-xl border-r border-gray-200 z-50 overflow-y-auto">
//   <Sidebar />
// </div>


// {/* Mobile Sidebar (slide-in overlay) */}
// <AnimatePresence>
//   {sidebarOpen && (
//     <>
//       <motion.div
//         initial={{ x: "-100%" }}
//         animate={{ x: 0 }}
//         exit={{ x: "-100%" }}
//         transition={{ duration: 0.3 }}
//         className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 md:hidden"
//       >
//         <Sidebar />
//       </motion.div>

//       {/* Dark backdrop overlay */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 0.5 }}
//         exit={{ opacity: 0 }}
//         onClick={() => setSidebarOpen(false)}
//         className="fixed inset-0 bg-black/50 z-40 md:hidden"
//       />
//     </>
//   )}
// </AnimatePresence>


//       {/* 📍 Main Content */}
//       <main className="flex-1 p-6 md:p-10 mt-[60px] md:mt-0 md:ml-72 transition-all">
//         {activeTab === "profile" && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow-xl"
//           >
//             <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
//               <User size={24} /> Profile Overview
//             </h1>

//             {/* 📊 Booking Stats */}
// <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//   {/* Total */}
//   <div className="p-4 rounded-lg shadow bg-indigo-100 border-l-4 border-indigo-500 hover:scale-[1.02] transition">
//     <p className="text-sm text-gray-700 font-medium">Total</p>
//     <p className="text-2xl font-bold text-indigo-600 mt-1">
//       {stats?.totalBookings ?? 0}
//     </p>
//   </div>

//   {/* Completed */}
//   <div className="p-4 rounded-lg shadow bg-emerald-100 border-l-4 border-green-500 hover:scale-[1.02] transition">
//     <p className="text-sm text-gray-700 font-medium">Booked</p>
//     <p className="text-2xl font-bold text-green-600 mt-1">
//       {stats?.booked ?? 0}
//     </p>
//     <div className="mt-2 h-2 bg-gray-200 rounded-full">
//       <div
//         className="h-2 bg-emerald-600 rounded-full transition-all"
//         style={{
//           width: `${
//             stats?.totalBookings
//               ? ((stats.booked / stats.totalBookings) * 100).toFixed(1)
//               : 0
//           }%`,
//         }}
//       />
//     </div>
//   </div>

//   {/* Cancelled */}
//   <div className="p-4 rounded-lg shadow bg-red-100 border-l-4 border-rose-500 hover:scale-[1.02] transition">
//     <p className="text-sm text-gray-700 font-medium">Cancelled</p>
//     <p className="text-2xl font-bold text-rose-600 mt-1">
//       {stats?.cancelled ?? 0}
//     </p>
//     <div className="mt-2 h-2 bg-gray-200 rounded-full">
//       <div
//         className="h-2 bg-red-600 rounded-full transition-all"
//         style={{
//           width: `${
//             stats?.totalBookings
//               ? ((stats.cancelled / stats.totalBookings) * 100).toFixed(1)
//               : 0
//           }%`,
//         }}
//       />
//     </div>
//   </div>
// </div>


//             {/* Profile Fields */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <p className="text-sm text-gray-500">Name</p>
//                 <p className="font-semibold text-gray-800">
//                   {profile.name || "—"}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Mobile</p>
//                 <p className="font-semibold text-gray-800">
//                   {profile.mobile || "—"}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Email</p>
//                 <p className="font-semibold text-gray-800">{profile.email}</p>
//               </div>
//               {/* <div>
//                 <p className="text-sm text-gray-500">City</p>
//                 <p className="font-semibold text-gray-800 mb-5">
//                   {profile.city || "—"}
//                 </p>
//               </div> */}
//               {role === "agent" ? (
//   <div>
//                 <p className="text-sm text-gray-500">company</p>
//                 <p className="font-semibold text-gray-800 mb-5">
//                   {profile.company || "—"}
//                 </p>
//               </div>
// ) : (
//   <div>
//                 <p className="text-sm text-gray-500">City</p>
//                 <p className="font-semibold text-gray-800 mb-5">
//                   {profile.city || "—"}
//                 </p>
//               </div>
// )}

//             </div>

//             <Button onClick={() => setEditMode(true)} color="purple">
//               ✏️ Edit Profile
//             </Button>
//           </motion.div>
//         )}
//         <AnimatePresence>
//           {editMode && (
//             <>
//               {/* 🔲 Backdrop */}
//               <motion.div
//                 className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 onClick={() => setEditMode(false)}
//               />

//               {/* ✨ Modal */}
//               <motion.div
//                 initial={{ opacity: 0, y: -30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -30 }}
//                 transition={{ duration: 0.25 }}
//                 className="fixed inset-0 flex justify-center items-center z-50 px-4"
//               >
//                 <div className="bg-white max-w-2xl w-full rounded-2xl p-6 shadow-2xl relative">
//                   <button
//                     onClick={() => setEditMode(false)}
//                     className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
//                   >
//                     ✕
//                   </button>

//                   <h2 className="text-2xl font-bold mb-6 text-gray-800">
//                     Edit Profile
//                   </h2>

//                   {message && (
//                     <div
//                       className={`mb-4 text-center text-sm font-medium ${
//                         message.startsWith("✅")
//                           ? "text-green-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {message}
//                     </div>
//                   )}

//                   <form
//                     onSubmit={handleSubmit}
//                     className="grid grid-cols-1 md:grid-cols-2 gap-4"
//                   >
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">
//                         Name
//                       </label>
//                       <input
//                         type="text"
//                         name="name"
//                         value={form.name}
//                         onChange={handleChange}
//                         className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">
//                         Mobile
//                       </label>
//                       <input
//                         type="text"
//                         name="mobile"
//                         value={form.mobile}
//                         onChange={handleChange}
//                         className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">
//                         Email
//                       </label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={form.email}
//                         disabled
//                         className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
//                       />
//                     </div>
//                     {role === "agent" ? (
// <div>
//                       <label className="block text-sm text-gray-600 mb-1">
//                         company
//                       </label>
//                       <input
//                         type="text"
//                         name="company"
//                         value={form.company}
//                         onChange={handleChange}
//                         className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                       />
//                     </div>
// ) : (
//   <div>
//                       <label className="block text-sm text-gray-600 mb-1">
//                         City
//                       </label>
//                       <input
//                         type="text"
//                         name="city"
//                         value={form.city}
//                         onChange={handleChange}
//                         className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
//                       />
//                     </div>
// )}
                    

//                     <div className="col-span-2 flex gap-4 mt-4">
//                       <Button onClick={() => setEditMode(false)} color="orange">
//                         Cancel
//                       </Button>
//                       <Button type="submit" color="purple">
//                         Save Changes
//                       </Button>
//                     </div>
//                   </form>
//                 </div>
//               </motion.div>
//             </>
//           )}
//         </AnimatePresence>
//         <AnimatePresence>
//           {passwordModalOpen && (
//             <>
//               {/* 🔲 Backdrop */}
//               <motion.div
//                 className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 onClick={() => setPasswordModalOpen(false)}
//               />

//               {/* 🔐 Modal */}
//               <motion.div
//                 initial={{ opacity: 0, y: -30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -30 }}
//                 transition={{ duration: 0.25 }}
//                 className="fixed inset-0 flex justify-center items-center z-50 px-4"
//               >
//                 <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl relative">
//                   <button
//                     onClick={() => setPasswordModalOpen(false)}
//                     className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
//                   >
//                     ✕
//                   </button>

//                   <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
//                     <Settings size={24} /> Change Password
//                   </h2>

//                   {passwordMsg && (
//                     <div
//                       className={`mb-4 text-center text-sm font-medium ${
//                         passwordMsg.startsWith("✅")
//                           ? "text-green-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {passwordMsg}
//                     </div>
//                   )}

//                   <form onSubmit={handlePasswordSubmit} className="space-y-4">
//                     {/* Old Password */}
//                     <div className="relative">
//                       <input
//                         type={passwordVisibility.old ? "text" : "password"}
//                         name="oldPassword"
//                         value={passwordForm.oldPassword}
//                         onChange={(e) =>
//                           setPasswordForm({
//                             ...passwordForm,
//                             oldPassword: e.target.value,
//                           })
//                         }
//                         placeholder="Old Password"
//                         className="w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => togglePassword("old")}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                       >
//                         {passwordVisibility.old ? (
//                           <EyeOff size={20} />
//                         ) : (
//                           <Eye size={20} />
//                         )}
//                       </button>
//                     </div>

//                     {/* New Password */}
//                     <div className="relative">
//                       <input
//                         type={passwordVisibility.new ? "text" : "password"}
//                         name="newPassword"
//                         value={passwordForm.newPassword}
//                         onChange={(e) =>
//                           setPasswordForm({
//                             ...passwordForm,
//                             newPassword: e.target.value,
//                           })
//                         }
//                         placeholder="New Password"
//                         className="w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => togglePassword("new")}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                       >
//                         {passwordVisibility.new ? (
//                           <EyeOff size={20} />
//                         ) : (
//                           <Eye size={20} />
//                         )}
//                       </button>
//                     </div>

//                     {/* Confirm Password */}
//                     <div className="relative">
//                       <input
//                         type={passwordVisibility.confirm ? "text" : "password"}
//                         name="confirmPassword"
//                         value={passwordForm.confirmPassword}
//                         onChange={(e) =>
//                           setPasswordForm({
//                             ...passwordForm,
//                             confirmPassword: e.target.value,
//                           })
//                         }
//                         placeholder="Confirm New Password"
//                         className="w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => togglePassword("confirm")}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                       >
//                         {passwordVisibility.confirm ? (
//                           <EyeOff size={20} />
//                         ) : (
//                           <Eye size={20} />
//                         )}
//                       </button>
//                     </div>

//                     <div className="flex gap-4 mt-4">
//                       <Button
//                         onClick={() => setPasswordModalOpen(false)}
//                         color="orange"
//                       >
//                         Cancel
//                       </Button>
//                       <Button type="submit" color="red">
//                         Save Password
//                       </Button>
//                     </div>
//                   </form>
//                 </div>
//               </motion.div>
//             </>
//           )}
//         </AnimatePresence>
//       </main>
//     </div>
//   );
// }

import React, { useEffect, useState, useContext, useRef } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import {
  Eye,
  EyeOff,
  LogOut,
  User,
  Ticket,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../ui/ColorfulButton";

export default function Profile() {
  const { token, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const [role, setRole] = useState("user");
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ total: 0, booked: 0, cancelled: 0 });

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    company: "",
  });
  const [message, setMessage] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const togglePassword = (field) =>
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));

  // ✅ Fetch user + stats
  useEffect(() => {
    if (token) {
      const role = JSON.parse(atob(token.split(".")[1]))?.role || "user";
      const profileEndpoint =
        role === "agent" ? "/api/agent/profile" : "/api/user/profile";

      API.get(profileEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          const data = res.data.user || res.data;
          setProfile(data);
          setRole(role);
          setForm({
            name: data.name || "",
            email: data.email || "",
            mobile: data.mobile || "",
            city: data.city || "",
            company: data.company || "",
          });
        })
        .catch(console.error);

      API.get("/api/bookings/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setStats(res.data.stats))
        .catch(console.error);
    }
  }, [token]);

  // ✅ Outside click to close sidebar (mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        window.innerWidth < 768 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen)
      document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // ✅ Always show sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    if (!passwordModalOpen) {
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordMsg("");
    }
  }, [passwordModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint =
      role === "agent" ? "/api/agent/profile" : "/api/user/profile";

    try {
      const { data } = await API.put(endpoint, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.user);
      setProfile(data.user);
      setMessage("✅ Profile updated successfully");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg("");

    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      return setPasswordMsg("⚠️ All fields are required");
    }
    if (passwordForm.newPassword.length < 6) {
      return setPasswordMsg("⚠️ New password must be at least 6 characters");
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPasswordMsg("⚠️ New passwords do not match");
    }

    try {
      const { data } = await API.put(
        "/api/user/change-password",
        {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordMsg(data.message);
      setPasswordModalOpen(false);
    } catch (err) {
      setPasswordMsg(
        err.response?.data?.message || "❌ Failed to change password"
      );
    }
  };

  useEffect(() => {
    document.body.style.overflow = editMode ? "hidden" : "auto";
  }, [editMode]);

  // 🎯 Sidebar Buttons
  const NavButton = ({ active, icon: Icon, label, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg w-full transition
      ${
        active
          ? `bg-indigo-600 text-white shadow-md scale-[1.02]`
          : "hover:bg-gray-100 text-gray-800 hover:scale-[1.02] transition-all"
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const Sidebar = () => (
    <aside className="w-72 bg-white h-full p-6 flex flex-col justify-between shadow-2xl md:shadow-none">
      <div>
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-lg font-bold text-gray-700">Menu</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={28} />
          </button>
        </div>
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-3 text-lg font-semibold text-gray-800">
            {profile?.name}
          </h2>
          <p className="text-sm text-gray-500">{profile?.email}</p>
        </div>
        <nav className="space-y-3">
          <NavButton
            active={activeTab === "profile"}
            icon={User}
            label="Profile"
            onClick={() => {
              setActiveTab("profile");
              setSidebarOpen(false);
            }}
          />
          <NavButton
            active={activeTab === "bookings"}
            icon={Ticket}
            label="My Bookings"
            onClick={() => {
              navigate("/bookings");
              setSidebarOpen(false);
            }}
          />
          <NavButton
            active={activeTab === "password"}
            icon={Settings}
            label="Change Password"
            onClick={() => {
              setPasswordModalOpen(true);
              setSidebarOpen(false);
            }}
          />
        </nav>
      </div>

      <Button
        onClick={() => {
          localStorage.removeItem("token");
          setUser(null);
          navigate("/");
        }}
        variant="solid"
        color="red"
      >
        <LogOut size={20} />
        Logout
      </Button>
    </aside>
  );

  if (!profile)
    return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-blue-50">
      {/* 🍔 Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-indigo-100 shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-lg font-semibold">{profile?.name}</h1>
        </div>
        <button onClick={() => setSidebarOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* 🧭 Unified Sidebar (Desktop + Mobile) */}
      <div
  ref={sidebarRef}
  className={`transition-all duration-300 ease-in-out
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    fixed md:relative z-30 md:z-10 h-[calc(100vh-60px)] md:h-full bg-white border-r border-gray-200
    shadow-lg md:shadow-none md:w-72 w-72 top-[70px] md:top-0`}
>
  <Sidebar />
</div>


      {/* Overlay (Mobile Only) */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 📍 Main Content */}
           {/* 📍 Main Content */}
      <main className="flex-1 p-6 md:p-10 mt-[60px] md:mt-0 md:ml-72 transition-all overflow-y-auto">
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow-xl"
          >
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <User size={24} /> Profile Overview
            </h1>

            {/* 📊 Booking Stats */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
  {/* Total */}
  <div className="p-4 rounded-lg shadow bg-indigo-100 border-l-4 border-indigo-500 hover:scale-[1.02] transition">
    <p className="text-sm text-gray-700 font-medium">Total</p>
    <p className="text-2xl font-bold text-indigo-600 mt-1">
      {stats?.totalBookings ?? 0}
    </p>
  </div>

  {/* Completed */}
  <div className="p-4 rounded-lg shadow bg-emerald-100 border-l-4 border-green-500 hover:scale-[1.02] transition">
    <p className="text-sm text-gray-700 font-medium">Booked</p>
    <p className="text-2xl font-bold text-green-600 mt-1">
      {stats?.booked ?? 0}
    </p>
    <div className="mt-2 h-2 bg-gray-200 rounded-full">
      <div
        className="h-2 bg-emerald-600 rounded-full transition-all"
        style={{
          width: `${
            stats?.totalBookings
              ? ((stats.booked / stats.totalBookings) * 100).toFixed(1)
              : 0
          }%`,
        }}
      />
    </div>
  </div>

  {/* Cancelled */}
  <div className="p-4 rounded-lg shadow bg-red-100 border-l-4 border-rose-500 hover:scale-[1.02] transition">
    <p className="text-sm text-gray-700 font-medium">Cancelled</p>
    <p className="text-2xl font-bold text-rose-600 mt-1">
      {stats?.cancelled ?? 0}
    </p>
    <div className="mt-2 h-2 bg-gray-200 rounded-full">
      <div
        className="h-2 bg-red-600 rounded-full transition-all"
        style={{
          width: `${
            stats?.totalBookings
              ? ((stats.cancelled / stats.totalBookings) * 100).toFixed(1)
              : 0
          }%`,
        }}
      />
    </div>
  </div>
</div>


            {/* Profile Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-800">
                  {profile.name || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mobile</p>
                <p className="font-semibold text-gray-800">
                  {profile.mobile || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-800">{profile.email}</p>
              </div>
              {/* <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="font-semibold text-gray-800 mb-5">
                  {profile.city || "—"}
                </p>
              </div> */}
              {role === "agent" ? (
  <div>
                <p className="text-sm text-gray-500">company</p>
                <p className="font-semibold text-gray-800 mb-5">
                  {profile.company || "—"}
                </p>
              </div>
) : (
  <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="font-semibold text-gray-800 mb-5">
                  {profile.city || "—"}
                </p>
              </div>
)}

            </div>

            <Button onClick={() => setEditMode(true)} color="purple">
              ✏️ Edit Profile
            </Button>
          </motion.div>
        )}
        <AnimatePresence>
          {editMode && (
            <>
              {/* 🔲 Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setEditMode(false)}
              />

              {/* ✨ Modal */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 flex justify-center items-center z-50 px-4"
              >
                <div className="bg-white max-w-2xl w-full rounded-2xl p-6 shadow-2xl relative">
                  <button
                    onClick={() => setEditMode(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                  >
                    ✕
                  </button>

                  <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Edit Profile
                  </h2>

                  {message && (
                    <div
                      className={`mb-4 text-center text-sm font-medium ${
                        message.startsWith("✅")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Mobile
                      </label>
                      <input
                        type="text"
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        disabled
                        className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    {role === "agent" ? (
<div>
                      <label className="block text-sm text-gray-600 mb-1">
                        company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
) : (
  <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
)}
                    

                    <div className="col-span-2 flex gap-4 mt-4">
                      <Button onClick={() => setEditMode(false)} color="orange">
                        Cancel
                      </Button>
                      <Button type="submit" color="purple">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {passwordModalOpen && (
            <>
              {/* 🔲 Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPasswordModalOpen(false)}
              />

              {/* 🔐 Modal */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 flex justify-center items-center z-50 px-4"
              >
                <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl relative">
                  <button
                    onClick={() => setPasswordModalOpen(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                  >
                    ✕
                  </button>

                  <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                    <Settings size={24} /> Change Password
                  </h2>

                  {passwordMsg && (
                    <div
                      className={`mb-4 text-center text-sm font-medium ${
                        passwordMsg.startsWith("✅")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {passwordMsg}
                    </div>
                  )}

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    {/* Old Password */}
                    <div className="relative">
                      <input
                        type={passwordVisibility.old ? "text" : "password"}
                        name="oldPassword"
                        value={passwordForm.oldPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            oldPassword: e.target.value,
                          })
                        }
                        placeholder="Old Password"
                        className="w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("old")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {passwordVisibility.old ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>

                    {/* New Password */}
                    <div className="relative">
                      <input
                        type={passwordVisibility.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="New Password"
                        className="w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("new")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {passwordVisibility.new ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                      <input
                        type={passwordVisibility.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm New Password"
                        className="w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => togglePassword("confirm")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {passwordVisibility.confirm ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>

                    <div className="flex gap-4 mt-4">
                      <Button
                        onClick={() => setPasswordModalOpen(false)}
                        color="orange"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" color="red">
                        Save Password
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

