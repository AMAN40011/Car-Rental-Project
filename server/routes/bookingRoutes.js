
import express from 'express';
import { checkAvailabilityOfCar,
    createBooking, getUserBookings,
  getOwnerBookings,
  changeBookingStatus,dummyPayment, getSingleBooking,sendPickupOTP,
  verifyPickupOTP,returnCar,sendReturnOTP,verifyReturnOTP } from '../controllers/bookingController.js';
import {protect} from "../middleware/auth.js"
const bookingRouter=express.Router();

bookingRouter.post("/check-availability",checkAvailabilityOfCar)
bookingRouter.post("/create",protect, createBooking)
bookingRouter.get("/user",protect, getUserBookings)
bookingRouter.get("/owner",protect, getOwnerBookings)
bookingRouter.get("/:id", protect,getSingleBooking);
bookingRouter.post("/change-status",protect, changeBookingStatus)
bookingRouter.post("/dummy-payment", protect, dummyPayment);
bookingRouter.post("/send-otp/:id", protect, sendPickupOTP);
bookingRouter.post("/verify-otp/:id", protect, verifyPickupOTP);
bookingRouter.post("/return/:id", protect, returnCar);
bookingRouter.post("/return-otp/:id", protect, sendReturnOTP);
bookingRouter.post("/verify-return/:id", protect, verifyReturnOTP);
export default bookingRouter;