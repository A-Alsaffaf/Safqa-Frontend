import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { getOrderById, updateOrderStatus } from '../../services/orderService'
import { getMe } from '../../services/authService'

const ORDER_STEPS = [
  { key: 'Pending', label: 'Pending' },
  { key: 'Paid', label: 'Paid' },
  { key: 'Shipped', label: 'Shipped' },
  { key: 'Completed', label: 'Completed' }
]

const STATUS_OPTIONS = ['Paid', 'Shipped', 'Completed']

function OrderDetails({ user }) {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('Paid')
  const [feedback, setFeedback] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let roleFound = ''
    if (user && user.role) {
      roleFound = user.role
    } else {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const parsed = JSON.parse(atob(token.split('.')[1]))
          if (parsed && parsed.role) {
            roleFound = parsed.role
          }
        } catch (e) {
          console.log(e)
        }
      }
    }

    if (roleFound === 'Admin' || roleFound === 'admin') {
      setIsAdmin(true)
      return
    }

    const token = localStorage.getItem('token')
    if (token) {
      getMe()
        .then((userData) => {
          if (userData && (userData.role === 'Admin' || userData.role === 'admin')) {
            setIsAdmin(true)
          }
        })
        .catch(() => {})
    }
  }, [user])

  useEffect(() => {
    getOrderById(orderId)
      .then((data) => {
        setOrder(data)
        if (data && data.statues) {
          if (data.statues === 'Pendding') {
            setStatus('Paid')
          } else {
            setStatus(data.statues)
          }
        }
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [orderId])

  async function handleStatusSubmit(event) {
    event.preventDefault()
    setFeedback('')
    try {
      const response = await updateOrderStatus(orderId, status)
      setOrder(response.order)
      setFeedback('Status updated to ' + status)
    } catch (err) {
      console.log(err)
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className='order-page-wrapper'>
        <div className='order-feedback-box'>
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='order-page-wrapper'>
        <div className='order-feedback-box'>
          <h2>Error loading order</h2>
          <p>{error}</p>
          <Link to='/orders' className='order-back-link'>
            ← Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className='order-page-wrapper'>
        <div className='order-feedback-box'>
          <h2>Order Not Found</h2>
          <Link to='/orders' className='order-back-link'>
            ← Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  let title = 'Order Item'
  let descriptionText = 'No description provided for this listing.'
  let photoUrl = ''
  let condition = 'Used'
  let listingType = 'Fixed'
  let categoryName = 'General'

  if (order.listing) {
    if (order.listing.title) {
      title = order.listing.title
    }
    if (order.listing.description) {
      descriptionText = order.listing.description
    }
    if (order.listing.condition) {
      condition = order.listing.condition
    }
    if (order.listing.type) {
      listingType = order.listing.type
    }
    if (order.listing.images && order.listing.images.length > 0) {
      photoUrl = order.listing.images[0]
    }
    if (order.listing.category) {
      if (Array.isArray(order.listing.category) && order.listing.category.length > 0) {
        const cat = order.listing.category[0]
        if (typeof cat === 'object' && cat.name) {
          categoryName = cat.name
        } else if (typeof cat === 'string') {
          categoryName = cat
        }
      } else if (typeof order.listing.category === 'object' && order.listing.category.name) {
        categoryName = order.listing.category.name
      }
    }
  }

  let seller = 'Unknown'
  if (order.seller) {
    if (typeof order.seller === 'object' && order.seller.username) {
      seller = order.seller.username
    } else if (typeof order.seller === 'string') {
      seller = order.seller
    }
  }

  let buyer = 'Unknown'
  if (order.buyer) {
    if (typeof order.buyer === 'object' && order.buyer.username) {
      buyer = order.buyer.username
    } else if (typeof order.buyer === 'string') {
      buyer = order.buyer
    }
  }

  let rawStatus = 'Pending'
  if (order.statues) {
    rawStatus = order.statues
  }
  if (rawStatus === 'Pendding') {
    rawStatus = 'Pending'
  }

  let currentStepIndex = 0
  if (rawStatus === 'Paid') {
    currentStepIndex = 1
  } else if (rawStatus === 'Shipped') {
    currentStepIndex = 2
  } else if (rawStatus === 'Completed') {
    currentStepIndex = 3
  }

  let shortId = orderId
  if (orderId && orderId.length > 8) {
    shortId = '#' + orderId.slice(-8).toUpperCase()
  }

  let orderDate = 'Recent'
  if (order.createdAt) {
    const d = new Date(order.createdAt)
    if (!Number.isNaN(d.getTime())) {
      orderDate = d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }
  }

  let imageTag = null
  if (photoUrl) {
    imageTag = <img src={photoUrl} alt={title} />
  }

  let feedbackElement = null
  if (feedback) {
    feedbackElement = (
      <div className='order-feedback-alert'>
        <span>✓ {feedback}</span>
      </div>
    )
  }

  let updateStatusCard = null
  if (isAdmin) {
    updateStatusCard = (
      <form onSubmit={handleStatusSubmit} className='order-update-card'>
        <span className='order-section-subtitle'>Update Status</span>
        <div className='order-select-wrapper'>
          <select
            id='orderStatus'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className='order-status-select'
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <button type='submit' className='btn-submit-order-status'>
          Update Order Status
        </button>
        {feedbackElement}
      </form>
    )
  }

  return (
    <div className='order-page-wrapper'>
      <div className='order-top-nav'>
        <Link to='/orders' className='order-back-link'>
          ← Back to Orders
        </Link>
        <span className='order-ref-badge'>Order {shortId}</span>
      </div>

      <div className='listing-layout'>
        <div className='listing-main-col'>
          <div className='listing-gallery'>
            {imageTag}
          </div>

          <div className='listing-desc-card'>
            <h3>Listing Description</h3>
            <p>{descriptionText}</p>
          </div>

          <details className='listing-specs-accordion' open>
            <summary>Order Specifications</summary>
            <div className='specs-grid'>
              <p>Type: {listingType}</p>
              <p>Condition: {condition}</p>
              <p>Category: {categoryName}</p>
              <p>Order ID: {shortId}</p>
              <p>Placed: {orderDate}</p>
              <p>Current Status: {rawStatus}</p>
            </div>
          </details>
        </div>

        <div className='listing-side-col'>
          <div className='fixed-status-pill'>
            <span>ORDER STATUS: {rawStatus.toUpperCase()}</span>
          </div>

          <h1 className='listing-title'>{title}</h1>

          <div className='current-bid-box'>
            <span className='bid-label'>Final Transaction Price</span>
            <span className='bid-value'>BD {order.finalPrice}</span>
            <span className='bid-starting'>Amount: ${order.finalPrice} USD</span>
          </div>

          <div className='order-stepper-box'>
            <span className='order-section-subtitle'>Fulfillment Status</span>
            <div className='order-stepper-track'>
              {ORDER_STEPS.map((step, idx) => {
                let nodeClass = 'order-step-node'
                let labelClass = 'order-step-label'

                if (idx < currentStepIndex) {
                  nodeClass = 'order-step-node order-step-node--completed'
                  labelClass = 'order-step-label order-step-label--completed'
                } else if (idx === currentStepIndex) {
                  nodeClass = 'order-step-node order-step-node--active'
                  labelClass = 'order-step-label order-step-label--active'
                }

                let iconContent = idx + 1
                if (idx < currentStepIndex) {
                  iconContent = '✓'
                }

                return (
                  <div key={step.key} className='order-step-item'>
                    <div className={nodeClass}>{iconContent}</div>
                    <span className={labelClass}>{step.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className='order-parties-box'>
            <div className='order-party-item'>
              <span className='order-party-role'>Seller</span>
              <span className='order-party-name'>{seller}</span>
            </div>
            <div className='order-party-divider'></div>
            <div className='order-party-item'>
              <span className='order-party-role'>Buyer</span>
              <span className='order-party-name'>{buyer}</span>
            </div>
          </div>

          {updateStatusCard}
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
