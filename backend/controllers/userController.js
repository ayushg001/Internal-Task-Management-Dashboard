// User Controller - Handles HTTP requests and responses for Users
const userService = require('../services/userService');

async function getUsers(req, res, next) {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const userId = parseInt(req.params.id);
    const user = await userService.getUserById(userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const newUser = await userService.createNewUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser
};
