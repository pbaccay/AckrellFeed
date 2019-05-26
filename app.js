#!/usr/bin/env node
// dependencies
var path = require('path');
var express = require('express');
var app = express();
var debug = require('debug')('momtact:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort('3000');
app.set('port', port);
var server = http.createServer(app);
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


var request = require('request');
var passport = require('passport');
var flash = require('connect-flash');

var morgan      = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var __ = require('underscore');
var favicon = require('serve-favicon');

var logger = require('morgan');
var session = require('express-session');
var mongoose = require('mongoose');
var User  = require('./models/user');
var Feed = require('./models/feed.js');
var WebEmail = require('./models/webemail.js');
var AcrkellFeed = require('./models/ackrellfeed.js');
var Newsfeeds = require('./models/newsfeeds.js');


//authentication
var passportConfig  = require('./config/passport');
var authentication  = require('./middleware/authentication');
var authRoutes      = require('./routes/auth');
var apiroutes = require('./routes/api.js');

var dbConfig = require('./db.js');
mongoose.connect(dbConfig.url);
console.log('Connected to MongoDB at: ' + dbConfig.url);


var routes = require('./routes/index');

// Configuring Passport
passportConfig(passport,User);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));


app.use(morgan('dev')); 
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser()); 
app.use(session({ secret: 'ackrellfeednodejssecret', resave:true, saveUninitialized:true })); 
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 
app.use(authentication());

authRoutes(app, passport); 
app.use('/user/', apiroutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	console.log('PBK app 404');
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
	  	console.log('PBK app dev 500');
	res.send(500);	  
	  /*
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
	*/
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
		console.log('PBK app prod 500');
	res.send(500);	
	/*
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
  */
});

module.exports = app;
