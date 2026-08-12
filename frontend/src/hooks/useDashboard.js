import { useState, useCallback } from 'react';
import { apiService } from '../services/api';

export function useDashboard(userId) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async (currentUserId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getDashboard(currentUserId || userId);
      setStats(res);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    stats,
    loading,
    error,
    fetchDashboard
  };
}
