import { toast } from "react-toastify";
import api from './api'

function errorMessage(err) {
    return err.response?.data?.message || err.message
}

// SPRINT api calls

export async function listSprints(projectId) {
    try {
        const response = await api.get('/projects/' + projectId + '/sprints')
        return response.data
    } catch (err) {
        toast.error('Could not load sprints: ' + errorMessage(err))
        return []
    }
}

export async function getSprintDetails(sprintId) {
    try {
        const response = await api.get('/sprints/' + sprintId)
        return response.data
    } catch (err) {
        toast.error('Could not load sprint details: ' + errorMessage(err))
        return null
    }
}

export async function createSprint({ name, goal, projectId }) {
    try {
        const response = await api.post('/sprints', { name, goal, projectId })
        toast.success(response.data?.message || 'Sprint created successfully')
        return true
    } catch (err) {
        toast.error('Could not create sprint: ' + errorMessage(err))
        return false
    }
}

export async function updateSprintStatus(sprintId, sprintStatus) {
    try {
        const response = await api.patch('/sprints/' + sprintId + '/status', { sprintStatus })
        toast.success(response.data?.message || 'Sprint updated successfully')
        return true
    } catch (err) {
        toast.error('Could not update sprint: ' + errorMessage(err))
        return false
    }
}

export async function updateSprint(sprintId, { name, goal }) {
    try {
        const response = await api.patch('/sprints/' + sprintId, { name, goal })
        toast.success(response.data?.message || 'Sprint updated successfully')
        return true
    } catch (err) {
        toast.error('Could not update sprint: ' + errorMessage(err))
        return false
    }
}

export async function deleteSprint(sprintId) {
    try {
        const response = await api.delete('/sprints/' + sprintId)
        toast.success(response.data?.message || 'Sprint deleted successfully')
        return true
    } catch (err) {
        toast.error('Could not delete sprint: ' + errorMessage(err))
        return false
    }
}
