const mongoose = require("mongoose");
 
const prescriptionSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    doctorName:  { type: String, trim: true },
    medicine:    { type: String, required: true, trim: true },
    quantity:    { type: Number, required: true, min: 1 },
    dosage:      { type: String, trim: true },
    instructions:{ type: String, trim: true },
    status: {
      type: String,
      enum: ["Pending", "Dispensed", "Cancelled", "On Hold"],
      default: "Pending",
    },
    dispensedAt: { type: Date },
    notes:       { type: String, trim: true },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Prescription", prescriptionSchema);
 