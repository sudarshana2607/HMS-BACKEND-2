const express = require("express");
const router  = express.Router();
 
const {
  getProfile,
  updateProfile,
  bookAppointment,
  getPatientAppointments,
} = require("../Controllers/PatientController");
const { updateAppointmentStatus } = require("../Controllers/AppointmentController");
 
/* ── Profile ─────────────────────────────────────────────────────────────── */
// GET  /api/patient/profile/:userId
router.get("/profile/:userId",  getProfile);
 
// PUT  /api/patient/profile/:userId
router.put("/profile/:userId",  updateProfile);
 
/* ── Appointments ────────────────────────────────────────────────────────── */
 
// ⚠️  STATIC routes MUST come before dynamic :param routes
 
// POST /api/patient/appointments/book
router.post("/appointments/book", bookAppointment);
 
// GET  /api/patient/appointments/doctor/:doctorId
// NOTE: getDoctorAppointments is not implemented; remove or implement if needed in the future.
// router.get("/appointments/doctor/:doctorId", getDoctorAppointments);
 
// PATCH /api/patient/appointments/:appointmentId/status
router.patch("/appointments/:appointmentId/status", updateAppointmentStatus);
 
// GET  /api/patient/appointments/:userId   ← dynamic last
router.get("/appointments/:userId", getPatientAppointments);
 
module.exports = router;