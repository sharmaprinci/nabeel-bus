import React, { useState, useEffect, useContext } from "react";
import API from "../api";
import PaymentForm from "./PaymentForm";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// =============================
// 🪄 Seat Layout Config
// =============================

const SEATER_W = 45;
const SEATER_H = 40;

const SLEEPER_W = 90;
const SINGLE_SLEEPER_H = 40;

// const DOUBLE_SLEEPER_W = 90;
const DOUBLE_SLEEPER_H = 40;

const GAP = 2;
const MAX_COLS = 9;

// =============================
// 🪄 Helpers
// =============================

const getSeatLabel = (seatKey = "", suffix = "") => {
  if (!seatKey) return "";

  // Short form: UD1 / UD1A etc.
  const m = seatKey.match(/^([A-Z]+)(\d+)([A-Z]*)$/i);
  if (m) {
    const [, prefix, number, existingSuffix] = m;
    // If caller gave a suffix (A/B), prefer that; else keep existing
    const suf = (suffix || existingSuffix || "").toUpperCase();
    return `${prefix.toUpperCase()}${Number(number)}${suf}`;
  }

  // Structured form: seater_lower_double_0, sleeper_upper_double_4, etc.
  const parts = seatKey.split("_");
  if (parts.length === 4) {
    const [type, deck, category, indexStr] = parts;
    const num = Number(indexStr) + 1; // 1-based label
    let prefix = "S";

    if (type === "sleeper") {
      if (deck === "lower" && category === "double") prefix = "LD";
      if (deck === "lower" && category === "single") prefix = "LC";
      if (deck === "upper" && category === "double") prefix = "UD";
      if (deck === "upper" && category === "single") prefix = "UC";
    } else if (type === "seater") {
      // Seat numbers as plain 1..N
      return `${num}`;
    }

    const suf = (suffix || "").toUpperCase();
    return `${prefix}${num}${suf}`;
  }

  // Fallback (shouldn't happen)
  return seatKey.toString().toUpperCase();
};

const parseSeatKey = (seatKey = "") => {
  if (!seatKey) return { type: "", deck: "", category: "", index: 0 };

  // Short: UD1 / UD1A etc.
  const m = seatKey.match(/^([A-Z]+)(\d+)([A-Z]*)$/i);
  if (m) {
    const [, prefix, number] = m;
    let type = "seater";
    let deck = "";
    let category = "single";

    const P = prefix.toUpperCase();
    if (P.startsWith("U")) deck = "upper";
    if (P.startsWith("L")) deck = "lower";
    if (P[1] === "C") {
      type = "sleeper";
      category = "single";
    }
    if (P[1] === "D") {
      type = "sleeper";
      category = "double";
    }

    return { type, deck, category, index: Number(number) - 1 }; // 0-based internal
  }

  // Structured: seater_lower_double_0
  const parts = seatKey.split("_");
  if (parts.length === 4) {
    const [type, deck, category, index] = parts;
    return { type, deck, category, index: Number(index) };
  }

  return { type: "", deck: "", category: "", index: 0 };
};

const groupSeats = (seatStatus) => {
  const grouped = {};
  Object.keys(seatStatus).forEach((seatKey) => {
    const { type, deck, category } = parseSeatKey(seatKey);
    if (!grouped[deck]) grouped[deck] = {};
    const groupKey = `${type}_${category}`;
    if (!grouped[deck][groupKey]) grouped[deck][groupKey] = [];
    grouped[deck][groupKey].push(seatKey);
  });

  for (const deck in grouped) {
    for (const key in grouped[deck]) {
      grouped[deck][key].sort(
        (a, b) => parseSeatKey(a).index - parseSeatKey(b).index
      );
    }
  }
  return grouped;
};

// =============================
// 🪑 Seat Component
// =============================

