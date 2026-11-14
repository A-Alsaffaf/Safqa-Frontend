import { Link } from 'react-router'

function ListingCard({ listing }) {
  let imageUrl = ''
  if (listing.images && listing.images.length > 0) {
    imageUrl = listing.images[0]
  }

  let priceLabel = 'Price'
  let priceValue = listing.price

  if (listing.type === 'Auction') {
    priceLabel = 'Current Bid'
    priceValue = listing.currentBid || listing.startingBid
  }

  let imageElement = null
  if (imageUrl) {
    imageElement = <img src={imageUrl} alt={listing.title} width='150' />
  }

  return (
    <div>
      {imageElement}
      <h3>{listing.title}</h3>
      <p>Type: {listing.type}</p>
      <p>Condition: {listing.condition}</p>
      <p>{priceLabel}: BD {priceValue}</p>
      <Link to={`/listings/${listing._id}`}>View Details</Link>
    </div>
  )
}

export default ListingCard