console.log("Booking route mounted");
import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import "dotenv/config";
import cors from "cors";
import connectDB from './configs/db.js';
import userRouter from "./routes/userRoutes.js"
import ownerRouter from './routes/ownerRoute.js';
import bookingRouter from './routes/bookingRoutes.js';
import reviewRoutes from "./routes/reviewRoutes.js";

//pal617362_db_user123
//Initialize Express App
const app=express()
//Connect DataBase
connectDB()
  .then(() => {
    console.log("DB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB ERROR:", err);
  });
app.use(cors({
  origin: "https://car-rental-project-gules.vercel.app",
  credentials: true
}));
app.use(express.json());

app.get('/',(req,res)=>res.send("Server is running"))
app.use('/api/user',userRouter)
app.use('/api/owner',ownerRouter)
app.use('/api/bookings', bookingRouter)
app.use("/api/reviews", reviewRoutes);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: err.message });
});



