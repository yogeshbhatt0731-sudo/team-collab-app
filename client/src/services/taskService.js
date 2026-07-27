import axios from "axios";
import {config} from "./config.js"
import {toast } from "react-toastify";

// X-User-Id stub — stands in for the JWT-derived user until Auth Service issues real tokens.
const headers = {'X-User-Id':100}

// ===== Task CRUD =====

// GET /task?projectId=123
export async function listTasks(projectId) {
    try{
        const response = await axios.get(config.BASE_URL+'/task',{headers,params:{projectId}})
        return response.data
    }
    catch(err){
        console.error('listTasks failed:', err.message)
        toast.error(err.message)
        return []
    }
}

// GET /task/assigned -> tasks assigned to ME (the "My Board" view, across all projects).
// No param: the backend reads the current user from the X-User-Id header.
export async function listAssignedTasks() {
    try{
        const response = await axios.get(config.BASE_URL+'/task/assigned',{headers})
        return response.data
    }
    catch(err){
        console.error('listAssignedTasks failed:', err.message)
        toast.error(err.message)
        return []
    }
}

// GET /task/{task_id} -> TaskResponseDTO
export async function getTask(taskId){
    try{
        const response = await axios.get(config.BASE_URL+'/task/'+taskId,{headers})
        return response.data
    }
    catch(err){
        console.error('getTask failed:', err.message)
        toast.error(err.message)
        return null
    }
}

// POST /task, payload: TaskRequestDTO { title, description, taskPriority, taskType, dueDate, projectID }
export async function createTask(payload){
    try{
        const response = await axios.post(config.BASE_URL+'/task', payload, {headers})
        return response.data
    }
    catch(err){
        console.error('createTask failed:', err.message)
        toast.error(err.message)
        return null
    }
}

// PATCH /task/{task_id}, payload: TaskUpdateDTO { title, description, taskPriority, taskType, dueDate }
// Note: no status here (goes through changeStatus below) and no sprintId/featureId
// (TaskUpdateDTO doesn't carry them yet).
export async function updateTask(taskId, payload){
    try{
        const { title, description, taskPriority, taskType, dueDate } = payload
        const response = await axios.patch(
            config.BASE_URL+'/task/'+taskId,
            { title, description, taskPriority, taskType, dueDate },
            {headers}
        )
        return response.data
    }
    catch(err){
        console.error('updateTask failed:', err.message)
        toast.error(err.message)
        return null
    }
}

// PATCH /task/{task_id}/status, payload: TaskStatusUpdateDTO { taskStatus }
// Backend enforces the FSM (TaskStatus.canTransitionTo) and 422s on an illegal move.
// Returns true/false so the page can toast success itself and refetch (snap back) on failure.
export async function changeStatus(taskId, taskStatus){
    try{
        await axios.patch(
            config.BASE_URL+'/task/'+taskId+'/status',
            { taskStatus },
            {headers}
        )
        return true
    }
    catch(err){
        console.error('changeStatus failed:', err.message)
        // Prefer the server's ApiResponse message; fall back to a friendly 422 line.
        const msg = err.response?.status === 422
            ? (err.response?.data?.message || "That move isn't allowed")
            : (err.response?.data?.message || 'Could not update status')
        toast.error(msg)
        return false
    }
}

// DELETE /task/{task_id}
// Server cascades the task's assignees + comments, then removes it.
// Returns true/false so the caller can toast + refetch itself.
export async function deleteTask(taskId){
    try{
        await axios.delete(config.BASE_URL+'/task/'+taskId, {headers})
        return true
    }
    catch(err){
        console.error('deleteTask failed:', err.message)
        toast.error(err.response?.data?.message || err.message)
        return false
    }
}

