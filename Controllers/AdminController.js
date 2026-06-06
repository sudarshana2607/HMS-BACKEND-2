const Doctor      = require("../Modals/Doctor");
const Patient     = require("../Modals/Patient");
const Appointment = require("../Modals/AdminAppointment");
const Activity    = require("../Modals/Activity");
const Billing     = require("../Modals/Billing");
 
// ── GET /api/admin/stats ──
const getStats = async (req, res) => {
  try {
    const [doctors, patients, appointments, staffCount, billingAgg] = await Promise.all([
      Doctor.countDocuments(),
      Patient.countDocuments(),
      Appointment.countDocuments(),
      // Staff can be a separate model; using Doctor as proxy for now
      Doctor.countDocuments({ status: "Active" }),
      // Sum of paid billing for the current month
      Billing.aggregate([
        {
          $match: {
            invoiceDate: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
            status: { $in: ["Paid", "Partial"] },
          },
        },
        { $group: { _id: null, total: { $sum: "$paid" } } },
      ]),
    ]);
 
    const revenue = billingAgg[0]?.total ?? 0;
 
    res.json({
      success: true,
      data: {
        doctors,
        patients,
        appointments,
        staff: staffCount,
        revenue: `₹${revenue.toLocaleString("en-IN")}`,
      },
    });
  } catch (err) {
    console.error("getStats error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};
 
// ── GET /api/admin/recent-activities ──
const getRecentActivities = async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000); // last 24 hrs
    const activities = await Activity.find({ createdAt: { $gte: since } })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
 
    res.json({ success: true, activities });
  } catch (err) {
    console.error("getRecentActivities error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch activities" });
  }
};
 
// ── POST /api/admin/log-activity  (internal helper, can also call directly) ──
const logActivity = async (user, activity, status = "Completed", meta = {}) => {
  try {
    await Activity.create({ user, activity, status, meta });
  } catch (err) {
    console.error("logActivity error:", err);
  }
};
 
module.exports = { getStats, getRecentActivities, logActivity };