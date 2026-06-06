const express = require("express");
const router = express.Router();
const { getStats, getRecentActivities } = require("../Controllers/AdminController");
 
// GET /api/admin/stats
router.get("/stats", getStats);
 
// GET /api/admin/recent-activities
router.get("/recent-activities", getRecentActivities);
 
module.exports = router;