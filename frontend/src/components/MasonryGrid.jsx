import Masonry from 'react-masonry-css'
import MaterialCard from './MaterialCard'

const breakpointColumns = {
  default: 5,
  1536: 5,
  1280: 4,
  1024: 3,
  768: 2,
  640: 2,
}

export default function MasonryGrid({ materials = [], loading = false }) {
  if (loading && materials.length === 0) {
    return (
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-4 w-auto"
        columnClassName="pl-4 bg-clip-padding"
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="mb-4 break-inside-avoid">
            <div
              className="rounded-2xl bg-gray-100 animate-pulse"
              style={{ paddingBottom: `${100 + Math.random() * 60}%` }}
            />
            <div className="flex items-center gap-2 mt-2 px-1">
              <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
            </div>
          </div>
        ))}
      </Masonry>
    )
  }

  if (materials.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">暂无素材</p>
      </div>
    )
  }

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-4 w-auto"
      columnClassName="pl-4 bg-clip-padding"
    >
      {materials.map((m) => (
        <MaterialCard key={m.id} material={m} />
      ))}
    </Masonry>
  )
}
