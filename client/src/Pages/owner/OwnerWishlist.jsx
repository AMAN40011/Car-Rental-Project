import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const OwnerWishlist = () => {
  const { axios } = useAppContext();
  const [wishlistCars, setWishlistCars] = useState([]);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("/api/user/data", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setWishlistCars(
  (res.data.user.wishlist || []).filter(car => car && car._id)
);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Wishlist 💙</h2>

      {wishlistCars.length === 0 ? (
        <p className="text-gray-500">No cars in wishlist</p>
      ) : (
        <div className="space-y-4">
          {wishlistCars.map((car) => (
            <div
              key={car._id}
              className="border rounded-xl p-4 flex items-center gap-6"
            >
              <img
  src={car?.image || "https://via.placeholder.com/150"}
  alt="car"
  className="w-40 h-28 object-cover rounded"
/>

              <div className="flex-1">
                <h3 className="font-semibold">
                 {car?.brand || "Car"} {car?.model || ""}
                </h3>
                <p className="text-gray-500 text-sm">
                  {car.category} • {car.location}
                </p>
                <p className="text-blue-600 font-semibold">
                  ₹{car.pricePerDay} / day
                </p>
              </div>

             <button
  onClick={() => {
    console.log("FULL CAR:", car);
    console.log("CAR ID:", car?._id);

    if (!car?._id) {
      console.log("❌ ID missing");
      return;
    }

    navigate(`/car-details/${car._id}`);
  }}
  className="relative z-10 bg-blue-600 text-white px-4 py-2 rounded"
>
  View More
</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerWishlist;