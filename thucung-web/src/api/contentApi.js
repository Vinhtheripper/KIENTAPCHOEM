import apiClient from './client.js'

export const contentApi = {
  list: (petId) => apiClient.get('/content', { params: petId ? { pet_id: petId } : {} }).then((res) => res.data),
  upload: (petId, file, onUploadProgress) => {
    const form = new FormData()
    form.append('pet_id', petId)
    form.append('file', file)
    return apiClient.post('/content/upload', form, { onUploadProgress }).then((res) => res.data)
  },
  ingestUrl: (payload) => apiClient.post('/content/url', payload).then((res) => res.data),
}
