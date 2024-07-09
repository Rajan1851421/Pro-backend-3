const mongoose = require('mongoose')

const facultySchema = new mongoose.Schema(
    {
    name:String,
    faculty_type:String,
    phone:Number,
    email:String,
    gender:String
},
{
    timestamps:true
}
)

module.exports = mongoose.model("Faculty",facultySchema)