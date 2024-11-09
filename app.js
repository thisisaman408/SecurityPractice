//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
app.use(bodyParser.urlencoded({ extended: true }));
const ejs = require("ejs");
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/userDB");
const encrypt = require("mongoose-encryption");
app.get("/", (req, res) => {
  res.render("home");
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });
const User = new mongoose.model("User", userSchema);
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ email: username }).then((foundUser) => {
    if (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      } else {
        res.render("makichut");
      }
    } else {
      console.log("User not found");
      res.render("home");
    }
  });
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  newUser.save();
  res.render("home");
});

app.get("/logout", (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
