import axios from 'axios'
import { API_BASE_URL } from './config'

export async function getWorkspaces(token) {
  const url = API_BASE_URL + '/workspaces'
  const headers = { authorization: 'Bearer ' + token }
  try {
    const response = await axios.get(url, { headers })
    return response.data
  } catch (error) {
    window.alert(error)
  }
}

export async function getWorkspaceById(workspaceId, token) {
  const url = API_BASE_URL + '/workspaces/' + workspaceId
  const headers = { authorization: 'Bearer ' + token }
  try {
    const response = await axios.get(url, { headers })
    return response.data
  } catch (error) {
    window.alert(error)
  }
}

export async function createWorkspace(name, token) {
  const url = API_BASE_URL + '/workspaces'
  const headers = { authorization: 'Bearer ' + token }
  const body = { name }
  try {
    const response = await axios.post(url, body, { headers })
    return response.data
  } catch (error) {
    window.alert(error)
  }
}

export async function updateWorkspace(workspaceId, name, token) {
  const url = API_BASE_URL + '/workspaces/' + workspaceId
  const headers = { authorization: 'Bearer ' + token }
  const body = { name }
  try {
    const response = await axios.put(url, body, { headers })
    return response.data
  } catch (error) {
    window.alert(error)
  }
}

export async function deleteWorkspace(workspaceId, token) {
  const url = API_BASE_URL + '/workspaces/' + workspaceId
  const headers = { authorization: 'Bearer ' + token }
  try {
    const response = await axios.delete(url, { headers })
    return response.data
  } catch (error) {
    window.alert(error)
  }
}
