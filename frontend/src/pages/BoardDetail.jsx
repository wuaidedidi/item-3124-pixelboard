import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Globe } from 'lucide-react'
import api from '../api'
import MasonryGrid from '../components/MasonryGrid'

export default function BoardDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [board, setBoard] = useState(null)
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchBoard(1)
  }, [id])

  const fetchBoard = async (p) => {
    if (p === 1) setLoading(true)
    try {
      const res = await api.get(`/boards/${id}`, { params: { page: p, page_size: 20 } })
      setBoard(res.data)
      const items = res.data.materials?.items || []
      if (p === 1) setMaterials(items)
      else setMaterials(prev => [...prev, ...items])
      setHasMore(items.length >= 20)
    } catch { navigate('/') }
    finally { setLoading(false) }
  }

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchBoard(next)
  }

  if (loading || !board) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-200 rounded w-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> 返回
      </button>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{board.name}</h1>
              {board.is_public ? (
                <Globe className="w-4 h-4 text-gray-400" />
              ) : (
                <Lock className="w-4 h-4 text-gray-400" />
              )}
            </div>
            {board.description && <p className="text-gray-500 mb-3">{board.description}</p>}
            <p className="text-sm text-gray-400">{board.material_count || 0} 个素材</p>
          </div>
          {board.user && (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/user/${board.user.id}`)}>
              <div className="w-8 h-8 rounded-full bg-primary-100 overflow-hidden flex items-center justify-center">
                {board.user.avatar ? (
                  <img src={board.user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary-600 text-sm font-medium">{(board.user.nickname || '?')[0]}</span>
                )}
              </div>
              <span className="text-sm text-gray-600">{board.user.nickname}</span>
            </div>
          )}
        </div>
      </div>

      <MasonryGrid materials={materials} loading={loading} />

      {hasMore && materials.length > 0 && (
        <div className="text-center mt-8">
          <button onClick={loadMore} className="btn-secondary px-8">加载更多</button>
        </div>
      )}
    </div>
  )
}
