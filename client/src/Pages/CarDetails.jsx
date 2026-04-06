import React, { useEffect, useState } from 'react'
import CarMap from "../components/Map"
import { assets } from '../assets/assets'
import Loader from '../components/Loader'
import { useParams,useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import {motion} from 'motion/react'
const CarDetails = () => {
  const {id} =useParams()
  
  const {cars,axios,pickupDate,user,setPickupDate,returnDate,setReturnDate,setShowLogin}=useAppContext()
  const [sortType, setSortType] = useState("latest");
  
  const [rating, setRating] = useState(0);
 
const [comment, setComment] = useState("");
const [editReviewId, setEditReviewId] = useState(null);
const [reviews, setReviews] = useState([]);

const renderStars = (rating) => {
  return [1,2,3,4,5].map((star) => (
    <span key={star}
     onClick={() => {
      if (rating === star) {
        setRating(star - 1); // 👈 FIX HERE
      } else {
        setRating(star);
      }
    }} className={star <= rating ? "text-yellow-500" : "text-gray-300"}>
      ★
    </span>
  ));
};
  const navigate=useNavigate()
  const [car,setCar]=useState(null)
  const currency=import.meta.env.VITE_CURRENCY
 const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("SUBMIT CLICKED");

  // ✅ DATE VALIDATION START
  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);
  
  if (returnD.getTime() === pickup.getTime()) {
  toast.error("Pickup date and return date must be different");
  return;
}

  if (!pickupDate || !returnDate) {
    toast.error("Please select both dates");
    return;
  }

 if (returnD <= pickup) {
  toast.error("Return date must be after pickup date");
  return;
}
  // ✅ DATE VALIDATION END

 if (!user) {
  toast.error("Please login first");
  setShowLogin(true);   // ✅ OPEN MODAL
  return;
}

  try {
    const { data } = await axios.post('/api/bookings/create', {
      car: id,
      pickupDate,
      returnDate
    });
    
    
    if (data.success) {
      toast.success("Redirecting to Payment...");
      navigate(`/payment/${data.booking._id}`);
    } else{
  toast.error(data.message);
}

  } catch (error) {
  toast.error(error.response?.data?.message || "Something went wrong");
}
};
useEffect(() => {
  if (pickupDate && returnDate) {
    if (new Date(returnDate) < new Date(pickupDate)) {
      setReturnDate(pickupDate);
    }
  }
}, [pickupDate]);

