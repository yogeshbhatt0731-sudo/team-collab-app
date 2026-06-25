import axios from 'axios'
import { API_BASE_URL } from './config'

export async function loginUser(email, password) {
  const url = API_BASE_URL + '/auth/login'
  const body = { email, password }
  try {
    const response = await axios.post(url, body)
    return response.data
  } catch (error) {
    window.alert(error)
  }
}

export async function registerUser(firstName, lastName, email, password) {
  const url = API_BASE_URL + '/auth/register'
  const name = firstName + ' ' + lastName
  const body = { name, email, password }
  
  console.log('Attempting to register at:', url)
  console.log('Request body:', body)
  
  try {
    const response = await axios({
      method: 'POST',
      url: url,
      data: body,
      headers: { 
        'Content-Type': 'application/json'
      },
      withCredentials: false
    })
    console.log('Register response:', response.status, response.data)

    return response.data
  } catch (error) {
    
    
    return { 
      status: false, 
      error: error.response?.data?.error || { message: error.message } 
    }
  }
}

export async function getCurrentUser(token) {
  const url = API_BASE_URL + '/auth/me'
  const headers = { authorization: 'Bearer ' + token }
  try {
    const response = await axios.get(url, { headers })
    return response.data
  } catch (error) {
    window.alert(error)
  }
}

export async function logoutUser(token) {
  const url = API_BASE_URL + '/auth/logout'
  const headers = { authorization: 'Bearer ' + token }
  try {
    const response = await axios.post(url, {}, { headers })
    return response.data
  } catch (error) {
    window.alert(error)
  }
}

export async function refreshToken(refreshToken) {
  const url = API_BASE_URL + '/auth/refresh'
  const body = { refreshToken }
  try {
    const response = await axios.post(url, body)
    return response.data
  } catch (error) {
    window.alert(error)
  }
}
