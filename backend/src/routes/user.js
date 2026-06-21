// User authentication routes (public — no auth middleware required).

const express = require("express");
const { register, login } = require("../controllers/userController");

const router = express.Router();

router.post("/register", register); // Create a new user account
router.post("/login", login); // Authenticate and receive a JWT token

module.exports = router;
