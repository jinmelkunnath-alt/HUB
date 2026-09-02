import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'
import { AuthProvider } from '@/context/AuthContext'
import { useUIRestrictions } from '@/hooks/useUIRestrictions'
import { ErrorBoundary } from '@/components/system/ErrorBoundary'

/** Application root. */
export function App() {
  useUIRestrictions()
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ErrorBoundary>
  )
}
