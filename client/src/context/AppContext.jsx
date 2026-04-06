import { useContext, createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

window.axios = axios;
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.timeout = 60000;   // ⏳ FIX timeout (VERY IMPORTANT)
  // 🔥 FIX CORS credentials
export const AppContext = createContext();
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {

      const url = error.config?.url || ""; // ✅ SAFE ACCESS

      const publicRoutes = [
        "/api/user/cars",
        "/api/user/data"
      ];

      const isPublic = publicRoutes.some(route =>
        url.includes(route)
      );

      // ✅ Public APIs → silent
      if (isPublic) {
        if (error.code === "ECONNABORTED") {
  toast.error("Server is slow, try again");
}

if (error.message === "Network Error") {
  toast.error("Backend not responding");
}


        return Promise.reject(error);
      }

      // ✅ Prevent multiple toasts spam
      if (!window.__authToastShown) {
        toast.error("Please login to continue");
        window.__authToastShown = true;

        setTimeout(() => {
          window.__authToastShown = false;
        }, 2000);
      }
    }

    return Promise.reject(error);
  }
);
export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // ✅ Fetch logged-in user safely
  const fetchUser = async () => {
  try {
    const { data } = await axios.get("/api/user/data");

    if (data.success) {
      setUser(data.user);
      setIsOwner(data.user.role === "owner");
       setWishlist(data.user.wishlist || []);
    }

  } catch (error) {

    // 🔥 If 401 → DO NOTHING (silent)
    if (error.response?.status === 401) {
      setUser(null);
      setIsOwner(false);
      return;
    }

    // Only log unexpected errors
    console.log("Unexpected error:", error.message);
  }
};


  // Fetch all cars
  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      data.success
        ? setCars(data.cars)
        : toast.error(data.message);
    } catch (error) {
  if (error.response?.status !== 401) {
    toast.error(error.message);
  }
}
  };

 
  // Logout
  const logout = () => {
  localStorage.removeItem("token");
  setToken(null);
  setUser(null);
  setIsOwner(false);
  delete axios.defaults.headers.common["Authorization"];

  toast.success("Logged out successfully");   // ✅ ADD THIS
  navigate("/");                              // ✅ OPTIONAL (better UX)
};

  // Load token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  // Apply token when available
  useEffect(() => {
  const init = async () => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await fetchUser();   // 🔥 FIX HERE
       
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setIsOwner(false);
    }

    await fetchCars();
  };

  init();
}, [token]);

  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setIsOwner,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    fetchCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    wishlist,
setWishlist,

  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
