import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import Button from '../../components/Button/Button'
import StatsCard from '../../components/StatsCard/StatsCard'
import './Profile.css'

// Mock Activity Entries Data
const mockActivities = [
  {
    id: 1,
    title: 'Understanding React Server Components',
    tech: 'React',
    date: 'Jun 28, 2026',
    description: 'Deep dive into RSC, server actions, and how they bridge client component hydration.',
    takeaways: 'RSC reduces client bundles.\nServer Actions handle form posts natively.\nHydration is selective.',
    resource: 'https://react.dev'
  },
  {
    id: 2,
    title: 'Mastering CSS Grid Subgrid',
    tech: 'CSS',
    date: 'Jun 26, 2026',
    description: 'Align nested children to parent grid columns to create clean multi-level grid alignments.',
    takeaways: 'Subgrid aligns across grid levels.\nPrevents manual track matching.\nSupports grid gap overrides.',
    resource: 'https://developer.mozilla.org'
  },
  {
    id: 3,
    title: 'Vite Plugin Transform Hooks',
    tech: 'Vite',
    date: 'Jun 22, 2026',
    description: 'Manipulating index HTML templates and source inputs inside Vite rollup-based bundler hooks.',
    takeaways: 'Rollup hooks drive Vite plugin transforms.\ntransformIndexHtml handles inject tags dynamically.',
    resource: 'https://vite.dev'
  },
  {
    id: 4,
    title: 'Express JWT Authorization Middleware',
    tech: 'Node.js',
    date: 'Jun 18, 2026',
    description: 'Building route authorization barriers using JSON Web Token verification methods in Express API servers.',
    takeaways: 'Access tokens belong in memory auth headers.\nHttpOnly secures refresh keys from access issues.',
    resource: 'https://expressjs.com'
  },
  {
    id: 5,
    title: 'Git Rebase vs Merge Best Practices',
    tech: 'Git',
    date: 'Jun 15, 2026',
    description: 'Maintaining a clean and linear git commit history tree through rebase instead of merge.',
    takeaways: 'Rebase rewrites local commits on top of target branch.\nNever force push onto shared repository trunks.',
    resource: 'https://git-scm.com'
  }
]

