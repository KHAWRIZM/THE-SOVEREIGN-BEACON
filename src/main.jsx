
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './brand.css'
import { I18nProvider } from './i18n'
import { NotifyProvider } from './notify'

// Theme preload
const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark' || savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', savedTheme)
} else {
  document.documentElement.removeAttribute('data-theme')
}

createRoot(document.getElementById('root')).render(
  <I18nProvider>
    <NotifyProvider>
      <App />
    </NotifyProvider>
  </I18nProvider>
)
