import { NavLink, useLocation } from "react-router";

function Navbar({ user = null }) {
  const { pathname } = useLocation();
  const onSellPage = pathname === "/listings/new";

  const linkClass = ({ isActive }) =>
    isActive ? "navbar__link navbar__link--active" : "navbar__link";

  // Browse matches every /listings/... path, so skip it on the Sell page.
  const browseClass = ({ isActive }) =>
    linkClass({ isActive: isActive && !onSellPage });

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__logo">
          Safqa
        </NavLink>

        <nav className="navbar__links" aria-label="Main">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/listings" className={browseClass}>
            Browse
          </NavLink>
          <NavLink to="/listings/new" end className={linkClass}>
            Sell
          </NavLink>
        </nav>

        <input
          type="search"
          className="navbar__search"
          placeholder="Search laptops, furniture, cars..."
          aria-label="Search"
        />

        {user ? (
          <button type="button" className="navbar__user">
            {user.username}
          </button>
        ) : (
          <NavLink to="/sign-in" className="navbar__login">
            Log in
          </NavLink>
        )}
      </div>
    </header>
  );
}

export default Navbar;
