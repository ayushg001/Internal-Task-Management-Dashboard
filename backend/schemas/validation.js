// Validation Middleware & Helpers

const VALID_STATUSES = ['Pending', 'In Progress', 'Completed', 'Blocked'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

function validateCreateTask(req, res, next) {
  const { title, status, priority, due_date } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Task title is required and cannot be empty.'
    });
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
    });
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`
    });
  }

  if (due_date && isNaN(Date.parse(due_date))) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid due_date format. Must be a valid YYYY-MM-DD date string.'
    });
  }

  next();
}

function validateUpdateTask(req, res, next) {
  const { title, status, priority, due_date } = req.body;

  if (title !== undefined && (!title || !title.trim())) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Task title cannot be empty.'
    });
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
    });
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`
    });
  }

  if (due_date && due_date !== null && isNaN(Date.parse(due_date))) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid due_date format.'
    });
  }

  next();
}

function validateCreateUser(req, res, next) {
  const { name, email } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'User name is required.'
    });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'A valid email address is required.'
    });
  }

  next();
}

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  validateCreateUser,
  VALID_STATUSES,
  VALID_PRIORITIES
};
