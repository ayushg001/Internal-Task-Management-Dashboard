// Activity & Audit Log Repository
const db = require('../db');

async function getLogsByTaskId(taskId) {
  const sql = `
    SELECT l.id, l.task_id, l.user_id, l.action, l.created_at, u.name as user_name
    FROM activity_logs l
    LEFT JOIN users u ON l.user_id = u.id
    WHERE l.task_id = $1
    ORDER BY l.created_at DESC
  `;
  return await db.query(sql, [taskId]);
}

async function addLog({ task_id, user_id, action }) {
  const sql = `
    INSERT INTO activity_logs (task_id, user_id, action)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const rows = await db.query(sql, [task_id, user_id || null, action]);
  return rows[0];
}

module.exports = {
  getLogsByTaskId,
  addLog
};
