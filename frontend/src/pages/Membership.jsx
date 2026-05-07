import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Crown, Zap, Star, Loader2, X, AlertCircle } from 'lucide-react'
import api from '../api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function Membership() {
  const navigate = useNavigate()
  const { isAuthenticated, user, updateUser } = useAuthStore()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(null)
  const [confirmPlan, setConfirmPlan] = useState(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const res = await api.get('/membership/plans')
      setPlans(res.data || [])
    } catch { /* handled */ }
    finally { setLoading(false) }
  }

  const handleSubscribeClick = (plan) => {
    if (!isAuthenticated) { navigate('/login'); return }
    setConfirmPlan(plan)
  }

  const handleConfirmSubscribe = async () => {
    if (!confirmPlan) return
    const planId = confirmPlan.id
    setSubscribing(planId)
    try {
      const res = await api.post('/membership/subscribe', { plan_id: planId })
      updateUser({
        membership_plan_id: planId,
        membership_plan_name: res.data.plan_name,
        membership_expires_at: res.data.expires_at,
      })
      toast.success(res.message || '订阅成功')
      setConfirmPlan(null)
    } catch { /* handled */ }
    finally { setSubscribing(null) }
  }

  const planIcons = { free: Star, pro: Zap, premium: Crown }
  const planColors = {
    free: { bg: 'bg-gray-50', border: 'border-gray-200', icon: 'text-gray-500', btn: 'bg-gray-600 hover:bg-gray-700' },
    pro: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700' },
    premium: { bg: 'bg-amber-50', border: 'border-amber-300', icon: 'text-amber-600', btn: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' },
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">选择适合你的会员计划</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          解锁更多下载次数、原图画质和无限存储空间，让创作更自由
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => {
            const Icon = planIcons[plan.name] || Star
            const colors = planColors[plan.name] || planColors.free
            const isCurrent = user?.membership_plan_id === plan.id
            const isPremium = plan.name === 'premium'

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 ${isPremium ? 'border-amber-300 shadow-lg shadow-amber-100' : colors.border} ${colors.bg} p-6 transition-all hover:shadow-lg`}
              >
                {isPremium && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    最受欢迎
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-14 h-14 mx-auto rounded-2xl ${colors.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${colors.icon}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name_zh}</h3>
                  <div className="mt-3">
                    {plan.price > 0 ? (
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-3xl font-bold text-gray-900">¥{plan.price}</span>
                        <span className="text-gray-500 text-sm">/月</span>
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900">免费</span>
                    )}
                  </div>
                  {plan.description && (
                    <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {(plan.features || []).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.icon}`} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <button disabled className="w-full py-2.5 rounded-xl text-sm font-medium bg-gray-200 text-gray-500 cursor-not-allowed">
                    当前计划
                  </button>
                ) : plan.name === 'free' ? (
                  <button disabled className="w-full py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed">
                    默认计划
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribeClick(plan)}
                    disabled={subscribing === plan.id}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium text-white ${colors.btn} transition-all flex items-center justify-center gap-2 shadow-sm`}
                  >
                    {subscribing === plan.id ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> 订阅中...</>
                    ) : (
                      `立即订阅`
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* 订阅确认弹窗 */}
      {confirmPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !subscribing && setConfirmPlan(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className={`px-6 pt-6 pb-4 ${planColors[confirmPlan.name]?.bg || 'bg-gray-50'}`}>
              <button
                onClick={() => !subscribing && setConfirmPlan(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${planColors[confirmPlan.name]?.bg || 'bg-gray-100'}`}>
                  {(() => { const Icon = planIcons[confirmPlan.name] || Star; return <Icon className={`w-5 h-5 ${planColors[confirmPlan.name]?.icon || 'text-gray-500'}`} /> })()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{confirmPlan.name_zh}</h3>
                  <p className="text-sm text-gray-500">{confirmPlan.description}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="flex items-start gap-2 mb-4 p-3 bg-amber-50 rounded-xl">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  确认订阅 <strong>{confirmPlan.name_zh}</strong>？
                  {confirmPlan.price > 0 ? `每月费用 ¥${confirmPlan.price}` : '此为免费计划'}
                </p>
              </div>

              <ul className="space-y-2 mb-5">
                {(confirmPlan.features || []).slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className={`w-4 h-4 flex-shrink-0 ${planColors[confirmPlan.name]?.icon || 'text-gray-400'}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmPlan(null)}
                  disabled={subscribing}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmSubscribe}
                  disabled={subscribing}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-white ${planColors[confirmPlan.name]?.btn || 'bg-gray-600'} transition-all flex items-center justify-center gap-2`}
                >
                  {subscribing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> 处理中...</>
                  ) : (
                    '确认订阅'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div id="compare" className="mt-16 bg-white rounded-2xl p-8 border border-gray-100 scroll-mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">权益对比</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">功能</th>
                {plans.map(p => (
                  <th key={p.id} className="text-center py-3 px-4 font-semibold text-gray-900">{p.name_zh}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr>
                <td className="py-3 px-4 text-gray-700">每日下载次数</td>
                {plans.map(p => (
                  <td key={p.id} className="text-center py-3 px-4 text-gray-900 font-medium">
                    {p.max_downloads_per_day >= 9999 ? '无限' : p.max_downloads_per_day}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-700">上传数量</td>
                {plans.map(p => (
                  <td key={p.id} className="text-center py-3 px-4 text-gray-900 font-medium">
                    {p.max_uploads >= 9999 ? '无限' : p.max_uploads}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-700">原图下载</td>
                {plans.map(p => (
                  <td key={p.id} className="text-center py-3 px-4">
                    {p.can_download_original ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-700">存储空间</td>
                {plans.map(p => (
                  <td key={p.id} className="text-center py-3 px-4 text-gray-900 font-medium">
                    {p.storage_limit_mb >= 51200 ? '50GB' : p.storage_limit_mb >= 5120 ? '5GB' : `${p.storage_limit_mb}MB`}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
