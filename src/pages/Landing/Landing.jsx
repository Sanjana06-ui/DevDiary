import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import Button from '../../components/Button/Button'
import './Landing.css'

const Landing = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('code')

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])
  return (
    <>
      <Navbar />
      
      <main className="landing-page">
        {/* =========================================
            Hero Section
            ========================================= */}
        <section className="hero-section container">
          <div className="hero__content animate-fadeInUp">
            <div className="badge badge-secondary mb-6 animate-pulse-glow">
              <span className="dot dot-secondary mr-2"></span>
              Next-Generation Developer Workspace
            </div>
            <h1 className="hero__title flex-col gap-2">
              <span className="hero__title-line line-1">Document your <span className="highlight-gradient">learning</span>.</span>
              <span className="hero__title-line line-2">Track every <span className="highlight-gradient">breakthrough</span>.</span>
              <span className="hero__title-line line-3">Build your <span className="highlight-gradient">dev journey</span>.</span>
            </h1>
            <p className="hero__subtitle mt-6">
              DevDiary is a premium personal knowledge base built specifically for software engineers. Capture syntax discoveries, debug logs, and progress meters.
            </p>
            
            <div className="hero__actions mt-8 flex flex-wrap gap-4">
              <Link to="/register">
                <Button variant="primary" size="xl" className="hover-lift btn-purple-gradient">
                  Get Started Free
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="xl" className="btn-metallic-border group">
                  Learn More
                  <svg className="ml-2 transition-transform duration-200 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Button>
              </a>
            </div>
          </div>
          
          <div className="hero__artwork animate-fadeIn delay-300 relative">
            {/* Interactive VS Code Multi-tab Mockup Workspace */}
            <div className="hero__mockup glass-card-solid hover-float flex-col">
              <div className="workspace-tabs border-bottom flex items-center px-4 py-2 bg-surface-2 gap-2 overflow-x-auto">
                <div className="flex gap-1.5 mr-4 shrink-0">
                  <span className="dot" style={{background: '#EF4444', width: '10px', height: '10px', borderRadius: '50%'}}></span>
                  <span className="dot" style={{background: '#F59E0B', width: '10px', height: '10px', borderRadius: '50%'}}></span>
                  <span className="dot" style={{background: '#10B981', width: '10px', height: '10px', borderRadius: '50%'}}></span>
                </div>
                <button onClick={() => setActiveTab('code')} className={`workspace-tab flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all border border-transparent ${activeTab === 'code' ? 'active-tab bg-surface border-border text-primary' : 'text-muted'}`}>
                  <span>⚛️</span> App.jsx
                </button>
                <button onClick={() => setActiveTab('prisma')} className={`workspace-tab flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all border border-transparent ${activeTab === 'prisma' ? 'active-tab bg-surface border-border text-primary' : 'text-muted'}`}>
                  <span>⏵</span> schema.prisma
                </button>
                <button onClick={() => setActiveTab('git')} className={`workspace-tab flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all border border-transparent ${activeTab === 'git' ? 'active-tab bg-surface border-border text-primary' : 'text-muted'}`}>
                  <span>⚙️</span> git.commit
                </button>
                <button onClick={() => setActiveTab('notes')} className={`workspace-tab flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all border border-transparent ${activeTab === 'notes' ? 'active-tab bg-surface border-border text-primary' : 'text-muted'}`}>
                  <span>📝</span> goals.md
                </button>
              </div>

              <div className="mockup__body flex-1 min-h-[220px]">
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="flex gap-4 mb-4">
                      <div className="skeleton" style={{width: '30%', height: '20px'}}></div>
                      <div className="skeleton" style={{width: '50%', height: '20px'}}></div>
                    </div>
                    <div className="skeleton mb-2" style={{width: '90%', height: '12px'}}></div>
                    <div className="skeleton mb-4" style={{width: '75%', height: '12px'}}></div>
                  </div>
                ) : (
                  <div className="mockup__code animate-scaleIn">
                    {activeTab === 'code' && (
                      <pre><code className="font-mono text-xs">
<span style={{color: '#C4B5FD'}}>const</span> <span style={{color: '#8B7CF6'}}>growSession</span> = <span style={{color: '#A855F7'}}>async</span> () =&gt; {'{'}
  <span style={{color: '#8B7FA4'}}>// Code. Document. Accelerate.</span>
  <span style={{color: '#A855F7'}}>await</span> devDiary.logInsight(<span style={{color: '#DDD6FE'}}>"React Server Comp"</span>);
  devDiary.incrementStreak();<span className="blinking-cursor">|</span>
{'}'}
                      </code></pre>
                    )}
                    {activeTab === 'prisma' && (
                      <pre><code className="font-mono text-xs">
<span style={{color: '#C4B5FD'}}>model</span> <span style={{color: '#8B7CF6'}}>InsightLog</span> {'{'}
  id        <span style={{color: '#DDD6FE'}}>String</span>   @id @default(uuid())
  title     <span style={{color: '#DDD6FE'}}>String</span>
  category  <span style={{color: '#DDD6FE'}}>String</span>
  createdAt <span style={{color: '#DDD6FE'}}>DateTime</span> @default(now())
{'}'}
                      </code></pre>
                    )}
                    {activeTab === 'git' && (
                      <pre><code className="font-mono text-xs">
<span style={{color: '#10B981'}}>$ git commit -m "feat: setup dashboard charts insights"</span>
[main d3c8a91] feat: setup dashboard charts insights
 3 files changed, 48 insertions(+), 12 deletions(-)
 create mode 100644 src/components/Dashboard/InsightChart.jsx
<span style={{color: '#10B981'}}>Auto-synced metadata updates (success)</span>
                      </code></pre>
                    )}
                    {activeTab === 'notes' && (
                      <pre><code className="font-mono text-xs">
<span style={{color: '#8B7CF6'}}># Daily Learning Goals</span>
- [x] Integrate local database metrics services
- [x] Overhaul dark next-gen purple colors layouts
- [ ] Configure automatic backup schedules<span className="blinking-cursor">_</span>
                      </code></pre>
                    )}
                  </div>
                )}
              </div>

              <div className="workspace-footer border-top bg-surface-2 px-4 py-2 flex justify-between items-center text-[10px] text-muted select-none">
                <div className="flex items-center gap-1.5">
                  <span className="pulse-dot"></span>
                  <span>Synced with LocalStorage</span>
                </div>
                <span>UTF-8 &bull; JavaScript React</span>
              </div>
            </div>

            {/* Floating Glass Badges Overlay Panels */}
            {!isLoading && (
              <>
                <div className="floating-card git-success-card glass-card p-3 flex items-center gap-3 animate-float-slow hide-sm">
                  <div className="icon-wrap bg-success-soft rounded-full p-1.5 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-muted">Auto-commit: d3c8a91</span>
                    <span className="text-[11px] font-bold text-primary">Synced React Hooks (100%)</span>
                  </div>
                </div>
                
                <div className="floating-card streak-achievement-card glass-card p-3 flex items-center gap-3 animate-float-fast hide-sm">
                  <div className="icon-wrap bg-primary-soft rounded-full p-1.5 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-muted">Weekly Goals</span>
                    <span className="text-[11px] font-bold text-secondary">5 Day Streak Active!</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* =========================================
            Trusted Technologies Logo Section
            ========================================= */}
        <section className="trusted-techs-section section container animate-fadeInUp">
          <div className="text-center mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-muted">Supporting Your Complete Stack</span>
          </div>
          
          <div className="trusted-techs-grid">
            {[
              { name: 'React', desc: 'Frontend Framework', color: 'rgba(97, 218, 251, 0.08)' },
              { name: 'TypeScript', desc: 'Type Safety', color: 'rgba(49, 120, 198, 0.08)' },
              { name: 'Node.js', desc: 'Runtime Server', color: 'rgba(67, 133, 61, 0.08)' },
              { name: 'JavaScript', desc: 'Core Language', color: 'rgba(247, 223, 30, 0.08)' },
              { name: 'Express', desc: 'Middleware App', color: 'rgba(255, 255, 255, 0.04)' },
              { name: 'MongoDB', desc: 'Document Storage', color: 'rgba(89, 150, 72, 0.08)' },
              { name: 'Prisma', desc: 'Database Client', color: 'rgba(12, 50, 75, 0.08)' },
              { name: 'JWT', desc: 'Token Security', color: 'rgba(251, 86, 196, 0.08)' }
            ].map(tech => (
              <div key={tech.name} className="tech-logo-card glass-card hover-lift" style={{ '--tech-glow': tech.color }}>
                <span className="font-bold text-base text-primary mb-1">{tech.name}</span>
                <span className="text-[10px] text-muted">{tech.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            Feature Grid Section
            ========================================= */}
        <section id="features" className="features-section section container">
          <div className="text-center mb-16">
            <h2 className="text-3xl mb-4 font-heading font-semi">Engineered for Dev Growth</h2>
            <p className="text-muted max-w-2xl mx-auto text-sm">
              DevDiary packs state-of-the-art visual logs, stats widgets, search modules, and profile gauges to streamline your knowledge mapping.
            </p>
          </div>

          <div className="grid grid-auto gap-8">
            <div className="feature-card glass-card hover-lift">
              <div className="feature-card__icon bg-primary-soft">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <h3 className="text-lg font-heading font-semi mt-6 mb-2">Frosted Code Editor</h3>
              <p className="text-muted text-xs leading-relaxed">
                Jot down takeaways, configure suggestions tags lists, and preview styled HTML output instantaneously.
              </p>
            </div>

            <div className="feature-card glass-card hover-lift">
              <div className="feature-card__icon bg-secondary-soft">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 className="text-lg font-heading font-semi mt-6 mb-2">Search Workspace Catalog</h3>
              <p className="text-muted text-xs leading-relaxed">
                Query key metrics, filters tags, difficulty ranges, and toggle lists layouts dynamically in seconds.
              </p>
            </div>

            <div className="feature-card glass-card hover-lift">
              <div className="feature-card__icon bg-success-soft">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h3 className="text-lg font-heading font-semi mt-6 mb-2">Dynamic Mastery Progression</h3>
              <p className="text-muted text-xs leading-relaxed">
                Track streak meters, weekly charts, upcoming goals list, and unlock rewards based on actual logged counts.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            Workflow Timeline Section
            ========================================= */}
        <section id="how-it-works" className="workflow-section section container">
          <div className="text-center mb-16">
            <h2 className="text-3xl mb-4 font-heading font-semi">How It Works: The DevDiary Workflow</h2>
            <p className="text-muted max-w-xl mx-auto text-sm">How developers establish healthy learning routines.</p>
          </div>

          <div className="workflow-timeline">
            {[
              { id: '1', title: 'Learn', desc: 'Understand a new coding syntax or design tool.' },
              { id: '2', title: 'Document', desc: 'Jot details down with live markdown previewing.' },
              { id: '3', title: 'Track', desc: 'Assess streak meters and technology mastery logs.' },
              { id: '4', title: 'Improve', desc: 'Revisit code lessons to resolve present bugs.' },
              { id: '5', title: 'Achieve', desc: 'Unlock milestones and progress cards.' }
            ].map((step, idx) => (
              <div key={step.id} className="timeline-node text-center relative animate-fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="timeline-circle gradient-border mx-auto mb-4">
                  <span className="text-sm font-bold gradient-text">{step.id}</span>
                </div>
                <h4 className="text-sm font-heading font-semi mb-1 text-primary">{step.title}</h4>
                <p className="text-xs text-muted max-w-[150px] mx-auto leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            Product Interactive Mockup Section
            ========================================= */}
        <section className="product-preview-section section container animate-fadeInUp">
          <div className="product-preview-container glass-card">
            <div className="mockup-header border-bottom flex items-center justify-between px-4 py-3">
              <div className="flex gap-2">
                <span className="dot" style={{ background: '#EF4444' }}></span>
                <span className="dot" style={{ background: '#F59E0B' }}></span>
                <span className="dot" style={{ background: '#10B981' }}></span>
              </div>
              <span className="text-[10px] text-muted font-mono bg-surface-2 px-2 py-0.5 rounded">workspace-dashboard.json</span>
            </div>
            
            <div className="mockup-body grid grid-sidebar-layout p-4 gap-4">
              {isLoading ? (
                <>
                  <div className="mockup-sidebar bg-surface-2 p-3 rounded border border-border flex flex-col gap-2 animate-pulse">
                    <div className="skeleton" style={{ width: '40%', height: '14px' }}></div>
                    <div className="skeleton mt-4" style={{ width: '90%', height: '10px' }}></div>
                    <div className="skeleton" style={{ width: '80%', height: '10px' }}></div>
                    <div className="skeleton" style={{ width: '85%', height: '10px' }}></div>
                  </div>
                  <div className="mockup-main flex flex-col gap-3 animate-pulse">
                    <div className="flex gap-3">
                      <div className="skeleton flex-1" style={{ height: '50px' }}></div>
                      <div className="skeleton flex-1" style={{ height: '50px' }}></div>
                    </div>
                    <div className="skeleton" style={{ width: '100%', height: '120px' }}></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mockup-sidebar bg-surface-2 p-3 rounded border border-border flex flex-col gap-2.5 text-xs animate-scaleIn">
                    <span className="font-bold text-primary mb-1">DevDiary Menu</span>
                    <span className="text-secondary font-medium bg-surface p-1.5 rounded border border-border flex items-center gap-1.5"><span className="dot dot-primary" style={{width: '6px', height: '6px'}}></span> Dashboard</span>
                    <span className="text-muted p-1.5 flex items-center gap-1.5">My Entries</span>
                    <span className="text-muted p-1.5 flex items-center gap-1.5">Add Insight</span>
                  </div>
                  <div className="mockup-main flex flex-col gap-3 animate-scaleIn">
                    <div className="flex gap-3">
                      <div className="flex-1 bg-surface p-3 rounded border border-border flex flex-col justify-center">
                        <span className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Total Logs</span>
                        <span className="text-lg font-bold font-mono text-primary">26</span>
                      </div>
                      <div className="flex-1 bg-surface p-3 rounded border border-border flex flex-col justify-center">
                        <span className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Active Streak</span>
                        <span className="text-lg font-bold font-mono text-secondary">5 Days</span>
                      </div>
                    </div>
                    <div className="bg-surface p-3.5 rounded border border-border flex flex-col gap-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-primary truncate pr-4">Optimizing PostgreSQL database index configurations</span>
                        <span className="badge badge-primary font-mono text-[9px] px-2 py-0.5">PostgreSQL</span>
                      </div>
                      <p className="text-[11px] text-muted line-clamp-2 leading-relaxed">
                        Implemented composite indexing parameters on query fields, shrinking nested join response times from 340ms to 12ms.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* =========================================
            Statistics Section
            ========================================= */}
        <section className="stats-section section container animate-fadeInUp">
          <div className="stats-grid">
            {[
              { label: 'Total Entries Logged', val: '26+' },
              { label: 'Learning Streak', val: '5 Days' },
              { label: 'Technologies Monitored', val: '8 Stack' },
              { label: 'Weekly Addition Rate', val: '4 Logs' }
            ].map(stat => (
              <div key={stat.label} className="stat-card glass-card text-center p-6">
                <h4 className="text-3xl font-bold font-mono text-primary mb-1">{stat.val}</h4>
                <span className="text-xs text-muted">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            Testimonials Section
            ========================================= */}
        <section className="testimonials-section section container">
          <div className="text-center mb-16">
            <h2 className="text-3xl mb-4 font-heading font-semi text-primary">Loved by Developers</h2>
            <p className="text-muted max-w-xl mx-auto text-sm">See how documentation habits change careers.</p>
          </div>

          <div className="grid grid-3 gap-6">
            {[
              {
                quote: "DevDiary turned my scattered notes and bookmark lists into a secure, searchable journal.",
                author: "Sarah Jenkins",
                role: "Senior React Architect"
              },
              {
                quote: "I can query coding syntax I logged 3 months ago in a split second. The previewer is super handy.",
                author: "Marcus Chen",
                role: "Full-Stack Node.js Engineer"
              },
              {
                quote: "The streak meters and goals timeline make recording daily takeaways incredibly satisfying.",
                author: "Elena Rostova",
                role: "Frontend Developer"
              }
            ].map((t, index) => (
              <div key={index} className="testimonial-card glass-card p-6 flex-col gap-4">
                <p className="text-sm italic text-secondary leading-relaxed">"{t.quote}"</p>
                <div className="flex-col">
                  <span className="text-xs font-bold text-primary">{t.author}</span>
                  <span className="text-[10px] text-muted">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================
            CTA Section
            ========================================= */}
        <section className="cta-section container mb-24">
          <div className="cta-card text-center relative overflow-hidden glass-card-solid">
            <div className="relative z-10 p-12">
              <h2 className="text-3xl font-heading font-bold mb-4 text-primary">
                Build Your Ultimate Knowledge Base Today
              </h2>
              <p className="text-muted text-sm max-w-md mx-auto mb-8">
                Build consistency, organize obscure developer tips, and accelerate your coding career.
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/register">
                  <Button variant="primary" size="xl" className="hover-lift btn-purple-gradient">Create Account</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="xl" className="hover-lift btn-metallic-border">Login</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}

export default Landing
