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
│
└── README.md
