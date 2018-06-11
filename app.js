/**
 * Module dependencies.
 */
const express = require('express');
const body = require('body-parser');
const path = require('path');
const logger = require('morgan');
const errorhandler = require('errorhandler');
const routes = require('./routes');
const ipaddress = require('./middleware/ippublic_middleware');
/**
 * Main app.
 */
const app = express();

app.use(body.json());
app.use(body.urlencoded({extended: true}));

app.use(logger('dev'));

/* add header */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

app.use(ipaddress);

/* Static resources */
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/views/layout/chart.html");
});

/* Middleware catch error */
app.use(errorhandler());

module.exports = app;
