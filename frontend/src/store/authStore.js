import { create } from 'zustand'
import api from '../api'

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (username, password) => {
    const res = await api.post('/auth/login', { username, password })
    const { token, user } = res.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
    return res
  },

  register: async (data) => {
    const res = await api.post('/auth/register', data)
    const { token, user } = res.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
    return res
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null, isAuthenticated: false })
  },

  updateUser: (userData) => {
    const currentUser = get().user
    const newUser = { ...currentUser, ...userData }
    localStorage.setItem('user', JSON.stringify(newUser))
    set({ user: newUser })
  },

  fetchMe: async () => {
    try {
      const res = await api.get('/auth/me')
      const user = res.data
      localStorage.setItem('user', JSON.stringify(user))
      set({ user })
    } catch {
      // handled by interceptor
    }
  },
}))

export default useAuthStore
