const express = require('express');
const AcctModel = require('../models/account');
const router = express.Router();
const Blog = require('../models/blog');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');
const Filter = require('bad-words');
var filter = new Filter();
const nodemailer = require('nodemailer');


router.use(cookieParser('peanutt'));

router.get('/signup', (req, res) => {
    //if user is logged in already
    if(req.cookies.loggedIn) {
        res.render('redirect', {
            title: 'Create an account - Bhlogs',
            alert: 'You must log out before creating a new account',
            alertClass: 'alert-danger',
            user: null,
            redirect: true
        });
    //if user is not logged in 
    } else {
        res.render('createAcct', {
            title: 'Create an account - Bhlogs',
            alert: null,
            alertClass: null,
            user: null
        });
    }
})

router.post('/signup', [check('email').isEmail()], (req, res) => {
    //determines if username is valid, i.e doesnt contain an explicit word
    function validUsername(username) {
        var cleanUsername = filter.clean(username);
        for(i=0; i<cleanUsername.length; ++i) {
            if(cleanUsername[i] == '*') {
               console.log('cannot use username sent in the request');
                return false; 
            } else {
                continue;
            }
        }
        return true;
    }

    const errors = validationResult(req)
    //if server side detects form inputs are not valid
    if(!errors.isEmpty()) {
        return res.status(422).send('Could not process request <p onclick="window.history.back()" style="color: blue; cursor: pointer">go back</p>')
    } else {
        var isUsernameClean = validUsername(req.body.username);
        //username cannot be used, render create page again with alert message
        if(isUsernameClean == false) {
            res.render('createAcct', {
                title: 'Create an account - Bhlog', 
                alert: 'Cannot use that username', 
                alertClass: 'alert-danger', 
                user: null
            })
        //username is clean, next check both email and username to see if they've been used already
        } else {
            AcctModel.find({email: req.body.email}, (err, obj) => {
                //email has not been used, next check username
                if(!obj.length) {
                    AcctModel.find({username: req.body.username.toLowerCase()}, (err, obj2) => {
                        //sets up email transporter
                        var transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: '465',
                            secure: true,
                            auth: {
                                user: 'bhlogsbot@gmail.com',
                                pass: 'Mmra2524!'
                            }
                        })

                        //username has not been used, CREATE NEW ACCOUNT
                        if(!obj2.length) {
                            var x = req.body.username; //username as user entered
                            var newX = x.toLowerCase(); //makes sure all usernames submitted are lowercase
                            req.body.username = newX;
                            const newAcct = new AcctModel(req.body);
                            newAcct.verified = false;
                            newAcct.save();

                            var verifyLink = 'https://bhlogs.com/verify/' + newAcct._id;

                            var mailOptions = {
                                from: 'blogsbot@gmail.com',
                                to: req.body.email,
                                subject: 'Verify Bhlogs account',
                                text: 'Vist this link to activate account ' + verifyLink
                            }

                            transporter.sendMail(mailOptions, (err, data) => {
                                if(err) {
                                    console.log(err);
                                }
                            })
    
                            res.render('redirect', {
                                title: 'Redirecting...',
                                alert: 'Check your email for the verification link',
                                alertClass: 'alert-success',
                                user: req.body.username,
                                redirect: true
                            });
                        //username already in use
                        } else {
                            res.render('createAcct', {
                                title: 'Create an account - Bhlog', 
                                alert: 'Username already taken', 
                                alertClass: 'alert-danger', 
                                user: null
                            });
                        }
                    })
                //if email has already been used
                } else {
                    res.render('createAcct', {
                        title: 'Create an account - Bhlog', 
                        alert: 'Email already in use', 
                        alertClass: 'alert-danger', 
                        user: null
                    });
                }
            })
        }   
    }
})

