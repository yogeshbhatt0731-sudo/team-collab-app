import axios from 'axios'
import { AUTH_BASE_URL } from './config'

// LoginRequestDTO wants { userName, password } — login is by username, not email.
export async function loginUser(userName, password) {
  const url = AUTH_BASE_URL + '/auth/login'
  try {
    const response = await axios.post(url, { userName, password })
    return { status: true, data: response.data }
  } catch (error) {
    return {
      status: false,
      error: error.response?.data?.message || error.response?.data?.error || { message: error.message },
    }
  }
}

// RegisterRequestDTO wants { name, email, userName, password }.
export async function registerUser(firstName, lastName, email, userName, password) {
  const url = AUTH_BASE_URL + '/auth/register'
  const name = firstName + ' ' + lastName
  const body = { name, email, userName, password }

  try {
    const response = await axios.post(url, body)
    return { status: true, data: response.data }
  } catch (error) {
    return {
      status: false,
      error: error.response?.data?.message || error.response?.data?.error || { message: error.message },
    }
  }
}
