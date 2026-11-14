import BuyNowBox from './BuyNowBox'
import ReportButton from './ReportButton'

function FixedPriceDetails({ listing, onPurchased }) {
  let imagesContent = 'No images'
  if (listing.images) {
    if (listing.images.length > 0) {
      imagesContent = listing.images.map((src, i) => (
        <img key={i} src={src} alt={`${listing.title} ${i + 1}`} width='120' />
      ))
    }
  }

  let seller = 'Unknown'
  if (listing.seller) {
    if (typeof listing.seller === 'object') {
      seller = listing.seller.username
    } else {
      seller = listing.seller
    }
  }

  let buyNowRow = null
  if (listing.buyNowPrice) {
    buyNowRow = <p>Buy now: BD {listing.buyNowPrice}</p>
  }

  return (
    <div className='listing-layout'>
      <div className='listing-main-col'>
        <div className='listing-gallery'>
          {imagesContent}
        </div>

        <div className='listing-desc-card'>
          <h3>Description</h3>
          <p>{listing.description}</p>
        </div>

        <details className='listing-specs-accordion'>
          <summary>Show more details</summary>
          <div className='specs-grid'>
            <p>Type: {listing.type}</p>
            <p>Condition: {listing.condition}</p>
            <p>Status: {listing.status}</p>
            {buyNowRow}
            <p>Seller: {seller}</p>
          </div>
        </details>
      </div>

      <div className='listing-side-col'>
        <div className='fixed-status-pill'>
          <span>FIXED PRICE LISTING</span>
        </div>

        <h1 className='listing-title'>{listing.title}</h1>

        <div className='current-bid-box'>
          <span className='bid-label'>Price</span>
          <span className='bid-value'>BD {listing.price}</span>
          <span className='bid-starting'>Status: {listing.status}</span>
        </div>

        <BuyNowBox listing={listing} onPurchased={onPurchased} />

        <div className='listing-action-row'>
          <button type='button' className='btn-watchlist'>
            Add to watchlist
          </button>
          <ReportButton listing={listing} />
        </div>
      </div>
    </div>
  )
}

export default FixedPriceDetails
