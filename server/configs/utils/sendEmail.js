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

    // 🔥 MOST IMPORTANT LINE
    console.log("✅ BREVO RESPONSE:", res.data);

    return true;

  } catch (error) {
    console.error("❌ BREVO ERROR:", error.response?.data || error.message);
    throw error;
  }
};