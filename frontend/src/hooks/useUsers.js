import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export function useUsers() {
  const [users, setUsers] = useState([]);
  
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userList = await apiService.getUsers();
      setUsers(userList || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch user list');
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    currentUser,
    setCurrentUser,
    loading,
    error,
    reloadUsers: loadUsers
  };
}
