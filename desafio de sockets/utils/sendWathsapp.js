const logger = require('../config/winston');

const accountSid = 'ACa3358f5965962ce0693aa48ea0323f43'; 

const authToken = '31ee56b19cad4e7ebc0fd55d3834b9c6'; 
const client = require('twilio')(accountSid, authToken); 
 


const sendWhatsapp=async (body)=>{
    try {
       await client.messages 
      .create({ 
         body: body,
         from: 'whatsapp:+14155238886',       
         to: 'whatsapp:+5492281464044' 
       }) 
        logger.info('se envio el whatsapp')
    } catch (error) {
        logger.error(error)
    }
}

module.exports= sendWhatsapp;
