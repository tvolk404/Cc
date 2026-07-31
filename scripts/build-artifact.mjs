import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dist = 'dist/assets'
const files = readdirSync(dist)
const js = files.find((f) => f.endsWith('.js'))
const css = files.find((f) => f.endsWith('.css'))

const jsCode = readFileSync(join(dist, js), 'utf8')
const cssCode = readFileSync(join(dist, css), 'utf8')

const page = `<div id="root"></div>
<style>
${cssCode}
</style>
<script type="module">
${jsCode}
</script>
`

writeFileSync('turnkey-app.html', page)
console.log(`Wrote turnkey-app.html (${(page.length / 1024).toFixed(0)} kB)`)
