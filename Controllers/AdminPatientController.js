const Patient = require("../Modals/Patient");
const bcrypt = require("bcryptjs");
 
// ── GET /api/patient/all ──
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select("-password").sort({ createdAt: -1 }).lean();
    res.json({ success: true, patients });
  } catch (err) {
    console.error("getAllPatients error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch patients" });
  }
};
 
// ── GET /api/patient/:id ──
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select("-password").lean();
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.json({ success: true, patient });
  } catch (err) {
    console.error("getPatientById error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch patient" });
  }
};
 
// ── POST /api/patient/add ──
const addPatient = async (req, res) => {
  try {
    const { name, email, password, phone, age, gender, address, bloodGroup } = req.body;
 
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }
 
    const exists = await Patient.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ success: false, message: "Email already registered" });
 
    const hashed = await bcrypt.hash(password, 10);
    const patient = await Patient.create({
      name, email, password: hashed,
      phone, age, gender, address, bloodGroup,
    });
 
    const { password: _, ...patientData } = patient.toObject();
    res.status(201).json({ success: true, message: "Patient registered successfully", patient: patientData });
  } catch (err) {
    console.error("addPatient error:", err);
    res.status(500).json({ success: false, message: "Failed to add patient" });
  }
};
 
// ── PUT /api/patient/:id ──
const updatePatient = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password;
 
    const patient = await Patient.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true,
    }).select("-password");
 
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.json({ success: true, message: "Patient updated", patient });
  } catch (err) {
    console.error("updatePatient error:", err);
    res.status(500).json({ success: false, message: "Failed to update patient" });
  }
};
 
// ── DELETE /api/patient/:id ──
const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.json({ success: true, message: "Patient deleted successfully" });
  } catch (err) {
    console.error("deletePatient error:", err);
    res.status(500).json({ success: false, message: "Failed to delete patient" });
  }
};
 
module.exports = { getAllPatients, getPatientById, addPatient, updatePatient, deletePatient };