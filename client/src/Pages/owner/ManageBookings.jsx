import React, { useEffect,useState } from 'react'
 import toast from "react-hot-toast";
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
const ManageBookings = () => {
  const {currency,axios}= useAppContext()
  const [booking,setBookings] = useState([])
  const fetchOwnerBookings =async()=>{
   try{
      const {data}=await axios.get('/api/bookings/owner')
      data.success ? setBookings(data.bookings) :toast.error(data.message)
   }catch(error){
   toast.error(error.message)
   }
    
  }
  const changeBookingStatus =async(bookingId,status)=>{
   try{
      const {data}=await axios.post('/api/bookings/change-status',{bookingId,status})
      if(data.success){
        toast.success(data.message )
        fetchOwnerBookings()
      }else{
        toast.error(data.message)
      }
      
   }catch(error){
   toast.error(error.message)
   }
    
  }
  
  useEffect(()=>{
    fetchOwnerBookings()
  },[])
  return (
     <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title='Manage Bookings' subTitle='Track all customer bookings,approve or cancel requests,and manage bookings statuses.'/>
      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
      <table className='w-full border-collapse text-left text-sm text-gray-600'>
        <thead className='text-gray-500'>
          <tr>
            <th className='p-3 font-medium'>Car</th>
            <th className='p-3 font-medium max-md:hidden'>Date Range</th>
            <th className='p-3 font-medium'>Total</th>
            <th className='p-3 font-medium max-md:hidden'>Payment</th>
            <th className='p-3 font-medium'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {booking.map((booking,index)=>(
            <tr key={booking._id} className='border-t border-borderColor text-gray-500'>
              <td className='p-3 flex items-center gap-3'>
                <img src={booking.car.image} alt='' className='h-12 w-12 aspect-square rounded-md object-cover'/>
                <p>{booking.car.brand}{booking.car.model}</p>

              </td>
              <td className='p-3 max-md:hidden'>
                {booking.pickupDate.split('T')[0]} to {booking.returnDate.split("T")[0]}

              </td>
              <td className='p-3'>
                {currency}{booking.price}

              </td>
              <td className='p-3 max-md:hidden'>
              <p
  className={`px-3 py-1 rounded-full text-xs ${
    booking.refundStatus === "Refunded"
      ? "bg-red-100 text-red-600"
      : booking.paymentStatus === "Paid"
      ? "bg-green-100 text-green-600"
      : "bg-yellow-100 text-yellow-600"
  }`}
>
  {booking.refundStatus === "Refunded"
    ? "Refunded"
    : booking.paymentStatus === "Paid"
    ? "Paid"
    : "Pending"}
</p>
              </td>
              <td className='p-3'>

  {/* Dropdown only when pending */}
  {booking.status === 'pending' ? (
    <select
      value={booking.status}
      onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
      className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none'
    >
      <option value='pending'>Pending</option>
      <option value='confirmed'>Confirmed</option>
      <option value='cancelled'>Cancelled</option>
    </select>
  ) : (

    /* Proper status badge */
    <span
  className={`px-3 py-1 rounded-full text-xs font-semibold 
  ${
    booking.status === "confirmed"
      ? "bg-green-100 text-green-600"
      : booking.status === "completed"
      ? "bg-blue-100 text-blue-600"
      : booking.status === "cancelled"
      ? "bg-red-100 text-red-600"
      : "bg-yellow-100 text-yellow-600"
  }
  `}
>
  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
</span>

  )}

</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
    </div>
  )
}

export default ManageBookings
