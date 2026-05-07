import { useState, useEffect } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../../api'
import useAuthStore from '../../store/authStore'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

export default function UserManagement() {
  const { user: currentAdmin } = useAuthStore()
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [editUser, setEditUser] = useState(null)
  const [editForm, setEditForm] = useState({ role: '', status: '' })

  useEffect(() => { fetchUsers() }, [page, roleFilter, statusFilter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = { page, page_size: 15 }
      if (keyword) params.keyword = keyword
      if (roleFilter) params.role = roleFilter
      if (statusFilter) params.status = statusFilter
      const res = await api.get('/admin/users', { params })
      setUsers(res.data.items || [])
      setTotal(res.data.total || 0)
    } catch { /* handled */ }
    finally { setLoading(false) }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchUsers()
  }

  const openEdit = (u) => {
    setEditUser(u)
    setEditForm({ role: u.role, status: u.status })
  }

  const handleUpdate = async () => {
    if (!editUser) return
    try {
      await api.put(`/admin/users/${editUser.id}`, editForm)
      toast.success('用户信息更新成功')
      setEditUser(null)
      fetchUsers()
    } catch { /* handled */ }
  }

  const totalPages = Math.ceil(total / 15)
  const isSelf = (u) => currentAdmin?.id === u.id

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">用户管理</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
          <form onSubmit={handleSearch} className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索用户名/昵称..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </form>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">全部角色</option>
            <option value="admin">管理员</option>
            <option value="user">普通用户</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">全部状态</option>
            <option value="active">正常</option>
            <option value="disabled">禁用</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="text-left py-3 px-4 font-medium">用户</th>
                <th className="text-left py-3 px-4 font-medium">角色</th>
                <th className="text-left py-3 px-4 font-medium">状态</th>
                <th className="text-left py-3 px-4 font-medium">会员</th>
                <th className="text-left py-3 px-4 font-medium">注册时间</th>
                <th className="text-right py-3 px-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="py-4 px-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">暂无数据</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {u.avatar ? (
                            <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-primary-600 text-xs font-medium">{(u.nickname || u.username || '?')[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{u.nickname || u.username}</p>
                          <p className="text-xs text-gray-400">{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role === 'admin' ? '管理员' : '用户'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${u.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {u.status === 'active' ? '正常' : '禁用'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{u.membership_plan_name}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{u.created_at?.split('T')[0] || u.created_at?.split(' ')[0]}</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => openEdit(u)} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        编辑
                      </button>
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

      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="编辑用户">
        {editUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-medium">{(editUser.nickname || editUser.username || '?')[0]}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{editUser.nickname || editUser.username}</p>
                <p className="text-xs text-gray-500">{editUser.username}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">角色</label>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                disabled={isSelf(editUser)}
                className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="user">普通用户</option>
                <option value="admin">管理员</option>
              </select>
              {isSelf(editUser) && <p className="text-xs text-amber-600 mt-1">管理员不能修改自己的角色</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">状态</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                disabled={isSelf(editUser)}
                className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="active">正常</option>
                <option value="disabled">禁用</option>
              </select>
              {isSelf(editUser) && <p className="text-xs text-amber-600 mt-1">管理员不能禁用自己的账号</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditUser(null)} className="btn-secondary flex-1">取消</button>
              <button onClick={handleUpdate} className="btn-primary flex-1" disabled={isSelf(editUser)}>保存</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
