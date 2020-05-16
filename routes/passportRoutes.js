const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require("body-parser");


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("user",userSchema);



const FacebookStrategy = require("passport-facebook");
const GitHubStrategy = require("passport-github2");

require('dotenv').config()
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('views', __dirname + "/views/");

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/shoeDB",{useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set('useCreateIndex', true);

module.exports = app => {

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/nike",
    userProfileURL: "https://www/googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {

    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/nike"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/nike"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] 
}));

app.get('/auth/google/nike', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/nike',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/nike', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


}