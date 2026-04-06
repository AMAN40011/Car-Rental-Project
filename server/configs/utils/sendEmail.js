import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// ✅ COMMON EMAIL FUNCTION (used for OTP, reset password)
export const sendEmail = async (email, subject, html) => {
  try {
    if (!email) {
      console.log("❌ No email provided");
      throw new Error("Email is undefined");
    }

    console.log("📩 Sending email to:", email);
    console.log("SMTP_USER:", process.env.SMTP_USER);

    const info = await transporter.sendMail({
      from: `"Car Rental" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html
    });

    console.log("✅ Email sent:", info.messageId);

    return true; // ✅ IMPORTANT

  } catch (error) {
    console.error("❌ FULL EMAIL ERROR:", error); // ✅ FULL ERROR

    throw error; // ✅ VERY IMPORTANT (don’t hide error)
  }
};

// ✅ BOOKING EMAIL (optional wrapper)
export const sendBookingEmail = async (email, subject, html) => {
  return await sendEmail(email, subject, html);
};
