import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import API from "../api";

// =============================
// 🪄 Seat Layout Config
// =============================
const SEATER_W = 45;
const SEATER_H = 40;

const SLEEPER_W = 90;
const SINGLE_SLEEPER_H = 40;
const DOUBLE_SLEEPER_H = 40;
const GAP = 2;
const MAX_COLS = 9;

// =============================
// 🧩 Helpers
// =============================
const getSeatLabel = (seatKey = "", suffix = "") => {
  if (!seatKey) return "";
  const m = seatKey.match(/^([A-Z]+)(\d+)([A-Z]*)$/i);
  if (m) {
    const [, prefix, number, existingSuffix] = m;
    const suf = (suffix || existingSuffix || "").toUpperCase();
    return `${prefix.toUpperCase()}${Number(number)}${suf}`;
  }
  const parts = seatKey.split("_");
  if (parts.length === 4) {
    const [type, deck, category, indexStr] = parts;
    const num = Number(indexStr) + 1;
    let prefix = "S";
    if (type === "sleeper") {
      if (deck === "lower" && category === "double") prefix = "LD";
      if (deck === "lower" && category === "single") prefix = "LC";
      if (deck === "upper" && category === "double") prefix = "UD";
      if (deck === "upper" && category === "single") prefix = "UC";
    } else if (type === "seater") return `${num}`;
    const suf = (suffix || "").toUpperCase();
    return `${prefix}${num}${suf}`;
  }
  return seatKey.toString().toUpperCase();
};

const parseSeatKey = (seatKey = "") => {
  if (!seatKey) return { type: "", deck: "", category: "", index: 0 };
  const m = seatKey.match(/^([A-Z]+)(\d+)([A-Z]*)$/i);
  if (m) {
    const [, prefix, number] = m;
    let type = "seater",
      deck = "",
      category = "single";
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
    return { type, deck, category, index: Number(number) - 1 };
  }
  const parts = seatKey.split("_");
  if (parts.length === 4) {
    const [type, deck, category, index] = parts;
    return { type, deck, category, index: Number(index) };
  }
  return { type: "", deck: "", category: "", index: 0 };
};

const groupSeats = (seatStatus = {}) => {
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
// 🪑 Seat Component (Read-only)
// =============================
const Seat = ({ seatKey, seatStatus, labelSuffix = "" }) => {
  const { type, category } = parseSeatKey(seatKey);
  const status = seatStatus[seatKey] || "available";

  let width = SEATER_W;
  let height = SEATER_H;
  let baseColor = "bg-gray-200 border-gray-400";

  if (type === "sleeper" && category === "single") {
    width = SLEEPER_W;
    height = SINGLE_SLEEPER_H;
    baseColor = "bg-gray-200 border-gray-400";
  } else if (type === "sleeper" && category === "double") {
    width = SLEEPER_W;
    height = DOUBLE_SLEEPER_H;
    baseColor = "bg-gray-200 border-gray-400";
  }

  const colorMap = {
    available: baseColor,
    booked: "bg-gray-500 border-gray-700 text-white",
    locked: "bg-yellow-300 border-yellow-500",
    ladies: "bg-pink-300 border-pink-500 text-white",
  };

  return (
    <div
      className={`flex items-center justify-center text-xs font-semibold rounded ${
        colorMap[status] || baseColor
      }`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        minWidth: `${width}px`,
        margin: "3px",
        transition: "background 0.2s ease, border 0.2s ease",
      }}
      title={`${getSeatLabel(seatKey, labelSuffix)} — ${status}`}
    >
      {getSeatLabel(seatKey, labelSuffix)}
    </div>
  );
};

