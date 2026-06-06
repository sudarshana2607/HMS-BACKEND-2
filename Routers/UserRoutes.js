const express = require("express");
const router  = express.Router();
const { getDoctors } = require("../Controllers/UserController");
const { signup, login } = require("../Controllers/AuthController");
 
// POST /api/user/signup
router.post("/signup", signup);
 
// POST /api/user/login
router.post("/login", login);
 
// GET /api/user/doctors
router.get("/doctors", getDoctors);
 
module.exports = router;

/*const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getUsers,
  getDoctors
} = require("../Controllers/UserController");



router.post("/signup",signup);

router.post("/login",login);

router.get("/all",getUsers);

router.get("/doctors",getDoctors);

module.exports=router;*/
 