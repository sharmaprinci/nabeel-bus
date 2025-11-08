import React, { useState, useEffect } from "react";

// ✅ Static test data for immediate design preview
const staticDestinations = [
  {
    _id: "1",
    name: "Bareilly",
    trips: 26,
    img: "/images/bareilly.jpg",
    buses: [
      { name: "SuperFast Express", departureTime: "08:00 AM", price: 500 },
      { name: "Comfort Ride", departureTime: "12:00 PM", price: 450 },
    ],
  },
  {
    _id: "2",
    name: "Shahjahanpur",
    trips: 18,
    img: "/images/spn.webp",
    buses: [
      { name: "RapidBus", departureTime: "09:30 AM", price: 400 },
      { name: "Night Cruiser", departureTime: "10:00 PM", price: 550 },
    ],
  },
];

const DestinationSection = () => {
  const [destinations, setDestinations] = useState(staticDestinations);
  const [selectedDestination, setSelectedDestination] = useState(null);


  return (
    <section className=" py-5 relative">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-4xl text-gray-800 font-semibold text-center mb-8">
          Book Bus Ticket Online & Travel Anywhere
        </h2>
        <div className="w-16 h-1 bg-gray-400 mx-auto mb-6"></div>
        <p className="text-3xl text-gray-500 text-center mb-8">
          Just a click away
        </p>
      </div>

      {/* Cards Grid */}
      <div className="flex flex-wrap justify-center gap-8 px-6">
        {destinations.map((dest) => (
          <div
            key={dest._id}
            onClick={() => setSelectedDestination(dest)}
            className="flex items-center bg-white rounded-2xl w-[20%] min-w-[220px] shadow-lg p-4 cursor-pointer hover:shadow-2xl transition-all duration-300"
          >
            <img
              src={dest.img}
              alt={dest.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {dest.name}
              </h3>
              <p className="text-sm text-gray-500">{dest.trips} trips available</p>
            </div>
          </div>
        ))}
      </div>

      {/* Drawer for Bus Details */}
      <div
        className={`fixed top-0 right-0 h-full w-[90%] sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          selectedDestination ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {selectedDestination?.name} — Available Buses
          </h2>
          <button
            onClick={() => setSelectedDestination(null)}
            className="text-gray-600 hover:text-red-500 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          {selectedDestination?.buses?.length > 0 ? (
            selectedDestination.buses.map((bus, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-xl mb-4 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-800">{bus.name}</h3>
                <p className="text-gray-500">Departure: {bus.departureTime}</p>
                <p className="text-gray-700 font-semibold">₹{bus.price}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No buses available.</p>
          )}
        </div>
      </div>

      {/* Overlay */}
      {selectedDestination && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setSelectedDestination(null)}
        ></div>
      )}
    </section>
  );
};

export default DestinationSection;
