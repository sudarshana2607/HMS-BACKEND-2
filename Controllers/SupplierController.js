const Supplier = require("../Modals/Supplier");
 
// GET /api/pharmacy/suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 }).lean();
    res.json({ success: true, suppliers });
  } catch (err) {
    console.error("getAllSuppliers:", err);
    res.status(500).json({ success: false, message: "Failed to fetch suppliers" });
  }
};
 
// GET /api/pharmacy/suppliers/:id
const getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).lean();
    if (!supplier) return res.status(404).json({ success: false, message: "Supplier not found" });
    res.json({ success: true, supplier });
  } catch (err) {
    console.error("getSupplierById:", err);
    res.status(500).json({ success: false, message: "Failed to fetch supplier" });
  }
};
 
// POST /api/pharmacy/suppliers
const addSupplier = async (req, res) => {
  try {
    const { name, email, phone, address, gstNumber, medicines, notes } = req.body;
 
    if (!name) return res.status(400).json({ success: false, message: "Supplier name is required" });
 
    const exists = await Supplier.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, "i") } });
    if (exists) return res.status(409).json({ success: false, message: "Supplier already exists" });
 
    const supplier = await Supplier.create({
      name,
      email,
      phone,
      contact: phone,              // keep alias in sync
      address,
      gstNumber,
      medicines: medicines || [],
      notes,
    });
 
    res.status(201).json({ success: true, message: "Supplier added", supplier });
  } catch (err) {
    console.error("addSupplier:", err);
    res.status(500).json({ success: false, message: "Failed to add supplier" });
  }
};
 
// PUT /api/pharmacy/suppliers/:id
const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!supplier) return res.status(404).json({ success: false, message: "Supplier not found" });
    res.json({ success: true, message: "Supplier updated", supplier });
  } catch (err) {
    console.error("updateSupplier:", err);
    res.status(500).json({ success: false, message: "Failed to update supplier" });
  }
};
 
// DELETE /api/pharmacy/suppliers/:id
const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier) return res.status(404).json({ success: false, message: "Supplier not found" });
    res.json({ success: true, message: "Supplier deleted" });
  } catch (err) {
    console.error("deleteSupplier:", err);
    res.status(500).json({ success: false, message: "Failed to delete supplier" });
  }
};
 
module.exports = { getAllSuppliers, getSupplierById, addSupplier, updateSupplier, deleteSupplier };