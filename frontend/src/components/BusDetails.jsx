
// import React, { useState } from "react";

// const BusDetails = () => {
//   const [activeIndex, setActiveIndex] = useState(0);

//   return (
//     <section className="py-6 mx-40 px-6 md:px-16">
//       {/* Section Titles */}
//       <div className="flex flex-wrap items-start gap-4 mb-0 pl-14">
//         <button
//           onClick={() => setActiveIndex(0)}
//           className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors duration-300 ${
//             activeIndex === 0
//               ? "bg-blue-600 text-white"
//               : "bg-white text-gray-800"
//           }`}
//         >
//           Choose Nabeel Bus
//         </button>

//         <button
//           onClick={() => setActiveIndex(1)}
//           className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors duration-300 ${
//             activeIndex === 1
//               ? "bg-blue-600 text-white"
//               : "bg-white text-gray-800"
//           }`}
//         >
//           How To Book
//         </button>

//         <button
//           onClick={() => setActiveIndex(2)}
//           className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors duration-300 ${
//             activeIndex === 2
//               ? "bg-blue-600 text-white"
//               : "bg-white text-gray-800"
//           }`}
//         >
//           On Time Guarantee
//         </button>

//         <button
//           onClick={() => setActiveIndex(3)}
//           className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors duration-300 ${
//             activeIndex === 3
//               ? "bg-blue-600 text-white"
//               : "bg-white text-gray-800"
//           }`}
//         >
//           Lowest-price AC buses
//         </button>

//         <button
//           onClick={() => setActiveIndex(4)}
//           className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors duration-300 ${
//             activeIndex === 4
//               ? "bg-blue-600 text-white"
//               : "bg-white text-gray-800"
//           }`}
//         >
//           Carbon-neutral ride
//         </button>

//         <button
//           onClick={() => setActiveIndex(5)}
//           className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors duration-300 ${
//             activeIndex === 5
//               ? "bg-blue-600 text-white"
//               : "bg-white text-gray-800"
//           }`}
//         >
//           Book Bus Tickets Online
//         </button>
//       </div>

//       {/* Section Content */}
//       <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl ">

//         {activeIndex === 0 && (
//           <div>
//             <p className="mb-4">
//               Nabeel Bus is a fast-growing online bus booking service connecting cities across North India. Our mission is to make travel simple, reliable, and affordable for everyone.</p>

//             <p className="mb-4">With just a few clicks, you can search, compare, and book bus tickets directly through our website or mobile app — no long queues, no middlemen.</p>
//  <p className="mb-4">
// We partner with trusted bus operators to ensure safe and comfortable journeys for passengers every day. Whether you’re traveling for work or leisure, Nabeel Bus is here to make your trip smooth from start to finish.</p>

// <p>Stay connected with real-time bus updates, secure payments, and 24/7 customer support — because your comfort and safety are always our priority.
//             </p>
//           </div>
//         )}

//         {activeIndex === 1 && (
//           <div>
//             <p className="mb-4">Nabeel Bus is the best bus booking website and App to book bus tickets. Also, any transaction you make on the Nabeel Bus website or App is easy, safe & secure.</p>
//          <p className="mb-4">You can book bus tickets online in a few simple steps: </p>
//           <ul className="list-disc ml-6">
//              <li className="">Enter the trip details in the "From City" and "To City" tab, respectively</li>
//              <li>Select the date of your choice from the calendar and click on the "Search" button</li>
//              <li>Select any bus of your choice from the list of buses displayed along their timings and prices, and then click on "select seat."</li>
//              <li>Click "Book Now" after choosing your seat, boarding point, and drop-off location.</li>
//              <li>Enter all the information needed, including passenger details, choose the best coupon code and click "Pay and Book Now."</li>
//              <li className="mb-4">Complete the payment process by choosing one of the available payment methods.</li>
//           </ul>
//             <p className="mb-4">After completing the payment procedure, you will receive an E-ticket through SMS, Whatsapp message, and on the email address provided during the booking process.</p>

//              <p>Also, every booking made from Nabeel Bus has a complimentary Travel Insurance providing Personal Accidental cover, Emergency Medical & Baggage Loss Cover up to 7.5 Lacs. View Less",</p>
//           </div>
//         )}

