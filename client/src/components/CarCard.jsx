import React from 'react'
import { assets } from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { FaHeart, FaRegHeart } from "react-icons/fa";
const CarCard = ({ car, wishlist, toggleWishlist }) => {
  const currency = import.meta.env.VITE_CURRENCY ?? '$'
  const imgSrc = car?.image ?? assets?.placeholder_image ?? '/placeholder.png'
  const navigate =useNavigate();

  return (
    // h-full so the card stretches inside a grid item with items-stretch
    <div onClick={()=>{navigate(`/car-details/${car._id}`);scrollTo(0,0)}} className="group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer h-full flex flex-col bg-white">
      {/* IMAGE - fixed height so all cards align */}
      <div className="relative h-48 overflow-hidden">
        {/* ❤️ Wishlist */}
<div
  className="absolute top-4 right-4 z-10 cursor-pointer"
  onClick={(e) => {
    e.stopPropagation();
    toggleWishlist(car._id);
  }}
>
  {wishlist?.some(item => (item._id || item) === car._id) ? (
    <FaHeart
      color="blue"
      size={18}
      className="transition-transform duration-200 hover:scale-125"
    />
  ) : (
    <FaRegHeart
      color="#ffff"
      size={18}
      className="drop-shadow-md transition-transform duration-200 hover:scale-125"
    />
  )}
</div>
{/* 🟢 Availability */}
<div className="absolute top-4 left-4 z-10">
  {car?.isAvailable ? (
    <p className="bg-green-500 text-white text-xs px-2.5 py-1 rounded-full">
      Available
    </p>
  ) : (
    <p className="bg-gray-500 text-white text-xs px-2.5 py-1 rounded-full">
      Booked
    </p>
  )}
</div>
        <img
          src={imgSrc}
          alt={car?.name ?? `${car?.brand} ${car?.model}` ?? 'car image'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-4 left-4 z-10">
  {car?.isAvailable ? (
    <p className="bg-blue-500 text-white text-xs px-2.5 py-1 rounded-full">
      Available
    </p>
  ) : (
    <p className="bg-gray-500 text-white text-xs px-2.5 py-1 rounded-full">
      Booked
    </p>
  )}
</div>

        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
          <span className="font-semibold">
            {currency}
            {car?.pricePerDay}
          </span>
          <span className="text-sm text-white/80">/ day</span>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-medium leading-snug">
            {car?.brand} {car?.model}
          </h3>
          <p className="text-muted-foreground text-sm">
            {car?.category} • {car?.year}
          </p>
        </div>

        {/* ICON ROW */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-gray-600">
          <div className="flex items-center gap-2">
            <img src={assets.users_icon} alt="seats" className="h-4 w-4" />
            <span className="text-sm">{car?.seating_capacity ?? '4'} Seats</span>
          </div>

          <div className="flex items-center gap-2">
            <img src={assets.fuel_icon} alt="fuel type" className="h-4 w-4" />
            <span className="text-sm">{car?.fuel_type ?? 'Petrol'}</span>
          </div>

          <div className="flex items-center gap-2">
            <img src={assets.car_icon} alt="transmission" className="h-4 w-4" />
            <span className="text-sm">{car?.transmission ?? 'Automatic'}</span>
          </div>

          <div className="flex items-center gap-2">
            <img src={assets.location_icon} alt="location" className="h-4 w-4" />
            <span className="text-sm">{car?.location ?? 'Unknown'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarCard
