const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const Blog = require('../models/blog');
const AcctModel = require('../models/account');
const Filter = require('bad-words');
var filter = new Filter();
const { check, validationResult } = require('express-validator');


router.use(cookieParser('alvacado'));

router.get('/create', (req, res) => {
    //if user is logged in while requesting login page
    //*createBlog view can only be rendered if user is logged in
    if(req.cookies.loggedIn) {
        AcctModel.find({_id: req.signedCookies.userId}, (err, obj) => {
            res.render('createBlog', {
                title: 'Create a Blog - Bhlogs', 
                alert: null, 
                alertClass: null, 
                user: obj[0].username, 
                username: obj[0].username
            }); 
        })
    //if user is not logged in
    //redirects to home page
    } else {
        res.render('redirect', {
            title: 'Create a Blog - Bhlogs',
            alert: 'You must be logged in to post blogs',
            alertClass: 'alert-danger',
            user: null,
            redirect: false,
        }); 
    }
})

router.post('/create', [check('body').isLength({min: 1000, max: 9000})], (req, res) => {
    const errors = validationResult(req)
    //if server side detects error in form submission
    if(!errors.isEmpty()) {
        return res.status(422).send('Could not process request <p onclick="window.history.back()" style="color: blue; cursor: pointer">go back</p>');
    } else {
        var x = filter.clean(req.body.body);
        var y = filter.clean(req.body.title);
        req.body.title = y;
        req.body.body = x;
        const blog = new Blog(req.body);
        blog.save((err, obj) => {
            //adds blog to users posted blogs array in db
            AcctModel.findByIdAndUpdate(req.signedCookies.userId, {$push: {'postedBlogs': obj._id}}, (err, obj) => {
                    if(err) {
                        res.send(err);
                    //blog successfully posted along with postedBlogs array updated
                    //return user to home page
                    } else {
                        res.redirect('/');
                    }
                })   
        }) 
    }
})

router.get('/blogs/:id', (req, res) => {
    var id = req.params.id;
    Blog.findById(id)
    .then((result) => {
        //if user is logged in
        if(req.cookies.loggedIn) {
            AcctModel.find({_id: req.signedCookies.userId}, (err, obj) => {
                //loops through all blogs user has posted
                //will be allowed to delete blog if user is signed in AND is the one who posted it
                function canUserDelete() {
                    for(i=0; i<obj[0].postedBlogs.length; ++i) {
                        if(obj[0].postedBlogs[i] == id) {
                            return true;
                        } else {
                            continue;
                        }
                    }
                    return false;
                }
                var userDelete = canUserDelete(); //returns true or false
                res.render('blogDetails', {title: result.title + ' - Bhlogs', alert: null, alertClass: null, user: obj[0].username, blogTitle: result.title, blogAuthor: result.username, blogBody: result.body, canDelete: userDelete, blogId: result._id, exactTime: result.postedOnExact});
            })
        //if user is not logged in
        } else {
            res.render('blogDetails', {title: result.title + ' - Bhlogs', alert: null, alertClass: null, user: null, blogTitle: result.title, blogAuthor: result.username, blogBody: result.body, canDelete: false, exactTime: result.postedOnExact});
        }
    })
    .catch((err) => {
        res.render('redirect', {
            title: 'blog not found :(',
            alert: 'Cannot find blog on this server',
            alertClass: 'alert-danger',
            user: null,
            redirect: false,
        });
    })
})

router.delete('/blogs/:id', (req, res) => {
    var id = req.params.id;
    Blog.findByIdAndDelete(id, (err, obj) => {
        if(err) {
            res.send(err);
        } else {
            console.log('Deleted blog');
            //must remove posted blog id from postedBlogs array in user account
            AcctModel.findByIdAndUpdate(req.signedCookies.userId, {$pull: {'postedBlogs': id}}, (err, obj2) => {
                if(err) {
                    res.send(err);
                } else {
                    res.json();   
                }
            })
        }
    })
})

module.exports = router;