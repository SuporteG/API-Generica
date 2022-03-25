const Twilio = require('twilio')
const twilioConfig = require('../../config/twilio')

module.exports = ({
    sendWhatsAppMessage: async (body) => {
        const client = new Twilio(twilioConfig.whatsapp.accountSid, twilioConfig.whatsapp.authToken);
  
        return await client.messages 
            .create({
                from: twilioConfig.whatsapp.from,
                body: `${body.text}`,
                to: `whatsapp:${body.to}`
            }).catch(error => error);

    }
})
