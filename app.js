// dependencies
var path = require('path');
var express = require('express');
var app = express();

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

app.use(morgan('dev')); 
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))
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
     res.sendStatus(err.status || 500);
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
  res.sendStatus(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
  */
});


module.exports = app;
