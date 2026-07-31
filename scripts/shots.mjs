import { chromium } from 'playwright'
const OUT = '/tmp/claude-0/-home-user-Cc/deb7c85f-051b-522a-a3ef-49166c525c62/scratchpad'
const errors = []
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] })

async function shot(path, name, w = 1360) {
  const page = await browser.newPage({ viewport: { width: w, height: 940 }, deviceScaleFactor: 2 })
  page.on('pageerror', (e) => errors.push(name + ': ' + e.message))
  await page.goto('http://localhost:4174' + path, { waitUntil: 'load' })
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${OUT}/${name}.png` })
  await page.close()
  console.log('shot', name)
}

await shot('/', 'r-landing')
await shot('/#/manager', 'r-dashboard')
await shot('/#/manager/properties', 'r-properties')
await shot('/#/manager/contractors', 'r-contractors')
await shot('/#/manager/tasks', 'r-tasks')
await shot('/#/manager/schedule', 'r-schedule')
await shot('/#/provider', 'r-provider')
await shot('/#/manager', 'r-dashboard-narrow', 760)  // confirm icon-rail, no bottom nav

// property detail
const p = await browser.newPage({ viewport: { width: 1360, height: 940 }, deviceScaleFactor: 2 })
await p.goto('http://localhost:4174/#/manager/properties', { waitUntil: 'load' })
await p.waitForTimeout(500)
await p.locator('.card-hover').first().click()
await p.waitForTimeout(600)
await p.screenshot({ path: `${OUT}/r-property-detail.png` })
await p.close()
console.log('shot r-property-detail')

await browser.close()
console.log('ERRORS:', errors.length ? '\n' + errors.join('\n') : 'none')
