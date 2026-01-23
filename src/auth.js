
import { createContext, useContext, useMemo, useState } from 'react'
const AuthCtx = createContext(null)
const KEY = 'dragon403:auth'

export function AuthProvider({ children }){
  let saved = {}
  try { saved = JSON.parse(localStorage.getItem(KEY)) || {} } catch {}
  const [user, setUser] = useState(saved.user || null)
  const login = (email, role='analyst') => { const u = { email, role }; setUser(u); localStorage.setItem(KEY, JSON.stringify({ user: u })) }
  const logout = () => { setUser(null); localStorage.removeItem(KEY) }
  const can = (perm) => {
    const role = user?.role
    if(!role) return false
    const MATRIX = {
      admin:   ['users.view','users.manage','chat.export','chat.record','console','cases'],
      analyst: ['users.view','chat.export','chat.record','cases'],
      viewer:  ['chat.export']
    }
    return MATRIX[role]?.includes(perm) || false
  }
  const value = useMemo(()=>({ user, login, logout, can }), [user])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}
export const useAuth = () => useContext(AuthCtx)
export function Guard({ perm, fallback=null, children }){ const { can } = useAuth(); if(!perm) return children; return can(perm) ? children : (fallback ?? null) }
