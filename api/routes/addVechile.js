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

// add vechile 
router.post('/', async (req, res) => {
  try {
    const { carName, carType, rate } = req.body;
    if (!req.files || !req.files.photo) {
      return res.status(400).json({ message: 'No photo uploaded' });
    }

    const file = req.files.photo;
    console.log("Received file:", file); // Log the received file

    // Check if carName already exists
    const existVechile = await Vechile.findOne({ carName });
    if (existVechile) {
      return res.status(409).json({ message: 'Car already exists' });
    }

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath);
    console.log("Cloudinary upload result:", result); // Log the Cloudinary upload result

    // Create a new vehicle instance
    const vechile = new Vechile({
      carName,
      image: result.url,
      rate,
      carType
    });

    // Save the vehicle to the database
    const savedVechile = await vechile.save();
    res.status(201).json({ message: 'Vehicle added successfully', vechile: savedVechile });
  } catch (error) {
    console.error("POST /vehicle error:", error);
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
      message:"Successfull Deleted",
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
        Vehicle: result,
      });
    });
});





module.exports = router;
