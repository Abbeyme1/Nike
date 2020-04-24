const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
// const _ = require("lodash");
var multer  = require('multer');
const path = require('path');


var Storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename:function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
});

var upload = multer({
    storage:Storage
}).single('Shoeimage');


const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('views', __dirname + "/views/");


mongoose.connect("mongodb://localhost:27017/shoeDB",{useUnifiedTopology: true, useNewUrlParser: true});

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

const MaleShoe = mongoose.model("MaleShoe",shoeSchema);
const FemaleShoe = mongoose.model("FemaleShoe",shoeSchema);

const Nike1 = new MaleShoe( {

    name : "Airmax",
    price : 50,
    productID : "m1"
});

const Nike2 = new MaleShoe( {

    name : "AirJordan",
    price : 200,
    productID : "m2"
});

const Nike3 = new MaleShoe({

    name : "Disruptors",
    price : 80,
    productID : "m3"
});


const Nike4 = new FemaleShoe({
    name: "Female Shoe ",
    price: 30,
    productID: "f1"

})

const MaleShoesList = [Nike1 , Nike2 , Nike3];
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

app.get("/upload",function(req,res){
    res.render('upload/upload');
})


app.post("/upload/:shoe",function(req,res)
{
    const shoe = req.params.shoe;
    const shoeName = req.body.shoeName;
    const shoePrice = req.body.price;
    const shoeProductID = req.body.productID;
    


    console.log(shoeName);
    console.log(shoePrice);
    console.log(shoeProductID);

    console.log(shoe);


    if(shoe === 'maleShoe')
    {
        upload(req,res,(err) => {
            if(err)
            {
                console.log("error uploading file");
            }
            else {
                console.log(req.file);

                const Pimage = req.file.Shoeimage;
                const shoe = new MaleShoe({
                    name: shoeName,
                    price: shoePrice,
                    productID: shoeProductID,
                    image: Pimage 
                });
                shoe.save();
                
            }
        })
        res.redirect("/mens-collection");
    }
    else if(shoe === 'FemaleShoe')
    {
        const shoe = new FemaleShoe({
            name: shoeName,
            price: shoePrice,
            productID: shoeProductID
        });
        shoe.save();
    
        res.redirect("/women-collection");
    }
    
})



app.listen(3000,function(){
    console.log("server starting");
})