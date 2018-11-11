const express = require("express");
const bcrypt = require("bcrypt");
var bodyParser = require('body-parser')
// const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

router.post("/signup", (req,res,next) => {
  console.log("ping",req.body);
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        console.log("result",result);
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({
          error: err
        });
      });
  });
  
})

router.post("/login",(req,res,next)=>{
  User.findOne({email:req.body.email},(user) => {
    if(!user){
      res.status(404).json({
        message:"User does not exist"
      })
    }
  });
});

module.exports = router;
