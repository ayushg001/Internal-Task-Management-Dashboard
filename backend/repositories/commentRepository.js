// Comment Repository - Handles database queries for Task Comments/Notes
const db = require('../db');

async function getCommentsByTaskId(taskId) {
  const sql = `
    SELECT 
      c.id, 
      c.task_id, 
      c.user_id, 
      c.comment, 
      c.created_at,
      u.name as user_name,
      u.email as user_email,
      u.role as user_role
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.task_id = $1
    ORDER BY c.created_at ASC
  `;
  return await db.query(sql, [taskId]);
}

async function createComment({ task_id, user_id, comment }) {
  const sql = `
    INSERT INTO comments (task_id, user_id, comment)
    VALUES ($1, $2, $3)
    RETURNING id, task_id, user_id, comment, created_at
  `;
  const rows = await db.query(sql, [task_id, user_id, comment]);
  return rows[0];
}

module.exports = {
  getCommentsByTaskId,
  createComment
};
