const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../Controllers/AppointmentController");
 
// POST   /api/appointment/create
router.post("/create", createAppointment);
 
// GET    /api/appointment/all
router.get("/all", getAllAppointments);
 
// GET    /api/appointment/:id
router.get("/:id", getAppointmentById);
 
// PATCH  /api/appointment/:id/status
router.patch("/:id/status", updateAppointmentStatus);
 
// DELETE /api/appointment/:id
router.delete("/:id", deleteAppointment);
 
module.exports = router;
 