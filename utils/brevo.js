import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function sendEmail(to, subject, html) {
  try {
    await axios.post("https://api.brevo.com/v3/smtp/email", {
      sender: { name: process.env.SENDER_NAME, email: process.env.SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }, {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json"
      }
    });
    console.log(`📧 Wysłano e-mail do ${to}`);
  } catch (error) {
    console.error("❌ Błąd wysyłania e-maila:", error.response?.data || error.message);
  }
}
