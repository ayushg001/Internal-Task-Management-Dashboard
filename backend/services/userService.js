// User Service - Business Logic for Users
const userRepository = require('../repositories/userRepository');

async function getUsers() {
  return await userRepository.getAllUsers();
}

async function getUserById(id) {
  const user = await userRepository.getUserById(id);
  if (!user) {
    const error = new Error(`User with ID ${id} not found`);
    error.statusCode = 404;
    throw error;
  }
  return user;
}

async function createNewUser(userData) {
  if (!userData.name || !userData.email) {
    const error = new Error('Name and email are required fields');
    error.statusCode = 400;
    throw error;
  }

  return await userRepository.createUser(userData);
}

module.exports = {
  getUsers,
  getUserById,
  createNewUser
};
