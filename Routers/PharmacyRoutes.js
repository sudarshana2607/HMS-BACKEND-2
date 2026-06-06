const express = require("express");
const router  = express.Router();
 
const {
  getAllMedicines, getLowStockMedicines, getMedicineById,
  addMedicine, dispenseMedicine, updateMedicine, deleteMedicine,
} = require("../Controllers/MedicineController");
 
const {
  getAllPrescriptions, getPrescriptionById,
  createPrescription, dispensePrescription,
  updatePrescription, deletePrescription,
} = require("../Controllers/PrescriptionController");
 
const {
  getAllBills, getBillById, createBill, updateBill, deleteBill,
} = require("../Controllers/BillingController");
 
const {
  getAllSuppliers, getSupplierById, addSupplier, updateSupplier, deleteSupplier,
} = require("../Controllers/SupplierController");
 
// ─────────────────────────────────────────
//  MEDICINE ROUTES
//  CRITICAL ORDER: literal paths BEFORE /:id params
// ─────────────────────────────────────────
// GET  /api/pharmacy/medicines/low-stock  ← must come before /:id
router.get("/medicines/low-stock",   getLowStockMedicines);
// POST /api/pharmacy/medicines/dispense   ← must come before /:id
router.post("/medicines/dispense",   dispenseMedicine);
// GET  /api/pharmacy/medicines
router.get("/medicines",             getAllMedicines);
// POST /api/pharmacy/medicines
router.post("/medicines",            addMedicine);
// GET  /api/pharmacy/medicines/:id
router.get("/medicines/:id",         getMedicineById);
// PUT  /api/pharmacy/medicines/:id
router.put("/medicines/:id",         updateMedicine);
// DELETE /api/pharmacy/medicines/:id
router.delete("/medicines/:id",      deleteMedicine);
 
// ─────────────────────────────────────────
//  PRESCRIPTION ROUTES
//  CRITICAL ORDER: /prescriptions/:id/dispense BEFORE /:id
// ─────────────────────────────────────────
// GET  /api/pharmacy/prescriptions
router.get("/prescriptions",                   getAllPrescriptions);
// POST /api/pharmacy/prescriptions
router.post("/prescriptions",                  createPrescription);
// PUT  /api/pharmacy/prescriptions/:id/dispense  ← must come before /:id
router.put("/prescriptions/:id/dispense",      dispensePrescription);
// GET  /api/pharmacy/prescriptions/:id
router.get("/prescriptions/:id",               getPrescriptionById);
// PUT  /api/pharmacy/prescriptions/:id
router.put("/prescriptions/:id",               updatePrescription);
// DELETE /api/pharmacy/prescriptions/:id
router.delete("/prescriptions/:id",            deletePrescription);
 
// ─────────────────────────────────────────
//  BILLING ROUTES
// ─────────────────────────────────────────
// GET  /api/pharmacy/bills
router.get("/bills",        getAllBills);
// POST /api/pharmacy/bills
router.post("/bills",       createBill);
// GET  /api/pharmacy/bills/:id
router.get("/bills/:id",    getBillById);
// PUT  /api/pharmacy/bills/:id
router.put("/bills/:id",    updateBill);
// DELETE /api/pharmacy/bills/:id
router.delete("/bills/:id", deleteBill);
 
// ─────────────────────────────────────────
//  SUPPLIER ROUTES
// ─────────────────────────────────────────
// GET  /api/pharmacy/suppliers
router.get("/suppliers",        getAllSuppliers);
// POST /api/pharmacy/suppliers
router.post("/suppliers",       addSupplier);
// GET  /api/pharmacy/suppliers/:id
router.get("/suppliers/:id",    getSupplierById);
// PUT  /api/pharmacy/suppliers/:id
router.put("/suppliers/:id",    updateSupplier);
// DELETE /api/pharmacy/suppliers/:id
router.delete("/suppliers/:id", deleteSupplier);
 
module.exports = router;
 