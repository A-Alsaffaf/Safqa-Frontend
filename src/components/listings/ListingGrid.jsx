import ListingCard from './ListingCard'

function ListingGrid({ listings }) {
  if (!listings || listings.length === 0) {
    return <p>No listings available</p>
  }

  return (
    <div>
      {listings.map((listing) => (
        <ListingCard key={listing._id} listing={listing} />
      ))}
    </div>
  )
}

export default ListingGrid