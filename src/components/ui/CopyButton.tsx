import { useRef, useState } from 'react'
import { cn } from '@/utils/cn'

interface CopyButtonProps {
  /** The text value to copy. */
  value: string
  /** Accessible label / default button text. */
  label?: string
  /** Accessible live-region message shown after a successful copy. */
  feedback?: string
  className?: string
}

/**
 * Copy button with clear accessible feedback. After a successful copy the label
 * briefly becomes "✓ Copied" and an aria-live region announces the feedback so
 * screen-reader and sighted users both get confirmation.
 */
export function CopyButton({
  value,
  label = 'Copy',
  feedback = 'Copied to clipboard',
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<number | null>(null)

  const handleCopy = async () => {
    if (!value) return
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
      } else {
        const ta = document.createElement('textarea')
        ta.value = value
        ta.setAttribute('readonly', '')
        ta.style.position = 'absolute'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore copy failures silently */
    }
  }

  return (
    <span className={cn('copybox', className)}>
      <button
        type="button"
        className={cn('btn', 'btn-secondary', 'btn-sm', copied && 'is-copied')}
        onClick={handleCopy}
        aria-label={copied ? `${label} — ${feedback}` : label}
      >
        <span aria-hidden="true">{copied ? '✓ ' : ''}</span>
        {copied ? 'Copied' : label}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? feedback : ''}
      </span>
    </span>
  )
}
