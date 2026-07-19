import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import WorkspaceDetail from './pages/WorkspaceDetail'
import ProjectDetail from './pages/ProjectDetail'
import Workspaces from './pages/Workspaces'
import Settings from './pages/Settings'
import Board from './pages/Board'
import Members from './pages/Members'
import TaskDetail from './pages/TaskDetail'

function App({ themeMode, onThemeModeChange }) {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home themeMode={themeMode} onThemeModeChange={onThemeModeChange} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/workspaces" element={<Workspaces themeMode={themeMode} onThemeModeChange={onThemeModeChange} />} />
        <Route path="/settings" element={<Settings themeMode={themeMode} onThemeModeChange={onThemeModeChange} />} />
        <Route path="/workspace/:workspaceId" element={<WorkspaceDetail />} />
        <Route path="/workspace/:workspaceId/project/:projectId" element={<ProjectDetail />} />
        <Route path="/board" element={<Board />} />
        <Route path="/task/:taskId" element={<TaskDetail />} />
        <Route path="/members" element={<Members />} />
      </Routes>
    </div>
  )
}

export default App
