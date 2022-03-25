const express = require('express');
const twilio = require('../helpers/twilio');
const twilioConfig = require('../../config/twilio')
const authMiddleware = require('../middlewares/auth')

const Twilio = require('twilio')

const router = express.Router();

//router.use(authMiddleware)


router.get('/whatsapp/help', async (req, res) => {
   
   let text = `
        <br /> <br />
        <p> Para testar o serviço de envio de whatsapp, envie o texto <strong>join comfortable-in</strong> para o numero: <strong>+1 (415) 523-8886</strong>
        para habilitar o recebimento das mensagens de testes. </p>
        <p>Clique para facilitar <a href='https://api.whatsapp.com/send?phone=+14155238886&text=join%20comfortable-in'>https://api.whatsapp.com/send?phone=+14155238886&text=join%20comfortable-in</a> </p>
        <p> Envie um POST para <strong> /send/whatsapp </strong> com o body <strong> { to: '', text: '' } </strong> </p>
        <p> O padão do campo <string> to </string> é +558183643267 sem o 9 depois do DDD. </p>
        <br /> <br />

        <p> 
            <h4> Teste - rode isso no terminal </h4> 
            curl --location --request POST "https://6d8a-45-235-92-130.ngrok.io/send/whatsapp" \\ <br/>
                --header "Content-Type: application/x-www-form-urlencoded" \\ <br/>
                --data-urlencode "to=+558183643267" \\ <br/>
                --data-urlencode "text=mensagem a ser enviada" <br/>
        </p>
   `;
    res.send(text)    
} )


router.post('/whatsapp', async (req, res) => {
    const { to, text } = req.body;
    if(!to)
        res.json({error: 'Campo TO deve ser enviado'})
    if(!text)
        res.json({error: 'Campo TEXT deve ser enviado'})
    
    const message = await twilio.sendWhatsAppMessage({ to, text })
    
    if(message.code === 21211) message.textError = "Invalid 'To' Phone Number"
    if(message.code === 21619) message.textError = "A text message body or media urls must be specified."

    res.json(message)    
} )


module.exports = app => app.use('/send', router)