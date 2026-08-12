// Seed Script
const db = require('./db');
const bcrypt = require('bcryptjs');

const initialUsers = [
  { name: 'Ayush', email: 'ayush@company.com', password: 'ayush@123', role: 'Project Manager' },
  { name: 'Dinesh', email: 'dinesh@company.com', password: 'dinesh@123', role: 'Senior Developer' },
  { name: 'Bharat', email: 'bharat@company.com', password: 'bharat@123', role: 'Frontend Engineer' }
];

const initialTasks = [
  {
    title: 'Setup PostgreSQL Database and Migration Scripts',
    description: 'Configure production database schemas, index constraints, and database connection pooling.',
    status: 'Completed',
    priority: 'High',
    assigned_to: 1,
    due_date: '2026-08-01'
  },
  {
    title: 'Design UI Layout for Task Management Dashboard',
    description: 'Create responsive wireframes and layout components using Tailwind CSS.',
    status: 'Completed',
    priority: 'Medium',
    assigned_to: 3,
    due_date: '2026-08-05'
  },
  {
    title: 'Integrate External Shopify Sync API',
    description: 'Build backend middleware service to fetch product inventory updates from external API.',
    status: 'In Progress',
    priority: 'Urgent',
    assigned_to: 2,
    due_date: '2026-08-15'
  },
  {
    title: 'Implement Task Search and Sorting Filters',
    description: 'Add backend query parameters for search keyword, status, priority, and pagination.',
    status: 'In Progress',
    priority: 'High',
    assigned_to: 3,
    due_date: '2026-08-14'
  },
  {
    title: 'Fix Authentication Session Timeout Bug',
    description: 'User tokens expire prematurely when opening multiple browser tabs simultaneously.',
    status: 'Blocked',
    priority: 'Urgent',
    assigned_to: 1,
    due_date: '2026-08-10'
  },
  {
    title: 'Write API Documentation and Postman Collection',
    description: 'Document all REST endpoint parameters, request schemas, and sample response objects.',
    status: 'Pending',
    priority: 'Low',
    assigned_to: 2,
    due_date: '2026-08-20'
  }
];

const initialComments = [
  { task_id: 3, user_id: 2, comment: 'Started working on rate-limit handling for the Shopify endpoint.' },
  { task_id: 3, user_id: 1, comment: 'Please ensure timeout is configured to 5 seconds max.' },
  { task_id: 5, user_id: 1, comment: 'Waiting for security team review on JWT refresh cookie settings.' }
];

const initialLogs = [
  { task_id: 3, user_id: 2, action: 'Task status changed to In Progress' },
  { task_id: 5, user_id: 1, action: 'Task status marked as Blocked' },
  { task_id: 1, user_id: 1, action: 'Task completed and verified' }
];

async function seed() {
  console.log('Seeding database...');
  try {
    const existingUsers = await db.query('SELECT COUNT(*) as count FROM users');
    if (parseInt(existingUsers[0]?.count || 0) > 0) {
      console.log('Database already seeded.');
      return;
    }

    for (const u of initialUsers) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      await db.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        [u.name, u.email, hashedPassword, u.role]
      );
    }

    for (const t of initialTasks) {
      await db.query(
        'INSERT INTO tasks (title, description, status, priority, assigned_to, due_date) VALUES ($1, $2, $3, $4, $5, $6)',
        [t.title, t.description, t.status, t.priority, t.assigned_to, t.due_date]
      );
    }

    for (const c of initialComments) {
      await db.query('INSERT INTO comments (task_id, user_id, comment) VALUES ($1, $2, $3)', [c.task_id, c.user_id, c.comment]);
    }

    for (const l of initialLogs) {
      await db.query('INSERT INTO activity_logs (task_id, user_id, action) VALUES ($1, $2, $3)', [l.task_id, l.user_id, l.action]);
    }

    console.log('Database seed completed successfully!');
  } catch (err) {
    console.error('Seed error:', err.message);
  }
}

if (require.main === module) {
  seed().then(() => process.exit(0));
}

module.exports = seed;
