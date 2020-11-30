//jshint esversion:6
// requiring all the modules we installed in npm
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

// creating a new app instance using Express
const app = express();

// setting our view engine to use ejs as our template engine
app.set('view engine', 'ejs');
// use body parser in order to pass our requests
app.use(bodyParser.urlencoded({
  extended: true
}));
// use the public directory to store our static files such as images and stylesheets (CSS code)
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const userSchema = new mongoose.Schema({    // now not just a javascript object but an object create from the Mongoose schema class.
  email: String,
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });


const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets"); // we don't want to render the secrets route unless the user is registered or logged in.
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  })


})


// Sets up our app to listen on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
