
import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../i18n'
import { useNotify } from '../notify'
import { pushHistory, recall, remember } from '../store/memory'
import FileAttach from '../components/FileAttach'
import VoiceControls from '../components/VoiceControls'
import ExportMenu from '../components/ExportMenu'
import ScreenRecorder from '../components/ScreenRecorder'
import AudioRecorder from '../components/AudioRecorder'
import { useAuth } from '../auth'

export default function Chat(){
  const { t } = useI18n()
  const { notify } = useNotify()
  const { user, can } = useAuth()
  const NS = 'chat:default'

  const [memoryOn, setMemoryOn] = useState(() => recall(NS, 'memoryOn', true))
  const [input, setInput] = useState('')
  const [files, setFiles] = useState([])
  const [messages, setMessages] = useState(() => recall(NS, 'history', []) )
  const [typing, setTyping] = useState(false)
  const lastReply = useMemo(()=>[...messages].reverse().find(m=>m.role==='assistant')?.text || '', [messages])

  useEffect(()=>{ remember(NS, 'memoryOn', memoryOn) }, [memoryOn])
  useEffect(()=>{ if(memoryOn) remember(NS, 'history', messages) }, [messages, memoryOn])

  const addFiles = (newFiles) => setFiles(prev => [...prev, ...Array.from(newFiles)].slice(0, 16))
  const removeFile = (name) => setFiles(prev => prev.filter(f=>f.name !== name))

  const send = async (text) => {
    const content = text || input
    if (!content && files.length===0) return
    const now = new Date().toLocaleTimeString()
    const userMsg = { id:crypto.randomUUID?.() || Math.random().toString(36).slice(2), role:'user', text:content, files: files.map(f=>({name:f.name, size:f.size, type:f.type})), time:now }
    setMessages(prev => [...prev, userMsg]); if(memoryOn) pushHistory(NS, userMsg)
    setInput(''); setFiles([]); setTyping(true)
    setTimeout(()=>{ const reply = { id:crypto.randomUUID?.() || Math.random().toString(36).slice(2), role:'assistant', text:`تم الاستلام: ${content || '(ملفات)'}`, time:new Date().toLocaleTimeString() }; setMessages(prev => [...prev, reply]); if(memoryOn) pushHistory(NS, reply); setTyping(false) }, 450)
  }

  const onTranscript = (text, isFinal) => { setInput(text); if (isFinal){ notify({ type:'info', title:'STT', message:text }) } }

  return (
    <div className="container chat-wrap">
      <div className="row" style={{ justifyContent:'space-between' }}>
        <div className="row" style={{ gap:10, flexWrap:'wrap' }}>
          <h2 style={{ margin:0 }}>💬 {t('chat.title')}</h2>
          <ExportMenu messages={messages} />
        </div>
        <div className="row" style={{ gap:8, flexWrap:'wrap' }}>
          <span className="chip">{t('chat.memory')}:</span>
          <button className="btn ghost" aria-pressed={memoryOn} onClick={()=>setMemoryOn(true)}>{t('chat.memoryOn')}</button>
          <button className="btn ghost" aria-pressed={!memoryOn} onClick={()=>setMemoryOn(false)}>{t('chat.memoryOff')}</button>
          <span className="chip">Role: {user?.role || 'anon'}</span>
          {can('console') && <button className="btn" onClick={()=>window.dispatchEvent(new Event('toggle-console'))}>🖥 {t('chat.console')}</button>}
        </div>
      </div>

      <div className="chat-stream">
        {messages.map(m=> (
          <div key={m.id} className={`msg ${m.role}`}>
            <div className="bubble">
              <div className="meta">{m.role==='user'?'👤':'🛡️'} · {m.time}</div>
              <div style={{ whiteSpace:'pre-wrap' }}>{m.text}</div>
              {!!m.files?.length && <div className="file-chips" style={{ marginTop:6 }}>{m.files.map((f,i)=> (<span className="file-chip" key={i}>📎 {f.name} <span className="muted">({Math.round(f.size/1024)}KB)</span></span>))}</div>}
            </div>
          </div>
        ))}
        {typing && <div className="msg assistant"><div className="bubble"><div className="meta">🛡️ · {t('chat.typing')}</div><span className="muted">…</span></div></div>}
      </div>

      <div className="chat-input">
        <FileAttach onFiles={addFiles} />
        {!!files.length && (
          <div className="file-chips">
            {files.map(f=> (
              <span key={f.name} className="file-chip">📎 {f.name} <span className="muted">({Math.round(f.size/1024)}KB)</span><button className="rm" onClick={()=>removeFile(f.name)} title={t('chat.remove')}>×</button></span>
            ))}
          </div>
        )}
        <div className="composer">
          <textarea placeholder={t('chat.hint')} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send() } }} />
          <div className="row" style={{ flexDirection:'column', gap:8 }}>
            <button className="btn gold" onClick={()=>send()}>{t('chat.send')}</button>
            <button className="btn" onClick={()=>setInput('')}>{t('chat.clear')}</button>
          </div>
        </div>
        <div className="toolbar">
          <VoiceControls onTranscript={onTranscript} lastReplyText={lastReply} />
        </div>
        <AudioRecorder onReadyFile={(file)=>addFiles([file])} />
        {can('chat.record') && <ScreenRecorder />}
      </div>
    </div>
  )
}
