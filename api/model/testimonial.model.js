const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  
    name: String,
    rating: Number,
    description: String,
    

  }, {
    timestamps: true,
  });
  

module.exports = mongoose.model("Testimonial", testimonialSchema);

