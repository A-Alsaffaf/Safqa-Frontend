import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getMyListings, deleteListing } from '../../services/listingService'

// The logged-in seller's own listings, one row each, with Edit and Remove for active ones.
function MyListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState('')

  useEffect(() => {
    let cancelled = false

    async function fetchListings() {
      try {
        const data = await getMyListings()
        // The backend also returns removed listings, so hide them here
        const visible = data.filter((listing) => String(listing.status).toLowerCase() !== 'removed')
        if (!cancelled) setListings(visible)
      } catch (err) {
        console.log(err)
        if (!cancelled) setError(err.response?.data?.message || err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchListings()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleRemove(listing) {
    if (!window.confirm(`Remove "${listing.title}"?`)) return

    setError('')

    try {
      setRemovingId(listing._id)
      await deleteListing(listing._id)
      setListings(listings.filter((item) => item._id !== listing._id))
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || err.message)
    } finally {
      setRemovingId('')
    }
  }

  function formatPrice(value) {
    return `BD ${Number(value).toFixed(3)}`
  }

  // Fixed listings show their price, auctions show the current bid (or the starting bid before any bid)
  function priceText(listing) {
    if (listing.type === 'Auction') {
      if (listing.currentBid != null) return formatPrice(listing.currentBid)
      return formatPrice(listing.startingBid)
    }
    return formatPrice(listing.price)
  }

  function metaText(listing) {
    let text = `${listing.type} · ${listing.status}`
    if (listing.type === 'Auction') {
      if (listing.currentBid != null) {
        text += ' · current bid'
      } else {
        text += ' · starting bid'
      }
    }
    return text
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
            You have no listings yet. <Link to='/listings/new'>Create a listing</Link>
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
          let actions = null
          if (listing.status === 'Active') {
            actions = (
              <>
                <span>
                <Link
                  to={`/listings/${listing._id}/edit`}
                  className='account-icon-btn'
                  aria-label={`Edit ${listing.title}`}
                  title='Edit'
                >
                  <svg viewBox='0 0 24 24' width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                    <path d='M12 20h9' />
                    <path d='M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z' />
                  </svg>
                </Link>
                </span>
                <button
                  type='button'
                  className='account-icon-btn'
                  onClick={() => handleRemove(listing)}
                  disabled={removingId === listing._id}
                  aria-label={`Remove ${listing.title}`}
                  title='Remove'
                >
                  <svg viewBox='0 0 24 24' width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
                    <path d='M3 6h18' />
                    <path d='M8 6V4h8v2' />
                    <path d='M19 6l-1 14H6L5 6' />
                    <path d='M10 11v5M14 11v5' />
                  </svg>
                </button>
              </>
            )
          }

          return (
            <li key={listing._id} className='account-row'>
              <div className='account-row__main'>
                {/* Links sit inside a span: a global rule styles any div whose direct child links to /listings/ as a card */}
                <span className='account-row__title'>
                  <Link to={`/listings/${listing._id}`}>{listing.title}</Link>
                </span>
                <span className='account-row__meta'>{metaText(listing)}</span>
              </div>
              <span className='account-row__price'>{priceText(listing)}</span>
              <div className='account-row__actions'>{actions}</div>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default MyListings
