const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const AcctModel = require('../models/account');
const cookieParser = require('cookie-parser');

router.use(cookieParser('jaws1576'));

router.get('/', (req, res) => {
    //if user is logged in already
    if(req.cookies.loggedIn) {
        AcctModel.find({_id: req.signedCookies.userId}, (err, obj) => {
            Blog.find().sort({ createdAt: -1})
            .then((data) => {
                //if account is not found with cookie installed on browser, clear cookies. Happens when user is deleted in mongodb but cookie is still installed on browser (invalid request)
                if(!obj.length) {
                    res.clearCookie('loggedIn');
                    res.clearCookie('userId');
                    res.render('index', {
                        title: 'Bhlogs - Free and Simple Blogging Platform for Everybody',
                        content: data,
                        alert: 'Could not retrieve account details',
                        alertClass: 'alert-danger',
                        user: null 
                    })
                //account connected, renders feed with custom messages (successful request)
                } else {
                    var displayedLinks = []; //all blog links rednered to page
                    var usersLinks = []; //all links user has posted
                    var tags = []; //numbers represent what blog on the page the tag should be appened to (0 being the first blog on the page...)
                    for(i=0; i<data.length; ++i) {
                        displayedLinks.push(data[i]._id);
                    }

                    AcctModel.findById(req.signedCookies.userId, (err, acct) => {
                        if(err) {
                            res.send(err);
                        }
                        for(i=0; i<acct.postedBlogs.length; ++i) {
                            usersLinks.push(acct.postedBlogs[i]);
                        }
                
                        //checks blogs user has posted, compares with blogs displayed on screen
                        for(i=0; i<usersLinks.length; ++i) {
                            for(y=0; y<displayedLinks.length; ++y) {
                                if(usersLinks[i] == displayedLinks[y]) {
                                    tags.push(y);
                                    break;
                                } else {
                                    continue;
                                }
                            }
                        }
                        tags = tags.reverse();

                        res.render('index', {
                            title: 'Bhlogs - Free and Simple Blogging Platform for Everybody',
                            content: data,
                            alert: null,
                            alertClass: null,
                            user: obj[0].username,
                            blogTags: tags
                        })
                    })  
                } 
            })
            .catch((err) => {
                res.send(err);
            })
        })
    //if user is not logged in 
    } else {
        Blog.find().sort({ createdAt: -1})
        .then((data) => {
            res.render('index', {
                title: 'Bhlogs - Free and Simple Blogging Platform for Everybody',
                content: data,
                alert: null,
                alertClass: null,
                user: null,
                blogTags: [] //user is not signed in, cannot display blog tags
            });
        })
        .catch((err) => {
            res.send(err);
        })
    }
})

router.get('/privacy', (req, res) => {
    //if user is logged in
    if(req.cookies.loggedIn) {
        AcctModel.findById(req.signedCookies.userId, (err, acct) => {
            if(err) {
                res.send(err);
            } else {
                res.render('privacy', {
                    title: 'Privacy - Bhlogs',
                    alert: null,
                    alertClass: null,
                    user: acct.username
                })
            }
        })
    //if user is not signed in
    } else {
        res.render('privacy', {
            title: 'Privacy - Bhlogs',
            alert: null,
            alertClass: null,
            user: null
        })
    }    
})

router.get('/about', (req, res) => {
    //if user is logged in
    if(req.cookies.loggedIn) {
        AcctModel.findById(req.signedCookies.userId, (err, acct) => {
            if(err) {
                res.send(err);
            } else {
                res.render('about', {
                    title: 'About - Bhlogs',
                    alert: null,
                    alertClass: null,
                    user: acct.username
                })
            }
        })
    //if user is not signed in
    } else {
        res.render('about', {
            title: 'About - Bhlogs',
            alert: null,
            alertClass: null,
            user: null
        })
    }    
})

//fetch request 
//displays new blogs on page 
router.get('/pages/:pageRequested', (req, res) => {
    var pageRequested = req.params.pageRequested;

    Blog.find()
        .then((data) => {
            var startingBlogIndex = data.length - 1; //always the amount of blogs in db-1
            var multiplier = pageRequested-1;
            var startAt = startingBlogIndex - (10*multiplier);
            var blogsResponse = [];

            var loop = 0;
            //adds blogs to be displayed to blogsResponse array
            if(startAt > 10) {
                for(i=startAt; ; --i) {
                    if(loop == 10) {
                        break;
                    }
                    if(data[i] == undefined) {
                        break
                    } else {
                        blogsResponse.push(data[i]);
                    }
                    loop += 1;
                }
                loop = 0;
            } else {
                for(i=startAt; ; --i) {
                    if(loop == 10) {
                        break;
                    } 
                    if(data[i] == undefined) {
                        break
                    } else {
                        blogsResponse.push(data[i]);
                    }
                    loop += 1;
                }
                loop = 0;
            }
            res.send({page: pageRequested, blogs: blogsResponse})
        })
})

module.exports = router;