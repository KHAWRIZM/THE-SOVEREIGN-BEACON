
import { useRef, useState } from 'react'
import { useNotify } from '../notify'
import { useI18n } from '../i18n'

const MAX = 1024 * 1024 * 50

export default function FileAttach({ onFiles }){
  const { notify } = useNotify()
  const { t } = useI18n()
  const [drag, setDrag] = useState(false)
  const inputRef = useRef()
  const handleFiles = (files) => { const ok = []; for (const f of files){ if (f.size > MAX) { notify({ type:'warning', title:t('files.tooBig'), message:`${t('files.max')}: 50MB · ${f.name}` }); continue } ok.push(f) } if (ok.length){ onFiles(ok); notify({ type:'success', title:t('files.uploaded'), message: ok.map(f=>f.name).join(', ') }) } }
  const onDrop = (e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files) }
  return (<>
    <div className={`dropzone ${drag?'drag':''}`} onDragOver={(e)=>{e.preventDefault(); setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={onDrop} onClick={()=>inputRef.current?.click()} role="button" aria-label={t('chat.drop')}>
      {t('chat.drop')} — {t('chat.or')} <strong style={{marginInline:'6px'}}>{t('chat.attach')}</strong> ({t('chat.accept')})
    </div>
    <input ref={inputRef} type="file" multiple accept="*/*" hidden onChange={(e)=>handleFiles(e.target.files)} />
  </>)
}
