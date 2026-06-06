import { create } from 'zustand'
import { chatApi } from '../api/chatApi.js'

const useChatStore = create((set, get) => ({
  messages: [],
  sessionId: null,
  loading: false,
  sendMessage: async ({ petId, message }) => {
    const userMessage = { role: 'user', content: message }
    set((state) => ({ messages: [...state.messages, userMessage], loading: true }))
    const response = await chatApi.send({ pet_id: petId, message, session_id: get().sessionId })
    set((state) => ({
      sessionId: response.session_id,
      messages: [...state.messages, { role: 'assistant', content: response.answer, citations: response.citations }],
      loading: false,
    }))
  },
  reset: () => set({ messages: [], sessionId: null }),
}))

export default useChatStore
