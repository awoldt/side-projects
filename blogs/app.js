const express = require('express');
const mongoose = require('mongoose');
const app = express();
const rootRoute = require('./routes/rootRoute');
const loginRoute = require('./routes/loginRoute');
const acctRoute = require('./routes/accountRoute');
const blogRoute = require('./routes/blogRoutes');
const bodyParser = require('body-parser');

//DEPRECIATED
//MONGO DATABSE NO LONGER EXISTS

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(rootRoute);
app.use(loginRoute);
app.use(acctRoute);
app.use(blogRoute);

app.get('/sitemap.xml', (req, res) => {
    res.sendFile(__dirname + '/sitemap.xml', (err) => {
        if(err) {
            res.send(err);
        }
    })
})

app.use((req, res) => {
    res.status(404);
    res.render('404', {title: 'Page not found', url: req.url})
})

