import nodemailer from 'nodemailer'

export const EmailService = async(recipient: string, subject: string, message: string) => {
  const testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: '"Errand 👻" <thoraf20@gmail.com>', // sender address
    to: `${recipient}`, // list of receivers
    subject: `${subject}`, // Subject line
    text: `${message}`, // plain text body
    html: `<b>${message}</b>`, // html body
  });
}