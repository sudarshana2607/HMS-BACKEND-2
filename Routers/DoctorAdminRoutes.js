const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  addDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../Controllers/DoctorAppointment");
 
// GET  /api/doctor/all
router.get("/all", getAllDoctors);
 
// GET  /api/doctor/:id
router.get("/:id", getDoctorById);
 
// POST /api/doctor/add
router.post("/add", addDoctor);
 
// PUT  /api/doctor/:id
router.put("/:id", updateDoctor);
 
// DELETE /api/doctor/:id
router.delete("/:id", deleteDoctor);
 
module.exports = router;
 