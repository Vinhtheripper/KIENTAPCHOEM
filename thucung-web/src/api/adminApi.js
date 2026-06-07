import apiClient from './client.js'

export const adminApi = {
  users: () => apiClient.get('/admin/users').then((res) => res.data),
  pets: (ownerId) => apiClient.get('/admin/pets', { params: ownerId ? { owner_id: ownerId } : {} }).then((res) => res.data),
  content: (params = {}) => apiClient.get('/admin/content', { params }).then((res) => res.data),
  audit: () => apiClient.get('/admin/audit').then((res) => res.data),
}
