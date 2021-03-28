import 'dotenv/config'
import * as nodemail from 'nodemailer'

// Transport to hook up with an SMTP Api
const transporter = nodemail.createTransport({
  // @ts-ignore - TODO: fix
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

const makeNiceEmail = (content: string) => {
  return `
    <div
      style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    font-size: 20px;
    line-height: 2;
  "
    >
      <h2>Hello There!</h2>
      <p>${content}</p>
      <p>Thanks 🚀, Alex</p>
    </div>
  `
}

// interface MailResponse {
//   message: string
// }

export const sendResetEmail = async (resetToken: string, to: string) => {
  // email the user token
  const info = await transporter.sendMail({
    to,
    from: 'test@example.com', // usually your email
    subject: 'Password Reset Token',
    html: makeNiceEmail(`Your Password Reset Token is here:
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click here to reset!</a>
    `),
  })

  if (process.env.MAIL_USER.includes('ethereal.email')) {
    console.log(`💌 Email sent! Preview at ${nodemail.getTestMessageUrl(info)}`)
  }
}