//         {activeIndex === 2 && (
//           <div>
//             <p className="mb-4">When it comes to bus travel, timing is everything. That's why Nabeel Bus: the leading bus ticket booking platform introduced an unbeatable On-Time Guarantee. Missed AC buses? Delayed departure? Not with us! Here's how we ensure your travel plans stay on track – or how you benefit if they don't:</p>
//          <ol className="list-decimal mb-4">
//             <li><strong>50% Refund for Delays: </strong>Delays exceeding 45 minutes in your pickup or drop-off service?Nabeel Bus makes it right with a 50% refund of your bus ticket price. Because your time is money.</li>

//             <li><strong>Easy Claim Process:</strong> Simply visit the 'My Booking' page, click on the 'Trip Details' section, and raise a claim within 12 hours after completing your trip. We keep it straightforward so you can get back to what matters most.</li>

//             <li><strong>Instant Verification & Settlement:</strong> Once you submit a claim, our dedicated customer support team swings into action. They'll touch base for any further details needed and, upon verification, process your refund instantly.</li> 

//           </ol>
//         <p className="mb-4">Nabeel Bus's On-Time Guarantee is more than a promise; it's a testament to our dedication to punctuality and customer satisfaction. Delays can disrupt plans and create stress, but with our guarantee, you have one less thing to worry about. If your bus is delayed over 45 minutes, you're not just compensated; you're prioritized, assured, and valued.</p>



//         <p className="mb-4"><strong>Choose Nabeel Bus for On-Time Travel:</strong> Where delays pay off, and your schedule is our priority. Let's make every journey together timely, or let's make it right.</p>

//           </div>
//         )}

//         {activeIndex === 3 && (
//           <div>
//             <p className="mb-4">Travelling with Nabeel Bus just got even more exciting! Dive into our Lowest Price Guarantee and discover how you can make the most out of every journey, ensuring you always get the best bus booking deal possible. Here's everything you need to know about this incredible offer:</p>
//       <ol className="list-decimal">
//       <li>
//         <strong>10x Money Back Promise:</strong><p> If you find a cheaper bus ticket for the same route and itinerary on any other India-based Bus Booking Platform within 24 hours of booking with us, we'll not just match it – we'll refund you ten times the price difference!</p>
//         </li>

//         <li>
//         <strong>All Platforms Covered: </strong><p> Whether you prefer the convenience of our mobile app, the flexibility of our mobile site, or the full experience on our desktop site, this guarantee applies across all your bus ticket bookings made with Nabeel Bus. </p>
//         </li>

//         <li>
//         <strong>Effortless Claim Process:</strong><p>  Found a lower-priced bus ticket? Simply let us know. Our straightforward claim process is designed to be quick and hassle-free, ensuring you get your refund without any headaches.</p>
//         </li>

//         <li>
//         <strong>Fast Refund to Your Bank:</strong><p>  We understand the value of both your time and money. That's why we guarantee to deposit your 10x refund directly into your bank details within 7 working days after your journey.</p>
//         </li>

//         <li className="mb-4">
//         <strong>A Promise of Transparency:</strong><p>  At Nabeel Bus, we believe in complete transparency. There are no hidden catches, no complicated terms – just our straightforward promise to ensure you get the lowest price bus tickets online possible.</p>
//         </li>
// </ol>


//         <p className="mb-4">Nabeel Bus's Lowest Price Guarantee isn't just a policy; it's our pledge to you that your travel will always be accompanied by the best possible value. Forget the hassle of price comparison and the fear of overpaying. With Nabeel Bus, you're guaranteed to have the lowest price bus tickets in the market, making your travel experience worry-free, affordable, and simply better.</p>

//         <p className="mb-4">Choose Nabeel Bus– where every journey begins with savings!</p>
// `,
//           </div>
//         )}

//         {activeIndex === 4 && (
//           <div>
//             <p className="mb-4">In a world where sustainability is no longer a choice but a necessity, Nabeel Bus is leading the way in the intercity bus travel industry with a groundbreaking commitment to carbon neutral world. Here’s how Nabeel Bus is transforming travel into a force for good, one ride at a time:</p>
//         <ul className="">
//            <li className="mb-8">
//                <strong>Pioneering Sustainability:</strong><p> As a leader in eco-conscious bus booking platform, Nabeel Bus offers journeys that don't just take you to your destination but also protect the environment.</p></li>