const submitReview = async () => {
  if (!user) {
    toast.error("Please login first");
   if (!user) {
  setShowLogin(true);
  return;
}
    return;
  }

  if (rating === 0) {
    toast.error("Please select a rating ⭐");
    return;
  }

  if (!comment.trim()) {
    toast.error("Please write a review");
    return;
  }

  try {
    // ✏️ UPDATE REVIEW
    if (editReviewId) {
      await axios.put(`/api/reviews/${editReviewId}`, {
        rating,
        comment
      });

      setReviews(prev =>
        prev.map(r =>
          r._id === editReviewId
            ? { ...r, rating, comment }
            : r
        )
      );

      toast.success("Review updated");

      setEditReviewId(null);
      setRating(0);
      setComment("");

      return; // 🔥 VERY IMPORTANT (STOP HERE)
    }

    // ➕ ADD REVIEW
    const res = await axios.post("/api/reviews/add", {
      carId: id,
      rating,
      comment
    });

    const newReview = {
      ...res.data.review,
      user: { name: user.name }
    };

    setReviews(prev => [newReview, ...prev]);

    // update rating
   
    toast.success("Review added");

    setRating(0);
    setComment("");

  } catch (err) {
    toast.error(err.response?.data?.message || "Error");
  }
};
const deleteReview = async (reviewId) => {
  try {
    await axios.delete(`/api/reviews/${reviewId}`);

    setReviews((prev) => prev.filter(r => r._id !== reviewId));

    toast.success("Deleted");

  } catch (err) {
    toast.error("Error deleting");
  }
};
const calculateAverage = () => {
  if (reviews.length === 0) return 0;

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return (total / reviews.length).toFixed(1);
};
  useEffect(()=>{
    setCar(cars.find(car=>car._id===id))
  },[cars,id])
  const displayLocation = 
  car?.location && !car.location.includes(",")
    ? car.location
    : car?.address || "Location selected on map";
   const fetchReviews = async () => {
  try {
    const res = await axios.get(`/api/reviews/${id}`);
   setReviews(res.data.reviews || []);
  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  if (id) fetchReviews();
}, [id]);
const sortedReviews = [...reviews].sort((a, b) => {
  if (sortType === "latest") {
    return new Date(b.createdAt) - new Date(a.createdAt);
  } else {
    return b.rating - a.rating;
  }
});
  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      <button onClick={()=>navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'>
        <img src={assets.arrow_icon} alt='' className='rotate-180 opacity-65'/>Back to all cars
      </button>
      <div className='grid grid-cols-l lg:grid-cols-3 gap-8 lg:gap-12'>
       {/*Left :Car Image & Details */}
       <motion.div
        initial={{opacity:0,y:30}}
      animate={{opacity:1,y:0}}
      transition={{duration:0.6}}
       className='lg:col-span-2'>
        <motion.img 
        initial={{scale:0.98,opacity:0}}
        animate={{scale:1,opacity:1}}
        transition={{duration:0.5}}
        src={car.image} alt='' className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md'/>
        <motion.div 
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{delay:0.2,duration:0.5}}
        className='space-y-6'>
       
        <h1 className='text-3xl font-bold'>{car.brand}{car.model}</h1>
        <p className='text-gray-500 text-lg'>{car.category} * {car.year}</p>
        </motion.div> 
       <hr className='border-borderColor my-6'/>
       <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          {[
            {icon:assets.users_icon,text:`${car.seating_capacity}Seats`},
            {icon:assets.fuel_icon,text:car.fuel_type},
            {icon:assets.car_icon,text:car.transmission},
            {icon:assets.location_icon,text:displayLocation},
          ].map(({icon,text})=>(
            <motion.div
             initial={{opacity:0,y:10}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.4}} 
         key={text} className='flex flex-col items-center bg-light p-4 rounded-lg'>
              <img src={icon}  alt='' className='h-5 mb-2'/>
              {text}


              </motion.div>
          ))}
      
       
    </div>
    <br></br>
     {/*Description */}
     <div>  
  <h1 className='text-xl font-medium mb-3'>Description</h1>
  <p className='text-gray-500'>{car.description}</p> 
</div>
<br></br>
    {/*Features */}
    <div>
     <h1 className='text-xl font-medium mb-3'>Features</h1>
     <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
      {
        ['360 Camera',"Bluetooth","GPS","Heated Seats","Rear View Mirror"].map((item)=>(
          <li key={item} className='flex items-center text-gray-500'>
            <img src={assets.check_icon}className='h-4 mr-2' alt=''/>
            {item}
          </li>
        ))
      }

     </ul>
     
    </div>
    {/* ⭐ Review Section */}
<div className="mt-10">

  <h1 className="text-2xl font-semibold mb-4">
    ⭐ Reviews ({reviews.length})
  </h1>
  <select
  value={sortType}
  onChange={(e) => setSortType(e.target.value)}
  className="border p-2 mb-4"
>
  <option value="latest">Latest</option>
  <option value="highest">Highest Rating</option>
