import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getWatchlist, removeFromWatchlist } from '../../services/watchlistService'

// The listings the logged-in user is watching, one row each, with a Remove button.
function AccountWatchlist() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // Taken once when the page opens, so the rows do not need timers
  const [now] = useState(() => Date.now())

  useEffect(() => {
    let cancelled = false

    async function fetchWatchlist() {
      try {
        const data = await getWatchlist()
        if (!cancelled) setListings(data)
      } catch (err) {
        console.log(err)
        if (!cancelled) setError(err.response?.data?.message || err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchWatchlist()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleRemove(listingId) {
    setError('')

    try {
      await removeFromWatchlist(listingId)
      setListings(listings.filter((listing) => listing._id !== listingId))
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    }
  }

  function formatPrice(value) {
    return `BD ${Number(value).toFixed(3)}`
  }

  // Auctions show the current bid (or the starting bid), fixed price listings show the price
  function priceText(listing) {
    if (listing.type === 'Auction') {
      if (listing.currentBid != null) return `Current ${formatPrice(listing.currentBid)}`
      return `Starting ${formatPrice(listing.startingBid)}`
    }
    return formatPrice(listing.price)
  }

  const HOUR = 60 * 60 * 1000

  // How close an active auction is to ending: under 1h red, under 12h orange, under 24h yellow
  function urgency(listing) {
    if (listing.type !== 'Auction' || listing.status !== 'Active' || !listing.endsAt) return null

    const remaining = new Date(listing.endsAt).getTime() - now

    if (remaining <= 0) return null
    if (remaining < HOUR) return { level: 'red', text: 'Under 1h left' }
    if (remaining < 12 * HOUR) return { level: 'orange', text: 'Under 12h left' }
    if (remaining < 24 * HOUR) return { level: 'yellow', text: 'Under 24h left' }
    return null
  }

  function statusText(listing) {
    if (listing.status === 'Active') {
      if (listing.type === 'Auction' && listing.endsAt) {
        const date = new Date(listing.endsAt)
        const day = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
        const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
        return `Ends ${day}, ${time}`
      }
      return 'Available'
    }
    return listing.status
  }

  if (loading) {
    return (
      <div className='account-panel'>
        <p>Loading ..</p>
      </div>
    )
  }

  let errorLine = null
  if (error) {
    errorLine = <p className='account-error'>{error}</p>
  }

  if (listings.length === 0) {
    return (
      <>
        {errorLine}
        <div className='account-panel'>
          <p>
            Your watchlist is empty. <Link to='/listings'>Browse listings</Link>
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      {errorLine}

      <ul className='account-panel account-list'>
        {listings.map((listing) => {
          const urgent = urgency(listing)

          let urgencyTag = null
          if (urgent) {
            urgencyTag = (
              <span className={`account-urgency account-urgency--${urgent.level}`}>
                <svg viewBox='0 0 24 24' width='12' height='12' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                  <circle cx='12' cy='12' r='9' />
                  <path d='M12 7v5l3 2' />
                </svg>
                {urgent.text}
              </span>
            )
          }

          return (
            <li key={listing._id} className='account-row'>
              <div className='account-row__main'>
                {/* Links sit inside a span: a global rule styles any div whose direct child links to /listings/ as a card */}
                <span className='account-row__title'>
                  <Link to={`/listings/${listing._id}`}>{listing.title}</Link>
                </span>
                <span className='account-row__meta'>
                  {statusText(listing)}
                  {urgencyTag}
                  {' · '}{priceText(listing)}
                </span>
              </div>
              <div className='account-row__actions'>
                <button
                  type='button'
                  className='account-row__remove'
                  onClick={() => handleRemove(listing._id)}
                  aria-label={`Remove ${listing.title} from watchlist`}
                >
                  Remove
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default AccountWatchlist
