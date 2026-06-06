const mongoose = require("mongoose");
 
const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    patientName: { type: String, trim: true },   // denormalized for fast reads
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    doctorName: { type: String, trim: true },     // denormalized for fast reads
    date: { type: Date, required: true },
    time: { type: String, trim: true },
    reason: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);
 
module.exports = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);
 