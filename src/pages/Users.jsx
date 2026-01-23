
import { useMemo, useState } from 'react'
import { useI18n } from '../i18n'
import { useNotify } from '../notify'

const SEED = [
  { id:'U-1001', name:'Admin User', email:'admin@example.com', role:'admin',   status:'active'  },
  { id:'U-1002', name:'Noura',               email:'noura@example.com',    role:'analyst', status:'active'  },
  { id:'U-1003', name:'Fahad',               email:'fahad@example.com',    role:'viewer',  status:'pending' },
  { id:'U-1004', name:'Leila',               email:'leila@example.com',    role:'analyst', status:'blocked' },
  { id:'U-1005', name:'Omar',                email:'omar@example.com',     role:'viewer',  status:'active'  },
  { id:'U-1006', name:'Zahra',               email:'zahra@example.com',    role:'analyst', status:'active'  },
]

export default function Users(){
  const { t } = useI18n()
  const { notify } = useNotify()
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 5

  const filtered = useMemo(()=> SEED.filter(u => {
    const q = query.trim().toLowerCase()
    const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q)
    const matchR = (role === 'all') || (u.role === role)
    const matchS = (status === 'all') || (u.status === status)
    return matchQ && matchR && matchS
  }), [query, role, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page-1)*pageSize, page*pageSize)

  const act = (type, u) => {
    // TODO bind to API
    notify({ title: t('notify.userUpdatedTitle'), message: t('notify.userUpdatedMsg'), type: 'success' })
    if (type === 'enable') u.status = 'active'
    if (type === 'disable') u.status = 'blocked'
    if (type === 'promote') u.role = 'admin'
    if (type === 'demote') u.role = 'analyst'
  }

  return (
    <div className="container" style={{ padding: '18px 0' }}>
      <div className="row" style={{ gap:12, margin:'0 0 12px' }}><h2 style={{ margin:0 }}>{t('users.title')}</h2></div>
      <div className="card" style={{ marginBottom:12 }}>
        <div className="row" style={{ gap:8, flexWrap:'wrap' }}>
          <input aria-label={t('users.searchPh')} placeholder={t('users.searchPh')} value={query} onChange={e=>{ setQuery(e.target.value); setPage(1) }} style={{ flex:'1 1 240px', padding:10, borderRadius:10, border:'1px solid var(--line)', background:'#0c1217', color:'var(--text)' }} />
          <select value={role} onChange={e=>{ setRole(e.target.value); setPage(1) }} aria-label={t('users.role')} style={{ padding:10, borderRadius:10, border:'1px solid var(--line)', background:'#0c1217', color:'var(--text)' }}>
            <option value="all">— {t('users.role')}</option>
            <option value="admin">{t('users.roles.admin')}</option>
            <option value="analyst">{t('users.roles.analyst')}</option>
            <option value="viewer">{t('users.roles.viewer')}</option>
          </select>
          <select value={status} onChange={e=>{ setStatus(e.target.value); setPage(1) }} aria-label={t('users.status')} style={{ padding:10, borderRadius:10, border:'1px solid var(--line)', background:'#0c1217', color:'var(--text)' }}>
            <option value="all">— {t('users.status')}</option>
            <option value="active">{t('users.statuses.active')}</option>
            <option value="pending">{t('users.statuses.pending')}</option>
            <option value="blocked">{t('users.statuses.blocked')}</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table" role="table" aria-label={t('users.title')}>
            <thead><tr><th>ID</th><th>{t('login.email')}</th><th>{t('users.role')}</th><th>{t('users.status')}</th><th>{t('users.actions')}</th></tr></thead>
            <tbody>
              {pageItems.length === 0 && (<tr><td colSpan="5" className="muted">{t('users.empty')}</td></tr>)}
              {pageItems.map(u => (
                <tr key={u.id}>
                  <td>{u.id}<div className="muted" style={{fontSize:12}}>{u.name}</div></td>
                  <td>{u.email}</td>
                  <td><span className={`badge role-${u.role}`} style={{ color:'#0a0d10' }}>{t(`users.roles.${u.role}`)}</span></td>
                  <td><span className={`tag status-${u.status}`}>{t(`users.statuses.${u.status}`)}</span></td>
                  <td>
                    <div className="row" style={{ gap:6, flexWrap:'wrap' }}>
                      <button className="btn ghost" onClick={()=>act('enable', u)}>{t('users.act.enable')}</button>
                      <button className="btn ghost" onClick={()=>act('disable', u)}>{t('users.act.disable')}</button>
                      {u.role !== 'admin' ? <button className="btn" onClick={()=>act('promote', u)}>{t('users.act.promote')}</button> : <button className="btn" onClick={()=>act('demote', u)}>{t('users.act.demote')}</button>}
                      <button className="btn gold">{t('users.act.view')}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row" style={{ justifyContent:'space-between', marginTop:10 }}>
          <button className="btn ghost" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1, p-1))}>{t('users.pager.prev')}</button>
          <div className="chip">{t('users.pager.page')} {page} / {totalPages}</div>
          <button className="btn ghost" disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages, p+1))}>{t('users.pager.next')}</button>
        </div>
      </div>
    </div>
  )
}