const Seat = ({
  seatKey,
  seatStatus,
  selectedSeats,
  setSelectedSeats,
  getFare,
  labelSuffix = "", // <-- NEW
}) => {
  const status = seatStatus[seatKey];
  const booked = status === 1; // ✅ booked
  const locked = status === 2; // ✅ locked

  const selected = selectedSeats.includes(seatKey);
  const { type, category } = parseSeatKey(seatKey);

  let width = SEATER_W;
  let height = SEATER_H;
  let shapeClass = "rounded";
  let baseColor = "bg-gray-200 border-gray-400";

  if (type === "sleeper" && category === "single") {
    width = SLEEPER_W;
    height = SINGLE_SLEEPER_H;
    shapeClass = "rounded-md";
    baseColor = "bg-teal-100 border-teal-400";
  } else if (type === "sleeper" && category === "double") {
    width = SLEEPER_W;
    height = DOUBLE_SLEEPER_H;
    shapeClass = "rounded-md";
    baseColor = "bg-indigo-100 border-indigo-400";
  }

  const bg = booked
    ? "bg-gray-300 border-gray-300 cursor-not-allowed"
    : locked
    ? "bg-yellow-400 border-yellow-500 cursor-not-allowed"
    : selected
    ? "bg-green-500 border-green-500 text-white"
    : `${baseColor} hover:brightness-105 transition-colors`;

  // const handleClick = () => {
  //   if (booked || locked) return;
  //   setSelectedSeats((prev) =>
  //     prev.includes(seatKey)
  //       ? prev.filter((s) => s !== seatKey)
  //       : [...prev, seatKey]
  //   );
  // };

  const handleClick = () => {
    if (booked || locked) return; // can’t select booked/locked seats
    setSelectedSeats((prev) =>
      prev.includes(seatKey)
        ? prev.filter((s) => s !== seatKey)
        : [...prev, seatKey]
    );
  };

  const fare = getFare ? getFare(type, category) : 0;

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-center text-xs ${shapeClass} ${bg}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        minWidth: `${width}px`,
        transition: "all 0.2s ease",
      }}
    >
      <div className="font-semibold">{getSeatLabel(seatKey, labelSuffix)}</div>
    </div>
  );
};

const renderSeaterWithLDLayout = (
  seaterKeys,
  sleeperDoubleKeys,
  seatStatus,
  selectedSeats,
  setSelectedSeats,
  getFare
) => {
  // sort both arrays
  seaterKeys.sort((a, b) => parseSeatKey(a).index - parseSeatKey(b).index);
  sleeperDoubleKeys.sort(
    (a, b) => parseSeatKey(a).index - parseSeatKey(b).index
  );

  const hasLD = sleeperDoubleKeys.length > 0;
  const ldCount = sleeperDoubleKeys.length;

  // how many columns for seaters (reserve ldCount columns for LD)
  const seaterCols = Math.min(
    MAX_COLS - ldCount,
    Math.ceil(seaterKeys.length / 2)
  );
  const totalCols = seaterCols + ldCount;

  // Split seaters into top & bottom rows
  const topRow = [];
  const bottomRow = [];
  for (let i = 0; i < seaterKeys.length; i += 2) {
    topRow.push(seaterKeys[i] ?? null);
    bottomRow.push(seaterKeys[i + 1] ?? null);
  }
  while (topRow.length < seaterCols) topRow.push(null);
  while (bottomRow.length < seaterCols) bottomRow.push(null);

  // Compute min width
  const minWidthPx =
    seaterCols * (SEATER_W + GAP) + ldCount * (SLEEPER_W + GAP);

  return (
    <div className="flex flex-col gap-2 overflow-x-auto">
      {/* Top Row: Seaters + LD A */}
      <div
        className="grid gap-[10px] justify-start"
        style={{
          gridTemplateColumns: `repeat(${totalCols}, auto)`,
          minWidth: `${minWidthPx}px`,
        }}
      >
        {topRow.map((seatKey, i) =>
          seatKey ? (
            <Seat
              key={`top-${seatKey}`}
              seatKey={seatKey}
              seatStatus={seatStatus}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              getFare={getFare}
            />
          ) : (
            <div key={`top-empty-${i}`} />
          )
        )}

        {sleeperDoubleKeys.map((ldKey, idx) => (
          <Seat
            key={`${ldKey}-A`}
            seatKey={ldKey}
            labelSuffix="A"
            seatStatus={seatStatus}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            getFare={getFare}
          />
        ))}
      </div>

      {/* Bottom Row: Seaters + LD B */}
      <div
        className="grid gap-[10px] justify-start"
        style={{
          gridTemplateColumns: `repeat(${totalCols}, auto)`,
          minWidth: `${minWidthPx}px`,
        }}
      >
        {bottomRow.map((seatKey, i) =>
          seatKey ? (
            <Seat
              key={`bottom-${seatKey}`}
              seatKey={seatKey}
              seatStatus={seatStatus}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              getFare={getFare}
            />
          ) : (
            <div key={`bottom-empty-${i}`} />
          )
        )}

        {sleeperDoubleKeys.map((ldKey, idx) => (
          <Seat
            key={`${ldKey}-B`}
            seatKey={ldKey}
            labelSuffix="B"
            seatStatus={seatStatus}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            getFare={getFare}
          />
        ))}
      </div>
    </div>
  );
};

