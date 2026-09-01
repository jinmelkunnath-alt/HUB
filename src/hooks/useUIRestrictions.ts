import { useEffect } from 'react'
import { installUIRestrictions } from '@/utils/uiRestrictions'

/** Installs global UI restrictions (context menu, drag) once on mount. */
export function useUIRestrictions(): void {
  useEffect(() => {
    return installUIRestrictions()
  }, [])
}
