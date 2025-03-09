import nodemailer from "nodemailer";
import config from "../config/index.js";

export const sendEmail = async (to, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com.",
    port: 587,
    secure: config.NODE_ENV === "production",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "shuyibesiddikif@gmail.com",
      pass: "cqab albs rgrg eibo",
    },
  });

  await transporter.sendMail({
    from: "shuyibesiddikif@gmail.com", 
    to,
    subject: "Reset your password within ten mins!", 
    text: "", 
    html,
  });
};
