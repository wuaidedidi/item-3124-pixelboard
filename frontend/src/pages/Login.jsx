import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.username.trim()) errs.username = '请输入用户名'
    if (!form.password) errs.password = '请输入密码'
    else if (form.password.length < 6) errs.password = '密码至少6个字符'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login(form.username.trim(), form.password)
      toast.success('登录成功')
      navigate('/')
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 via-primary-600 to-rose-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 border-2 border-white rounded-2xl rotate-12" />
          <div className="absolute bottom-32 right-16 w-56 h-56 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 border-2 border-white rounded-xl -rotate-6" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-8">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">PixelBoard</h1>
          <p className="text-xl text-white/80 mb-2">灵感素材社区</p>
          <p className="text-white/60 max-w-sm">发现、收藏、分享高质量创意素材，激发你的无限灵感</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">PixelBoard</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">欢迎回来</h2>
          <p className="text-gray-500 mb-8">登录你的账号，开始探索灵感</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">用户名</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => { setForm({ ...form, username: e.target.value }); setErrors({ ...errors, username: '' }) }}
                className={`input-field ${errors.username ? 'border-red-400 focus:ring-red-500' : ''}`}
                placeholder="请输入用户名"
                autoComplete="username"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">密码</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }) }}
                  className={`input-field pr-10 ${errors.password ? 'border-red-400 focus:ring-red-500' : ''}`}
                  placeholder="请输入密码"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? '登录中...' : '登 录'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            还没有账号？
            <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700 ml-1">立即注册</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
