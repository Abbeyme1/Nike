const express = require('express')


const app = express();
app.set('view engine','ejs');
app.use(express.static("public"));

app.set('views', __dirname + "/views/");


app.get("/",function(req,res){
    res.render('mainPage')
})

app.get("/mens-collection",function(req,res){
    res.render('collections/mens-collection');
})

app.get("/women-collection",function(req,res){
    res.render('collections/women-collection');
})

app.get("/register",function(req,res){
    res.render('login/loginPage');
})

app.get("/login",function(req,res){
    res.render('login/loginPage');
})


// app.get("/kids-collection",function(req,res){
//     res.render('collections/kids-collection');
// })

app.listen(3000,function(){
    console.log("server starting");
})