import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your.email@gmail.com",
    pass: "your_email_password_or_app_password",
  },
});

export const sendOTPEmail = async ({ to, otp }) => {
  try {
    const mailOptions = {
      from: "your.email@gmail.com",
      to,
      subject: "Your Saraha OTP",
      text: `Your OTP code is: ${otp}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};
