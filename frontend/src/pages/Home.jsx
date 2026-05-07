import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import api from '../api'
import MasonryGrid from '../components/MasonryGrid'

export default function Home() {
  const navigate = useNavigate()
  const [materials, setMaterials] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('latest')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    setPage(1)
    setMaterials([])
    setHasMore(true)
    fetchMaterials(1, activeTab)
  }, [activeTab])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories')
      setCategories(res.data || [])
    } catch { /* handled */ }
  }

  const fetchMaterials = async (p, sort) => {
    if (p === 1) setLoading(true)
    else setLoadingMore(true)
    try {
      const res = await api.get('/materials', { params: { page: p, page_size: 20, sort } })
      const data = res.data
      if (p === 1) {
        setMaterials(data.items || [])
      } else {
        setMaterials((prev) => [...prev, ...(data.items || [])])
      }
      setHasMore((data.items || []).length >= 20)
    } catch { /* handled */ }
    finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchMaterials(next, activeTab)
  }

  return (
    <div>
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              发现无限
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-rose-400"> 创意灵感</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              探索数千份精选素材，收藏灵感、激发创造力
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => navigate('/explore')}
                className="px-8 py-3 bg-primary-600 text-white font-medium rounded-full hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/30 flex items-center gap-2"
              >
                开始探索 <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/membership')}
                className="px-8 py-3 bg-white/10 text-white font-medium rounded-full hover:bg-white/20 transition-all backdrop-blur border border-white/20"
              >
                了解会员
              </button>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/explore?category_id=${cat.id}`)}
                className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all text-center group border border-gray-100"
              >
                <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gray-100 overflow-hidden">
                  {cat.cover_image && (
                    <img src={cat.cover_image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  )}
                </div>
                <span className="text-xs font-medium text-gray-700 group-hover:text-primary-600 transition-colors">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
            {[
              { key: 'latest', label: '最新', icon: Clock },
              { key: 'popular', label: '热门', icon: TrendingUp },
              { key: 'downloads', label: '推荐', icon: Sparkles },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="text-sm text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-1"
          >
            查看全部 <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <MasonryGrid materials={materials} loading={loading} />

        {hasMore && materials.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="btn-secondary px-8 py-2.5"
            >
              {loadingMore ? '加载中...' : '加载更多'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
