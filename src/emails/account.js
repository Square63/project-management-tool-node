const sgEmail = require('@sendgrid/mail')
const sendGridApiKey = process.env.SENDGRID_API_KEY

sgEmail.setApiKey(sendGridApiKey)

const sendResetPasswordToken = (email, name, token) => {
  const url = `${process.env.HOST}:${process.env.PORT}/users/updatePassword?email=${email}&token=${token}`
  try {
    sgEmail.send({
      to: email,
      from: 'zirak.waheed@square63.com',
      subject: 'Reset Password',
      text: url,
      html: `<p>Hello ${name}. Click <a href=${url}>here</a> to reset your password</p>`
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
module.exports = {
  sendResetPasswordToken,
}