const renderSleeperRow = (
  seatKeys,
  seatStatus,
  selectedSeats,
  setSelectedSeats,
  align = "start",
  getFare // 👈 Pass fare function
) => {
  if (!seatKeys.length) return null;

  const columns = MAX_COLS;
  const rowArray = Array(columns).fill(null);

  // fill LC/UC seats sequentially from left
  for (let i = 0; i < seatKeys.length; i++) {
    rowArray[i] = seatKeys[i];
  }

  return (
    <div
      className="grid gap-[20px] justify-start mt-14"
      style={{
        gridTemplateColumns: `repeat(${MAX_COLS}, ${SLEEPER_W}px`,
        width: "fit-content",
        // minWidth: `${MAX_COLS * SLEEPER_W}px`,
      }}
    >
      {rowArray.map((seatKey, idx) =>
        seatKey ? (
          <Seat
            key={seatKey}
            seatKey={seatKey}
            seatStatus={seatStatus}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            getFare={getFare}
          />
        ) : (
          <div key={`empty-${idx}`} />
        )
      )}
    </div>
  );
};

const renderUpperDoubleSleeperRow = (
  sleeperDoubleKeys,
  seatStatus,
  selectedSeats,
  setSelectedSeats,
  getFare
) => {
  if (!sleeperDoubleKeys.length) return null;

  return (
    <div className="flex flex-col gap-2">
      {/* Top row = A */}
      <div
        className="grid gap-[20px] justify-start"
        style={{
          gridTemplateColumns: `repeat(${sleeperDoubleKeys.length}, ${SLEEPER_W}px)`,
          width: "max-content",
        }}
      >
        {sleeperDoubleKeys.map((seatKey) => (
          <Seat
            key={`${seatKey}-A`}
            seatKey={seatKey}
            labelSuffix="A"
            seatStatus={seatStatus}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            getFare={getFare}
          />
        ))}
      </div>

      {/* Bottom row = B */}
      <div
        className="grid gap-[20px] justify-start"
        style={{
          gridTemplateColumns: `repeat(${sleeperDoubleKeys.length}, ${SLEEPER_W}px)`,
          width: "max-content",
        }}
      >
        {sleeperDoubleKeys.map((seatKey) => (
          <Seat
            key={`${seatKey}-B`}
            seatKey={seatKey}
            labelSuffix="B"
            seatStatus={seatStatus}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            getFare={getFare}
          />
        ))}
      </div>
    </div>
  );
};

