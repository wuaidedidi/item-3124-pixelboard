import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">P</span>
                </div>
                <span className="font-bold text-gray-900">PixelBoard</span>
              </div>
              <p className="text-sm text-gray-500">发现、收藏、分享高质量创意素材</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3 text-sm">探索</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="/explore" className="hover:text-gray-700">浏览素材</a></li>
                <li><a href="/explore?sort=popular" className="hover:text-gray-700">热门推荐</a></li>
                <li><a href="/explore?sort=latest" className="hover:text-gray-700">最新上传</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3 text-sm">会员</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="/membership" className="hover:text-gray-700">会员计划</a></li>
                <li><a href="/membership#compare" className="hover:text-gray-700">权益对比</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3 text-sm">关于</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><span className="cursor-default">服务条款</span></li>
                <li><span className="cursor-default">隐私政策</span></li>
                <li><span className="cursor-default">联系我们</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-8 pt-6 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} PixelBoard. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
