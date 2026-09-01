/**
 * Global UI restrictions (Phase 1).
 *
 * These are presentation-layer niceties only — they are NOT a security
 * mechanism. Right-click, long-press and image drag are suppressed to keep
 * the media-platform UI feeling focused. Keyboard navigation, focus and other
 * accessibility behaviour are intentionally left intact.
 */

/** Prevents the default browser context menu on an element. */
function blockContextMenu(e: Event): void {
  e.preventDefault()
}

/** Prevents image drag & drop on an element. */
function blockImageDrag(e: DragEvent): void {
  e.preventDefault()
}

/**
 * Installs the global UI restrictions on the document.
 * Long-press is handled via contextmenu (the main trigger on touch/mobile).
 * Returns an unsubscribe function.
 */
export function installUIRestrictions(): () => void {
  document.addEventListener('contextmenu', blockContextMenu)
  document.addEventListener('dragstart', blockImageDrag)

  return () => {
    document.removeEventListener('contextmenu', blockContextMenu)
    document.removeEventListener('dragstart', blockImageDrag)
  }
}

/** Marks images as non-draggable in JSX (supplementary to dragstart guard). */
export const noDrag = { draggable: false as const }
