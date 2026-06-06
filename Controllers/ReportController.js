const Report = require("../Modals/ReportModal");
 
// POST /api/report/create
const createReport = async (req, res) => {
  try {
    const { patient, doctor, diagnosis, notes } = req.body;
 
    if (!patient || !diagnosis) {
      return res.status(400).json({
        success: false,
        message: "Patient and diagnosis are required",
      });
    }
 
    const report = await Report.create({ patient, doctor, diagnosis, notes });
 
    // Populate for the response so frontend gets patient name right away
    const populated = await Report.findById(report._id).populate(
      "patient",
      "firstname lastname"
    );
 
    return res.status(201).json({
      success: true,
      message: "Report created successfully",
      report: populated,
    });
  } catch (error) {
    console.error("createReport error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating report",
    });
  }
};
 
// GET /api/report/all
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("patient", "firstname lastname email")
      .populate("doctor", "firstname lastname")
      .sort({ createdAt: -1 });
 
    return res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("getAllReports error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching reports",
    });
  }
};
 
// GET /api/report/:id
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("patient", "firstname lastname email")
      .populate("doctor", "firstname lastname");
 
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }
 
    return res.status(200).json({ success: true, report });
  } catch (error) {
    console.error("getReportById error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
 
// GET /api/report/patient/:patientId
const getReportsByPatient = async (req, res) => {
  try {
    const reports = await Report.find({ patient: req.params.patientId })
      .populate("doctor", "firstname lastname")
      .sort({ createdAt: -1 });
 
    return res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("getReportsByPatient error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
 
// DELETE /api/report/:id
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
 
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }
 
    return res.status(200).json({ success: true, message: "Report deleted" });
  } catch (error) {
    console.error("deleteReport error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
 
module.exports = {
  createReport,
  getAllReports,
  getReportById,
  getReportsByPatient,
  deleteReport,
};
 