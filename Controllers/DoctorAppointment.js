const Doctor = require("../Modals/Doctor");
const bcrypt = require("bcryptjs");
 
// ── GET /api/doctor/all ──
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password").sort({ createdAt: -1 }).lean();
    res.json({ success: true, doctors });
  } catch (err) {
    console.error("getAllDoctors error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch doctors" });
  }
};
 
// ── GET /api/doctor/:id ──
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password").lean();
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.json({ success: true, doctor });
  } catch (err) {
    console.error("getDoctorById error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch doctor" });
  }
};
 
// ── POST /api/doctor/add ──
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, department, specialization, qualification, experience } = req.body;
 
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }
 
    const exists = await Doctor.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ success: false, message: "Email already registered" });
 
    const hashed = await bcrypt.hash(password, 10);
    const doctor = await Doctor.create({
      name, email, password: hashed, phone,
      department, specialization, qualification, experience,
    });
 
    const { password: _, ...doctorData } = doctor.toObject();
    res.status(201).json({ success: true, message: "Doctor added successfully", doctor: doctorData });
  } catch (err) {
    console.error("addDoctor error:", err);
    res.status(500).json({ success: false, message: "Failed to add doctor" });
  }
};
 
// ── PUT /api/doctor/:id ──
const updateDoctor = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password; // don't allow password update via this route
 
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true,
    }).select("-password");
 
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.json({ success: true, message: "Doctor updated", doctor });
  } catch (err) {
    console.error("updateDoctor error:", err);
    res.status(500).json({ success: false, message: "Failed to update doctor" });
  }
};
 
// ── DELETE /api/doctor/:id ──
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.json({ success: true, message: "Doctor deleted successfully" });
  } catch (err) {
    console.error("deleteDoctor error:", err);
    res.status(500).json({ success: false, message: "Failed to delete doctor" });
  }
};
 
module.exports = { getAllDoctors, getDoctorById, addDoctor, updateDoctor, deleteDoctor };