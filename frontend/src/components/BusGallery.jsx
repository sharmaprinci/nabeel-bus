import React from "react";

const busImages = [
  "/images/bus1.jpg",
  "/images/bus2.jpg",
  "/images/bus3.jpg",
  "/images/bus4.jpg",
  "/images/bus5.jpg",
];

const BusGallery = () => {
  return (
    <section className="max-w-7xl mx-auto py-10 px-4">
     {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-4xl text-gray-800 font-semibold text-center mb-8">
          Bus Gallery
        </h2>
        <div className="w-16 h-1 bg-gray-400 mx-auto mb-6"></div>
        <p className="text-3xl text-gray-500 text-center mb-8">
          Just a click away
        </p>
      </div>

      {/* Horizontal Scroll for smaller screens */}
      <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
        {busImages.map((img, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-64 h-40 md:w-80 md:h-48 rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={img}
              alt={`Bus ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BusGallery;
