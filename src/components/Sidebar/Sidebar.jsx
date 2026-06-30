import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = () => {
  const location = useLocation()
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
    )},
    { name: 'My Entries', path: '/entries', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
    )},
    { name: 'Add Entry', path: '/add-entry', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
    )},
    { name: 'Profile', path: '/profile', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    )},
  ]

  return (
    <aside className="sidebar glass-card-solid" aria-label="Sidebar Navigation">
      <div className="sidebar__inner flex-col h-full justify-between">
        
        <div className="sidebar__nav flex-col gap-2 p-4">
          <p className="text-xs font-semi text-muted uppercase tracking-wide px-3 mb-2">Menu</p>
          
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/entries' && location.pathname.startsWith('/edit-entry'))
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              >
                <span className="sidebar__icon">{item.icon}</span>
                <span className="sidebar__text">{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="sidebar__footer p-4">
          <div className="divider my-4"></div>
          <Link to="/login" className="sidebar__link text-muted hover-lift">
            <span className="sidebar__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </span>
            <span className="sidebar__text">Logout</span>
          </Link>
        </div>
        
      </div>
    </aside>
  )
}

export default Sidebar
