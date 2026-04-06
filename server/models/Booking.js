import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema({
  car: { type: ObjectId, ref: "Car", required: true },
  user: { type: ObjectId, ref: "User", required: true },
  owner: { type: ObjectId, ref: "User", required: true },

  pickupDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },

  // ✅ SINGLE CLEAN STATUS FIELD
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "ready_for_pickup",
      "picked_up",
      "completed",
      "late",
      "cancelled"
    ],
    default: "pending"
  },

  price: { type: Number, required: true },

  paymentStatus: {
    type: String,
    default: "Pending"
  },

  paymentId: {
    type: String,
  },

  // 🔐 OTP SYSTEM
  pickupOTP: String,

  otpVerified: {
    type: Boolean,
    default: false
  },
  penalty: {
  type: Number,
  default: 0
},
returnOTP: String,
returnVerified: {
  type: Boolean,
  default: false
},
refundStatus: {
  type: String,
  default: "None" // None | Refunded
},
  pickupTime: Date,

}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;