
import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { useNotify } from '../notify'
import Logo from '../components/Logo'

export default function Logout(){
  const { t } = useI18n()
  const { notify } = useNotify()
  const nav = useNavigate()

  useEffect(()=>{ localStorage.removeItem('token'); sessionStorage.clear(); notify({ type:'info', title:t('notify.signedOutTitle'), message:t('notify.signedOutMsg'), timeout: 3000 }); const timer = setTimeout(()=> nav('/login'), 900); return () => clearTimeout(timer) }, [])

  return (
    <div className="container" style={{ minHeight:'70vh', display:'grid', placeItems:'center' }}>
      <div className="card" style={{ maxWidth: 420, width:'100%', textAlign:'center' }}>
        <div className="row" style={{ justifyContent:'center', gap:10, marginBottom:10 }}>
          <Logo spin={false} />
          <h3 style={{ margin: 0 }}>{t('logout.title')}</h3>
        </div>
        <p className="muted">{t('logout.sub')}</p>
        <div className="row" style={{ justifyContent:'center', gap:8 }}>
          <Link to="/login" className="btn gold">{t('login.submit')}</Link>
          <Link to="/" className="btn ghost">{t('login.back')}</Link>
        </div>
      </div>
    </div>
  )
}
