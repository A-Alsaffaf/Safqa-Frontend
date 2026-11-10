import api from './api'

export async function getCategories() {
    const response = await api.get('/categories')
    return response.data
}

export async function getCategoryById(categoryId){
    const response = await api.get(`/categories/${categoryId}`)
    return response.data
}

export async function createCategory(name) {
    const response = await api.post('/admin/categories', { name })
    return response.data
}

export async function updateCategory(categoryId, name) {
    const response = await api.put(`/admin/categories/${categoryId}`, { name })
    return response.data
}

export async function deleteCategory(categoryId) {
    const response = await api.delete(`/admin/categories/${categoryId}`)
    return response.data
}