
import { useEffect } from 'react'
import { useI18n } from '../i18n'

function useRevealOnScroll() {
  useEffect(() => {
    const reveal = () => { const els = document.querySelectorAll('[data-reveal]'); const vh = window.innerHeight; els.forEach(el=>{ const r = el.getBoundingClientRect(); if (r.top < vh - 60) el.classList.add('on') }) }
    document.addEventListener('scroll', reveal, { passive:true }); window.addEventListener('load', reveal); reveal();
    return () => { document.removeEventListener('scroll', reveal); window.removeEventListener('load', reveal) }
  }, [])
}

function ModelShowcase(){
  const { t } = useI18n()
  return (
    <section className="container model-hero" data-reveal>
      <div className="model-hero__wrap">
        <span className="badge">{t('model.badge')}</span>
        <h2 className="model-hero__title">{t('model.title')}</h2>
        <p className="model-hero__sub">{t('model.sub')}</p>
        <div className="model-hero__hints">
          <span className="chip">⚡ {t('model.hints.latency')}</span>
          <span className="chip">🛡️ {t('model.hints.privacy')}</span>
          <span className="chip">🖥️ {t('model.hints.local')}</span>
        </div>
        <div className="model-hero__cta">
          <a href="#demo" className="btn gold">{t('model.ctas.try')}</a>
          <a href="#docs" className="btn ghost">{t('model.ctas.docs')}</a>
          <a href="#samples" className="btn ghost">{t('model.ctas.bench')}</a>
        </div>
        <div className="model-hero__card">
          <div className="model-hero__code">
            <pre><code>{`POST /api/v1/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "Summarize forensic artifacts for case #A94D-11",
  "temperature": 0.2,
  "max_tokens": 256
}`}</code></pre>
          </div>
          <div className="model-hero__out">
            <strong>→ Output</strong>
            <p>• Correlated JWT timestamps with gateway logs.<br/>• Flagged anomalous IP cluster (ASN 4134).<br/>• Suggested custody chain update.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home(){
  const { t } = useI18n()
  useRevealOnScroll()
  return (
    <>
      <ModelShowcase />
      <header className="container hero" data-reveal>
        <span className="badge">{t('hero.badge')}</span>
        <h1>{t('hero.title')}</h1>
        <p className="sub">{t('hero.sub')}</p>
        <div className="cta">
          <a href="#open-case" className="btn gold">{t('hero.ctaOpen')}</a>
          <a href="#docs" className="btn ghost">{t('hero.ctaDocs')}</a>
          <span className="chip">Zero‑Trust · Audit‑Ready</span>
        </div>
      </header>

      <section className="container" style={{ marginBottom: 10 }}>
        <div className="grid">
          <div className="kpi" data-reveal>
            <div className="bar"></div>
            <div>
              <div className="num">8.4<span style={{fontSize:14}}>+ مليون</span></div>
              <small>{t('kpi.victims')}</small>
            </div>
          </div>
          <div className="kpi" data-reveal>
            <div className="bar" style={{background:'linear-gradient(180deg,#22c55e,#16a34a)'}}></div>
            <div>
              <div className="num">$600,000<span style={{fontSize:14}}>+</span></div>
              <small>{t('kpi.loss')}</small>
            </div>
          </div>
          <div className="kpi" data-reveal>
            <div className="bar" style={{background:'linear-gradient(180deg,#27e5d1,#06b6d4)'}}></div>
            <div>
              <div className="num">47</div>
              <small>{t('kpi.proofs')}</small>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="container" style={{ margin: '18px auto' }}>
        <div className="grid">
          <div className="card" style={{ gridColumn:'span 6' }} data-reveal>
            <h3>{t('services.dfir')}</h3>
            <p className="muted">{t('services.dfirDesc')}</p>
            <ul className="list" style={{margin:0, paddingInlineStart:18, color:'#cfd6dc'}}>
              <li>Acquisition/Imaging</li><li>Timeline/Artifact Parsing</li><li>Chain-of-Custody & Audit</li>
            </ul>
          </div>
          <div className="card" style={{ gridColumn:'span 6' }} data-reveal>
            <h3>{t('services.intel')}</h3>
            <p className="muted">{t('services.intelDesc')}</p>
            <ul className="list" style={{margin:0, paddingInlineStart:18, color:'#cfd6dc'}}>
              <li>IOC & TTP Mapping</li><li>Attribution Trails</li><li>Risk Scoring</li>
            </ul>
          </div>
          <div className="card" style={{ gridColumn:'span 6' }} data-reveal>
            <h3>{t('services.zt')}</h3>
            <p className="muted">{t('services.ztDesc')}</p>
            <ul className="list" style={{margin:0, paddingInlineStart:18, color:'#cfd6dc'}}>
              <li>JWT + Rotating Keys</li><li>Least‑Privilege Access</li><li>Real‑time Audit</li>
            </ul>
          </div>
          <div className="card" style={{ gridColumn:'span 6' }} data-reveal>
            <h3>{t('services.ev')}</h3>
            <p className="muted">{t('services.evDesc')}</p>
            <ul className="list" style={{margin:0, paddingInlineStart:18, color:'#cfd6dc'}}>
              <li>SHA‑256 / SHA‑1</li><li>Integrity Checks</li><li>Evidence Linking</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="evidence" className="container" style={{ margin: '18px auto' }}>
        <h3 style={{ margin:'0 0 8px' }}>{t('strip.title')}</h3>
        <div className="evidence" data-reveal>
          <div className="ev"><div className="meta"><span className="badge">P1</span> <span>{t('strip.jwt')}</span> <span style={{ marginInlineStart:'auto' }}>#A94D‑11</span></div><div className="muted">Gateway‑01</div></div>
          <div className="ev"><div className="meta"><span className="badge" style={{background:'var(--warn)'}}>P2</span> <span>{t('strip.req')}</span> <span style={{ marginInlineStart:'auto' }}>#E17C‑03</span></div><div className="muted">Evidence‑API</div></div>
          <div className="ev"><div className="meta"><span className="badge" style={{background:'var(--danger)'}}>P0</span> <span>{t('strip.login')}</span> <span style={{ marginInlineStart:'auto' }}>#D33B‑29</span></div><div className="muted">Auth‑Edge</div></div>
        </div>
      </section>

      <section className="container" style={{ margin:'18px auto' }}>
        <div className="card" data-reveal style={{ background:'linear-gradient(90deg, rgba(239,68,68,.10), rgba(245,158,11,.10))', border:'1px solid rgba(239,68,68,.35)', boxShadow:'0 0 0 1px rgba(245,158,11,.20) inset' }}>
          <h3 style={{ margin:'0 0 6px' }}>{t('hilo.title')}</h3>
          <p className="muted" style={{ margin:'0 0 8px' }}>{t('hilo.sub')}</p>
          <div className="row" style={{ flexWrap:'wrap', gap:8 }}>
            <span className="chip">8.4M+</span><span className="chip">$600k+</span><span className="chip">47 Proofs</span>
            <a href="#open-case" className="btn ghost">{t('hilo.follow')}</a>
          </div>
        </div>
      </section>

      <section id="open-case" className="container" style={{ margin:'18px auto' }}>
        <div className="card" data-reveal>
          <h3>{t('case.title')}</h3>
          <p className="muted">{t('case.hint')}</p>
          <form onSubmit={(e)=>{ e.preventDefault(); alert('POST /api/cases (TODO)') }} style={{display:'grid',gap:10,maxWidth:640}}>
            <label>{t('case.name')}<input required placeholder="مثال: احتيال مالي عبر تطبيق X" style={{width:'100%',padding:10,borderRadius:10,border:'1px solid var(--line)',background:'#0c1217',color:'var(--text)'}} /></label>
            <label>{t('case.pri')}<select style={{width:'100%',padding:10,borderRadius:10,border:'1px solid var(--line)',background:'#0c1217',color:'var(--text)'}}><option>P0 - حرِج</option><option>P1 - عالٍ</option><option>P2 - متوسط</option><option>P3 - منخفض</option></select></label>
            <label>{t('case.desc')}<textarea rows="4" placeholder="الوصف التقني، المؤشرات، الروابط…" style={{width:'100%',padding:10,borderRadius:10,border:'1px solid var(--line)',background:'#0c1217',color:'var(--text)'}} /></label>
            <div className="row" style={{ flexWrap:'wrap', gap:8 }}>
              <button className="btn gold" type="submit">{t('case.create')}</button>
              <button className="btn" type="button">{t('case.attach')}</button>
              <span className="chip">{t('case.hash')}</span>
            </div>
          </form>
        </div>
      </section>

      <footer id="contact" className="container footer">
        <span>{t('footer.legal')}</span><span style={{opacity:.4}}>|</span>
        <span className="dot" title="online"></span>
        <span>{t('footer.hint')}</span>
      </footer>
    </>
  )
}
