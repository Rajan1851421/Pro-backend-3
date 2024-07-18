const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Testimonial = require("../model/testimonial.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config()



// Get all testimonials
router.get("/", async (req, res, next) => {
    try {
      const testimonials = await Testimonial.find({});
      res.status(200).json(testimonials);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  });
  
  // Create a new testimonial
  router.post("/", async (req, res, next) => {
    try {
      const { name, rating, description } = req.body;
      const newTestimonial = new Testimonial({ name, rating, description });
      await newTestimonial.save();
      res.status(201).json(newTestimonial);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  });








module.exports = router;
