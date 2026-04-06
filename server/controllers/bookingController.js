import Booking from "../models/Booking.js"
import Car from "../models/Car.js";
import { sendBookingEmail } from "../configs/utils/sendEmail.js";
import nodemailer from "nodemailer"; 



//Function to Check Availabillity of Car for a given Date
const checkAvailability =async(car,pickupDate,returnDate)=>{
    const bookings=await Booking.find({
        car,
        pickupDate:{$lte:returnDate},
        returnDate:{$gte:pickupDate},
    })
    
    return bookings.length===0;
}

//API to Check Availability of Cars for the given Date and location
export const checkAvailabilityOfCar=async(req,res)=>{
    try{
        const { location, pickupDate, returnDate } = req.body;
       console.log("BODY:", req.body);
// 🔥 ADD THIS
const pickup = new Date(pickupDate);
const returned = new Date(returnDate);
        //fetch all available cars for the given location
        const cars = await Car.find({
  $or: [
    { location: { $regex: location, $options: "i" } },
    { address: { $regex: location, $options: "i" } },
    { city: { $regex: location, $options: "i" } }
  ]
});
console.log("CARS FOUND:", cars.length);

        //check car avaliability for the given data range using promise
        const availableCarsPromises=cars.map(async(car)=>{
           const isAvailable = await checkAvailability(
    car._id,
    pickup,
    returned
);
            return {...car._doc,isAvailable:isAvailable}
        })

        let availableCars =await Promise.all(availableCarsPromises);
        availableCars=availableCars.filter(car=>car.isAvailable===true)

        res.json({success:true,availableCars})


    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

//API to Create Booking

export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    // ✅ DATE VALIDATION (ADD HERE)
    const pickup = new Date(pickupDate);
    const returned = new Date(returnDate);

    if (!pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: "Please select both dates"
      });
    }

    if (returned <= pickup) {
      return res.status(400).json({
        success: false,
        message: "Return date must be after pickup date"
      });
    }

    // ✅ CHECK AVAILABILITY
    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res.json({ success: false, message: "Car is not available" });
    }

    const carData = await Car.findById(car);

    // ✅ PRICE CALCULATION
    const noOfDays = Math.ceil(
      (returned - pickup) / (1000 * 60 * 60 * 24)
    );

    const price = carData.pricePerDay * noOfDays;

    const newBooking = await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
      paymentStatus: "Pending",
      status: "pending"
    });

    res.json({
      success: true,
      message: "Proceed to Payment",
      booking: newBooking
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API to List User Bookings
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;

    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API to get Owner Bookings
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API to change booking status
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate("user")
      .populate("car");

    if (!booking) {
      return res.json({ success: false });
    }

    if (booking.owner.toString() !== _id.toString()) {
      return res.json({ success: false });
    }
    if (status === "cancelled" && booking.paymentStatus === "Paid") {
  booking.refundStatus = "Refunded";
}
// if (status === "confirmed" && booking.paymentStatus !== "Paid") {
//   return res.json({
//     success: false,
//     message: "User has not completed payment"
//   });
// }

// ✅ ALLOW STATUS CHANGE
booking.status = status.toLowerCase();

await booking.save();

res.json({
  success: true,
  message:
    status === "confirmed"
      ? "Booking confirmed successfully"
      : status === "cancelled"
      ? "Booking cancelled successfully"
      : "Booking updated successfully"
});

  } catch (error) {
    res.json({ success: false });
  }
};
export const dummyPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const fakePaymentId = "PAY_" + Date.now();

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: "Paid",   // ✅ ONLY PAYMENT
        paymentId: fakePaymentId
      },
      { new: true }
    );

    res.json({ success: true, booking });
  } catch (error) {
    res.json({ success: false });
  }
};
export const getSingleBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("car")
      .populate("user")
      .populate("owner");

    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, booking });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const sendPickupOTP = async (req, res) => {
  
  try {
    console.log("SEND PICKUP OTP API HIT");
    const booking = await Booking.findById(req.params.id)
      .populate("owner")
      .populate("user")
      .populate("car");

    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

     const otp = Math.floor(100000 + Math.random() * 900000);

    booking.pickupOTP = otp;
    await booking.save();

    // ✅ SEND EMAIL TO ADMIN
    const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

 
    try { await transporter.sendMail({
  from: `"Car Rental" <${process.env.SMTP_USER}>`,
  to: booking.owner.email,
  subject: "Car Pickup OTP",
      html: `
        <h2>Car Pickup OTP</h2>
        <p>User: ${booking.user.name}</p>
        <p>Car: ${booking.car.brand} ${booking.car.model}</p>
        <h1 style="color:green;">OTP: ${otp}</h1>
      `,
    }).then(() => console.log("EMAIL SENT"))
  .catch(err => console.log("EMAIL ERROR:", err.message));
res.json({ success: true });

} catch (err) {
  console.log("MAIL FAIL:", err.message);
}

    
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const verifyPickupOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (booking.pickupOTP == otp) {
      booking.otpVerified = true;
      booking.pickupTime = new Date();
      booking.status = "picked_up";

      await booking.save();

      res.json({ success: true });

    } else {
      res.json({ success: false, message: "Wrong OTP" });
    }

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const returnCar = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.json({ success: false });
    }
    
    const now = new Date();
    const returnTime = new Date(booking.returnDate);

    let penalty = 0;

    // ⏱️ LATE CALCULATION
    if (now > returnTime) {
      const diff = now - returnTime;

      const extraHours = Math.ceil(diff / (1000 * 60 * 60));

      penalty = extraHours * 100; // ₹100 per hour
    }

    booking.status = "completed";
    booking.penalty = penalty;

    await booking.save();

    res.json({ success: true, penalty });

  } catch (error) {
    res.json({ success: false });
  }
};
export const sendReturnOTP = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("owner")
      .populate("user")
      .populate("car");

     const otp = Math.floor(100000 + Math.random() * 900000);

    booking.returnOTP = otp;
    await booking.save();

    // 📩 EMAIL TO ADMIN
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
 
     try {  transporter.sendMail({
      from: `"Car Rental" <${process.env.SMTP_USER}>`,
      to: booking.owner.email, // admin gets OTP
      subject: "Car Return OTP",
      html: `
        <h2>Return OTP</h2>
        <p>User: ${booking.user.name}</p>
        <p>Car: ${booking.car.brand}</p>
        <h1>${otp}</h1>
      `,
    }).then(() => console.log("EMAIL SENT"))
  .catch(err => console.log("EMAIL ERROR:", err.message));
  res.json({ success: true });


} catch (err) {
  console.log("MAIL FAIL:", err.message);
}

   
  } catch (error) {
    res.json({ success: false });
  }
};
export const verifyReturnOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (booking.returnOTP == otp) {
      booking.returnVerified = true;

      // ⏱️ penalty logic
      const now = new Date();
      const returnTime = new Date(booking.returnDate);

      let penalty = 0;

      if (now > returnTime) {
        const diff = now - returnTime;
        const hours = Math.ceil(diff / (1000 * 60 * 60));
        penalty = hours * 100;
      }

      booking.status = "completed";
      booking.penalty = penalty;

      await booking.save();

      res.json({ success: true, penalty });

    } else {
      res.json({ success: false });
    }

  } catch (error) {
    res.json({ success: false });
  }
};