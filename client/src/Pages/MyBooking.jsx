import React,{useState,useEffect} from 'react'
import {assets, } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import {motion} from 'motion/react'
import { useNavigate } from "react-router-dom";
const MyBooking = () => {
  const {axios,user,currency}=useAppContext()
   const navigate = useNavigate();
  const [bookings,setBookings]=useState([])
  
  const fetchMyBookings=async()=>{
    try{
           const {data}=await axios.get('/api/bookings/user')
           if(data.success){
            setBookings(data.bookings)
           }else{
            toast.error(data.message)
           }
    }catch(error){
           toast.error(error.message)
    }
  }
  useEffect(()=>{
     
   user &&  fetchMyBookings()
  },[user])
  return (
    <motion.div
     initial={{opacity:0,y:30}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.6}} 
    className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>
      <Title title='My Bookings' subTitle='View and manage your all car bookings' align='left'/>
      <div>
        {bookings.map((booking,index)=>(
          <motion.div
           initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{delay:index*0.1,duration:0.4}} 
          key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>
           {/*Car Image + Info */}
           <div className='md:col-span-1'>
           <div className='rounded-md overflow-hidden mb-3'>
             <img src={booking.car.image} alt='' className='w-full h-auto aspect-video object-cover'/>
           </div>
           <p className='text-lg font-medium mt-2'>{booking.car.brand}{booking.car.model}</p>
           <p className=''>{booking.car.year} ● {booking.car.category} ● {booking.car.location}</p>
           </div>

           {/*Booking Info */}
           <div className='md:col-span-2'>
            <div className='flex items-center gap-2'>
            <div className="flex items-center gap-2">

  {/* Payment Status */}
  <p
    className={`px-3 py-1 text-xs rounded-full ${
      booking.paymentStatus === "Paid"
        ? "bg-blue-400/15 text-blue-600"
        : "bg-yellow-400/15 text-yellow-600"
    }`}
  >
    {booking.paymentStatus === "Paid"
      ? "Payment Completed"
      : "Payment Pending"}
  </p>

  {/* Owner Approval Status */}
  <p
  className={`px-3 py-1 text-xs rounded-full ${
    booking.status === "confirmed"
      ? "bg-green-400/15 text-green-600"
      : booking.status === "pending"
      ? "bg-yellow-400/15 text-yellow-600"
      : booking.status === "completed"
      ? "bg-blue-400/15 text-blue-600"
      : "bg-red-400/15 text-red-600"
  }`}
>
  {
    booking.status === "completed"
      ? "Completed"
      : booking.status === "confirmed"
      ? "Confirmed"
      : booking.status === "pending"
      ? "Pending"
      : "Cancelled"
  }
</p>

</div>
              </div>
              <div className='flex item-start gap-2 mt-3'>
                <img src={assets.calendar_icon_colored} alt='' className='w-4 h-4 mt-1'/>
                <div>
                <p className='text-gray-500'>Rental Period</p>
                <p>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</p>
                </div>
              </div>
              <div className='flex item-start gap-2 mt-3'>
                <img src={assets.location_icon_colored} alt='' className='w-4 h-4 mt-1'/>
                <div>
                <p className='text-gray-500'>Pickup Location</p>
                <p>{booking.car.location}</p>
                </div>
              </div>
          </div>
          {/*Price */}
          <div className='md:col-span-1 flex flex-col justify-between gap-6'>
            <div className='text-sm text-gray-500 text-right'>
            <p>Total Price</p>
            <h1 className='text-2xl font-semibold text-primary'>{currency}{booking.price}</h1>
            <p>Booked on {booking.createdAt.split('T')[0]}</p>
            <div className="mt-4 flex flex-col gap-2">

  {booking.paymentStatus === "Pending" && (
    <button
      onClick={() => navigate(`/payment/${booking._id}`)}
      className="bg-primary text-white px-4 py-2 rounded-lg w-full hover:bg-primary-dull"
    >
      Pay Now
    </button>
  )}

  <button
    onClick={() => navigate(`/booking/${booking._id}`)}
    className="bg-primary text-white   border border-gray-300 px-4 py-2 rounded-lg w-full hover:bg-primary-dull"
  >
    View More
  </button>

</div>
            </div>

            </div>
          </motion.div>
          
        ))}
      </div>
    </motion.div>
  )
}

export default MyBooking
