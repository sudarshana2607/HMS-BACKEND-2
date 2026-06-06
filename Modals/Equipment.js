const mongoose = require("mongoose");
 
const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Operational", "Under Maintenance", "Out of Service"],
      default: "Operational",
    },
    lastMaintenance: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Equipment", equipmentSchema);