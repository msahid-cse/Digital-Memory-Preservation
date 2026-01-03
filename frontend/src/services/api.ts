import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (data: { email: string; password: string; fullName: string }) =>
        api.post('/auth/register', data),

    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),

    getProfile: () =>
        api.get('/auth/me'),

    updateProfile: (data: { fullName?: string; avatarUrl?: string }) =>
        api.put('/auth/profile', data),
};

// Memory API
export const memoryAPI = {
    create: (data: any) =>
        api.post('/memories', data),

    getAll: (params?: { feed?: string; familyId?: number; limit?: number; offset?: number }) =>
        api.get('/memories', { params }),

    getById: (id: number) =>
        api.get(`/memories/${id}`),

    update: (id: number, data: any) =>
        api.put(`/memories/${id}`, data),

    delete: (id: number) =>
        api.delete(`/memories/${id}`),

    getInsights: () =>
        api.get('/memories/ai/insights'),
};

// Family API
export const familyAPI = {
    create: (data: { name: string; description?: string }) =>
        api.post('/families', data),

    getAll: () =>
        api.get('/families'),

    getById: (id: number) =>
        api.get(`/families/${id}`),

    addMember: (familyId: number, email: string) =>
        api.post(`/families/${familyId}/members`, { email }),

    removeMember: (familyId: number, userId: number) =>
        api.delete(`/families/${familyId}/members/${userId}`),
};

export default api;
