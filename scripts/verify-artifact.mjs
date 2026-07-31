import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'

const fragment = readFileSync('turnkey-app.html', 'utf8')
// mimic the Artifact wrapper: doctype + head + body
const doc = `<!doctype html><html><head><meta charset="utf-8"></head><body>${fragment}</body></html>`
writeFileSync('/tmp/artifact-test.html', doc)

const errors = []
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()) })
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

await page.goto('file:///tmp/artifact-test.html', { waitUntil: 'load' })
await page.waitForTimeout(1200)

const rootText = (await page.locator('#root').innerText().catch(() => '')).slice(0, 200)
await page.screenshot({ path: '/tmp/claude-0/-home-user-Cc/deb7c85f-051b-522a-a3ef-49166c525c62/scratchpad/artifact-landing.png' })

// navigate to manager portal via hash
await page.goto('file:///tmp/artifact-test.html#/manager', { waitUntil: 'load' })
await page.waitForTimeout(1000)
const mgrText = (await page.locator('#root').innerText().catch(() => '')).slice(0, 120)
await page.screenshot({ path: '/tmp/claude-0/-home-user-Cc/deb7c85f-051b-522a-a3ef-49166c525c62/scratchpad/artifact-manager.png' })

await browser.close()
console.log('LANDING TEXT:', JSON.stringify(rootText))
console.log('MANAGER TEXT:', JSON.stringify(mgrText))
console.log('ERRORS:', errors.length ? '\n' + errors.join('\n') : 'none')
