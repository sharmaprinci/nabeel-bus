import React, { useEffect } from "react";
import API from "../api";

const PaymentForm = ({ booking }) => {
  const handlePayment = async () => {
    try {
      const res = await API.post("/api/payments/create-order", {
        bookingId: booking._id,
        amount: booking.totalAmount
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: res.data.amount,
        currency: res.data.currency,
        name: "Nabeel Bus Service",
        order_id: res.data.id,
        handler: async function (response) {
          alert("Payment Successful!");
          await API.post(`/api/payments/verify`, { bookingId: booking._id, paymentId: response.razorpay_payment_id });
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  return <button onClick={handlePayment} className="bg-green-600 text-white px-4 py-2 rounded">Pay Now</button>;
};

export default PaymentForm;
