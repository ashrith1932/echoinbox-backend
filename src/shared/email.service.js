import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Assuming logger is not available in shared, we can use console or simple logs
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export class EmailService {
  static async sendOtpEmail(to, otp) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || process.env.SMTP_USER.includes('your_gmail')) {
      console.warn(`[EmailService] SMTP not configured. Skipping email to ${to}. OTP is: ${otp}`);
      return;
    }

    const mailOptions = {
      from: `"EchoInbox" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Your EchoInbox OTP Code',
      text: `Your OTP code is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>EchoInbox Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
          <p>It will expire in 10 minutes. Do not share this code with anyone.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`[EmailService] OTP email sent to ${to}`);
    } catch (error) {
      console.error(`[EmailService] Failed to send email to ${to}: ${error.message}`);
      throw new Error('Failed to send verification email');
    }
  }
}
