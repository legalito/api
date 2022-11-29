import transporter from '#config/mailer.js'

export function sendWelcomeEmail (user,token){
    if(!user || !token) throw new Error ('user or validation token missing')
    const messageToUser = {
        from: process.env.EMAIL_SENDER,
        to: user.email,
        subject:'welcome to our todo app',
        html:'<h1>Welcome to our appli here your token valid : ${token} </h1>'
    }
    return transporter.sendMail(message)
}