</select>

  {/* Average Rating */}
  <p className="text-lg mb-4">
    ⭐ {calculateAverage()}
  </p>

  {/* Write Review */}
  {user && (
    <div className="mb-6 p-4 border rounded-lg">
      <h2 className="font-medium mb-2">Write a Review</h2>

      {/* Stars */}
      <div className="flex gap-2 mb-3">
  {[1,2,3,4,5].map((star) => (
    <span
      key={star}
      onClick={() => {
        if (rating === star) {
          setRating(star - 1);
        } else {
          setRating(star);
        }
      }}
      className={`cursor-pointer text-xl ${
        star <= rating ? "text-yellow-500" : ""
      }`}
    >
      ★
    </span>
  ))}
</div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        className="border p-2 w-full mb-3"
      />

      <button onClick={submitReview} className="bg-primary text-white px-4 py-2 rounded">
  {editReviewId ? "Update Review" : "Submit Review"}
</button>
      
      
    </div>
  )}

  {/* Reviews List */}
  <div className="space-y-4">
    {sortedReviews.map((r) => (
      <div key={r._id} className="border p-3 rounded-lg">
        <h4 className="font-bold">{r.user?.name}</h4>
       <div className="flex">
  {renderStars(r.rating)}
</div>
        <p className="text-gray-600">{r.comment}</p>
       {user && r.user?.name === user.name && (
  <div className="flex gap-3 mt-2">
    
    <button
      onClick={() => {
        setRating(r.rating);
        setComment(r.comment);
        setEditReviewId(r._id);
      }}
      className="text-blue-500 text-sm"
    >
      Edit
    </button>

    <button
      onClick={() => deleteReview(r._id)}
      className="text-red-500 text-sm"
    >
      Delete
    </button>

  </div>
)}
      </div>
    ))}
  </div>

</div>
    {/* 📍 Car Location Map */}
{/* 📍 Car Location Section */}
<div className="mt-10 bg-white rounded-xl shadow-md p-4">

  <h1 className='text-xl font-semibold mb-3'>
    📍 Car Location
  </h1>

  {/* Map */}
  <div className="rounded-lg overflow-hidden">
    {car?.coordinates ? (
     <CarMap cars={[car]} center={car.coordinates} />
    ) : (
      <p className="text-gray-500">Location not available</p>
    )}
  </div>

  {/* Address */}
  {car.address && (
    <p className="text-gray-600 mt-3 text-sm">
      {car.address}
    </p>
  )}

  {/* Buttons */}
  {car?.coordinates && (
    <div className="flex gap-3 mt-4">

      {/* Open in Maps */}
      <a
        href={`https://www.google.com/maps?q=${car.coordinates.lat},${car.coordinates.lng}`}
        target="_blank"
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
      >
        Open in Maps
      </a>

      {/* Directions */}
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${car.coordinates.lat},${car.coordinates.lng}`}
        target="_blank"
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
      >
        Get Directions
      </a>

    </div>
  )}

</div>
    </motion.div>
  
    
 {/* Right: Booking Form*/}
        <motion.form
         initial={{opacity:0,y:30}}
        animate={{opacity:1,y:0}}
        transition={{delay:0.3,duration:0.4}} 
         onSubmit={handleSubmit} className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'>
        <p className='flex items-center justidy-between text-2xl text-gray-800 font-semibold'>{currency}{car.pricePerDay}<span className='text-base text-gray-400 font-normal'> per day</span></p>
        <hr className='border-borderColor my-6'></hr>
        <div className='flex flex-col gap-2'>
          <label htmlFor='pickup-date'>Pickup Date</label>
          <input value={pickupDate} onChange={(e)=>setPickupDate(e.target.value)} type='date' className='border border-borderColor px-3 py-2 rounded-lg' required id='pickup-date' min={new Date().toISOString().split('T')[0]}/>
        </div>
         <div className='flex flex-col gap-2'>
          <label htmlFor='return-date'>Return Date</label>
          <input
  value={returnDate}
  onChange={(e) => setReturnDate(e.target.value)}
  type='date'
  className='border border-borderColor px-3 py-2 rounded-lg'
  required
  id='return-date'
  min={pickupDate || new Date().toISOString().split('T')[0]}  // ✅🔥 THIS IS CRITICAL FIX
/>
         
        </div>
         <button type='submit'className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer'>Book Now</button>
         <p className='text-center text-sm'>No credit card required to reserve</p>
        </motion.form>
        
        </div>
        </div>
  ):<Loader/>
}

export default CarDetails
