
import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'

export default function HiddenConsole(){
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState([{ type:'sys', text: t('console.help') }])
  const [cmd, setCmd] = useState('')
  const inputRef = useRef()
  useEffect(()=>{ const onKey = (e) => { if (e.ctrlKey && e.key === '`'){ e.preventDefault(); setOpen(v=>!v); setTimeout(()=>inputRef.current?.focus(), 50) } }; const toggle = () => setOpen(v=>!v); window.addEventListener('keydown', onKey); window.addEventListener('toggle-console', toggle); return () =>{ window.removeEventListener('keydown', onKey); window.removeEventListener('toggle-console', toggle) } },[])
  const exec = (raw) => { const s = raw.trim(); if(!s) return; setLines(prev => [...prev, { type:'in', text:s }]); if (s === '/help') setLines(prev => [...prev, { type:'out', text:t('console.help') }]); else if (s === '/clear') setLines([{ type:'sys', text:t('console.help') }]); else if (s === '/whoami') setLines(prev => [...prev, { type:'out', text:t('console.who') }]); else setLines(prev => [...prev, { type:'out', text:'$ ' + s + '\nOK' }]) }
  return (
    <div className={`console-wrap ${open?'on':''}`} aria-hidden={!open}>
      <div className="console-head">
        <div className="row" style={{ gap:8 }}><strong>🖥 {t('console.title')}</strong><span className="chip">Ctrl+`</span></div>
        <div className="row" style={{ gap:8 }}>
          <button className="btn ghost" onClick={()=>setLines([{ type:'sys', text:t('console.help') }])}>{t('chat.clear')}</button>
          <button className="btn" onClick={()=>setOpen(false)}>×</button>
        </div>
      </div>
      <div className="console-body">
        {lines.map((l,i)=> (
          <div key={i} className="console-line"><span className="console-prompt">{l.type==='in'?'$': l.type==='out'?'>':'*'}</span><pre style={{margin:0, whiteSpace:'pre-wrap'}}>{l.text}</pre></div>
        ))}
      </div>
      <div style={{ padding:10 }}>
        <input ref={inputRef} className="console-input" placeholder="/help  /clear  /whoami" value={cmd} onChange={e=>setCmd(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){ exec(cmd); setCmd('') } }} />
      </div>
    </div>
  )
}
