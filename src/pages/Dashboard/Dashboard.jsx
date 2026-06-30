import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import StatsCard from '../../components/StatsCard/StatsCard'
import EntryCard from '../../components/EntryCard/EntryCard'
import SearchBar from '../../components/SearchBar/SearchBar'
import './Dashboard.css'

// --- Dummy Data ---
const dummyStats = [
  {
    title: 'Total Learning Entries',
    value: '128',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
    ),
    trend: 'up',
    trendValue: '12%'
  },
  {
    title: 'Entries Added This Week',
    value: '14',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20v-6M6 20V10M18 20V4"></path></svg>
    ),
    trend: 'up',
    trendValue: '5%'
  },
  {
    title: 'Favorite Technology',
    value: 'React.js',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path><path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M3.5 6.5l1.4 1.4"></path><path d="M19.1 17.5l1.4 1.4"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M3.5 17.5l1.4-1.4"></path><path d="M19.1 6.5l1.4-1.4"></path></svg>
    ),
    trend: 'neutral',
    trendValue: ''
  },
  {
    title: 'Current Learning Streak',
    value: '8 Days',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.5 19c2.5 0 4.5-2 4.5-4.5a4.5 4.5 0 0 0-4.08-4.48A5 5 0 0 0 8.08 7.52 4.5 4.5 0 0 0 2 12c0 2.5 2 4.5 4.5 4.5"></path></svg>
    ),
    trend: 'down',
    trendValue: '-1 day'
  }
]

