const express = require('express');
const { getCommunities, getCommunityById, createCommunity } = require('../controllers/communityController');
const { authenticate, requireApproved } = require('../middleware/auth');

const router = express.Router();

router.get('/', getCommunities);
router.get('/:id', getCommunityById);
router.post('/', authenticate, requireApproved, createCommunity);

module.exports = router;
