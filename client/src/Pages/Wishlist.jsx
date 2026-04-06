import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
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

      setWishlistCars(res.data.user.wishlist || []);

      setWishlistCars(carDetails);
      window.dispatchEvent(new Event("wishlistUpdated"));

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);
  useEffect(() => {
  window.addEventListener("wishlistUpdated", fetchWishlist);

  return () => {
    window.removeEventListener("wishlistUpdated", fetchWishlist);
  };
}, []);

  return (
  <div className="px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-8">
    <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center md:text-left">
      Your Wishlist
    </h2>

    {wishlistCars.length === 0 ? (
      <p className="text-gray-500 text-center">No cars in wishlist</p>
    ) : (
      <div
  key={car._id}
  className="border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center sm:items-start shadow-sm overflow-hidden"
>
  {/* Image */}
  <div className="w-full sm:w-52 flex-shrink-0">
    <img
      src={car.image}
      alt=""
      className="w-full h-40 sm:h-32 object-cover rounded-lg"
    />
  </div>

  {/* Details */}
  <div className="flex-1 min-w-0 text-center sm:text-left">
    <h3 className="text-lg font-semibold truncate">
      {car.brand} {car.model}
    </h3>

    <p className="text-gray-500 text-sm mt-1 truncate">
      {car.category} • {car.location}
    </p>

    <p className="mt-2 text-gray-700 font-medium">
      ₹{car.pricePerDay} / day
    </p>
  </div>

  {/* Button */}
  <div className="w-full sm:w-auto flex-shrink-0">
    <button
      onClick={async () => {
        try {
          await axios.post(
            `/api/user/wishlist/${car._id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          setWishlistCars((prev) =>
            prev.filter((item) => item._id !== car._id)
          );
        } catch (err) {
          console.log(err);
        }
      }}
      className="text-red-500 border border-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition w-full sm:w-auto"
    >
      Remove ❤️
    </button>
  </div>
</div>
    )}
  </div>
);
};

export default Wishlist;