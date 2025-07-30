// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: 'smtp-relay.brevo.com"', // Or your SMTP provider
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,      // e.g., yourname@gmail.com
//     pass: process.env.EMAIL_PASS,      // e.g., app password
//   },
// });

// export default async function sendEmail({ to, subject, html }) {
//   await transporter.sendMail({
//     from: `"MyApp" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html,
//   });
// }


// src/app/lib/email.js  (server-only)
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: `"MyApp" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
