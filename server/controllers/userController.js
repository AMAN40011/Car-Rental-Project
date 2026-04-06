import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Car from '../models/Car.js';
import otpGenerator from "otp-generator";
import { sendEmail } from "../configs/utils/sendEmail.js";
import crypto from "crypto";
//Generate JWT Token
const generateToken=(userId)=>{
   const payload = { id: userId };
    return jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: "7d"
});
}
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.json({ success: false, message: "Fill all fields properly" });
    }

    const userExists = await User.findOne({ email });
   if (userExists) {
  if (!userExists.isVerified) {
    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    });

    userExists.otp = otp;
    userExists.otpExpiry = Date.now() + 10 * 60 * 1000;
    await userExists.save();
    try{
     sendEmail(email, "Verify your account", `Your OTP is ${otp}`);
    }catch (error) {
  console.log("EMAIL ERROR:", error.message);
}
    return res.json({ success: true, message: "OTP resent" });
  }

  return res.json({ success: false, message: "User already exists" });
}

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 Generate OTP
    const otp = otpGenerator.generate(6, {
  digits: true,
  alphabets: false,
  upperCaseAlphabets: false,
  specialChars: false
});

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    // 🔥 Send email
    
    try {
  await sendEmail(
    email,
  "🔐 Verify Your Account - Car Rental",
  `
  <div style="background:#f4f6f8; padding:30px; font-family:Arial, sans-serif;">
    
    <div style="max-width:500px; margin:auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background:#2d89ef; padding:20px; text-align:center; color:white;">
        <h2 style="margin:0;">🚗 Car Rental</h2>
        <p style="margin:5px 0;">Account Verification</p>
      </div>

      <!-- Content -->
      <div style="padding:25px; text-align:center;">
        
        <h3 style="margin-bottom:10px;">Verify Your Email</h3>
        <p style="color:#555;">Use the OTP below to complete your registration:</p>

        <!-- OTP BOX -->
        <div style="margin:20px 0; padding:15px; background:#f0f4ff; border-radius:8px; font-size:28px; letter-spacing:5px; font-weight:bold; color:#2d89ef;">
          ${otp}
        </div>

        <p style="color:#777; font-size:14px;">
          This OTP is valid for <b>10 minutes</b>.
        </p>

        <p style="color:#999; font-size:13px; margin-top:20px;">
          If you didn’t request this, you can safely ignore this email.
        </p>

      </div>

      <!-- Footer -->
      <div style="background:#f1f1f1; padding:10px; text-align:center; font-size:12px; color:#888;">
        © 2026 Car Rental System
      </div>

    </div>

  </div>
  `
);} catch (error) {
  console.log("EMAIL ERROR:", error.message);
}

    res.json({ success: true, message: "OTP sent to email" });

  } catch (error) {
  console.log("REGISTER ERROR:", error);   // 🔥 ADD THIS
  res.status(500).json({ success: false, message: error.message });
}
};
export const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const carId = req.params.carId;

    const exists = user.wishlist.includes(carId);

    if (exists) {
      user.wishlist.pull(carId);
    } else {
      user.wishlist.push(carId);
    }

    await user.save();

    res.json({ success: true, wishlist: user.wishlist });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

   if (!user || user.otp !== String(otp)) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    const token = generateToken(user._id.toString());

    res.json({ success: true, token });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Login User
export const loginUser=async(req,res)=>{
    try{
    const {email,password}=req.body
   const user = await User.findOne({ email });

if (!user) {
  return res.json({ success: false, message: "User not found" });
}

if (!user.isVerified) {
  return res.json({ success: false, message: "Please verify your email first" });
}
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
           return res.json({success:false,message:"Invalid Credentials"})
    }
    const token =generateToken(user._id.toString())
     res.json({success:true,token})
    }catch(error){
       console.log(error.message);
     res.json({success:false, message:error.message})
    }
}
//Get User data using Token (JWT)
export const getUserData = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).populate("wishlist");

    // ✅ REMOVE NULL VALUES
    user.wishlist = user.wishlist.filter(car => car !== null);

    res.json({ success: true, user });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Get All Cars for the frontend
export const getCars=async (req,res)=>{
    try{
        const cars=await Car.find({isAvailable:true})
        res.json({success:true,cars})
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}




export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    user.resetToken = otp;
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();
     try{
     sendEmail(
      email,
      "🔐 Reset Password OTP",
      `
      <div style="text-align:center; font-family:Arial;">
        <h2>Reset Password</h2>
        <p>Your OTP is:</p>
        <h1 style="color:#2d89ef;">${otp}</h1>
        <p>Valid for 30 seconds</p>
      </div>
      `
    );} catch (error) {
  console.log("EMAIL ERROR:", error.message);
}

    res.json({ success: true, message: "OTP sent to email" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body; // ✅ FIX

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // ❌ WRONG OTP
    if (user.resetToken !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // ❌ EXPIRED OTP
    if (user.resetTokenExpiry < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    // ✅ UPDATE PASSWORD
    user.password = await bcrypt.hash(password, 10);

    // ✅ CLEAR OTP
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    // ✅ LOGIN AFTER RESET
    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: "Password reset successful",
      token
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ success: false, message: "User already verified" });
    }

    // 🔥 generate new OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    // 🔥 send email
    try{
     sendEmail(
      email,
      "🔐 New OTP - Car Rental",
      `
      <div style="padding:20px; font-family:Arial;">
        <h2>New OTP</h2>
        <h1 style="color:#2d89ef;">${otp}</h1>
        <p>Valid for 30 seconds</p>
      </div>
      `
    );
} catch (error) {
  console.log("EMAIL ERROR:", error.message);
}
    res.json({ success: true, message: "OTP resent successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
  
  
};