//jshint esversion:6 
require('dotenv').config();
console.log(process.env.SECRETE);
console.log(process.env.API_KEY);


const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://127.0.0.1/userDB');
//mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

//simple javascrit object schema version
// const userSchema = {
//     email: String,
//     password: String
// };

//proper schema version from mongoose schema class
const userSchema = new mongoose.Schema({
    email: String,
    password: String 
});

//encrypt password 

userSchema.plugin(encrypt,{secret: process.env.SECRETE, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);


//APP.GET 
app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});


//APP.POST 
app.post("/register",async function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

//  newUser.save(function(err){
// if (err){
//     console.log(err);
// } else {
//     res.render("secrets");
// }

//  });

await newUser.save().catch(err => console.log(err));
res.render("secrets");

});

app.post("/login",async function (req, res){
const username = req.body.username;
const password = req.body.password;

// User.findOne({email: username}, function(err, foundUser){
// if (err){
//     console.log(err);
// } else {
//     if(foundUser) {
//         if(foundUser.password === password){
//             res.render("secrets");
//         }
//     }
// }

// });
const foundUser = await User.findOne({ email: username });
if (foundUser) {
  if (foundUser.password === password) {
    res.render("secrets");
  }
} else {
  console.log(err);
}

});


app.listen(3000, function(){
console.log("Server started on port 3000");
});