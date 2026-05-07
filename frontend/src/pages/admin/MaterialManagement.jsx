import { useState, useEffect } from 'react'
import { Search, ChevronLeft, ChevronRight, Trash2, CheckCircle, XCircle } from 'lucide-react'
import api from '../../api'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

export default function MaterialManagement() {
  const [materials, setMaterials] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => { fetchMaterials() }, [page, statusFilter])

  const fetchMaterials = async () => {
    setLoading(true)
    try {
      const params = { page, page_size: 15 }
      if (keyword) params.keyword = keyword
      if (statusFilter) params.status = statusFilter
      const res = await api.get('/admin/materials', { params })
      setMaterials(res.data.items || [])
      setTotal(res.data.total || 0)
    } catch { /* handled */ }
    finally { setLoading(false) }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchMaterials()
  }

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/materials/${id}/status?status=${status}`)
      toast.success('状态更新成功')
      fetchMaterials()
    } catch { /* handled */ }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/admin/materials/${deleteTarget.id}`)
      toast.success('素材删除成功')
      setDeleteTarget(null)
      fetchMaterials()
    } catch { /* handled */ }
  }

  const totalPages = Math.ceil(total / 15)
  const statusMap = { approved: '已审核', pending: '待审核', rejected: '已拒绝' }
  const statusColor = { approved: 'bg-green-50 text-green-700', pending: 'bg-amber-50 text-amber-700', rejected: 'bg-red-50 text-red-700' }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">素材管理</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索素材标题..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </form>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">全部状态</option>
            <option value="approved">已审核</option>
            <option value="pending">待审核</option>
            <option value="rejected">已拒绝</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left py-3 px-4 font-medium">素材</th>
                <th className="text-left py-3 px-4 font-medium">上传者</th>
                <th className="text-left py-3 px-4 font-medium">分类</th>
                <th className="text-left py-3 px-4 font-medium">状态</th>
                <th className="text-left py-3 px-4 font-medium">数据</th>
                <th className="text-right py-3 px-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="py-4 px-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : materials.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">暂无数据</td></tr>
              ) : (
                materials.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {m.thumbnail_url && <img src={m.thumbnail_url} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate max-w-[200px]">{m.title}</p>
                          <p className="text-xs text-gray-400">{m.created_at?.split('T')[0] || m.created_at?.split(' ')[0]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{m.user_nickname || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{m.category_name || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[m.status] || ''}`}>
                        {statusMap[m.status] || m.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      <span>👁 {m.view_count}</span>
                      <span className="ml-2">❤ {m.like_count}</span>
                      <span className="ml-2">⬇ {m.download_count}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {m.status !== 'approved' && (
                          <button onClick={() => updateStatus(m.id, 'approved')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="通过">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {m.status !== 'rejected' && (
                          <button onClick={() => updateStatus(m.id, 'rejected')} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg" title="拒绝">
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => setDeleteTarget(m)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="删除">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">共 {total} 条</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="p-1.5 rounded border border-gray-200 disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1.5 text-sm text-gray-700">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="p-1.5 rounded border border-gray-200 disabled:opacity-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="确认删除">
        <div>
          <p className="text-gray-600 mb-4">确定要删除素材「{deleteTarget?.title}」吗？此操作不可撤销。</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1">取消</button>
            <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex-1 transition-colors">删除</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
