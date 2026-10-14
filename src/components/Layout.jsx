import { NavLink, Outlet } from 'react-router-dom';

function Layout() {
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/pets', label: 'Pets' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/account', label: 'Account' },
  ];

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="container nav">
          <NavLink className="brand" to="/">
            <span className="brand-mark">🐾</span>
            <span>Pawfect Match</span>
          </NavLink>

          <nav className="nav-links" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <NavLink className="primary-btn" to="/pets">
            Adopt Now
          </NavLink>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <div className="brand footer-brand">
              <span className="brand-mark">🐾</span>
              <span>Pawfect Match</span>
            </div>
            <p>Helping pets find warm homes and loving families.</p>
          </div>

          <div className="footer-links">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
