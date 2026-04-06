import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// ✅ COMMON EMAIL FUNCTION (used for OTP, reset password)
export const sendEmail = async (email, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Car Rental" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.log("❌ EMAIL ERROR:", error.message);
  }
};

// ✅ BOOKING EMAIL (optional wrapper)
export const sendBookingEmail = async (email, subject, html) => {
  return sendEmail(email, subject, html);
};