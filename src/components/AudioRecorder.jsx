
import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { useNotify } from '../notify'

export default function AudioRecorder({ onReadyFile }){
  const { t } = useI18n()
  const { notify } = useNotify()
  const [rec, setRec] = useState(null)
  const [chunks, setChunks] = useState([])
  const [url, setUrl] = useState('')
  const [mime, setMime] = useState('audio/webm')
  const audioRef = useRef()
  useEffect(()=>()=>{ if(url) URL.revokeObjectURL(url) }, [url])
  const pickMime = () => { const options = ['audio/webm;codecs=opus','audio/webm','audio/ogg;codecs=opus','audio/ogg']; for (const opt of options) { if (MediaRecorder.isTypeSupported(opt)) return opt } return 'audio/webm' }
  const start = async () => {
    try { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); const type = pickMime(); setMime(type); const recorder = new MediaRecorder(stream, { mimeType: type }); const _chunks = []; recorder.ondataavailable = (e)=>{ if(e.data && e.data.size>0) _chunks.push(e.data) }; recorder.onstop = ()=>{ const blob = new Blob(_chunks, { type }); const u = URL.createObjectURL(blob); setUrl(u); setChunks(_chunks); const mb = (blob.size/1024/1024).toFixed(2); notify({ type:'success', title:t('recAudio.ready') || 'Audio ready', message:`${mb} MB` }); stream.getTracks().forEach(tr=>tr.stop()) }; recorder.start(); setRec(recorder); notify({ type:'info', title:t('recAudio.start') || 'Recording', message:t('recAudio.running') || 'Recording…' }) } catch (e) { notify({ type:'error', title:t('recAudio.fail') || 'Mic failed', message:String(e?.message||e) }) }
  }
  const stop = () => { try{ rec?.stop() }catch{} setRec(null) }
  const download = () => { if (!url) return; const a = document.createElement('a'); a.href = url; a.download = `audio-${Date.now()}.${mime.includes('ogg')?'ogg':'webm'}`; a.click() }
  const attach = async () => { if (!chunks.length) return; const blob = new Blob(chunks, { type: mime }); const file = new File([blob], `audio-${Date.now()}.${mime.includes('ogg')?'ogg':'webm'}`, { type: mime }); onReadyFile && onReadyFile(file) }
  return (
    <div className="card">
      <div className="row" style={{ justifyContent:'space-between' }}>
        <div className="row" style={{ gap:8 }}><strong>🎙️ {t('recAudio.title') || 'Audio Recorder'}</strong><span className="chip">{mime}</span></div>
        <div className="row" style={{ gap:8, flexWrap:'wrap' }}>
          {!rec ? <button className="btn icon" onClick={start}>⏺ {t('recAudio.btnStart') || 'Start'}</button> : <button className="btn icon" onClick={stop}>⏹ {t('recAudio.btnStop') || 'Stop'}</button>}
          <button className="btn" onClick={download} disabled={!url}>⬇ {t('recAudio.btnSave') || 'Save'}</button>
          <button className="btn gold" onClick={attach} disabled={!chunks.length}>📎 {t('recAudio.btnAttach') || 'Attach'}</button>
        </div>
      </div>
      <div style={{ marginTop:8 }}>{url ? <audio ref={audioRef} src={url} controls style={{ width:'100%' }} /> : <div className="dropzone">{t('recAudio.hint') || 'Start recording to capture microphone audio'}</div>}</div>
    </div>
  )
}
