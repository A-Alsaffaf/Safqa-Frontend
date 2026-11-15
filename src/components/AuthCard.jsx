import { NavLink } from 'react-router'

// Shared shell for the sign-in and sign-up pages: title, Log in / Register
// toggle, and an error area. The toggle is a pair of links so each mode keeps
// its own URL (/sign-in, /sign-up) and the browser back button works.
function AuthCard({ title, error, children }) {
  return (
    <main className='auth-page'>
      <div className='auth-card'>
        <h1 className='auth-card__title'>{title}</h1>

        <nav className='auth-tabs' aria-label='Account'>
          <NavLink to='/sign-in' className='auth-tabs__tab'>
            Log in
          </NavLink>
          <NavLink to='/sign-up' className='auth-tabs__tab'>
            Register
          </NavLink>
        </nav>

        {error ? (
          <p className='auth-card__error' role='alert'>
            {error}
          </p>
        ) : null}

        {children}
      </div>
    </main>
  )
}

export default AuthCard
