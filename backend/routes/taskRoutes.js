// Task API Routes
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { validateCreateTask, validateUpdateTask } = require('../schemas/validation');

// Task endpoints
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validateCreateTask, taskController.createTask);
router.put('/:id', validateUpdateTask, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.post('/:id/comments', taskController.addComment);

module.exports = router;
