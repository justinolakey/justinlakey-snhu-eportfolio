const express = require('express');
const { getHomes } = require('../controllers/homeController');

const router = express.Router();

router.get('/', getHomes);

module.exports = router;
