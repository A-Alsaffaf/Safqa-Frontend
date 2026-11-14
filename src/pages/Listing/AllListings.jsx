import { useEffect, useState } from 'react'
import { getListings } from '../../services/listingService'
import ListingGrid from '../../components/listings/ListingGrid'

function AllListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getListings()
      .then((data) => {
        setListings(data)
      })
      .catch((err) => {
        console.log(err)
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  if (listings.length === 0) {
    return (
      <div>
        <h1>All Listings</h1>
        <p>No listings found</p>
      </div>
    )
  }

  return (
    <div>
      <h1>All Listings</h1>
      <ListingGrid listings={listings} />
    </div>
  )
}

export default AllListings