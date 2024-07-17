const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../model/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config()



// find all user
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}); // Find all students
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/:id", async (req, res, next) => {
  const _id = req.params.id;
  User.findById(_id)
    .exec()
    .then((result) => {
      res.status(200).json({
        Users: result,
      });
    });
});

router.delete("/:id", async (req, res, next) => {
  const _id = req.params.id;
  await User.findByIdAndDelete(_id)
  .exec()
  .then((result) => {
    res.status(200).json({
      message:"Successfull Deleted",
      User: result,
    });
  });

});


// register user

router.post('/signup', async (req, res, next) => {
    try {
        const { username, email, password, phone, userType } = req.body;      
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }       

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user instance
        const user = new User({
            username,
            password: hashedPassword,            
            phone,
            email,
            userType,
        });

        // Save the user to the database
        const savedUser = await user.save();
        res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//   Login user

router.post("/login", (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "User does not exist",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (error, result) => {
        if (!result) {
          return res.status(401).json({
            message: "Password does not Match",
          });
        }
        if (result) {
          const token = jwt.sign(            
            {
            username:user[0].username,
            email:user[0].email,
            userType:user[0].userType
          },'your_secret_key', {expiresIn:'30m'}        
        );
        res.status(200).json({
            username:user[0].username,
            useType:user[0].userType,
            phone:user[0].phone,
            email:user[0].email,
            token:token
        })
       
        }
      });
    })
    .catch(error=>{
        res.status(500).json({
            error:error
        })
    })
});

module.exports = router;
