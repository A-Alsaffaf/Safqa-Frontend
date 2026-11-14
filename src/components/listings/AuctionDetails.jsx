import CountDown from '../common/CountDown'
import BidForm from './BidForm'
import BidHistory from './BidHistory'
import ReportButton from './ReportButton'
import EditButton from './EditButton'

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

function AuctionDetails({ listing, user, onBidPlaced, onAuctionEnd }) {
  if (!listing) return null

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
  if (listing.currentBid != null) {
    currentBidText = `BD ${listing.currentBid}`
  }

  let currentBidderText = 'None'
  if (listing.currentBidder) {
    if (typeof listing.currentBidder === 'object') {
      currentBidderText = listing.currentBidder.username
    } else {
      currentBidderText = listing.currentBidder
    }
  }

  let winnerText = 'None'
  if (listing.winner) {
    if (typeof listing.winner === 'object') {
      winnerText = listing.winner.username
    } else {
      winnerText = listing.winner
    }
  }

  let buyNowButton = null
  if (listing.status === 'Active') {
    if (listing.buyNowPrice) {
      buyNowButton = (
        <button type='button' className='btn-buy-now'>
          Buy now for BD {listing.buyNowPrice}
        </button>
      )
    }
  }

  let bidFormElement = null
  if (listing.status === 'Active') {
    bidFormElement = (
      <BidForm listing={listing} onBidPlaced={onBidPlaced} />
    )
  }

  let countdownElement = null
  if (listing.status === 'Active') {
    countdownElement = (
      <div className='countdown-hero'>
        <span className='countdown-label'>AUCTION CLOSES IN</span>
        <div className='countdown-timer'>
          <span className='timer-icon'>⏱</span>
          <CountDown
            startsAt={listing.startsAt}
            endsAt={listing.endsAt}
            onEnd={onAuctionEnd}
          />
        </div>
      </div>
    )
  }

  let soldNotice = null
  if (listing.status === 'Sold') {
    soldNotice = (
      <div className='status-banner ok'>
        Sold to {winnerText} for BD {listing.currentBid}
      </div>
    )
  }

  let closedNotice = null
  if (listing.status === 'Closed') {
    closedNotice = (
      <div className='status-banner muted'>
        Auction ended with no bids
      </div>
    )
  }

  let buyNowSpec = null
  if (listing.buyNowPrice) {
    buyNowSpec = <p>Buy now: BD {listing.buyNowPrice}</p>
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
            {buyNowSpec}
            <p>Starts at: {formatDate(listing.startsAt)}</p>
            <p>Ends at: {formatDate(listing.endsAt)}</p>
            <p>Seller: {seller}</p>
          </div>
        </details>

        <BidHistory listingId={listing._id} currentBid={listing.currentBid} />
      </div>

      <div className='listing-side-col'>
        {countdownElement}

        <h1 className='listing-title'>{listing.title}</h1>

        <div className='current-bid-box'>
          <span className='bid-label'>CURRENT BID</span>
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
          <EditButton listing={listing} user={user} />
          <ReportButton listing={listing} />
        </div>
      </div>
    </div>
  )
}

export default AuctionDetails
