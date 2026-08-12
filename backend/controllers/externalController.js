// External Controller - Handles HTTP requests and responses for External API integration
const externalService = require('../services/externalService');

async function getExternalUsers(req, res, next) {
  try {
    const externalUsers = await externalService.fetchExternalUsers();
    res.json({
      source: 'External Public API (JSONPlaceholder)',
      count: externalUsers.length,
      users: externalUsers
    });
  } catch (err) {
    res.status(502).json({
      error: 'Bad Gateway / External Service Error',
      message: err.message
    });
  }
}

module.exports = {
  getExternalUsers
};
