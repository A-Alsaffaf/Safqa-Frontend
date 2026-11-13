import api from './api'

async function getOrders() {
    const response = await api.get('/orders')
    return response.data
}

async function getOrderById(orderId) {
    const response = await api.get(`/orders/${orderId}`)
    return response.data
}

async function updateOrderStatus(orderId, status) {
    const response = await api.put(`/orders/${orderId}/status`, { status })
    return response.data
}

export {
    getOrders,
    getOrderById,
    updateOrderStatus
}