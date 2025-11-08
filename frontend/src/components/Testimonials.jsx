
// import React, { useEffect, useState } from "react";
// import { FaStar } from "react-icons/fa";

// function Testimonials() {

//     const [testimonials, setTestimonials] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTestimonials = async () => {
//       try {
//         const apiUrl = import.meta.env.VITE_BACKEND_URL;
//         const res = await fetch(`${apiUrl}/api/testimonials`);
//         const data = await res.json();
//         setTestimonials(data);
//       } catch (error) {
//         console.error("Error fetching testimonials:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTestimonials();
//   }, []);

//   return (
//     <section className=" py-5 relative">
//       {/* Section Title */}
    //   <div className="text-center mb-12">
    //     <h2 className="text-4xl text-gray-800 font-semibold text-center mb-8">
    //       What Our Passengers Say
    //     </h2>
    //     <div className="w-16 h-1 bg-gray-400 mx-auto mb-6"></div>
    //     <p className="text-3xl text-gray-500 text-center mb-8">
    //         Real experiences from happy Nabeel Bus travellers
    //     </p>
    //   </div>

//        {loading ? (
//         <div className="text-center text-gray-600">Loading testimonials...</div>
//       ) : testimonials.length === 0 ? (
//         <div className="text-center text-gray-600">
//           No testimonials yet. Be the first to share your experience!
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
//           {testimonials.map((item, idx) => (
//             <div
//               key={idx}
//               className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl transition duration-300 ease-in-out"
//             >
//               <img
//                 src={item.image || "/images/default-user.png"}
//                 alt={item.name}
//                 className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
//               />
//               <h3 className="text-lg font-semibold text-gray-900">
//                 {item.name}
//               </h3>
//               <p className="text-sm text-gray-500 mb-2">{item.location}</p>

//               {/* Rating */}
//               <div className="flex justify-center mb-3">
//                 {[...Array(item.rating || 0)].map((_, i) => (
//                   <FaStar key={i} className="text-yellow-400" />
//                 ))}
//               </div>

//               {/* Review */}
//               <p className="text-gray-700 text-sm leading-relaxed">
//                 "{item.review}"
//               </p>
//             </div>
//           ))}
//         </div>
//       )}

//       </section>
//   )
// }

// export default Testimonials

import React, { useState, useEffect } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Autoplay, Pagination } from "swiper/modules";

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);


  // For now, use static data
  useEffect(() => {
    const staticTestimonials = [
      {
        name: "Rohit Kumar",
        message:
          "Nabeel Bus made my trip from Delhi to Bareilly so comfortable and easy! The booking process was smooth and the bus was on time.",
        rating: 5,
        location: "Delhi",
      },
      {
        name: "Priya Sharma",
        message:
          "Affordable fares and friendly staff. I really appreciate the clean buses and quick service. Highly recommended!",
        rating: 4,
        location: "Lucknow",
      },
      {
        name: "Amit Verma",
        message:
          "One of the best online booking experiences I’ve had! Got my ticket instantly and the bus arrived exactly as scheduled.",
        rating: 5,
        location: "Agra",
      },
      {
        name: "Priya Sharma",
        message:
          "Affordable fares and friendly staff. I really appreciate the clean buses and quick service. Highly recommended!",
        rating: 4,
        location: "Lucknow",
      },
      {
        name: "Amit Verma",
        message:
          "One of the best online booking experiences I’ve had! Got my ticket instantly and the bus arrived exactly as scheduled.",
        rating: 5,
        location: "Agra",
      },
    ];
    setTestimonials(staticTestimonials);
  }, []);


//   useEffect(() => {
//     const apiUrl = import.meta.env.VITE_BACKEND_URL;

//     // Fetch reviews from backend
//     fetch(`${apiUrl}/api/testimonials`)
//       .then((res) => res.json())
//       .then((data) => setTestimonials(data))
//       .catch((err) => console.error("Failed to fetch testimonials:", err));
//   }, []);

//   // Auto-slide every 5 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrent((prev) => (testimonials.length ? (prev + 1) % testimonials.length : 0));
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [testimonials]);

//   if (testimonials.length === 0)
//     return (
//       <section className="bg-gray-50 py-16 text-center">
//         <div className="text-center mb-12">
//         <h2 className="text-4xl text-gray-800 font-semibold text-center mb-8">
//           What Our Passengers Say
//         </h2>
//         <div className="w-16 h-1 bg-gray-400 mx-auto mb-6"></div>
//         <p className="text-3xl text-gray-500 text-center mb-8">
//             Real experiences from happy Nabeel Bus travellers
//         </p>
//       </div>
//       </section>
//     );

//   const { name, message, rating, location } = testimonials[current];

