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

        // Check if carName or carType already exists
        const existVechile = await Vechile.findOne({ $or: [{ carName }, { carType }] });
        if (existVechile) {
            return res.status(409).json({ message: 'Car or its Type already exists' });
        }

        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(file.tempFilePath);

        // Create a new vechile instance
        const vechile = new Vechile({
            carName,
            image: result.url,
            rate, // Ensure rate is properly defined in req.body
            carType
        });

        // Save the vechile to the database
        const savedVechile = await vechile.save();

        res.status(201).json({ message: 'Add vechile successfully', vechile: savedVechile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




module.exports = router;
