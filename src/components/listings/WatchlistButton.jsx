import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { addToWatchlist, getWatchlist, removeFromWatchlist } from '../../services/watchlistService'

// Add / Remove button for the details pages. Logged-out users are sent to sign in; sellers do not see it on their own listing.
function WatchlistButton({ listing, user }) {
  const navigate = useNavigate()
  const [watching, setWatching] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const isOwner = Boolean(user && listing.seller && String(listing.seller._id || listing.seller) === String(user._id))

  // Find out if this listing is already on the user's watchlist
  useEffect(() => {
    if (!user || isOwner) return

    let cancelled = false

    async function checkWatching() {
      try {
        const list = await getWatchlist()
        if (!cancelled) setWatching(list.some((item) => item._id === listing._id))
      } catch (err) {
        console.log(err)
      }
    }

    checkWatching()

    return () => {
      cancelled = true
    }
  }, [user, isOwner, listing._id])

  if (isOwner) return null

  async function handleClick() {
    if (!user) {
      navigate('/sign-in')
      return
    }

    setBusy(true)
    setError('')

    try {
      if (watching) {
        await removeFromWatchlist(listing._id)
        setWatching(false)
      } else {
        await addToWatchlist(listing._id)
        setWatching(true)
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setBusy(false)
    }
  }

  let label = 'Add to watchlist'
  if (watching) label = 'Remove from watchlist'

  let buttonClass = 'btn-watchlist'
  if (watching) buttonClass += ' btn-watchlist--on'

  return (
    <>
      <button
        type='button'
        className={buttonClass}
        onClick={handleClick}
        disabled={busy}
        aria-pressed={watching}
      >
        {label}
      </button>
      {error && <span className='watchlist-error' role='alert'>{error}</span>}
    </>
  )
}

export default WatchlistButton
