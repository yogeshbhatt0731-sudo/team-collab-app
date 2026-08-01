import axios from 'axios'
import { API_BASE_URL } from './config'

const api = axios.create({ baseURL: API_BASE_URL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('clove_access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  const workspaceId = localStorage.getItem('active_workspace_id')
  if (workspaceId) {
    config.headers['X-Workspace-Id'] = workspaceId
  }
  return config
})

export default api
