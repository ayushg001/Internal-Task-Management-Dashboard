// Task Service - Business Logic for Tasks & Activity Audit Logs
const taskRepository = require('../repositories/taskRepository');
const commentRepository = require('../repositories/commentRepository');
const logRepository = require('../repositories/logRepository');
const userRepository = require('../repositories/userRepository');

async function getTasks(filters) {
  return await taskRepository.findTasks(filters);
}

async function getTaskDetails(taskId) {
  const task = await taskRepository.getTaskById(taskId);
  if (!task) {
    const error = new Error(`Task with ID ${taskId} not found`);
    error.statusCode = 404;
    throw error;
  }

  const comments = await commentRepository.getCommentsByTaskId(taskId);
  const logs = await logRepository.getLogsByTaskId(taskId);

  return { ...task, comments, logs };
}

async function createNewTask(taskData) {
  if (taskData.assigned_to) {
    const user = await userRepository.getUserById(taskData.assigned_to);
    if (!user) {
      const error = new Error(`Assigned user with ID ${taskData.assigned_to} does not exist`);
      error.statusCode = 400;
      throw error;
    }
  }

  const newTask = await taskRepository.createTask(taskData);
  await logRepository.addLog({
    task_id: newTask.id,
    user_id: taskData.user_id || null,
    action: `Task created: ${newTask.title}`
  });

  return newTask;
}

async function updateExistingTask(taskId, taskData) {
  const existing = await taskRepository.getTaskById(taskId);
  if (!existing) {
    const error = new Error(`Task with ID ${taskId} not found`);
    error.statusCode = 404;
    throw error;
  }

  const updatedTask = await taskRepository.updateTask(taskId, taskData);

  // Log status change
  if (taskData.status && taskData.status !== existing.status) {
    await logRepository.addLog({
      task_id: taskId,
      user_id: taskData.user_id || null,
      action: `Status changed from ${existing.status} to ${taskData.status}`
    });
  }

  return updatedTask;
}

async function removeTask(taskId) {
  const existing = await taskRepository.getTaskById(taskId);
  if (!existing) {
    const error = new Error(`Task with ID ${taskId} not found`);
    error.statusCode = 404;
    throw error;
  }

  return await taskRepository.deleteTask(taskId);
}

async function addTaskComment(taskId, { user_id, comment }) {
  if (!comment || !comment.trim()) {
    const error = new Error('Comment content cannot be empty');
    error.statusCode = 400;
    throw error;
  }

  const newComment = await commentRepository.createComment({
    task_id: taskId,
    user_id: user_id || null,
    comment: comment.trim()
  });

  await logRepository.addLog({
    task_id: taskId,
    user_id: user_id || null,
    action: 'Added a new comment'
  });

  return newComment;
}

module.exports = {
  getTasks,
  getTaskDetails,
  createNewTask,
  updateExistingTask,
  removeTask,
  addTaskComment
};
