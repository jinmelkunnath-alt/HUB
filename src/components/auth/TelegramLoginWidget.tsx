import { useEffect, useRef } from 'react'
import { TELEGRAM_BOT_USERNAME } from '@/config/env'

declare global {
  interface Window {
    // Telegram Login Widget callback (set by us, called by the widget).
    onLotusTelegramAuth?: (user: unknown) => void
  }
}

interface TelegramUser {
  id: number
  first_name?: string
  last_name?: string
  username?: string
  auth_date?: number
  hash?: string
}

interface TelegramLoginWidgetProps {
  onAuth: (user: TelegramUser) => void
}

/**
 * Official Telegram Login Widget. Loads the widget from telegram.org with the
 * configured public bot username. The signed auth data is handed to the parent
 * and verified server-side by the backend — the bot token never touches the
 * browser.
 */
export function TelegramLoginWidget({ onAuth }: TelegramLoginWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onAuthRef = useRef(onAuth)
  onAuthRef.current = onAuth

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Expose the callback the widget invokes with the signed user object.
    window.onLotusTelegramAuth = (rawUser) => {
      onAuthRef.current(rawUser as TelegramUser)
    }

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.setAttribute('data-telegram-login', TELEGRAM_BOT_USERNAME)
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-radius', '8')
    script.setAttribute('data-onauth', 'window.onLotusTelegramAuth(user)')
    container.appendChild(script)

    return () => {
      script.remove()
      delete window.onLotusTelegramAuth
    }
  }, [])

  if (!TELEGRAM_BOT_USERNAME) return null

  return <div ref={containerRef} className="telegram-widget" aria-label="Telegram login" />
}
