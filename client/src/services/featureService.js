import axios from "axios";
import { config } from "./config.js";
import { toast } from "react-toastify";

const headers = { 'X-User-Id': 100 }

function errorMessage(err) {
    return err.response?.data?.message || err.message
}

// FEATURE api calls

export async function listFeatures(projectId) {
    try {
        const response = await axios.get(config.BASE_URL + '/projects/' + projectId + '/feature', { headers })
        return response.data
    } catch (err) {
        toast.error('Could not load features: ' + errorMessage(err))
        return []
    }
}

export async function getFeatureDetails(featureId) {
    try {
        const response = await axios.get(config.BASE_URL + '/feature/' + featureId, { headers })
        return response.data
    } catch (err) {
        toast.error('Could not load feature details: ' + errorMessage(err))
        return null
    }
}

export async function createFeature({ name, projectId, dueDate }) {
    try {
        const response = await axios.post(config.BASE_URL + '/feature', { name, projectId, dueDate }, { headers })
        toast.success(response.data?.message || 'Feature created successfully')
        return true
    } catch (err) {
        toast.error('Could not create feature: ' + errorMessage(err))
        return false
    }
}

export async function updateFeatureStatus(featureId, featureStatus) {
    try {
        const response = await axios.patch(config.BASE_URL + '/feature/' + featureId + '/status', { featureStatus }, { headers })
        toast.success(response.data?.message || 'Feature updated successfully')
        return true
    } catch (err) {
        toast.error('Could not update feature: ' + errorMessage(err))
        return false
    }
}

export async function deleteFeature(featureId) {
    try {
        const response = await axios.delete(config.BASE_URL + '/feature/' + featureId, { headers })
        toast.success(response.data?.message || 'Feature deleted successfully')
        return true
    } catch (err) {
        toast.error('Could not delete feature: ' + errorMessage(err))
        return false
    }
}
