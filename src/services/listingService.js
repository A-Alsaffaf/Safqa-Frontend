import api from './api'

export async function getListings() {
    const response = await api.get('/listings')
    return response.data
}

export async function getListingId(listingId) {
    const response = await api.get(`/listings:${listingId}`)
    return response.data
}

// export async function getMyListings() {
    
// }