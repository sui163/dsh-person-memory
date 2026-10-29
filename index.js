// dsh-person-memory 正式版 - 昔涟个人记忆插件
// 提供: 读取记忆库 / 五层记录 / 调用 auto-record 脚本落盘
import { readFile, readdir, mkdir, appendFile, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { execFile } from 'node:child_process'

const MEMORY_DIR = process.env.DSH_PERSON_MEMORY_DIR || 'E:/harness/memory'
const SCRIPT = join(import.meta.dirname, '..', 'scripts', 'auto-record.ps1')

// 追加一条记录到指定层(直接用脚本,保证可靠落盘)
async function record(type, content, date) {
  return new Promise((resolve) => {
    const d = date || new Date().toISOString().slice(0,10)
    execFile('powershell', ['-NoProfile','-ExecutionPolicy','Bypass','-File', SCRIPT, '-Type', type, '-Content', content, '-Date', d],
      { encoding:'utf8', windowsHide:true }, (err,out) => resolve({ ok:!err, out })
    )
  })
}

// 读某天的记忆(返回各层内容)
async function readDay(date) {
  const d = date || new Date().toISOString().slice(0,10)
  const out = {}
  for (const layer of ['diary','events','reflections','errors','important']) {
    try { out[layer] = await readFile(join(MEMORY_DIR, layer, d+'.md'), 'utf8') } catch { out[layer] = null }
  }
  return out
}

// 列出现有记忆天数
async function listDays() {
  const diaryDir = join(MEMORY_DIR,'events')
  try { return (await readdir(diaryDir)).filter(f=>/^\d{4}-\d{2}-\d{2}\.md$/.test(f)).sort() } catch { return [] }
}

// 插件入口: DSH 调用
export function apply(ctx, config) {
  ctx.on('data', async (msg) => {
    // 仅处理命令形如 person:record / person:read / person:list
    if (typeof msg !== 'string') return
    const m = msg.match(/^person:(record|read|list)\s*(.*)$/s)
    if (!m) return
    const [, cmd, arg] = m
    if (cmd === 'record') {
      // 格式: person:record <layer>|<内容>
      const [layer, ...rest] = arg.split('|')
      if (['diary','events','reflections','errors','important'].includes(layer) && rest.length) {
        await record(layer, rest.join('|'))
      }
    } else if (cmd === 'read') {
      const d = arg.trim() || new Date().toISOString().slice(0,10)
      const data = await readDay(d)
      ctx.logger?.info?.(`person-memory: ${JSON.stringify(Object.fromEntries(Object.entries(data).filter(([,v])=>v)))}}`)
    } else if (cmd === 'list') {
      ctx.logger?.info?.(`person-memory days: ${(await listDays()).join(', ')}`)
    }
  })
}