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
          let photoUrl = ''

          if (order.listing) {
            title = order.listing.title

            if (order.listing.images && order.listing.images.length > 0) {
              photoUrl = order.listing.images[0]
            }

            if (order.listing.category) {
              if (order.listing.category[0]) {
                categoryName = order.listing.category[0].name
              } else if (order.listing.category.name) {
                categoryName = order.listing.category.name
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

          let imageTag = null
          if (photoUrl) {
            imageTag = <img src={photoUrl} alt={title} />
          }

          return (
            <li key={order._id}>
              <Link to={`/orders/${order._id}`} className='order-card-link'>
                <div className='order-card-image'>
                  {imageTag}
                  <div className='order-card-overlay'>
                    <div className='order-card-info'>
                      {categoryLine}
                      <p>Price: ${order.finalPrice}</p>
                      <p>Status: {order.statues}</p>
                      <p>Seller: {sellerName}</p>
                      <p>Buyer: {buyerName}</p>
                    </div>
                  </div>
                </div>
                <h1>Listing: {title}</h1>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default MyOrders
