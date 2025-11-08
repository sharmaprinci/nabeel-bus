import React, { useEffect, useState } from "react";
import CalendarSVG from "/images/freeCancel1.png";
import TimeSVG from "/images/lowestPrice1.png";
import DiscountSVG from "/images/onTime.webp";

const OfferSection = () => {
  const [activeOffer, setActiveOffer] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTerms, setActiveTerms] = useState(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const commonModalContent = {
    title: "Nabeel Bus Guarantee",
    desc: "Enjoy last minute booking cancellations, on-time guarantees, and lowest price assurance with Nabeel Bus. We ensure a smooth and reliable travel experience for all our customers.",
    img: CalendarSVG, // default image for modal
  };

  const offers = [
    {
      id: 1,
      title: "Last-Minute Free Cancellations",
      desc: "Enjoy last minute booking cancellations with zero fees.",
      img: CalendarSVG,
    },
    {
      id: 2,
      title: "On-Time Guarantee",
      desc: "Receive 50% refund for any travel delays exceeding 45 minutes.",
      img: DiscountSVG,
    },
    {
      id: 3,
      title: "Lowest Price Guarantee",
      desc: "Get 10x money-back if you find a lower price ticket than Valuebus.",
      img: TimeSVG,
    },
  ];

  const arrowIcon =
    "images/arrowZingbusGuaranteeMweb.svg";

  useEffect(() => {
    if (activeOffer) {
      setIsDrawerOpen(true);
    }
  }, [activeOffer]);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setActiveOffer(null), 300);
  };

  // Open drawer with smooth animation
  const openTerms = (termsType) => {
    setActiveTerms(termsType); // set which terms content
  };

  // Start animation when drawer is mounted
  useEffect(() => {
    if (activeTerms) {
      const timer = setTimeout(() => setIsTermsOpen(true), 50); // slight delay triggers CSS transition
      return () => clearTimeout(timer);
    } else {
      setIsTermsOpen(false); // ensure closed when unmounted
    }
  }, [activeTerms]);

  // Close drawer smoothly
  const closeTerms = () => {
    setIsTermsOpen(false);
    setTimeout(() => setActiveTerms(null), 300); // wait for animation
  };


  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 mt-16">
      <h2 className="text-4xl text-gray-800 font-semibold text-center mb-8">
        Nabeel Bus Guarantee
      </h2>
      <div className="w-16 h-1 bg-gray-400 mx-auto mb-6"></div>
      <p className="text-3xl text-gray-500 text-center mb-8">
        Curated exclusively for you
      </p>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-10">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="relative text-white rounded-3xl shadow-xl cursor-pointer overflow-hidden h-80 w-auto flex flex-col justify-start"
            onClick={() => setActiveOffer(commonModalContent)}
            style={{
              backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0)), url(${offer.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Text */}
            <div className="relative p-6">
              <h3 className="text-3xl font-bold">{offer.title}</h3>
              <p className="text-sm opacity-90 mt-2">{offer.desc}</p>
            </div>

            {/* Arrow Icon */}
            <img
              src={arrowIcon}
              alt="arrow"
              className="absolute bottom-6 left-6 w-12 h-12"
            />
          </div>
        ))}
      </div>

      {/* Right-Side Sliding Modal */}
      {activeOffer && (
        <>
          {/* Background overlay */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 ${
              isDrawerOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeDrawer}
          ></div>

          {/* Sliding drawer */}
          <div
            className={`fixed top-0 right-0 h-full w-[70%] md:w-[50%] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
              isDrawerOpen ? "translate-x-0" : "translate-x-full"
            } overflow-y-auto`}
          >
            <div className="p-6 relative flex flex-col">
              {/* Close button */}
              <button
                onClick={closeDrawer}
                className="absolute top-6 left-6 text-gray-500 hover:text-gray-800"
              >
                ✖
                <span className="text-2xl ml-5 text-gray-700 font-semibold cursor-text">
                  Nabeel Bus
                </span>
              </button>

              {/* Guarantee Details Section */}
              <div className="mt-20 space-y-6">
                {/* Section example: Lowest Price Guarantee */}
                <div className="flex bg-red-100 overflow-hidden">
                  <div className="w-1/3 bg-red-800 flex flex-col items-center text-center relative p-4">
                    <img
                      src="https://d1flzashw70bti.cloudfront.net/original/images/slider/guarantee.svg"
                      alt="lowest price guarantee"
                      className="w-28 h-28 object-cover mb-4 mt-5"
                    />
                    <h1 className="text-white text-2xl font-semibold mb-2">
                      Lowest Price Guarantee
                    </h1>
                    <p className="text-white text-md mb-5">
                      Get 10x money-back if you find a lower price ticket
                    </p>
                    <button
                      onClick={() => openTerms("lowestPrice")} // 🔹 open terms sidebar
                      className="flex items-center space-x-2 bg-white border rounded-full px-4 py-1 transition-colors"
                    >
                      <div className="text-left">
                        <div className="text-blue-600 text-md font-medium">
                          View Terms & Conditions
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-center space-y-6 my-5">
                    {/* Row 1 */}
                    <div className="flex justify-between items-center">
                      <div className="w-3/4">
                        <h1 className="text-md font-bold text-gray-800 mb-2">
                          When you find a lower-price ticket
                        </h1>
                        <p className="text-gray-500 text-md leading-tight">
                          You are now eligible if your details match the same
                          Date of departure, To & From city, etc
                        </p>
                      </div>
                      <div className="flex justify-center items-center w-1/4">
                        <img
                          src="/images/low-price.svg"
                          alt="low price"
                          className="w-12 h-12"
                        />
                      </div>
                    </div>
                    {/* Row 2 */}
                    <div className="flex justify-between items-center">
                      <div className="w-3/4">
                        <h1 className="text-md font-bold text-gray-800 mb-2">
                          Raise a claim request
                        </h1>
                        <p className="text-gray-500 text-md leading-tight">
                          Submit the below documents via chat support within 24
                          hours of booking.
                        </p>
                        <p className="text-gray-500 text-md leading-tight">
                          * Screenshots of a lower-price bus ticket payment page
                          with a timestamp.
                        </p>
                        <p className="text-gray-500 text-md leading-tight">
                          * Booking PNR with the price
                        </p>
                      </div>
                      <div className="flex justify-center items-center w-1/4">
                        <img
                          src="/images/claim.svg"
                          alt="claim"
                          className="w-12 h-12"
                        />
                      </div>
                    </div>
                    {/* Row 3 */}
                    <div className="flex justify-between items-center">
                      <div className="w-3/4">
                        <h1 className="text-md font-bold text-gray-800 mb-2">
                          The claim is Verified &amp; settled
                        </h1>
                        <p className="text-gray-500 text-md leading-tight">
                          We'll confirm the details and the payment will be
                          processed within 7 working days.
                        </p>
                      </div>
                      <div className="flex justify-center items-center w-1/4">
                        <img
                          src="/images/check.svg"
                          alt="verified"
                          className="w-12 h-12"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section example: On-Time Guarantee */}
                <div className="flex bg-yellow-100 overflow-hidden">
                  <div className="p-4 flex-1 flex flex-col justify-center space-y-6 my-5">
                    {/* Row 1 */}
                    <div className="flex justify-between items-center">
                      <div className="w-3/4">
                        <h1 className="text-md font-bold text-gray-800 mb-2">
                          When your bus is delayed
                        </h1>
                        <p className="text-gray-500 text-md leading-tight">
                          Nabeel Bus covers delays exceeding 45 minutes in the
                          pickup and drop-off services
                        </p>
                      </div>
                      <div className="flex justify-center items-center w-1/4">
                        <img
                          src="/images/section2IconDwebGuaranteeDetails4.svg"
                          alt="low price"
                          className="w-18 h-18"
                        />
                      </div>
                    </div>
                    {/* Row 2 */}
                    <div className="flex justify-between items-center">
                      <div className="w-3/4">
                        <h1 className="text-md font-bold text-gray-800 mb-2">
                          Raise a claim request
                        </h1>
                        <p className="text-gray-500 text-md leading-tight">
                          To submit a claim, go to the 'My Booking' page and
                          select the 'Trip Details' section within 12 hours of
                          completing your trip
                        </p>
                      </div>
                      <div className="flex justify-center items-center w-1/4">
                        <img
                          src="/images/section2IconDwebGuaranteeDetails5.svg"
                          alt="claim"
                          className="w-18 h-18"
                        />
                      </div>
                    </div>
                    {/* Row 3 */}
                    <div className="flex justify-between items-center">
                      <div className="w-3/4">
                        <h1 className="text-md font-bold text-gray-800 mb-2">
                          The claim is Verified &amp; settled
                        </h1>
                        <p className="text-gray-500 text-md leading-tight">
                          Nabeel Bus customer support team will contact you for
                          further details, and on verification, the refund will
                          be processed instantly
                        </p>
                      </div>
                      <div className="flex justify-center items-center w-1/4">
                        <img
                          src="/images/section2IconDwebGuaranteeDetails6.svg"
                          alt="verified"
                          className="w-18 h-18"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-1/3 bg-yellow-500 flex flex-col items-center text-center relative p-4">
                    <img
                      src="/images/secondGuaranteeDetailsIconDweb.svg"
                      alt="lowest price guarantee"
                      className="w-32 h-32 mb-4"
                    />
                    <h1 className="text-white text-2xl font-semibold mb-2">
                      On-Time Guarantee
                    </h1>
                    <p className="text-white text-md mb-5">
                      Guarantee a 50% refund for travel delays exceeding 45
                      minutes
                    </p>
                    <button
                      onClick={() => openTerms("onTime")} // On time
                      className="flex items-center space-x-2 bg-white border rounded-full px-4 py-1 transition-colors"
                    >
                      <div className="text-left">
                        <div className="text-blue-600 text-md font-medium">
                          View Terms & Conditions
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Section example: Last-Minute Free Cancellation */}
                <div className="flex bg-blue-100 overflow-hidden">
                  <div className="w-1/3 bg-blue-500 flex flex-col items-center text-center relative p-4">
                    <img
                      src="https://d1flzashw70bti.cloudfront.net/original/images/thirdGuaranteeDetailsIconDweb.svg"
                      alt="lowest price guarantee"
                      className="w-28 h-28 object-cover mb-4"
                    />
                    <h1 className="text-white text-2xl font-semibold mb-2">
                      Last-Minute Free Cancellation
                    </h1>
                    <p className="text-white text-md mb-5">
                      Enjoy last-minute booking cancellation
                    </p>
                    <button
                      onClick={() => openTerms("freeCancel")} // free cancel
                      className="flex items-center space-x-2 bg-white border rounded-full px-4 py-1 transition-colors"
                    >
                      <div className="text-left">
                        <div className="text-blue-600 text-md font-medium">
                          View Terms & Conditions
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-center space-y-6 my-5">
                    {/* Row 1 */}
                    <div className="flex justify-between items-center">
                      <div className="w-3/4">
                        <h1 className="text-md font-bold text-gray-800 mb-2">
                          When you're making a booking
                        </h1>
                        <p className="text-gray-500 text-md leading-tight">
                          Use coupon code FREECANCEL for last-minute FREE
                          cancellation during booking or at checkout
                        </p>
                      </div>
                      <div className="flex justify-center items-center w-1/4">
                        <img
                          src="/images/dWebFreecancelUsingPhn.svg"
                          alt="phone"
                          className="w-18 h-18"
                        />
                      </div>
                    </div>
                    {/* Row 2 */}
                    <div className="flex justify-between items-center">
                      <div className="w-3/4">
                        <h1 className="text-md font-bold text-gray-800 mb-2">
                          Unlimited usage available
                        </h1>
                        <p className="text-gray-500 text-md leading-tight">
                          The "FREECANCEL" coupon allows unlimited booking
                          cancellations on bookings
                        </p>
                      </div>
                      <div className="flex justify-center items-center w-1/4">
                        <img
                          src="/images/dWebFreeCancelCard.svg"
                          alt="claim"
                          className="w-18 h-18"
                        />
                      </div>
                    </div>
                    {/* Row 3 */}
                    <div className="flex justify-between items-center">
                      <div className="w-3/4">
                        <h1 className="text-md font-bold text-gray-800 mb-2">
                          Instant Refunds provided
                        </h1>
                        <p className="text-gray-500 text-md leading-tight">
                          Eligible bookings are entitled to instant refunds to
                          the source account upon last-minute cancellation
                        </p>
                      </div>
                      <div className="flex justify-center items-center w-1/4">
                        <img
                          src="/images/section2IconDwebGuaranteeDetails6.svg"
                          alt="verified"
                          className="w-18 h-18"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {activeTerms && (
        <>
          <div
      className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
        isTermsOpen ? "bg-opacity-30" : "bg-opacity-0"
      }`}
      onClick={closeTerms}
    ></div>
          <div
      className={`fixed top-0 right-0 h-full w-[70%] md:w-[50%] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isTermsOpen ? "translate-x-0" : "translate-x-full"
      } overflow-y-auto`}
    >
      <div className="flex justify-between items-center px-4 py-3 mb-5">
        <button
          onClick={closeTerms}
          className="absolute top-6 right-6 text-2xl text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

            </div>

            <div className="py-6 px-16 text-sm text-gray-700 space-y-3">
              {activeTerms === "lowestPrice" && (
                <>
                  {/* Terms & Conditions */}
                  <div className="flex mb-6">
                    <div className="w-1/4">
                      <h1 className="text-2xl font-semibold text-gray-800">
                        Terms & Conditions
                      </h1>
                    </div>
                    <div className="flex-1">
                      <ol className="list-decimal pl-5 text-[15px] font-semibold text-gray-600">
                        <li>
                          The offer is only applicable to customers who made bus
                          bookings from the Nabeel Bus desktop site, mobile site,
                          and app.
                        </li>
                        <li>The offer is only valid for valuebus customers.</li>
                        <li>
                          The price comparison between our platform's booked
                          itinerary and OTA's Payment Page of a similar
                          itinerary should exclude discounts.
                        </li>
                        <li>
                          Claim payment will be made to the customer's Bank
                          account within 7 working days after the bus journey.
                        </li>
                        <li>
                          Customers must submit screenshots of the lower-priced
                          bus ticket's payment page and their booking voucher to
                          our Support within 24 hours of booking. We will refund
                          10 times the price difference, up to INR 1000.
                        </li>
                        <li>
                          Certain conditions apply for the itinerary to be
                          considered the same, such as the route, date of
                          travel, time of departure, bus type & operator.
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* Same Itinerary */}
                  <div className="flex mb-6">
                    <div className="w-1/4">
                      <h1 className="text-2xl font-semibold text-gray-800">
                        Same Itinerary
                      </h1>
                    </div>
                    <div className="flex-1">
                      <ol className="list-decimal pl-5 text-[15px] font-semibold text-gray-600">
                        <li>
                          From city to city and the in-between cities in the
                          itinerary should be the same.
                        </li>
                        <li>
                          The date of departure from all cities involved in the
                          itinerary should be the same.
                        </li>
                        <li>
                          The difference in time of departure from the origin
                          city could be +1 hour.
                        </li>
                        <li>
                          The difference in total journey time could be +/- 2
                          hours.
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* Claim Process */}
                  <div className="flex  mb-6">
                    <div className="w-1/4">
                      <h1 className="text-2xl font-semibold text-gray-800">
                        Claim Process
                      </h1>
                    </div>
                    <div className="flex-1">
                      {/* Step 1 */}
                      <ol className="list-decimal pl-5 text-[15px] font-semibold text-gray-600">
                        <li>
                          Contact the support and send the following resources
                          within 24 hours.
                          {/* Nested unordered list */}
                          <ul className="list-[lower-alpha] pl-6 mt-2 font-semibold text-gray-600">
                            <li>
                              Screenshots of the Payment Page of a similar
                              lower-priced bus ticket in JPG/PNG/PDF format with
                              a timestamp of when the screenshot was taken
                            </li>
                            <li>Booking PNR with the price</li>
                          </ul>
                        </li>
                      </ol>

                      {/* Step 2 (continues numbering) */}
                      <ol
                        start={2}
                        className="list-decimal pl-5 mt-3 text-[15px] font-semibold text-gray-600"
                      >
                        <li>
                          Upon getting the details, we'll verify the
                          authenticity of your claim and respond within 72 hours
                          via email.
                        </li>
                      </ol>
                    </div>
                  </div>
                </>
              )}

              {activeTerms === "onTime" && (
                <>
                  {/* Terms & Conditions */}
                  <div className="flex mb-10">
                    <div className="w-1/4">
                      <h1 className="text-2xl font-semibold text-gray-800">
                        Terms & Conditions
                      </h1>
                    </div>
                    <div className="flex-1">
                      <ol className="list-decimal pl-5 text-[15px] font-semibold text-gray-600">
                        <li>
                          The On-Time Guarantee applies to both pickup and
                          drop-off services provided by Nabeel Bus
                        </li>
                        <li>
                          {" "}
                          The guarantee occurs when the pickup or drop-off is
                          delayed more than 45 minutes from the scheduled time.
                        </li>
                        <li>
                          It is only valid for bookings made and confirmed
                          through the Nabeel Bus platform and does not apply to
                          valuebus bookings.
                        </li>
                        <li>
                          To be eligible for the guarantee, the customer must
                          notify Nabeel Bus of the delay within twelve hours of the
                          trip completion. Claims received after this period
                          will not be considered.
                        </li>
                        <li>
                          {" "}
                          The guarantee applies only to delays caused by
                          Nabeel Bus's operational issues. Delays due to unforeseen
                          circumstances beyond Nabeel Bus's control and
                          customer-related factors are not covered under the
                          guarantee.
                        </li>
                        <li>
                          {" "}
                          Compensation will be processed within seven business
                          days from the verification date.
                        </li>
                        <li>
                          The guarantee is limited to one claim per booking.
                          Multiple delays within the same booking do not entitle
                          the customer to numerous claims.
                        </li>
                        <li>
                          Nabeel Bus reserves the right to investigate and
                          verify the delay claim before offering compensation.
                          False or misleading information may result in claim
                          rejection.
                        </li>
                        <li>
                          Nabeel Bus reserves the right to modify or terminate
                          the On-Time Guarantee at any time, with or without
                          prior notice.
                        </li>
                        <li>
                          Please note that these terms and conditions are
                          subject to change and may be updated by Nabeel Bus
                          without prior notice. We recommend customers
                          periodically review these terms and conditions for any
                          changes.
                        </li>
                        <li>
                          Nabeel Bus Guarantee is not applicable on SUVs
                          booking.
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* Same Itinerary */}
                  <div className="flex ">
                    <div className="w-1/4">
                      <h1 className="text-2xl font-semibold text-gray-800">
                        Claim Process
                      </h1>
                    </div>
                    <div className="flex-1">
                      <ol className="list-decimal pl-5 text-[15px] font-semibold text-gray-600">
                        <li>
                          Submit a claim within 12 hours of trip completion in
                          the “Trip Details” section under the “My Booking”
                          page.
                        </li>
                        <li>
                          The customer executive would verify the delay claim
                          within 3 working days.
                        </li>
                        <li>
                          Customers will receive notifications regarding the
                          status of delay verification. If they are eligible,
                          they will be redirected to an in-app page for delay
                          claims.
                        </li>
                        <li>
                          The In-app Nabeel Bus delay claim page will provide the
                          customer with a compensation option:Discount Coupon:
                          The customer will receive a discount that entitles
                          them to a 50% discount up to Rs.1000 on their next
                          booking. The coupon will be valid for three months
                          from the date of issuance.
                        </li>
                      </ol>
                    </div>
                  </div>
                </>
              )}
              {activeTerms === "freeCancel" && (
                <>
                  {/* Terms & Conditions */}
                  <div className="flex mb-10">
                    <div className="w-1/4">
                      <h1 className="text-2xl font-semibold text-gray-800">
                        Terms & Conditions
                      </h1>
                    </div>
                    <div className="flex-1">
                      <ol className="list-decimal pl-5 text-[15px] font-semibold text-gray-600">
                        <li>
                          Nabeel Bus offers a free last-minute cancellation policy,
                          allowing Nabeel Bus prime users to cancel their bus
                          tickets until the last minute before departure and
                          receive an immediate refund. For non-prime users, this
                          policy will not be applicable. Please check the
                          service provider’s cancellation policy on the trip
                          page for further information.
                        </li>
                        <li>
                          {" "}
                          Partial cancellations, i.e. cancellation of one or
                          more seats of the total booked seats, are also covered
                          under the policy.
                        </li>
                        <li>
                          The policy applies solely to tickets booked via the
                          Nabeel Bus platform and only applies to Nabeel Bus tickets,
                          excluding valuebus tickets. Tickets booked through
                          third-party websites or applications are not eligible.
                        </li>
                        <li>
                          The Free Cancellation Policy is non-transferable and
                          can only be used by the registered Nabeel Bus account
                          holder.
                        </li>
                        <li>
                          Nabeel Bus reserves the right to alter or terminate
                          the Free Cancellation Policy without prior notice. Any
                          modifications will be published on our platform and
                          apply to bookings made after the changes are
                          implemented.
                        </li>
                        <li>
                          Nabeel Bus Guarantee is not applicable on SUVs
                          booking.
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* Same Itinerary */}
                  <div className="flex ">
                    <div className="w-1/4">
                      <h1 className="text-2xl font-semibold text-gray-800">
                        Claim Process
                      </h1>
                    </div>
                    <div className="flex-1">
                      <ol className="list-decimal pl-5 text-[15px] font-semibold text-gray-600">
                        <li>
                          To cancel your booking, simply login to your Nabeel Bus
                          account, navigate to your booking section and click
                          'Cancel' before the scheduled bus departure. Refunds
                          will be processed instantly to the original payment
                          method.
                        </li>
                      </ol>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OfferSection;
