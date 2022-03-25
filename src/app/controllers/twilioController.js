const express = require('express');

const Twilio = require('twilio')
const twilioConfig = require('../../config/twilio')

//const authMiddleware = require('../middlewares/auth')

const router = express.Router();

//router.use(authMiddleware)

router.get('/createroom', (req, res) => {
    const client = new Twilio(twilioConfig.whatsapp.accountSid, twilioConfig.whatsapp.authToken);
  
    console.log(client)
    client.video.rooms.create({uniqueName: 'DailyStandup'})
                  .then(room =>  res.json({ room}) )
} )


router.get('/getroom', (req, res) => {
    const client = new Twilio(twilioConfig.whatsapp.accountSid, twilioConfig.whatsapp.authToken);
  
    console.log(client)

    client.video.rooms('DailyStandup')
        .fetch()
        .then(room => res.json( {room} ) );
} )

router.get('/createToken/:sid', (req,res)=>{
    const { sid } = req.params;
    const AccessToken = require('twilio').jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;
    
//     ACCOUNT_SID="AC95e5af2159c7d0993d7b6bfcc07e51f8"
// AUTH_TOKEN="6230af1cc43926a4e918664d49248b16"
// API_KEY="SK8584d2adcd51ea0e54a512383bea7f7a"
// API_SECRET="rZYk4spHF52nemIu9K3SRgGVny2IGjyG"


        // Used when generating any kind of tokens
        // To set up environmental variables, see http://twil.io/secure
        const twilioAccountSid = twilioConfig.whatsapp.accountSid;
        const twilioApiKey = "SK8584d2adcd51ea0e54a512383bea7f7a";
        const twilioApiSecret = "rZYk4spHF52nemIu9K3SRgGVny2IGjyG";
        
        const identity = 'user';
        
        // Create Video Grant
        const videoGrant = new VideoGrant({
            room: sid,
        });
        
        // Create an access token which we will sign and return to the client,
        // containing the grant we just created
        const token = new AccessToken(
        twilioAccountSid,
        twilioApiKey,
        twilioApiSecret,
        {identity: identity}
        );
        token.addGrant(videoGrant);
        
        // Serialize the token to a JWT string
        console.log(token.toJwt());

        res.json( {token: token.toJwt()} )
})


router.get('/createPlayerStreamer', (req,res)=>{
    const client = new Twilio(twilioConfig.whatsapp.accountSid, twilioConfig.whatsapp.authToken);

    client.media.playerStreamer
        .create()
        .then(player_streamer => res.json({player_streamer}));

})

router.get('/close/:sid', (req,res)=>{
    const { sid } = req.params;

    const client = new Twilio(twilioConfig.whatsapp.accountSid, twilioConfig.whatsapp.authToken);

    

    client.media.mediaProcessor(sid)
                .update({status: 'ended'})
                .then(media_processor => res.json({media_processor} ) );

})


module.exports = app => app.use('/twilio', router)