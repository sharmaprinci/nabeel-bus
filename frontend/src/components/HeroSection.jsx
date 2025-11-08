
// import React, { useState, useEffect } from "react";
// import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
// import { MdSwapHoriz } from "react-icons/md";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const HeroSection = () => {
//   const [routes, setRoutes] = useState({ origins: [], destinations: [] });
//   const [fromCity, setFromCity] = useState("");
//   const [toCity, setToCity] = useState("");
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const navigate = useNavigate();

//   // Fetch available bus routes from backend
//   useEffect(() => {
//     const fetchRoutes = async () => {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/buses/routes`
//         );
//         setRoutes(res.data);
//       } catch (err) {
//         console.error("Failed to fetch routes:", err);
//       }
//     };
//     fetchRoutes();
//   }, []);

//   const getSuggestions = (input, list) =>
//     list.filter((city) => city.toLowerCase().includes(input.toLowerCase()));

//   // Handle search button click
//   const handleSearch = async () => {
//     if (!fromCity || !toCity || !date) {
//       return alert("Please select From, To, and Date");
//     }

//     try {
//       // Call backend to fetch available buses
//       const res = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/buses/search`,
//         {
//           params: {
//             from: fromCity,
//             to: toCity,
//             date,
//           },
//         }
//       );

//       const buses = res.data; // Array of available buses

//       if (!buses.length) {
//         return alert("No buses available for the selected route and date.");
//       }

//       // Navigate to results page and pass buses + search details
//       navigate("/search-results", {
//         state: { buses, fromCity, toCity, date },
//       });
//     } catch (err) {
//       console.error("Search failed:", err);
//       alert("Failed to search buses. Try again later.");
//     }
//   };

//   return (
//     <section className="relative w-full mt-5 max-w-[80%] mx-auto h-[420px] rounded-[2rem] overflow-visible flex flex-col">
//       <img
//         src="/images/hero.png"
//         alt="nabeel bus"
//         className="absolute inset-0 w-full h-full object-cover rounded-[2rem]"
//       />

//       {/* Heading */}
//       <div className="relative z-10 flex flex-col mt-20 ml-32">
//         <h1 className="text-white text-6xl mb-2 drop-shadow-lg">Welcome to the</h1>
//         <h1 className="mb-5 drop-shadow-lg text-[#99FF00] font-bold text-7xl">
//           Nabeel <span className="text-white">Bus</span>
//         </h1>
//         <p className="text-white text-3xl font-bold drop-shadow-lg italic">
//           Travel Smarter, <span className="text-[#99FF00] italic">Travel Better</span>
//         </p>
//       </div>

//       {/* Search Form */}
//       <div
//         className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 
//         w-[80%] h-auto h-[150px] bg-white shadow-2xl rounded-[2.5rem] flex items-stretch overflow-hidden z-20"
//       >
//         {/* From City */}
//         <div className="flex items-center gap-3 flex-1 px-8 py-6 border-r border-gray-200">
//           <FaMapMarkerAlt className="text-[#6C2BD9] text-xl" />
//           <div className="flex flex-col text-left relative">
//             <label className="text-sm text-gray-500 font-medium">From City</label>
//             <input
//               list="fromCities"
//               value={fromCity}
//               onChange={(e) => setFromCity(e.target.value)}
//               placeholder="From City"
//               className="font-semibold text-gray-700 outline-none border-none"
//             />
//             <datalist id="fromCities">
//               {getSuggestions(fromCity, routes.origins).map((city, idx) => (
//                 <option key={idx} value={city} />
//               ))}
//             </datalist>
//           </div>
//         </div>

//         {/* Swap Icon */}
//         <div
//           className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
//           bg-white border border-gray-200 rounded-full shadow-md p-2 cursor-pointer hover:bg-gray-100 transition mt-2"
//           onClick={() => {
//             setFromCity(toCity);
//             setToCity(fromCity);
//           }}
//         >
//           <MdSwapHoriz className="text-gray-600 text-2xl" />
//         </div>

