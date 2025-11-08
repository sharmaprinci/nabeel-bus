import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Offers = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
   const [openIndex, setOpenIndex] = useState(null);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
 
   const faqs = [
    {
      question: "Who should opt for Nabeel Bus Plus buses? ",
      answer:
        "Nabeel Bus Plus is tailored for those seeking a premium, hassle-free travel experience with the assurance of on-time arrival or a 50% refund for travel delays.",
    },
    {
      question: "What makes Nabeel Bus Plus different from Nabeel Bus Lite? ",
      answer:
        "Nabeel Bus Plus offers luxury buses with premium amenities, while Nabeel Bus Lite focuses on more economical, budget-friendly travel options.",
    },
    {
      question: "Can I book Nabeel Bus Plus for any route? ",
      answer:
        "Nabeel Bus Plus is available on select routes. Please check the Plus+ tag while booking on our app or website to find available Plus services for your needs.",
    },
  ];

  return (
    <div className="relative flex flex-col items-center mb-10">
      {/* Section Heading */}
      <h2 className="text-4xl text-gray-800 font-semibold text-center mb-4">
        Nabeel Bus Offering
      </h2>
      <div className="w-16 h-1 bg-gray-400 mx-auto mb-6"></div>
      <p className="text-2xl text-gray-500 text-center mb-10">
        Our range of services
      </p>

      {/* === Cards Row === */}
      <div className="flex justify-center items-stretch gap-10 w-full max-w-7xl px-10">
        {/* Left Card */}
        <div
          className="bg-blue-600 text-white rounded-xl shadow-lg cursor-pointer flex flex-col justify-between transition-all hover:shadow-2xl w-1/2 h-[300px] relative overflow-hidden"
          onClick={openDrawer}
        >
          <div className="flex justify-between items-center px-6 pt-6 h-full">
            {/* Text Section */}
            <div className="max-w-[50%] z-10">
              <p className="text-md font-bold">Nabeel Bus Plus+</p>
              <h1 className="text-3xl text-white leading-snug">
                Top-quality buses offered by Nabeel Bus
              </h1>
            </div>

            {/* Image Section */}
            <img
              src="/images/men.png"
              alt="men"
              className="absolute bottom-0 w-1/2 right-0"
            />
          </div>
        </div>

        {/* Right Card */}
        <div
          className="bg-green-500 text-white rounded-xl shadow-lg cursor-pointer relative overflow-hidden flex flex-col justify-between transition-all hover:shadow-2xl w-1/2 h-[300px]"
          onClick={openDrawer}
        >
          {/* Text Section */}
          <div className="flex justify-between items-start px-6 pt-6 h-full relative z-10">
            <div className="flex flex-col flex-1 justify-center">
              <h1 className="text-3xl text-white leading-snug mb-4">
                Features of Nabeel Bus Plus
              </h1>
              <ul className="list-disc pl-5 space-y-3">
                <li className="flex items-center text-lg">
                  <img
                    src="/images/luxury4x.png"
                    alt=""
                    className="w-8 h-8 mr-4"
                  />
                  Luxury Redefined
                </li>
                <li className="flex items-center text-lg">
                  <img
                    src="/images/logo.png"
                    alt=""
                    className="w-8 h-8 mr-4"
                  />
                  Nabeel Bus-Operated Rides
                </li>
                <li className="flex items-center text-lg">
                  <img
                    src="/images/patient4x.png"
                    alt=""
                    className="w-8 h-8 mr-4"
                  />
                  Expert Crew Service
                </li>
              </ul>
            </div>
          </div>

          {/* Image Section */}
          <img
            src="/images/valuebuschar.png"
            alt="women"
            className="absolute bottom-0 top-10 right-0 w-1/2 h-auto object-contain"
          />
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-[40%] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-20">
          <h2 className="text-xl font-bold text-gray-800">About Plus Buses</h2>
          <button
            className="text-gray-500 hover:text-gray-800 text-2xl"
            onClick={closeDrawer}
          >
            ✕
          </button>
        </div>

        {/* Hero Card */}
        <div
          className="bg-blue-600 text-white shadow-lg flex flex-col justify-between h-[250px] relative overflow-hidden"
          onClick={openDrawer}
        >
          <div className="flex justify-between items-center px-6 pt-6 h-full">
            {/* Text Section */}
            <div className="max-w-[50%] z-10">
              <p className="text-md font-bold">Nabeel Bus Plus+</p>
              <h1 className="text-3xl text-white leading-snug">
                Top-quality buses offered by Nabeel Bus
              </h1>
            </div>

            {/* Image Section */}
            <img
              src="/images/men.png"
              alt="men"
              className="absolute bottom-0 w-1/2 right-0 top-5"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-blue-50 flex flex-col gap-3 p-6 rounded-t-2xl">
          <h1 className="text-lg font-semibold text-gray-800">
            Features of Nabeel Bus
          </h1>

          {[
            {
              icon: "/images/luxury4x.png",
              title: "Luxury Redefined",
              desc: "Travel First class with our Premium Luxury Buses designed for your utmost convenience.",
            },
            {
              icon: "/images/logo.png",
              title: "Nabeel Bus-Operated Rides",
              desc: "Experience safe and timely rides operated directly by Nabeel Bus with trained staff.",
            },
            {
              icon: "/images/patient4x.png",
              title: "Expert Crew Service",
              desc: "Our professional crew ensures your journey is comfortable, reliable, and well-managed.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl flex items-center gap-4 w-full"
            >
              <div className="py-4 pl-4 flex items-center justify-center">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-16 h-16 object-contain"
                />
              </div>

              <div className="flex flex-col pr-4">
                <h3 className="text-md text-gray-800 mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-snug">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white flex flex-col gap-3 p-6 rounded-t-2xl">
          <h1 className="text-lg font-semibold text-gray-800">
            Frequently Asked Question
          </h1>

          <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className=" rounded-xl"
          >
            {/* Question */}
            <button
              className="w-full flex justify-between items-center text-xs text-gray-700 px-6 py-1 text-left"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Answer */}
            {openIndex === index && (
              <div className="px-6 pb-4 text-xs text-gray-700 bg-gray-100 rounded-xl">{faq.answer}</div>
            )}
          </div>
        ))}
        </div>

      </div>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={closeDrawer}
        ></div>
      )}
    </div>
  );
};

export default Offers;
