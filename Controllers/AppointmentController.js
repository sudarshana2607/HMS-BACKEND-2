const Appointment = require("../Modals/AdminAppointment");
 
// POST /api/appointment/create
const createAppointment = async (req, res) => {
  try {
    const { patient, doctor, date, time, reason } = req.body;
 
    if (!patient || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Patient, date, and time are required",
      });
    }
 
    const appointment = await Appointment.create({
      patient,
      doctor,
      date,
      time,
      reason,
      status: "Pending",
    });
 
    const populated = await Appointment.findById(appointment._id).populate(
      "patient",
      "firstname lastname"
    );
 
    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment: populated,
    });
  } catch (error) {
    console.error("createAppointment error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating appointment",
    });
  }
};
 
// GET /api/appointment/all
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "firstname lastname email phone")
      .populate("doctor", "firstname lastname")
      .sort({ createdAt: -1 });
 
    return res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("getAllAppointments error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching appointments",
    });
  }
};
 
// GET /api/appointment/:id
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "firstname lastname email")
      .populate("doctor", "firstname lastname");
 
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
 
    return res.status(200).json({ success: true, appointment });
  } catch (error) {
    console.error("getAppointmentById error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
 
// PATCH /api/appointment/:id/status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Pending", "Confirmed", "Completed", "Cancelled"];
 
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowed.join(", ")}`,
      });
    }
 
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("patient", "firstname lastname");
 
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
 
    return res.status(200).json({
      success: true,
      message: "Status updated",
      appointment,
    });
  } catch (error) {
    console.error("updateAppointmentStatus error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
 
// DELETE /api/appointment/:id
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
 
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
 
    return res.status(200).json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    console.error("deleteAppointment error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
 
module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
};