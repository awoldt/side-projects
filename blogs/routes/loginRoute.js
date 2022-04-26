const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const AcctModel = require('../models/account');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');

router.use(cookieParser('wingsofredemption'));

router.get('/login', (req, res) => {
    //when user requests login page while already logged in 
    if(req.cookies.loggedIn) {
        AcctModel.find({_id: req.signedCookies.userId}, (err, obj) => {
            res.render('redirect', {
                title: 'Login - Bhlogs',
                alert: 'You are already logged in',
                alertClass: 'alert-danger',
                user: null,
                redirect: true,
            });
        })
    //when user requests login page while not already logged in
    } else {
        res.render('login', {
            title: 'Login - Bhlogs',
            alert: null,
            alertClass: null,
            user: null
        });
    }
})

router.post('/login', [check('email').isEmail()], (req, res) => {
    const errors = validationResult(req)
    //if server side detects error in form submission
    if(!errors.isEmpty()) {
        return res.status(422).send('Could not process request <p onclick="window.history.back()" style="color: blue; cursor: pointer">go back</p>')
    //if form submission is valid
    } else {
        AcctModel.find({email: req.body.email, password: req.body.password}, (err, obj) => {
            //if account is not found
            if(!obj.length) {
                res.render('login', {
                    title: 'Login - Bhlogs',
                    alert: 'Account not found',
                    alertClass: 'alert-danger',
                    user: null
                });
            //if account is found
            } else {

                //user has not verified their account yet, alert them to do so
                if(obj[0].verified == false) {
                    res.render('redirect', {
                        title: 'Login - Bhlogs',
                        alert: 'You must verify your account before you start blogging. Check your email for the link',
                        alertClass: 'alert-danger',
                        user: null,
                        redirect: false
                    })
                } else {
                    //creates cookies for user to stay logged in 
                    res.cookie('loggedIn', true, {maxAge: 2592000000});
                    res.cookie('userId', obj[0]._id, {signed: true, httpOnly: true, maxAge: 2592000000}); //signed cookie. uses secret cookie parser to read ^. cannot be accessed by client side scripts
                    
                    res.render('redirect', {
                        title: 'Login - Bhlogs',
                        alert: 'Successfully logged in',
                        alertClass: 'alert-success',
                        user: null,
                        redirect: true
                    })
                }
            }
        })  
    }
})


router.get('/logout', (req, res) => {
    //if user is logged in when they try to logout
    if(req.cookies.loggedIn) {
        res.clearCookie('loggedIn');
        res.clearCookie('userId');

        res.render('redirect', {
            title: 'logging out.....',
            alert: 'Successfully logged out',
            alertClass: 'alert-success',
            user: null,
            redirect: true,
        });
    //if user is not logged in when they try to logout
    } else {
        res.render('redirect', {
            title: 'not logged in',
            alert: 'You are not logged in',
            alertClass: 'alert-danger',
            user: null,
            redirect: false,
        });
    }
})

module.exports = router;