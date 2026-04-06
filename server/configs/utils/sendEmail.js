import nodemailer from "nodemailer";

export const sendBookingEmail = async (email, subject, html) => {
  
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const info = await transporter.sendMail({
      from: `"Car Rental" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });

    console.log("✅ Email sent:", info.messageId);

  } catch (error) {
    console.log("❌ EMAIL ERROR:", error.message);
  }
};