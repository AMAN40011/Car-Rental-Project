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
// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    user.resetToken = otp;
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(email, "Reset Password OTP", `Your OTP is ${otp}`);

    res.json({ success: true, message: "OTP sent" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};