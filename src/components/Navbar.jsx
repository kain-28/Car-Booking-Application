import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { IoCarSport } from 'react-icons/io5'

export default function Navbar({ user, onLogout, onOpenAuth }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">
          <IoCarSport className="logo-icon" />
          Ришаб Каин
        </Link>
        <div className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className={pathname === '/' ? 'active' : ''} onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/listings" className={pathname === '/listings' ? 'active' : ''} onClick={() => setMobileOpen(false)}>Buy Cars</Link>
          <Link to="/sell" className={pathname === '/sell' ? 'active' : ''} onClick={() => setMobileOpen(false)}>Sell Car</Link>
          <Link to="/test-drive" className={pathname === '/test-drive' ? 'active' : ''} onClick={() => setMobileOpen(false)}>Test Drive</Link>
          <Link to="/compare" className={pathname === '/compare' ? 'active' : ''} onClick={() => setMobileOpen(false)}>Compare</Link>
          {user ? (
            <>
              <Link to="/dashboard" className={pathname === '/dashboard' ? 'active' : ''} onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <button onClick={() => { onLogout(); setMobileOpen(false); }} className="btn-sm" style={{ cursor: 'pointer' }}>Sign Out</button>
            </>
          ) : (
            <button onClick={() => { onOpenAuth('login'); setMobileOpen(false); }} className="nav-btn-primary">Sign In</button>
          )}
        </div>
        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
      {mobileOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '16px 24px', gap: '8px', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
          <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/listings" onClick={() => setMobileOpen(false)}>Buy Cars</Link>
          <Link to="/sell" onClick={() => setMobileOpen(false)}>Sell Car</Link>
          <Link to="/test-drive" onClick={() => setMobileOpen(false)}>Test Drive</Link>
          <Link to="/compare" onClick={() => setMobileOpen(false)}>Compare</Link>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <button onClick={() => { onLogout(); setMobileOpen(false); }}>Logout</button>
            </>
          ) : (
            <button onClick={() => { onOpenAuth('login'); setMobileOpen(false); }}>Sign In</button>
          )}
        </div>
      )}
    </nav>
  )
}