const Profile = () => {
  const navigate = useNavigate()

  // User details state
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Full-stack developer passionate about building clean, accessible user interfaces and exploring new JavaScript frameworks.',
    joined: 'Oct 01, 2025'
  })

  // Modal display states
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [viewEntry, setViewEntry] = useState(null)

  // Form states
  const [profileForm, setProfileForm] = useState({ name: '', email: '', bio: '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })

  // Toast notifications
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)

  // Inline Validation States
  const [profileErrors, setProfileErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 2500)
  }

  // --- Profile Edit Handlers ---
  const handleEditProfileClick = () => {
    setProfileForm({
      name: user.name,
      email: user.email,
      bio: user.bio
    })
    setProfileErrors({})
    setShowEditProfile(true)
  }

  const handleProfileFormChange = (e) => {
    const { name, value } = e.target
    setProfileForm(prev => ({ ...prev, [name]: value }))
    if (profileErrors[name]) {
      setProfileErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleProfileSave = (e) => {
    e.preventDefault()
    
    // Validations
    const errors = {}
    if (!profileForm.name.trim()) errors.name = 'Full Name is required'
    if (!profileForm.email.trim()) {
      errors.email = 'Email Address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      errors.email = 'Invalid email address format'
    }

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors)
      return
    }

    setUser(prev => ({
      ...prev,
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
      bio: profileForm.bio.trim()
    }))

    setShowEditProfile(false)
    triggerToast('Profile updated successfully!')
  }

  // --- Password Handlers ---
  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({ ...prev, [name]: value }))
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handlePasswordSave = (e) => {
    e.preventDefault()

    const errors = {}
    if (!passwordForm.current) errors.current = 'Current password is required'
    if (!passwordForm.new) errors.new = 'New password is required'
    if (!passwordForm.confirm) {
      errors.confirm = 'Please confirm new password'
    } else if (passwordForm.new !== passwordForm.confirm) {
      errors.confirm = 'New passwords do not match'
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors)
      return
    }

    setPasswordForm({ current: '', new: '', confirm: '' })
    setShowChangePassword(false)
    triggerToast('Password changed successfully!')
  }

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <>
      <Navbar isAuth={true} />
      
      <div className="page-with-sidebar" id="profile-page">
        <Sidebar />
        
        <main className="main-content">
          <div className="container-wide">
            
            <div className="profile-container">
              
              {/* --- Page Header --- */}
              <header className="dashboard-header mb-8 animate-fadeIn">
                <div className="flex items-center gap-2 text-sm text-primary font-semi mb-3">
                  <Link to="/dashboard" className="hover:text-primary-light transition-colors">Dashboard</Link>
                  <span className="text-muted">/</span>
                  <span className="text-muted">Profile</span>
                </div>
                
                <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                <p className="text-muted">Manage your personal information and view your learning journey.</p>
              </header>

              {/* --- Grid Content --- */}
              <div className="profile-grid">
                
                {/* --- Left Column --- */}
                <div className="profile-left-col">
                  
                  {/* User Profile Info Card */}
                  <div className="user-card glass-card-solid animate-fadeInUp">
                    <div className="avatar-wrapper">
                      <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=3B82F6" 
                        alt="Profile Avatar" 
                        className="profile-avatar"
                      />
                    </div>
                    
                    <h2 className="user-name">{user.name}</h2>
                    <p className="user-email">{user.email}</p>
                    
                    <div className="user-meta-list">
                      <div className="user-meta-item">
                        <span className="user-meta-label">Joined</span>
                        <span className="user-meta-value">{user.joined}</span>
                      </div>
                      <div className="user-meta-item">
                        <span className="user-meta-label">Journal Entries</span>
                        <span className="user-meta-value">128</span>
                      </div>
                    </div>

                    <div className="user-bio">
                      <h4 className="user-bio-title">Bio</h4>
                      <p>{user.bio || <span className="text-muted italic">No biography added yet.</span>}</p>
                    </div>

                    <div className="user-actions">
                      <Button variant="primary" onClick={handleEditProfileClick} className="w-full hover-lift">
                        Edit Profile
                      </Button>
                      <Button variant="outline" onClick={() => { setPasswordForm({ current: '', new: '', confirm: '' }); setPasswordErrors({}); setShowChangePassword(true); }} className="w-full hover-lift">
                        Change Password
                      </Button>
                      <Button variant="ghost" onClick={handleLogout} className="w-full text-error hover:bg-[rgba(239,68,68,0.06)] border-[rgba(239,68,68,0.2)]">
                        Logout
                      </Button>
                    </div>
                  </div>

                  {/* Achievements Badge Card */}
                  <div className="achievements-card glass-card-solid animate-fadeInUp delay-100">
                    <h3 className="text-lg font-bold">Achievements</h3>
                    <p className="text-xs text-muted mb-2">Milestones reached on DevDiary</p>
                    
                    <div className="achievements-grid">
                      
                      <div className="achievement-badge">
                        <div className="badge-icon-container badge-blue">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                        </div>
                        <span className="badge-name">First Entry</span>
                        <span className="badge-desc">Journey Began</span>
                      </div>

                      <div className="achievement-badge">
                        <div className="badge-icon-container badge-gold">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                        <span className="badge-name">7-Day Streak</span>
                        <span className="badge-desc">Consistency King</span>
                      </div>

                      <div className="achievement-badge">
                        <div className="badge-icon-container badge-purple">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                        </div>
                        <span className="badge-name">50 Entries</span>
                        <span className="badge-desc">Century Halfway</span>
                      </div>

                      <div className="achievement-badge">
                        <div className="badge-icon-container badge-cyan">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>
                        </div>
                        <span className="badge-name">React Explorer</span>
                        <span className="badge-desc">Hooked on Hooks</span>
                      </div>

                    </div>
                  </div>

                </div>

                {/* --- Right Column --- */}
                <div className="profile-right-col">
                  
                  {/* Stats Cards Section */}
                  <div className="stats-cards-grid">
                    <StatsCard 
                      title="Total Learning Entries" 
                      value="128" 
                      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>}
                      trend="up"
                      trendValue="12%"
                      className="animate-fadeInUp"
                    />
                    <StatsCard 
                      title="Favorite Technology" 
                      value="React.js" 
                      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"></line><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="4" y2="12"></line><line x1="20" y1="12" x2="22" y2="12"></line><line x1="6.34" y1="17.66" x2="4.93" y2="19.07"></line><line x1="19.07" y1="4.93" x2="17.66" y2="6.34"></line></svg>}
                      className="animate-fadeInUp delay-75"
                    />
                    <StatsCard 
                      title="Current Streak" 
                      value="8 Days" 
                      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>}
                      trend="up"
                      trendValue="1 Day"
                      className="animate-fadeInUp delay-100"
                    />
                    <StatsCard 
                      title="Entries This Month" 
                      value="28" 
                      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
                      trend="down"
                      trendValue="-3 entries"
                      className="animate-fadeInUp delay-150"
                    />
                  </div>

                  {/* Recent Activity Card */}
                  <div className="activity-card glass-card-solid animate-fadeInUp delay-200">
                    <h3 className="text-lg font-bold">Recent Learning Activity</h3>
                    <p className="text-xs text-muted">Your last five additions</p>
                    
                    <div className="activity-list">
                      {mockActivities.map((act) => (
                        <div key={act.id} className="activity-item">
                          <div className="activity-details">
                            <span className="activity-title truncate">{act.title}</span>
                            <div className="activity-meta">
                              <span className="badge badge-primary">{act.tech}</span>
                              <span className="activity-date">{act.date}</span>
                            </div>
                          </div>
                          <button 
                            type="button" 
                            className="btn btn-sm btn-outline hover-lift flex-shrink-0"
                            onClick={() => setViewEntry(act)}
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </main>
      </div>

      {/* --- Edit Profile Modal --- */}
      {showEditProfile && (
        <div className="overlay animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
          <div className="modal animate-scaleIn">
            <div className="modal-header">
              <h3 id="edit-profile-title" className="text-xl font-bold">Edit Profile</h3>
              <button type="button" className="btn-icon" onClick={() => setShowEditProfile(false)} aria-label="Close modal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form onSubmit={handleProfileSave} noValidate>
              <div className="modal-body flex-col gap-4">
                
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-name">Full Name <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="edit-name" 
                    name="name" 
                    className={`input ${profileErrors.name ? 'input-error' : ''}`}
                    value={profileForm.name}
                    onChange={handleProfileFormChange}
                  />
                  {profileErrors.name && (
                    <span className="form-error">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                      {profileErrors.name}
                    </span>
                  )}
                </div>

                {/* Email Address */}
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-email">Email Address <span className="required">*</span></label>
                  <input 
                    type="email" 
                    id="edit-email" 
                    name="email" 
                    className={`input ${profileErrors.email ? 'input-error' : ''}`}
                    value={profileForm.email}
                    onChange={handleProfileFormChange}
                  />
                  {profileErrors.email && (
                    <span className="form-error">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                      {profileErrors.email}
                    </span>
                  )}
                </div>

                {/* Short Bio */}
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-bio">Biography</label>
                  <textarea 
                    id="edit-bio" 
                    name="bio" 
                    className="textarea"
                    rows="4"
                    value={profileForm.bio}
                    onChange={handleProfileFormChange}
                    placeholder="Tell us about yourself..."
                  />
                </div>

              </div>
              
              <div className="modal-footer">
                <Button variant="ghost" onClick={() => setShowEditProfile(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Change Password Modal --- */}
      {showChangePassword && (
        <div className="overlay animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="change-password-title">
          <div className="modal animate-scaleIn">
            <div className="modal-header">
              <h3 id="change-password-title" className="text-xl font-bold">Change Password</h3>
              <button type="button" className="btn-icon" onClick={() => setShowChangePassword(false)} aria-label="Close modal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form onSubmit={handlePasswordSave} noValidate>
              <div className="modal-body flex-col gap-4">
                
                {/* Current Password */}
                <div className="form-group">
                  <label className="form-label" htmlFor="current-pass">Current Password <span className="required">*</span></label>
                  <input 
                    type="password" 
                    id="current-pass" 
                    name="current" 
                    className={`input ${passwordErrors.current ? 'input-error' : ''}`}
                    placeholder="••••••••"
                    value={passwordForm.current}
                    onChange={handlePasswordFormChange}
                  />
                  {passwordErrors.current && (
                    <span className="form-error">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                      {passwordErrors.current}
                    </span>
                  )}
                </div>

                {/* New Password */}
                <div className="form-group">
                  <label className="form-label" htmlFor="new-pass">New Password <span className="required">*</span></label>
                  <input 
                    type="password" 
                    id="new-pass" 
                    name="new" 
                    className={`input ${passwordErrors.new ? 'input-error' : ''}`}
                    placeholder="••••••••"
                    value={passwordForm.new}
                    onChange={handlePasswordFormChange}
                  />
                  {passwordErrors.new && (
                    <span className="form-error">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                      {passwordErrors.new}
                    </span>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="form-group">
                  <label className="form-label" htmlFor="confirm-pass">Confirm New Password <span className="required">*</span></label>
                  <input 
                    type="password" 
                    id="confirm-pass" 
                    name="confirm" 
                    className={`input ${passwordErrors.confirm ? 'input-error' : ''}`}
                    placeholder="••••••••"
                    value={passwordForm.confirm}
                    onChange={handlePasswordFormChange}
                  />
                  {passwordErrors.confirm && (
                    <span className="form-error">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                      {passwordErrors.confirm}
                    </span>
                  )}
                </div>

              </div>
              
              <div className="modal-footer">
                <Button variant="ghost" onClick={() => setShowChangePassword(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Change Password</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- View Activity Detail Modal --- */}
      {viewEntry && (
        <div className="overlay animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="view-entry-title">
          <div className="modal animate-scaleIn">
            <div className="modal-header">
              <h3 id="view-entry-title" className="text-xl font-bold truncate pr-6">{viewEntry.title}</h3>
              <button type="button" className="btn-icon" onClick={() => setViewEntry(null)} aria-label="Close modal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="entry-detail-meta">
                <span className="badge badge-primary">{viewEntry.tech}</span>
                <span className="text-sm text-muted">Created on {viewEntry.date}</span>
              </div>

              <div className="entry-detail-section">
                <h4 className="entry-detail-title">Description</h4>
                <p className="entry-detail-text">{viewEntry.description}</p>
              </div>

              <div className="entry-detail-section">
                <h4 className="entry-detail-title">Key Takeaways</h4>
                <ul className="entry-detail-takeaways flex-col gap-1">
                  {viewEntry.takeaways.split('\n').map((line, index) => (
                    <li key={index} style={{listStyleType: 'disc'}}>{line}</li>
                  ))}
                </ul>
              </div>

              {viewEntry.resource && (
                <div className="entry-detail-section">
                  <h4 className="entry-detail-title">Reference URL</h4>
                  <a href={viewEntry.resource} target="_blank" rel="noreferrer" className="text-sm text-primary-light hover:underline truncate block">
                    {viewEntry.resource}
                  </a>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <Button variant="primary" onClick={() => setViewEntry(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      {showToast && (
        <div className="toast-container" role="status" aria-live="polite">
          <div className="toast border-primary">
            <span className="dot dot-success animate-pulse-glow" aria-hidden="true"></span>
            <div className="flex-col">
              <p className="font-semi text-primary">Success</p>
              <p className="text-xs text-muted">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Profile
