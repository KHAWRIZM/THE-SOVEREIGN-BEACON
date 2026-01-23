
import { createContext, useCallback, useContext, useState } from 'react'

const NotifyCtx = createContext(null)

export function NotifyProvider({ children }) {
  const [items, setItems] = useState([])
  const notify = useCallback(({ title, message, type='info', timeout=4000 } = {}) => {
    const id = Math.random().toString(36).slice(2)
    const item = { id, title, message, type }
    setItems(prev => [...prev, item])
    if (timeout > 0) setTimeout(() => setItems(prev => prev.filter(x => x.id !== id)), timeout)
    return id
  }, [])
  const remove = useCallback((id) => setItems(prev => prev.filter(x => x.id !== id)), [])
  return (
    <NotifyCtx.Provider value={{ notify, remove }}>
      {children}
      <div className="toaster" role="region" aria-live="polite" aria-label="Notifications">
        {items.map(t => (
          <div key={t.id} className={`toast ${t.type}`} role="status" tabIndex={0}>
            {t.title && <div className="toast-title">{t.title}</div>}
            {t.message && <div className="toast-body">{t.message}</div>}
            <button className="toast-close" onClick={() => remove(t.id)} aria-label="Dismiss">×</button>
          </div>
        ))}
      </div>
    </NotifyCtx.Provider>
  )
}

export const useNotify = () => useContext(NotifyCtx)
