import api from './api'

// ===== Project endpoints =====

export async function getProjectById(projectId) {
  const response = await api.get(`/projects/${projectId}`)
  return response.data
}

export async function getMyProjects() {
  const response = await api.get('/projects')
  return response.data
}

export async function createProject(workspaceId, name) {
  const response = await api.post(`/workspaces/${workspaceId}/projects`, { name })
  return response.data
}

export async function updateProject(projectId, name) {
  const response = await api.put(`/projects/${projectId}`, { name })
  return response.data
}

export async function deleteProject(projectId) {
  const response = await api.delete(`/projects/${projectId}`)
  return response.data
}

export async function getTasksByProject(projectId) {
  const response = await api.get('/task', { params: { projectId } })
  return response.data
}
