// API Documentation Controller
function getApiDocs(req, res) {
  res.json({
    title: 'Internal Task & Management API',
    version: '1.0.0',
    description: 'REST API endpoints for tasks, users, activity logs, attachments, and dashboard metrics.',
    endpoints: [
      { method: 'GET', path: '/api/dashboard', description: 'Get dashboard summary metrics' },
      { method: 'GET', path: '/api/tasks', description: 'List tasks with status, priority, assignee filters, search & pagination' },
      { method: 'GET', path: '/api/tasks/:id', description: 'Get task details with comments, activity logs & attachments' },
      { method: 'POST', path: '/api/tasks', description: 'Create a new task' },
      { method: 'PUT', path: '/api/tasks/:id', description: 'Update an existing task' },
      { method: 'DELETE', path: '/api/tasks/:id', description: 'Delete a task' },
      { method: 'POST', path: '/api/tasks/:id/comments', description: 'Add a comment/note to a task' },
      { method: 'POST', path: '/api/tasks/:id/attachments', description: 'Attach a file to a task' },
      { method: 'GET', path: '/api/users', description: 'List all team members' },
      { method: 'GET', path: '/api/external/users', description: 'Fetch users from external API' }
    ]
  });
}

module.exports = {
  getApiDocs
};
