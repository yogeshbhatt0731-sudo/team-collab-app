import api from './api'

// ===== Workspace endpoints =====

export async function getWorkspaces() {
  const response = await api.get('/workspaces')
  return response.data
}

export async function getWorkspaceById(workspaceId) {
  const response = await api.get(`/workspaces/${workspaceId}`)
  return response.data
}

export async function getProjectsByWorkspace(workspaceId) {
  const response = await api.get(`/workspaces/${workspaceId}/projects`)
  return response.data
}

export async function createWorkspace(name) {
  const response = await api.post('/workspaces', { name })
  return response.data
}

export async function updateWorkspace(workspaceId, name) {
  const response = await api.put(`/workspaces/${workspaceId}`, { name }, {
    headers: { 'X-Workspace-Id': workspaceId },
  })
  return response.data
}

export async function deleteWorkspace(workspaceId) {
  const response = await api.delete(`/workspaces/${workspaceId}`, {
    headers: { 'X-Workspace-Id': workspaceId },
  })
  return response.data
}

export async function getWorkspaceMembers(workspaceId) {
  const response = await api.get(`/workspaces/${workspaceId}/members`)
  return response.data
}
