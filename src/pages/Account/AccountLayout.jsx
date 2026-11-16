import { NavLink, Outlet } from 'react-router'

// Shared frame for the account tabs (My bids, Watchlist, My listings, My orders, and Reports and Categories for admins): header, log out and the tab bar.
function AccountLayout({ user, handleLogout }) {
  const tabClass = ({ isActive }) => {
    if (isActive) {
      return 'account-tab account-tab--active'
    }
    return 'account-tab'
  }

  return (
    <div className='account'>
      <div className='account-header'>
        <div>
          <h1>@{user.username}</h1>
          <p>My account</p>
        </div>
        <button type='button' className='account-logout' onClick={handleLogout}>
          Log out
        </button>
      </div>

      <nav className='account-tabs' aria-label='Account'>
        <NavLink to='/account/bids' className={tabClass}>
          My bids
        </NavLink>
        <NavLink to='/account/watchlist' className={tabClass}>
          Watchlist
        </NavLink>
        <NavLink to='/account/listings' className={tabClass}>
          My listings
        </NavLink>
        <NavLink to='/account/orders' className={tabClass}>
          My orders
        </NavLink>
        {/* Admin only: the backend checks the role as well, this just hides the tabs */}
        {user.role === 'Admin' && (
          <>
            <NavLink to='/account/reports' className={tabClass}>
              Reports
            </NavLink>
            <NavLink to='/account/categories' className={tabClass}>
              Categories
            </NavLink>
          </>
        )}
      </nav>

      <Outlet />
    </div>
  )
}

export default AccountLayout
