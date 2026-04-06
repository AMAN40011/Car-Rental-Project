import React, { useState } from "react";
import "leaflet/dist/leaflet.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from './components/Navbar'
import Payment from "./Pages/Payment";
import ForgotPassword from "./Pages/ForgotPassword";
import Home from './Pages/Home';
import CarDetails from './Pages/CarDetails';
import Cars from './Pages/Cars';
import MyBooking from './Pages/MyBooking';
import Footer from "./components/Footer";
import Layout from "./Pages/owner/Layout"
import Dashboard from "./Pages/owner/Dashboard";
import AddCar from "./Pages/owner/AddCar";
import ManageCar from "./Pages/owner/ManageCar";
import ManageBookings from "./Pages/owner/ManageBookings";
import Login from "./components/Login";
import {Toaster} from 'react-hot-toast'
import { useAppContext } from "./context/AppContext";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import OwnerWishlist from "./Pages/owner/OwnerWishlist";
import BookingDetails from "./Pages/BookingDetails"
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
const App=()=>{

  const { showLogin} = useAppContext()
  const isOwnerPath=useLocation().pathname.startsWith('/owner');
  return(
    <>
    
    <Toaster/>
  {showLogin && <Login />}
   {!isOwnerPath && !showLogin && <Navbar />}
   
   <Routes>
     <Route path="/" element={<Home/>}/>
     <Route path="/car-details/:id" element={<CarDetails/>}/>
     <Route path="/cars" element={<Cars/>}/>
   
   <Route path="/my-bookings" element={<MyBooking/>}/>
   <Route path="/payment/:id" element={<Payment/>}/>
  
  <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/booking/:id" element={<BookingDetails />} />
   <Route 
  path='/owner' 
  element={
    <ProtectedRoute requireOwner={true}>
      <Layout/>
    </ProtectedRoute>
  }
>
   <Route index element={<Dashboard/>}/>
   <Route path='add-car' element={<AddCar/>}/>
   <Route path='manage-cars' element={<ManageCar/>}/>
   <Route path='manage-bookings' element={<ManageBookings/>}/>
   <Route path='wishlist' element={<OwnerWishlist/>}/>

   </Route>
   
   </Routes>
   {!isOwnerPath && <Footer/>}
   
    </>
  )
}
export default App