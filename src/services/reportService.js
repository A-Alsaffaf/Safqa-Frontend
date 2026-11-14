import api from './api'

export async function createReport(listingId, formData) {
    const response = await api.post(`/listings/${listingId}/reports`, formData)
    return response.data
}

export async function getAllReports() {
    const response = await api.get('/admin/reports')
    return response.data
}

export async function getReportById(id) {
    const response = await api.get(`/admin/reports/${id}`)
    return response.data
}

export async function updateReportStatus(id, status) {
    const response = await api.put(`/admin/reports/${id}`, { status })
    return response.data
}
