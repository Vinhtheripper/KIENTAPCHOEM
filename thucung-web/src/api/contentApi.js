import apiClient from './client.js'

export const contentApi = {
  list: (petId) => apiClient.get('/content', { params: petId ? { pet_id: petId } : {} }).then((res) => res.data),
  detail: (contentId) => apiClient.get(`/content/${contentId}`).then((res) => res.data),
  updateMetadata: (contentId, payload) => apiClient.patch(`/content/${contentId}/metadata`, payload).then((res) => res.data),
  retry: (contentId) => apiClient.post(`/content/${contentId}/retry`).then((res) => res.data),
  reindexPet: (petId) => apiClient.post(`/content/reindex-pet/${petId}`).then((res) => res.data),
  upload: (petId, file, metadata = {}, onUploadProgress) => {
    const form = new FormData()
    form.append('pet_id', petId)
    form.append('file', file)
    Object.entries(metadata).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      form.append(key, Array.isArray(value) ? JSON.stringify(value) : value)
    })
    return apiClient.post('/content/upload', form, { onUploadProgress }).then((res) => res.data)
  },
  ingestUrl: (payload) => apiClient.post('/content/url', payload).then((res) => res.data),
}
