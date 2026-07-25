import axios from "axios";
import { config } from "./config.js";
import { toast } from "react-toastify";

const headers = { 'X-User-Id': 100 }

function errorMessage(err) {
    return err.response?.data?.message || err.message
}

// SPRINT api calls

export async function listSprints(projectId) {
    try {
        const response = await axios.get(config.BASE_URL + '/projects/' + projectId + '/sprints', { headers })
        return response.data
    } catch (err) {
        toast.error('Could not load sprints: ' + errorMessage(err))
        return []
    }
}

export async function getSprintDetails(sprintId) {
    try {
        const response = await axios.get(config.BASE_URL + '/sprints/' + sprintId, { headers })
        return response.data
    } catch (err) {
        toast.error('Could not load sprint details: ' + errorMessage(err))
        return null
    }
}

export async function createSprint({ name, goal, projectId }) {
    try {
        const response = await axios.post(config.BASE_URL + '/sprints', { name, goal, projectId }, { headers })
        toast.success(response.data?.message || 'Sprint created successfully')
        return true
    } catch (err) {
        toast.error('Could not create sprint: ' + errorMessage(err))
        return false
    }
}

export async function updateSprintStatus(sprintId, sprintStatus) {
    try {
        const response = await axios.patch(config.BASE_URL + '/sprints/' + sprintId + '/status', { sprintStatus }, { headers })
        toast.success(response.data?.message || 'Sprint updated successfully')
        return true
    } catch (err) {
        toast.error('Could not update sprint: ' + errorMessage(err))
        return false
    }
}

export async function updateSprint(sprintId, { name, goal }) {
    try {
        const response = await axios.patch(config.BASE_URL + '/sprints/' + sprintId, { name, goal }, { headers })
        toast.success(response.data?.message || 'Sprint updated successfully')
        return true
    } catch (err) {
        toast.error('Could not update sprint: ' + errorMessage(err))
        return false
    }
}

export async function deleteSprint(sprintId) {
    try {
        const response = await axios.delete(config.BASE_URL + '/sprints/' + sprintId, { headers })
        toast.success(response.data?.message || 'Sprint deleted successfully')
        return true
    } catch (err) {
        toast.error('Could not delete sprint: ' + errorMessage(err))
        return false
    }
}
