// User API Routes
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateCreateUser } = require('../schemas/validation');

// User endpoints
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', validateCreateUser, userController.createUser);

module.exports = router;