// =============================
// 🎨 Layout Renderers (read-only version)
// =============================
const renderSeaterWithLDLayout = (
  seaterKeys,
  sleeperDoubleKeys,
  seatStatus
) => {
  seaterKeys.sort((a, b) => parseSeatKey(a).index - parseSeatKey(b).index);
  sleeperDoubleKeys.sort(
    (a, b) => parseSeatKey(a).index - parseSeatKey(b).index
  );

  const ldCount = sleeperDoubleKeys.length;
  const seaterCols = Math.min(
    MAX_COLS - ldCount,
    Math.ceil(seaterKeys.length / 2)
  );
  const totalCols = seaterCols + ldCount;

  const topRow = [];
  const bottomRow = [];
  for (let i = 0; i < seaterKeys.length; i += 2) {
    topRow.push(seaterKeys[i] ?? null);
    bottomRow.push(seaterKeys[i + 1] ?? null);
  }
  while (topRow.length < seaterCols) topRow.push(null);
  while (bottomRow.length < seaterCols) bottomRow.push(null);

  const minWidthPx =
    seaterCols * (SEATER_W + GAP) + ldCount * (SLEEPER_W + GAP);

  return (
    <div className="flex flex-col gap-2 overflow-x-auto">
      {/* Top Row */}
      <div
        className="grid gap-[4px] justify-start"
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
            />
          ) : (
            <div key={`top-empty-${i}`} />
          )
        )}
        {sleeperDoubleKeys.map((ldKey) => (
          <Seat
            key={`${ldKey}-A`}
            seatKey={ldKey}
            seatStatus={seatStatus}
            labelSuffix="A"
          />
        ))}
      </div>

      {/* Bottom Row */}
      <div
        className="grid gap-[4px] justify-start"
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
            />
          ) : (
            <div key={`bottom-empty-${i}`} />
          )
        )}
        {sleeperDoubleKeys.map((ldKey) => (
          <Seat
            key={`${ldKey}-B`}
            seatKey={ldKey}
            seatStatus={seatStatus}
            labelSuffix="B"
          />
        ))}
      </div>
    </div>
  );
};

const renderSleeperRow = (seatKeys, seatStatus) => {
  if (!seatKeys.length) return null;
  const rowArray = Array(MAX_COLS).fill(null);
  for (let i = 0; i < seatKeys.length; i++) rowArray[i] = seatKeys[i];
  return (
    <div
      className="grid gap-[20px] justify-start mt-10"
      style={{ gridTemplateColumns: `repeat(${MAX_COLS}, ${SLEEPER_W}px)` }}
    >
      {rowArray.map((seatKey, i) =>
        seatKey ? (
          <Seat key={seatKey} seatKey={seatKey} seatStatus={seatStatus} />
        ) : (
          <div key={`empty-${i}`} />
        )
      )}
    </div>
  );
};

const renderUpperDoubleSleeperRow = (sleeperDoubleKeys, seatStatus) => {
  if (!sleeperDoubleKeys.length) return null;
  return (
    <div className="flex flex-col gap-2">
      <div
        className="grid gap-[20px] justify-start"
        style={{
          gridTemplateColumns: `repeat(${sleeperDoubleKeys.length}, ${SLEEPER_W}px)`,
        }}
      >
        {sleeperDoubleKeys.map((seatKey) => (
          <Seat
            key={`${seatKey}-A`}
            seatKey={seatKey}
            seatStatus={seatStatus}
            labelSuffix="A"
          />
        ))}
      </div>
      <div
        className="grid gap-[20px] justify-start"
        style={{
          gridTemplateColumns: `repeat(${sleeperDoubleKeys.length}, ${SLEEPER_W}px)`,
        }}
      >
        {sleeperDoubleKeys.map((seatKey) => (
          <Seat
            key={`${seatKey}-B`}
            seatKey={seatKey}
            seatStatus={seatStatus}
            labelSuffix="B"
          />
        ))}
      </div>
    </div>
  );
};

