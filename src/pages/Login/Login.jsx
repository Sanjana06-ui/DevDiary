import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button/Button'
import './Login.css'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // UI Validation
    const newErrors = {}
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.password.trim()) newErrors.password = 'Password is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Simulate login API call
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      console.log('Login attempt with:', formData)
      // Normally redirect here
    }, 1200)
  }

  return (
    <main className="login-page">
      {/* =========================================
          Left Section: Branding & Artwork
          ========================================= */}
      <section className="login-branding">
        {/* Ambient background glows */}
        <div className="login-glow login-glow--1 animate-pulse-glow"></div>
        <div className="login-glow login-glow--2 animate-pulse-glow" style={{animationDelay: '1s'}}></div>
        
        <div className="login-branding__inner animate-fadeInLeft">
          <Link to="/" className="navbar__logo mb-12 inline-flex">
            <div className="navbar__logo-icon gradient-border">
              <span>D</span>
            </div>
            <span className="navbar__logo-text">DevDiary</span>
          </Link>
          
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg text-muted mb-12 max-w-md">
            Continue your learning journey by accessing your personal developer journal.
          </p>
          
          {/* Abstract Dev Illustration */}
          <div className="login-artwork glass-card">
            <div className="mockup__header">
              <div className="dot" style={{background: '#EF4444'}}></div>
              <div className="dot" style={{background: '#F59E0B'}}></div>
              <div className="dot" style={{background: '#22C55E'}}></div>
            </div>
            <div className="p-6 font-mono text-sm">
               <pre><code>
<span style={{color: '#8B5CF6'}}>import</span> {'{'} progress {'}'} <span style={{color: '#8B5CF6'}}>from</span> <span style={{color: '#22C55E'}}>'devdiary'</span>;

<span style={{color: '#8B5CF6'}}>async function</span> <span style={{color: '#60A5FA'}}>initializeSession</span>() {'{'}
  <span style={{color: '#64748B'}}>// Retrieve past knowledge</span>
  <span style={{color: '#8B5CF6'}}>const</span> user = <span style={{color: '#8B5CF6'}}>await</span> authenticate();
  user.resumeJourney();
{'}'}
               </code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          Right Section: Login Form
          ========================================= */}
      <section className="login-form-container">
        <div className="login-card glass-card-solid animate-fadeInRight">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Login</h2>
            <p className="text-muted text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex-col gap-5">
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email <span className="required">*</span></label>
              <div className="input-wrap">
                <span className="input-icon-left">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input 
                  id="email" 
                  name="email"
                  type="email" 
                  className={`input ${errors.email ? 'input-error' : ''}`} 
                  placeholder="developer@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && (
                <span className="form-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password <span className="required">*</span></label>
              <div className="input-wrap">
                <span className="input-icon-left">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input 
                  id="password" 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  className={`input input--has-right ${errors.password ? 'input-error' : ''}`} 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button 
                  type="button"
                  className="input-icon-right" 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="form-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  {errors.password}
                </span>
              )}
            </div>

            {/* Extras: Remember / Forgot Password */}
            <div className="flex justify-between items-center mt-1">
              <label className="check-wrap text-sm text-muted">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange} 
                />
                Remember Me
              </label>
              <a href="#" className="text-sm font-medium text-primary hover:text-primary-light transition-colors">
                Forgot Password?
              </a>
            </div>

            {/* Buttons */}
            <div className="flex-col gap-4 mt-4">
              <Button type="submit" variant="primary" className="w-full btn-lg hover-lift" loading={isLoading}>
                Login
              </Button>
              
              <div className="relative flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[rgba(255,255,255,0.08)]"></div></div>
                <span className="relative bg-surface-2 px-3 text-xs text-muted">OR</span>
              </div>
              
              <Button type="button" variant="secondary" className="w-full btn-lg hover-lift flex items-center justify-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
            </div>
          </form>

          {/* Bottom Link */}
          <div className="text-center mt-8 text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:text-primary-light transition-colors">
              Register here
            </Link>
          </div>
          
        </div>
      </section>
    </main>
  )
}

export default Login
