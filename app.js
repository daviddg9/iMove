var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var noticiasRouter = require('./routes/noticias');
var interurbanosRouter = require('./routes/interurbanos');
var urbanosRouter = require('./routes/urbanos');
var usersRouter = require('./routes/users');
var renfesRouter = require('./routes/renfe');
var metroRouter = require('./routes/metro');
var transPubRouter = require('./routes/transportePublico');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/noticias', noticiasRouter);
app.use('/interurbanos', interurbanosRouter);
app.use('/urbanos', urbanosRouter);
app.use('/renfe', renfesRouter);
app.use('/metro', metroRouter);
app.use('/transportePublico', transPubRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.set("dotenv", require("dotenv").config().parsed);

module.exports = app;
