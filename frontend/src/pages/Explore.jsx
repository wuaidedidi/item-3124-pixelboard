import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import api from '../api'
import MasonryGrid from '../components/MasonryGrid'

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [materials, setMaterials] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')
  const [categoryId, setCategoryId] = useState(searchParams.get('category_id') || '')
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'default')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchTags()
  }, [])

  useEffect(() => {
    setPage(1)
    setMaterials([])
    fetchMaterials(1)
  }, [categoryId, selectedTag, sort])

  useEffect(() => {
    const kw = searchParams.get('keyword') || ''
    const cat = searchParams.get('category_id') || ''
    const s = searchParams.get('sort') || 'default'
    if (kw !== keyword) setKeyword(kw)
    if (cat !== categoryId) setCategoryId(cat)
    if (s !== sort) setSort(s)
  }, [searchParams])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories')
      setCategories(res.data || [])
    } catch { /* handled */ }
  }

  const fetchTags = async () => {
    try {
      const res = await api.get('/categories/tags')
      setTags(res.data || [])
    } catch { /* handled */ }
  }

  const fetchMaterials = async (p) => {
    if (p === 1) setLoading(true)
    else setLoadingMore(true)
    try {
      const params = { page: p, page_size: 20, sort }
      if (keyword) params.keyword = keyword
      if (categoryId) params.category_id = categoryId
      if (selectedTag) params.tag = selectedTag

      const res = await api.get('/materials', { params })
      const data = res.data
      if (p === 1) {
        setMaterials(data.items || [])
      } else {
        setMaterials(prev => [...prev, ...(data.items || [])])
      }
      setTotal(data.total || 0)
      setHasMore((data.items || []).length >= 20)
    } catch { /* handled */ }
    finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setMaterials([])
    fetchMaterials(1)
  }

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchMaterials(next)
  }

  const clearFilters = () => {
    setKeyword('')
    setCategoryId('')
    setSelectedTag('')
    setSort('default')
    setSearchParams({})
  }

  const hasActiveFilters = keyword || categoryId || selectedTag || sort !== 'default'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">探索素材</h1>
          <p className="text-sm text-gray-500 mt-1">共 {total} 个素材</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="flex-1 sm:w-72 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索素材..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg border transition-colors ${showFilters ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">分类</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryId('')}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${!categoryId ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                全部
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(String(cat.id))}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${String(categoryId) === String(cat.id) ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">热门标签</h3>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 20).map(tag => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(selectedTag === tag.name ? '' : tag.name)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${selectedTag === tag.name ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">排序</h3>
            <div className="flex gap-2">
              {[
                { key: 'default', label: '综合推荐' },
                { key: 'latest', label: '最新上传' },
                { key: 'popular', label: '最受欢迎' },
                { key: 'downloads', label: '下载最多' },
              ].map(s => (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${sort === s.key ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600">
              <X className="w-3 h-3" /> 清除筛选
            </button>
          )}
        </div>
      )}

      <MasonryGrid materials={materials} loading={loading} />

      {hasMore && materials.length > 0 && (
        <div className="text-center mt-8">
          <button onClick={loadMore} disabled={loadingMore} className="btn-secondary px-8 py-2.5">
            {loadingMore ? '加载中...' : '加载更多'}
          </button>
        </div>
      )}
    </div>
  )
}
