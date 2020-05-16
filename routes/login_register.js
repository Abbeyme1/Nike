const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("user",userSchema);



module.exports = app => {

    app.get("/register",function(req,res){
        res.render('login/loginPage');
    })
    
    app.get("/login",function(req,res){
        res.render('login/loginPage');
    })

    app.post("/register",function(req,res)
{

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
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
}