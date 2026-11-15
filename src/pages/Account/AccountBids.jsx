import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getMyBids } from '../../services/bidService'

// Small icons for the status chips (decorative: the status word is always shown next to them)
function ChipIcon({ status }) {
  const props = {
    viewBox: '0 0 24 24',
    width: 13,
    height: 13,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.4,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  }

  if (status === 'Winning') {
    return (
      <svg {...props}>
        <path d='M5 12.5l4.5 4.5L19 7.5' />
      </svg>
    )
  }

  if (status === 'Won') {
    return (
      <svg {...props}>
        <path d='M8 4h8v5a4 4 0 0 1-8 0Z' />
        <path d='M8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3' />
        <path d='M12 13v4M9 20h6' />
      </svg>
    )
  }

  if (status === 'Outbid') {
    return (
      <svg {...props}>
        <path d='M12 4l9 16H3Z' />
        <path d='M12 10v4M12 17.2v.1' />
      </svg>
    )
  }

  return (
    <svg {...props}>
      <path d='M6 6l12 12M18 6L6 18' />
    </svg>
  )
}

// The auctions the logged-in user has bid on, one row each, with a status chip: Winning, Outbid, Won or Lost.
function AccountBids({ user }) {
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // Taken once when the page opens, so the rows do not need timers
  const [now] = useState(() => Date.now())

  useEffect(() => {
    let cancelled = false

    async function fetchBids() {
      try {
        const data = await getMyBids()
        const visible = data.filter((entry) => entry.listing)
        if (!cancelled) setBids(visible)
      } catch (err) {
        console.log(err)
        if (!cancelled) setError(err.response?.data?.message || err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchBids()

    return () => {
      cancelled = true
    }
  }, [])

  function formatPrice(value) {
    return `BD ${Number(value).toFixed(3)}`
  }

  // Active auctions show the end date and time, ended ones only the date
  function endText(listing) {
    if (!listing.endsAt) return ''

    const date = new Date(listing.endsAt)

    if (listing.status === 'Active') {
      const day = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
      const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      return `Ends ${day}, ${time}`
    }

    return `Ended ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
  }

  const HOUR = 60 * 60 * 1000

  // How close an active auction is to ending: under 1h red, under 12h orange, under 24h yellow
  function urgency(listing) {
    if (listing.status !== 'Active' || !listing.endsAt) return null

    const remaining = new Date(listing.endsAt).getTime() - now

    if (remaining <= 0) return null
    if (remaining < HOUR) return { level: 'red', text: 'Under 1h left' }
    if (remaining < 12 * HOUR) return { level: 'orange', text: 'Under 12h left' }
    if (remaining < 24 * HOUR) return { level: 'yellow', text: 'Under 24h left' }
    return null
  }

  function bidStatus(listing) {
    const me = String(user._id)

    if (listing.status === 'Active') {
      if (String(listing.currentBidder) === me) return 'Winning'
      return 'Outbid'
    }

    if (listing.status === 'Sold' && String(listing.winner) === me) return 'Won'
    return 'Lost'
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

  if (bids.length === 0) {
    return (
      <>
        {errorLine}
        <div className='account-panel'>
          <p>
            You have not placed any bids yet. <Link to='/listings'>Browse listings</Link>
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      {errorLine}

      <ul className='account-panel account-list'>
        {bids.map(({ listing, myHighestBid }) => {
          const status = bidStatus(listing)
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
                  {endText(listing)}
                  {urgencyTag}
                  {' · '}Your bid {formatPrice(myHighestBid)}
                  {' · '}Current {formatPrice(listing.currentBid)}
                </span>
              </div>
              <span className={`account-chip account-chip--${status.toLowerCase()}`}>
                <ChipIcon status={status} />
                {status}
              </span>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default AccountBids
