/**
 * End-to-end auth test runner.
 *
 * Spins up an isolated API server (fresh temp DB, high rate limits, seeded
 * super admin, dev-telegram mode on a random port), runs the backend auth test
 * suite and the frontend service integration suite against it, then tears the
 * server down. This keeps rate-limit state and database state from leaking
 * between tests or into the dev database.
 *
 * Usage: npm run test:e2e
 */

import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const port = 10000 + Math.floor(Math.random() * 20000)
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lotus-test-'))
const apiBase = `http://localhost:${port}/api`

const serverEnv = {
  ...process.env,
  PORT: String(port),
  LOTUS_DATA_DIR: path.join(tmpDir, 'data'),
  LOTUS_SUPERADMIN_USERNAME: 'admin',
  LOTUS_SUPERADMIN_PASSWORD: 'AdminPass1',
  RATE_LIMIT_REGISTER_MAX: '1000',
  RATE_LIMIT_LOGIN_MAX: '1000',
  TELEGRAM_DEV_MODE: 'true',
}

const server = spawn(process.execPath, ['server/index.js'], {
  cwd: ROOT,
  env: serverEnv,
  stdio: 'inherit',
})

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function waitReady() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`${apiBase}/health`)
      if (res.ok) return
    } catch {
      /* retry */
    }
    await sleep(200)
  }
  throw new Error('API server did not become ready')
}

function run(name, script) {
  return new Promise((resolve) => {
    const env = {
      ...process.env,
      TEST_API_BASE: apiBase,
      TEST_ADMIN_USER: 'admin',
      TEST_ADMIN_PASS: 'AdminPass1',
      // Lets server-side suites (e.g. download-access) manipulate the same DB
      // (token batches, daily-reset simulation) through the real data layer.
      TEST_DATA_DIR: path.join(tmpDir, 'data'),
    }
    const child = spawn(process.execPath, [script], {
      cwd: ROOT,
      env,
      stdio: 'inherit',
    })
    child.on('exit', (code) => {
      console.log(`\n[run-e2e] ${name} ${code === 0 ? 'PASSED' : 'FAILED'} (exit ${code})`)
      resolve(code === 0)
    })
  })
}

let ok = true
try {
  await waitReady()
  console.log('========================================')
  console.log('  Lotus Hub — E2E (auth + content + access + account + admin)')
  console.log(`  API: ${apiBase}`)
  console.log('========================================')

  const authOk = await run('backend auth suite', 'scripts/test-auth.mjs')
  const rlOk = await run('rate-limit suite', 'scripts/test-ratelimit.mjs')
  const contentOk = await run('content discovery suite', 'scripts/test-content.mjs')
  const accessOk = await run('download access suite', 'scripts/test-access.mjs')
  const accountOk = await run('account summary suite', 'scripts/test-account.mjs')
  const adminOk = await run('super admin suite', 'scripts/test-admin.mjs')
  const uiOk = await run('frontend service suite', 'scripts/test-ui.bundle.mjs')
  ok = authOk && rlOk && contentOk && accessOk && accountOk && adminOk && uiOk
} catch (err) {
  console.error('[run-e2e]', err.message)
  ok = false
} finally {
  server.kill('SIGTERM')
  // Give the server a moment to close the DB before cleanup.
  await sleep(500)
  fs.rmSync(tmpDir, { recursive: true, force: true })
}

console.log(`\n==== E2E ${ok ? 'PASSED' : 'FAILED'} ====`)
process.exit(ok ? 0 : 1)
