import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import axios from "axios";
import CarMap from "../components/Map"
import toast from "react-hot-toast"
const BookingDetails = () => {
  const { id } = useParams()
  const { currency } = useAppContext()
  const [sendingReturnOtp, setSendingReturnOtp] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
const [otp, setOtp] = useState("");
const [otpTimer, setOtpTimer] = useState(30);
const [canResend, setCanResend] = useState(false);
const [otpTrigger, setOtpTrigger] = useState(0);
const [returnTimer, setReturnTimer] = useState(30);
const [canResendReturn, setCanResendReturn] = useState(false);
const [showReturnOtp, setShowReturnOtp] = useState(false);

const [sendingOtp, setSendingOtp] = useState(false);
const [returnOtp, setReturnOtp] = useState("");
const [returnTrigger, setReturnTrigger] = useState(0);
  const [booking, setBooking] = useState(null)
const [timeLeft, setTimeLeft] = useState("");
const handleTakeCar = async () => {
  console.log("CLICKED");

  try {
    console.log("API CALL START");

    const res = await axios.post(
      `/api/bookings/send-otp/${booking._id}`
    );

    console.log("API RESPONSE:", res);

    toast.success("OTP sent");

  } catch (err) {
    console.log("API ERROR:", err);
    toast.error("Error sending OTP");
  }
};
const handleReturnCar = async () => {
  if (sendingReturnOtp) return; // 🔥 prevent multiple clicks

  try {
    setSendingReturnOtp(true);

    await axios.post(`/api/bookings/return-otp/${booking._id}`);

    toast.success("Return OTP sent to admin 📩");
    setShowReturnOtp(true);
setReturnTimer(30);
setCanResendReturn(false);
setReturnTrigger(prev => prev + 1); 

  } catch (err) {
    toast.error("Error sending return OTP");
  } finally {
    setSendingReturnOtp(false);
  }
};
const resendOtp = async () => {
  try {
    await axios.post(`/api/bookings/send-otp/${booking._id}`);
    toast.success("OTP resent 📩");

    setOtpTimer(30);
    setCanResend(false);
setOtpTrigger(prev => prev + 1); 
  } catch {
    toast.error("Error resending OTP");
  }
};
useEffect(() => {
  if (!showReturnOtp) return;

  const interval = setInterval(() => {
    setReturnTimer((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        setCanResendReturn(true);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [returnTrigger]); // 🔥 IMPORTANT
const resendReturnOtp = async () => {
  try {
    await axios.post(`/api/bookings/return-otp/${booking._id}`);
    toast.success("Return OTP resent 📩");

    setReturnTimer(30);
    setCanResendReturn(false);
    setReturnTrigger(prev => prev + 1);
  } catch {
    toast.error("Error resending OTP");
  }
};
const verifyReturn = async () => {
  try {
    const res = await axios.post(
      `/api/bookings/verify-return/${booking._id}`,
      { otp: returnOtp }
    );

    if (res.data.success) {
      toast.success(`Car Returned 🚗 Penalty ₹${res.data.penalty}`);
      fetchBooking();
      setShowReturnOtp(false);
    } else {
      toast.error("Wrong OTP");
    }
  } catch (err) {
    toast.error("Error verifying OTP");
  }
};
useEffect(() => {
  if (!showOtp) return;

  const interval = setInterval(() => {
    setOtpTimer((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        setCanResend(true); // 🔥 show resend
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [otpTrigger]); // 🔥 IMPORTANT CHANGE
const verifyOtp = async () => {
  const res = await axios.post(
    `/api/bookings/verify-otp/${booking._id}`,
    { otp }
  );
  
  if (res.data.success) {
   toast.success("Car Picked Successfully 🚗");
fetchBooking(); // refresh data without reload
setShowOtp(false);
    
  } else {
    toast.error("Wrong Otp")
  }
};
  useEffect(() => {
    fetchBooking()
  }, [])

  const fetchBooking = async () => {
    const res = await axios.get(`/api/bookings/${id}`)
    setBooking(res.data.booking)
  }
  useEffect(() => {
  if (!booking || booking.status !== "picked_up") return;

  const interval = setInterval(() => {
    const now = new Date();
    const returnTime = new Date(booking.returnDate);

    const diff = returnTime - now;

    if (diff <= 0) {
      setTimeLeft("⚠️ Time Over");
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    setTimeLeft(`${hours}h ${minutes}m left`);
  }, 1000);

  return () => clearInterval(interval);
}, [booking]);
  

  if (!booking) return <p className="p-6">Loading...</p>
  

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">

      {/* 🔹 CAR SECTION */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Image */}
        <img
          src={booking.car.image}
          className="w-full rounded-xl shadow-md"
        />

        {/* Info */}
       <div className="flex flex-col gap-4">

  {/* 🔥 Car Title */}
  <h1 className="text-3xl font-bold tracking-tight">
    {booking.car.brand} {booking.car.model}
  </h1>

  {/* 🔥 Info Cards */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">

    {/* Type */}
    <div className="bg-white shadow-sm border rounded-xl p-3 flex flex-col items-center">
      <span className="text-xl">🚗</span>
      <p className="text-xs text-gray-400">Type</p>
      <p className="font-medium text-sm">{booking.car.category}</p>
    </div>

    {/* Location */}
    <div className="bg-white shadow-sm border rounded-xl p-3 flex flex-col items-center">
      <span className="text-xl">📍</span>
      <p className="text-xs text-gray-400">Location</p>
      <p className="font-medium text-sm">{booking.car.location}</p>
    </div>

    {/* Year */}
    <div className="bg-white shadow-sm border rounded-xl p-3 flex flex-col items-center">
      <span className="text-xl">📅</span>
      <p className="text-xs text-gray-400">Year</p>
      <p className="font-medium text-sm">{booking.car.year}</p>
    </div>

    {/* Fuel */}
    <div className="bg-white shadow-sm border rounded-xl p-3 flex flex-col items-center">
      <span className="text-xl">⛽</span>
      <p className="text-xs text-gray-400">Fuel</p>
      <p className="font-medium text-sm">{booking.car.fuel || "Petrol"}</p>
    </div>

  </div>

  {/* 🔥 Price */}
  <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white rounded-2xl p-5 mt-4 shadow-lg">
  <p className="text-sm opacity-80">Total Price</p>
  <h2 className="text-3xl font-bold tracking-wide">
    {currency}{booking.price}
  </h2>
</div>
  {/* 🔥 Booking Date */}
  <p className="text-gray-400 text-sm">
    Booked on {booking.createdAt.split("T")[0]}
  </p>

</div>
      </div>

      {/* 🔹 BOOKING DETAILS */}
     <div className="mt-10 grid md:grid-cols-2 gap-6">

  {/* LEFT - Booking Details */}
  <div className="p-6 border rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Booking Details</h2>

        <p>Pickup: {booking.pickupDate.split("T")[0]}</p>
        <p>Return: {booking.returnDate.split("T")[0]}</p>

        <p className="mt-3">
          Status:
          <span
  className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
    booking.status === "confirmed"
      ? "bg-green-100 text-green-600"
      : booking.status === "picked_up"
      ? "bg-blue-100 text-blue-600"
      : booking.status === "completed"
      ? "bg-indigo-100 text-indigo-600"
      : booking.status === "cancelled"
      ? "bg-red-100 text-red-600"
      : "bg-yellow-100 text-yellow-600"
  }`}
>
  {
    booking.status === "confirmed"
      ? "Confirmed"
      : booking.status === "picked_up"
      ? "In Use"
      : booking.status === "completed"
      ? "Completed"
      : booking.status === "cancelled"
      ? "Cancelled"
      : "Pending"
  }
</span>
        </p>
        {booking.penalty > 0 && (
  <p className="text-red-600 font-semibold mt-2">
    Penalty: ₹{booking.penalty}
  </p>
)}
        </div>
        {/* RIGHT - OTP PANEL */}
<div className="p-6 border rounded-xl shadow-md bg-white flex flex-col gap-4 justify-center">
    {/* 🔥 PENDING STATE */}
{booking.status === "pending" && (
  <div className="text-center">
    <p className="text-yellow-600 text-lg font-semibold">
      ⏳ Waiting for admin approval
    </p>
    <p className="text-gray-500 text-sm mt-1">
      Your booking will be confirmed soon
    </p>
  </div>
)}

  {booking.status === "confirmed" && !showOtp && (
    <>
      <p className="text-center text-lg font-medium mb-3">
        Click below to start your ride
      </p>

      <button
  onClick={handleTakeCar}
  disabled={sendingOtp}
  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg w-full disabled:opacity-50"
>
  🚗 {sendingOtp ? "Sending..." : "Take Car"}
</button>
    </>
  )}

  {showOtp && (
    <>
      <p className="text-green-600 mb-2 text-sm">
  ✅ OTP sent to admin. Ask admin for OTP.
</p>

<input
  type="number"
  value={otp}
  onChange={(e) => setOtp(e.target.value)}
  className="border p-3 rounded-lg w-full mb-2"
/>

<button
  onClick={verifyOtp}
  className="bg-green-500 text-white py-3 rounded-lg w-full"
>
  Verify OTP
</button>

{/* 🔥 RESEND */}
<p className="text-center text-sm mt-2 text-gray-500">
  {canResend ? (
    <span
      onClick={resendOtp}
      className="text-blue-600 cursor-pointer font-medium"
    >
      Resend OTP
    </span>
  ) : (
    `Resend in ${otpTimer}s`
  )}
</p>
    </>
  )}
 {booking.status === "picked_up" && (
  <div className="text-center">
    <p className="text-green-600 font-semibold text-lg">
      🚗 Ride Started
    </p>
    <p className="text-gray-500 text-sm mt-1">
      Enjoy your journey!
    </p>
  </div>
)}
{booking.status === "picked_up" && (
  <div className="text-center mt-3">
   <div className="bg-blue-50 p-3 rounded-lg text-center">
  <p className="text-blue-600 font-semibold text-lg">
    ⏱️ {timeLeft}
  </p>
</div>
  </div>
)}
{booking.status === "late" && (
  <p className="text-red-600 font-semibold text-center">
    ⚠️ You are late! Penalty may apply
  </p>
)}

{booking.status === "picked_up" && !showReturnOtp && (
  <button
  onClick={handleReturnCar}
  disabled={sendingReturnOtp}
  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg w-full hover:scale-105 transition disabled:opacity-50"
>
  🔄 {sendingReturnOtp ? "Sending..." : "Return Car"}
</button>
)}
 
{showReturnOtp && (
  <div className="mt-3">
    <p className="text-green-600 mb-2">
  ✅ Return OTP sent to admin. Ask admin for OTP.
</p>

<input
  type="number"
  value={returnOtp}
  onChange={(e) => setReturnOtp(e.target.value)}
  className="border p-3 rounded-lg w-full mb-2"
/>

<button
  onClick={verifyReturn}
  className="bg-green-500 text-white py-3 rounded-lg w-full"
>
  Verify Return OTP
</button>

<p className="text-center text-sm mt-2 text-gray-500">
  {canResendReturn ? (
    <span
      onClick={resendReturnOtp}
      className="text-blue-600 cursor-pointer font-medium"
    >
      Resend OTP
    </span>
  ) : (
    `Resend in ${returnTimer}s`
  )}
</p>
  </div>
)}
{/* 🔥 COMPLETED STATE */}
{booking.status === "completed" && (
  <div className="text-center">
    <p className="text-indigo-600 text-lg font-semibold">
      🎉 Journey Completed
    </p>

    <p className="text-gray-500 text-sm mt-1">
      Hope you enjoyed your ride!
    </p>

    <button
      onClick={() => window.location.href = "/cars"}
      className="mt-4 bg-primary text-white px-4 py-2 rounded-lg"
    >
      Book Again 🚗
    </button>
  </div>
)}
{/* 🔥 CANCELLED STATE */}
{booking.status === "cancelled" && (
  <div className="text-center">
    
    <p className="text-red-600 text-lg font-semibold">
      ❌ Booking Cancelled
    </p>
     {/* 🔥 STEP 3 (THIS IS WHAT YOU ASKED) */}
    {booking.paymentStatus === "Paid" && (
      <p className="text-green-600 text-sm mt-1">
        💰 Refund will be processed
      </p>
    )}

    <p className="text-gray-500 text-sm mt-1">
      This car is no longer available for your selected dates.
    </p>

    <p className="text-gray-500 text-sm">
      Try booking another car 🚗
    </p>

    <button
      onClick={() => window.location.href = "/cars"}
      className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:scale-105 transition"
    >
      Book New Car
    </button>

  </div>
  
)}



</div>
        </div>
    
      <div className="mt-10">
  <h2 className="text-xl font-semibold mb-3">Pickup Location</h2>

 {/* 📍 Car Location Section */}
<div className="mt-10 bg-white rounded-xl shadow-lg p-5 border">

  <h1 className='text-xl font-semibold mb-3'>
    📍 Pickup Location
  </h1>

  {/* Map */}
  <div className="rounded-lg overflow-hidden">
    {booking?.car?.coordinates ? (
      <CarMap cars={[booking.car]} center={booking.car.coordinates} />
    ) : (
      <p className="text-gray-500">Location not available</p>
    )}
  </div>

  {/* Address */}
  {booking?.car?.address && (
    <p className="text-gray-600 mt-3 text-sm">
      {booking.car.address}
    </p>
  )}

  {/* Buttons */}
  {booking?.car?.coordinates && (
    <div className="flex gap-3 mt-4">

      {/* Open in Maps */}
      <a
        href={`https://www.google.com/maps?q=${booking.car.coordinates.lat},${booking.car.coordinates.lng}`}
        target="_blank"
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
      >
        Open in Maps
      </a>

      {/* Directions */}
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${booking.car.coordinates.lat},${booking.car.coordinates.lng}`}
        target="_blank"
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
      >
        Get Directions
      </a>

    </div>
  )}

</div>
</div>

      {/* 🔹 USER vs OWNER */}
      <div className="mt-10 grid md:grid-cols-2 gap-6">

        {/* User */}
        <div className="p-5 border rounded-xl">
          <h3 className="font-semibold mb-2">User</h3>
          <p>{booking.user.name}</p>
          <p className="text-gray-500">{booking.user.email}</p>
        </div>

        {/* Owner */}
        <div className="p-5 border rounded-xl">
          <h3 className="font-semibold mb-2">Owner</h3>
          <p>{booking.owner.name}</p>
          <p className="text-gray-500">{booking.owner.email}</p>
        </div>

      </div>

    </div>
  )
}

export default BookingDetails