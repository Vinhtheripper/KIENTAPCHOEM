import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '../api/authApi.js'

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      loading: false,
      error: null,
      login: async (payload) => {
        set({ loading: true, error: null })
        try {
          const data = await authApi.login(payload)
          set({ token: data.access_token, user: data.user, loading: false })
          return data
        } catch (error) {
          set({ error: error.response?.data?.detail || 'Login failed', loading: false })
          throw error
        }
      },
      register: async (payload) => {
        set({ loading: true, error: null })
        try {
          const data = await authApi.register(payload)
          set({ token: data.access_token, user: data.user, loading: false })
          return data
        } catch (error) {
          set({ error: error.response?.data?.detail || 'Registration failed', loading: false })
          throw error
        }
      },
      logout: () => set({ token: null, user: null, loading: false, error: null }),
    }),
    {
      name: 'gpet-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        token: persistedState?.token ?? null,
        user: persistedState?.user ?? null,
        loading: false,
        error: null,
      }),
    },
  ),
)

export default useAuthStore
