// Dashboard API Routes
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Dashboard summary endpoint
router.get('/', dashboardController.getDashboard);

module.exports = router;
