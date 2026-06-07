import { create } from 'zustand'
import { chatApi } from '../api/chatApi.js'

const useChatStore = create((set, get) => ({
  messages: [],
  sessions: [],
  sessionId: null,
  loading: false,
  fetchSessions: async (petId) => {
    const sessions = await chatApi.sessions(petId ? { pet_id: petId } : {})
    set({ sessions })
  },
  loadSession: async (sessionId) => {
    const messages = await chatApi.messages(sessionId)
    set({ sessionId, messages: messages.map((message) => ({ role: message.role, content: message.content, citations: message.citations || [] })) })
  },
  sendMessage: async ({ petId, message }) => {
    const userMessage = { role: 'user', content: message }
    set((state) => ({ messages: [...state.messages, userMessage], loading: true }))
    const response = await chatApi.send({ pet_id: petId, message, session_id: get().sessionId })
    set((state) => ({
      sessionId: response.session_id,
      messages: [...state.messages, { role: 'assistant', content: response.answer, citations: response.citations }],
      loading: false,
    }))
    get().fetchSessions(petId).catch(() => {})
  },
  reset: () => set({ messages: [], sessionId: null }),
}))

export default useChatStore
