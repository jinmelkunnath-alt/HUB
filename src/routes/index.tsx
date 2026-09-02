import { lazy } from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'
import RouteError from '@/pages/errors/RouteError'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { AdminRoute } from '@/components/auth/AdminRoute'

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

// Admin pages (lazy-loaded — only fetched by the super admin console).
const AdminOverview = lazy(() => import('@/pages/admin/AdminOverview'))
const AdminFiles = lazy(() => import('@/pages/admin/AdminFiles'))
const AdminCategories = lazy(() => import('@/pages/admin/AdminCategories'))
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'))
const AdminTopups = lazy(() => import('@/pages/admin/AdminTopups'))
const AdminAudit = lazy(() => import('@/pages/admin/AdminAudit'))

// Error / system pages
import Error401 from '@/pages/errors/Error401'
import Error403 from '@/pages/errors/Error403'
import Error404 from '@/pages/errors/Error404'
import Error429 from '@/pages/errors/Error429'
import Error500 from '@/pages/errors/Error500'
import Error502 from '@/pages/errors/Error502'
import Error503 from '@/pages/errors/Error503'
import Offline from '@/pages/errors/Offline'
import SessionExpired from '@/pages/errors/SessionExpired'

/** Error/system pages use a minimal wrapper (no header/footer). */
function ErrorShell() {
  return <Outlet />
}

/**
 * Routes.
 *  - Public pages (login, register, faq, contact, terms, privacy, cookies) are
 *    accessible without auth.
 *  - Application/content pages are wrapped in <RequireAuth />.
 *  - The admin dashboard is wrapped in <AdminRoute /> (server-enforced).
 */
export const router = createBrowserRouter(
  [
    {
      element: <PublicLayout />,
      errorElement: <RouteError />,
      children: [
        // Public (no auth required)
        { path: '/faq', element: <FAQ /> },
        { path: '/contact', element: <Contact /> },
        { path: '/terms', element: <Terms /> },
        { path: '/privacy', element: <Privacy /> },
        { path: '/cookies', element: <Cookies /> },

        // Protected application pages
        {
          element: <RequireAuth />,
          errorElement: <RouteError />,
          children: [
            { path: '/', element: <Home /> },
            { path: '/browse', element: <Browse /> },
            { path: '/categories', element: <Categories /> },
            { path: '/file/:id', element: <FileDetails /> },
            { path: '/tokens', element: <Tokens /> },
            { path: '/profile', element: <Profile /> },
          ],
        },
      ],
    },
    {
      element: <AuthLayout />,
      errorElement: <RouteError />,
      children: [
        { path: '/login', element: <Login /> },
        { path: '/register', element: <Register /> },
      ],
    },
    {
      path: '/Admin/admin',
      element: <AdminRoute />,
      errorElement: <RouteError />,
      children: [
        {
          element: <AdminLayout />,
          errorElement: <RouteError />,
          children: [
            { index: true, element: <AdminOverview /> },
            { path: 'files', element: <AdminFiles /> },
            { path: 'categories', element: <AdminCategories /> },
            { path: 'users', element: <AdminUsers /> },
            { path: 'topups', element: <AdminTopups /> },
            { path: 'audit', element: <AdminAudit /> },
          ],
        },
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
        { path: '/session-expired', element: <SessionExpired /> },
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
