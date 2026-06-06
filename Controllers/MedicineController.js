const Medicine = require("../Modals/Medicine");
 
// GET /api/pharmacy/medicines
const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ medicineName: 1 }).lean();
    res.json({ success: true, medicines });
  } catch (err) {
    console.error("getAllMedicines:", err);
    res.status(500).json({ success: false, message: "Failed to fetch medicines" });
  }
};
 
// GET /api/pharmacy/medicines/low-stock
// ⚠️ Registered BEFORE /:id in routes to avoid Express collision
const getLowStockMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({
      $expr: { $lt: ["$quantity", "$lowStockThreshold"] },
    }).sort({ quantity: 1 }).lean();
    res.json({ success: true, medicines });
  } catch (err) {
    console.error("getLowStockMedicines:", err);
    res.status(500).json({ success: false, message: "Failed to fetch low stock" });
  }
};
 
// GET /api/pharmacy/medicines/:id
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).lean();
    if (!medicine) return res.status(404).json({ success: false, message: "Medicine not found" });
    res.json({ success: true, medicine });
  } catch (err) {
    console.error("getMedicineById:", err);
    res.status(500).json({ success: false, message: "Failed to fetch medicine" });
  }
};
 
// POST /api/pharmacy/medicines
const addMedicine = async (req, res) => {
  try {
    const {
      medicineName, category, quantity, price,
      supplier, expiryDate, batchNumber, manufacturer, lowStockThreshold,
    } = req.body;
 
    if (!medicineName || quantity === undefined || quantity === "") {
      return res.status(400).json({ success: false, message: "medicineName and quantity are required" });
    }
 
    const medicine = await Medicine.create({
      medicineName,
      category: category || "General",
      quantity: Number(quantity),
      price: Number(price) || 0,
      supplier,
      expiryDate: expiryDate || undefined,
      batchNumber,
      manufacturer,
      ...(lowStockThreshold ? { lowStockThreshold: Number(lowStockThreshold) } : {}),
    });
 
    res.status(201).json({ success: true, message: "Medicine added to inventory", medicine });
  } catch (err) {
    console.error("addMedicine:", err);
    res.status(500).json({ success: false, message: "Failed to add medicine" });
  }
};
 
// POST /api/pharmacy/medicines/dispense
// ⚠️ Registered BEFORE /:id in routes to avoid Express collision
const dispenseMedicine = async (req, res) => {
  try {
    const { medicineName, quantity, patientId } = req.body;
 
    if (!medicineName || !quantity) {
      return res.status(400).json({ success: false, message: "medicineName and quantity are required" });
    }
 
    const medicine = await Medicine.findOne({
      medicineName: { $regex: new RegExp(`^${medicineName.trim()}$`, "i") },
    });
 
    if (!medicine) {
      return res.status(404).json({ success: false, message: `"${medicineName}" not found in inventory` });
    }
 
    if (medicine.quantity < Number(quantity)) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${medicine.quantity}, Requested: ${quantity}`,
      });
    }
 
    medicine.quantity -= Number(quantity);
    await medicine.save();
 
    res.json({
      success: true,
      message: `Dispensed ${quantity} unit(s) of ${medicineName}`,
      remainingStock: medicine.quantity,
      medicine,
    });
  } catch (err) {
    console.error("dispenseMedicine:", err);
    res.status(500).json({ success: false, message: "Failed to dispense medicine" });
  }
};
 
// PUT /api/pharmacy/medicines/:id
const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!medicine) return res.status(404).json({ success: false, message: "Medicine not found" });
    res.json({ success: true, message: "Medicine updated", medicine });
  } catch (err) {
    console.error("updateMedicine:", err);
    res.status(500).json({ success: false, message: "Failed to update medicine" });
  }
};
 
// DELETE /api/pharmacy/medicines/:id
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) return res.status(404).json({ success: false, message: "Medicine not found" });
    res.json({ success: true, message: "Medicine deleted" });
  } catch (err) {
    console.error("deleteMedicine:", err);
    res.status(500).json({ success: false, message: "Failed to delete medicine" });
  }
};
 
module.exports = {
  getAllMedicines, getLowStockMedicines, getMedicineById,
  addMedicine, dispenseMedicine, updateMedicine, deleteMedicine,
};
 