//         {/* To City */}
//         <div className="flex items-center gap-3 flex-1 px-8 py-6 border-r border-gray-200">
//           <FaMapMarkerAlt className="text-[#6C2BD9] text-xl" />
//           <div className="flex flex-col text-left relative">
//             <label className="text-sm text-gray-500 font-medium">To City</label>
//             <input
//               list="toCities"
//               value={toCity}
//               onChange={(e) => setToCity(e.target.value)}
//               placeholder="To City"
//               className="font-semibold text-gray-700 outline-none border-none"
//             />
//             <datalist id="toCities">
//               {getSuggestions(toCity, routes.destinations).map((city, idx) => (
//                 <option key={idx} value={city} />
//               ))}
//             </datalist>
//           </div>
//         </div>

//         {/* Date */}
//         <div className="flex items-center gap-3 flex-1 px-8 py-6 border-r border-gray-200">
//           <FaCalendarAlt className="text-[#6C2BD9] text-xl" />
//           <div className="flex flex-col text-left">
//             <label className="text-sm text-gray-500 font-medium">Date</label>
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               className="outline-none font-semibold text-gray-700 bg-transparent"
//             />
//           </div>
//         </div>

//         {/* Search Button */}
//         <div className="px-10 justify-center flex items-center">
//           <div
//             className="bg-[#FF4D79] hover:bg-[#ff3166] text-white font-semibold px-6 py-5 text-lg transition-all duration-200 whitespace-nowrap rounded-[1rem] cursor-pointer"
//             onClick={handleSearch}
//           >
//             Search
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;



