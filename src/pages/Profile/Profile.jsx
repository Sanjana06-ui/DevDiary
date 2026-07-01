import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import Button from '../../components/Button/Button'
import StatsCard from '../../components/StatsCard/StatsCard'
import entryService from '../../services/entry.service'
import './Profile.css'

// Avatar list presets for switcher
const avatarSeeds = [
  'John', 'Alex', 'Sara', 'Jordan', 'Taylor', 'Morgan'
]

const Profile = () => {
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
    joined: '',
    skills: [],
    interests: [],
    targetEntriesMonth: 10
  })
  
  const [entries, setEntries] = useState([])
  const [stats, setStats] = useState({
    totalEntries: 0,
    entriesThisWeek: 0,
    currentStreak: 0,
    monthlyLogged: 0
  })

  // Modal display states
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [viewEntry, setViewEntry] = useState(null)

  // Form states
  const [profileForm, setProfileForm] = useState({ 
    name: '', 
    email: '', 
    bio: '', 
    skillsStr: '', 
    interestsStr: '',
    avatarSeed: 'John'
  })
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

  const loadData = async () => {
    try {
      const profile = await entryService.getProfile()
      const allEntries = await entryService.getAll()
      const dashboardStats = await entryService.getDashboardStats()
      
      setUser(profile)
      setEntries(allEntries)
      setStats({
        totalEntries: allEntries.length,
        entriesThisWeek: dashboardStats.entriesThisWeek,
        currentStreak: dashboardStats.currentStreak,
        monthlyLogged: dashboardStats.monthlyLogged
      })
      
      setProfileForm({
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
        skillsStr: (profile.skills || []).join(', '),
        interestsStr: (profile.interests || []).join(', '),
        avatarSeed: profile.avatar.split('seed=')[1]?.split('&')[0] || 'John'
      })
    } catch (err) {
      console.error(err)
      triggerToast('Error loading profile')
    }
  }

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(async () => {
      await loadData()
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Calculate profile completion percentage
  const getCompletionPercentage = () => {
    let score = 0
    let total = 6
    if (user.name) score++
    if (user.email) score++
    if (user.bio) score++
    if (user.avatar) score++
    if (user.skills && user.skills.length > 0) score++
    if (user.interests && user.interests.length > 0) score++
    return Math.round((score / total) * 100)
  }

  // Calculate technology mastery
  const getTechMastery = () => {
    const techGroups = {}
    entries.forEach(e => {
      if (!techGroups[e.tech]) {
        techGroups[e.tech] = { total: 0, advanced: 0, intermediate: 0, beginner: 0 }
      }
      techGroups[e.tech].total++
      if (e.difficulty.toLowerCase() === 'advanced') techGroups[e.tech].advanced++
      else if (e.difficulty.toLowerCase() === 'intermediate') techGroups[e.tech].intermediate++
      else techGroups[e.tech].beginner++
    })

    // Calculate percentage based on weight
    return Object.entries(techGroups).map(([tech, data]) => {
      const score = (data.advanced * 3) + (data.intermediate * 2) + (data.beginner * 1)
      const maxPossible = data.total * 3
      const percent = Math.min(100, Math.round((score / maxPossible) * 100))
      return { tech, count: data.total, percent }
    }).sort((a, b) => b.percent - a.percent)
  }

  // Check achievement locking status dynamically
  const getAchievements = () => {
    const reactLogs = entries.filter(e => e.tech === 'React').length
    const totalLogs = entries.length
    const streak = stats.currentStreak
    const advancedLogs = entries.filter(e => e.difficulty.toLowerCase() === 'advanced').length

    return [
      {
        id: 'first',
        name: 'First Entry',
        desc: 'Begin learning journey',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>,
        color: 'badge-blue',
        unlocked: totalLogs > 0
      },
      {
        id: 'streak',
        name: 'Streak Master',
        desc: '3+ Days learning streak',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>,
        color: 'badge-gold',
        unlocked: streak >= 3
      },
      {
        id: 'half_century',
        name: '25 Logs Milestones',
        desc: 'Documented 25 learning entries',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>,
        color: 'badge-purple',
        unlocked: totalLogs >= 25
      },
      {
        id: 'advanced',
        name: 'Architect Mindset',
        desc: 'Log 5 advanced difficulty items',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>,
        color: 'badge-cyan',
        unlocked: advancedLogs >= 5
      }
    ]
  }

  const handleEditProfileClick = () => {
    setProfileForm({
      name: user.name,
      email: user.email,
      bio: user.bio,
      skillsStr: (user.skills || []).join(', '),
      interestsStr: (user.interests || []).join(', '),
      avatarSeed: user.avatar.split('seed=')[1]?.split('&')[0] || 'John'
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

  const handleProfileSave = async (e) => {
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

    const updatedSkills = profileForm.skillsStr.split(',').map(s => s.trim()).filter(s => s.length > 0)
    const updatedInterests = profileForm.interestsStr.split(',').map(i => i.trim()).filter(i => i.length > 0)
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileForm.avatarSeed}&backgroundColor=2563EB`

    const updated = await entryService.updateProfile({
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
      bio: profileForm.bio.trim(),
      skills: updatedSkills,
      interests: updatedInterests,
      avatar: newAvatar
    })

    setUser(updated)
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
              <header className="dashboard-header mb-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-sm text-primary font-semi mb-3">
                  <Link to="/dashboard" className="hover:text-primary-light transition-colors">Dashboard</Link>
                  <span className="text-muted">/</span>
                  <span className="text-muted">Profile</span>
                </div>
                
                <h1 className="text-3xl font-bold mb-1">Developer Profile</h1>
                <p className="text-muted text-sm">Review your achievements badges, technology mastery levels, and logged skills.</p>
              </header>

              {/* --- Grid Content --- */}
              <div className="profile-grid">
                
                {/* --- Left Column --- */}
                <div className="profile-left-col">
                  
                  {/* User Profile Info Card */}
                  <div className="user-card glass-card animate-fadeInUp">
                    
                    {/* Completion Widget */}
                    <div className="w-full flex flex-col items-center mb-4">
                      <div className="avatar-wrapper relative">
                        <img 
                          src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=2563EB"} 
                          alt="Profile Avatar" 
                          className="profile-avatar w-24 h-24 rounded-full border border-border"
                        />
                      </div>
                      <div className="text-center mt-2 w-full px-4">
                        <div className="flex justify-between text-[11px] text-muted mb-1">
                          <span>Profile setup</span>
                          <span>{getCompletionPercentage()}%</span>
                        </div>
                        <div className="w-full bg-surface-2 h-1 rounded-full overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: `${getCompletionPercentage()}%` }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <h2 className="user-name text-lg font-bold">{user.name}</h2>
                    <p className="user-email text-xs text-muted mb-4">{user.email}</p>
                    
                    <div className="user-meta-list">
                      <div className="user-meta-item">
                        <span className="user-meta-label">Joined</span>
                        <span className="user-meta-value">{user.joined}</span>
                      </div>
                      <div className="user-meta-item">
                        <span className="user-meta-label">Total Entries</span>
                        <span className="user-meta-value">{stats.totalEntries}</span>
                      </div>
                    </div>

                    <div className="user-bio">
                      <h4 className="user-bio-title">About</h4>
                      <p className="text-sm text-secondary">{user.bio || <span className="text-muted italic">No bio written yet.</span>}</p>
                    </div>

                    <div className="user-actions">
                      <Button variant="primary" onClick={handleEditProfileClick} className="w-full hover-lift">
                        Edit Profile Details
                      </Button>
                      <Button variant="outline" onClick={() => { setPasswordForm({ current: '', new: '', confirm: '' }); setPasswordErrors({}); setShowChangePassword(true); }} className="w-full hover-lift">
                        Security Settings
                      </Button>
                      <Button variant="ghost" onClick={handleLogout} className="w-full text-error hover:bg-[rgba(239,68,68,0.06)] border-[rgba(239,68,68,0.2)]">
                        Logout
                      </Button>
                    </div>
                  </div>

                  {/* Achievements Badge Card */}
                  <div className="achievements-card glass-card animate-fadeInUp delay-100">
                    <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-1">Earned Badges</h3>
                    <p className="text-xs text-muted mb-4">Milestones based on your entry counts</p>
                    
                    <div className="achievements-grid">
                      {getAchievements().map((badge) => (
                        <div 
                          key={badge.id} 
                          className={`achievement-badge ${!badge.unlocked ? 'opacity-40 filter grayscale' : ''}`}
                          title={badge.unlocked ? `Unlocked: ${badge.name}` : `Locked: ${badge.desc}`}
                        >
                          <div className={`badge-icon-container ${badge.color}`}>
                            {badge.icon}
                          </div>
                          <span className="badge-name">{badge.name}</span>
                          <span className="badge-desc">{badge.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* --- Right Column --- */}
                <div className="profile-right-col">
                  
                  {/* Stats Cards Section */}
                  <div className="stats-cards-grid">
                    <StatsCard 
                      title="Logged Entries" 
                      value={stats.totalEntries} 
                      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>}
                      trend="neutral"
                      trendValue="All time"
                      className="animate-fadeInUp"
                    />
                    <StatsCard 
                      title="Streak" 
                      value={`${stats.currentStreak} Days`} 
                      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>}
                      trend={stats.currentStreak > 0 ? 'up' : 'neutral'}
                      trendValue={stats.currentStreak > 0 ? 'Active' : 'No streak'}
                      className="animate-fadeInUp delay-75"
                    />
                  </div>

                  {/* Technology Mastery Cards */}
                  <div className="activity-card glass-card animate-fadeInUp delay-100">
                    <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4">Technology Mastery</h3>
                    <div className="flex flex-col gap-4">
                      {getTechMastery().map((item) => (
                        <div key={item.tech} className="bg-surface-2 border border-border p-3.5 rounded-md">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-bold text-sm text-secondary">{item.tech}</span>
                            <span className="text-xs text-primary font-bold">{item.percent}% Mastery ({item.count} logs)</span>
                          </div>
                          <div className="w-full bg-surface-3 h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${item.percent}%` }}></div>
                          </div>
                        </div>
                      ))}
                      {getTechMastery().length === 0 && (
                        <p className="text-sm text-muted italic text-center py-6">Add logs to build mastery meters.</p>
                      )}
                    </div>
                  </div>

                  {/* Skills & Personal Interests */}
                  <div className="activity-card glass-card animate-fadeInUp delay-150">
                    <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">Skills & Focus Areas</h3>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {user.skills && user.skills.map(skill => (
                        <span key={skill} className="badge badge-primary">{skill}</span>
                      ))}
                      {(!user.skills || user.skills.length === 0) && (
                        <span className="text-xs text-muted italic">No skills listed.</span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">Interests</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {user.interests && user.interests.map(interest => (
                        <span key={interest} className="badge badge-secondary">{interest}</span>
                      ))}
                      {(!user.interests || user.interests.length === 0) && (
                        <span className="text-xs text-muted italic">No interests listed.</span>
                      )}
                    </div>
                  </div>

                  {/* Recent Learning Activity Table */}
                  <div className="activity-card glass-card animate-fadeInUp delay-200">
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-3">Recent Activity Logs</h3>
                    <div className="activity-list">
                      {entries.slice(0, 5).map((act) => (
                        <div key={act.id} className="activity-item">
                          <div className="activity-details">
                            <span className="activity-title truncate">{act.title}</span>
                            <div className="activity-meta">
                              <span className="badge badge-primary">{act.tech}</span>
                              <span className="activity-date">{new Date(act.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <button 
                            type="button" 
                            className="btn btn-sm btn-outline hover-lift flex-shrink-0"
                            onClick={() => setViewEntry(act)}
                          >
                            View Details
                          </button>
                        </div>
                      ))}
                      {entries.length === 0 && (
                        <p className="text-sm text-muted italic text-center py-6">No entries logged yet.</p>
                      )}
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
              <h3 id="edit-profile-title" className="text-xl font-bold">Edit Profile Details</h3>
              <button type="button" className="btn-icon" onClick={() => setShowEditProfile(false)} aria-label="Close modal">
                &times;
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
                    rows="3"
                    value={profileForm.bio}
                    onChange={handleProfileFormChange}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Skills */}
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-skills">Skills (comma separated)</label>
                  <input 
                    type="text" 
                    id="edit-skills" 
                    name="skillsStr" 
                    className="input"
                    value={profileForm.skillsStr}
                    onChange={handleProfileFormChange}
                    placeholder="e.g. React, TypeScript, Node.js"
                  />
                </div>

                {/* Interests */}
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-interests">Interests (comma separated)</label>
                  <input 
                    type="text" 
                    id="edit-interests" 
                    name="interestsStr" 
                    className="input"
                    value={profileForm.interestsStr}
                    onChange={handleProfileFormChange}
                    placeholder="e.g. Open Source, Performance"
                  />
                </div>

                {/* Avatar Seed Picker */}
                <div className="form-group">
                  <label className="form-label">Select Avatar Preset</label>
                  <div className="flex gap-2 flex-wrap">
                    {avatarSeeds.map(seed => (
                      <button
                        key={seed}
                        type="button"
                        className={`badge ${profileForm.avatarSeed === seed ? 'badge-primary' : 'badge-muted'} cursor-pointer`}
                        onClick={() => setProfileForm(prev => ({ ...prev, avatarSeed: seed }))}
                      >
                        {seed}
                      </button>
                    ))}
                  </div>
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
              <h3 id="change-password-title" className="text-xl font-bold">Security settings</h3>
              <button type="button" className="btn-icon" onClick={() => setShowChangePassword(false)} aria-label="Close modal">
                &times;
              </button>
            </div>
            
            <form onSubmit={handlePasswordSave} noValidate>
              <div className="modal-body flex-col gap-4">
                
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
                    <span className="form-error">{passwordErrors.current}</span>
                  )}
                </div>

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
                    <span className="form-error">{passwordErrors.new}</span>
                  )}
                </div>

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
                    <span className="form-error">{passwordErrors.confirm}</span>
                  )}
                </div>

              </div>
              
              <div className="modal-footer">
                <Button variant="ghost" onClick={() => setShowChangePassword(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Update Password</Button>
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
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="entry-detail-meta">
                <span className="badge badge-primary">{viewEntry.tech}</span>
                <span className="text-sm text-muted">Logged date {new Date(viewEntry.date).toLocaleDateString()}</span>
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
