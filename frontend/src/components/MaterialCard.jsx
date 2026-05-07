import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Download, Eye, Crown } from 'lucide-react'
import { formatNumber } from '../utils/validators'

export default function MaterialCard({ material }) {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const aspectRatio = material.width && material.height
    ? material.height / material.width
    : 1.2

  return (
    <div
      className="group cursor-pointer mb-4 break-inside-avoid"
      onClick={() => navigate(`/material/${material.id}`)}
    >
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
        <div style={{ paddingBottom: `${Math.min(aspectRatio * 100, 180)}%` }} className="relative">
          {!loaded && !error && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
          )}
          {error ? (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">加载失败</span>
            </div>
          ) : (
            <img
              src={material.thumbnail_url || material.image_url}
              alt={material.title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
            />
          )}

          {material.is_premium && (
            <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" />
              <span>会员</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <p className="text-white text-sm font-medium line-clamp-1 mb-1">{material.title}</p>
            <div className="flex items-center gap-3 text-white/80 text-xs">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {formatNumber(material.like_count)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {formatNumber(material.view_count)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {material.user && (
        <div className="flex items-center gap-2 mt-2 px-1">
          <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {material.user.avatar ? (
              <img src={material.user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-medium">
                {(material.user.nickname || material.user.username || '?')[0]}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500 truncate">{material.user.nickname || material.user.username}</span>
        </div>
      )}
    </div>
  )
}
