// External Integration API Routes
const express = require('express');
const router = express.Router();
const externalController = require('../controllers/externalController');

// External users endpoint
router.get('/users', externalController.getExternalUsers);

module.exports = router;
