
// src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import OfferSection from "./components/OfferSection";
import Offers from "./components/Offers";
import BookTicket from "./components/BookTicket";
import BusDetails from "./components/BusDetails";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";

import Signup from "./components/Signup";
import Login from "./components/Login";
import MyAccount from "./pages/MyAccount";
import Amenities from "./components/Amentities";
import BusGallery from "./components/BusGallery";

import AdminLogin from "./admin/AdminLogin";
import ProtectedRoute from "./admin/ProtectedRoute";
import AdminDashboard from "./admin/pages/AdminDashboard";
import UserBookingPage from "./admin/UserBookingPage";
import SearchResults from "./pages/SearchResult";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";
import AdminUsers from "./admin/pages/AdminUsers";
import ContactPage from "./pages/ContactPage";
import { Toaster } from "react-hot-toast";
import AdminMessages from "./admin/pages/AdminMessages";
import TermsAndConditions from "./pages/TermAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LoginModal from "./components/LoginModal";
import AdminPassengerList from "./admin/pages/AdminPassengerList";
import AdminBookingSummary from "./admin/pages/AdminBookingSummary";
import AgentLogin from "./pages/AgentLogin";
import AgentDashboard from "./pages/AgentDashboard";
import ViewBuses from "./admin/pages/ViewBuses";
import AdminLayout from "./admin/AdminLayout";
import ScheduleGenerator from "./admin/pages/ScheduleGenerator";
import AdminAgents from "./admin/pages/AdminAgents";
import ResetPassword from "./pages/ResetPassword";



function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
     <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

     
<Routes>
  {/* 🌐 Public Site */}
  <Route
    path="/"
    element={
      <>
        <Header
          onSignup={() => setShowSignup(true)}
          onLogin={() => setShowLogin(true)}
        />
        <HeroSection />
        <OfferSection />
        <Offers />
        <Amenities />
        <BookTicket />
        <Testimonials />
        <BusDetails />
        <Footer />
        {showSignup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg relative w-96">
              <button
                className="absolute top-2 right-2 text-gray-500"
                onClick={() => setShowSignup(false)}
              >
                ✕
              </button>
              <Signup onClose={() => setShowSignup(false)} />
            </div>
          </div>
        )}
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </>
    }
  />

  {/* 👤 My Account */}
  <Route
    path="/myaccount"
    element={
      <>
        <Header />
        <MyAccount />
        <Footer />
      </>
    }
  />

  <Route
    path="/contact-us"
    element={
      <>
        <Header />
        <ContactPage />
        <Footer />
      </>
    }
  />

  {/* 🔐 Login Modal */}
  <Route
    path="/login"
    element={<LoginModal onClose={() => window.history.back()} />}
  />

  <Route
    path="/search-results"
    element={
      <>
        <Header />
        <SearchResults />
        <Footer />
      </>
    }
  />

  <Route
    path="/terms-and-conditions"
    element={
      <>
        <Header />
        <TermsAndConditions />
        <Footer />
      </>
    }
  />

  <Route
    path="/privacy-policy"
    element={
      <>
        <Header />
        <PrivacyPolicy />
        <Footer />
      </>
    }
  />

  {/* 🎟 Booking Page */}
  <Route
    path="/booking/:scheduleId"
    element={
      <>
        <Header />
        <UserBookingPage />
        <Footer />
      </>
    }
  />

  {/* 🧭 Admin Panel */}
  <Route path="/admin/login" element={<AdminLogin />} />

  {/* Wrap all admin routes inside ProtectedRoute + AdminLayout */}
  <Route
    path="/admin"
    element={
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
<Route index element={<AdminDashboard />} />
  <Route path="buses" element={<ViewBuses />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="agents" element={<AdminAgents />} />
  <Route path="messages" element={<AdminMessages />} />
  <Route path="schedule" element={<ScheduleGenerator />} />
  <Route path="passenger-list" element={<AdminPassengerList />} />
  <Route path="total-bookings" element={<AdminBookingSummary />} />
  </Route>

  {/* 🧑‍💼 Agent Portal */}
  <Route path="/login" element={<AgentLogin />} />
  <Route path="/agent/dashboard" element={<AgentDashboard />} />

  {/* 👤 User Pages */}
  <Route path="/profile" element={<Profile />} />
  <Route
    path="/bookings"
    element={
      <>
        <Header />
        <Bookings />
        <Footer />
      </>
    }
  />
  <Route
    path="/reset-password/:token"
    element={
      <>
        <Header />
        <ResetPassword />
        <Footer />
      </>
    }
  />
</Routes>

    </>
  );
}

export default App;

