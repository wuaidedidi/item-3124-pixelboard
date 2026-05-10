import axios from 'axios'
import toast from 'react-hot-toast'

const recentMessages = new Set()

const showError = (message) => {
  if (!message) return
  if (recentMessages.has(message)) return
  recentMessages.add(message)
  setTimeout(() => recentMessages.delete(message), 2000)
  toast.error(message)
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== undefined && res.code !== 200) {
      showError(res.message || '操作失败')
      const error = new Error(res.message)
      error._isBusinessError = true
      return Promise.reject(error)
    }
    return res
  },
  (error) => {
    if (error._isBusinessError) {
      return Promise.reject(error)
    }

    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      if (status === 401) {
        showError('登录已过期，请重新登录')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setTimeout(() => {
          window.location.href = '/login'
        }, 1500)
      } else if (status === 403) {
        showError(data?.detail || '没有操作权限')
      } else if (status === 422) {
        const detail = data?.detail
        if (Array.isArray(detail) && detail.length > 0) {
          const msg = detail[0]?.msg || '请求参数格式错误'
          showError(msg)
        } else {
          showError('请求参数格式错误')
        }
      } else if (status >= 500) {
        showError('服务器错误，请稍后重试')
      } else {
        showError(data?.message || data?.detail || '请求失败')
      }
    } else if (error.code === 'ECONNABORTED') {
      showError('请求超时，请稍后重试')
    }

    return Promise.reject(error)
  }
)

export default api
