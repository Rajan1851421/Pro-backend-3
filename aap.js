const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const studentRoute = require('./api/routes/student');
const facultyRoute = require('./api/routes/faculty');
const userRoute = require('./api/routes/user');
const vehicleRoute = require('./api/routes/addVechile');

const app = express();

// Connect with MongoDB database
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB!'))
.catch(error => {
  console.error('MongoDB connection error:', error.message);
});

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload({
  useTempFiles: true
}));

// Routes
app.use('/student', studentRoute);
app.use('/faculty', facultyRoute);
app.use('/user', userRoute);
app.use('/vehicle', vehicleRoute);

// 404 Error Handling
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Bad URL -> URL Not found'
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error'
  });
});

module.exports = app;
