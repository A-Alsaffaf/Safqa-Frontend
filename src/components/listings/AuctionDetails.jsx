import CountDown from '../common/CountDown'
import BidForm from './BidForm'
import BidHistory from './BidHistory'
import ReportButton from './ReportButton'

function formatDate(value) {
  if (!value) return 'Not set'

  return new Date(value).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

function AuctionDetails({ listing, onBidPlaced, onAuctionEnd }) {
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

  let currentBidText = 'No bids yet'
  if (listing.currentBid) {
    currentBidText = `BD ${listing.currentBid}`
  }

  let currentBidderText = 'None'
  if (listing.currentBidder) {
    currentBidderText = listing.currentBidder
  }

  let buyNowRow = null
  if (listing.buyNowPrice) {
    buyNowRow = <p>Buy now: BD {listing.buyNowPrice}</p>
  }

  let soldNotice = null
  if (listing.status === 'Sold') {
    let winner = 'Unknown'
    if (listing.winner) {
      if (typeof listing.winner === 'object') {
        winner = listing.winner.username
      } else {
        winner = listing.winner
      }
    }
    soldNotice = (
      <div className='status-banner ok'>
        <span>Sold to {winner} for BD {listing.currentBid}</span>
      </div>
    )
  }

  let closedNotice = null
  if (listing.status === 'Closed') {
    closedNotice = (
      <div className='status-banner muted'>
        <span>Auction ended with no bids</span>
      </div>
    )
  }

  let isActive = false
  if (listing.status === 'Active') {
    isActive = true
  }

  let bidFormElement = null
  if (isActive) {
    bidFormElement = <BidForm listing={listing} onBidPlaced={onBidPlaced} />
  }

  let buyNowButton = null
  if (isActive) {
    if (listing.buyNowPrice) {
      buyNowButton = (
        <button type='button' className='btn-buy-now'>
          Buy now for BD {listing.buyNowPrice}
        </button>
      )
    }
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
            <p>Starting bid: BD {listing.startingBid}</p>
            <p>Current bidder: {currentBidderText}</p>
            {buyNowRow}
            <p>Starts at: {formatDate(listing.startsAt)}</p>
            <p>Ends at: {formatDate(listing.endsAt)}</p>
            <p>Seller: {seller}</p>
          </div>
        </details>

        <BidHistory listingId={listing._id} currentBid={listing.currentBid} />
      </div>

      <div className='listing-side-col'>
        <div className='countdown-hero'>
          <span className='countdown-label'>AUCTION CLOSES IN</span>
          <CountDown
            startsAt={listing.startsAt}
            endsAt={listing.endsAt}
            onEnd={onAuctionEnd}
          />
        </div>

        <h1 className='listing-title'>{listing.title}</h1>

        <div className='current-bid-box'>
          <span className='bid-label'>Current Bid</span>
          <span className='bid-value'>{currentBidText}</span>
          <span className='bid-starting'>Starting: BD {listing.startingBid}</span>
        </div>

        {soldNotice}
        {closedNotice}

        {bidFormElement}
        {buyNowButton}

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

export default AuctionDetails
