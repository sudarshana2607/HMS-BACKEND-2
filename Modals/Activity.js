const mongoose = require("mongoose");
 
const activitySchema = new mongoose.Schema(
  {
    user: { type: String, required: true, trim: true },
    activity: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Completed", "Pending", "Failed", "Cancelled"],
      default: "Completed",
    },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);
 
// Auto-delete activity logs older than 30 days
activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
 
module.exports = mongoose.model("Activity", activitySchema);
 