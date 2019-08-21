//const express = require('express');
import express from "express";
//const path = require('path');
import path from "path";
//const favicon = require('serve-favicon');
import favicon from "serve-favicon";
//const logger = require('morgan');
import logger from "morgan";
//const cookieParser = require('cookie-parser');
import cookieParser from "cookie-parser";
//const bodyParser = require('body-parser');
import bodyParser from "body-parser";
//const session = require('express-session');
import session from "express-session";
//const passport = require('passport');
import passport from "passport";
//const Auth0Strategy = require('passport-auth0');
import Auth0Strategy from "passport-auth0";
//const flash = require('connect-flash');
import flash from "connect-flash";
// Read environment variables
//const dotenv  = require('dotenv');
import dotenv from "dotenv";
dotenv.load()

// shared mongodb instance
const Mongo = require('./mongo.js');
const sMongo = new Mongo();
// connect to the database
sMongo.connect(process.env.MONGODB_URI);
// TODO: Exit app if unable to connect to the database!

/*
*
*/
const routes = require('./routes/index');
//const user = require('./routes/user');

//AUTHENTICATION SECTION ------------------------------------------------------
// This will configure Passport to use Auth0
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);
passport.use(strategy);
// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
// ----------------------------------------------------------------------------

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, './public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: 'shhhhhhhhh',
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

// Handle auth failure error messages
app.use(function(req, res, next) {
 if (req && req.query && req.query.error) {
   req.flash("error", req.query.error);
 }
 if (req && req.query && req.query.error_description) {
   req.flash("error_description", req.query.error_description);
 }
 next();
});

// Check logged in
app.use(function(req, res, next) {
  res.locals.loggedIn = false;
  if (req.session.passport && typeof req.session.passport.user != 'undefined') {
    res.locals.loggedIn = true;
  }
  next();
});

app.use('/', routes);
//app.use('/user', user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  (err as any).status = 404;
  next(err);
});
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var debug = require('debug')('myexpressapp:server');
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT);
app.set('port', port);

/**
 * Create HTTPS server
 * https://stackoverflow.com/questions/31156884/how-to-use-https-on-node-js-using-express-socket-io
 */
//const fs = require('fs');
import fs from "fs";
//const https = require('https');
import https from "https";

var privateKey  = fs.readFileSync('../conf/private.key', 'utf8');
var certificate = fs.readFileSync('../conf/certificate.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
const server = https.createServer(credentials, app);

/**
 * Listen on the process.env.PORT number
 */
server.listen(port);

// -----------------------------------------

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
/**
* Start the socket.io instance
*/
const robIO = require('./io.js');
const anotherIO = new robIO(server);
