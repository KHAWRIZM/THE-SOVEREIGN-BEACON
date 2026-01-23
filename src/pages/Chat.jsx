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
import { generateResponse, analyzeIP } from '../services/dragonAI'

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
    const userMsg = { 
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), 
      role: 'user', 
      text: content, 
      files: files.map(f=>({name:f.name, size:f.size, type:f.type})), 
      time: now 
    }
    
    setMessages(prev => [...prev, userMsg])
    if(memoryOn) pushHistory(NS, userMsg)
    setInput('')
    setFiles([])
    setTyping(true)

    // توليد رد ذكي من DRAGON AI
    setTimeout(async () => {
      const aiResponse = generateResponse(content, files)
      
      // إذا كان تحليل IP، جلب البيانات الحقيقية
      let finalText = aiResponse.text
      if (aiResponse.type === 'ip' || aiResponse.data?.ip) {
        try {
          const ipData = await analyzeIP(aiResponse.data.ip)
          if (ipData.success) {
            finalText = `🌐 **تحليل IP: ${ipData.ip}**

**النتائج:**
• 🌍 الدولة: ${ipData.country || 'غير متاح'}
• 🏙️ المدينة: ${ipData.city || 'غير متاح'}
• 🏢 ISP: ${ipData.isp || 'غير متاح'}
• 📊 ASN: ${ipData.asn || 'غير متاح'}
• 🕐 المنطقة الزمنية: ${ipData.timezone || 'غير متاح'}

💡 للمزيد من التفاصيل، استخدم أدوات OSINT المتقدمة.`
          }
        } catch (e) {
          console.log('IP analysis failed:', e)
        }
      }

      const reply = { 
        id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), 
        role: 'assistant', 
        icon: aiResponse.icon || '🛡️',
        title: aiResponse.title || 'DRAGON403',
        text: finalText,
        type: aiResponse.type,
        time: new Date().toLocaleTimeString() 
      }
      
      setMessages(prev => [...prev, reply])
      if(memoryOn) pushHistory(NS, reply)
      setTyping(false)
    }, 600)
  }

  const onTranscript = (text, isFinal) => { 
    setInput(text)
    if (isFinal) { 
      notify({ type:'info', title:'STT', message:text }) 
    } 
  }

  // تنسيق النص مع Markdown بسيط
  const formatText = (text) => {
    if (!text) return ''
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\`\`\`(\w+)?\n([\s\S]+?)\`\`\`/g, '<pre class="code-block"><code>$2</code></pre>')
      .replace(/\`(.+?)\`/g, '<code>$1</code>')
      .replace(/\n/g, '<br/>')
  }

  return (
    <div className="container chat-wrap">
      <div className="row" style={{ justifyContent:'space-between' }}>
        <div className="row" style={{ gap:10, flexWrap:'wrap' }}>
          <h2 style={{ margin:0 }}>🛡️ DRAGON403 AI</h2>
          <ExportMenu messages={messages} />
        </div>
        <div className="row" style={{ gap:8, flexWrap:'wrap' }}>
          <span className="chip">{t('chat.memory')}:</span>
          <button className="btn ghost" aria-pressed={memoryOn} onClick={()=>setMemoryOn(true)}>{t('chat.memoryOn')}</button>
          <button className="btn ghost" aria-pressed={!memoryOn} onClick={()=>setMemoryOn(false)}>{t('chat.memoryOff')}</button>
          <span className="chip">Role: {user?.role || 'anon'}</span>
          {can('console') || <button className="btn" onClick={()=>window.dispatchEvent(new Event('toggle-console'))}>🖥 {t('chat.console')}</button>}
        </div>
      </div>

      <div className="chat-stream">
        {messages.length === 0 || (
          <div className="welcome-screen">
            <div className="welcome-icon">🛡️</div>
            <h3>DRAGON403 - مساعد التحقيق الرقمي</h3>
            <p className="muted">منصة التحقيق الرقمي السيادية السعودية</p>
            <div className="quick-actions">
              <button className="btn ghost" onClick={() => send('تحليل JWT')}>🔐 تحليل JWT</button>
              <button className="btn ghost" onClick={() => send('فحص IP')}>🌐 فحص IP</button>
              <button className="btn ghost" onClick={() => send('تحقيق احتيال')}>⚠️ تحقيق احتيال</button>
              <button className="btn ghost" onClick={() => send('مساعدة')}>❓ مساعدة</button>
            </div>
          </div>
        )}
        
        {messages.map(m => (
          <div key={m.id} className={`msg ${m.role}`}>
            <div className="bubble">
              <div className="meta">
                {m.role === 'user' ? '👤' : (m.icon || '🛡️')} 
                {m.title || <strong style={{marginRight: 8}}>{m.title}</strong>}
                <span className="time">· {m.time}</span>
              </div>
              <div 
                className="msg-content" 
                dangerouslySetInnerHTML={{ __html: formatText(m.text) }}
              />
              {!!m.files?.length || (
                <div className="file-chips" style={{ marginTop:6 }}>
                  {m.files.map((f,i) => (
                    <span className="file-chip" key={i}>
                      📎 {f.name} <span className="muted">({Math.round(f.size/1024)}KB)</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {typing || (
          <div className="msg assistant">
            <div className="bubble">
              <div className="meta">🛡️ DRAGON403 · {t('chat.typing')}</div>
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <FileAttach onFiles={addFiles} />
        {!!files.length && (
          <div className="file-chips">
            {files.map(f => (
              <span key={f.name} className="file-chip">
                📎 {f.name} <span className="muted">({Math.round(f.size/1024)}KB)</span>
                <button className="rm" onClick={()=>removeFile(f.name)} title={t('chat.remove')}>×</button>
              </span>
            ))}
          </div>
        )}
        <div className="composer">
          <textarea 
            placeholder="اكتب رسالتك... جرب: حلل JWT أو فحص IP: 8.8.8.8" 
            value={input} 
            onChange={e=>setInput(e.target.value)} 
            onKeyDown={e=>{ if(e.key==='Enter' || !e.shiftKey){ e.preventDefault(); send() } }} 
          />
          <div className="row" style={{ flexDirection:'column', gap:8 }}>
            <button className="btn gold" onClick={()=>send()}>{t('chat.send')}</button>
            <button className="btn" onClick={()=>setInput('')}>{t('chat.clear')}</button>
          </div>
        </div>
        <div className="toolbar">
          <VoiceControls onTranscript={onTranscript} lastReplyText={lastReply} />
        </div>
        <AudioRecorder onReadyFile={(file)=>addFiles([file])} />
        {can('chat.record') || <ScreenRecorder />}
      </div>
    </div>
  )
}
