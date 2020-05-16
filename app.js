const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const multer  = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const FacebookStrategy = require("passport-facebook");
const GitHubStrategy = require("passport-github2");

require('dotenv').config()


const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');


const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('views', __dirname + "/views/");

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/shoeDB",{useUnifiedTopology: true, useNewUrlParser: true});
mongoose.set('useCreateIndex', true);

const shoeSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"]
    },

    price: {
        type: Number,
        required: [true, "Please enter price"]
    },
    productID: {
        type: String,
    },

    image : String
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


const MaleShoe = mongoose.model("MaleShoe",shoeSchema);
const FemaleShoe = mongoose.model("FemaleShoe",shoeSchema);
const User = mongoose.model("user",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


  //-------------------------GOOOOGLEEEE----------------

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

// --------------------------------------------------------



//----------------------FACEBOOKKK-----------------------------

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

// --------------------------------------------------------------------


// -------------------------GITHUB--------------------------

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

// ----------------------------------------------------------


const Nike1 = new MaleShoe( {

    name : "Airmax",
    price : 50,
    productID : "m1",
    image: "https://static.nike.com/a/images/f_auto,b_rgb:f5f5f5,w_440/c1ee6824-3c01-4c5a-95fe-6f2903566cd8/air-max-koko-sandal-ktWc9N.jpg"
});

const Nike2 = new MaleShoe( {

    name : "AirJordan",
    price : 200,
    productID : "m2"
});

// const Nike3 = new MaleShoe({

//     name : "Disruptors",
//     price : 80,
//     productID : "m3"
// });


const Nike4 = new FemaleShoe({
    name: "Female Shoe ",
    price: 30,
    productID: "f1"

})

const MaleShoesList = [Nike2];
const FemaleShoesList = [ Nike4 ];

app.get("/",function(req,res){
    res.render('mainPage');
});

app.get("/mens-collection",function(req,res){

    MaleShoe.find({},function(err,foundItems)
    {
        if(foundItems.length === 0)
        {
            MaleShoe.insertMany(MaleShoesList,function(err)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("successfully added");
                }
            });
            res.redirect("/mens-collection");
        }
        else{
            res.render('collections/mens-collection',{mensCollection: foundItems});
        }
    })

})

app.get("/women-collection",function(req,res){
    FemaleShoe.find({},function(err,foundItems)
    {
        if(foundItems.length === 0)
        {
            FemaleShoe.insertMany(FemaleShoesList,function(err)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("successfully added");
                }
            });
            res.redirect("/women-collection");
        }
        else{
            res.render('collections/women-collection',{femaleCollection: foundItems});
        }
    })
})

app.get("/register",function(req,res){
    res.render('login/loginPage');
})

app.get("/login",function(req,res){
    res.render('login/loginPage');
})



// --------GOOGLE------------
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] 
}));

app.get('/auth/google/nike', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

//--------------------------------------


//-----------FACEBOOK----------------------

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/nike',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


//   ------------------------------------------------



//================GITHUB=========================

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/nike', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


//  =================================================


app.get("/upload",function(req,res){
    res.render('upload/upload');
})


app.post("/upload/:shoe",function(req,res)
{
    const shoe = req.params.shoe;
    const shoeName = req.body.shoeName;
    const shoePrice = req.body.price;
    const shoeProductID = req.body.productID;
    const shoeImg = req.body.Shoeimage;

    console.log(shoeImg);
    
    if(shoe === 'maleShoe')
    {
                console.log(req.file);
                const shoe = new MaleShoe({
                    name: shoeName,
                    price: shoePrice,
                    productID: shoeProductID,
                    image: shoeImg
                });
                shoe.save();

        res.redirect("/mens-collection");
    }
    else if(shoe === 'FemaleShoe')
    {
        const shoe = new FemaleShoe({
            name: shoeName,
            price: shoePrice,
            productID: shoeProductID,
            image: shoeImg

        });
        shoe.save();

        res.redirect("/women-collection");
    }

})


app.post("/register",function(req,res)
{

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

        User.findOne({email: req.body.email}, function(err,foundUser)
        {
            if(foundUser)
            {
                console.log("already exists");
                res.redirect("/login");
            }
            else{
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hash
                })
                newUser.save(function(err)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else{
                        res.redirect("/");
                    }
                });

            }
        })
        
    });
    
})

app.post("/login",function(req,res)
{
    const email = req.body.email;
    const pass = req.body.password;
    User.findOne({email: email},function(err,foundUser)
    {
        if(!err)
        {
            if(foundUser)
            {
                bcrypt.compare(pass, foundUser.password, function(err, result) {
                    if(result === true)
                    {
                        res.redirect("/");
                    }
                });
            }
        }
    })
})

// app.get("/kids-collection",function(req,res){
//     res.render('collections/kids-collection');
// })


const PORT = process.env.PORT || 3000;

app.listen(PORT,function(){
    console.log("starting server");
})






