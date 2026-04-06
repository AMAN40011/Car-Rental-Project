import express from "express";
import {
  getUserData,
  registerUser,
  loginUser,
  getCars,
   resendOtp ,
  verifyOtp,
  forgotPassword,
  resetPassword
} from "../controllers/userController.js"
import { protect } from "../middleware/auth.js";
import { toggleWishlist } from "../controllers/userController.js";



const userRouter = express.Router();

// Existing routes
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', protect, getUserData)
userRouter.get('/cars', getCars)
userRouter.post('/resend-otp', resendOtp);
// 🔥 NEW ROUTES (ADD THESE)
userRouter.post('/verify-otp', verifyOtp)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)

userRouter.post("/wishlist/:carId", protect, toggleWishlist);
export default userRouter;