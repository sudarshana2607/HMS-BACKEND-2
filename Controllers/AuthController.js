const bcrypt = require("bcryptjs");
const User = require("../Modals/User");
 
/* ─────────────────────────────────────────────────────────────────
   POST /api/user/signup
───────────────────────────────────────────────────────────────── */
const signup = async (req, res) => {
  try {
    const { firstname, middlename, lastname, email, phone, password, role } = req.body;
 
    if (!firstname || !lastname || !email || !phone || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
 
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }
 
    const hashed = await bcrypt.hash(password, 10);
 
    const user = await User.create({
      firstname,
      middlename: middlename || "",
      lastname,
      email: email.toLowerCase(),
      phone,
      password: hashed,
      role,
    });
 
    return res.status(201).json({
      success: true,
      message: "Signup successful! Please login.",
      user: {
        _id:       user._id,
        firstname: user.firstname,
        lastname:  user.lastname,
        email:     user.email,
        phone:     user.phone,
        role:      user.role,
      },
    });
  } catch (err) {
    console.error("signup error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
 
/* ─────────────────────────────────────────────────────────────────
   POST /api/user/login
───────────────────────────────────────────────────────────────── */
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
 
    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: "Email, password and role are required" });
    }
 
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
 
    // Role check
    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `This account is registered as '${user.role}', not '${role}'`,
      });
    }
 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
 
    return res.json({
      success: true,
      message: "Login successful",
      user: {
        _id:        user._id,
        firstname:  user.firstname,
        lastname:   user.lastname,
        email:      user.email,
        phone:      user.phone,
        role:       user.role,
        bloodGroup: user.bloodGroup || "",
        age:        user.age        || "",
        gender:     user.gender     || "",
        address:    user.address    || "",
        emergencyContact: user.emergencyContact || "",
        department: user.department || "",
      },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
 
module.exports = { signup, login };
 