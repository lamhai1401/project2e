/* add necessary libraries */
const methodOverride= require('method-override');
const errorhandler  = require('errorhandler');
const express       = require('express');
const timeout       = require('connect-timeout');
const path          = require('path');
const logger        = require('morgan');
const lusca         = require('lusca');
const body          = require('body-parser');

/* private middleware libraries */
const haltOnTimedout= require('./middleware/timeout_middleware');
const handler       = require('./foundation/AppResponse');
const ippublic      = require('./middleware/ippublic_middleware');

/* create server using express and socket */
const app           = express();
const server        = require('http').Server(app);
const serversocket  = require('./socket/server');
const server_socket = serversocket(server);

/* Rabbit MQ */
const startConsumer = require('./rabbitMQ/start');
startConsumer(server_socket);
setInterval(function () {
    server_socket.receiveSystemInfo(111)
}, 1000);
/* load enviroment port */
const port = require('config').SERVER.PORT;
app.set('port', port || 3000);

/* add header */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

/* add necessary middleware */
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(timeout('10s'), (err, req, res, next) => {
    if (err) return next(err);
    if (req.timedout) return;
});
app.use(haltOnTimedout);
app.use(body.json());
app.use(body.urlencoded({extended: true}));

// app.use(methodOverride('X-HTTP-Method'));          // Microsoft
// app.use(methodOverride('X-HTTP-Method-Override')); // Google/GData
// app.use(methodOverride('X-Method-Override'));      // IBM 
// app.use(methodOverride('X-Forwarded-For'));        // get public ip
// app.use(methodOverride('X-Forwarded-Port'));

app.use(logger('dev'));
app.use(errorhandler());
// app.use(lusca.xframe('SAMEORIGIN'));
// app.use(lusca.xssProtection(true));

/* add private middleware */
app.use(handler);
app.use(ippublic);

/* add private router */
// const user_router       = require('./route/user_router');
// const account_router    = require('./route/account_router');

/* linked router to app */
// app.use('/api/v1', [
//     user_router,
//     account_router,
// ]);

// app.get("/", (req, res) => {
//     console.log(req.body.ipinfo);
//     res.send(req.body.ipinfo);
// });

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/views/layout/chart.html");
});

/* running server */
server.listen(app.get("port"), () => {
    console.log(("  [Express] App is running at :%d in %s mode"), app.get("port"), app.get("env"));
    console.log("  [Express] Press CTRL-C to stop");
});
