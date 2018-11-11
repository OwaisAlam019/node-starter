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

// router.post("/signup", (req, res, next) => {
//   res.send("Hello signup",req.body)
  
// });

// router.post("/login", (req, res, next) => {
//   let fetchedUser;
//   User.findOne({ email: req.body.email })
//     .then(user => {
//       if (!user) {
//         return res.status(401).json({
//           message: "Auth failed"
//         });
//       }
//       fetchedUser = user;
//       return bcrypt.compare(req.body.password, user.password);
//     })
//     .then(result => {
//       if (!result) {
//         return res.status(401).json({
//           message: "Auth failed"
//         });
//       }
//       const token = jwt.sign(
//         { email: fetchedUser.email, userId: fetchedUser._id },
//         "secret_this_should_be_longer",
//         { expiresIn: "1h" }
//       );
//       res.status(200).json({
//         token: token
//       });
//     })
//     .catch(err => {
//       return res.status(401).json({
//         message: "Auth failed"
//       });
//     });
// });

module.exports = router;
