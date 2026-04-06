import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';


const Login = () => {

const [otp, setOtp] = React.useState("");
const [showOtp, setShowOtp] = React.useState(false);
    const { setShowLogin, axios, navigate, setToken, fetchUser } = useAppContext()
     const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [timer, setTimer] = React.useState(30);

    const onSubmitHandler = async (event) => {
  try {
    event.preventDefault();

    
    if (state === "register") {
        console.log("REGISTER CLICKED"); 
      const { data } = await axios.post('/api/user/register', {
        name,
        email,
        password
      });

      if (data.success) {
  toast.success("OTP sent to email");
  setShowOtp(true);
  setTimer(30); 
}else {
        toast.error(data.message);
      }

      return;
    }

    
    const { data } = await axios.post('/api/user/login', {
      email,
      password
    });

    if (data.success) {
      localStorage.setItem('token', data.token);
setToken(data.token);


axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;


await fetchUser();

navigate('/');
toast.success("Login Successful");
setShowLogin(false);
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    toast.error(error.message);
  }
};
useEffect(() => {
  let interval;

  if (showOtp && timer > 0) {
    interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  }

  return () => clearInterval(interval);
}, [showOtp, timer]);
const verifyOtpHandler = async (e) => {
  e.preventDefault();

  try {
    const { data } = await axios.post('/api/user/verify-otp', {
      email,
      otp
    });

    if (data.success) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
       await fetchUser();
      toast.success("Account verified!");
      navigate('/');
      setShowLogin(false);
    } else {
      toast.error(data.message);
    }

  } catch (error) {
  console.log("FULL ERROR:", error);

  if (error.code === "ECONNABORTED") {
    toast.error("Server is slow, please try again...");
  } else if (error.message === "Network Error") {
    toast.error("Backend not responding (Render sleeping)");
  } else {
    toast.error(error.response?.data?.message || "Something went wrong");
  }
}
};
const resendOtpHandler = async () => {
  if (timer > 0) return;

  try {
    const { data } = await axios.post('/api/user/resend-otp', { email });

    if (data.success) {
      toast.success("OTP resent successfully");
      setTimer(30); // ✅ RESET TIMER
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    toast.error(error.message);
  }
};

  return (
   <div 
  onClick={() => setShowLogin(false)} 
  className='fixed inset-0 z-50 flex items-center justify-center text-sm text-gray-600 bg-black/50 backdrop-blur-sm'
>
        <div onClick={(e) => e.stopPropagation()}>
        <form   onSubmit={showOtp ? verifyOtpHandler : onSubmitHandler}  className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
          <button
  type="button"
  onClick={() => setShowLogin(false)}
  className="absolute top-4 right-4 text-gray-500 text-lg"
>
  ✕
</button>
            <p className="text-2xl font-medium m-auto">
                <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
                
            </p>
            {state === "register" && !showOtp && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}
            {!showOtp && (
  <>
    <div className="w-full">
      <p>Email</p>
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="type here"
        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
        type="email"
        required
      />
    </div>

    <div className="w-full">
      <p>Password</p>
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="type here"
        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
        type="password"
        required
      />
    </div>
   {state === "login" && !showOtp && (
  <p
    onClick={() => {
      setShowLogin(false);
      navigate('/forgot-password');
    }}
    className="text-sm text-primary cursor-pointer text-right mt-1"
  >
    Forgot Password?
  </p>
)}
    
  </>
)}
           {!showOtp && (
  state === "register" ? (
    <p>
      Already have account?{" "}
      <span onClick={() => setState("login")} className="text-primary cursor-pointer">
        click here
      </span>
    </p>
  ) : (
    <p>
      Create an account?{" "}
      <span onClick={() => setState("register")} className="text-primary cursor-pointer">
        click here
      </span>
    </p>
  )
)}
            {showOtp && (
  <div className="w-full">
    <p>Enter OTP</p>
    <input
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      placeholder="Enter 6-digit OTP"
      className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
      required
    />
  </div>
)}
{showOtp && (
  <p className="text-sm text-gray-500">
    Didn’t receive OTP?{" "}
    
    {timer > 0 ? (
      <span className="text-gray-400">
        Resend in {timer}s
      </span>
    ) : (
      <span
        onClick={resendOtpHandler}
        className="text-primary cursor-pointer font-medium"
      >
        Resend OTP
      </span>
    )}
  </p>
)}
           <button className="bg-primary text-white w-full py-2 rounded-md">
  {showOtp ? "Verify OTP" : state === "register" ? "Create Account" : "Login"}
</button>
        </form>
      </div>
    </div>
  )
  

}

export default Login
