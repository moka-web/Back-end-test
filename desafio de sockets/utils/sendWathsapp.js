
const accountSid = 'ACa3358f5965962ce0693aa48ea0323f43'; 
const authToken = '8db75861f1941c38a3619e93ee4ef6d1'; 
const client = require('twilio')(accountSid, authToken); 
 


const sendWhatsapp=async (body)=>{
    try {
       await client.messages 
      .create({ 
         body: body,
         from: 'whatsapp:+14155238886',       
         to: 'whatsapp:+542281464044' 
       }) 
      .then(message => console.log(message.sid)) 
      .done();
        
    } catch (error) {
        console.log(error)
    }
}

module.exports= sendWhatsapp;
