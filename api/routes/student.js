const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Student = require("../model/student.model.js"); // Assuming the model is in 'models' folder

router.get("/", async (req, res, next) => {
  try {
    const students = await Student.find({}); // Find all students
    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/", async (req, res, next) => {
  const existingStudent = await Student.findOne({ email: req.body.email });
  const existingPhone = await Student.findOne({ phone: req.body.phone });
  if (existingStudent) {
    return res.status(409).json({ error: "Email already registered" });
  } else if (existingPhone) {
    return res.status(409).json({ error: "Phone number already registered" });
  }
  const student = new Student({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    gender: req.body.gender,
  });
  student
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        newStudent: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        error: "Something went wrong",
      });
    });
});

// search by id perticular student
router.get("/:id", async (req, res, next) => {
  const _id = req.params.id;
  Student.findById(_id)
    .exec()
    .then((result) => {
      res.status(200).json({
        student: result,
      });
    });
});

// *************************Delete student data by id********************************

router.delete("/:id", async (req, res, next) => {
  const _id = req.params.id;
  await Student.findByIdAndDelete(_id)
  .exec()
  .then((result) => {
    res.status(200).json({
      message:"Successfull DEleted",
      student: result,
    });
  });

});


// update data by id

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;   

    // Extract updated student data from request body
    const updatedStudent = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      gender: req.body.gender,
    };

    // Find and update student using findByIdAndUpdate
    const updatedDoc = await Student.findByIdAndUpdate(id, updatedStudent, {
      new: true, // Return the updated document
    });

    if (!updatedDoc) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student updated successfully', student: updatedDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
