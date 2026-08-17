🚗 Car Rental Booking System

A full-stack Car Rental Booking System built using the MERN Stack (MongoDB, Express.js, React.js, Node.js). The platform allows users to browse available cars, view car details, make bookings, manage their bookings, and securely authenticate using JWT. Car owners can manage their vehicles, availability, and bookings through a dedicated owner dashboard.

🌟 Features
👤 User Features
🔐 User registration and login
🔑 JWT-based authentication
📧 OTP-based email verification during registration
🔒 Protected routes
🚗 Browse available rental cars
🔎 View detailed information about individual cars
📅 Select rental dates and book cars
📋 View personal bookings
❌ Manage/cancel bookings
👤 User profile management
🔑 Forgot password functionality
🚘 Owner Features
🏠 Dedicated owner dashboard
➕ Add new cars
🖼️ Upload car images
✏️ Manage listed vehicles
🔄 Toggle car availability
📋 View customer bookings
📊 Manage rental operations
🔒 Security
JWT authentication
Password hashing using bcrypt
Protected backend routes
Role-based authorization
OTP email verification
Environment variables for sensitive credentials
🛠️ Tech Stack
Frontend
React.js
React Router
Axios
Tailwind CSS
React Hot Toast
Lucide React
Vite
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
bcrypt
OTP Generator
Nodemailer / Email Service
Cloud & Other Tools
ImageKit – image upload and management
MongoDB Atlas – cloud database
Git & GitHub – version control
🏗️ Project Architecture
Car-Rental-Project/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CarCard.jsx
│   │   │   ├── FeaturedCars.jsx
│   │   │   ├── Hero.jsx
│   │   │   └── ...
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Cars.jsx
│   │   │   ├── CarDetails.jsx
│   │   │   └── ...
│   │   │
│   │   ├── owner/
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── AddCar.jsx
│   │   │   ├── ManageCars.jsx
│   │   │   └── ...
│   │   │
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── ownerController.js
│   │   ├── bookingController.js
│   │   └── ...
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Car.js
│   │   └── Booking.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── ownerRoutes.js
│   │   └── bookingRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── configs/
│   │   ├── db.js
│   │   └── ...
│   │
│   ├── server.js
│   └── package.json
│
└── README.md

Folder names may differ slightly depending on the final version of your repository.

🔄 Application Workflow
1. User Registration
User enters
Name + Email + Password
        ↓
React sends POST request
        ↓
/api/user/register
        ↓
Backend validates details
        ↓
OTP generated
        ↓
OTP sent to user's email
        ↓
User enters OTP
        ↓
/api/user/verify-otp
        ↓
Account verified
        ↓
JWT token generated
        ↓
User logged in
2. User Login
Email + Password
       ↓
POST /api/user/login
       ↓
Backend validates credentials
       ↓
Password verified using bcrypt
       ↓
JWT generated
       ↓
Token stored on client
       ↓
Authenticated user
3. Car Booking
User
 ↓
Browse Cars
 ↓
Select Car
 ↓
View Car Details
 ↓
Select Rental Dates
 ↓
Book Car
 ↓
Backend validates availability
 ↓
Booking created
 ↓
Booking displayed in user dashboard
4. Owner Workflow
Owner Login
     ↓
Owner Dashboard
     ↓
Add Car
     ↓
Upload Images
     ↓
Car stored in MongoDB
     ↓
Car appears on website
     ↓
Customers can book it
     ↓
Owner manages bookings
🔐 Authentication

The application uses JWT (JSON Web Token) for authentication.

After successful login or OTP verification, the backend generates a token:

User
 ↓
Login / OTP Verification
 ↓
Backend
 ↓
JWT Token
 ↓
Frontend
 ↓
localStorage
 ↓
Authorization Header

Authenticated requests include:

Authorization: Bearer <token>

The backend middleware verifies the token before allowing access to protected routes.

📡 API Endpoints
👤 User APIs
Method	Endpoint	Description
POST	/api/user/register	Register a new user
POST	/api/user/verify-otp	Verify registration OTP
POST	/api/user/resend-otp	Resend OTP
POST	/api/user/login	Login user
POST	/api/user/forgot-password	Request password reset
POST	/api/user/reset-password	Reset password
GET	/api/user/data	Get authenticated user
🚘 Car / Owner APIs
Method	Endpoint	Description
POST	/api/owner/add-car	Add a new car
GET	/api/owner/cars	Get owner's cars
PUT	/api/owner/toggle-car	Change car availability
GET	/api/owner/bookings	Get owner bookings
📅 Booking APIs
Method	Endpoint	Description
POST	/api/booking/create	Create booking
GET	/api/booking/user	Get user bookings
GET	/api/booking/all	Get bookings
PUT	/api/booking/cancel	Cancel booking

