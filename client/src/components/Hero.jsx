
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import {motion} from 'motion/react'
import React, { useState, useRef, useEffect } from 'react'
const Hero = () => {
   const [suggestions, setSuggestions] = useState([]);
  const [pickupLocation,setPickupLocation]=useState('')
  const {pickupDate,setPickupDate,returnDate,setReturnDate,navigate}= useAppContext()
  const dropdownRef = useRef();
  const handleLocationSearch = async (value) => {
  setPickupLocation(value);

  if (value.length < 3) {
    setSuggestions([]);
    return;
  }
 


  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${value}&format=json`
    );
    const data = await res.json();
    setSuggestions(data);
  } catch (err) {
    console.log(err);
  }
};
useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
 const selectLocation = (item) => {
  setPickupLocation(item.display_name);
  setSuggestions([]);

  // optional (future use)
  console.log("Lat:", item.lat, "Lng:", item.lon);
};
  const handleSearch = (e) => {

  e.preventDefault();

  if (!pickupLocation || !pickupDate || !returnDate) {
    alert("Please fill all fields");
    return;
  }
  

  if (new Date(returnDate) < new Date(pickupDate)) {
    alert("Return date must be after pickup date");
    return;
  }

  navigate('/cars?pickupLocation=' + pickupLocation + '&pickupDate=' + pickupDate + '&returnDate=' + returnDate);
  setTimeout(() => {
  setPickupLocation('');
  setPickupDate('');
  setReturnDate('');
  setSuggestions([]);
}, 300);}

  return (
    <motion.div 
    initial={{opacity:0}}
    animate={{opacity:1}}
    transition={{duration:0.8}}
    className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center'>
        <motion.h1 initial={{y:50,opacity:0}}
        animate={{y:0,opacity:1}}
        transition={{duration:0.8,delay:0.2}} className='text-4xl md:text-5xl font-semibold'>Luxury car on Rent</motion.h1>
      <motion.form 
      initial={{scale:0.95,opacity:0,y:50}}
      animate={{scale:1,opacity:1,y:0}}
      transition={{duration:0.6,delay:0.4}}
      onSubmit={handleSearch} className='flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 md:p-6 rounded-xl md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]'>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 md:ml-8">
      <div ref={dropdownRef} className='flex flex-col items-start gap-1 relative w-full md:w-auto'>
     <label htmlFor="pickup-location" >
    Pickup Location
  </label>
  <input
  type="text"
  placeholder="Search location..."
  value={pickupLocation}
  onChange={(e) => handleLocationSearch(e.target.value)}
  className="w-full md:w-56 h-8 px-2 border border-gray-300 rounded-md text-sm outline-none"
  required
/>
 

   {/* Suggestions */}
  {suggestions.length > 0 && (
   <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md max-h-52 overflow-y-auto z-50 border border-gray-200">
      {suggestions.map((item, index) => (
        <div
          key={index}
          onClick={() => selectLocation(item)}
         className="p-2 hover:bg-gray-100 cursor-pointer text-sm break-words"
        >
          {item.display_name}
        </div>
      ))}
    </div>
  )}

</div>
          <div className="flex w-full gap-2 md:gap-6">
  
  {/* Pickup Date */}
  <div className='flex flex-col items-start gap-1 w-1/2'>
    <label htmlFor="pickup-date">Pick-up Date</label>
    <input
      value={pickupDate}
      onChange={e=>setPickupDate(e.target.value)}
      type="date"
      id="pickup-date"
      min={new Date().toISOString().split('T')[0]}
      className="text-sm text-gray-500 border border-gray-300 rounded-md px-2 py-1 w-full bg-white focus:ring-2 focus:ring-primary outline-none"
      required
    />
  </div>

  {/* Return Date */}
  <div className='flex flex-col items-start gap-1 w-1/2'>
    <label htmlFor="return-date">Return Date</label>
    <input
      value={returnDate}
      onChange={e=>setReturnDate(e.target.value)}
      type="date"
      id="return-date"
      className="text-sm text-gray-500 border border-gray-300 rounded-md px-2 py-1 w-full bg-white focus:ring-2 focus:ring-primary outline-none"
      required
    />
  </div>

</div>
        </div>
        <motion.button 
        whileHover={{scale:1.05}}
        whileTap={{scale:0.95}}
        className='flex items-center justify-center gap-1  px-9 py-3 max-sm:mt-4 md:ml-10 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer'>
            <img src={assets.search_icon} alt="search" className="brightness-300"/>

            Search</motion.button>

      </motion.form>

      <motion.img 
      initial={{y:100,opacity:0}}
      animate={{y:0,opacity:1}}
      transition={{duration:0.8,delay:0.6}}
      src={assets.main_car} alt="car" className="max-h-80"/>
      
    </motion.div>
  )
}

export default Hero
