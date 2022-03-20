const bcrypt = require('bcryptjs');
const express = require('express')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')

const authConfig = require('../../config/auth')

const User = require('../models/user')


const router = express.Router();

function generateToken(params = {}){
    return jwt.sign( params, authConfig.secret, {
        expiresIn: 86400
    } );
}


router.post('/register', async (req, res) => {
    try {
        const {email} = req.body;
        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'User already Exists'})

        const user = await User.create(req.body)

        user.password = undefined;

        return res.send({
            user, 
            token: generateToken({ id: user.id })
         })
         
    } catch (error) {
        console.log(error)
        return res.status(400).send( { error: 'Registration fail' } )
    }
})


router.post('/authentication', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne( { email} ).select('+password');

    if(!user)
        res.status('400').send( { error: 'User not found'} );

    if(!await bcrypt.compare(password, user.password))
        res.status(400).send({ error: 'Invalid password' })
    user.password = undefined;

    
    res.send( {
        user, 
        token: generateToken({ id: user.id })
     } )
})


router.post('/forgout_password', async (req,res)  => {
    const { email } = req.body;

    try {
        const user = await User.findOne( { email } )

        if(!user) 
            return res.status('400').send( { error: 'User not found'} );

        const token = crypto.randomBytes(20).toString('hex')

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        } )

        mailer.sendMail( {
            to: email,
            from: 'geriofilho@gmail.com',
            template: 'auth/forgot_password',
            context: { token }
        }, (err) => {
            if(err) {
                console.log()
                return res.status(400).send('cannot send forgot password email ')
            } 
            return res.send();
        })
        
    } catch (error) {
        res.status(400).send({ error: 'Erro on forgot password, try again' })
    }
} )

router.post('/reset_passwort', async (req,res) => {
    const { email, token, password } = req.body;

    try {
        const user = await User.findOne( { email } )
            .select('+passwordResetToken passwordResetExpires');
        if(!user)
            res.status('400').send( { error: 'User not found'} );
        if( token !== user.passwordResetToken )
            res.status('400').send( { error: 'Token invalido'} );
        
        const now = new Date();
        if( now !== user.passwordResetExpires )
            res.status('400').send( { error: 'Token expired, generate a new one'} );

        user.password = password
        user.save();

        res.send();

    } catch (error) {
        res.status(400).send( { error: 'Cannot reset password, try again' } )
    }
})


module.exports = app => app.use('/auth', router)