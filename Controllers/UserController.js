const User = require("../modals/User");
 
// GET /api/user/doctors
// Returns all users with role "doctor"
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select(
      "-password"
    );
    return res.json({ success: true, data: doctors });
  } catch (err) {
    console.error("getDoctors error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
 
module.exports = { getDoctors };
