import { useState, useRef } from 'react'
import { User, Lock, Camera, Loader2 } from 'lucide-react'
import api from '../api'
import useAuthStore from '../store/authStore'
import { validateEmail, validatePhone } from '../utils/validators'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const [profile, setProfile] = useState({
    nickname: user?.nickname || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  })
  const [profileErrors, setProfileErrors] = useState({})

  const [passwords, setPasswords] = useState({ old_password: '', new_password: '', confirm_password: '' })
  const [pwdErrors, setPwdErrors] = useState({})

  const validateProfile = () => {
    const errs = {}
    if (profile.email && !validateEmail(profile.email)) errs.email = '邮箱格式不正确'
    if (profile.phone && !validatePhone(profile.phone)) errs.phone = '手机号格式不正确'
    setProfileErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    if (!validateProfile()) return
    setLoading(true)
    try {
      const res = await api.put('/users/profile', {
        nickname: profile.nickname || undefined,
        email: profile.email || undefined,
        phone: profile.phone || undefined,
        bio: profile.bio || undefined,
      })
      updateUser(res.data)
      toast.success('个人信息更新成功')
    } catch { /* handled */ }
    finally { setLoading(false) }
  }

  const validatePasswords = () => {
    const errs = {}
    if (!passwords.old_password) errs.old_password = '请输入原密码'
    if (!passwords.new_password) errs.new_password = '请输入新密码'
    else if (passwords.new_password.length < 6) errs.new_password = '新密码至少6个字符'
    if (passwords.new_password !== passwords.confirm_password) errs.confirm_password = '两次密码不一致'
    setPwdErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!validatePasswords()) return
    setLoading(true)
    try {
      await api.put('/users/password', {
        old_password: passwords.old_password,
        new_password: passwords.new_password,
      })
      setPasswords({ old_password: '', new_password: '', confirm_password: '' })
      toast.success('密码修改成功')
    } catch { /* handled */ }
    finally { setLoading(false) }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      updateUser({ avatar: res.data.avatar })
      toast.success('头像上传成功')
    } catch { /* handled */ }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">账号设置</h1>

      <div className="flex gap-2 mb-6 bg-gray-100 rounded-full p-1 w-fit">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
          <User className="w-4 h-4" /> 个人信息
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'password' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
          <Lock className="w-4 h-4" /> 修改密码
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary-100 overflow-hidden flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary-600 text-2xl font-bold">{(user?.nickname || user?.username || '?')[0]}</span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors shadow-md"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.username}</p>
              <p className="text-sm text-gray-500">{user?.membership_plan_name || '免费会员'}</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">昵称</label>
              <input
                type="text"
                value={profile.nickname}
                onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                className="input-field"
                placeholder="显示名称"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">邮箱</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => { setProfile({ ...profile, email: e.target.value }); setProfileErrors({ ...profileErrors, email: '' }) }}
                  className={`input-field ${profileErrors.email ? 'border-red-400' : ''}`}
                  placeholder="选填"
                />
                {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">手机号</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => { setProfile({ ...profile, phone: e.target.value }); setProfileErrors({ ...profileErrors, phone: '' }) }}
                  className={`input-field ${profileErrors.phone ? 'border-red-400' : ''}`}
                  placeholder="选填"
                />
                {profileErrors.phone && <p className="text-red-500 text-xs mt-1">{profileErrors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">个人简介</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="input-field resize-none"
                rows={3}
                placeholder="介绍一下自己..."
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              保存修改
            </button>
          </form>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">原密码</label>
              <input
                type="password"
                value={passwords.old_password}
                onChange={(e) => { setPasswords({ ...passwords, old_password: e.target.value }); setPwdErrors({ ...pwdErrors, old_password: '' }) }}
                className={`input-field ${pwdErrors.old_password ? 'border-red-400' : ''}`}
                placeholder="请输入原密码"
              />
              {pwdErrors.old_password && <p className="text-red-500 text-xs mt-1">{pwdErrors.old_password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">新密码</label>
              <input
                type="password"
                value={passwords.new_password}
                onChange={(e) => { setPasswords({ ...passwords, new_password: e.target.value }); setPwdErrors({ ...pwdErrors, new_password: '' }) }}
                className={`input-field ${pwdErrors.new_password ? 'border-red-400' : ''}`}
                placeholder="至少6个字符"
              />
              {pwdErrors.new_password && <p className="text-red-500 text-xs mt-1">{pwdErrors.new_password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">确认新密码</label>
              <input
                type="password"
                value={passwords.confirm_password}
                onChange={(e) => { setPasswords({ ...passwords, confirm_password: e.target.value }); setPwdErrors({ ...pwdErrors, confirm_password: '' }) }}
                className={`input-field ${pwdErrors.confirm_password ? 'border-red-400' : ''}`}
                placeholder="再次输入新密码"
              />
              {pwdErrors.confirm_password && <p className="text-red-500 text-xs mt-1">{pwdErrors.confirm_password}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              修改密码
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