// PATCH /task/{task_id}/sprint, payload: TaskSprintUpdateDTO { sprintId }
// Attach the task to a sprint; pass sprintId = null to pull it back to the backlog.
export async function setTaskSprint(taskId, sprintId){
    try{
        await axios.patch(
            config.BASE_URL+'/task/'+taskId+'/sprint',
            { sprintId },
            {headers}
        )
        return true
    }
    catch(err){
        console.error('setTaskSprint failed:', err.message)
        toast.error(err.response?.data?.message || err.message)
        return false
    }
}

// PATCH /task/{task_id}/feature, payload: TaskFeatureUpdateDTO { featureId }
// Attach the task to a feature; pass featureId = null to detach it.
export async function setTaskFeature(taskId, featureId){
    try{
        await axios.patch(
            config.BASE_URL+'/task/'+taskId+'/feature',
            { featureId },
            {headers}
        )
        return true
    }
    catch(err){
        console.error('setTaskFeature failed:', err.message)
        toast.error(err.response?.data?.message || err.message)
        return false
    }
}

// ===== Task Assignee endpoints =====

// GET /task/{task_id}/assignees -> List<TaskAssigneeResponseDTO> [{ userId, assignedAt }]
export async function getAssignees(taskId){
    try{
        const response = await axios.get(config.BASE_URL+'/task/'+taskId+'/assignees', {headers})
        return response.data
    }
    catch(err){
        console.error('getAssignees failed:', err.message)
        toast.error(err.message)
        return []
    }
}

// POST /task/{task_id}/assignees, payload: TaskAssigneeRequestDTO { userId }
export async function assignTask(taskId, userId){
    try{
        const response = await axios.post(
            config.BASE_URL+'/task/'+taskId+'/assignees',
            { userId },
            {headers}
        )
        return response.data
    }
    catch(err){
        console.error('assignTask failed:', err.message)
        toast.error(err.response?.data?.message || err.message)
        return null
    }
}

// DELETE /task/{task_id}/assignees, payload: TaskAssigneeRequestDTO { userId }
// axios needs the body under `data` for DELETE requests.
export async function unassignTask(taskId, userId){
    try{
        await axios.delete(config.BASE_URL+'/task/'+taskId+'/assignees', {
            headers,
            data: { userId },
        })
        return true
    }
    catch(err){
        console.error('unassignTask failed:', err.message)
        toast.error(err.response?.data?.message || err.message)
        return false
    }
}

// ===== Comment endpoints =====

// GET /task/{task_id}/comments -> List<TaskCommentResponseDTO>
export async function getComments(taskId){
    try{
        const response = await axios.get(config.BASE_URL+'/task/'+taskId+'/comments', {headers})
        return response.data
    }
    catch(err){
        console.error('getComments failed:', err.message)
        toast.error(err.message)
        return []
    }
}

// POST /task/{task_id}/comments, payload: TaskCommentRequestDTO { content }
// Server returns only an ApiResponse (no created comment) — caller should refetch getComments after.
export async function addComment(taskId, content){
    try{
        const response = await axios.post(
            config.BASE_URL+'/task/'+taskId+'/comments',
            { content },
            {headers}
        )
        return response.data
    }
    catch(err){
        console.error('addComment failed:', err.message)
        toast.error(err.response?.data?.message || err.message)
        return null
    }
}

// PATCH /task/{task_id}/comments/{comment_id}, payload: TaskCommentRequestDTO { content }
export async function updateComment(taskId, commentId, content){
    try{
        const response = await axios.patch(
            config.BASE_URL+'/task/'+taskId+'/comments/'+commentId,
            { content },
            {headers}
        )
        return response.data
    }
    catch(err){
        console.error('updateComment failed:', err.message)
        toast.error(err.response?.data?.message || err.message)
        return null
    }
}

// DELETE /task/{task_id}/comments/{comment_id}
export async function deleteComment(taskId, commentId){
    try{
        await axios.delete(config.BASE_URL+'/task/'+taskId+'/comments/'+commentId, {headers})
        return true
    }
    catch(err){
        console.error('deleteComment failed:', err.message)
        toast.error(err.response?.data?.message || err.message)
        return false
    }
}
