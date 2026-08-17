# 🚗 Car Rental Booking System

A full-stack car rental booking platform built using the MERN stack. Users can browse cars, view car details, book vehicles, manage their bookings, and securely authenticate using JWT and OTP verification. Car owners can manage their vehicles, availability, and bookings through a dedicated dashboard.

## ✨ Features

### 👤 User Features

- User registration and login
- JWT-based authentication
- OTP-based email verification
- Forgot password functionality
- Browse available cars
- View detailed car information
- Select pickup and return dates
- Book rental cars
- View booking history
- Manage bookings
- Responsive user interface

### 🚘 Owner Features

- Dedicated owner dashboard
- Add new cars
- Upload car images
- Manage listed cars
- Update car availability
- View customer bookings
- Manage rental vehicles

### 🔐 Security

- JWT authentication
- Password hashing using bcrypt
- Protected API routes
- Role-based authorization
- OTP email verification
- Environment variables for sensitive credentials

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router
- Axios
- Tailwind CSS
- React Hot Toast
- Lucide React
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- OTP Generator

### Other Technologies

- ImageKit - Image storage and management
- MongoDB Atlas - Cloud database
- Git & GitHub - Version control

## 🏗️ Project Structure

```text
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
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── configs/
│   ├── server.js
│   └── package.json


🔄 How the Application Works
User Registration
User enters Name, Email and Password
                ↓
        React sends request
                ↓
        POST /api/user/register
                ↓
        Backend validates data
                ↓
          OTP is generated
                ↓
        OTP sent to email
                ↓
        User enters OTP
                ↓
       POST /api/user/verify-otp
                ↓
        Account is verified
                ↓
          JWT token created
                ↓
            User logged in
User Login
Email + Password
       ↓
POST /api/user/login
       ↓
Backend validates credentials
       ↓
Password verified using bcrypt
       ↓
JWT token generated
       ↓
Token stored on client
       ↓
Authenticated user
Car Booking
Browse Cars
     ↓
Select a Car
     ↓
View Car Details
     ↓
Select Rental Dates
     ↓
Create Booking
     ↓
Backend checks availability
     ↓
Booking created
     ↓
Booking appears in user's bookings
Owner Workflow
Owner Login
     ↓
Owner Dashboard
     ↓
Add Car
     ↓
Upload Car Image
     ↓
Car stored in MongoDB
     ↓
Car displayed on website
     ↓
Customers can book the car
     ↓
Owner manages bookings
🔐 Authentication

The application uses JWT authentication.

After successful login or OTP verification, the backend generates a JWT token.

The frontend stores the token and sends it with authenticated API requests using the Authorization header.

Authorization: Bearer <token>

Protected backend routes verify the JWT before allowing access.

📡 API Endpoints
User APIs
Method	Endpoint	Description
POST	/api/user/register	Register a new user
POST	/api/user/verify-otp	Verify OTP
POST	/api/user/resend-otp	Resend OTP
POST	/api/user/login	Login user
POST	/api/user/forgot-password	Request password reset
POST	/api/user/reset-password	Reset password
GET	/api/user/data	Get authenticated user
Owner APIs
Method	Endpoint	Description
POST	/api/owner/add-car	Add a new car
GET	/api/owner/cars	Get owner's cars
PUT	/api/owner/toggle-car	Change car availability
GET	/api/owner/bookings	Get owner bookings
Booking APIs
Method	Endpoint	Description
POST	/api/booking/create	Create a booking
GET	/api/booking/user	Get user bookings
GET	/api/booking/all	Get bookings
PUT	/api/booking/cancel	Cancel a booking

Note: Update the endpoints above if your current backend uses different route names.

🗄️ Database

MongoDB is used as the primary database with Mongoose for database modeling.

User Model

Typical user information includes:

Name
Email
Password
Role
Verification status
Car Model

Typical car information includes:

Brand
Model
Image
Year
Category
Price
Location
Availability
Owner
Booking Model

Typical booking information includes:

User
Car
Pickup date
Return date
Price
Booking status
🖼️ Image Upload

The application uses ImageKit for car image management.

Owner selects image
        ↓
Image uploaded to ImageKit
        ↓
Image URL generated
        ↓
URL stored with car data
        ↓
Image displayed on website
⚙️ Installation
1. Clone the Repository
git clone https://github.com/AMAN40011/<repository-name>.git
cd <repository-name>
2. Install Frontend Dependencies
cd client
npm install
3. Install Backend Dependencies

Open another terminal:

cd server
npm install
🔑 Environment Variables

Create a .env file inside the server folder.

Example:

PORT=4001


MONGODB_URI=your_mongodb_connection_string


JWT_SECRET=your_jwt_secret


IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint


EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password

For the frontend, create a .env file if required:

VITE_BASE_URL=http://localhost:4001

Never upload your .env file to GitHub.

Add the following to .gitignore:

node_modules/
.env
dist/
▶️ Run the Project
Start Backend
cd server
npm run dev

Or:

node server.js
Start Frontend

Open another terminal:

cd client
npm run dev

The frontend will normally be available at:

http://localhost:5173
🧠 Key Concepts Used

This project demonstrates practical usage of:

React Hooks
React Context API
REST APIs
Axios
JWT Authentication
OTP Verification
Password Hashing
MongoDB
Mongoose
CRUD Operations
Middleware
Protected Routes
Role-Based Authorization
Image Upload
Booking Management
State Management
🚀 Future Improvements
Online payment integration
Car ratings and reviews
Booking confirmation emails
Real-time notifications
Advanced car filtering
Google Maps integration
Owner analytics dashboard
Downloadable booking invoices
Customer-owner messaging
🎯 Project Objective

The goal of this project was to build a real-world car rental platform using the MERN stack while implementing authentication, authorization, vehicle management, image uploads, booking functionality, and separate user and owner workflows.

👨‍💻 Developer

Aman Pal

B.Sc. Information Technology

LinkedIn: https://www.linkedin.com/in/aman-pal-a89a1b252
GitHub: https://github.com/AMAN40011
⭐ Support

If you found this project useful, consider giving the repository a star ⭐



### Important


When you paste it into GitHub:


1. Open your repository.
2. Open `README.md`.
3. Click the **pencil/edit icon**.
4. **Paste the entire content above.**
5. Click **Commit changes**.
6. Open the README normally — GitHub will automatically render the headings, tables, code blocks, emojis, etc.


**Don't paste the ` ```markdown ` from the first line or the final ` ``` ` into the README.** Those are only wrapping the README here so I can show you the raw Markdown correctly.
│
└── README.md
