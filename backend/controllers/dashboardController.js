// Dashboard Controller - Handles HTTP requests and responses for Dashboard overview
const dashboardService = require('../services/dashboardService');

async function getDashboard(req, res, next) {
  try {
    const { userId } = req.query;
    const stats = await dashboardService.getDashboardSummary(userId ? parseInt(userId) : null);
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboard
};
