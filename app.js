var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const expHbs = require('express-handlebars');
const hbs = require('hbs');


var indexRouter = require('./routes/index');
var booksRouter = require('./routes/book');

var app = express();




const passport = require('passport');
const session = require('express-session');

app.use(session({
  secret: 's2021pr0j3ctTracker',
  resave: false,
  saveUninitialized: false
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Link passport to the user model
const User = require('./models/user');
passport.use(User.createStrategy());

async (accessToken, refreshToken, profile, done) => {
  // search user by ID
  const user = await User.findOne({ oauthId: profile.id });
  // user exists (returning user)
  if (user) {
    // no need to do anything else
    return done(null, user);
  }
  else {
    // new user so register them in the db
    const newUser = new User({
      username: profile.username,
      oauthId: profile.id,
      oauthProvider: 'Github',
      created: Date.now()
    });
    // add to DB
    const savedUser = await newUser.save();
    // return
    return done(null, savedUser);
  }
}

// Set passport to write/read user data to/from session object
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

let connectionString = 'mongodb+srv://admin:123@cluster0.o84pktd.mongodb.net/LibraryManagementSystem'

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((message) => {
    console.log('Connected successfully!');
  })
  .catch((error) => {
    console.log(`Error while connecting! ${error}`);
  });



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


module.exports = app;