const RenderDeckModern = ({
  deck,
  groupedSeats,
  seatStatus,
  selectedSeats,
  setSelectedSeats,
  getFare,
}) => {
  if (!groupedSeats[deck]) return null;

  const seaterKeys =
    groupedSeats[deck]["seater_double"] ||
    groupedSeats[deck]["seater_single"] ||
    [];
  const sleeperDoubleKeys = groupedSeats[deck]["sleeper_double"] || [];
  const sleeperSingleKeys = groupedSeats[deck]["sleeper_single"] || [];

  const seaterFare =
    getFare("seater", "double") || getFare("seater", "single") || 0;
  const singleSleeperFare = getFare("sleeper", "single") || 0;
  const doubleSleeperFare = getFare("sleeper", "double") || 0;

  return (
    <div className="mb-8 border p-6 rounded-lg bg-gray-50 shadow-xl w-full border border-gray-400">
      <div className="flex items-center gap-x-6 mb-4">
        {/* Deck Label */}
        <span className="text-base font-semibold text-gray-700 w-8 text-center [writing-mode:vertical-rl] rotate-180 select-none shrink-0 h-[160px] flex items-center justify-center">
          {deck}
        </span>
        <div className="flex-1">
          {/* Seater + LD combined in 9 columns with multiple rows */}
          {deck === "lower" &&
            (seaterKeys.length > 0 || sleeperDoubleKeys.length > 0) &&
            renderSeaterWithLDLayout(
              seaterKeys,
              sleeperDoubleKeys,
              seatStatus,
              selectedSeats,
              setSelectedSeats,
              getFare
            )}

          {deck === "upper" &&
            sleeperDoubleKeys.length > 0 &&
            renderUpperDoubleSleeperRow(
              sleeperDoubleKeys,
              seatStatus,
              selectedSeats,
              setSelectedSeats,
              getFare
            )}

          {sleeperSingleKeys.length > 0 &&
            renderSleeperRow(
              sleeperSingleKeys,
              seatStatus,
              selectedSeats,
              setSelectedSeats,
              "center",
              getFare
            )}
        </div>
      </div>

      {/* 🏷️ Fare Legend */}
      <div className="flex flex-wrap gap-6 mt-4 justify-center text-sm items-center">
        <div className="flex items-center gap-1">
          <div className="border bg-gray-100 border-gray-400 w-[30px] h-[30px]" />
          <span>Seater {seaterFare > 0 && `- ₹${seaterFare}`}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="border bg-teal-100 border-teal-400 w-[60px] h-[30px] rounded-md" />
          <span>
            Single Sleeper {singleSleeperFare > 0 && `- ₹${singleSleeperFare}`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="border bg-indigo-100 border-indigo-400 w-[90px] h-[30px] rounded-md" />
          <span>
            Double Sleeper {doubleSleeperFare > 0 && `- ₹${doubleSleeperFare}`}
          </span>
        </div>
      </div>
    </div>
  );
};

// ✅ Load Razorpay SDK dynamically if not already loaded
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BookingForm = ({ scheduleId }) => {
  const [schedule, setSchedule] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [booking, setBooking] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showPassengerForm, setShowPassengerForm] = useState(false);
  const [step, setStep] = useState(1);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [isPaying, setIsPaying] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    API.get("/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => setProfile(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await API.get(`/api/bookings/schedule/${scheduleId}`);
        setSchedule(res.data);
      } catch (err) {
        alert(err.response?.data?.message || "Error fetching schedule");
      }
    };
    fetchSchedule();
  }, [scheduleId]);

  if (!schedule) return <div>Loading...</div>;

  const { seatStatus, busId } = schedule;
  const groupedSeats = groupSeats(seatStatus);

  const getFare = (type, category) => {
    const config = busId?.seatConfigs?.find(
      (c) => c.type === type && c.category === category
    );
    return config?.fare || 0;
  };

  const totalAmount = selectedSeats.reduce((acc, seatKey) => {
    const [type, , category] = seatKey.split("_");
    return acc + getFare(type, category);
  }, 0);

  const handleProceed = () => {
    const passengers = selectedSeats.map((seatKey) => ({
      seatKey,
      seatLabel: getSeatLabel(seatKey),
      name: "",
      age: "",
      gender: "",
      fare: (() => {
        const [type, , category] = seatKey.split("_");
        return getFare(type, category);
      })(),
    }));
    setPassengerDetails(passengers);
    setContactInfo(
      profile
        ? {
            name: profile.name || "",
            phone: profile.mobile || "",
            email: profile.email || "",
          }
        : { name: "", phone: "", email: "" }
    );
    setShowPassengerForm(true);
    setStep(1);
  };

  const updatePassenger = (index, field, value) => {
    const updated = [...passengerDetails];
    updated[index][field] = value;
    setPassengerDetails(updated);
  };

  const handleContactChange = (field, value) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const confirmBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (passengerDetails.some((p) => !p.name || !p.age || !p.gender)) {
      return alert("Please fill all passenger details.");
    }

    if (!contactInfo.name || !contactInfo.phone || !contactInfo.email) {
      return alert("Please fill contact information.");
    }

    try {
      setIsPaying(true);

      // 🪝 Lock seats + create booking (and payment order if user)
      const res = await API.post(
        "/api/bookings/lock-seats",
        {
          scheduleId,
          passengers: passengerDetails,
          contact: contactInfo,
          seatKeys: selectedSeats,
          totalAmount,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const { booking, message } = res.data;

      // ✅ Step 1: If agent — no payment needed
      if (user.role === "agent") {
        alert("✅ Booking confirmed successfully! (No payment required)");
        navigate("/bookings");
        setIsPaying(false);
        return;
      }

      // ✅ Step 2: Otherwise (normal user) → payment flow
      const bookingData = {
        ...booking,
        razorpayOrderId: res.data.razorpayOrderId,
        amount: res.data.amount,
      };

      setBooking(bookingData);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("❌ Razorpay SDK failed to load. Please check your internet.");
        setIsPaying(false);
        return;
      }

      openRazorpay(bookingData);
    } catch (err) {
      console.error("❌ Booking error:", err);
      setIsPaying(false);
      alert(`Booking failed: ${err.response?.data?.message || err.message}`);
      // 🆕 Re-fetch latest seat status after error
      try {
        const updated = await API.get(`/api/bookings/schedule/${scheduleId}`);
        setSchedule(updated.data);
      } catch (refreshErr) {
        console.error("Failed to refresh seat status:", refreshErr);
      }
    }
  };

  const openRazorpay = (bookingData) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: bookingData.amount * 100,
      currency: "INR",
      name: "Bus Booking",
      description: `Payment for booking ${bookingData._id}`,
      order_id: bookingData.razorpayOrderId,
      handler: async function (response) {
        try {
          // ✅ Step 1: Verify payment
          await API.post("/api/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingId: bookingData._id,
          });

          // ✅ Step 2: Confirm booking
          await API.post("/api/bookings/confirm-booking", {
            bookingId: bookingData._id,
            paymentId: response.razorpay_payment_id,
            totalAmount: bookingData.amount,
          });

          alert("🎉 Booking confirmed successfully!");
          navigate("/bookings");
        } catch (error) {
          console.error("Payment confirmation error:", error);
          alert("❌ Payment verification or booking confirmation failed!");
        } finally {
          setIsPaying(false);
        }
      },
      theme: { color: "#1BA94C" },
      modal: {
        ondismiss: () => {
          setIsPaying(false);
          console.log("User closed Razorpay checkout");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-start bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6 sm:p-10">
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl border border-gray-200 p-6 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-2">
            🚌 Select Your Seats
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Choose your preferred seat from the layout below
          </p>
        </div>

        {/* Seat Layout */}
        <div className="w-full max-w-full">
          <RenderDeckModern
            deck="lower"
            groupedSeats={groupedSeats}
            seatStatus={seatStatus}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            getFare={getFare}
          />

          <RenderDeckModern
            deck="upper"
            groupedSeats={groupedSeats}
            seatStatus={seatStatus}
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
            getFare={getFare}
          />
        </div>
        {/* Footer Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 border-green-500"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-500 border-2 border-green-500"></div>
            <span className="text-gray-600">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gray-300 border-2 border-gray-400"></div>
            <span className="text-gray-600">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-yellow-400 border-2 border-yellow-500"></div>
            <span className="text-gray-600">Locked</span>
          </div>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 flex justify-between items-center z-50">
          <div className="text-sm font-medium space-y-1">
            {selectedSeats.map((s) => (
              <div key={s}>{getSeatLabel(s)}</div>
            ))}

            {/* 🧾 Show total amount only if NOT an agent */}
            {user?.role !== "agent" && (
              <div className="font-bold text-lg">
                Total: ₹{totalAmount.toLocaleString()}
              </div>
            )}
          </div>

          <button
            onClick={handleProceed}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Proceed to Book
          </button>
        </div>
      )}

      {/* Passenger Details Modal */}
      {showPassengerForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {step === 1 ? "Passenger Details" : "Contact Details"}
            </h3>

            {step === 1 && (
              <>
                {passengerDetails.map((p, i) => (
                  <div
                    key={i}
                    className="border p-3 rounded-lg mb-3 space-y-2 bg-gray-50"
                  >
                    <div className="font-medium text-sm">
                      Seat: {p.seatLabel} — ₹{p.fare}
                    </div>
                    <input
                      type="text"
                      placeholder="Name"
                      value={p.name}
                      onChange={(e) =>
                        updatePassenger(i, "name", e.target.value)
                      }
                      className="w-full border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      value={p.age}
                      onChange={(e) =>
                        updatePassenger(i, "age", e.target.value)
                      }
                      className="w-full border p-2 rounded"
                    />

                    <select
                      value={p.gender}
                      onChange={(e) =>
                        updatePassenger(i, "gender", e.target.value)
                      }
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                ))}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowPassengerForm(false)}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={contactInfo.name}
                  onChange={(e) => handleContactChange("name", e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />
                <div className="mb-2">
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={contactInfo.phone}
                    onChange={(e) =>
                      handleContactChange("phone", e.target.value)
                    }
                    className="w-full border p-2 rounded mb-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    📱 Please enter a valid WhatsApp number — ticket will be
                    sent here.
                  </p>
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={contactInfo.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                  className="w-full border p-2 rounded mb-4"
                />
                <div className="flex justify-between gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Back
                  </button>
                  <button
                    onClick={confirmBooking}
                    disabled={isPaying}
                    className={`px-4 py-2 rounded text-white font-medium ${
                      isPaying
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {isPaying
                      ? "Processing..."
                      : user?.role === "agent"
                      ? "Confirm Booking"
                      : "Confirm & Pay Now"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
    </div>
  );
};

export default BookingForm;
