const express = require("express");
const router = express.Router();
const Vechile = require("../model/addVechile.model.js");
const cloudinary = require('cloudinary').v2
require('dotenv').config()


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
// find all user
router.get("/", async (req, res, next) => {
  try {
    const vechiles = await Vechile.find({}); // Find all students
    res.status(200).json(vechiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// register user
router.post('/', async (req, res, next) => {
  try {
    const { carName, carType, rate } = req.body;
    const file = req.files.photo;

    // Check if carName already exists
    const existVechile = await Vechile.findOne({ carName });
    if (existVechile) {
      return res.status(409).json({ message: 'Car already exists' });
    }

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath);

    // Create a new vechile instance
    const vechile = new Vechile({
      carName,
      image: result.url,
      rate,
      carType
    });

    // Save the vechile to the database
    const savedVechile = await vechile.save();

    res.status(201).json({ message: 'Vechile added successfully', vechile: savedVechile });
  } catch (error) {
    console.error("POST /vechile error:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Delete by id
router.delete("/:id", async (req, res, next) => {
  const _id = req.params.id;
  await Vechile.findByIdAndDelete(_id)
  .exec()
  .then((result) => {
    res.status(200).json({
      message:"Successfull DEleted",
      Vechile: result,
    });
  });

});

// search by id perticular student
router.get("/:id", async (req, res, next) => {
  const _id = req.params.id;
  Vechile.findById(_id)
    .exec()
    .then((result) => {
      res.status(200).json({
        student: result,
      });
    });
});





module.exports = router;
