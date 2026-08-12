import { useState, useCallback } from 'react';
import { apiService } from '../services/api';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ totalItems: 0, currentPage: 1, totalPages: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getTasks(params);
      setTasks(res.tasks || []);
      setPagination(res.pagination || { totalItems: 0, currentPage: 1, totalPages: 1, limit: 10 });
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    const newTask = await apiService.createTask(taskData);
    return newTask;
  };

  const updateTask = async (id, taskData) => {
    const updated = await apiService.updateTask(id, taskData);
    return updated;
  };

  const deleteTask = async (id) => {
    await apiService.deleteTask(id);
  };

  return {
    tasks,
    pagination,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
}
