import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { getOrderById, updateOrderStatus } from '../../services/orderService'

const STATUS_OPTIONS = ['Paid', 'Shipped', 'Completed']

function OrderDetails() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('Paid')

  useEffect(() => {
    getOrderById(orderId)
      .then((data) => {
        setOrder(data)
        if (data && data.statues) {
          setStatus(data.statues)
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
    try {
      const response = await updateOrderStatus(orderId, status)
      setOrder(response.order)
    } catch (err) {
      console.log(err)
      setError(err.message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!order) return <div>Order not found</div>

  let title = 'Item'
  if (order.listing && order.listing.title) {
    title = order.listing.title
  }

  let seller = 'Unknown'
  if (order.seller) {
    if (typeof order.seller === 'object') {
      seller = order.seller.username
    } else {
      seller = order.seller
    }
  }

  let buyer = 'Unknown'
  if (order.buyer) {
    if (typeof order.buyer === 'object') {
      buyer = order.buyer.username
    } else {
      buyer = order.buyer
    }
  }

  return (
    <div>
      <h1>Order Details</h1>
      <h2>Listing: {title}</h2>

      <p>Price: ${order.finalPrice}</p>
      <p>Current Status: {order.statues}</p>
      <p>Seller: {seller}</p>
      <p>Buyer: {buyer}</p>

      <form onSubmit={handleStatusSubmit}>
        <label htmlFor='orderStatus'>Update Status: </label>
        <select
          id='orderStatus'
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <button type='submit'>Submit</button>
      </form>

      <br />
      <Link to='/orders'>Back to Orders</Link>
    </div>
  )
}

export default OrderDetails