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