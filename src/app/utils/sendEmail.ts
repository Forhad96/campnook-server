import nodemailer from 'nodemailer';
import config from '../config';
export const sendEmail = async (to:string,html:string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === "production", // Use `true` for port 465, `false` for all other ports
    auth: {
      user: 'forhadairdrop@gmail.com',
      pass: 'junx cafr olfi iyyh',
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: 'forhadairdrop@gmail.com', // sender address
    to: 'forhad3g55@gmail.com', // list of receivers
    subject: 'Password reset link expired within 10 minutes?', // Subject line
    text: 'Password change url', // plain text body
    html,
  });
};
