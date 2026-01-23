
import { NavLink } from 'react-router-dom'
import Logo from './Logo'
import { useI18n } from '../i18n'
import { useState, useEffect } from 'react'
import { useAuth } from '../auth'

function ThemeSwitch(){
  const [mode, setMode] = useState(localStorage.getItem('theme') || 'auto')
  useEffect(() => { if (mode === 'auto'){ document.documentElement.removeAttribute('data-theme'); localStorage.removeItem('theme') } else { document.documentElement.setAttribute('data-theme', mode); localStorage.setItem('theme', mode) } }, [mode])
  return (
    <div className="row" style={{ gap:6 }}>
      <button className="btn ghost" aria-pressed={mode==='auto'} onClick={()=>setMode('auto')}>Auto</button>
      <button className="btn ghost" aria-pressed={mode==='dark'} onClick={()=>setMode('dark')}>Dark</button>
      <button className="btn ghost" aria-pressed={mode==='light'} onClick={()=>setMode('light')}>Light</button>
    </div>
  )
}

function LangSwitch(){
  const { locale, setLocale } = useI18n()
  return (
    <div className="row" style={{ gap:6 }}>
      {['ar','en','fr','tr','fa','es','zh'].map(lg=> (
        <button key={lg} className="btn ghost" aria-pressed={locale===lg} onClick={()=>setLocale(lg)}>{lg.toUpperCase()}</button>
      ))}
    </div>
  )
}

export default function NavBar(){
  const { t } = useI18n()
  const { can } = useAuth()
  return (
    <nav className="nav">
      <div className="container row" style={{ padding:'12px 0' }}>
        <div className="row" style={{ gap:12, fontWeight:800, letterSpacing:'.3px' }}>
          <Logo />
          <div>DRAGON403 <span className="chip">Sovereign DFIR</span></div>
        </div>
        <div className="spacer" />
        <NavLink to="/" className="btn ghost">{t('nav.home')}</NavLink>
        <NavLink to="/chat" className="btn ghost">Chat</NavLink>
        {can('users.view') && <NavLink to="/users" className="btn ghost">{t('nav.users')}</NavLink>}
        <NavLink to="/login" className="btn">{t('nav.login')}</NavLink>
        <NavLink to="/logout" className="btn ghost">{t('nav.logout')}</NavLink>
        <button className="btn ghost" onClick={()=>window.dispatchEvent(new Event('toggle-console'))}>🖥 Console</button>
        <ThemeSwitch />
        <LangSwitch />
        <a href="#open-case" className="btn gold">{t('nav.openCase')}</a>
      </div>
    </nav>
  )
}
