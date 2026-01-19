import { createTransport } from "nodemailer";

const EMAIL_SMTP_HOST = process.env.EMAIL_SMTP_HOST;
const EMAIL_SMTP_PORT = process.env.EMAIL_SMTP_PORT;
const EMAIL_SMTP_USER = process.env.EMAIL_SMTP_USER;
const EMAIL_SMTP_PASSWORD = process.env.EMAIL_SMTP_PASSWORD;

if (
   !EMAIL_SMTP_HOST ||
   !EMAIL_SMTP_PORT ||
   !EMAIL_SMTP_USER ||
   !EMAIL_SMTP_PASSWORD
) {
   throw new Error("Missing SMTP configuration");
}

const transporter = createTransport({
   host: EMAIL_SMTP_HOST,
   port: 587,
   secure: false,
   auth: {
      user: EMAIL_SMTP_USER,
      pass: EMAIL_SMTP_PASSWORD,
   },
});

transporter
   .verify()
   .then(() => {
      console.log("SMTP connection verified");
   })
   .catch((err) => {
      console.error(err);
      throw new Error("SMTP connection failed");
   });

export default transporter;
