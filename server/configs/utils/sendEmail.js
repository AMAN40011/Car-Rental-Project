import axios from "axios";

export const sendEmail = async (email, subject, html) => {
  try {
    console.log("📩 Sending email to:", email);

    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Car Rental",
          email: process.env.SENDER_EMAIL,
        },
        to: [{ email }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent via API");

    return true;

  } catch (error) {
    console.error("❌ API EMAIL ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// wrapper (keep same)
export const sendBookingEmail = async (email, subject, html) => {
  return await sendEmail(email, subject, html);
};
export const sendBookingConfirmationEmail = async (userEmail, booking) => {
  try {
    const subject = "🚗 Booking Confirmed - Car Rental";

    const html = `
    <div style="background:#121212; padding:20px; font-family:Arial, sans-serif; color:white;">
      
      <div style="max-width:600px; margin:auto; background:#1e1e1e; border-radius:12px; overflow:hidden;">
        
        <!-- Header -->
        <div style="padding:20px; text-align:center; border-bottom:1px solid #333;">
          <h2 style="margin:0;">🚗 Booking Confirmed</h2>
          <p style="margin:5px 0; color:#bbb;">Your ride is ready!</p>
        </div>

        <!-- Car Image -->
        <img src="${booking.car.image}" 
             alt="Car Image"
             style="width:100%; height:250px; object-fit:cover;" />

        <!-- Content -->
        <div style="padding:20px;">
          
          <h3 style="margin-bottom:10px;">${booking.car.model}</h3>

          <p>📍 <b>Location:</b> ${booking.car.location}</p>
          <p>🚘 <b>Model:</b> ${booking.car.model}</p>
          <p>💵 <b>Price/Day:</b> ₹${booking.car.pricePerDay}</p>

          <hr style="border:0.5px solid #333; margin:15px 0;" />

          <h3>📅 Booking Details</h3>
          <p>📅 <b>Pickup:</b> ${new Date(booking.pickupDate).toDateString()}</p>
          <p>📅 <b>Return:</b> ${new Date(booking.returnDate).toDateString()}</p>
          <p>💰 <b>Total Price:</b> ₹${booking.price}</p>

          <hr style="border:0.5px solid #333; margin:15px 0;" />

          <h3>👤 User Details</h3>
          <p><b>Name:</b> ${booking.user.name}</p>
          <p><b>Email:</b> ${booking.user.email}</p>

          <!-- Status -->
          <div style="margin-top:15px; padding:12px; background:#2e7d32; text-align:center; border-radius:8px;">
            ✔ Booking Confirmed
          </div>

          <!-- Button -->
          <div style="text-align:center; margin-top:20px;">
            <a href="https://your-frontend.vercel.app/my-bookings"
               style="background:#2d89ef; color:white; padding:10px 20px; text-decoration:none; border-radius:6px; display:inline-block;">
               View Booking
            </a>
          </div>

          <p style="margin-top:20px; font-size:13px; color:#aaa;">
            Thank you for choosing our service. Have a safe and happy journey 🚀
          </p>

        </div>

        <!-- Footer -->
        <div style="background:#111; padding:10px; text-align:center; font-size:12px; color:#777;">
          © 2026 Car Rental System
        </div>

      </div>

    </div>
    `;

    // ✅ Use your existing function (no change)
    await sendEmail(userEmail, subject, html);

    console.log("✅ Booking confirmation email sent");

  } catch (error) {
    console.error("❌ Booking Email Error:", error.message);
  }
};