import axios from 'axios'
import { API_BASE_URL } from './config'


// ===== Project endpoints =====


//Get Headers for userId
function userHeaders(userId) {
  return { 'X-User-Id': userId }
}


//GET /projects/{project_id} -> ProjectResponseDTO
export async function getProjectById(projectId, userId) {
  const response = await axios.get(`${API_BASE_URL}/projects/${projectId}`, {
    headers: userHeaders(userId),
  })
  return response.data
} 

//GET /projects -> List<ProjectResponseDTO>
export async function getMyProjects(userId) {
  const response = await axios.get(`${API_BASE_URL}/projects`, {
    headers: userHeaders(userId),
  })
  return response.data
}

//POST /workspaces/{workspace_id}/projects, payload: ProjectRequestDTO { name }
export async function createProject(workspaceId, name, userId) {
  const response = await axios.post(
    `${API_BASE_URL}/workspaces/${workspaceId}/projects`,
    { name },
    { headers: userHeaders(userId) },
  )
  return response.data
}

//PUT /projects/{project_id}, payload: ProjectRequestDTO { name }
export async function updateProject(projectId, name, userId) {
  const response = await axios.put(
    `${API_BASE_URL}/projects/${projectId}`,
    { name },
    { headers: userHeaders(userId) },
  )
  return response.data
}

//DELETE /projects/{project_id}
export async function deleteProject(projectId, userId) {
  const response = await axios.delete(`${API_BASE_URL}/projects/${projectId}`, {
    headers: userHeaders(userId),
  })
  return response.data
}

//GET /projects/{project_id}/tasks -> List<TaskResponseDTO>
export async function getTasksByProject(projectId, userId) {
  const response = await axios.get(`${API_BASE_URL}/task`, {
    headers: userHeaders(userId),
    params: { projectId },
  })
  return response.data
}
