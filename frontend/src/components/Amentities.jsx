import React, { useRef, useEffect } from "react";
import {
  DevicePhoneMobileIcon,
  WifiIcon,
  CubeTransparentIcon,
  BeakerIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

const amenities = [
  { name: "AC", icon: BoltIcon },
  { name: "Charging Point", icon: DevicePhoneMobileIcon },
  { name: "WiFi", icon: WifiIcon },
  { name: "Water Bottle", icon: BeakerIcon },
  { name: "Sleeper Seats", icon: CubeTransparentIcon },
];

const Amenities = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Duplicate items for seamless scrolling
    const children = Array.from(el.children);
    children.forEach((child) => {
      const clone = child.cloneNode(true);
      el.appendChild(clone);
    });

    let scrollSpeed = 0.5; // pixels per frame
    let animation;

    const step = () => {
      el.scrollLeft += scrollSpeed;
      if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
      animation = requestAnimationFrame(step);
    };

    animation = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animation);
  }, []);

  return (
    <div className="my-10 relative">
      <div className="text-center mb-12">
        <h2 className="text-4xl text-gray-800 font-semibold mb-2">
          Amenities We Provide
        </h2>
        <div className="w-16 h-1 bg-gray-400 mx-auto mb-4"></div>
        <p className="text-3xl text-gray-500 text-center mb-8">Comfort and convenience on every ride</p>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-10 w-[70%] items-center justify-center mx-auto overflow-x-hidden whitespace-nowrap py-4"
      >
        {amenities.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex flex-col items-center justify-center min-w-[150px] p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              <Icon className="w-12 h-12 text-blue-600 mb-2" />
              <span className="text-sm text-center">{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Amenities;
