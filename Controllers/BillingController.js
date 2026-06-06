const PharmacyBill = require("../Modals/PharmacyBill");
 
// GET /api/pharmacy/bills
const getAllBills = async (req, res) => {
  try {
    const bills = await PharmacyBill.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, bills });
  } catch (err) {
    console.error("getAllBills:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
 
// GET /api/pharmacy/bills/:id
const getBillById = async (req, res) => {
  try {
    const bill = await PharmacyBill.findById(req.params.id).lean();
    if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });
    res.json({ success: true, bill });
  } catch (err) {
    console.error("getBillById:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
 
// POST /api/pharmacy/bills
// Body: { patientName, medicines:[{name,quantity,unitPrice}], totalAmount, paid, paymentMethod, notes }
const createBill = async (req, res) => {
  try {
    const { patientName, medicines, totalAmount, paid, paymentMethod, notes } = req.body;
 
    if (!patientName || totalAmount === undefined || totalAmount === "") {
      return res.status(400).json({ success: false, message: "patientName and totalAmount are required" });
    }
 
    // Build only the fields the schema knows about — no patient/prescription refs
    const billData = {
      patientName: String(patientName).trim(),
      medicines:   Array.isArray(medicines) ? medicines : [],
      totalAmount: Number(totalAmount),
      paid:        Number(paid ?? 0),
      paymentMethod: paymentMethod || "Cash",
      notes:       notes || "",
    };
 
    const bill = await PharmacyBill.create(billData);
    res.status(201).json({ success: true, message: "Bill created", bill });
  } catch (err) {
    console.error("createBill:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
 
// PUT /api/pharmacy/bills/:id
const updateBill = async (req, res) => {
  try {
    const bill = await PharmacyBill.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });
    res.json({ success: true, message: "Bill updated", bill });
  } catch (err) {
    console.error("updateBill:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
 
// DELETE /api/pharmacy/bills/:id
const deleteBill = async (req, res) => {
  try {
    const bill = await PharmacyBill.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });
    res.json({ success: true, message: "Bill deleted" });
  } catch (err) {
    console.error("deleteBill:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
 
module.exports = { getAllBills, getBillById, createBill, updateBill, deleteBill };