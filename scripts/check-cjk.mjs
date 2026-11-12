#!/usr/bin/env node
/*
 * Liệt kê chuỗi chữ Hán còn sót trong mã giao diện (bỏ qua comment và log console).
 * Dùng làm tiêu chí nghiệm thu việt hóa — xem PLAN.md §7.
 *
 *   node scripts/check-cjk.mjs              # in từng dòng, exit 1 nếu còn sót
 *   node scripts/check-cjk.mjs --summary    # chỉ in số dòng theo file
 *   node scripts/check-cjk.mjs src/views    # giới hạn thư mục
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const DEFAULT_TARGETS = ['src', 'packages', 'service/src', 'index.html']
const EXTENSIONS = ['.vue', '.ts', '.tsx', '.js', '.mjs', '.html']
const IGNORED_DIRS = new Set(['node_modules', 'dist', '.git'])
// Bản zh giữ nguyên từ upstream, không phải chuỗi cần dịch
const IGNORED_PATHS = ['src/languages/modules/zh']
const CJK = /[㐀-鿿豈-﫿　-〿＀-￯]/
const CONSOLE_CALL = /\bconsole\.(log|warn|error|info|debug)\s*\(/

const args = process.argv.slice(2)
const summaryOnly = args.includes('--summary')
const targets = args.filter((a) => !a.startsWith('--'))

function isIgnored(path) {
  const rel = relative(ROOT, path).split(sep).join('/')
  return IGNORED_PATHS.some((p) => rel === p || rel.startsWith(p + '/'))
}

function* walk(path) {
  if (isIgnored(path)) return
  const stat = statSync(path)
  if (stat.isFile()) {
    if (EXTENSIONS.some((ext) => path.endsWith(ext))) yield path
    return
  }
  for (const name of readdirSync(path)) {
    if (!IGNORED_DIRS.has(name)) yield* walk(join(path, name))
  }
}

/** Thay comment bằng khoảng trắng nhưng giữ nguyên xuống dòng để số dòng không lệch */
function stripComments(source) {
  const blank = (m) => m.replace(/[^\n]/g, ' ')
  return source
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:'"`\\])\/\/[^\n]*/g, (m, prefix) => prefix + blank(m.slice(prefix.length)))
}

const findings = new Map()
for (const target of targets.length ? targets : DEFAULT_TARGETS) {
  for (const file of walk(join(ROOT, target))) {
    const lines = stripComments(readFileSync(file, 'utf8')).split('\n')
    const original = readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, i) => {
      if (!CJK.test(line) || CONSOLE_CALL.test(line)) return
      const rel = relative(ROOT, file).split(sep).join('/')
      if (!findings.has(rel)) findings.set(rel, [])
      findings.get(rel).push({ line: i + 1, text: original[i].trim() })
    })
  }
}

let total = 0
const sorted = [...findings.entries()].sort((a, b) => b[1].length - a[1].length)
for (const [file, hits] of sorted) {
  total += hits.length
  if (summaryOnly) {
    console.log(`${String(hits.length).padStart(5)}  ${file}`)
  } else {
    for (const hit of hits) console.log(`${file}:${hit.line}: ${hit.text.slice(0, 160)}`)
  }
}
console.log(`\n${total} dòng chứa chữ Hán trong ${findings.size} file.`)
process.exit(total ? 1 : 0)
