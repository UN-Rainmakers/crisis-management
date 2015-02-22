var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index_routes = require('./routes/index');
var users = require('./routes/users');
var about = require('./routes/about');
var feedback = require('./routes/feedback');


var constantcomment = require('./sms');
constantcomment.hello();

var get_last = require('./get_last');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index_routes);
app.use('/about', about);
app.use('/users', users);
app.use('/feedback', feedback);

app.get('/feedback', function(req, res) {
  res.render('feedback', {
    title: 'Welcome'
  });
});
app.get('/map', function(req, res) {
  res.render('map', {
    title: 'Welcome'
  });
});

app.get('/get_last', get_last);

app.get('/tester', function(req, res) {
  var doodle = 'HERE IS A DOODLE';
var accountSid = 'ACf5e175f913bd96a8be7a9ddb3af7433f'; 
var authToken = 'c831c407d108bfb24c40096964bd7462'; 
 
var client = require('twilio')(accountSid, authToken); 
var newlist = [];
client.messages.list({    
 }, function(err, data) { 
 	data.messages.forEach(function(message) { 
        newlist.push(message.sid);
        newlist.push(message.sid);
        console.log(newlist);
 		 	}); 
	var hoola = newlist
  res.render('tester', {
    title: 'Welcome DOODLE', 
    posts: hoola
  });
 		 	});

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
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


module.exports = app;
