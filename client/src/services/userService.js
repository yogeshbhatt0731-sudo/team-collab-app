import axios from "axios";
import { API_BASE_URL } from "./config.js"

export async function getUsersByIds(ids){
    if(!ids || ids.length === 0) return []
    try{
        const token = localStorage.getItem('clove_access_token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const response = await axios.get(API_BASE_URL+'/auth/users', { headers, params: { ids: ids.join(',') } })
        return response.data
    }
    catch(err){
        console.warn('getUsersByIds failed (auth not ready?):', err.message)
        return []
    }
}
