import apiClient from './client.js'

export const timelineApi = {
  get: (petId) => apiClient.get('/timeline', { params: { pet_id: petId } }).then((res) => res.data),
  create: (payload) => apiClient.post('/timeline/events', payload).then((res) => res.data),
  update: (eventId, payload) => apiClient.patch(`/timeline/events/${eventId}`, payload).then((res) => res.data),
  remove: (eventId) => apiClient.delete(`/timeline/events/${eventId}`).then((res) => res.data),
}
