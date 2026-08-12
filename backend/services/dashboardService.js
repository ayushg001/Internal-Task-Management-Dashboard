// Dashboard Service - Business Logic for Dashboard Overview
const taskRepository = require('../repositories/taskRepository');

async function getDashboardSummary(userId = null) {
  return await taskRepository.getDashboardMetrics(userId);
}

module.exports = {
  getDashboardSummary
};
