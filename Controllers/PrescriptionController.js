const Prescription = require("../Modals/Prescription");
const Medicine     = require("../Modals/Medicine");
 
// GET /api/pharmacy/prescriptions
const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, prescriptions });
  } catch (err) {
    console.error("getAllPrescriptions:", err);
    res.status(500).json({ success: false, message: "Failed to fetch prescriptions" });
  }
};
 
// GET /api/pharmacy/prescriptions/:id
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).lean();
    if (!prescription) return res.status(404).json({ success: false, message: "Prescription not found" });
    res.json({ success: true, prescription });
  } catch (err) {
    console.error("getPrescriptionById:", err);
    res.status(500).json({ success: false, message: "Failed to fetch prescription" });
  }
};
 
// POST /api/pharmacy/prescriptions
const createPrescription = async (req, res) => {
  try {
    const { patientName, patient, doctorName, doctor, medicine, quantity, dosage, instructions, notes } = req.body;
 
    if (!patientName || !medicine || !quantity) {
      return res.status(400).json({ success: false, message: "patientName, medicine, and quantity are required" });
    }
 
    const prescription = await Prescription.create({
      patientName,
      patient,
      doctorName,
      doctor,
      medicine,
      medicineName: medicine,       // keep alias in sync
      quantity: Number(quantity),
      dosage,
      instructions,
      notes,
      status: "Pending",
    });
 
    res.status(201).json({ success: true, message: "Prescription created", prescription });
  } catch (err) {
    console.error("createPrescription:", err);
    res.status(500).json({ success: false, message: "Failed to create prescription" });
  }
};
 
// PUT /api/pharmacy/prescriptions/:id/dispense
// ⚠️ Registered BEFORE /:id in routes to avoid Express collision
// Marks prescription Dispensed AND deducts stock from inventory
const dispensePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ success: false, message: "Prescription not found" });
 
    if (prescription.status === "Dispensed") {
      return res.status(400).json({ success: false, message: "Prescription already dispensed" });
    }
    if (prescription.status === "Cancelled") {
      return res.status(400).json({ success: false, message: "Cannot dispense a cancelled prescription" });
    }
 
    // Deduct from Medicine inventory (case-insensitive match)
    const medicine = await Medicine.findOne({
      medicineName: { $regex: new RegExp(`^${prescription.medicine.trim()}$`, "i") },
    });
 
    if (medicine) {
      if (medicine.quantity < prescription.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${prescription.medicine}". Available: ${medicine.quantity}, Required: ${prescription.quantity}`,
        });
      }
      medicine.quantity -= prescription.quantity;
      await medicine.save();
    }
    // If medicine not in inventory, still allow dispense (external stock scenario)
 
    prescription.status = "Dispensed";
    prescription.dispensedAt = new Date();
    await prescription.save();
 
    res.json({ success: true, message: "Prescription dispensed successfully", prescription });
  } catch (err) {
    console.error("dispensePrescription:", err);
    res.status(500).json({ success: false, message: "Failed to dispense prescription" });
  }
};
 
// PUT /api/pharmacy/prescriptions/:id
const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!prescription) return res.status(404).json({ success: false, message: "Prescription not found" });
    res.json({ success: true, message: "Prescription updated", prescription });
  } catch (err) {
    console.error("updatePrescription:", err);
    res.status(500).json({ success: false, message: "Failed to update prescription" });
  }
};
 
// DELETE /api/pharmacy/prescriptions/:id
const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) return res.status(404).json({ success: false, message: "Prescription not found" });
    res.json({ success: true, message: "Prescription deleted" });
  } catch (err) {
    console.error("deletePrescription:", err);
    res.status(500).json({ success: false, message: "Failed to delete prescription" });
  }
};
 
module.exports = {
  getAllPrescriptions, getPrescriptionById,
  createPrescription, dispensePrescription,
  updatePrescription, deletePrescription,
};
 