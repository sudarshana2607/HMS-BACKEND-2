const mongoose = require("mongoose");
 
const medicineSchema = new mongoose.Schema(
  {
    medicineName: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: "General" },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    price: { type: Number, min: 0, default: 0 },
    supplier: { type: String, trim: true },
    expiryDate: { type: Date },
    batchNumber: { type: String, trim: true },
    manufacturer: { type: String, trim: true },
    description: { type: String, trim: true },
    lowStockThreshold: { type: Number, default: 20 },
  },
  { timestamps: true }
);
 
// Virtual: is this item low stock?
medicineSchema.virtual("isLowStock").get(function () {
  return this.quantity < this.lowStockThreshold;
});
 
module.exports = mongoose.model("Medicine", medicineSchema);