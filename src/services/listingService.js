import api from './api'

export async function getListings() {
    const response = await api.get('/listings')
    return response.data
}

export async function getListingById(listingId) {
    const response = await api.get(`/listings/${listingId}`)
    return response.data
}

export async function getListingEnums() {
    const response = await api.get('/listings/enums')
    return response.data
}

export async function getMyListings() {
    const response = await api.get('/listings/my-listings')
    return response.data
}

export async function createListing(newListing) {
    const response = await api.post('/listings', newListing)
    return response.data
}

export async function updateListing(listingId, listingData) {
    const response = await api.put(`/listings/${listingId}`, listingData)
    return response.data
}

export async function deleteListing(listingId) {
    const response = await api.delete(`/listings/${listingId}`)
    return response.data
}

export async function buyNow(listingId) {
    const response = await api.post(`/listings/${listingId}/buy-now`)
    return response.data
}