const dummyEntries = [
  {
    id: 1,
    title: 'Understanding React Server Components',
    description: 'RSC allows rendering components exclusively on the server, resulting in smaller bundle sizes and improved performance since the client only downloads interactive parts.',
    tech: 'React',
    difficulty: 'Hard',
    date: 'Oct 12, 2026'
  },
  {
    id: 2,
    title: 'Mastering CSS Grid Subgrid',
    description: 'Subgrid makes it extremely easy to perfectly align child grids to their parent grid tracks without recalculating gap and track sizes manually.',
    tech: 'CSS',
    difficulty: 'Medium',
    date: 'Oct 10, 2026'
  },
  {
    id: 3,
    title: 'Prisma Client Extensions',
    description: 'Learned how to use Prisma client extensions to add custom computed fields and reusable queries across the whole database access layer.',
    tech: 'Prisma',
    difficulty: 'Medium',
    date: 'Oct 08, 2026'
  },
  {
    id: 4,
    title: 'Vite Plugin Setup Basics',
    description: 'Explored the hook structure for Vite plugins. Using transformIndexHtml to inject meta tags during build time proved very useful.',
    tech: 'Vite',
    difficulty: 'Easy',
    date: 'Oct 05, 2026'
  },
  {
    id: 5,
    title: 'JWT Authentication Flow',
    description: 'Implemented access and refresh tokens. The key takeaway was storing the access token in memory and the refresh token in a HttpOnly cookie for security.',
    tech: 'Security',
    difficulty: 'Hard',
    date: 'Oct 01, 2026'
  },
  {
    id: 6,
    title: 'TypeScript Utility Types',
    description: 'Using Pick, Omit, and Partial has massively cleaned up our interface definitions avoiding redundant declarations.',
    tech: 'TypeScript',
    difficulty: 'Easy',
    date: 'Sep 28, 2026'
  }
]

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [entries, setEntries] = useState([])
  const [stats, setStats] = useState([])

  // Format today's date
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const today = new Date().toLocaleDateString('en-US', dateOptions)

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      setEntries(dummyEntries)
      setStats(dummyStats)
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Navbar isAuth={true} />
      
      <div className="page-with-sidebar">
        <Sidebar />
        
        <main className="main-content">
          <div className="container-wide">
            
            {/* --- Dashboard Header --- */}
            <header className="dashboard-header mb-8 animate-fadeIn">
              <div className="flex items-center gap-2 text-sm text-primary font-semi mb-3">
                <span>Dashboard</span>
                <span className="text-muted">/</span>
                <span className="text-muted">Overview</span>
              </div>
              
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Welcome back, John 👋</h1>
                  <p className="text-muted">{today}</p>
                </div>
                
                <div className="glass-card-solid py-3 px-5 rounded-lg border-primary border-opacity-30 inline-block shadow-glow-primary">
                  <p className="text-sm font-medium italic text-primary-light">
                     "First, solve the problem. Then, write the code." 
                     <span className="text-xs text-muted block mt-1 not-italic">— John Johnson</span>
                  </p>
                </div>
              </div>
            </header>

            {/* --- Statistics Section --- */}
            <section className="mb-12">
              <div className="grid grid-4 gap-6">
                {loading ? (
                  // Skeleton Cards
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="glass-card p-5">
                      <div className="skeleton w-8 h-8 rounded-md mb-4 bg-opacity-20"></div>
                      <div className="skeleton w-1/3 h-4 mb-2"></div>
                      <div className="skeleton w-2/3 h-8"></div>
                    </div>
                  ))
                ) : (
                  stats.map((stat, i) => (
                    <StatsCard 
                      key={i}
                      title={stat.title}
                      value={stat.value}
                      icon={stat.icon}
                      trend={stat.trend}
                      trendValue={stat.trendValue}
                      className={`animate-fadeInUp delay-${(i+1)*100}`}
                    />
                  ))
                )}
              </div>
            </section>

            {/* --- Search & Filters --- */}
            <section className="mb-8 animate-fadeIn delay-300">
              <div className="glass-card-solid p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between">
                <div className="flex-1 min-w-[280px]">
                  <SearchBar 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search entries, code snippets, or tags..."
                  />
                </div>
                
                <div className="flex gap-4 scroll-mobile pr-2">
                  <select className="select input-sm w-auto min-w-[140px]" defaultValue="">
                    <option value="" disabled>Technology</option>
                    <option value="react">React</option>
                    <option value="css">CSS</option>
                    <option value="typescript">TypeScript</option>
                  </select>
                  
                  <select className="select input-sm w-auto min-w-[140px]" defaultValue="">
                    <option value="" disabled>Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  
                  <select className="select input-sm w-auto min-w-[140px]" defaultValue="newest">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="az">A - Z</option>
                  </select>
                </div>
              </div>
            </section>

            {/* --- Learning Entries Grid --- */}
            <section className="mb-24">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                Recent Entries
                {!loading && <span className="badge badge-secondary">{entries.length}</span>}
              </h2>

              {loading ? (
                // Skeleton Grid
                <div className="grid grid-auto gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="glass-card p-5 h-[220px] flex-col justify-between">
                      <div>
                        <div className="flex gap-2 mb-4">
                          <div className="skeleton w-16 h-6 rounded-full"></div>
                          <div className="skeleton w-16 h-6 rounded-full"></div>
                        </div>
                        <div className="skeleton w-full h-6 mb-2"></div>
                        <div className="skeleton w-4/5 h-6 mb-4"></div>
                        <div className="skeleton w-full h-4 mb-1"></div>
                        <div className="skeleton w-2/3 h-4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : entries.length > 0 ? (
                // Entries Grid
                <div className="grid grid-auto gap-6">
                  {entries.map((entry, index) => (
                    <div key={entry.id} className={`animate-fadeInUp delay-${(index % 4) * 100}`}>
                      <EntryCard entry={entry} />
                    </div>
                  ))}
                </div>
              ) : (
                // Empty State
                <div className="empty-state glass-card p-12 text-center flex-col items-center justify-center animate-fadeIn">
                  <div className="empty-icon bg-surface-3 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-glow-primary">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No learning entries yet</h3>
                  <p className="text-muted max-w-sm mb-8">
                    Your developer journal is empty! Start documenting what you learn to build your knowledge base.
                  </p>
                  <button className="btn btn-primary btn-lg hover-lift">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Create First Entry
                  </button>
                </div>
              )}
            </section>
            
          </div>
        </main>
        
        {/* Floating Action Button */}
        <button className="fab hover-lift animate-fadeInUp" aria-label="Add new entry" title="Add new entry">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>
    </>
  )
}

export default Dashboard
