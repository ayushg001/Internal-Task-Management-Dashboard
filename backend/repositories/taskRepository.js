// Task Repository - Handles PostgreSQL queries for Tasks
const db = require('../db');

async function findTasks({ status, priority, assignee, search, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'DESC' }) {
  const offset = (page - 1) * limit;
  const whereClauses = [];
  const params = [];

  if (status) {
    params.push(status);
    whereClauses.push(`LOWER(t.status) = LOWER($${params.length})`);
  }

  if (priority) {
    params.push(priority);
    whereClauses.push(`LOWER(t.priority) = LOWER($${params.length})`);
  }

  if (assignee) {
    params.push(parseInt(assignee));
    whereClauses.push(`t.assigned_to = $${params.length}`);
  }

  if (search) {
    params.push(`%${search}%`);
    const idx = params.length;
    whereClauses.push(`(t.title ILIKE $${idx} OR t.description ILIKE $${idx})`);
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const allowedSortColumns = ['id', 'title', 'status', 'priority', 'due_date', 'created_at', 'updated_at'];
  const safeSortBy = allowedSortColumns.includes(sortBy) ? `t.${sortBy}` : 't.created_at';
  const safeOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  // Count Query for Pagination
  const countSql = `SELECT COUNT(*) as total FROM tasks t ${whereString}`;
  const countRes = await db.query(countSql, params);
  const totalItems = parseInt(countRes[0]?.total || 0);

  // Data Query
  const limitParamIdx = params.length + 1;
  const offsetParamIdx = params.length + 2;
  const queryParams = [...params, limit, offset];

  const dataSql = `
    SELECT 
      t.id, t.title, t.description, t.status, t.priority, 
      t.assigned_to, t.due_date, t.created_at, t.updated_at,
      u.name as assignee_name, u.email as assignee_email
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    ${whereString}
    ORDER BY ${safeSortBy} ${safeOrder}
    LIMIT $${limitParamIdx} OFFSET $${offsetParamIdx}
  `;

  const rows = await db.query(dataSql, queryParams);

  return {
    tasks: rows,
    pagination: {
      totalItems,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItems / limit) || 1,
      limit: parseInt(limit)
    }
  };
}

async function getTaskById(id) {
  const sql = `
    SELECT 
      t.id, t.title, t.description, t.status, t.priority, 
      t.assigned_to, t.due_date, t.created_at, t.updated_at,
      u.name as assignee_name, u.email as assignee_email, u.role as assignee_role
    FROM tasks t
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE t.id = $1
  `;
  const rows = await db.query(sql, [id]);
  return rows[0] || null;
}

async function createTask({ title, description, status, priority, assigned_to, due_date }) {
  const sql = `
    INSERT INTO tasks (title, description, status, priority, assigned_to, due_date)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const rows = await db.query(sql, [
    title,
    description || '',
    status || 'Pending',
    priority || 'Medium',
    assigned_to || null,
    due_date || null
  ]);
  return rows[0];
}

async function updateTask(id, { title, description, status, priority, assigned_to, due_date }) {
  const sql = `
    UPDATE tasks
    SET 
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      status = COALESCE($3, status),
      priority = COALESCE($4, priority),
      assigned_to = COALESCE($5, assigned_to),
      due_date = COALESCE($6, due_date),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING *
  `;
  const rows = await db.query(sql, [
    title !== undefined ? title : null,
    description !== undefined ? description : null,
    status !== undefined ? status : null,
    priority !== undefined ? priority : null,
    assigned_to !== undefined ? assigned_to : null,
    due_date !== undefined ? due_date : null,
    id
  ]);
  return rows[0];
}

async function deleteTask(id) {
  const sql = `DELETE FROM tasks WHERE id = $1 RETURNING id`;
  const rows = await db.query(sql, [id]);
  return rows.length > 0;
}

async function getDashboardMetrics(userId = null) {
  const totalRes = await db.query(`SELECT COUNT(*) as count FROM tasks`);
  const pendingRes = await db.query(`SELECT COUNT(*) as count FROM tasks WHERE LOWER(status) = 'pending'`);
  const inProgressRes = await db.query(`SELECT COUNT(*) as count FROM tasks WHERE LOWER(status) = 'in progress'`);
  const completedRes = await db.query(`SELECT COUNT(*) as count FROM tasks WHERE LOWER(status) = 'completed'`);
  const overdueRes = await db.query(`SELECT COUNT(*) as count FROM tasks WHERE due_date < CURRENT_DATE AND LOWER(status) != 'completed'`);

  let myTasksCount = 0;
  if (userId) {
    const myTasksRes = await db.query(`SELECT COUNT(*) as count FROM tasks WHERE assigned_to = $1 AND LOWER(status) != 'completed'`, [userId]);
    myTasksCount = parseInt(myTasksRes[0]?.count || 0);
  }

  return {
    totalTasks: parseInt(totalRes[0]?.count || 0),
    pendingTasks: parseInt(pendingRes[0]?.count || 0),
    inProgressTasks: parseInt(inProgressRes[0]?.count || 0),
    completedTasks: parseInt(completedRes[0]?.count || 0),
    overdueTasks: parseInt(overdueRes[0]?.count || 0),
    myAssignedTasks: myTasksCount
  };
}

module.exports = {
  findTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getDashboardMetrics
};
