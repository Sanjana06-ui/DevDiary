import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import StatsCard from '../../components/StatsCard/StatsCard'
import EntryCard from '../../components/EntryCard/EntryCard'
import SearchBar from '../../components/SearchBar/SearchBar'
import entryService from '../../services/entry.service'
import './Dashboard.css'

// Motivational Developer Quotes
const quotes = [
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "Coding is not just code; it is architecture, usability, and empathy.", author: "Unknown" }
]

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const isEntriesPage = location.pathname === '/entries'
  
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [techFilter, setTechFilter] = useState('')
  const [diffFilter, setDiffFilter] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  
  // Grid/List toggle & Pagination
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = isEntriesPage ? 8 : 4 // 8 entries on full listing, 4 on dashboard summary
  
  const [entries, setEntries] = useState([])
  const [stats, setStats] = useState({
    totalEntries: 0,
    entriesThisWeek: 0,
    favoriteTech: 'None',
    currentStreak: 0,
    monthlyLogged: 0,
    monthlyGoal: 10,
    weeklyChartData: [],
    techDistribution: {}
  })

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  // Delete Dialog State
  const [deleteId, setDeleteId] = useState(null)
  // Daily Quote State
  const [quote, setQuote] = useState({ text: '', author: '' })
  
  // Format today's date
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const today = new Date().toLocaleDateString('en-US', dateOptions)

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hours = new Date().getHours()
    if (hours < 12) return 'Good morning'
    if (hours < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }))
    }, 3000)
  }

  const refreshData = async () => {
    try {
      const allEntries = await entryService.getAll()
      const dashboardStats = await entryService.getDashboardStats()
      setEntries(allEntries)
      setStats(dashboardStats)
    } catch (err) {
      console.error(err)
      triggerToast('Error loading data', 'error')
    }
  }

  useEffect(() => {
    // Pick a daily quote based on the day of the month
    const quoteIndex = new Date().getDate() % quotes.length
    setQuote(quotes[quoteIndex])

    const loadData = async () => {
      setLoading(true)
      const timer = setTimeout(async () => {
        await refreshData()
        setLoading(false)
      }, 800)
      return () => clearTimeout(timer)
    }
    loadData()
  }, [location.pathname]) // Reload when switching views

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search, techFilter, diffFilter, sortOrder])

  const handleTogglePin = async (id) => {
    try {
      const entry = entries.find(e => e.id === id)
      await entryService.update(id, { pinned: !entry.pinned })
      await refreshData()
      triggerToast(entry.pinned ? 'Entry unpinned' : 'Entry pinned to top')
    } catch (err) {
      triggerToast('Failed to toggle pin', 'error')
    }
  }

  const handleToggleFavorite = async (id) => {
    try {
      const entry = entries.find(e => e.id === id)
      await entryService.update(id, { favorite: !entry.favorite })
      await refreshData()
      triggerToast(entry.favorite ? 'Removed from favorites' : 'Added to favorites')
    } catch (err) {
      triggerToast('Failed to toggle favorite', 'error')
    }
  }

  const handleDeleteRequest = (id) => {
    setDeleteId(id)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    try {
      await entryService.delete(deleteId)
      await refreshData()
      triggerToast('Entry deleted successfully', 'success')
    } catch (err) {
      triggerToast('Failed to delete entry', 'error')
    } finally {
      setDeleteId(null)
    }
  }

  // Filters & Search logic
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(search.toLowerCase()) || 
                          entry.description.toLowerCase().includes(search.toLowerCase()) ||
                          entry.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchesTech = techFilter === '' || entry.tech === techFilter
    const matchesDiff = diffFilter === '' || entry.difficulty.toLowerCase() === diffFilter.toLowerCase()
    return matchesSearch && matchesTech && matchesDiff
  })

  // Sort logic
  const sortedEntries = filteredEntries.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1

    if (sortOrder === 'newest') {
      return new Date(b.date) - new Date(a.date)
    } else if (sortOrder === 'oldest') {
      return new Date(a.date) - new Date(b.date)
    } else if (sortOrder === 'az') {
      return a.title.localeCompare(b.title)
    }
    return 0
  })

  // Pagination Slice
  const totalPages = Math.ceil(sortedEntries.length / itemsPerPage) || 1
  const paginatedEntries = sortedEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Tech list for filter dropdown
  const uniqueTechs = [...new Set(entries.map(e => e.tech))]

  // Slice of recently edited entries for the dashboard sidebar
  const recentlyEdited = [...entries]
    .sort((a, b) => new Date(b.lastEdited) - new Date(a.lastEdited))
    .slice(0, 3)

  return (
    <>
      <Navbar isAuth={true} />
      
      <div className="page-with-sidebar">
        <Sidebar />
        
        <main className="main-content">
          <div className="container-wide">
            
            {/* ────────────────────────────────────────────────────────
               VIEW 1: OVERVIEW DASHBOARD
               ──────────────────────────────────────────────────────── */}
            {!isEntriesPage && (
              <>
                <header className="dashboard-header mb-8 animate-fadeIn">
                  <div className="flex items-center gap-2 text-sm text-primary font-semi mb-3">
                    <span>Dashboard</span>
                    <span className="text-muted">/</span>
                    <span className="text-muted">Overview</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div>
                      <h1 className="text-3xl font-bold mb-1">{getGreeting()}, Developer 👋</h1>
                      <p className="text-muted text-sm">{today}</p>
                    </div>
                    
                    <div className="glass-card-solid py-2.5 px-4 rounded-md border border-border inline-block max-w-md shadow-sm">
                      <p className="text-xs font-medium italic text-secondary">
                         "{quote.text}" 
                         <span className="text-[10px] text-muted block mt-1 not-italic">— {quote.author}</span>
                      </p>
                    </div>
                  </div>
                </header>

                <section className="mb-8 grid grid-4 gap-4">
                  <StatsCard 
                    title="Total Learning Entries" 
                    value={stats.totalEntries} 
                    trend="up" 
                    trendValue={`${stats.entriesThisWeek} new`} 
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>}
                  />
                  <StatsCard 
                    title="Weekly Additions" 
                    value={stats.entriesThisWeek} 
                    trend={stats.entriesThisWeek > 0 ? 'up' : 'neutral'} 
                    trendValue={stats.entriesThisWeek > 0 ? 'Active week' : 'No logs yet'} 
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>}
                  />
                  <StatsCard 
                    title="Active Learning Streak" 
                    value={`${stats.currentStreak} Days`} 
                    trend={stats.currentStreak > 0 ? 'up' : 'neutral'} 
                    trendValue={stats.currentStreak > 0 ? 'Keep it up!' : 'Log today'} 
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>}
                  />
                  <StatsCard 
                    title="Favorite Tech" 
                    value={stats.favoriteTech} 
                    trend="neutral" 
                    trendValue="Based on logs" 
                    icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg>}
                  />
                </section>

                <section className="grid grid-3 gap-6 mb-8">
                  
                  {/* Monthly Goal Progress Widget */}
                  <div className="glass-card p-5 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4">Monthly Goal Progress</h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-black text-primary-text">{stats.monthlyLogged} <span className="text-sm text-muted">/ {stats.monthlyGoal} logs</span></span>
                        <span className="text-sm text-primary font-bold">{Math.round((stats.monthlyLogged / stats.monthlyGoal) * 100)}%</span>
                      </div>
                      <div className="w-full bg-surface-2 border border-border h-3.5 rounded-full overflow-hidden mb-4">
                        <div 
                          className="bg-primary h-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, (stats.monthlyLogged / stats.monthlyGoal) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-xs text-muted">Goal resets at the end of the month. Document your daily learnings to unlock your badge.</p>
                  </div>

                  {/* Weekly Activity Bar Chart Widget */}
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4">Weekly Activity</h3>
                    <div className="weekly-chart-container">
                      {stats.weeklyChartData.map((day, i) => {
                        const maxCount = Math.max(...stats.weeklyChartData.map(d => d.count), 1)
                        const heightPercent = Math.max(8, (day.count / maxCount) * 80)
                        return (
                          <div key={i} className="weekly-chart-bar-wrap">
                            <div 
                              className={`weekly-chart-bar ${day.count > 0 ? 'bg-primary' : 'bg-surface-3'}`} 
                              style={{ height: `${heightPercent}px` }}
                              title={`${day.count} entries on ${day.label}`}
                            ></div>
                            <span className="weekly-chart-label">{day.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Technology Distribution Widget */}
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">Tech Distribution</h3>
                    <div className="flex flex-col gap-2.5">
                      {Object.entries(stats.techDistribution)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([tech, count]) => {
                          const percent = stats.totalEntries > 0 ? Math.round((count / stats.totalEntries) * 100) : 0
                          return (
                            <div key={tech} className="text-xs">
                              <div className="flex justify-between text-secondary mb-1">
                                <span className="font-medium">{tech}</span>
                                <span className="text-muted">{count} logs ({percent}%)</span>
                              </div>
                              <div className="w-full bg-surface-2 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-secondary h-full" style={{ width: `${percent}%` }}></div>
                              </div>
                            </div>
                          )
                        })}
                      {Object.keys(stats.techDistribution).length === 0 && (
                        <p className="text-xs text-muted italic text-center py-4">No data logged yet.</p>
                      )}
                    </div>
                  </div>
                </section>

                <div className="grid-sidebar-layout mb-24">
                  <div className="flex flex-col gap-6">
                    <div>
                      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        Pinned & Recent Logs
                        {!loading && <span className="badge badge-secondary">{Math.min(stats.totalEntries, 4)}</span>}
                      </h2>

                      {loading ? (
                        <div className="grid grid-2 gap-4">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="glass-card p-5 h-[180px] flex flex-col justify-between">
                              <div>
                                <div className="skeleton w-1/3 h-5 mb-3"></div>
                                <div className="skeleton w-full h-4 mb-2"></div>
                                <div className="skeleton w-2/3 h-4"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : entries.length > 0 ? (
                        <div className="grid grid-2 gap-4">
                          {entries.slice(0, 4).map((entry) => (
                            <EntryCard 
                              key={entry.id} 
                              entry={entry} 
                              onTogglePin={handleTogglePin}
                              onToggleFavorite={handleToggleFavorite}
                              onDelete={handleDeleteRequest}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="empty-state glass-card p-8 text-center flex flex-col items-center justify-center">
                          <div className="empty-icon bg-surface-3 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                          </div>
                          <h3 className="text-lg font-bold mb-1">Your DevDiary is empty</h3>
                          <p className="text-muted text-xs max-w-xs mb-4">
                            Start documenting your technical learning and progress milestones.
                          </p>
                          <button className="btn btn-primary btn-sm" onClick={() => navigate('/add-entry')}>
                            Add First Entry
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="glass-card p-4">
                      <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-3">Quick Actions</h3>
                      <div className="flex flex-col gap-2">
                        <button className="btn btn-primary btn-sm btn-block text-left" onClick={() => navigate('/add-entry')}>
                          + Add New Log
                        </button>
                        <button className="btn btn-secondary btn-sm btn-block text-left" onClick={() => navigate('/entries')}>
                          View All Entries
                        </button>
                        <button className="btn btn-outline btn-sm btn-block text-left" onClick={() => navigate('/profile')}>
                          Update Profile
                        </button>
                      </div>
                    </div>

                    <div className="glass-card p-4">
                      <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-3">Recently Edited</h3>
                      <div className="flex flex-col gap-3">
                        {recentlyEdited.map((re) => (
                          <div key={re.id} className="timeline-item">
                            <span className="dot dot-primary"></span>
                            <div className="flex-1 overflow-hidden">
                              <p className="font-medium text-secondary truncate">{re.title}</p>
                              <p className="small-label truncate">{new Date(re.lastEdited).toLocaleDateString()} · {re.tech}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card p-4">
                      <h3 className="text-xs font-bold text-secondary uppercase tracking-wider mb-3">Achievements & Goals</h3>
                      <div className="flex flex-col gap-3">
                        <div className="timeline-item">
                          <span className="dot dot-primary"></span>
                          <div>
                            <p className="font-medium text-secondary">Complete 12 React entries</p>
                            <p className="small-label">Target progress: {entries.filter(e => e.tech === 'React').length} / 12</p>
                          </div>
                        </div>
                        <div className="timeline-item">
                          <span className="dot dot-success"></span>
                          <div>
                            <p className="font-medium text-secondary">Advanced logs unlocked</p>
                            <p className="small-label">Completed {entries.filter(e => e.difficulty.toLowerCase() === 'advanced').length} advanced items</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ────────────────────────────────────────────────────────
               VIEW 2: MY ENTRIES FULL WORKSPACE
               ──────────────────────────────────────────────────────── */}
            {isEntriesPage && (
              <>
                <header className="dashboard-header mb-6 animate-fadeIn">
                  <div className="flex items-center gap-2 text-sm text-primary font-semi mb-3">
                    <span>Workspace</span>
                    <span className="text-muted">/</span>
                    <span className="text-muted">My Entries</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div>
                      <h1 className="text-3xl font-bold mb-1">Developer Log Journal</h1>
                      <p className="text-muted text-sm">Query, filter, and review your compiled notes repository.</p>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/add-entry')}>
                      + New Log Entry
                    </button>
                  </div>
                </header>

                {/* Filters, search, layouts toggle bar */}
                <div className="glass-card p-4 flex flex-wrap gap-4 items-center justify-between mb-6">
                  <div className="flex-grow max-w-md">
                    <SearchBar 
                      value={search} 
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Filter title, keywords, tags..."
                    />
                  </div>

                  <div className="flex gap-2 flex-wrap items-center">
                    <select 
                      className="select input-sm w-auto min-w-[140px]" 
                      value={techFilter} 
                      onChange={e => setTechFilter(e.target.value)}
                    >
                      <option value="">All Technologies</option>
                      {uniqueTechs.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>

                    <select 
                      className="select input-sm w-auto min-w-[130px]" 
                      value={diffFilter} 
                      onChange={e => setDiffFilter(e.target.value)}
                    >
                      <option value="">All Difficulties</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>

                    <select 
                      className="select input-sm w-auto min-w-[130px]" 
                      value={sortOrder} 
                      onChange={e => setSortOrder(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="az">A - Z Title</option>
                    </select>

                    {/* Grid/List layout switcher */}
                    <div className="flex border border-border rounded overflow-hidden">
                      <button 
                        className={`btn-icon btn-icon-xs rounded-none ${viewMode === 'grid' ? 'bg-surface-3 text-primary' : 'text-muted'}`}
                        onClick={() => setViewMode('grid')}
                        title="Grid View"
                        aria-label="Grid View"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                      </button>
                      <button 
                        className={`btn-icon btn-icon-xs rounded-none ${viewMode === 'list' ? 'bg-surface-3 text-primary' : 'text-muted'}`}
                        onClick={() => setViewMode('list')}
                        title="List View"
                        aria-label="List View"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main list view layout */}
                <div className="mb-12">
                  {loading ? (
                    <div className="grid grid-2 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="glass-card p-5 h-[180px] flex flex-col justify-between">
                          <div>
                            <div className="skeleton w-1/3 h-5 mb-3"></div>
                            <div className="skeleton w-full h-4 mb-2"></div>
                            <div className="skeleton w-2/3 h-4"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : paginatedEntries.length > 0 ? (
                    <div className={viewMode === 'list' ? 'grid-list-view' : 'grid grid-3 gap-4'}>
                      {paginatedEntries.map((entry) => (
                        <EntryCard 
                          key={entry.id} 
                          entry={entry} 
                          onTogglePin={handleTogglePin}
                          onToggleFavorite={handleToggleFavorite}
                          onDelete={handleDeleteRequest}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state glass-card p-12 text-center flex flex-col items-center justify-center">
                      <div className="empty-icon bg-surface-3 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      </div>
                      <h3 className="text-lg font-bold mb-1">No results matching your query</h3>
                      <p className="text-muted text-xs max-w-xs mb-4">
                        We couldn't find any learning logs matching those keywords or difficulties filters.
                      </p>
                      <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setTechFilter(''); setDiffFilter(''); }}>
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                {!loading && sortedEntries.length > 0 && (
                  <div className="flex items-center justify-between border-t border-border pt-6 mb-24">
                    <p className="text-xs text-muted">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedEntries.length)} of {sortedEntries.length} entries
                    </p>
                    <div className="flex gap-2">
                      <button 
                        className="btn btn-secondary btn-sm" 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      >
                        Previous
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        </main>
      </div>

      {/* --- Confirmation Dialog Overlay Modal --- */}
      {deleteId && (
        <div className="overlay animate-fadeIn" role="dialog" aria-modal="true">
          <div className="modal animate-scaleIn">
            <div className="modal-header">
              <h3 className="text-lg font-bold">Delete Learning Log?</h3>
              <button className="btn-icon" onClick={() => setDeleteId(null)} aria-label="Close dialog">
                &times;
              </button>
            </div>
            <div className="modal-body text-sm text-secondary">
              Are you sure you want to delete this log? This action is permanent and cannot be undone.
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger btn-sm" onClick={handleConfirmDelete}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Toast Notifications panel --- */}
      {toast.show && (
        <div className="toast-container">
          <div className={`toast border-${toast.type === 'success' ? 'primary' : 'error'}`}>
            <span className={`dot dot-${toast.type === 'success' ? 'primary' : 'error'}`}></span>
            <div>
              <p className="font-medium text-xs text-secondary">{toast.message}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Dashboard
