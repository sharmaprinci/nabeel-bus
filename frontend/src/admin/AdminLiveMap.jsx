import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { io } from "socket.io-client";
import L from "leaflet";

// ======================
// 🚌 Custom Map Icons
// ======================
const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61205.png",
  iconSize: [40, 40],
});

const startIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

const endIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149059.png",
  iconSize: [30, 30],
});

// ======================
// 🗺️ Smooth Follow Hook
// ======================
const SmoothFollow = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location?.lat && location?.lng) {
      map.flyTo([location.lat, location.lng], 11, { duration: 1.0 });
    }
  }, [location, map]);
  return null;
};

// ======================
// 🌍 Admin Live Map
// ======================
export default function AdminLiveMap({ scheduleId, route }) {
  const [location, setLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);
  const mapRef = useRef(null);

  // 🧭 Fetch coordinates dynamically using OpenStreetMap
  const getCoords = async (city) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`
      );
      const data = await res.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (err) {
      console.error("Geo lookup failed:", err);
      return null;
    }
  };

  // 🌍 Build route (origin → destination)
  useEffect(() => {
    const loadRoute = async () => {
      if (!route?.from || !route?.to) return;
      const fromCoords = await getCoords(route.from);
      const toCoords = await getCoords(route.to);
      if (fromCoords && toCoords) {
        setRouteCoords([fromCoords, toCoords]);
      }
    };
    loadRoute();
  }, [route]);

  // 🚀 Socket: listen to live bus location
  useEffect(() => {
    if (!scheduleId) return;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const socket = io(backendUrl, { transports: ["websocket"] });

    socket.emit("joinBus", scheduleId);

    socket.on("busLocation", (data) => {
      if (data && data.lat && data.lng) {
        setLocation(data);
        setPath((prev) => [...prev, [data.lat, data.lng]]);
      }
    });

    socket.on("disconnect", () => console.warn("🛑 Bus socket disconnected"));
    socket.on("connect", () => console.log("✅ Bus socket connected"));

    return () => socket.disconnect();
  }, [scheduleId]);

  const defaultCenter = routeCoords[0] || { lat: 28.6, lng: 77.2 };

  return (
    <div className="relative w-full h-[420px] rounded-lg overflow-hidden border border-gray-300 shadow-inner">
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={7}
        scrollWheelZoom
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        className="w-full h-full"
      >
        {/* Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Smooth Follow */}
        <SmoothFollow location={location} />

        {/* Draw route line */}
        {routeCoords.length === 2 && (
          <Polyline
            positions={[
              [routeCoords[0].lat, routeCoords[0].lng],
              [routeCoords[1].lat, routeCoords[1].lng],
            ]}
            pathOptions={{ color: "gray", dashArray: "8,6", weight: 3 }}
          />
        )}

        {/* Dynamic path trail */}
        {path.length > 1 && (
          <Polyline positions={path} pathOptions={{ color: "blue", weight: 4 }} />
        )}

        {/* Origin marker */}
        {routeCoords[0] && (
          <Marker position={[routeCoords[0].lat, routeCoords[0].lng]} icon={startIcon}>
            <Popup>🏁 <b>{route.from}</b></Popup>
          </Marker>
        )}

        {/* Destination marker */}
        {routeCoords[1] && (
          <Marker position={[routeCoords[1].lat, routeCoords[1].lng]} icon={endIcon}>
            <Popup>🎯 <b>{route.to}</b></Popup>
          </Marker>
        )}

        {/* Live bus marker */}
        {location && (
          <Marker position={[location.lat, location.lng]} icon={busIcon}>
            <Popup>
              <div className="text-sm">
                <strong>🚌 {route.from} → {route.to}</strong>
                <br />
                Lat: {location.lat.toFixed(4)} <br />
                Lng: {location.lng.toFixed(4)} <br />
                Speed: {location.speed ? `${location.speed} km/h` : "N/A"} <br />
                Time: {new Date(location.timestamp || Date.now()).toLocaleTimeString()}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Overlay info */}
      {location && (
        <div className="absolute bottom-3 left-3 bg-white/90 px-4 py-2 rounded-lg shadow-md text-sm text-gray-700 border border-gray-200">
          <div><b>Current Bus Location</b></div>
          <div>📍 Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</div>
          <div>🚀 Speed: {location.speed ? `${location.speed} km/h` : "N/A"}</div>
          <div>🕓 {new Date(location.timestamp || Date.now()).toLocaleTimeString()}</div>
        </div>
      )}
    </div>
  );
}
