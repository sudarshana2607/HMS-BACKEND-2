const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  bookAppointment,
  getPatientAppointments,
} = require("../Controllers/PatientController");
 
// Profile
router.get("/profile/:userId", getProfile);
router.put("/profile/:userId", updateProfile);
 
// Appointments
router.post("/appointments/book", bookAppointment);
router.get("/appointments/:userId", getPatientAppointments);
 
module.exports = router;