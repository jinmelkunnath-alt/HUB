import { createBrowserRouter, Outlet } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AdminLayout } from '@/layouts/AdminLayout'

// Public pages
import Home from '@/pages/public/Home'
import Browse from '@/pages/public/Browse'
import Categories from '@/pages/public/Categories'
import FileDetails from '@/pages/public/FileDetails'
import Tokens from '@/pages/public/Tokens'
import Profile from '@/pages/public/Profile'
import FAQ from '@/pages/public/FAQ'
import Contact from '@/pages/public/Contact'
import Terms from '@/pages/public/Terms'
import Privacy from '@/pages/public/Privacy'
import Cookies from '@/pages/public/Cookies'

// Auth pages
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

// Admin pages
import AdminOverview from '@/pages/admin/AdminOverview'
import AdminFiles from '@/pages/admin/AdminFiles'
import AdminCategories from '@/pages/admin/AdminCategories'
import AdminUsers from '@/pages/admin/AdminUsers'
import AdminTopups from '@/pages/admin/AdminTopups'
import AdminAnalytics from '@/pages/admin/AdminAnalytics'
import AdminAudit from '@/pages/admin/AdminAudit'
import AdminSettings from '@/pages/admin/AdminSettings'

// Error / system pages
import Error401 from '@/pages/errors/Error401'
import Error403 from '@/pages/errors/Error403'
import Error404 from '@/pages/errors/Error404'
import Error429 from '@/pages/errors/Error429'
import Error500 from '@/pages/errors/Error500'
import Error502 from '@/pages/errors/Error502'
import Error503 from '@/pages/errors/Error503'
import Offline from '@/pages/errors/Offline'

/** Error pages need their own simple wrapper (no header/footer). */
function ErrorShell() {
  return <Outlet />
}

export const router = createBrowserRouter(
  [
    {
      element: <PublicLayout />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/browse', element: <Browse /> },
        { path: '/categories', element: <Categories /> },
        { path: '/file/:id', element: <FileDetails /> },
        { path: '/tokens', element: <Tokens /> },
        { path: '/profile', element: <Profile /> },
        { path: '/faq', element: <FAQ /> },
        { path: '/contact', element: <Contact /> },
        { path: '/terms', element: <Terms /> },
        { path: '/privacy', element: <Privacy /> },
        { path: '/cookies', element: <Cookies /> },
      ],
    },
    {
      element: <AuthLayout />,
      children: [
        { path: '/login', element: <Login /> },
        { path: '/register', element: <Register /> },
      ],
    },
    {
      path: '/Admin/admin',
      element: <AdminLayout />,
      children: [
        { index: true, element: <AdminOverview /> },
        { path: 'files', element: <AdminFiles /> },
        { path: 'categories', element: <AdminCategories /> },
        { path: 'users', element: <AdminUsers /> },
        { path: 'topups', element: <AdminTopups /> },
        { path: 'analytics', element: <AdminAnalytics /> },
        { path: 'audit', element: <AdminAudit /> },
        { path: 'settings', element: <AdminSettings /> },
      ],
    },
    {
      element: <ErrorShell />,
      children: [
        { path: '/error/401', element: <Error401 /> },
        { path: '/error/403', element: <Error403 /> },
        { path: '/error/429', element: <Error429 /> },
        { path: '/error/500', element: <Error500 /> },
        { path: '/error/502', element: <Error502 /> },
        { path: '/error/503', element: <Error503 /> },
        { path: '/offline', element: <Offline /> },
        { path: '*', element: <Error404 /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
)
