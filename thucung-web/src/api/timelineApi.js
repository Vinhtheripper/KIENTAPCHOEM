import apiClient from './client.js'

export const timelineApi = {
  get: (petId) => apiClient.get('/timeline', { params: { pet_id: petId } }).then((res) => res.data),
}