//               <li className="mb-8">
//                <strong>Making a Real Impact: </strong><p>With the support of our travelers, we've neutralized -675,468 Kg CO2e, akin to growing 11,145 seedlings over ten years. Every ride with us is a step towards combating climate change.</p></li>

//               <li className="mb-8">
//                <strong>Easy to Support Carbon Neutrality:</strong><p>In partnership with Climes, we offer a simple option at checkout for you to contribute to verified carbon offset projects, neutralizing the emissions from your journey effortlessly.</p></li>
//                </ul>

//      <p className="mb-4">Opting for Nabeel Bus isn't just about choosing a bus service; it's about being part of a larger movement towards sustainability. Our transparent approach and partnership with Climes allow you to easily neutralize your travel emissions, making every journey a positive act for the planet. </p>


//          <p className="mb-4">Travel smart, travel green. Choose Nabeel Bus for your next journey and be a part of the change towards an eco-friendly environment. Together, let's drive towards a cleaner, greener planet one ride at a time.</p>
//           </div>
//         )}

//         {activeIndex === 5 && (
//           <div>
//             <p className="mb-4">Online bus ticket booking is easy and secure with Nabeel Bus. We provide one stop solution to a convenient and affordable online bus booking service for all. Now travel to the places of your choice, at the best prices, in your preferred bus type. Get the most satisfactory experience en route and avail the world-class amenities available at our premium lounges in 7 locations.</p>

//         <p className="mb-4">With the advent of technology, online bus bookings have gained huge importance, and are of high convenience, which is indispensable in the modern world.</p>

//         <p className="mb-4">This online convenience has led to transforming the ways in which we travel with online bus ticket booking.</p>

//         <p className="mb-4">Nabeel Bus has revolutionized the experience of bus booking and seamless travel and led to effective ways to secure your choice of seat on the bus at guaranteed lowest rates.</p>

//         <h1 className="text-4xl font-bold text-black mb-4">Online Bus Booking At Nabeel Bus</h1>

//         <p className="mb-4">Nabeel Bus assists with a user-friendly interface, allowing users to browse various bus routes, choose their preferred seats, and book their tickets just a few clicks away.</p>

//         <p className="mb-4">This change in the bus booking process has brought transparency in travel and accessibility to the forefront of travel.</p>

//         <p className="mb-4">Nabeel Bus is a prominent player in the online bus booking sphere, which is setting it apart to offer a range of features to cater for diverse needs. Book your online bus tickets with Nabeel Bus for your next luxurious, comfortable, and affordable bus journey. </p>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default BusDetails;


import React, { useState } from "react";

