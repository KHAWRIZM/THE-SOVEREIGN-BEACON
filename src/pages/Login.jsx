
import { Link, useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'
import { useNotify } from '../notify'
import Logo from '../components/Logo'
import { useAuth } from '../auth'

export default function Login(){
  const { t } = useI18n()
  const { notify } = useNotify()
  const { login } = useAuth()
  const nav = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = { email: form.get('email')?.trim(), password: form.get('password'), remember: form.get('remember') === 'on', role: form.get('role') || 'analyst' }
    if (!payload.email || !payload.password) return notify({ type:'warning', title:t('notify.caseFailedTitle'), message:'Missing credentials' })
    login(payload.email, payload.role)
    notify({ type:'success', title:t('notify.signedInTitle'), message:t('notify.signedInMsg') })
    nav('/')
  }

  return (
    <div className="container" style={{ display:'grid', placeItems:'center', minHeight:'80vh' }}>
      <div className="card" style={{ width:'100%', maxWidth:480 }}>
        <div className="row" style={{ gap:10, marginBottom:10 }}>
          <Logo spin={false} />
          <h3 style={{ margin:0 }}>{t('login.title')}</h3>
        </div>
        <form onSubmit={onSubmit} style={{ display:'grid', gap:10 }}>
          <label>{t('login.email')}<input name="email" type="email" autoComplete="username" required placeholder="you@example.com" style={{ width:'100%', padding:10, borderRadius:10, border:'1px solid var(--line)', background:'#0c1217', color:'var(--text)' }}/></label>
          <label>{t('login.password')}<input name="password" type="password" autoComplete="current-password" required placeholder="••••••••" style={{ width:'100%', padding:10, borderRadius:10, border:'1px solid var(--line)', background:'#0c1217', color:'var(--text)' }}/></label>
          <label className="row" style={{ justifyContent:'space-between' }}>
            <span className="row" style={{ gap:8 }}><input name="remember" type="checkbox" /> {t('login.remember')}</span>
            <a href="#forgot" className="btn ghost">{t('login.forgot')}</a>
          </label>
          <label>Role<select name="role" defaultValue="analyst" style={{ width:'100%', padding:10, borderRadius:10, border:'1px solid var(--line)', background:'#0c1217', color:'var(--text)' }}><option value="admin">Admin</option><option value="analyst">Analyst</option><option value="viewer">Viewer</option></select></label>
          <button className="btn gold" type="submit">{t('login.submit')}</button>
        </form>
        <div className="row" style={{ justifyContent:'center', marginTop:10, gap:8 }}>
          <span className="chip">{t('login.or')}</span>
          <Link to="/" className="btn ghost">{t('login.back')}</Link>
        </div>
      </div>
    </div>
  )
}
