const mongoose = require("mongoose");

const vechileSchema = new mongoose.Schema({
  
    carName: String,
    carType: String,
    rate: Number,   
    image:String,

  }, {
    timestamps: true,
  });
  

module.exports = mongoose.model("Vechile", vechileSchema);

