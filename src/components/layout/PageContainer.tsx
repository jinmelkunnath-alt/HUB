import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface PageContainerProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'main' | 'section'
  /** Adds the section vertical rhythm. */
  padded?: boolean
}

/** Constrains page content to the design-system max width. */
export function PageContainer({
  children,
  className,
  as: Tag = 'div',
  padded = true,
}: PageContainerProps) {
  return (
    <Tag className={cn('container', padded && 'section', className)}>
      {children}
    </Tag>
  )
}
