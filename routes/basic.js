

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


// const Nike1 = new MaleShoe( {

//     name : "Airmax",
//     price : 50,
//     productID : "m1",
//     image: "https://static.nike.com/a/images/f_auto,b_rgb:f5f5f5,w_440/c1ee6824-3c01-4c5a-95fe-6f2903566cd8/air-max-koko-sandal-ktWc9N.jpg"
// });

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

const MaleShoe = mongoose.model("MaleShoe",shoeSchema);
const FemaleShoe = mongoose.model("FemaleShoe",shoeSchema);

const Nike4 = new FemaleShoe({
    name: "Female Shoe ",
    price: 30,
    productID: "f1"

})

const MaleShoesList = [Nike2];
const FemaleShoesList = [ Nike4 ];


module.exports = app => {

    
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

    // app.get("/kids-collection",function(req,res){
//     res.render('collections/kids-collection');
// })


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


}