const BusDetails = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-6 px-4 sm:px-6 md:px-10 lg:mx-40 lg:px-6">
      
      {/* Tab Buttons */}
      <div
        className="
          flex items-start gap-3 mb-4
          overflow-x-auto no-scrollbar
          whitespace-nowrap
          pl-2 sm:pl-4 lg:pl-14
        "
      >
        {[
          "Choose Nabeel Bus",
          "How To Book",
          "On Time Guarantee",
          "Lowest-price AC buses",
          "Carbon-neutral ride",
          "Book Bus Tickets Online",
        ].map((label, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors duration-300 flex-shrink-0 ${
              activeIndex === index
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content Box */}
      <div
        className="
          max-w-5xl mx-auto bg-white p-5 sm:p-8 rounded-xl
          text-sm sm:text-base
        "
      >
        {activeIndex === 0 && (
          <div>
            <p className="mb-4">
              Nabeel Bus is a fast-growing online bus booking service connecting cities across North India. Our mission is to make travel simple, reliable, and affordable for everyone.
            </p>
            <p className="mb-4">
              With just a few clicks, you can search, compare, and book bus tickets directly through our website or mobile app — no long queues, no middlemen.
            </p>
            <p className="mb-4">
              We partner with trusted bus operators to ensure safe and comfortable journeys for passengers every day. Whether you’re traveling for work or leisure, Nabeel Bus is here to make your trip smooth from start to finish.
            </p>
            <p>
              Stay connected with real-time bus updates, secure payments, and 24/7 customer support — because your comfort and safety are always our priority.
            </p>
          </div>
        )}

        {activeIndex === 1 && (
          <div>
            <p className="mb-4">
              Nabeel Bus is the best bus booking website and App to book bus tickets. Also, any transaction you make on the Nabeel Bus website or App is easy, safe & secure.
            </p>

            <p className="mb-4">You can book bus tickets online in a few simple steps:</p>

            <ul className="list-disc ml-5">
              <li>Enter trip details in "From City" and "To City"</li>
              <li>Select date → Click "Search"</li>
              <li>Select bus → Click "Select Seat"</li>
              <li>Choose seat, boarding & drop-off</li>
              <li>Enter details → Apply coupon → Pay & Book</li>
              <li className="mb-4">Complete payment using available methods</li>
            </ul>

            <p className="mb-4">
              After payment, you will receive an E-ticket via SMS, WhatsApp and Email.
            </p>

            <p>
              Every booking includes complimentary Travel Insurance up to 7.5 Lacs.
            </p>
          </div>
        )}

        {activeIndex === 2 && (
          <div>
            <p className="mb-4">
              When it comes to bus travel, timing is everything. That's why Nabeel Bus introduced an unbeatable On-Time Guarantee.
            </p>

            <ol className="list-decimal ml-5 mb-4">
              <li>
                <strong>50% Refund for Delays:</strong> If your bus is delayed by 45+ minutes, you get 50% refund.
              </li>
              <li>
                <strong>Easy Claim Process:</strong> Raise claim under "My Booking" within 12 hours.
              </li>
              <li>
                <strong>Instant Verification:</strong> Support team processes claims quickly.
              </li>
            </ol>

            <p className="mb-4">
              Delays can disrupt plans, but with our guarantee, you are compensated fairly and quickly.
            </p>

            <p>
              <strong>Choose Nabeel Bus for On-Time Travel:</strong> Your schedule is our priority.
            </p>
          </div>
        )}

        {activeIndex === 3 && (
          <div>
            <p className="mb-4">
              Travelling with Nabeel Bus just got even more exciting! Here’s our Lowest Price Guarantee:
            </p>

            <ol className="list-decimal ml-5">
              <li>
                <strong>10x Money Back:</strong> If you find a cheaper ticket on an Indian platform within 24 hours.
              </li>
              <li>
                <strong>All Platforms Covered:</strong> App, mobile site & desktop.
              </li>
              <li>
                <strong>Effortless Claims:</strong> Just report the lower price.
              </li>
              <li>
                <strong>Fast Refund:</strong> Refund processed within 7 working days.
              </li>
              <li>
                <strong>Transparent Policy:</strong> No hidden terms.
              </li>
            </ol>

            <p className="mb-4 mt-4">
              Forget price comparison — we guarantee lowest price bus tickets.
            </p>

            <p>Choose Nabeel Bus – where every journey begins with savings!</p>
          </div>
        )}

        {activeIndex === 4 && (
          <div>
            <p className="mb-4">
              Nabeel Bus is committed to sustainability with carbon-neutral travel.
            </p>

            <ul className="ml-5">
              <li className="mb-4">
                <strong>Pioneering Sustainability:</strong> Eco-conscious platform.
              </li>
              <li className="mb-4">
                <strong>Real Impact:</strong> -675,468 Kg CO2e neutralized.
              </li>
              <li className="mb-4">
                <strong>Support Offsetting:</strong> Option to offset carbon during checkout.
              </li>
            </ul>

            <p className="mb-4">
              Travel with us knowing each journey helps the planet.
            </p>

            <p>
              Travel green. Choose Nabeel Bus and be part of positive change.
            </p>
          </div>
        )}

        {activeIndex === 5 && (
          <div>
            <p className="mb-4">
              Online bus ticket booking is easy and secure with Nabeel Bus. Enjoy comfort, convenience, and lowest fares.
            </p>

            <p className="mb-4">
              Online bookings remove queues and make travel more accessible.
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              Online Bus Booking At Nabeel Bus
            </h1>

            <p className="mb-4">
              Browse routes, choose seats, and book instantly.
            </p>

            <p className="mb-4">
              Nabeel Bus ensures transparent pricing and smooth travel experience.
            </p>

            <p className="mb-4">
              Book with us for a luxurious, affordable bus journey.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BusDetails;
