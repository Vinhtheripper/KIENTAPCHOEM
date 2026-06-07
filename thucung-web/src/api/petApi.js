import apiClient from './client.js'

export const petApi = {
  list: () => apiClient.get('/pets').then((res) => res.data),
  create: (payload) => apiClient.post('/pets', payload).then((res) => res.data),
  update: (petId, payload) => apiClient.patch(`/pets/${petId}`, payload).then((res) => res.data),
  uploadAvatar: (petId, file) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient.post(`/pets/${petId}/avatar`, form).then((res) => res.data)
  },
  remove: (petId) => apiClient.delete(`/pets/${petId}`).then((res) => res.data),
}
