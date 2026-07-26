import axios from 'axios'
import { API_BASE_URL } from './config'

// ===== Workspace endpoints =====

//Get Headers for userId
function userHeaders(userId) {
  return { 'X-User-Id': 100 }
}

//GET /workspaces -> List<WorkspaceResponseDTO>
export async function getWorkspaces(userId) {
  const response = await axios.get(`${API_BASE_URL}/workspaces`, {
    headers: userHeaders(userId),
  })
  return response.data
}

//GET /workspaces/{workspace_id} -> WorkspaceResponseDTO
export async function getWorkspaceById(workspaceId, userId) {
  const response = await axios.get(`${API_BASE_URL}/workspaces/${workspaceId}`, {
    headers: userHeaders(userId),
  })
  return response.data
}

//GET /workspaces/{workspace_id}/projects -> List<ProjectResponseDTO>
export async function getProjectsByWorkspace(workspaceId, userId) {
  const response = await axios.get(`${API_BASE_URL}/workspaces/${workspaceId}/projects`, {
    headers: userHeaders(userId),
  })
  return response.data
}


//POST /workspaces, payload: WorkspaceRequestDTO { name }
export async function createWorkspace(name, userId) {
  const response = await axios.post(
    `${API_BASE_URL}/workspaces`,
    { name },
    { headers: userHeaders(userId) },
  )
  return response.data
}

//PUT /workspaces/{workspace_id}, payload: WorkspaceRequestDTO { name }
export async function updateWorkspace(workspaceId, name, userId) {
  const response = await axios.put(
    `${API_BASE_URL}/workspaces/${workspaceId}`,
    { name },
    { headers: userHeaders(userId) },
  )
  return response.data
}

//DELETE /workspaces/{workspace_id}
export async function deleteWorkspace(workspaceId, userId) {
  const response = await axios.delete(`${API_BASE_URL}/workspaces/${workspaceId}`, {
    headers: userHeaders(userId),
  })
  return response.data
}
