import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../Button/Button'
import './Navbar.css'

const Navbar = ({ isAuth = false }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  
  const location = useLocation()

  // Auto-detect auth state for dummy purposes based on route
  const authRoutes = ['/dashboard', '/add-entry', '/edit-entry', '/profile']
  const effectivelyAuth = isAuth || authRoutes.some(route => location.pathname.includes(route))

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${effectivelyAuth ? 'navbar--auth' : ''}`} aria-label="Main Navigation">
      <div className="container navbar__container">
        
        <div className="flex items-center gap-4">
          {/* Mobile Sidebar Toggle (Only in Auth) */}
          {effectivelyAuth && (
            <button className="navbar__hamburger hide-desktop" aria-label="Toggle Sidebar">
              {/* Note: In a real app this would control global sidebar state via context */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}

          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <div className="navbar__logo-icon gradient-border">
              <span>D</span>
            </div>
            <span className="navbar__logo-text">DevDiary</span>
          </Link>
        </div>

        {/* =========================================
            Authenticated View
            ========================================= */}
        {effectivelyAuth ? (
          <div className="navbar__actions">
            {/* Search Icon (UI Only) */}
            <button className="navbar__icon-btn hide-sm" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>

            {/* Notification Icon (UI Only) */}
            <button className="navbar__icon-btn relative" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="navbar__badge"></span>
            </button>

            {/* User Avatar & Dropdown */}
            <div className="navbar__profile-wrap">
              <button 
                className="navbar__avatar border-primary focus-ring"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=3B82F6" alt="User avatar" />
              </button>
              
              {profileOpen && (
                <div className="navbar__dropdown glass-card animate-fadeInUp">
                  <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.08)]">
                    <p className="text-sm font-semi">John Doe</p>
                    <p className="text-xs text-muted">john@example.com</p>
                  </div>
                  <div className="py-2 flex-col">
                    <Link to="/profile" className="navbar__dropdown-item">Profile Settings</Link>
                    <Link to="/dashboard" className="navbar__dropdown-item">Dashboard</Link>
                    <div className="divider my-1"></div>
                    <Link to="/login" className="navbar__dropdown-item text-error">Logout</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
        /* =========================================
            Public View
            ========================================= */
          <>
            {/* Desktop Links */}
            <div className="navbar__links hide-md">
              <Link to="/" className="navbar__link">Home</Link>
              <a href="#features" className="navbar__link">Features</a>
              <a href="#how-it-works" className="navbar__link">How it Works</a>
            </div>

            {/* Desktop CTA */}
            <div className="navbar__actions hide-md">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">Register</Button>
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button 
              className="navbar__hamburger hide-desktop"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Dropdown (Public only) */}
      {mobileOpen && !effectivelyAuth && (
        <div className="navbar__mobile-menu glass-card-solid animate-fadeInDown">
          <Link to="/" className="navbar__link" onClick={() => setMobileOpen(false)}>Home</Link>
          <a href="#features" className="navbar__link" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#how-it-works" className="navbar__link" onClick={() => setMobileOpen(false)}>How it Works</a>
          <div className="divider"></div>
          <Link to="/login" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" className="w-full mb-4">Login</Button>
          </Link>
          <Link to="/register" onClick={() => setMobileOpen(false)}>
            <Button variant="primary" className="w-full">Register</Button>
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar
