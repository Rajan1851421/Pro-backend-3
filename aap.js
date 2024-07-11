const express = require('express')
const studentRoute = require('./api/routes/student')
const facultyRoute = require('./api/routes/faculty')
const user = require('./api/routes/user.js')
const vechile = require('./api/routes/addVechile.js')
const app = express()
const mongoose = require('mongoose');
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors'); 
const fileUpload = require('express-fileupload')

// connect with database  mongoDb
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected!'))
  .catch(error => {
    console.error(error); 
  });  

app.use(fileUpload({
  useTempFiles:true
}))
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'], // Add the HTTP methods you want to allow
  allowedHeaders: ['Content-Type', 'Authorization'], // Add headers you want to allow
}));


app.use('/student',studentRoute)
app.use('/faculty',facultyRoute)
app.use('/user',user)
app.use('/vechile',vechile)

app.use((req,res,next)=>{
    res.status(404).json({
        message:"Bad URL -> URL Not found"
    })
})



module.exports = app;