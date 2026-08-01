import {toast } from "react-toastify";
import api from './api'

// ===== Task CRUD =====

// GET /task?projectId=123
export async function listTasks(projectId) {
    try{
        const response = await api.get('/task', { params: { projectId } })
        return response.data
    }
    catch(err){
        console.error('listTasks failed:', err.message)
        toast.error(err.message)
        return []
    }
}

// GET /task/assigned -> tasks assigned to ME (the "My Board" view, across all projects).
export async function listAssignedTasks() {
    try{
        const response = await api.get('/task/assigned')
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
        const response = await api.get('/task/'+taskId)
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
        const response = await api.post('/task', payload)
        return response.data
    }
    catch(err){
        console.error('createTask failed:', err.message)
        toast.error(err.message)
        return null
    }
}

// PATCH /task/{task_id}, payload: TaskUpdateDTO { title, description, taskPriority, taskType, dueDate }
export async function updateTask(taskId, payload){
    try{
        const { title, description, taskPriority, taskType, dueDate } = payload
        const response = await api.patch(
            '/task/'+taskId,
            { title, description, taskPriority, taskType, dueDate }
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
export async function changeStatus(taskId, taskStatus){
    try{
        await api.patch('/task/'+taskId+'/status', { taskStatus })
        return true
    }
    catch(err){
        console.error('changeStatus failed:', err.message)
        const msg = err.response?.status === 422
            ? (err.response?.data?.message || "That move isn't allowed")
            : (err.response?.data?.message || 'Could not update status')
        toast.error(msg)
        return false
    }
}

// DELETE /task/{task_id}
export async function deleteTask(taskId){
    try{
        await api.delete('/task/'+taskId)
        return true
    }
    catch(err){
        console.error('deleteTask failed:', err.message)
        toast.error(err.response?.data?.message || err.message)
        return false
    }
}

// PATCH /task/{task_id}/sprint, payload: TaskSprintUpdateDTO { sprintId }
export async function setTaskSprint(taskId, sprintId){
    try{
        await api.patch('/task/'+taskId+'/sprint', { sprintId })
        return true
    }
    catch(err){
        console.error('setTaskSprint failed:', err.message)
        toast.error(err.response?.data?.message || err.message)
        return false
    }
}

// PATCH /task/{task_id}/feature, payload: TaskFeatureUpdateDTO { featureId }
export async function setTaskFeature(taskId, featureId){
    try{
        await api.patch('/task/'+taskId+'/feature', { featureId })
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
        const response = await api.get('/task/'+taskId+'/assignees')
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
        const response = await api.post('/task/'+taskId+'/assignees', { userId })
        return response.data
    }
    catch(err){
        console.error('assignTask failed:', err.message)
        toast.error(err.response?.data?.message || err.message)
        return null
    }
}

// DELETE /task/{task_id}/assignees, payload: TaskAssigneeRequestDTO { userId }
export async function unassignTask(taskId, userId){
    try{
        await api.delete('/task/'+taskId+'/assignees', { data: { userId } })
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
        const response = await api.get('/task/'+taskId+'/comments')
        return response.data
    }
    catch(err){
        console.error('getComments failed:', err.message)
        toast.error(err.message)
        return []
    }
}

// POST /task/{task_id}/comments, payload: TaskCommentRequestDTO { content }
export async function addComment(taskId, content){
    try{
        const response = await api.post('/task/'+taskId+'/comments', { content })
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
        const response = await api.patch('/task/'+taskId+'/comments/'+commentId, { content })
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
        await api.delete('/task/'+taskId+'/comments/'+commentId)
        return true
    }
    catch(err){
        console.error('deleteComment failed:', err.message)
        toast.error(err.response?.data?.message || err.message)
        return false
    }
}