Update the endpoint names above if your current repository uses slightly different routes.

🗄️ Database

The project uses MongoDB with Mongoose.

Main collections/models include:

User

Stores:

name
email
password
role
isVerified
Car

Stores information such as:

brand
model
image
year
category
price
location
availability
owner
Booking

Stores:

user
car
pickupDate
returnDate
price
status
📁 Important React Concepts Used

The frontend uses several important React concepts:

useState

Used to manage component state.

Example:

const [email, setEmail] = useState("");
useEffect

Used for side effects such as fetching data and implementing the OTP countdown timer.

useEffect(() => {
    fetchCars();
}, []);
Context API

Global application state is managed using:

AppContext

This allows components to access things such as:

User
Token
Axios
Navigation
Login state

without passing props through multiple components.

📸 Image Management

The project uses ImageKit for car image uploads.

The owner can:

Select car image
      ↓
Upload image
      ↓
ImageKit
      ↓
Image URL
      ↓
MongoDB
      ↓
Car displayed on website

This avoids storing large image files directly inside MongoDB.

⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/AMAN40011/<your-repository-name>.git
cd <your-repository-name>
🖥️ Frontend Setup

Navigate to the client:

cd client

Install dependencies:

npm install

Create a .env file:

VITE_BASE_URL=http://localhost:4001

Start the development server:

npm run dev

Frontend will normally run on:

http://localhost:5173
🖥️ Backend Setup

Open another terminal:

cd server

Install dependencies:

npm install

Create:

.env

Example:

PORT=4001


MONGODB_URI=your_mongodb_connection_string


JWT_SECRET=your_jwt_secret


IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint


EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password

Start the server:

npm run dev

Or, depending on your package configuration:

node server.js
🔑 Environment Variables

Never commit your .env file to GitHub.

Add this to .gitignore:

node_modules/
.env
dist/
🧪 Running the Project Locally

You need two terminals.

Terminal 1 — Backend
cd server
npm install
npm run dev
Terminal 2 — Frontend
cd client
npm install
npm run dev

Then open:

http://localhost:5173
👥 User Roles

The application supports different types of users.

Regular User

Can:

Register
Login
Verify OTP
Browse cars
View car details
Book cars
View bookings
Owner

Can:

Access owner dashboard
Add cars
Upload car images
Manage cars
Change availability
View bookings
🛡️ Security Features

The application implements:

JWT authentication
Password hashing with bcrypt
Protected API routes
Role-based access control
OTP email verification
Environment variables
Backend request validation
Authenticated API requests
💡 Key Learning Outcomes

This project provided practical experience with:

Building a full-stack MERN application
REST API development
React component architecture
React Context API
React Hooks
JWT authentication
OTP verification
Password hashing
MongoDB and Mongoose
CRUD operations
Role-based authorization
Image uploads
Axios API integration
Protected routes
Booking and availability logic
Deployment and environment configuration
🚀 Future Improvements

Possible future enhancements include:

💳 Online payment integration
⭐ Car ratings and reviews
🔔 Real-time booking notifications
📧 Booking confirmation emails
📱 Improved mobile responsiveness
🗺️ Google Maps integration
🔍 Advanced car filtering
📊 Advanced owner analytics
🧾 Downloadable booking invoices
💬 Customer-owner communication
🎯 Project Objective

The primary objective of this project was to build a real-world car rental platform that demonstrates how modern web technologies can be used to create a complete booking system.

The project focuses on:

Authentication → Car Management → Availability → Booking → User & Owner Dashboards

👨‍💻 Developer

Aman Pal

🎓 B.Sc. Information Technology
📍 Mumbai, Maharashtra, India

Connect With Me
LinkedIn: https://www.linkedin.com/in/aman-pal-a89a1b252
GitHub: https://github.com/AMAN40011
⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub.

📌 Project Highlights
MERN Stack
   +
JWT Authentication
   +
OTP Verification
   +
Role-Based Authorization
   +
Car Management
   +
Image Upload
   +
Booking System
   +
Owner Dashboard
   =
Full-Stack Car Rental Platform 🚗
