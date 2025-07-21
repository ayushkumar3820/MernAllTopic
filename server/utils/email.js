import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

export const sendEmail = async ({ to, subject, template, context }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const templatePath = path.join(__dirname, "../templates", `${template}.ejs`);
  const html = await ejs.renderFile(templatePath, context);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
