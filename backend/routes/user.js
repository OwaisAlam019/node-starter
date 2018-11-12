const express = require("express");
const bcrypt = require("bcrypt");
var bodyParser = require('body-parser')
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport'); // Import Nodemailer Sengrid Transport Package
const router = express.Router();

// var options = {
//   auth: {
//     api_user: 'themeanstack', // Sendgrid username
//     api_key: 'PAssword123!@#' // Sendgrid password
//   }
// }
// var client = nodemailer.createTransport(sgTransport(options));



router.get("/",(req,res)=>{res.send("Welcome to user API")});
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
  let loggedinUser;
  User.findOne({email:req.body.email},(err,user) => {
    loggedinUser = user;
    // console.log(user,req.body)
    if(!loggedinUser){
      res.status(404).json({
        message:"User does not exist"
      })
    }
    return bcrypt.compare(req.body.password,loggedinUser.password)
  }).then(result => {
    console.log("result",result)
    if(result){
      console.log("got result")
      const token = jwt.sign({email:loggedinUser.email,userId:loggedinUser._id},
        "long_secret_key",
        {expiresIn:"1h"});
        res.status(200).json(
          { token:token }
        )
    }
  }).catch(err => {
    console.log("catch error",err)
   return res.status(401).json({Error:err})
  })
});

router.post("/forgotPassword",(req,res,next) => {
  User.findOne({email:req.body.email},(err,user)=>{
    console.log(user);
    if(err) throw err
    user.resetToken = jwt.sign({email:user.email,userId:user._id},
      "long_secret_key",
      {expiresIn:"1h"});

      user.save().then( result =>{
      console.log("saved",result)
        if (err){return res.status(401).json({message:"Token expired"})}
       return res.status(200).json({
          resetLink:"localhost/3000/api/user/reset/"+user.resetToken
        });
      
    })
  })
});
router.get("/reset/:token",(req,res,next) => {
  User.findOne({resetToken:req.params.token},(err,user) => {
    if(err) return res.status(401).json({message:"User not found"})
    var token = req.params.token;
    jwt.verify(token,"long_secret_key",(err,decode) => {
      if (err)  return res.status(401).json({message:"Token expired"})
      res.status(200).json({userData:user})
    })
  });

});

module.exports = router;
