import { toast } from "react-toastify";
import api from './api'

function errorMessage(err) {
    return err.response?.data?.message || err.message
}

// FEATURE api calls

export async function listFeatures(projectId) {
    try {
        const response = await api.get('/projects/' + projectId + '/feature')
        return response.data
    } catch (err) {
        toast.error('Could not load features: ' + errorMessage(err))
        return []
    }
}

export async function getFeatureDetails(featureId) {
    try {
        const response = await api.get('/feature/' + featureId)
        return response.data
    } catch (err) {
        toast.error('Could not load feature details: ' + errorMessage(err))
        return null
    }
}

export async function createFeature({ name, projectId, dueDate }) {
    try {
        const response = await api.post('/feature', { name, projectId, dueDate })
        toast.success(response.data?.message || 'Feature created successfully')
        return true
    } catch (err) {
        toast.error('Could not create feature: ' + errorMessage(err))
        return false
    }
}

export async function updateFeatureStatus(featureId, featureStatus) {
    try {
        const response = await api.patch('/feature/' + featureId + '/status', { featureStatus })
        toast.success(response.data?.message || 'Feature updated successfully')
        return true
    } catch (err) {
        toast.error('Could not update feature: ' + errorMessage(err))
        return false
    }
}

export async function deleteFeature(featureId) {
    try {
        const response = await api.delete('/feature/' + featureId)
        toast.success(response.data?.message || 'Feature deleted successfully')
        return true
    } catch (err) {
        toast.error('Could not delete feature: ' + errorMessage(err))
        return false
    }
}