router.get('/account', (req, res) => {
    //if user is logged in
    if(req.cookies.loggedIn) {
        var id = req.signedCookies.userId;
        AcctModel.findById(id, (err, obj) => {
            var passwordLen = obj.password.length;
            var hiddenPassword = "";
            //changes password to hidden notation (*******)
            for(i=0; i<passwordLen; ++i) {
                hiddenPassword += "*";
            }
            obj.password = hiddenPassword;

            res.render('account', {
                title: 'Account - Bhlogs',
                alert: null,
                alertClass: null,
                user: obj.username,
                fname: obj.fname,
                lname: obj.lname,
                email: obj.email,
                password: obj.password,
                username: obj.username
            })
        })
    //if user is not logged in
    } else {
        res.render('redirect', {
            title: 'not logged in',
            alert: 'You must be logged in to view account',
            alertClass: 'alert-danger',
            user: null,
            redirect: false
        });
    }
})

router.delete('/account', (req, res) => {
    AcctModel.findById(req.signedCookies.userId, (err, acct) => {
        //if user has not posted any blogs, delete just the account
        if(acct.postedBlogs.length == 0) {
            AcctModel.findByIdAndDelete(req.signedCookies.userId, (err, doc) => {
                res.clearCookie('loggedIn');
                res.clearCookie('userId');
                res.json(); 
            })
        //if user has blogs posted, delete blogs then account
        } else {
            //deletes all blogs user has posted    
            for(i=0; i<acct.postedBlogs.length; ++i) {
                Blog.findByIdAndDelete(acct.postedBlogs[i], (err, doc2) => {
                    
                })
            }
            //deletes user's account after blogs have been deleted
            AcctModel.findByIdAndDelete(req.signedCookies.userId, (err, doc) => {
                res.clearCookie('loggedIn');
                res.clearCookie('userId');
                console.log('Account deleted');
                res.json(); 
            })
        }
    })
})


router.get('/account/password-reset', (req, res) => {
    res.send('this feature is still being built');
})

router.get('/user/:user', (req, res) => {
    var x = req.params.user;
    AcctModel.find({username: x}, (err, obj) => {
        //if account is not found
        if(!obj.length) {
            res.render('redirect', {
                title: 'cannot find user',
                alert: 'Cannot find user on this server',
                alertClass: 'alert-danger',
                user: null,
                redirect: false
            });
        //if account is found
        } else {
            var blogTitles = [];
            var blogLinks = [];
            //if user has not posted any blogs yet
            if(obj[0].postedBlogs.length == 0) {
                res.render('user', {
                    title: obj[0].username + "'s Profile - Bhlogs",
                    alert: null,
                    alertClass: null,
                    user: null,
                    blogs: obj[0].postedBlogs,
                    username: obj[0].username,
                    blogTitles: blogTitles,
                    blogLinks: blogLinks
                })
            //if user has posted blogs
            } else {
               for(i=0; i<obj[0].postedBlogs.length; ++i) {
                    Blog.find({_id: obj[0].postedBlogs[i]}, (err, obj2) => {
                        blogTitles.push(obj2[0].title);
                        blogLinks.push(obj2[0]._id);
                        if(blogTitles.length == obj[0].postedBlogs.length) {
                            res.render('user', {
                                title: obj[0].username + "'s Profile - Bhlogs",
                                alert: null,
                                alertClass: null,
                                user: null,
                                blogs: obj[0].postedBlogs,
                                username: obj[0].username,
                                blogTitles: blogTitles,
                                blogLinks: blogLinks
                            })
                        }
                    })
                } 
            }
        }
    })
})

//verifies account so user can log in
router.get('/verify/:id', (req, res) => {
    var id = req.params.id;
    AcctModel.findByIdAndUpdate(id, {$set: {verified: true}}, (err, acct) => {
        if(err) {
            res.status(422).send('Could not process request');
        } else {
            res.cookie('loggedIn', true);
            res.cookie('userId', acct._id, {signed: true, httpOnly: true}); //signed cookie. uses secret cookie parser to read ^. cannot be accessed by client side scripts
            res.render('redirect', {
                title: 'account verified',
                alert: 'Account successfully verified',
                alertClass: 'alert-success',
                user: null,
                redirect: true
            });
        }
    })
})

module.exports = router;
