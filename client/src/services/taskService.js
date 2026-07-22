import axios from "axios";
import {config} from "./config.js"
import {toast } from "react-toastify";

const headers = {'X-User-Id':100}

// TASKS api calls

export async function listTasks(projectId) {
    try{

     const response = await  axios.get(config.BASE_URL+'/task',{headers,params:{projectId}})

        return response.data
    }
    catch(err){
        console.error('listTasks failed:', err.message)
        toast.error(err.message)
    }
}

export async function getTask(taskId){
    try{
        const response = await axios.get(config.BASE_URL+'/task/'+taskId,{headers})
        console.log(response.data)
    }
    catch(err){
        console.error('get Task failed:', err.message)
        
    }
}



export async function changeStatus(taskId,status){
    try{
        await axios.patch(config.BASE_URL+"/task/${taskId}`,{status},{headers})")
        return true
    }
    catch(err){
        console.error('changeStatus failed:', err.message)
    }
}

listTasks(1)