import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { MdSwapHoriz } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [routes, setRoutes] = useState({ origins: [], destinations: [] });
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const navigate = useNavigate();

        const token = localStorage.getItem("adminToken")
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/buses/routes`, {
headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRoutes(res.data);
      } catch (err) {
        console.error("Failed to fetch routes:", err);
      }
    };
    fetchRoutes();
  }, [token]);

  const getSuggestions = (input, list) =>
    list.filter((city) => city.toLowerCase().includes(input.toLowerCase()));

  const handleSearch = async () => {
    if (!fromCity || !toCity || !date) {
      return alert("Please select From, To, and Date");
    }

    try {
      // const res = await axios.get(
      //   `${import.meta.env.VITE_BACKEND_URL}/api/buses/search`,
      //   {
      //     params: {
      //       from: fromCity,
      //       to: toCity,
      //       date,
      //     }
      //   }, {
      //     headers: { Authorization: `Bearer ${token}` },
      //   }
      // );
      const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/buses/search`,
      {
        params: { from: fromCity, to: toCity, date },
        headers: { Authorization: `Bearer ${token}` },
      }
    );

      const buses = res.data;
      if (!buses.length) {
        return alert("No buses available for the selected route and date.");
      }

      navigate("/search-results", {
        state: { buses, fromCity, toCity, date },
      });
    } catch (err) {
      console.error("Search failed:", err);
      alert("Failed to search buses. Try again later.");
    }
  };

  return (
    <section className="relative w-full mt-5 md:max-w-[90%] mx-auto h-[420px] rounded-[2rem] flex overflow-visible">
      <img
        src="/images/hero.png"
        alt="nabeel bus"
        className="absolute inset-0 w-full h-full object-cover md:rounded-[2rem]"
      />

      {/* Heading */}
      <div className="relative z-10 flex flex-col mt-20 px-6 md:px-16 lg:ml-32">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl mb-2 font-light drop-shadow-lg">
          Welcome to the
        </h1>
        <h1 className="mb-5 drop-shadow-lg text-[#99FF00] font-bold text-5xl md:text-6xl lg:text-7xl leading-tight">
          Nabeel <span className="text-white">Bus</span>
        </h1>
        <p className="text-white text-xl md:text-2xl lg:text-3xl font-semibold drop-shadow-lg italic">
          Travel Smarter,{" "}
          <span className="text-[#99FF00] italic">Travel Better</span>
        </p>
      </div>

      {/* Search Form */}
<div
  className="
    absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2
    w-full max-w-screen-lg
    bg-white backdrop-blur-lg shadow-2xl
    rounded-[2rem]
    flex flex-col md:!flex-row md:!flex-nowrap md:items-center
    overflow-hidden z-20 border border-white/30
  "
>
{/* <div
  className="
    absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2
    w-full max-w-screen-lg
    bg-[#0f172a]/50 backdrop-blur-2xl
    rounded-[2rem] shadow-2xl
    flex flex-col md:!flex-row md:!flex-nowrap md:items-center
    overflow-hidden z-20 border border-white/10
  "
> */}
  {/* From City */}
  <div className="flex flex-1 items-center gap-3 px-6 py-5 border-b md:border-b-0 md:border-r border-gray-200/40 min-w-0">
    <FaMapMarkerAlt className="text-[#6C2BD9] text-xl flex-shrink-0" />
    <div className="flex flex-col w-full relative">
      <label className="text-xs md:text-sm text-gray-600 font-medium">From City</label>
      <input
        list="fromCities"
        value={fromCity}
        onChange={(e) => setFromCity(e.target.value)}
        placeholder="From City"
        className="font-semibold text-gray-400 bg-transparent placeholder-gray-400 outline-none border-none focus:ring-0"
      />
      <datalist id="fromCities">
        {getSuggestions(fromCity, routes.origins).map((city, idx) => (
          <option key={idx} value={city} />
        ))}
      </datalist>
    </div>
  </div>

  {/* Swap Icon */}
  <div
    className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
      bg-white text-gray-700 border border-gray-600 rounded-full shadow-lg p-3 
      cursor-pointer hover:scale-110 transition duration-300 z-30"
    onClick={() => {
      setFromCity(toCity);
      setToCity(fromCity);
    }}
  >
    <MdSwapHoriz className="text-2xl" />
  </div>

  {/* To City */}
  <div className="flex flex-1 items-center gap-3 px-6 py-5 border-b md:border-b-0 md:border-r border-gray-200/40 min-w-0">
    <FaMapMarkerAlt className="text-[#6C2BD9] text-xl flex-shrink-0" />
    <div className="flex flex-col w-full relative">
      <label className="text-xs md:text-sm text-gray-600 font-medium">To City</label>
      <input
        list="toCities"
        value={toCity}
        onChange={(e) => setToCity(e.target.value)}
        placeholder="To City"
        className="font-semibold text-gray-400 bg-transparent placeholder-gray-400 outline-none border-none focus:ring-0"
      />
      <datalist id="toCities">
        {getSuggestions(toCity, routes.destinations).map((city, idx) => (
          <option key={idx} value={city} />
        ))}
      </datalist>
    </div>
  </div>

  {/* Date */}
  <div className="flex flex-1 items-center gap-3 px-6 py-5 border-b md:border-b-0 md:border-r border-gray-200/40 min-w-0">
    <FaCalendarAlt className="text-[#6C2BD9] text-xl flex-shrink-0" />
    <div className="flex flex-col w-full">
      <label className="text-xs md:text-sm text-gray-600 font-medium">Date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="font-semibold text-gray-400 bg-transparent outline-none border-none focus:ring-0 [color-scheme:dark]"
      />
    </div>
  </div>

  {/* Search Button */}
  <div className="flex justify-center md:justify-end items-center px-6 py-5 md:py-0 flex-shrink-0">
    <div
      className="bg-[#FF4D79] hover:bg-[#ff3166] text-white font-semibold px-8 py-4 
      text-base md:text-lg transition-all duration-300 whitespace-nowrap rounded-[1rem] cursor-pointer shadow-lg hover:scale-105 w-full md:w-auto text-center"
      onClick={handleSearch}
    >
      Search
    </div>
  </div>
</div>

    </section>
  );
};

export default HeroSection;


