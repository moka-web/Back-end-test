const nodemailer = require('nodemailer');


const sendEmail = async (to , subject , content) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
         port: 587,
         auth: {
             user: 'mokajua@gmail.com',
             pass: 'gfjywtkiadvxwyrw'
         },
         tls: {
            rejectUnauthorized: false
        }
     });
    try {
        const mailOptions = {
            from: 'mokajua@gmail.com',
            to: to,
            subject: subject,
            html:`<div>${content}</div>`,
         }

        const info = await transporter.sendMail(mailOptions)
        console.log({mando:info})
     } catch (error) {
        console.log({error})
     }
     
}

module.exports = sendEmail;
