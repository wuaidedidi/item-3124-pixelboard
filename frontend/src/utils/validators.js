export const validateEmail = (email) => {
  if (!email) return true
  const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  return pattern.test(email)
}

export const validatePhone = (phone) => {
  if (!phone) return true
  const pattern = /^1[3-9]\d{9}$/
  return pattern.test(phone)
}

export const validateUsername = (username) => {
  if (!username) return '请输入用户名'
  if (username.length < 2) return '用户名至少2个字符'
  if (username.length > 50) return '用户名最多50个字符'
  return ''
}

export const validatePassword = (password) => {
  if (!password) return '请输入密码'
  if (password.length < 6) return '密码至少6个字符'
  if (password.length > 100) return '密码最多100个字符'
  return ''
}

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

export const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 10000) return `${(num / 10000).toFixed(1)}万`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return String(num)
}
