const mongoose = require("mongoose");
 
const billItemSchema = new mongoose.Schema(
  {
    name:      { type: String, default: "" },
    quantity:  { type: Number, default: 0 },
    unitPrice: { type: Number, default: 0 },
    subtotal:  { type: Number, default: 0 },
  },
  { _id: false }
);
 
const pharmacyBillSchema = new mongoose.Schema(
  {
    patientName:   { type: String, required: true, trim: true },
    medicines:     { type: [billItemSchema], default: [] },
    totalAmount:   { type: Number, required: true, min: 0 },
    paid:          { type: Number, default: 0, min: 0 },
    balance:       { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Insurance", "Other"],
      default: "Cash",
    },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Partial", "Cancelled"],
      default: "Pending",
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true, strict: true }
);
 
pharmacyBillSchema.pre("save", function (next) {
  try {
    // Compute subtotals safely
    if (Array.isArray(this.medicines)) {
      this.medicines.forEach((item) => {
        item.subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
      });
    }
    // Compute balance and derive status
    const total = Number(this.totalAmount) || 0;
    const paid  = Number(this.paid) || 0;
    this.balance = total - paid;
    if (this.balance <= 0) this.status = "Paid";
    else if (paid > 0)     this.status = "Partial";
    else                   this.status = this.status || "Pending";
    next();
  } catch (err) {
    next(err);
  }
});
 
module.exports = mongoose.model("PharmacyBill", pharmacyBillSchema);