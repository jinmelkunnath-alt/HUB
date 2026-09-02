/**
 * Lotus Hub development runner.
 *
 * Starts both the API server (server/index.js) and the Vite dev server in a
 * single process. Vite proxies `/api` requests to the API server so cookies
 * stay same-origin. Ctrl+C shuts both down.
 */

import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const children = []

function start(name, cmd, args, cwd) {
  const child = spawn(cmd, args, {
    cwd: cwd || ROOT,
    stdio: 'inherit',
    env: process.env,
  })
  children.push(child)
  child.on('exit', (code) => {
    console.log(`[dev] ${name} exited (code ${code})`)
  })
  return child
}

const api = start('api', process.execPath, ['server/index.js'])
// Windows compat not needed here; this is the sandbox dev runner.
const vite = start('vite', process.execPath, [
  path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js'),
])

function shutdown(signal) {
  console.log(`[dev] ${signal} received, shutting down...`)
  for (const child of children) {
    try {
      child.kill(signal)
    } catch {
      /* ignore */
    }
  }
  setTimeout(() => process.exit(0), 300).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('exit', () => {
  for (const child of children) {
    try {
      child.kill()
    } catch {
      /* ignore */
    }
  }
})

api.on('error', (e) => console.error('[dev] API error:', e.message))
vite.on('error', (e) => console.error('[dev] Vite error:', e.message))
