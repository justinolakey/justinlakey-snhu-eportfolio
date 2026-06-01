const express = require('express');
const { getUsers, updateUserStatus } = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate, requireAdmin);
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);

module.exports = router;
