const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'));


 require('./app/controllers/authController')(app);
 require('./app/controllers/projectController')(app);
 require('./app/controllers/sendMessageController')(app);
 require('./app/controllers/twilioController')(app);
 

 app.listen(1000)
