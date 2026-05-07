import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import api from '../../api'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

export default function CategoryManagement() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', sort_order: 0 })
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/admin/categories')
      setCategories(res.data || [])
    } catch { /* handled */ }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditId(null)
    setForm({ name: '', description: '', sort_order: 0 })
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditId(cat.id)
    setForm({ name: cat.name, description: cat.description || '', sort_order: cat.sort_order || 0 })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('请输入分类名称'); return }
    try {
      if (editId) {
        await api.put(`/admin/categories/${editId}`, form)
        toast.success('分类更新成功')
      } else {
        await api.post('/admin/categories', form)
        toast.success('分类创建成功')
      }
      setShowModal(false)
      fetchCategories()
    } catch { /* handled */ }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await api.delete(`/admin/categories/${deleteTarget.id}`)
      toast.success('分类删除成功')
      setDeleteTarget(null)
      fetchCategories()
    } catch { /* handled */ }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> 新建分类
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left py-3 px-4 font-medium">排序</th>
                <th className="text-left py-3 px-4 font-medium">分类名称</th>
                <th className="text-left py-3 px-4 font-medium">描述</th>
                <th className="text-left py-3 px-4 font-medium">素材数量</th>
                <th className="text-right py-3 px-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="py-4 px-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : categories.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">暂无分类</td></tr>
              ) : (
                categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-500">{cat.sort_order}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {cat.cover_image && (
                          <div className="w-8 h-8 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                            <img src={cat.cover_image} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 max-w-[300px] truncate">{cat.description || '-'}</td>
                    <td className="py-3 px-4 text-gray-600">{cat.material_count || 0}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(cat)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="编辑">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(cat)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="删除">
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
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editId ? '编辑分类' : '新建分类'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">分类名称 <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              placeholder="如：摄影、插画"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">描述</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field resize-none"
              rows={2}
              placeholder="分类描述（选填）"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">排序</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              className="input-field w-32"
              min={0}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">取消</button>
            <button type="submit" className="btn-primary flex-1">{editId ? '保存' : '创建'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="确认删除">
        <div>
          <p className="text-gray-600 mb-4">确定要删除分类「{deleteTarget?.name}」吗？</p>
          {deleteTarget?.material_count > 0 && (
            <p className="text-amber-600 text-sm mb-4">该分类下有 {deleteTarget.material_count} 个素材，无法删除。</p>
          )}
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)} className="btn-secondary flex-1">取消</button>
            <button
              onClick={handleDelete}
              disabled={deleteTarget?.material_count > 0}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 flex-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              删除
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
