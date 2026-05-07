import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Upload as UploadIcon, X, Image, Loader2 } from 'lucide-react'
import api from '../api'
import toast from 'react-hot-toast'

export default function Upload() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    tags: '',
    is_premium: false,
  })

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data || [])).catch(() => {})
  }, [])

  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles[0]
    if (f) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
      if (!form.title) {
        const name = f.name.replace(/\.[^/.]+$/, '')
        setForm(prev => ({ ...prev, title: name }))
      }
    }
  }, [form.title])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  })

  const removeFile = () => {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) { toast.error('请选择要上传的图片'); return }
    if (!form.title.trim()) { toast.error('请输入素材标题'); return }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', form.title.trim())
    if (form.description) formData.append('description', form.description)
    if (form.category_id) formData.append('category_id', form.category_id)
    if (form.tags) formData.append('tags', form.tags)
    formData.append('is_premium', form.is_premium)

    try {
      const res = await api.post('/materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      toast.success('素材上传成功')
      navigate(`/material/${res.data.id}`)
    } catch { /* handled */ }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">上传素材</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {!file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <UploadIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-700 font-medium mb-1">拖拽图片到此处或点击上传</p>
              <p className="text-sm text-gray-400">支持 JPG、PNG、GIF、WebP、SVG，最大 20MB</p>
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={removeFile}
                className="absolute top-2 right-2 z-10 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <img src={preview} alt="预览" className="w-full max-h-96 object-contain rounded-xl bg-gray-100" />
              <p className="text-xs text-gray-500 mt-2">{file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">标题 <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field"
              placeholder="为你的素材起个好名字"
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">描述</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field resize-none"
              rows={3}
              placeholder="描述一下这个素材..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">分类</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="input-field"
              >
                <option value="">选择分类</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">标签</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="input-field"
                placeholder="用逗号分隔，如：风景,自然,日落"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_premium"
              checked={form.is_premium}
              onChange={(e) => setForm({ ...form, is_premium: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="is_premium" className="text-sm text-gray-700">设为会员专享素材</label>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">取消</button>
          <button type="submit" disabled={loading || !file} className="btn-primary flex-1 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadIcon className="w-4 h-4" />}
            {loading ? '上传中...' : '上传素材'}
          </button>
        </div>
      </form>
    </div>
  )
}
