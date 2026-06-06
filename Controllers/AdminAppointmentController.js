const Appointment = require("../Modals/AdminAppointment");
const Doctor      = require("../Modals/Doctor");
const Patient     = require("../Modals/Patient");
 
// ── GET /api/appointment/all ──
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email phone")
      .populate("doctor", "name department specialization")
      .sort({ date: -1 })
      .lean();
 
    // Flatten for easy frontend consumption
    const mapped = appointments.map((a) => ({
      ...a,
      patientName: a.patientName || a.patient?.name || "—",
      doctorName:  a.doctorName  || a.doctor?.name  || "—",
    }));
 
    res.json({ success: true, appointments: mapped });
  } catch (err) {
    console.error("getAllAppointments error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch appointments" });
  }
};
 
// ── GET /api/appointment/:id ──
const getAppointmentById = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id)
      .populate("patient", "name email phone")
      .populate("doctor", "name department specialization")
      .lean();
 
    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });
    res.json({ success: true, appointment: appt });
  } catch (err) {
    console.error("getAppointmentById error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch appointment" });
  }
};
 
// ── POST /api/appointment/book ──
const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time, reason } = req.body;
 
    if (!patientId || !doctorId || !date) {
      return res.status(400).json({ success: false, message: "patientId, doctorId, and date are required" });
    }
 
    // Fetch names for denormalization
    const [patient, doctor] = await Promise.all([
      Patient.findById(patientId).select("name").lean(),
      Doctor.findById(doctorId).select("name").lean(),
    ]);
 
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    if (!doctor)  return res.status(404).json({ success: false, message: "Doctor not found" });
 
    const appointment = await Appointment.create({
      patient: patientId,
      patientName: patient.name,
      doctor: doctorId,
      doctorName: doctor.name,
      date: new Date(date),
      time,
      reason,
    });
 
    res.status(201).json({ success: true, message: "Appointment booked", appointment });
  } catch (err) {
    console.error("bookAppointment error:", err);
    res.status(500).json({ success: false, message: "Failed to book appointment" });
  }
};
 
// ── PUT /api/appointment/:id ──
const updateAppointment = async (req, res) => {
  try {
    const { status, time, date, notes } = req.body;
 
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(time && { time }), ...(date && { date: new Date(date) }), ...(notes && { notes }) },
      { new: true, runValidators: true }
    );
 
    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });
    res.json({ success: true, message: "Appointment updated", appointment: appt });
  } catch (err) {
    console.error("updateAppointment error:", err);
    res.status(500).json({ success: false, message: "Failed to update appointment" });
  }
};
 
// ── DELETE /api/appointment/:id ──
const deleteAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndDelete(req.params.id);
    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });
    res.json({ success: true, message: "Appointment deleted" });
  } catch (err) {
    console.error("deleteAppointment error:", err);
    res.status(500).json({ success: false, message: "Failed to delete appointment" });
  }
};
 
module.exports = {
  getAllAppointments, getAppointmentById,
  bookAppointment, updateAppointment, deleteAppointment,
};
 