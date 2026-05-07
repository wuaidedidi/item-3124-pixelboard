import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Image, LayoutGrid, Heart, Calendar, Crown } from 'lucide-react'
import api from '../api'
import useAuthStore from '../store/authStore'
import MasonryGrid from '../components/MasonryGrid'
import { formatDate } from '../utils/validators'

export default function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [materials, setMaterials] = useState([])
  const [boards, setBoards] = useState([])
  const [activeTab, setActiveTab] = useState('materials')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchProfile()
    fetchMaterials(1)
    fetchBoards()
  }, [id])

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/users/${id}`)
      setProfile(res.data)
    } catch { navigate('/') }
    finally { setLoading(false) }
  }

  const fetchMaterials = async (p) => {
    try {
      const res = await api.get(`/users/${id}/materials`, { params: { page: p, page_size: 20 } })
      if (p === 1) setMaterials(res.data.items || [])
      else setMaterials(prev => [...prev, ...(res.data.items || [])])
      setHasMore((res.data.items || []).length >= 20)
    } catch { /* handled */ }
  }

  const fetchBoards = async () => {
    try {
      const res = await api.get(`/users/${id}/boards`)
      setBoards(res.data || [])
    } catch { /* handled */ }
  }

  if (loading || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200" />
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-32" />
              <div className="h-4 bg-gray-200 rounded w-48" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isOwner = currentUser?.id === Number(id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary-100 overflow-hidden flex items-center justify-center flex-shrink-0">
            {profile.avatar ? (
              <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary-600 text-3xl font-bold">{(profile.nickname || profile.username || '?')[0]}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{profile.nickname || profile.username}</h1>
              {profile.membership_plan_name && profile.membership_plan_name !== '免费会员' && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                  <Crown className="w-3 h-3" /> {profile.membership_plan_name}
                </span>
              )}
            </div>
            {profile.bio && <p className="text-gray-500 mb-3">{profile.bio}</p>}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Image className="w-4 h-4" /> {profile.material_count} 素材</span>
              <span className="flex items-center gap-1"><LayoutGrid className="w-4 h-4" /> {profile.board_count} 画板</span>
              <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {profile.like_count} 获赞</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(profile.created_at)}</span>
            </div>
          </div>
          {isOwner && (
            <button onClick={() => navigate('/settings')} className="btn-secondary">编辑资料</button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 mb-6 bg-gray-100 rounded-full p-1 w-fit">
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'materials' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Image className="w-4 h-4" /> 素材
        </button>
        <button
          onClick={() => setActiveTab('boards')}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'boards' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <LayoutGrid className="w-4 h-4" /> 画板
        </button>
      </div>

      {activeTab === 'materials' && (
        <>
          <MasonryGrid materials={materials} loading={loading} />
          {hasMore && materials.length > 0 && (
            <div className="text-center mt-8">
              <button onClick={() => { const next = page + 1; setPage(next); fetchMaterials(next) }} className="btn-secondary px-8">加载更多</button>
            </div>
          )}
        </>
      )}

      {activeTab === 'boards' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {boards.length === 0 ? (
            <p className="col-span-full text-center text-gray-400 py-12">暂无画板</p>
          ) : (
            boards.map(b => (
              <Link
                key={b.id}
                to={`/board/${b.id}`}
                className="group"
              >
                <div className="aspect-[4/3] rounded-2xl bg-gray-100 overflow-hidden mb-2">
                  {b.cover_image ? (
                    <img src={b.cover_image} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <LayoutGrid className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{b.name}</h3>
                <p className="text-xs text-gray-500">{b.material_count || 0} 个素材</p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}
