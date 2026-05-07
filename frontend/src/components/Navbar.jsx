import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Upload, User, Settings, LogOut, Shield, ChevronDown, Menu, X } from 'lucide-react'
import useAuthStore from '../store/authStore'

export default function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [keyword, setKeyword] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobile, setShowMobile] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/explore?keyword=${encodeURIComponent(keyword.trim())}`)
    }
  }

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">PixelBoard</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索灵感素材..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </div>
          </form>

          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
              首页
            </Link>
            <Link to="/explore" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
              探索
            </Link>
            <Link to="/membership" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
              会员
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/upload')}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-full hover:bg-primary-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>上传</span>
                </button>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 overflow-hidden flex items-center justify-center">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-primary-600 text-sm font-medium">
                          {(user?.nickname || user?.username || '?')[0]}
                        </span>
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.nickname || user?.username}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{user?.membership_plan_name || '免费会员'}</p>
                      </div>
                      <Link
                        to={`/user/${user?.id}`}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowDropdown(false)}
                      >
                        <User className="w-4 h-4" /> 个人主页
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Settings className="w-4 h-4" /> 账号设置
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowDropdown(false)}
                        >
                          <Shield className="w-4 h-4" /> 管理后台
                        </Link>
                      )}
                      <div className="border-t border-gray-100 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full"
                        >
                          <LogOut className="w-4 h-4" /> 退出登录
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  登录
                </Link>
                <Link to="/register" className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-full hover:bg-primary-700 transition-colors">
                  注册
                </Link>
              </div>
            )}

            <button
              onClick={() => setShowMobile(!showMobile)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {showMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {showMobile && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            <form onSubmit={handleSearch} className="mb-2 sm:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="搜索灵感素材..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm border-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </form>
            <Link to="/" className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100" onClick={() => setShowMobile(false)}>首页</Link>
            <Link to="/explore" className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100" onClick={() => setShowMobile(false)}>探索</Link>
            <Link to="/membership" className="block px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100" onClick={() => setShowMobile(false)}>会员</Link>
            {isAuthenticated && (
              <Link to="/upload" className="block px-3 py-2 text-sm text-primary-600 font-medium rounded-lg hover:bg-primary-50" onClick={() => setShowMobile(false)}>上传素材</Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
