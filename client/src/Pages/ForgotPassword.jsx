import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from 'react'
const ForgotPassword = () => {

  // ✅ MUST BE INSIDE COMPONENT
  const { axios, setToken, fetchUser } = useAppContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1)
  const [timer, setTimer] = useState(30);
  // STEP 1 → SEND OTP
  const sendOtp = async (e) => {
    e.preventDefault();

    const { data } = await axios.post('/api/user/forgot-password', { email });

  if (data.success) {
  toast.success("OTP sent");
  setStep(2);
  setTimer(30); // ✅ ADD THIS
}else {
      toast.error(data.message);
    }
  };
  useEffect(() => {
  let interval;

  if (step === 2 && timer > 0) {
    interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  }

  return () => clearInterval(interval);
}, [step, timer]);
const resendOtpHandler = async () => {
  if (timer > 0) return;

  try {
    const { data } = await axios.post('/api/user/forgot-password', { email });

    if (data.success) {
      toast.success("OTP resent");
      setTimer(30);
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    toast.error(error.message);
  }
};

  // STEP 2 → RESET PASSWORD
  const resetPassword = async (e) => {
    e.preventDefault();

    const { data } = await axios.post('/api/user/reset-password', {
      email,
      otp,
      password
    });

   if (data.success) {
  toast.success("Password updated");

  localStorage.setItem("token", data.token);
  setToken(data.token);

  axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

  await fetchUser();

  navigate('/');
} else {
  toast.error(data.message); // ✅ THIS LINE FIXES YOUR ISSUE
}
  };

  return  (
  <div className="min-h-screen flex items-center justify-center bg-black/40">
    
    <form
      onSubmit={step === 1 ? sendOtp : resetPassword}
      className="flex flex-col gap-4 p-8 py-10 w-80 sm:w-[350px] bg-white rounded-xl shadow-xl text-gray-600"
    >
      
      <p className="text-2xl font-medium text-center">
        <span className="text-primary">Reset</span> Password
      </p>

      {/* EMAIL */}
      <div className="w-full">
        <p>Email</p>
        <input
          type="email"
          placeholder="Enter email"
          className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* OTP + PASSWORD */}
      {step === 2 && (
        <>
          <div className="w-full">
            <p>OTP</p>
            <input
              type="text"
              placeholder="Enter OTP"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <div className="w-full">
            <p>New Password</p>
            <input
              type="password"
              placeholder="Enter new password"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p className="text-sm text-gray-500">
  Didn’t receive OTP?{" "}
  
  {timer > 0 ? (
    <span className="text-gray-400">
      Resend in {timer}s
    </span>
  ) : (
    <span
      onClick={resendOtpHandler}
      className="text-primary cursor-pointer font-medium"
    >
      Resend OTP
    </span>
  )}
</p>
        </>
      )}

      <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md">
        {step === 1 ? "Send OTP" : "Reset Password"}
      </button>

    </form>
  </div>
);
};

export default ForgotPassword;