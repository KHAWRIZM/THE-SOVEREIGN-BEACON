
import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { useNotify } from '../notify'
import { useAuth } from '../auth'

export default function ScreenRecorder(){
  const { t } = useI18n()
  const { notify } = useNotify()
  const { can } = useAuth()
  const [rec, setRec] = useState(null)
  const [chunks, setChunks] = useState([])
  const [url, setUrl] = useState('')
  const videoRef = useRef()
  useEffect(()=>()=>{ if(url) URL.revokeObjectURL(url) }, [url])

  const start = async () => {
    if(!can('chat.record')) return notify({ type:'warning', title:t('perm.denied'), message:t('perm.needAnalyst') })
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' })
      const _chunks = []
      recorder.ondataavailable = (e)=>{ if(e.data && e.data.size>0) _chunks.push(e.data) }
      recorder.onstop = ()=>{
        const blob = new Blob(_chunks, { type: 'video/webm' })
        const u = URL.createObjectURL(blob)
        setUrl(u); setChunks(_chunks)
        notify({ type:'success', title:t('rec.ready'), message: `${(blob.size/1024/1024).toFixed(2)} MB` })
        stream.getTracks().forEach(tr=>tr.stop())
      }
      recorder.start()
      setRec(recorder)
      notify({ type:'info', title:t('rec.start'), message:t('rec.running') })
    } catch (e) {
      notify({ type:'error', title:t('rec.fail'), message:String(e?.message||e) })
    }
  }
  const stop = () => { try{ rec?.stop() }catch{} setRec(null) }
  const download = () => { if (!url) return; const a = document.createElement('a'); a.href = url; a.download = `screen-${Date.now()}.webm`; a.click() }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent:'space-between' }}>
        <div className="row" style={{ gap:8 }}><strong>🖥️ {t('rec.title')||'Screen Recorder'}</strong><span className="chip">WebM</span></div>
        <div className="row" style={{ gap:8, flexWrap:'wrap' }}>
          {!rec ? <button className="btn icon" onClick={start}>⏺ {t('rec.btnStart')||'Start'}</button> : <button className="btn icon" onClick={stop}>⏹ {t('rec.btnStop')||'Stop'}</button>}
          <button className="btn" onClick={download} disabled={!url}>⬇ {t('rec.btnSave')||'Save'}</button>
        </div>
      </div>
      <div style={{ marginTop:8 }}>{url ? <video ref={videoRef} src={url} controls style={{ width:'100%', borderRadius:12, border:'1px solid var(--line)' }} /> : <div className="dropzone">{t('rec.hint')||'Start and share a window/tab'}</div>}</div>
    </div>
  )
}
