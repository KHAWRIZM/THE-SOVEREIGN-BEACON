
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Login from './pages/Login'
import Logout from './pages/Logout'
import Users from './pages/Users'
import Chat from './pages/Chat'
import HiddenConsole from './components/HiddenConsole'
import { AuthProvider, Guard } from './auth.jsx'

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/users" element={<Guard perm="users.view" fallback={<Navigate to="/login" replace />}> <Users /> </Guard>} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
        <HiddenConsole />
      </BrowserRouter>
    </AuthProvider>
  )
}
