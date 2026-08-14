// API Client Service for Frontend
const API_BASE = 'https://internal-task-management-dashboard-vzzb.onrender.com/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.message || data.error || 'An API error occurred';
    throw new Error(errorMsg);
  }
  return data;
}

export const apiService = {
  // Authentication Endpoint
  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeaders() }
    });
    return handleResponse(res);
  },

  // Dashboard Endpoint
  async getDashboard(userId = null) {
    const url = userId ? `${API_BASE}/dashboard?userId=${userId}` : `${API_BASE}/dashboard`;
    const res = await fetch(url, { headers: { ...getAuthHeaders() } });
    return handleResponse(res);
  },

  // Task Endpoints
  async getTasks(params = {}) {
    const queryString = new URLSearchParams();
    if (params.status) queryString.append('status', params.status);
    if (params.priority) queryString.append('priority', params.priority);
    if (params.assignee) queryString.append('assignee', params.assignee);
    if (params.search) queryString.append('search', params.search);
    if (params.page) queryString.append('page', params.page);
    if (params.limit) queryString.append('limit', params.limit);
    if (params.sortBy) queryString.append('sortBy', params.sortBy);
    if (params.sortOrder) queryString.append('sortOrder', params.sortOrder);

    const url = `${API_BASE}/tasks?${queryString.toString()}`;
    const res = await fetch(url, { headers: { ...getAuthHeaders() } });
    return handleResponse(res);
  },

  async getTaskById(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { headers: { ...getAuthHeaders() } });
    return handleResponse(res);
  },

  async createTask(taskData) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(taskData)
    });
    return handleResponse(res);
  },

  async updateTask(id, taskData) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(taskData)
    });
    return handleResponse(res);
  },

  async deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() }
    });
    return handleResponse(res);
  },

  async addComment(taskId, commentData) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(commentData)
    });
    return handleResponse(res);
  },

  // User Endpoints
  async getUsers() {
    const res = await fetch(`${API_BASE}/users`, { headers: { ...getAuthHeaders() } });
    return handleResponse(res);
  },

  async createUser(userData) {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  // External Integration Endpoint
  async getExternalUsers() {
    const res = await fetch(`${API_BASE}/external/users`, { headers: { ...getAuthHeaders() } });
    return handleResponse(res);
  },

  // API Docs Endpoint
  async getApiDocs() {
    const res = await fetch(`${API_BASE}/docs`);
    return handleResponse(res);
  }
};
