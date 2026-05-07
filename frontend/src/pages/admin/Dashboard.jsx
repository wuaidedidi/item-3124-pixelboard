import { useState, useEffect } from 'react'
import { Users, Image, Download, Heart, Clock, Crown } from 'lucide-react'
import api from '../../api'
import { formatDate } from '../../utils/validators'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/admin/dashboard')
      setData(res.data)
    } catch { /* handled */ }
    finally { setLoading(false) }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const stats = data?.stats || {}
  const statCards = [
    { label: '总用户数', value: stats.total_users || 0, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: '总素材数', value: stats.total_materials || 0, icon: Image, color: 'text-green-600 bg-green-50' },
    { label: '总下载量', value: stats.total_downloads || 0, icon: Download, color: 'text-orange-600 bg-orange-50' },
    { label: '总点赞数', value: stats.total_likes || 0, icon: Heart, color: 'text-red-600 bg-red-50' },
    { label: '待审素材', value: stats.pending_materials || 0, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: '付费用户', value: stats.pro_users || 0, icon: Crown, color: 'text-purple-600 bg-purple-50' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">仪表盘</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{s.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">最新注册用户</h3>
          <div className="space-y-3">
            {(data?.recent_users || []).map(u => (
              <div key={u.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {u.avatar ? (
                    <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary-600 text-xs font-medium">{(u.nickname || u.username || '?')[0]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{u.nickname || u.username}</p>
                  <p className="text-xs text-gray-400">{formatDate(u.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">最新上传素材</h3>
          <div className="space-y-3">
            {(data?.recent_materials || []).map(m => (
              <div key={m.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  {m.thumbnail_url && (
                    <img src={m.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{m.title}</p>
                  <p className="text-xs text-gray-400">{formatDate(m.created_at)}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  m.status === 'approved' ? 'bg-green-50 text-green-700' :
                  m.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {m.status === 'approved' ? '已审核' : m.status === 'pending' ? '待审核' : '已拒绝'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
