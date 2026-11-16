import api from './api'

export async function getWatchlist() {
    const response = await api.get('/watchlist')
    return response.data
}

export async function addToWatchlist(listingId) {
    const response = await api.post(`/watchlist/${listingId}`)
    return response.data
}

export async function removeFromWatchlist(listingId) {
    const response = await api.delete(`/watchlist/${listingId}`)
    return response.data
}
