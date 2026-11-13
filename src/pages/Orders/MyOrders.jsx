import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getOrders } from '../../services/orderService'

function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getOrders()
        setOrders(data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) {
    return <h2>Loading ..</h2>
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1>My Orders</h1>
        <p>No orders found</p>
      </div>
    )
  }

  return (
    <div>
      <h1>My Orders</h1>
      <ul>
        {orders.map((order) => {
          let title = 'Item'
          let categoryName = ''

          if (order.listing) {
            title = order.listing.title

            if (order.listing.category) {
              if (order.listing.category.name) {
                categoryName = order.listing.category.name
              } else {
                categoryName = order.listing.category
              }
            }
          }

          let sellerName = 'Unknown'
          if (order.seller) {
            sellerName = order.seller.username
          }

          let buyerName = 'Unknown'
          if (order.buyer) {
            buyerName = order.buyer.username
          }

          let categoryLine = null
          if (categoryName) {
            categoryLine = <p>Category: {categoryName}</p>
          }

          return (
            <li key={order._id}>
              <h1>Listing: {title}</h1>

              {categoryLine}

              <p>Price: ${order.finalPrice}</p>

              <p>Status: {order.statues}</p>
              <p>Seller: {sellerName}</p>

              <p>Buyer: {buyerName}</p>
             <Link to={`/orders/${order._id}`}>View Details</Link>
            </li>
            
          )
        })}
      </ul>
    </div>
  )
}

export default MyOrders