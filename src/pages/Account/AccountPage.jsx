import { Link } from 'react-router'

// The account home. Links to the four sections of the logged-in user's account.
function AccountPage({ user }) {
  return (
    <div>
      <h1>My Account</h1>
      <p>Signed in as {user.username}</p>

      <ul>
        <li>
          <Link to='/account/orders'>My Orders</Link>
        </li>
        <li>
          <Link to='/account/listings'>My Listings</Link>
        </li>
        <li>
          <Link to='/account/watchlist'>Watchlist</Link>
        </li>
        <li>
          <Link to='/account/bids'>My Bids</Link>
        </li>
      </ul>
    </div>
  )
}

export default AccountPage
