/*
 * Kiểm tra khóa i18n: mọi khóa được gọi trong mã đều tồn tại ở cả vi và en, và vi/en có cùng bộ khóa.
 *   cd service && npx ts-node ../scripts/check-i18n-keys.ts   (cần chạy từ thư mục gốc repo để quét src)
 */
import fs from 'fs'
import path from 'path'
import vi from '../src/languages/modules/vi'
import en from '../src/languages/modules/en'

const flatten = (o: any, p = ''): string[] => Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' && v ? flatten(v, p + k + '.') : [p + k]))
const viKeys = new Set(flatten(vi))
const enKeys = new Set(flatten(en))
const used = new Map<string, string>()
const walk = (d: string) => {
  for (const n of fs.readdirSync(d)) {
    const f = path.join(d, n)
    if (fs.statSync(f).isDirectory()) { if (n !== 'languages' && n !== 'node_modules') walk(f); continue }
    if (!/\.(vue|ts)$/.test(n)) continue
    const s = fs.readFileSync(f, 'utf8')
    for (const m of s.matchAll(/(?<![\w.])(?:\$t|t|i18n\.global\.t)\(\s*['"`]([\w.]+)['"`]/g)) used.set(m[1], f)
  }
}
walk(path.resolve(__dirname, '../src'))
let bad = 0
used.forEach((f, k) => { if (!viKeys.has(k) || !enKeys.has(k)) { console.log('MISSING', k, 'in', path.relative(process.cwd(), f), viKeys.has(k) ? '(en)' : '(vi)'); bad++ } })
viKeys.forEach((k) => { if (!enKeys.has(k)) { console.log('vi-only', k); bad++ } })
enKeys.forEach((k) => { if (!viKeys.has(k)) { console.log('en-only', k); bad++ } })
console.log(`vi=${viKeys.size} en=${enKeys.size} used=${used.size} problems=${bad}`)
process.exit(bad ? 1 : 0)
