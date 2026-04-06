import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Payment = () => {
  const { id } = useParams(); // booking id
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await axios.get(
          "/api/bookings/user",
          { withCredentials: true }
        );

        const selectedBooking = data.bookings.find(
          (b) => b._id === id
        );

        setBooking(selectedBooking);
      } catch (error) {
        console.log("Error fetching booking:", error);
      }
    };

    fetchBooking();
  }, [id]);

  if (!booking) {
    return (
      <div className="text-center mt-20 text-lg">
        Loading payment details...
      </div>
    );
  }

  // 🔹 Calculate number of days
  const picked = new Date(booking.pickupDate);
  const returned = new Date(booking.returnDate);

  const days = Math.ceil(
    (returned - picked) / (1000 * 60 * 60 * 24)
  );

  const amount = booking.price; // Already calculated in backend

  // 🔹 Dynamic UPI link
  const upiLink = `upi://pay?pa=aakashpal4477@oksbi&pn=AakashPal&am=${amount}&cu=INR`;

  const handlePayment = async () => {
  setLoading(true);

  try {
    const res = await axios.post(
      "/api/bookings/dummy-payment",
      { bookingId: id },
      { withCredentials: true }
    );

    if (res.data.success) {
      toast.success("Payment Successful! Booking Confirmed.");

      // small delay so toast is visible
      setTimeout(() => {
        navigate("/my-bookings");
      }, 1500);
    }

  } catch (error) {
    toast.error("Payment failed");
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">

        <h2 className="text-2xl font-semibold mb-4">
          Complete Payment
        </h2>

        {/* 🔹 Booking Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <p>
            <strong>Car:</strong> {booking.car.brand}{" "}
            {booking.car.model}
          </p>

          <p>
            <strong>Days:</strong> {days}
          </p>

          <p>
            <strong>Price Per Day:</strong> ₹
            {booking.car.pricePerDay}
          </p>

          <p className="text-lg font-bold mt-2">
            Total: ₹{amount}
          </p>
        </div>

        {/* 🔹 QR Code */}
        <div className="flex justify-center mb-4">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
              upiLink
            )}`}
            alt="UPI QR"
            className="rounded-lg"
          />
        </div>

        <p className="text-sm text-gray-600 mb-6">
          UPI ID:{" "}
          <span className="font-medium">
            aakashpal4477@oksbi
          </span>
        </p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all"
        >
          {loading ? "Processing..." : "I Have Paid"}
        </button>
      </div>
    </div>
  );
};

export default Payment;