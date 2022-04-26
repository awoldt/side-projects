const express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

const indexRoute = require('./routes/indexRoute');
const tickerPageRoute = require('./routes/tickerPageRoute');


const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//index routes
app.use(indexRoute);

//sitemap
app.get('/sitemap.xml', (req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.

    res.sendFile(path.join(__dirname + '/sitemap.xml'), (err) => {
        if(err) {
            res.send(err);
        }
    })
})

//robots.txt
app.get('/robots.txt', (req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.

    res.sendFile(path.join(__dirname + '/robots.txt'), (err) => {
        if(err) {
            res.send(err);
        }
    })
})

//yandex verify
app.get('/yandex_be72196315b5ba39.html', (req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.

    res.sendFile(path.join(__dirname + '/yandex_be72196315b5ba39.html'), err => {
        if(err) {
            res.send(err);
        }
    })
})

//adsense code 
app.get('/ads.txt', (req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0"); // Proxies.

    res.sendFile(path.join(__dirname + '/ads.txt'), err => {
        if(err) {
            res.send(err);
        }
    })
})

//all ticker page routes
app.use(tickerPageRoute);

const port = 8080;
app.listen(port, () => {
    console.log('Server listening on port ' + port);
})