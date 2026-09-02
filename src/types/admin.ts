/**
 * Admin (Phase 6) types for the Super Admin dashboard. These mirror the
 * superadmin-only API responses. Sensitive values (archive passwords, provider
 * destinations) are never included in these client types.
 */

export interface OverviewMetrics {
  totalUsers: number
  activeUsers: number
  totalPublishedFiles: number
  totalFiles: number
  totalDownloadAuthorizations: number
  totalCategories: number
  activeTokenBalance: number
  tokensAdded: number
  tokensConsumed: number
}

export type AccountStatus = 'active' | 'disabled'

export interface AdminUser {
  systemUserId: string
  lotusHubId: string
  username: string
  role: string
  accountStatus: AccountStatus
  createdAt: number
}

export interface AdminUserDetail extends AdminUser {
  freeDownloadsToday: { perDay: number; used: number; remaining: number }
  tokenBalance: number
  tokenBatches: number
  nextTokenExpiryAt: number | null
  downloadAuthorizations: number
}

export interface AdminFile {
  id: string
  title: string
  description: string
  type: string
  category: string
  thumbnailUrl: string | null
  tags: string[]
  fileSize: number
  provider: string
  featured: boolean
  published: boolean
  hue: number
  duration: string
  rating: string
  createdAt: number
  updatedAt: number
}

export interface AdminFileDetail extends AdminFile {
  hasArchivePassword: boolean
  hasProviderDestination: boolean
  fileName: string
}

export interface FileCreateInput {
  title: string
  description?: string
  type: string
  category: string
  thumbnailUrl?: string
  tags?: string[]
  fileSize?: number
  provider?: string
  featured?: boolean
  published?: boolean
  duration?: string
  rating?: string
  archivePassword?: string
  providerDestination?: string
  fileName?: string
}

export interface AdminCategory {
  id: string
  name: string
  active: boolean
  fileCount: number
  createdAt: number
}

export interface AuditEntry {
  id: number
  action: string
  targetType: string
  targetId: string
  targetLabel: string
  detail: Record<string, unknown>
  actorUsername: string
  createdAt: number
}

export interface TokenTopUpResult {
  ok: boolean
  id: string
  amount: number
  expiresAt: number
}
