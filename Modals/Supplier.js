const mongoose = require("mongoose");
 
const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    contact: { type: String, trim: true }, // alias for phone
    address: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    medicines: [{ type: String }],          // list of medicines they supply
    status: {
      type: String,
      enum: ["Active", "Inactive", "Blacklisted"],
      default: "Active",
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);
 
module.exports = mongoose.model("Supplier", supplierSchema);
 