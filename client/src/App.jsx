import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Settings from './pages/Settings'

function App({ themeMode, onThemeModeChange }) {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home themeMode={themeMode} onThemeModeChange={onThemeModeChange} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App
