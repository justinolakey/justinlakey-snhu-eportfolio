// Admin-only routes for user management.
// All routes require authentication and the ADMIN role.

const express = require("express");
const { getUsers, updateUserStatus } = require("../controllers/adminController");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate, requireAdmin); // Protect all admin routes
router.get("/users", getUsers); // List all registered users
router.patch("/users/:id/status", updateUserStatus); // Approve, reject, or reset a user

module.exports = router;
