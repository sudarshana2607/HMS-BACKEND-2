const User = require("../Modals/User");
const Appointment = require("../Modals/Appointment");
 
/* ─────────────────────────────────────────────────────────────────
   GET /api/patient/profile/:userId
   Returns patient profile (no password)
───────────────────────────────────────────────────────────────── */
const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    return res.json({ success: true, data: user });
  } catch (err) {
    console.error("getProfile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
 
/* ─────────────────────────────────────────────────────────────────
   PUT /api/patient/profile/:userId
   Updates allowed profile fields
───────────────────────────────────────────────────────────────── */
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const allowed = [
      "firstname", "lastname", "email", "phone",
      "age", "gender", "bloodGroup", "address", "emergencyContact",
    ];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
 
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");
 
    if (!user) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }
    return res.json({ success: true, data: user });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
 
/* ─────────────────────────────────────────────────────────────────
   POST /api/patient/appointments/book
   Books a new appointment
───────────────────────────────────────────────────────────────── 
const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, doctorName, department, date, time, notes, status } = req.body;
 
    if (!patientId || !doctorId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "patientId, doctorId, date and time are required",
      });
    }
 
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      doctorName,
      department,
      date,
      time,
      notes,
      status: status || "Pending",
    });
 
    return res.status(201).json({ success: true, data: appointment });
  } catch (err) {
    console.error("bookAppointment error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};*/

const bookAppointment = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      doctorName,
      department,
      date,
      time,
      notes,
      status
    } = req.body;

    const appointment = new Appointment({
      patientId,
      doctorId,
      doctorName,
      department,
      date,
      time,
      notes,
      status: "Pending"
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Booking failed"
    });
  }
};
 
/* ─────────────────────────────────────────────────────────────────
   GET /api/patient/appointments/:userId
   Returns all appointments for a patient, newest first
───────────────────────────────────────────────────────────────── */
const getPatientAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ patientId: userId }).sort({
      createdAt: -1,
    });
    return res.json({ success: true, data: appointments });
  } catch (err) {
    console.error("getPatientAppointments error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
 
module.exports = {
  getProfile,
  updateProfile,
  bookAppointment,
  getPatientAppointments,
};
 