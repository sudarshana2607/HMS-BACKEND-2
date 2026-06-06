const Schedule = require("../Modals/ScheduleModal");
 
// POST /api/schedule/create
const createSchedule = async (req, res) => {
  try {
    const { day, time, activity, doctor } = req.body;
 
    if (!day || !time || !activity) {
      return res.status(400).json({
        success: false,
        message: "Day, time, and activity are required",
      });
    }
 
    const schedule = await Schedule.create({ day, time, activity, doctor });
 
    return res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      schedule,
    });
  } catch (error) {
    console.error("createSchedule error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating schedule",
    });
  }
};
 
// GET /api/schedule/all
const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("doctor", "firstname lastname email")
      .sort({ createdAt: -1 });
 
    return res.status(200).json({
      success: true,
      schedules,
    });
  } catch (error) {
    console.error("getAllSchedules error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching schedules",
    });
  }
};
 
// GET /api/schedule/:id
const getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate(
      "doctor",
      "firstname lastname"
    );
 
    if (!schedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }
 
    return res.status(200).json({ success: true, schedule });
  } catch (error) {
    console.error("getScheduleById error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
 
// DELETE /api/schedule/:id
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
 
    if (!schedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }
 
    return res.status(200).json({ success: true, message: "Schedule deleted" });
  } catch (error) {
    console.error("deleteSchedule error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
 
module.exports = { createSchedule, getAllSchedules, getScheduleById, deleteSchedule };