// =============================
// 🚌 Deck Renderer (for Admin)
// =============================
const RenderDeckAdmin = ({ deck, groupedSeats, seatStatus}) => {

  if (!groupedSeats[deck]) return null;
  const seaterKeys =
    groupedSeats[deck]["seater_double"] ||
    groupedSeats[deck]["seater_single"] ||
    [];
  const sleeperDoubleKeys = groupedSeats[deck]["sleeper_double"] || [];
  const sleeperSingleKeys = groupedSeats[deck]["sleeper_single"] || [];

  return (
    <div className="mb-8 border p-6 rounded-lg bg-gray-50 shadow-md border-gray-400">
      <div className="flex items-center gap-x-6 mb-4">
        <span className="text-base font-semibold text-gray-700 w-8 text-center [writing-mode:vertical-rl] rotate-180 h-[160px] flex items-center justify-center">
          {deck}
        </span>
        <div className="flex-1">
          {deck === "lower" &&
            (seaterKeys.length > 0 || sleeperDoubleKeys.length > 0) &&
            renderSeaterWithLDLayout(seaterKeys, sleeperDoubleKeys, seatStatus)}

          {deck === "upper" &&
            sleeperDoubleKeys.length > 0 &&
            renderUpperDoubleSleeperRow(sleeperDoubleKeys, seatStatus)}

          {sleeperSingleKeys.length > 0 &&
            renderSleeperRow(sleeperSingleKeys, seatStatus)}
        </div>
      </div>
    </div>
  );
};

// ✅ Legend Component
const Legend = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-5 h-5 border rounded ${color}`}></div>
    <span>{label}</span>
  </div>
);

// =============================
// 🧭 MAIN COMPONENT
// =============================
export default function AdminLiveBusView({ scheduleId }) {
  const [seatStatus, setSeatStatus] = useState({});
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!scheduleId) return;
    const backendUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const s = io(backendUrl);

    s.emit("joinBus", scheduleId);

    // Listen for seat updates
    s.on("seatStatus", (data) => {
      if (data) {
        const normalized = {};
        Object.entries(data).forEach(([k, v]) => {
          normalized[k] =
            v === 1
              ? "booked"
              : v === 2
              ? "locked"
              : v === 3
              ? "ladies"
              : "available";
        });
        setSeatStatus((prev) => ({ ...prev, ...normalized }));
      }
    });

    setSocket(s);
    return () => s.disconnect();
  }, [scheduleId]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("adminToken")
      const res = await API.get(`/api/bookings/schedule/${scheduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const normalized = {};
      Object.entries(res.data.seatStatus || {}).forEach(([k, v]) => {
        normalized[k] =
          v === 1
            ? "booked"
            : v === 2
            ? "locked"
            : v === 3
            ? "ladies"
            : "available";
      });
      setSeatStatus(normalized);
    };
    if (scheduleId) loadData();
  }, [scheduleId]);

  const groupedSeats = useMemo(() => groupSeats(seatStatus), [seatStatus]);

  // Calculate totals
  const totalSeats = Object.keys(seatStatus).length;
  const booked = Object.values(seatStatus).filter((v) => v === "booked").length;
  const locked = Object.values(seatStatus).filter((v) => v === "locked").length;
  const ladies = Object.values(seatStatus).filter((v) => v === "ladies").length;
  const available = totalSeats - booked - locked - ladies;

  return (
    <div className="p-4 bg-white border rounded-lg">
      <RenderDeckAdmin
        deck="lower"
        groupedSeats={groupedSeats}
        seatStatus={seatStatus}
        totals={{ available, booked, locked, ladies }}
      />
      <RenderDeckAdmin
        deck="upper"
        groupedSeats={groupedSeats}
        seatStatus={seatStatus}
        totals={{ available, booked, locked, ladies }}
      />
      <div className="flex flex-wrap justify-center gap-8 text-sm mt-4 border-t pt-3 font-medium">
        {/* <span>Total Seats: {totalSeats}</span> */}
        <Legend
          color="bg-gray-100 border-gray-400"
          label={`Total Seats- ${totalSeats}`}
        />
        <Legend
          color="bg-green-100 border-green-400"
          label={`Available- ${available}`}
        />
        <Legend
          color="bg-gray-500 border-gray-700 text-white"
          label={`Booked- ${booked}`}
        />
        <Legend
          color="bg-yellow-300 border-yellow-500"
          label={`Locked- ${locked}`}
        />
        <Legend
          color="bg-pink-300 border-pink-500 text-white"
          label={`Ladies- ${ladies}`}
        />
      </div>
    </div>
  );
}
