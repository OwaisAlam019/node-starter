const express = require("express");
const bcrypt = require("bcrypt");
var bodyParser = require('body-parser')
const jwt = require("jsonwebtoken");
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

module.exports = router;
