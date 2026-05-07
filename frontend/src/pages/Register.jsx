import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import useAuthStore from '../store/authStore'
import { validateEmail, validatePhone } from '../utils/validators'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuthStore()
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '', email: '', phone: '', nickname: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.username.trim()) errs.username = '请输入用户名'
    else if (form.username.trim().length < 2) errs.username = '用户名至少2个字符'
    if (!form.password) errs.password = '请输入密码'
    else if (form.password.length < 6) errs.password = '密码至少6个字符'
    if (form.password !== form.confirmPassword) errs.confirmPassword = '两次密码不一致'
    if (form.email && !validateEmail(form.email)) errs.email = '邮箱格式不正确'
    if (form.phone && !validatePhone(form.phone)) errs.phone = '手机号格式不正确'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register({
        username: form.username.trim(),
        password: form.password,
        email: form.email || undefined,
        phone: form.phone || undefined,
        nickname: form.nickname || undefined,
      })
      toast.success('注册成功')
      navigate('/')
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value })
    if (errors[field]) setErrors({ ...errors, [field]: '' })
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-rose-500 via-primary-600 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-32 right-20 w-48 h-48 border-2 border-white rounded-3xl rotate-45" />
          <div className="absolute bottom-20 left-16 w-36 h-36 border-2 border-white rounded-full" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-8">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">加入 PixelBoard</h1>
          <p className="text-xl text-white/80 mb-2">创建你的创意空间</p>
          <p className="text-white/60 max-w-sm">上传你的作品、收藏喜爱的素材、与全球创作者交流互动</p>
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

          <h2 className="text-2xl font-bold text-gray-900 mb-1">创建账号</h2>
          <p className="text-gray-500 mb-8">注册后即可上传和收藏素材</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">用户名 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => updateField('username', e.target.value)}
                className={`input-field ${errors.username ? 'border-red-400' : ''}`}
                placeholder="请输入用户名"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">昵称</label>
              <input
                type="text"
                value={form.nickname}
                onChange={(e) => updateField('nickname', e.target.value)}
                className="input-field"
                placeholder="显示名称（选填）"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">邮箱</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                  placeholder="选填"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">手机号</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className={`input-field ${errors.phone ? 'border-red-400' : ''}`}
                  placeholder="选填"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">密码 <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className={`input-field pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="至少6个字符"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">确认密码 <span className="text-red-500">*</span></label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                className={`input-field ${errors.confirmPassword ? 'border-red-400' : ''}`}
                placeholder="再次输入密码"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? '注册中...' : '注 册'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            已有账号？
            <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700 ml-1">立即登录</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
