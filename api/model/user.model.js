const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  
    username: String,
    password: String,
    phone: Number,
    email: String,
    image:String,
    userType:String

  }, {
    timestamps: true,
  });
  

module.exports = mongoose.model("User", userSchema);

