
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
      const head = m.role==='user' ? '\u{1F464}' : '\u{1F6E1}\uFE0F'
      lines.push(`**${head} [${m.time||''}]**`)
      if (m.text) lines.push(m.text.replace(/\r?\n/g, '  \n'))
      if (m.files?.length){ lines.push('**Files:**'); m.files.forEach(f=>lines.push(`- ${f.name} (${Math.round(f.size/1024)}KB)`)) }
      lines.push('')
    })
    return lines.join('\n')
  }
  
  const toTXT = () => {
    const lines = ['DRAGON403 Chat Export','----------------------','']
    messages.forEach(m=>{
      lines.push(`${m.role.toUpperCase()} [${m.time||''}]:`)
      if (m.text) lines.push(m.text)
      if (m.files?.length){ lines.push('Files:'); m.files.forEach(f=>lines.push(`- ${f.name} (${Math.round(f.size/1024)}KB)`)) }
      lines.push('')
    })
    return lines.join('\n')
  }

  const doExport = (type) => {
    const ts = new Date().toISOString().slice(0,10)
    if (type==='json') dl(`dragon403-chat-${ts}.json`, toJSON(), 'application/json')
    if (type==='md')   dl(`dragon403-chat-${ts}.md`, toMD(), 'text/markdown')
    if (type==='txt')  dl(`dragon403-chat-${ts}.txt`, toTXT())
    notify(t('export.success'))
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button onClick={()=>setOpen(!open)} title={t('export.title')}>📤</button>
      {open && (
        <div style={{ position:'absolute', bottom:'100%', right:0, background:'#1e1e2e', border:'1px solid #313244', borderRadius:8, padding:8, minWidth:120 }}>
          <div style={{cursor:'pointer',padding:'4px 8px'}} onClick={()=>doExport('json')}>JSON</div>
          <div style={{cursor:'pointer',padding:'4px 8px'}} onClick={()=>doExport('md')}>Markdown</div>
          <div style={{cursor:'pointer',padding:'4px 8px'}} onClick={()=>doExport('txt')}>Text</div>
        </div>
      )}
    </div>
  )
}
