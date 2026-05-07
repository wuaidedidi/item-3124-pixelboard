import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Heart, Download, Eye, MessageCircle, Bookmark, Share2, ArrowLeft, Crown, Send, Loader2 } from 'lucide-react'
import api from '../api'
import useAuthStore from '../store/authStore'
import Modal from '../components/Modal'
import MasonryGrid from '../components/MasonryGrid'
import { formatNumber, formatDate, formatFileSize } from '../utils/validators'
import toast from 'react-hot-toast'

export default function MaterialDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [material, setMaterial] = useState(null)
  const [comments, setComments] = useState([])
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showBoardModal, setShowBoardModal] = useState(false)
  const [boards, setBoards] = useState([])
  const [newBoardName, setNewBoardName] = useState('')

  useEffect(() => {
    fetchMaterial()
    fetchComments()
    fetchRelated()
  }, [id])

  const fetchMaterial = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/materials/${id}`)
      setMaterial(res.data)
      setLiked(res.data.is_liked)
      setLikeCount(res.data.like_count)
    } catch { navigate('/') }
    finally { setLoading(false) }
  }

  const fetchComments = async () => {
    try {
      const res = await api.get(`/materials/${id}/comments`)
      setComments(res.data || [])
    } catch { /* handled */ }
  }

  const fetchRelated = async () => {
    try {
      const res = await api.get(`/materials/${id}/related`)
      setRelated(res.data || [])
    } catch { /* handled */ }
  }

  const handleLike = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    try {
      const res = await api.post(`/materials/${id}/like`)
      setLiked(res.data.liked)
      setLikeCount(res.data.like_count)
    } catch { /* handled */ }
  }

  const handleDownload = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    try {
      const res = await api.post(`/materials/${id}/download`)
      const link = document.createElement('a')
      link.href = res.data.image_url
      link.target = '_blank'
      link.download = material?.title || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('下载成功')
    } catch { /* handled */ }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    if (!isAuthenticated) { navigate('/login'); return }
    setSubmitting(true)
    try {
      await api.post(`/materials/${id}/comments`, { content: commentText.trim() })
      setCommentText('')
      fetchComments()
      toast.success('评论发表成功')
    } catch { /* handled */ }
    finally { setSubmitting(false) }
  }

  const handleCollect = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    try {
      const res = await api.get('/boards')
      setBoards(res.data || [])
      setShowBoardModal(true)
    } catch { /* handled */ }
  }

  const addToBoard = async (boardId) => {
    try {
      await api.post(`/boards/${boardId}/materials/${id}`)
      toast.success('已收藏到画板')
      setShowBoardModal(false)
    } catch { /* handled */ }
  }

  const createBoardAndAdd = async () => {
    if (!newBoardName.trim()) return
    try {
      const res = await api.post('/boards', { name: newBoardName.trim() })
      await api.post(`/boards/${res.data.id}/materials/${id}`)
      toast.success('已创建画板并收藏')
      setShowBoardModal(false)
      setNewBoardName('')
    } catch { /* handled */ }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-[4/3] bg-gray-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!material) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> 返回
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="relative bg-gray-100 rounded-2xl overflow-hidden">
            {material.is_premium && (
              <div className="absolute top-4 left-4 z-10 bg-amber-500 text-white text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                <Crown className="w-4 h-4" /> 会员专享
              </div>
            )}
            <img
              src={material.image_url}
              alt={material.title}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{material.title}</h1>

          {material.description && (
            <p className="text-gray-600 mb-4 leading-relaxed">{material.description}</p>
          )}

          <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {formatNumber(material.view_count)}</span>
            <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {formatNumber(likeCount)}</span>
            <span className="flex items-center gap-1"><Download className="w-4 h-4" /> {formatNumber(material.download_count)}</span>
          </div>

          <div className="flex gap-3 mb-6">
            <button onClick={handleLike} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-all ${liked ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} /> {liked ? '已点赞' : '点赞'}
            </button>
            <button onClick={handleCollect} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
              <Bookmark className="w-5 h-5" /> 收藏
            </button>
          </div>

          <button onClick={handleDownload} className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-base">
            <Download className="w-5 h-5" /> 下载素材
          </button>

          {material.user && (
            <Link to={`/user/${material.user.id}`} className="flex items-center gap-3 mt-6 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                {material.user.avatar ? (
                  <img src={material.user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary-600 font-medium">{(material.user.nickname || material.user.username || '?')[0]}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{material.user.nickname || material.user.username}</p>
                <p className="text-xs text-gray-500">{formatDate(material.created_at)}</p>
              </div>
            </Link>
          )}

          <div className="mt-6 space-y-3">
            {material.category && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">分类：</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700">{material.category.name}</span>
              </div>
            )}
            {material.tags && material.tags.length > 0 && (
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <span className="text-gray-500">标签：</span>
                {material.tags.map(t => (
                  <span key={t.id} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs">#{t.name}</span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              {material.width && material.height && <span>{material.width} x {material.height}</span>}
              {material.file_size && <span>{formatFileSize(material.file_size)}</span>}
              {material.file_type && <span>{material.file_type.split('/')[1]?.toUpperCase()}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" /> 评论 ({comments.length})
        </h2>

        {isAuthenticated && (
          <form onSubmit={handleComment} className="flex gap-3 mb-6">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="写下你的评论..."
              className="input-field flex-1"
              maxLength={1000}
            />
            <button type="submit" disabled={submitting || !commentText.trim()} className="btn-primary px-4 flex items-center gap-1">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-400 text-center py-8">暂无评论，来发表第一条吧</p>
          ) : (
            comments.map(c => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {c.user?.avatar ? (
                    <img src={c.user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-medium">
                      {(c.user?.nickname || '?')[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{c.user?.nickname || c.user?.username}</span>
                    <span className="text-xs text-gray-400">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{c.content}</p>
                  {c.replies && c.replies.length > 0 && (
                    <div className="mt-3 ml-4 space-y-3 border-l-2 border-gray-100 pl-4">
                      {c.replies.map(r => (
                        <div key={r.id} className="flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs">
                              {(r.user?.nickname || '?')[0]}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-800">{r.user?.nickname}</span>
                            <span className="text-xs text-gray-400 ml-2">{formatDate(r.created_at)}</span>
                            <p className="text-sm text-gray-600 mt-0.5">{r.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">相关推荐</h2>
          <MasonryGrid materials={related} />
        </div>
      )}

      <Modal isOpen={showBoardModal} onClose={() => setShowBoardModal(false)} title="收藏到画板">
        <div className="space-y-3">
          {boards.map(b => (
            <button
              key={b.id}
              onClick={() => addToBoard(b.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {b.cover_image && <img src={b.cover_image} alt="" className="w-full h-full object-cover" />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{b.name}</p>
                <p className="text-xs text-gray-500">{b.material_count || 0} 个素材</p>
              </div>
            </button>
          ))}

          <div className="border-t border-gray-100 pt-3 mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">新建画板</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="画板名称"
                className="input-field flex-1"
              />
              <button onClick={createBoardAndAdd} disabled={!newBoardName.trim()} className="btn-primary px-4">
                创建
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
