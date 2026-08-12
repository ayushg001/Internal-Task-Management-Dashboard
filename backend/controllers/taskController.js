// Task Controller - Handles HTTP requests and responses for Tasks & Comments
const taskService = require('../services/taskService');

async function getTasks(req, res, next) {
  try {
    const { status, priority, assignee, search, page, limit, sortBy, sortOrder } = req.query;
    
    const result = await taskService.getTasks({
      status,
      priority,
      assignee,
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      sortBy: sortBy || 'created_at',
      sortOrder: sortOrder || 'DESC'
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getTaskById(req, res, next) {
  try {
    const taskId = parseInt(req.params.id);
    const task = await taskService.getTaskDetails(taskId);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const newTask = await taskService.createNewTask(req.body);
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const taskId = parseInt(req.params.id);
    const updatedTask = await taskService.updateExistingTask(taskId, req.body);
    res.json(updatedTask);
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const taskId = parseInt(req.params.id);
    await taskService.removeTask(taskId);
    res.json({ message: `Task ${taskId} successfully deleted`, id: taskId });
  } catch (err) {
    next(err);
  }
}

async function addComment(req, res, next) {
  try {
    const taskId = parseInt(req.params.id);
    const { user_id, comment } = req.body;
    const newComment = await taskService.addTaskComment(taskId, { user_id, comment });
    res.status(201).json(newComment);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addComment
};
