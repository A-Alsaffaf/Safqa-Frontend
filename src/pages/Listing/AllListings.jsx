import { useEffect, useState } from 'react'
import { getListings } from '../../services/listingService'
import ListingGrid from '../../components/listings/ListingGrid'

const TYPE_OPTIONS = ['All types', 'Fixed', 'Auction']
const CATEGORY_OPTIONS = [
  'All categories',
  'Electronics',
  'Watches',
  'Vehicles',
  'Fashion',
  'Home & Furniture',
  'Jewelry & Accessories',
  'Collectibles & Art',
  'Sports & Outdoors',
  'Real Estate',
  'Books & Media'
]

function AllListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [typeFilter, setTypeFilter] = useState('All types')
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [isOpen, setIsOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    getListings()
      .then((data) => {
        if (!data) return
        setListings(data)
      })
      .catch((err) => {
        console.log(err)
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const pollTimer = setInterval(() => {
      getListings()
        .then((data) => {
          if (!data) return
          setListings(data)
        })
        .catch(() => {})
    }, 2000)
    return () => clearInterval(pollTimer)
  }, [])

  function toggleDrawer() {
    setIsOpen(!isOpen)
  }

  function closeDrawer() {
    setIsOpen(false)
  }

  function resetFilters() {
    setTypeFilter('All types')
    setCategoryFilter('All categories')
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const unexpiredListings = listings.filter((item) => {
    if (item.status === 'Closed' || item.status === 'Removed') {
      return false
    }
    if (item.status === 'Sold' || item.status === 'sold') {
      if (!item.updatedAt) {
        return false
      }
      const soldTime = new Date(item.updatedAt).getTime()
      if (Number.isNaN(soldTime)) {
        return false
      }
      const elapsed = currentTime - soldTime
      if (elapsed >= 10000) {
        return false
      }
    }
    return true
  })

  const enrichedListings = unexpiredListings.map((item) => {
    if (item.status === 'Sold' || item.status === 'sold') {
      let remaining = 10
      if (item.updatedAt) {
        const soldTime = new Date(item.updatedAt).getTime()
        if (!Number.isNaN(soldTime)) {
          const elapsed = currentTime - soldTime
          const positiveElapsed = Math.max(0, elapsed)
          remaining = Math.max(0, Math.ceil((10000 - positiveElapsed) / 1000))
        }
      }
      return {
        ...item,
        isSold: true,
        secondsRemaining: remaining
      }
    }
    return item
  })

  let filtered = enrichedListings
  if (typeFilter !== 'All types') {
    filtered = filtered.filter((l) => l.type === typeFilter)
  }

  if (categoryFilter !== 'All categories') {
    filtered = filtered.filter((l) => {
      if (!l.category) return false
      return l.category.some((c) => {
        if (typeof c === 'string') {
          return c.toLowerCase() === categoryFilter.toLowerCase()
        }
        if (c && c.name) {
          return c.name.toLowerCase() === categoryFilter.toLowerCase()
        }
        return false
      })
    })
  }

  let content = <ListingGrid listings={filtered} />
  if (filtered.length === 0) {
    content = (
      <div className='listings-empty-state'>
        <p>No listings match your filters</p>
        <button
          type='button'
          className='btn-reset-filter'
          onClick={resetFilters}
        >
          Reset Filters
        </button>
      </div>
    )
  }

  const countText = filtered.length + ' listings'

  let stageClass = 'stage'
  if (isOpen) {
    stageClass = 'stage is-open'
  }

  return (
    <div className={stageClass}>
      <div className='overlay' onClick={closeDrawer} />
      <aside className='drawer'>
        <div className='listings-sidebar-header'>
          <h2 className='listings-filter-title'>Browse listings</h2>
          <button
            type='button'
            className='btn-sidebar-close'
            onClick={closeDrawer}
            title='Close filters'
          >
            ✕
          </button>
        </div>
        <div className='listings-filter-card'>
          <h3 className='listings-filter-heading'>Listing Type</h3>
          <div className='listings-filter-group'>
            {TYPE_OPTIONS.map((opt) => (
              <label key={opt} className='listings-filter-option'>
                <input
                  type='radio'
                  name='listingType'
                  value={opt}
                  checked={typeFilter === opt}
                  onChange={() => setTypeFilter(opt)}
                  className='listings-filter-radio'
                />
                <span className='listings-filter-option-text'>{opt}</span>
              </label>
            ))}
          </div>

          <h3 className='listings-filter-heading listings-filter-heading--category'>Category</h3>
          <div className='listings-filter-group'>
            {CATEGORY_OPTIONS.map((opt) => (
              <label key={opt} className='listings-filter-option'>
                <input
                  type='radio'
                  name='listingCategory'
                  value={opt}
                  checked={categoryFilter === opt}
                  onChange={() => setCategoryFilter(opt)}
                  className='listings-filter-radio'
                />
                <span className='listings-filter-option-text'>{opt}</span>
              </label>
            ))}
          </div>

          <button
            type='button'
            className='listings-filter-clear-btn'
            onClick={resetFilters}
          >
            Clear filters
          </button>
        </div>
      </aside>

      <section className='listings-catalog-main'>
        <div className='listings-catalog-header'>
          <h1 className='listings-catalog-title'>All Listings</h1>
          <div className='listings-catalog-header-right'>
            <button
              type='button'
              className='btn-toggle-filters'
              onClick={toggleDrawer}
              aria-label='Filter listings'
              title='Filter listings'
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 20 20'
                fill='#FFFFFF'
              >
                <path
                  fillRule='evenodd'
                  d='M2.628 1.601C5.028 1.206 7.49 1 10 1s4.972.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
            <span className='listings-count-badge'>{countText}</span>
          </div>
        </div>
        {content}
      </section>
    </div>
  )
}

export default AllListings