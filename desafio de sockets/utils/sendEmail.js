const nodemailer = require('nodemailer');
const logger = require('../config/winston');


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
        logger.info(info)
        
     } catch (error) {
        logger.error(error)
     }
     
}

module.exports = sendEmail;
