const mongoose = require("mongoose");
 
/* ─── Patient Profile ─────────────────────────────────────────────────────── */
const patientProfileSchema = new mongoose.Schema(
  {
    userId:           { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    firstname:        { type: String, default: "" },
    lastname:         { type: String, default: "" },
    email:            { type: String, default: "" },
    phone:            { type: String, default: "" },
    age:              { type: Number, default: null },
    gender:           { type: String, default: "" },
    bloodGroup:       { type: String, default: "" },
    address:          { type: String, default: "" },
    emergencyContact: { type: String, default: "" },
  },
  { timestamps: true }
);
 
/* ─── Appointment ─────────────────────────────────────────────────────────── */
const appointmentSchema = new mongoose.Schema(
  {
    patientId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorName: { type: String, default: "" },
    department: { type: String, default: "" },
    date:       { type: String, required: true },   // stored as "YYYY-MM-DD"
    time:       { type: String, required: true },   // stored as "HH:MM"
    notes:      { type: String, default: "" },
    status:     {
      type:    String,
      enum:    ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);
 
const PatientProfile = mongoose.model("PatientProfile", patientProfileSchema);
const Appointment    = mongoose.model("Appointment",    appointmentSchema);
 
module.exports = { PatientProfile, Appointment };