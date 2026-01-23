
import { useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { useNotify } from '../notify'

function dl(filename, text, mime='text/plain') {
  const blob = new Blob([text], { type: mime + ';charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  setTimeout(()=> URL.revokeObjectURL(url), 500)
}

export default function ExportMenu({ messages=[] }) {
  const { t } = useI18n()
  const { notify } = useNotify()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const toJSON = () => JSON.stringify({ exportedAt: new Date().toISOString(), messages }, null, 2)
  const toMD = () => {
    const lines = ['# DRAGON403 Chat Export','']
    messages.forEach(m=>{
      const head = m.role==='user' ? '👤' : '🛡️'
      lines.push(`**${head} [${m.time||''}]**`)
      if (m.text) lines.push(m.text.replace(/?
/g, '  
'))
      if (m.files?.length){ lines.push('**Files:**'); m.files.forEach(f=>lines.push(`- ${f.name} (${Math.round(f.size/1024)}KB)`)) }
      lines.push('')
    })
    return lines.join('
')
  }
  const toTXT = () => {
    const lines = ['DRAGON403 Chat Export','----------------------','']
    messages.forEach(m=>{
      lines.push(`${m.role.toUpperCase()} [${m.time||''}]:`)
      if (m.text) lines.push(m.text)
      if (m.files?.length){ lines.push('Files:'); m.files.forEach(f=>lines.push(`- ${f.name} (${Math.round(f.size/1024)}KB)`)) }
      lines.push('')
    })
    return lines.join('
')
  }

  const toPDF = () => {
    const w = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700')
    if (!w) return notify({ type:'warning', title:'Popup', message:'Allow popups to export PDF' })
    const dir = document.documentElement.getAttribute('dir') || 'rtl'
    const lang = document.documentElement.getAttribute('lang') || 'ar'
    const html = `<!doctype html><html lang="${lang}" dir="${dir}"><head><meta charset="utf-8"/><title>DRAGON403 · Chat Export</title><meta name="color-scheme" content="dark light"/><style>:root{--bg:#0b0f12;--panel:#11171c;--line:#1d2731;--text:#e7eaee;--muted:#a9b1b8;--gold:#d4af37;}body{margin:0;background:var(--bg);color:var(--text);font:14px/1.6 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Noto Sans,Arial;padding:16px}h1{margin:0 0 8px;font-size:18px;font-weight:900;background:linear-gradient(90deg,#fff,#f3f4f6 40%,var(--gold) 80%);-webkit-background-clip:text;background-clip:text;color:transparent}.wrap{background:linear-gradient(180deg,var(--panel),#0f151a);border:1px solid var(--line);border-radius:12px;padding:12px}.meta{color:var(--muted);font-size:12px}.msg{border:1px solid var(--line);border-radius:10px;padding:10px;margin:8px 0;background:#0c1217}.sys{color:var(--muted);font-style:italic}.files{margin:6px 0 0 0;padding:0 16px}@media print{body{background:#fff;color:#000}.wrap{background:#fff;border-color:#ddd}.msg{background:#fff}}</style></head><body><h1>DRAGON403 · Chat Export (PDF)</h1><div class="wrap">${messages.map(m=>`<div class="msg"><div class="meta">${m.role==='user'?'👤':'🛡️'} · ${m.time||''}</div><div>${(m.text||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/
/g,'<br/>')}</div>${m.files?.length?`<ul class="files">${m.files.map(f=>`<li>${f.name} (${Math.round(f.size/1024)}KB)</li>`).join('')}</ul>`:''}</div>`).join('')}<div class="sys meta">© 2026 DRAGON403 · Exported at ${new Date().toLocaleString()}</div></div><script>window.onload=()=>setTimeout(()=>window.print(),50)</script></body></html>`
    w.document.open(); w.document.write(html); w.document.close()
  }

  const copyClip = async () => { try { await navigator.clipboard.writeText(toMD()); notify({ type:'success', title:'Copied', message:'Markdown copied' }) } catch { notify({ type:'warning', title:'Clipboard', message:'Permission denied' }) } }

  return (
    <div style={{ position:'relative' }} ref={ref}>
      <button className="btn ghost" onClick={()=>setOpen(v=>!v)}>📤 {t('export.title')||'Export'}</button>
      {open && (
        <div style={{ position:'absolute', insetInlineEnd:0, zIndex:10, marginTop:6, background:'linear-gradient(180deg,var(--panel),#0f151a)', border:'1px solid var(--line)', borderRadius:12, padding:8, minWidth:220 }}>
          <button className="btn icon" style={{ width:'100%' }} onClick={()=>dl('chat.json', toJSON(), 'application/json')}>🧩 JSON</button>
          <button className="btn icon" style={{ width:'100%' }} onClick={()=>dl('chat.md', toMD(), 'text/markdown')}>📝 Markdown</button>
          <button className="btn icon" style={{ width:'100%' }} onClick={()=>dl('chat.txt', toTXT(), 'text/plain')}>📄 TXT</button>
          <button className="btn icon" style={{ width:'100%' }} onClick={copyClip}>📋 {t('export.copy')||'Copy MD'}</button>
          <button className="btn icon" style={{ width:'100%' }} onClick={toPDF}>🖨️ {t('export.pdf')||'PDF'}</button>
        </div>
      )}
    </div>
  )
}
