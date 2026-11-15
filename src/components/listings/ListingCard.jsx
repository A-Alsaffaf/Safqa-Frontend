import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

function formatAuctionTime(endsAt, now) {
  if (!endsAt) return ''
  const end = new Date(endsAt).getTime()
  if (Number.isNaN(end)) return ''
  const diff = end - now
  if (diff <= 0) return 'Ended'

  const totalMinutes = Math.floor(diff / 60000)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60

  if (days > 0) {
    return days + 'd ' + hours + 'h'
  }
  if (hours > 0) {
    return hours + 'h ' + minutes + 'm'
  }
  return minutes + 'm'
}

function ListingCard({ listing }) {
  const navigate = useNavigate()
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (listing.type !== 'Auction') return
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [listing.type])

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
    imageElement = <img src={imageUrl} alt={listing.title} />
  }

  let bidsCount = 0
  if (listing.bidCount != null) {
    bidsCount = listing.bidCount
  } else if (listing.bids && listing.bids.length) {
    bidsCount = listing.bids.length
  } else if (listing.currentBid != null) {
    bidsCount = 1
  }

  let auctionBadge = null
  if (listing.type === 'Auction' && listing.endsAt) {
    const timeText = formatAuctionTime(listing.endsAt, now)
    if (timeText) {
      auctionBadge = (
        <div className='auction-time-badge'>
          <span className='auction-time-badge-left'>
            <svg
              className='auction-time-badge-icon'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='12' cy='12' r='10' />
              <polyline points='12 6 12 12 16 14' />
            </svg>
            <span>{timeText}</span>
          </span>
          <span className='auction-time-badge-divider'>|</span>
          <span className='auction-time-badge-right'>
            <svg
              className='auction-time-badge-icon'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
              <circle cx='9' cy='7' r='4' />
            </svg>
            <span>{bidsCount}</span>
          </span>
        </div>
      )
    }
  }

  function handleCardClick() {
    navigate('/listings/' + listing._id)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      navigate('/listings/' + listing._id)
    }
  }

  return (
    <div
      className='listing-card'
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role='button'
      tabIndex={0}
    >
      <div className='listing-card-media'>
        {imageElement}
        {auctionBadge}
      </div>
      <h3>{listing.title}</h3>
      <p>Type: {listing.type}</p>
      <p>Condition: {listing.condition}</p>
      <p>{priceLabel}: BD {priceValue}</p>
    </div>
  )
}

export default ListingCard