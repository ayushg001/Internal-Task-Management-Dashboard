// Auth Controller - Handles HTTP requests for Authentication
const authService = require('../services/authService');
const userService = require('../services/userService');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  getMe
};
