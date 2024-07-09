const express = require("express");
const router = express.Router();
const Faculty = require("../model/faculty.model.js");

router.get("/", async (req, res, next) => {
  try {
    const faculties = await Faculty.find({}); // Find all faculty members
    res.status(200).json(faculties);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/", async (req, res, next) => {
  const existingEmail = await Faculty.findOne({ email: req.body.email });
  const existingPhone = await Faculty.findOne({ phone: req.body.phone });
  if (existingEmail) {
    return res.status(409).json({ error: "Email already registered" });
  } else if (existingPhone) {
    return res.status(409).json({ error: "Phone number already registered" });
  }
  const faculty = new Faculty({
    name: req.body.name,
    phone: req.body.phone,
    faculty_type: req.body.faculty_type,
    email: req.body.email,
    gender: req.body.gender,
  });
  faculty
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        New_Faculty: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        error: "Something went wrong",
      });
    });
});

// search faculty by id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the Faculty by ID
    const faculty = await Faculty.findById(id);

    // Check if faculty is found
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Respond with the found Faculty object
    res.status(200).json({ Faculty: faculty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// delete by id

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findByIdAndDelete(id);
    if (!faculty) {
      res.status(404).json({
        message: "Faculty Not Found",
      });
    } else {
      res.status(200).json({
        message: "Data Delete Successfully",
        faculty: faculty,
      });
    }
  } catch (error) {}
});

// update  by id
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    // Extract updated student data from request body
    const updatedStudent = {
      name: req.body.name,
      phone: req.body.phone,
      faculty_type: req.body.faculty_type,
      email: req.body.email,
      gender: req.body.gender,
    };
    // Find and update student using findByIdAndUpdate
    const updatedDoc = await Faculty.findByIdAndUpdate(id, updatedStudent, {
      new: true, // Return the updated document
    });

    if (!updatedDoc) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res
      .status(200)
      .json({ message: "Faculty updated successfully", faculty: updatedDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
