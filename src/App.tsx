import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'
import { useUIRestrictions } from '@/hooks/useUIRestrictions'

/** Application root. */
export function App() {
  useUIRestrictions()
  return <RouterProvider router={router} />
}
