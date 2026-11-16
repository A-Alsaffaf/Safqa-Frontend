import { Link, NavLink } from 'react-router'
import SafqaLogo from './SafqaLogo'

// Shared shell for the sign-in and sign-up pages. Left: the brand panel with the
// animated logo. Right: the card with the title, Log in / Register switch, error
// area and the form. The switch is a pair of links so each mode keeps its own URL
// (/sign-in, /sign-up) and the browser back button works.
function AuthCard({ title, subtitle, error, children }) {
  return (
    <main className='auth-page'>
      <section className='auth-brand' aria-label='Safqa'>
        <Link to='/' className='auth-brand__wordmark'>
          Safqa
        </Link>

        <div className='auth-brand__logo'>
          <SafqaLogo />
        </div>

        <p className='auth-brand__line'>
          Used goods, sold in Bahrain. Fixed deals and live auctions.
        </p>
      </section>

      <section className='auth-side'>
        <div className='auth-card'>
          <div className='auth-card__head'>
            <h1 className='auth-card__title'>{title}</h1>
            {subtitle ? <p className='auth-card__subtitle'>{subtitle}</p> : null}
          </div>

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
      </section>
    </main>
  )
}

export default AuthCard
