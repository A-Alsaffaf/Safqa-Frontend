import { NavLink, useLocation } from 'react-router'

function Navbar({ user = null, handleLogout }) {
  const { pathname } = useLocation()
  const onSellPage = pathname === '/listings/new'

  const linkClass = ({ isActive }) => {
    if (isActive) {
      return 'navbar__link navbar__link--active'
    }
    return 'navbar__link'
  }

  const browseClass = ({ isActive }) => {
    const isBrowseActive = Boolean(isActive && !onSellPage)
    return linkClass({ isActive: isBrowseActive })
  }

  return (
    <header className='navbar'>
      <div className='navbar__inner'>
        <NavLink to='/' className='navbar__logo'>
          Safqa
        </NavLink>

        <nav className='navbar__links' aria-label='Main'>
          <NavLink to='/' end className={linkClass}>
            Home
          </NavLink>
          <NavLink to='/listings' className={browseClass}>
            Browse
          </NavLink>
          <NavLink to='/listings/new' end className={linkClass}>
            Sell
          </NavLink>
        </nav>

        <input
          type='search'
          className='navbar__search'
          placeholder='Search laptops, furniture, cars...'
          aria-label='Search'
        />

        {Boolean(user) && (
          <>
            <NavLink to='/account' className='navbar__user'>
              {user.username}
            </NavLink>
            <button
              type='button'
              className='navbar__logout'
              onClick={handleLogout}
            >
              Log out
            </button>
          </>
        )}
        {/* Logged out: one button. The log in page has the Register switch for new users */}
        {!user && (
          <NavLink to='/sign-in' className='navbar__login'>
            Log in
          </NavLink>
        )}
      </div>
    </header>
  )
}

export default Navbar
