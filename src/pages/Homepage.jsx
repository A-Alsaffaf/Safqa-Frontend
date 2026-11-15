import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getListings } from '../services/listingService'
import { getBidsByListing } from '../services/bidService'
import ListingCard from '../components/listings/ListingCard'

function Homepage() {
  const [listings, setListings] = useState([])
  const [bidCounts, setBidCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    getListings()
      .then((data) => {
        if (!data) return
        setListings(data)

        const auctionItems = data.filter((item) => item.type === 'Auction')
        const promises = auctionItems.map((item) => {
          return getBidsByListing(item._id)
            .then((bids) => {
              let count = 0
              if (bids && bids.length) {
                count = bids.length
              }
              return { id: item._id, count: count }
            })
            .catch(() => {
              let fallbackCount = 0
              if (item.currentBid != null) {
                fallbackCount = 1
              }
              return { id: item._id, count: fallbackCount }
            })
        })

        Promise.all(promises).then((results) => {
          const map = {}
          results.forEach((r) => {
            map[r.id] = r.count
          })
          setBidCounts(map)
        })
      })
      .catch((err) => {
        console.log(err)
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className='home-feedback-state'>
        <p>Loading marketplace...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='home-feedback-state'>
        <p>Error: {error}</p>
      </div>
    )
  }

  const enrichedListings = listings.map((l) => {
    if (l.type === 'Auction') {
      let count = 0
      if (bidCounts[l._id] != null) {
        count = bidCounts[l._id]
      } else if (l.currentBid != null) {
        count = 1
      }
      return { ...l, bidCount: count }
    }
    return l
  })

  const activeAuctions = enrichedListings.filter((l) => {
    if (l.type !== 'Auction') return false
    if (l.status && l.status !== 'Active') return false
    if (!l.endsAt) return false
    const end = new Date(l.endsAt).getTime()
    return end > now
  })

  const endingSoon = [...activeAuctions]
    .sort((a, b) => {
      const endA = new Date(a.endsAt).getTime()
      const endB = new Date(b.endsAt).getTime()
      return endA - endB
    })
    .slice(0, 4)

  const trendingAuctions = [...activeAuctions]
    .sort((a, b) => {
      return b.bidCount - a.bidCount
    })
    .slice(0, 4)

  const buyNowListings = enrichedListings
    .filter((l) => {
      if (l.type !== 'Fixed') return false
      if (l.status && l.status !== 'Active') return false
      return true
    })
    .slice(0, 4)

  let endingSoonContent = (
    <div className='home-empty-section'>
      <p>No active auctions ending soon</p>
    </div>
  )
  if (endingSoon.length > 0) {
    endingSoonContent = (
      <div className='home-cards-grid'>
        {endingSoon.map((item) => (
          <ListingCard key={item._id} listing={item} />
        ))}
      </div>
    )
  }

  let trendingContent = (
    <div className='home-empty-section'>
      <p>No trending auctions available right now</p>
    </div>
  )
  if (trendingAuctions.length > 0) {
    trendingContent = (
      <div className='home-cards-grid'>
        {trendingAuctions.map((item) => (
          <ListingCard key={item._id} listing={item} />
        ))}
      </div>
    )
  }

  let buyNowContent = (
    <div className='home-empty-section'>
      <p>No fixed-price products available right now</p>
    </div>
  )
  if (buyNowListings.length > 0) {
    buyNowContent = (
      <div className='home-cards-grid'>
        {buyNowListings.map((item) => (
          <ListingCard key={item._id} listing={item} />
        ))}
      </div>
    )
  }

  return (
    <div className='home-page-wrapper'>
      <section className='home-welcome-banner'>
        <h1 className='home-welcome-heading'>
          Welcome to <span className='home-welcome-logo'>صَفْقَةٌ</span>
        </h1>
        <p className='home-welcome-text'>
          Your marketplace for live auctions and instant buy deals in Bahrain
        </p>
        <div className='home-welcome-buttons'>
          <Link to='/listings' className='home-btn-explore'>
            Browse Listings
          </Link>
          <Link to='/listings/new' className='home-btn-sell'>
            Sell an Item
          </Link>
        </div>
      </section>

      <section className='home-field-section'>
        <div className='home-field-header'>
          <h2 className='home-field-title'>Auctions Ending Soon</h2>
          <Link to='/listings' className='home-field-link'>
            View all ›
          </Link>
        </div>
        {endingSoonContent}
      </section>

      <section className='home-field-section'>
        <div className='home-field-header'>
          <h2 className='home-field-title'>Trending Auctions</h2>
          <Link to='/listings' className='home-field-link'>
            View all ›
          </Link>
        </div>
        {trendingContent}
      </section>

      <section className='home-field-section'>
        <div className='home-field-header'>
          <h2 className='home-field-title'>Buy Now Products</h2>
          <Link to='/listings' className='home-field-link'>
            View all ›
          </Link>
        </div>
        {buyNowContent}
      </section>
    </div>
  )
}

export default Homepage
