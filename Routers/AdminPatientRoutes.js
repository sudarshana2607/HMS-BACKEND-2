const express = require("express");
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  addPatient,
  updatePatient,
  deletePatient,
} = require("../Controllers/AdminPatientController");
 
// GET  /api/patient/all
router.get("/all", getAllPatients);
 
// GET  /api/patient/:id
router.get("/:id", getPatientById);
 
// POST /api/patient/add
router.post("/add", addPatient);
 
// PUT  /api/patient/:id
router.put("/:id", updatePatient);
 
// DELETE /api/patient/:id
router.delete("/:id", deletePatient);
 
module.exports = router;
 
