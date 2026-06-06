const express = require("express");
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  bookAppointment,
  updateAppointment,
  deleteAppointment,
} = require("../Controllers/AdminAppointmentController");
 
// GET  /api/appointment/all
router.get("/all", getAllAppointments);
 
// GET  /api/appointment/:id
router.get("/:id", getAppointmentById);
 
// POST /api/appointment/book
router.post("/book", bookAppointment);
 
// PUT  /api/appointment/:id
router.put("/:id", updateAppointment);
 
// DELETE /api/appointment/:id
router.delete("/:id", deleteAppointment);
 
module.exports = router;
 