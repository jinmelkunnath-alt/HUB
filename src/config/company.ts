/**
 * Public operator / company placeholders used by legal & contact pages (Phase 7).
 *
 * The project owner must supply the real operating details before production.
 * Nothing here is assumed to be legally accurate — values are clearly marked
 * placeholders and are wired to environment variables so the operator can be
 * configured without editing code.
 */

import { APP_NAME } from './env'
import { getContactDestination, getContactLabel, getContactMethod } from './contact'

const metaEnv = (import.meta?.env ?? {}) as Record<string, string | undefined>

/** A neutral display name for the service operator until one is provided. */
export const OPERATOR_NAME: string =
  metaEnv.VITE_OPERATOR_NAME || APP_NAME

/** True once the owner has supplied a real contact/legal identity. */
export const hasConfiguredOperator: boolean =
  Boolean(metaEnv.VITE_OPERATOR_NAME) || Boolean(metaEnv.VITE_CONTACT_EMAIL)

export const OPERATOR_CONTACT_LABEL = getContactLabel()
export const OPERATOR_CONTACT_DESTINATION = getContactDestination()
export const OPERATOR_CONTACT_METHOD = getContactMethod()

/**
 * A short disclosure shown on legal pages when the operator's real identity has
 * not been configured yet, so we never present placeholder text as final.
 */
export function operatorNotice(): string | null {
  if (hasConfiguredOperator) return null
  return 'This page uses a placeholder operator identity. The project owner must provide the registered business name, address and contact details before publishing.'
}
