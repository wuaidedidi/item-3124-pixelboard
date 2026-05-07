import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Explore from './pages/Explore'
import MaterialDetail from './pages/MaterialDetail'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Upload from './pages/Upload'
import Membership from './pages/Membership'
import BoardDetail from './pages/BoardDetail'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import MaterialManagement from './pages/admin/MaterialManagement'
import CategoryManagement from './pages/admin/CategoryManagement'

export default function App() {
  const { isAuthenticated, user } = useAuthStore()

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/material/:id" element={<MaterialDetail />} />
          <Route path="/user/:id" element={<Profile />} />
          <Route path="/board/:id" element={<BoardDetail />} />
          <Route path="/membership" element={<Membership />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/settings" element={<Settings />} />
            <Route path="/upload" element={<Upload />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="materials" element={<MaterialManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ErrorBoundary>
  )
}
