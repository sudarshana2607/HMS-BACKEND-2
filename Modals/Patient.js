const mongoose = require("mongoose");
 
const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    address: { type: String, trim: true },
    bloodGroup: { type: String, trim: true },
    status: { type: String, enum: ["Active", "Inactive", "Admitted", "Discharged"], default: "Active" },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Patient", patientSchema);
 