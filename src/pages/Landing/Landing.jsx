import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import Button from '../../components/Button/Button'
import './Landing.css'

const Landing = () => {
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
              Your Personal Learning Hub
            </div>
            <h1 className="hero__title">
              Capture Every <span className="gradient-text">Line of Learning.</span>
            </h1>
            <p className="hero__subtitle mt-6">
              DevDiary helps developers organize, revisit, and grow from everything they learn. Build your ultimate knowledge base, one snippet at a time.
            </p>
            
            <div className="hero__actions mt-8 flex flex-wrap gap-4">
              <Link to="/register">
                <Button variant="primary" size="xl" className="hover-lift">
                  Get Started Free
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="xl">
                  Learn More
                </Button>
              </a>
            </div>
          </div>
          
          <div className="hero__artwork animate-fadeIn delay-300">
            {/* Abstract Developer Workspace Illustration Placeholder */}
            <div className="hero__mockup glass-card-solid hover-float">
               <div className="mockup__header">
                 <div className="dot" style={{background: '#EF4444'}}></div>
                 <div className="dot" style={{background: '#F59E0B'}}></div>
                 <div className="dot" style={{background: '#22C55E'}}></div>
               </div>
               <div className="mockup__body">
                 <div className="skeleton mb-4" style={{width: '60%', height: '24px'}}></div>
                 <div className="skeleton mb-2" style={{width: '90%', height: '14px'}}></div>
                 <div className="skeleton mb-2" style={{width: '85%', height: '14px'}}></div>
                 <div className="skeleton mb-6" style={{width: '70%', height: '14px'}}></div>
                 
                 <div className="mockup__code">
                   <pre><code>
<span style={{color: '#8B5CF6'}}>const</span> <span style={{color: '#60A5FA'}}>grow</span> = () =&gt; {'{'}
  <span style={{color: '#22C55E'}}>// Learn daily</span>
  learnNewConcept();
  documentInsight();
  return <span style={{color: '#F59E0B'}}>"Better Developer"</span>;
{'}'}
                   </code></pre>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* =========================================
            Features Section
            ========================================= */}
        <section id="features" className="features-section section container">
          <div className="text-center mb-16">
            <h2 className="text-3xl mb-4">Built for the Modern Developer</h2>
            <p className="text-muted max-w-2xl mx-auto">
              Everything you need to turn scattered tutorials and rapid self-learning into structured, searchable knowledge.
            </p>
          </div>

          <div className="grid grid-auto gap-8">
            {/* Feature 1 */}
            <div className="feature-card glass-card hover-lift">
              <div className="feature-card__icon bg-primary-soft">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl mt-6 mb-3">Organize Learning Notes</h3>
              <p className="text-muted text-sm">
                Keep all your code snippets, architecture thoughts, and tutorial takeaways neatly organized in one focused space.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="feature-card glass-card hover-lift">
              <div className="feature-card__icon bg-secondary-soft">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 className="text-xl mt-6 mb-3">Powerful Search & Filters</h3>
              <p className="text-muted text-sm">
                Instantly find that obscure terminal command or React hook usage you learned 3 months ago with smart filtering.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="feature-card glass-card hover-lift">
              <div className="feature-card__icon bg-success-soft">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3 className="text-xl mt-6 mb-3">Track Learning Progress</h3>
              <p className="text-muted text-sm">
                Visualize your growth. See statistics on your most-used tags, entry streaks, and knowledge expansion over time.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="feature-card glass-card hover-lift">
              <div className="feature-card__icon bg-warning-soft">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3 className="text-xl mt-6 mb-3">Secure Personal Journal</h3>
              <p className="text-muted text-sm">
                Your entries are private and secure. Have a safe space to document your struggles, wins, and daily standup notes.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            How It Works Section
            ========================================= */}
        <section id="how-it-works" className="how-it-works-section section-lg">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl mb-4">How It Works</h2>
              <p className="text-muted max-w-2xl mx-auto">
                A simple workflow designed to reinforce learning.
              </p>
            </div>

            <div className="steps-container">
              {/* Step 1 */}
              <div className="step-item text-center">
                <div className="step-circle gradient-border mx-auto mb-6">
                  <span className="text-2xl font-bold gradient-text">1</span>
                </div>
                <h4 className="text-xl mb-2">Create an Account</h4>
                <p className="text-sm text-muted">Sign up quickly and get your secure workspace.</p>
              </div>

              <div className="step-connector hide-md"></div>

              {/* Step 2 */}
              <div className="step-item text-center">
                <div className="step-circle gradient-border mx-auto mb-6">
                  <span className="text-2xl font-bold gradient-text">2</span>
                </div>
                <h4 className="text-xl mb-2">Record Daily Learning</h4>
                <p className="text-sm text-muted">Jot down snippets, concepts, and daily goals.</p>
              </div>

              <div className="step-connector hide-md"></div>

              {/* Step 3 */}
              <div className="step-item text-center">
                <div className="step-circle gradient-border mx-auto mb-6">
                  <span className="text-2xl font-bold gradient-text">3</span>
                </div>
                <h4 className="text-xl mb-2">Revisit & Grow</h4>
                <p className="text-sm text-muted">Search past entries to solve present problems.</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            CTA Section
            ========================================= */}
        <section className="cta-section container mb-24">
          <div className="cta-card glass-card-solid text-center relative overflow-hidden">
            {/* Background Glows */}
            <div className="cta-glow cta-glow--1"></div>
            <div className="cta-glow cta-glow--2"></div>
            
            <div className="relative z-10 p-12">
              <h2 className="text-4xl font-bold mb-6">
                Start documenting your <br className="hide-md" /> developer journey today.
              </h2>
              <div className="flex justify-center gap-4 mt-8">
                <Link to="/register">
                  <Button variant="primary" size="xl" className="hover-lift">Create Account</Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="xl" className="hover-lift">Login</Button>
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
