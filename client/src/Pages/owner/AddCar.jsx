import React,{useState,useEffect} from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast';
import SelectLocationMap from "../../components/SelectLocationMap";
import { useRef } from "react";


const AddCar = () => {
  const timerRef = useRef(null);
  const {axios,currency,fetchCars} =useAppContext()
  const [coordinates, setCoordinates] = useState(null);
  const [city, setCity] = useState("");
const [address, setAddress] = useState("");
const [mapCenter, setMapCenter] = useState([19.0760, 72.8777]); // default Mumbai

  const [image,setImage]=useState(null)
  const [car,setCar]=useState({
    brand:'',
    model:'',
    year:0,
    pricePerDay:0,
    category:'',
    transmission:'',
    fuel_type:'',
    seating_capacity:0,
    location:'',
    description:'',
  })
  const handleMapSearch = async (value) => {
  if (value.length < 3) return;

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${value}&format=json`
    );
    const data = await res.json();

    if (data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);

      setMapCenter([lat, lng]);     // move map
      setCoordinates({ lat, lng }); // save location
    }
  } catch (err) {
    console.log(err);
  }
};

let timer;

const debounceSearch = (value) => {
  clearTimeout(timerRef.current);

  timerRef.current = setTimeout(() => {
    handleMapSearch(value);
  }, 800);
};
  useEffect(() => {
  if (city) {
    setCar(prev => ({
      ...prev,
      location: city
    }));
  }
}, [city]);
  const [isLoading,setIsLoading]=useState(false)
 
 const onSubmitHandler = async (e) => {
  e.preventDefault();

  if (!coordinates) {
  toast.error("Please select location on map");
  return;
}

if (!city && !address) {
  toast("Location name not detected, using coordinates");
}

  if (isLoading) return null;

  setIsLoading(true);

  try {
    const formData = new FormData();
    formData.append('image', image);

   formData.append('carData', JSON.stringify({
  ...car,
  location: city || address || `${coordinates.lat},${coordinates.lng}`,
  city: city,   // 🔥 ADD THIS
  coordinates,
  address
}))

    const { data } = await axios.post('/api/owner/add-car', formData);

    if (data.success) {
      toast.success(data.message);

      setImage(null);
      setCoordinates(null);
      setCity("");
      setAddress("");

      await fetchCars();

      setCar({
        brand: '',
        model: '',
        year: 0,
        pricePerDay: 0,
        category: '',
        transmission: '',
        fuel_type: '',
        seating_capacity: 0,
        location: '',
        description: '',
      });

    } else {
      toast.error(data.message);
    }

  } catch (error) {
    toast.error(error.message);
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className='px-4 py-10 md:px-10 flex-1'>
      <Title title="Add New Car" subTitle="Fill in details to list a new car for booking,including pricing,availability,and car specifications."/>
      
      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>
       {/*Car Image */}
       <div className='flex items-center gap-2 w-full'>
        <label htmlFor='car-image'>
          <img src={image ? URL.createObjectURL(image) : assets.upload_icon } alt='' className='h-14 rounded cursor-pointer'/>
          <input type='file' id='car-image' accept='image/*' hidden onChange={e => {
  const f = e?.target?.files;
  if (!f || f.length === 0) return;
  setImage(f[0]);
}} />
        </label>
        <p className='text-sm text-gray-500'>Upload a picture of your car</p>
       </div>
       {/*Car Brand & Model */}
       <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='flex flex-col w-full'>
          <label>
            Brand
          </label>
          <input type='text' placeholder='e.g BMW,Mercedes,Audi....' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.brand} onChange={e=>setCar({...car,brand:e.target.value})}/>
        </div>
        <div className='flex flex-col w-full'>
          <label>
            Model
          </label>
          <input type='text' placeholder='e.g X5,E-Class,M4....' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.model} onChange={e=>setCar({...car,model:e.target.value})}/>
        </div>
        
       </div>
       {/*Car Year,Price,Category */}
       <div className='grid grid-cols-1 sm:grid-cols-2 md-grid-cols-3 gap-6'>
         <div className='flex flex-col w-full'>
          <label>
            Year
          </label>
          <input type='number' placeholder='e.g 2025....' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.year} onChange={e=>setCar({...car,year:Number(e.target.value)})}/>
        </div>
        <div className='flex flex-col w-full'>
          <label>
           Daily Price ({currency})
          </label>
         <input
  type="number"
  placeholder="100"
  required
  className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
  value={car.pricePerDay}
  onChange={e => setCar({
    ...car,
    pricePerDay: e.target.value === "" ? "" : Number(e.target.value)
  })}
/>
        </div>
        <div className='flex flex-col w-full'>
          <label>
          Category
          </label>
          <select onChange={e=> setCar({...car,category:e.target.value})}value={car.category}className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
            <option value=''>Select a category</option>
            <option value='Super Car'>Super Car</option>
            <option value='Sedan'>Sedan</option>
             <option value='SUV'>SUV</option>
              <option value='Van'>Van</option>
          </select>
        </div>
       </div>
       {/* Car Transmission,Fuel Type,Seating Capacity */}
       <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        <div className='flex flex-col w-full'>
          <label>
          Transmission
          </label>
          <select onChange={e=> setCar({...car,transmission:e.target.value})}value={car.transmission}className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
            <option value=''>Select a transmission</option>
            
            <option value='Automatic'>Automatic</option>
             <option value='Manual'>Manual</option>
              <option value='Semi-Automatic'>Semi-Automatic</option>
          </select>
        </div>
         <div className='flex flex-col w-full'>
          <label>
          Fuel Type
          </label>
          <select onChange={e=> setCar({...car,fuel_type:e.target.value})}value={car.fuel_type}className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'>
            <option value=''>Select a fuel type</option>
            <option value='Gas'>Gas</option>
             <option value='Diesel'>Diesel</option>
              <option value='Petrol'>Petrol</option>
                <option value='Electric'>Electric</option>
                  <option value='Hybrid'>Hybrid</option>
          </select>
        </div>
         <div className='flex flex-col w-full'>
          <label>
            Seating Capacity
          </label>
          <input type='number' placeholder='5' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.seating_capacity} onChange={e=>setCar({...car,seating_capacity:Number(e.target.value)})}/>
        </div>
       </div>
       {/* 📍 Car Location */}
<div>
   <label>
            Location 
          </label>
  <input
  type="text"
  placeholder="Search location..."
 onChange={(e) => debounceSearch(e.target.value)}
  className="border px-3 py-2 rounded w-full mb-2"
/>
  <label>Select Car Location (Click on map)</label>

  {/* ✅ MAP HERE */}
 <SelectLocationMap 
  setCoordinates={setCoordinates}
  setCity={setCity}
  setAddress={setAddress}
  mapCenter={mapCenter}   // ✅ ADD THIS
/>

  {/* ✅ SHOW DETECTED CITY */}
  {city && (
    <p className="text-green-600 mt-2">
      City: {city}
    </p>
  )}
  {coordinates && (
  <p className="text-blue-600 mt-2">
    Location selected ✅ ({coordinates.lat.toFixed(3)}, {coordinates.lng.toFixed(3)})
  </p>
)}

  {/* ✅ SHOW FULL ADDRESS */}
  {address && (
    <p className="text-gray-600 text-sm">
      Address: {address}
    </p>
  )}
</div>
       {/*Car Description */}
       <div className='flex flex-col w-full'>
          <label>
           Description
          </label>
          <textarea rows={5}  placeholder='e.g. A luxurious SUV with a specious initerior and a powerful engine.' required className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none' value={car.description} onChange={e=>setCar({...car,description:e.target.value})}></textarea>
        </div>
        <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max'>
          <img src={assets.tick_icon} alt=''/>
         {isLoading ? 'Listing...' : "List Your Car"}
        </button>
      </form>
    </div>
  )
}

export default AddCar
