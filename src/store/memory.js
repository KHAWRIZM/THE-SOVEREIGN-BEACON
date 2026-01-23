
const NS = 'dragon403:mem'
export function remember(ns, key, value){ const raw = localStorage.getItem(NS) || '{}'; const obj = JSON.parse(raw); obj[ns] = obj[ns] || {}; obj[ns][key] = value; localStorage.setItem(NS, JSON.stringify(obj)) }
export function recall(ns, key, fallback=null){ const raw = localStorage.getItem(NS) || '{}'; const obj = JSON.parse(raw); return obj?.[ns]?.[key] ?? fallback }
export function forget(ns, key){ const raw = localStorage.getItem(NS) || '{}'; const obj = JSON.parse(raw); if(obj?.[ns]){ delete obj[ns][key]; localStorage.setItem(NS, JSON.stringify(obj)) } }
export function pushHistory(ns, entry, max=100){ const arr = recall(ns, 'history', []); arr.push(entry); if(arr.length > max) arr.shift(); remember(ns, 'history', arr) }