// return (
//   <section className="py-10 px-6 md:px-20 mt-5">
//     {/* Section Header */}
//     <div className="text-center mb-12">
//       <h2 className="text-4xl text-gray-800 font-semibold mb-4">
//         What Our Passengers Say
//       </h2>
//       <div className="w-16 h-1 bg-gray-400 mx-auto mb-6"></div>
//       <p className="text-xl text-gray-500">
//         Hear from our happy travellers who’ve experienced smooth, safe, and
//         reliable journeys with Nabeel Bus.
//       </p>
//     </div>

//     {/* Single Sticky Note Auto Slider */}
//     <div className="max-w-6xl mx-auto text-center relative">
//       {testimonials.length > 0 && (
//         <div
//           className="relative p-6 rounded-md shadow-md hover:shadow-xl transition-all duration-300 min-h-[300px] flex flex-col justify-between hover:-translate-y-2 max-w-2xl mx-auto"
//           style={{
//             backgroundColor: ["#FEF3C7", "#E0F2FE", "#DCFCE7", "#FDE68A", "#FBCFE8"][current % 5],
//             transform: `rotate(${(Math.random() * 6 - 3).toFixed(2)}deg)`,
//             backgroundImage: `url('/paper-texture.png')`,
//             backgroundSize: "cover",
//             backgroundBlendMode: "multiply",
//           }}
//         >
//           {/* Metallic Pin */}
//           <div className="pin absolute -top-4 left-1/2 -translate-x-1/2"></div>

//           {/* Torn Edge Effect */}
//           <div className="absolute bottom-0 left-0 w-full h-6 bg-white/30 torn-edge"></div>

//           <div>
//             <FaQuoteLeft className="text-blue-500 text-2xl mb-4" />
//             <p className="text-gray-800 text-sm mb-6 italic leading-relaxed font-handwriting">
//               “{testimonials[current].message}”
//             </p>
//           </div>

//           <div className="mt-auto">
//             <div className="flex justify-center gap-1 text-yellow-500 mb-2 text-lg">
//               {"★".repeat(testimonials[current].rating)}
//               {"☆".repeat(5 - testimonials[current].rating)}
//             </div>
//             <h4 className="font-bold text-gray-800">{testimonials[current].name}</h4>
//             {testimonials[current].location && (
//               <p className="text-xs text-gray-600">{testimonials[current].location}</p>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Dot Navigation */}
//       <div className="flex justify-center mt-6 space-x-2">
//         {testimonials.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => setCurrent(i)}
//             className={`w-3 h-3 rounded-full transition-all ${
//               current === i ? "bg-blue-600 w-6" : "bg-gray-400"
//             }`}
//           ></button>
//         ))}
//       </div>
//     </div>
//   </section>
// );


return (
  <section className=" py-10 px-6 md:px-20 mt-5">
    {/* Section Header */}
    <div className="text-center mb-12">
      <h2 className="text-4xl text-gray-800 font-semibold mb-4">
        What Our Passengers Say
      </h2>
      <div className="w-16 h-1 bg-gray-400 mx-auto mb-6"></div>
      <p className="text-xl text-gray-500">
        Hear from our happy travellers who’ve experienced smooth, safe, and
        reliable journeys with Nabeel Bus.
      </p>
    </div>

    {/* Swiper Slider */}
    <div className="max-w-6xl mx-auto">
      <Swiper
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-10"
      >
        {testimonials.map((t, i) => {
          const rotate = (Math.random() * 6 - 3).toFixed(2);
          const bgColors = ["#FEF3C7", "#E0F2FE", "#DCFCE7", "#FDE68A", "#FBCFE8"];
          const bg = bgColors[i % bgColors.length];

          return (
            <SwiperSlide key={i}>
              <div
                className="relative p-6 rounded-md shadow-md hover:shadow-xl transition-all duration-300 min-h-[300px] flex flex-col justify-between hover:-translate-y-2"
                style={{
                  backgroundColor: bg,
                  transform: `rotate(${rotate}deg)`,
                  backgroundImage: `url('/paper-texture.png')`,
                  backgroundSize: "cover",
                  backgroundBlendMode: "multiply",
                }}
              >
                {/* Metallic Pin */}
                <div className="pin absolute -top-4 left-1/2 -translate-x-1/2"></div>

                {/* Torn Edge Effect */}
                <div className="absolute bottom-0 left-0 w-full h-6 bg-white/30 torn-edge"></div>

                <div>
                  <FaQuoteLeft className="text-blue-500 text-2xl mb-4" />
                  <p className="text-gray-800 text-sm mb-6 italic leading-relaxed font-handwriting">
                    “{t.message}”
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="flex gap-1 text-yellow-500 mb-2 text-lg">
                    {"★".repeat(t.rating)}
                    {"☆".repeat(5 - t.rating)}
                  </div>
                  <h4 className="font-bold text-gray-800">{t.name}</h4>
                  <p className="text-xs text-gray-600">{t.location}</p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  </section>
);

};

export default TestimonialSection;

