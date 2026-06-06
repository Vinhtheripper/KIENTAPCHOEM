import apiClient from './client.js'

export const chatApi = {
  send: (payload) => apiClient.post('/chat', payload).then((res) => res.data),
}
