//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
require('dotenv').config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret , encryptedFields: ['password']  });

const User = mongoose.model("user",userSchema);

app.get("/",function(req,res){
    res.render('home');
})

app.get("/register",function(req,res){
    res.render('register');
})

app.get("/login",function(req,res){
    res.render('login');
})

/////////////////////////////////////post method/////////////////////////////////
app.post("/register",function(req,res){
    
    const Inputemail = req.body.username;
    const inputpassword = req.body.password;
  
    var user = new User(
        {
            email:Inputemail,
            password:inputpassword
        }
    );
    user.save(function(err){
        if(!err){
            res.redirect('/');
        }
        
    });
})
app.post("/login",function(req,res){
    var inputEmail = req.body.username;
    var inputPassword = req.body.password;
    User.findOne({email:inputEmail},function(err,data){
        if(!err){
            if(data.password===inputPassword){
                res.render("secrets");
            }
        }
    })
})

app.listen(3000,function(req,res){
    console.log("application started on port 3k");
})