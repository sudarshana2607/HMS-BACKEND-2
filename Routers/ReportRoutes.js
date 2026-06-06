const express = require("express");
const router = express.Router();
const {
  createReport,
  getAllReports,
  getReportById,
  getReportsByPatient,
  deleteReport,
} = require("../Controllers/ReportController");
 
// POST   /api/report/create
router.post("/create", createReport);
 
// GET    /api/report/all
router.get("/all", getAllReports);
 
// GET    /api/report/patient/:patientId
router.get("/patient/:patientId", getReportsByPatient);
 
// GET    /api/report/:id
router.get("/:id", getReportById);
 
// DELETE /api/report/:id
router.delete("/:id", deleteReport);
 
module.exports = router;
 