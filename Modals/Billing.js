const mongoose = require("mongoose");
 
const billingSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    patientName: { type: String, trim: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    department: { type: String, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paid: { type: Number, default: 0, min: 0 },
    balance: { type: Number, default: 0 },
    paymentMethod: { type: String, enum: ["Cash", "Card", "UPI", "Insurance", "Other"], default: "Cash" },
    status: { type: String, enum: ["Paid", "Pending", "Partial", "Cancelled"], default: "Pending" },
    invoiceDate: { type: Date, default: Date.now },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);
 
// Auto-calculate balance before save
billingSchema.pre("save", function (next) {
  this.balance = this.amount - this.paid;
  if (this.balance <= 0) this.status = "Paid";
  else if (this.paid > 0) this.status = "Partial";
  next();
});
 
module.exports = mongoose.model("Billing", billingSchema);
 