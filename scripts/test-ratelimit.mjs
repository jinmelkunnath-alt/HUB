/**
 * Isolated rate-limiting test. Spawns its own API server with a low login
 * limit so the feature can be verified without disturbing the other suites.
 */

import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const port = 20000 + Math.floor(Math.random() * 10000)
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lotus-ratelimit-'))
const api = `http://localhost:${port}/api`

const server = spawn(process.execPath, ['server/index.js'], {
  cwd: ROOT,
  env: {
    ...process.env,
    PORT: String(port),
    LOTUS_DATA_DIR: path.join(tmpDir, 'data'),
    RATE_LIMIT_LOGIN_MAX: '3',
    RATE_LIMIT_REGISTER_MAX: '1000',
    TELEGRAM_DEV_MODE: 'true',
  },
  stdio: 'ignore',
})

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function waitReady() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`${api}/health`)
      if (res.ok) return
    } catch {
      /* retry */
    }
    await sleep(200)
  }
  throw new Error('server not ready')
}

let pass = 0
let fail = 0
const check = (name, cond, extra) => {
  if (cond) {
    pass++
    console.log(`  ✔ ${name}`)
  } else {
    fail++
    console.log(`  ✘ ${name}${extra ? ' — ' + JSON.stringify(extra) : ''}`)
  }
}

try {
  await waitReady()
  let saw429 = false
  let saw429Message = false
  for (let i = 0; i < 6; i++) {
    const res = await fetch(`${api}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'nobody', password: 'x' }),
    })
    if (res.status === 429) {
      saw429 = true
      const body = await res.json()
      if (typeof body.message === 'string') saw429Message = true
    }
  }
  check('login rate limit returns 429', saw429)
  check('429 has friendly message', saw429Message)
} catch (e) {
  console.error('[test-ratelimit]', e.message)
  fail++
} finally {
  server.kill('SIGTERM')
  await sleep(400)
  fs.rmSync(tmpDir, { recursive: true, force: true })
}

console.log(`\n==== rate-limit ${fail === 0 ? 'PASSED' : 'FAILED'} (${pass} ok) ====`)
process.exit(fail === 0 ? 0 : 1)
