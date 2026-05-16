const express = require('express');
const { getCommunities, getCommunityById } = require('../controllers/communityController');

const router = express.Router();

router.get('/', getCommunities);
router.get('/:id', getCommunityById);

module.exports = router;
