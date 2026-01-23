
import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { useNotify } from '../notify'

export default function VoiceControls({ onTranscript, lastReplyText }){
  const { t, locale } = useI18n()
  const { notify } = useNotify()
  const [recording, setRecording] = useState(false)
  const [voiceName, setVoiceName] = useState('')
  const canvasRef = useRef()
  const mediaRef = useRef()
  const analyserRef = useRef()
  const rafRef = useRef()

  const vis = () => {
    const canvas = canvasRef.current
    if(!canvas || !analyserRef.current) return
    const ctx = canvas.getContext('2d')
    const analyser = analyserRef.current
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    const draw = () => {
      analyser.getByteTimeDomainData(dataArray)
      ctx.fillStyle = '#0c1217'; ctx.fillRect(0,0,canvas.width,canvas.height)
      ctx.lineWidth = 2; ctx.strokeStyle = '#27e5d1'; ctx.beginPath()
      const slice = canvas.width / dataArray.length
      let x=0
      for(let i=0;i<dataArray.length;i++){ const v = dataArray[i]/128.0; const y = v * canvas.height/2; if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); x += slice }
      ctx.lineTo(canvas.width, canvas.height/2); ctx.stroke()
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
  }

  const startMic = async () => {
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true })
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser(); analyser.fftSize = 2048
      source.connect(analyser)
      analyserRef.current = analyser
      mediaRef.current = { stream, audioCtx }
      setRecording(true)
      vis()
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SR){
        const rec = new SR(); rec.lang = (locale==='ar'?'ar-SA': locale==='fa'?'fa-IR': locale==='zh'?'zh-CN':'en-US'); rec.interimResults = true
        rec.onresult = (e)=>{ let finalText = ''; for (let i=e.resultIndex;i<e.results.length;i++){ finalText += e.results[i][0].transcript } onTranscript && onTranscript(finalText, e.results[e.results.length-1].isFinal) }
        rec.onerror = ()=>{}; rec.onend = ()=>{}; rec.start(); mediaRef.current.rec = rec
      }
    }catch(e){ notify({ type:'error', title:t('voice.errMic'), message:String(e?.message||e) }) }
  }

  const stopMic = () => { setRecording(false); cancelAnimationFrame(rafRef.current); if(mediaRef.current?.rec) { try{ mediaRef.current.rec.stop() } catch{} } mediaRef.current?.stream?.getTracks()?.forEach(tr=>tr.stop()); mediaRef.current?.audioCtx?.close?.(); mediaRef.current = {} }

  const playTTS = () => {
    try{ const synth = window.speechSynthesis; if(!synth) throw new Error('No Speech Synthesis'); const utter = new SpeechSynthesisUtterance(lastReplyText || ''); const voices = synth.getVoices(); const v = voices.find(v=>v.name===voiceName) || voices[0]; if (v) utter.voice = v; utter.rate = 1.02; synth.cancel(); synth.speak(utter) }
    catch(e){ /* Could switch to server TTS later */ notify({ type:'warning', title:t('voice.errTTS'), message:String(e?.message||e) }) }
  }

  useEffect(()=>{ const resize = () => { const c = canvasRef.current; if (!c) return; const rect = c.getBoundingClientRect(); c.width = rect.width * window.devicePixelRatio; c.height = rect.height * window.devicePixelRatio }; resize(); window.addEventListener('resize', resize); return ()=>window.removeEventListener('resize', resize) },[])

  const voices = (window.speechSynthesis?.getVoices?.() || [])
  return (
    <div className="card">
      <div className="row" style={{ justifyContent:'space-between' }}>
        <div className="row" style={{ gap:8, flexWrap:'wrap' }}>
          <strong>{t('voice.in')}</strong>
          {!recording ? <button className="btn icon" onClick={startMic}>🎙️ {t('voice.start')}</button> : <button className="btn icon" onClick={stopMic}>⏹ {t('voice.stop')}</button>}
        </div>
        <div className="row" style={{ gap:8, flexWrap:'wrap' }}>
          <strong>{t('voice.out')}</strong>
          <select value={voiceName} onChange={e=>setVoiceName(e.target.value)} style={{ padding:8, borderRadius:10, border:'1px solid var(--line)', background:'#0c1217', color:'var(--text)' }}>
            <option value="">{t('voice.none')}</option>
            {voices.map(v=><option key={v.name} value={v.name}>{v.name}</option>)}
          </select>
          <button className="btn icon" onClick={playTTS}>🔊 {t('voice.tts')}</button>
        </div>
      </div>
      <div className="wave" style={{ marginTop:8 }}><canvas ref={canvasRef} /></div>
    </div>
  )
}
