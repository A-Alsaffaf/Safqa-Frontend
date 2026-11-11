import api from './api'

export async function getBidsByListing(listingId) {
    const response = await api.get(`/listings/${listingId}/bids`)
    return response.data
}

export async function placeBid(listingId, amount) {
    const response = await api.post(`/listings/${listingId}/bids`, { amount })
    return response.data
}
