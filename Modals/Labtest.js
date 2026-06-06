const mongoose = require("mongoose");
 
const labTestSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testName: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["Normal", "Emergency"],
      default: "Normal",
    },
    status: {
      type: String,
      enum: ["Pending", "Sample Collected", "Processing", "Completed"],
      default: "Pending",
    },
    report: {
      type: String,
      default: "",
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("LabTest", labTestSchema);