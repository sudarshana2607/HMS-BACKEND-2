const mongoose = require("mongoose");
 
const userSchema = new mongoose.Schema(
  {
    firstname:        { type: String, required: true, trim: true },
    lastname:         { type: String, required: true, trim: true },
    email:            { type: String, required: true, unique: true, lowercase: true },
    password:         { type: String, required: true },
    role:             { type: String, enum: ["admin", "doctor", "patient", "nurse", "billing", "lab", "reception", "pharmacy"], default: "patient" },
    phone:            { type: String, default: "" },
    age:              { type: Number, default: null },
    gender:           { type: String, default: "" },
    bloodGroup:       { type: String, default: "" },
    address:          { type: String, default: "" },
    emergencyContact: { type: String, default: "" },
    department:       { type: String, default: "" }, // for doctors
  },
  { timestamps: true }
);
 
module.exports = mongoose.models.User || mongoose.model("User", userSchema);