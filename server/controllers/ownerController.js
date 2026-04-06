import imageKit from '../configs/imageKit.js';
import User from '../models/User.js';
import fs from 'fs';
import Booking from '../models/Booking.js';
import Car from "../models/Car.js"
import upload from '../middleware/multer.js';

export const changeRoleToOwner =async(req,res)=>{
    try{
        const {_id} =req.user;
        await User.findByIdAndUpdate(_id,{role:"owner"})
        res.json({success:true,message:"Now you can list cars"})
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})

    }
}
//API to list Car

export const addCar=async(req,res)=>{
    try{
       const {_id}=req.user;
       let car=JSON.parse(req.body.carData);
       const imageFile=req.file;

       const fileBuffer=fs.readFileSync(imageFile.path);
       const response=await imageKit.upload({
        file:fileBuffer,
        fileName:imageFile.originalname,
        folder:'/cars'
       })
       // URL with basic transformations
var optimizedImageUrl=imageKit.url({
    path:response.filePath,

  transformation: [
    {
     width:'1280'
    },//Width resizing
    {quality:'auto'},//Auto compression
    {format:'webp'}//Convert to modern format
  ],
});
const image=optimizedImageUrl;
await Car.create({
  ...car,
  owner: _id,
  image,
  coordinates: car.coordinates,
  address: car.address,
  city: car.city   // 🔥 ADD THIS
});

res.json({success:true,message:"Car Added"})

    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

//API to List Owner Cars
export const getOwnerCars =async(req,res)=>{
    try{
        const {_id}=req.user;
        const cars=await Car.find({owner:_id})
         res.json({success:true,cars})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}

//API to Toggle Car Availability
export const toggleCarAvailability =async(req,res)=>{
    try{
        const {_id}=req.user;
        const {carId}=req.body
        const car=await Car.findById(carId)

        //Checking is car belongs to the user
        if(car.owner.toString()!==_id.toString()){
            return res.json({success:false,message:"Unauthorized"})
        }
        car.isAvailable=!car.isAvailable;
        await car.save()


        res.json({success:true,message:"Availability Toggled",car})

    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

//Api to delete a car
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);

    // 🔐 Ownership check
    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // 🔥 STEP 1: Check if car has active bookings
    const existingBooking = await Booking.findOne({
      car: carId,
      status: { $in: ["pending", "confirmed"] }
    });

    // ❌ BLOCK DELETE
    if (existingBooking) {
      return res.json({
        success: false,
        message: "Cannot delete car. It is already booked."
      });
    }

    // ✅ SAFE DELETE (your current logic)
    car.owner = null;
    car.isAvailable = false;
    await car.save();

    res.json({
      success: true,
      message: "Car removed successfully"
    });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
//API to get Dashboard Data
export const getDashboardData=async(req,res)=>{
    try{
         const {_id,role}=req.user;
         if(role !=="owner"){
            return res.json({success:false,message:"Unauthorized"});
         }
         const cars=await Car.find({owner:_id})
         const bookings=await Booking.find({owner:_id}).populate('car').sort({createdAt:-1});

         const pendingBookings = await Booking.find({
  owner: _id,
  status: "pending"
});

const completedBookings = await Booking.find({
  owner: _id,
  status: "confirmed"
});

const monthlyRevenue = bookings
  .filter(b => b.paymentStatus === "Paid" && b.refundStatus !== "Refunded")
  .reduce((acc, booking) => acc + (booking.price || 0), 0);
         const dashboardData={
            totalCars:cars.length,
            totalBookings:bookings.length,
            pendingBookings:pendingBookings.length,
            completedBookings:completedBookings.length,
            recentBookings:bookings.slice(0,3),
            monthlyRevenue
         }
         res.json({success:true,dashboardData});
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

//API to update user image
export const updateUserImage=async(req,res)=>{
    try{
        const {_id}=req.user;
         const imageFile=req.file;

       const fileBuffer=fs.readFileSync(imageFile.path);
       const response=await imageKit.upload({
        file:fileBuffer,
        fileName:imageFile.originalname,
        folder:'/users'
        
       })
       //optimization through imagekit URL transformation
       var optimizedImageUrl=imageKit.url({
    path:response.filePath,

  transformation: [
    {
     width:'400'},//Width resizing
    {quality:'auto'},//Auto compression
    {format:'webp'}//Convert to modern format
  ],
});
const image=optimizedImageUrl;
await User.findByIdAndUpdate(_id,{image});

res.json({success:true,message:"Image Updated"})
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}