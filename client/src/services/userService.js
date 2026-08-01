import axios from "axios";
import { AUTH_BASE_URL } from "./config.js"

// USERS api calls  ->  these hit the AUTH service, NOT the workspace service.

// ids = [100, 101, 102]   ->   [{ id, name, email, avatarColor }]
export async function getUsersByIds(ids){
    if(!ids || ids.length === 0) return []
    try{
        const token = localStorage.getItem('clove_access_token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const response = await axios.get(AUTH_BASE_URL+'/auth/users', { headers, params: { ids: ids.join(',') } })
        return response.data
    }
    catch(err){
        console.warn('getUsersByIds failed (auth not ready?):', err.message)
        return []
    }
}
