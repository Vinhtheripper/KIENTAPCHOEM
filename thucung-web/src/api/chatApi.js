import apiClient from './client.js'

export const chatApi = {
  sessions: (params = {}) => apiClient.get('/chat/sessions', { params }).then((res) => res.data),
  messages: (sessionId) => apiClient.get(`/chat/sessions/${sessionId}/messages`).then((res) => res.data),
  send: (payload) => apiClient.post('/chat', payload).then((res) => res.data),
}
