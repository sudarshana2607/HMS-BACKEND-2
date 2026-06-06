const mongoose = require("mongoose");
 
const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    department: { type: String, trim: true },
    specialization: { type: String, trim: true },
    qualification: { type: String, trim: true },
    experience: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Inactive", "On Leave"], default: "Active" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Doctor", doctorSchema);
 