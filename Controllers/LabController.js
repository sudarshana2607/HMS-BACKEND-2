const LabTest  = require("../Modals/Labtest");
const Equipment = require("../Modals/Equipment");
 
/* ─────────────────────────────────────────
   GET /api/lab/dashboard
   Returns counts: totalTests, pendingTests,
   completedTests, emergencyTests
───────────────────────────────────────── */
const getDashboard = async (req, res) => {
  try {
    const [total, pending, completed, emergency] = await Promise.all([
      LabTest.countDocuments(),
      LabTest.countDocuments({ status: "Pending" }),
      LabTest.countDocuments({ status: "Completed" }),
      LabTest.countDocuments({ priority: "Emergency" }),
    ]);
 
    res.status(200).json({
      totalTests:     total,
      pendingTests:   pending,
      completedTests: completed,
      emergencyTests: emergency,
    });
  } catch (err) {
    console.error("getDashboard error:", err);
    res.status(500).json({ message: "Server error fetching dashboard stats." });
  }
};
 
/* ─────────────────────────────────────────
   GET /api/lab/tests
   Returns all lab tests (populated)
───────────────────────────────────────── */
const getAllTests = async (req, res) => {
  try {
    const tests = await LabTest.find()
      .populate("patientId", "firstname lastname email")
      .populate("doctorId",  "firstname lastname")
      .sort({ createdAt: -1 });
 
    res.status(200).json(tests);
  } catch (err) {
    console.error("getAllTests error:", err);
    res.status(500).json({ message: "Server error fetching tests." });
  }
};
 
/* ─────────────────────────────────────────
   PUT /api/lab/report/:id
   Body: { report, remarks }
   Sets status → "Completed"
───────────────────────────────────────── */
const uploadReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { report, remarks } = req.body;
 
    if (!report || !report.trim()) {
      return res.status(400).json({ message: "Report result is required." });
    }
 
    const updated = await LabTest.findByIdAndUpdate(
      id,
      { report, remarks: remarks || "", status: "Completed" },
      { new: true }
    );
 
    if (!updated) {
      return res.status(404).json({ message: "Test not found." });
    }
 
    res.status(200).json({ message: "Report uploaded successfully.", data: updated });
  } catch (err) {
    console.error("uploadReport error:", err);
    res.status(500).json({ message: "Server error uploading report." });
  }
};
 
/* ─────────────────────────────────────────
   GET /api/lab/equipment
   Returns all equipment records
───────────────────────────────────────── */
const getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find().sort({ name: 1 });
    res.status(200).json(equipment);
  } catch (err) {
    console.error("getEquipment error:", err);
    res.status(500).json({ message: "Server error fetching equipment." });
  }
};
 
module.exports = {
  getDashboard,
  getAllTests,
  uploadReport,
  getEquipment,
};