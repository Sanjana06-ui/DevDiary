import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import Button from '../../components/Button/Button'
import EntryCard from '../../components/EntryCard/EntryCard'
import entryService from '../../services/entry.service'
import './AddEntry.css'

// Helper to get today's date in local YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// Helper to format date display (e.g. "Jun 30, 2026")
const formatDateDisplay = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00') // Force midnight in local timezone
  if (isNaN(date.getTime())) return ''
  const options = { month: 'short', day: '2-digit', year: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

// Simple Markdown to HTML Parser
const parseMarkdownToHtml = (text) => {
  if (!text) return ''
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*([^*]+)\*/g, '<em>$1</em>') // Italic
    .replace(/`([^`]+)`/g, '<code class="preview-inline-code">$1</code>') // Inline Code
    .replace(/^### (.*$)/gim, '<h5 class="text-sm font-bold mt-2 mb-1">$1</h5>') // Headings
    .replace(/^## (.*$)/gim, '<h4 class="text-base font-bold mt-3 mb-1 text-primary">$1</h4>')
    .replace(/\n/g, '<br />')
  return html
}

const popularTechs = ['React', 'TypeScript', 'CSS', 'Node.js', 'Docker', 'Git']
const popularTags = ['Hooks', 'Layout', 'Performance', 'Database', 'Security', 'Caching', 'Testing']

const AddEntry = () => {
  const navigate = useNavigate()
  
  const initialFormState = {
    title: '',
    tech: '',
    difficulty: 'Intermediate',
    date: getTodayDateString(),
    description: '',
    takeaways: '',
    resource: '',
  }

  const [formData, setFormData] = useState(initialFormState)
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})
  const [charCount, setCharCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [successToast, setSuccessToast] = useState(false)
  
  // Unsaved Changes States
  const [isDirty, setIsDirty] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  
  // Estimated Reading Time State
  const [readingTime, setReadingTime] = useState(1)

  const maxDescriptionLength = 500

  // Calculate estimated reading time in real-time
  useEffect(() => {
    const words = formData.description.trim().split(/\s+/).filter(w => w.length > 0).length
    const minutes = Math.max(1, Math.ceil(words / 150)) // 150 words per minute estimation
    setReadingTime(minutes)
  }, [formData.description])

  // Track if changes have been made
  const checkIsDirty = (newData) => {
    const isDifferent = Object.keys(initialFormState).some(key => newData[key] !== initialFormState[key])
    setIsDirty(isDifferent || tags.length > 0)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const updated = {
      ...formData,
      [name]: value
    }
    setFormData(updated)
    checkIsDirty(updated)
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleDescriptionChange = (e) => {
    const { value } = e.target
    if (value.length <= maxDescriptionLength) {
      const updated = {
        ...formData,
        description: value
      }
      setFormData(updated)
      setCharCount(value.length)
      checkIsDirty(updated)
      
      if (errors.description) {
        setErrors((prev) => ({ ...prev, description: null }))
      }
    }
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      e.preventDefault()
      addTag()
    }
  }

  const handleTagBlur = () => {
    addTag()
  }

  const addTag = (specifiedTag = null) => {
    const tagToAdd = specifiedTag || tagInput
    const cleanTag = tagToAdd.trim().replace(/,/g, '')
    if (cleanTag && !tags.includes(cleanTag)) {
      const updatedTags = [...tags, cleanTag]
      setTags(updatedTags)
      setTagInput('')
      setIsDirty(true)
    }
  }

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove)
    setTags(updatedTags)
    setIsDirty(updatedTags.length > 0 || Object.keys(initialFormState).some(key => formData[key] !== initialFormState[key]))
  }

  const handleReset = () => {
    setFormData(initialFormState)
    setTags([])
    setTagInput('')
    setErrors({})
    setCharCount(0)
    setIsDirty(false)
  }

  const handleCancelClick = () => {
    if (isDirty) {
      setShowCancelModal(true)
    } else {
      navigate('/dashboard')
    }
  }

  const handleAutoSummarize = () => {
    const desc = formData.description.trim()
    if (!desc) {
      setErrors(prev => ({ ...prev, takeaways: 'Enter description text first to auto-summarize.' }))
      return
    }
    
    // Auto-generate key takeaways by splitting sentences or counting text parts
    const sentences = desc.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0)
    const summary = sentences.slice(0, 3).map(s => `• ${s}.`).join('\n')
    
    setFormData(prev => ({ ...prev, takeaways: summary }))
    setIsDirty(true)
    if (errors.takeaways) {
      setErrors(prev => ({ ...prev, takeaways: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Learning title is required'
    }
    if (!formData.tech) {
      newErrors.tech = 'Technology is required'
    }
    if (!formData.difficulty) {
      newErrors.difficulty = 'Difficulty is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.takeaways.trim()) {
      newErrors.takeaways = 'Key takeaways are required'
    }

    if (formData.resource.trim()) {
      let urlStr = formData.resource.trim()
      if (!/^https?:\/\//i.test(urlStr)) {
        urlStr = 'https://' + urlStr
      }
      try {
        new URL(urlStr)
      } catch (err) {
        newErrors.resource = 'Please enter a valid URL (e.g., https://example.com)'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      const firstErrorKey = Object.keys(errors)[0]
      if (firstErrorKey) {
        const errorElement = document.getElementById(firstErrorKey)
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
      return
    }

    setIsSaving(true)

    try {
      // Save actually to our local database!
      await entryService.create({
        title: formData.title.trim(),
        tech: formData.tech,
        difficulty: formData.difficulty,
        date: formData.date,
        description: formData.description.trim(),
        takeaways: formData.takeaways.trim(),
        resource: formData.resource.trim(),
        tags
      })
      
      setIsSaving(false)
      setSuccessToast(true)
      setIsDirty(false)

      setTimeout(() => {
        setSuccessToast(false)
        navigate('/entries')
      }, 1500)
    } catch (err) {
      setIsSaving(false)
      setErrors(prev => ({ ...prev, submit: 'Failed to create learning entry.' }))
    }
  }

  return (
    <>
      <Navbar isAuth={true} />
      
      <div className="page-with-sidebar" id="add-entry-page">
        <Sidebar />
        
        <main className="main-content">
          <div className="container-wide">
            
            <div className="add-entry-container">
              
              {/* --- Page Header --- */}
              <header className="dashboard-header mb-6">
                <div className="flex items-center gap-2 text-sm text-primary font-semi mb-3">
                  <Link to="/dashboard" className="hover:text-primary-light transition-colors">Dashboard</Link>
                  <span className="text-muted">/</span>
                  <span className="text-muted">New Log</span>
                </div>
                
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">Add Learning Entry</h1>
                    <p className="text-muted text-sm">Document technical discoveries and takeaways for your streak progress.</p>
                  </div>
                  {isDirty && (
                    <span className="badge badge-warning animate-pulse-glow">Unsaved Changes</span>
                  )}
                </div>
              </header>

              {/* --- Grid Layout --- */}
              <div className="add-entry-grid">
                
                {/* --- Form Panel --- */}
                <div className="form-panel glass-card-solid">
                  <form onSubmit={handleSubmit} className="flex-col gap-6" noValidate>
                    
                    {/* Learning Title */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="title">
                        Learning Title <span className="required">*</span>
                      </label>
                      <input 
                        type="text" 
                        id="title" 
                        name="title" 
                        className={`input ${errors.title ? 'input-error' : ''}`}
                        placeholder="e.g., Understanding React Server Components"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                      {errors.title && (
                        <span className="form-error">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                          {errors.title}
                        </span>
                      )}
                    </div>

                    {/* Technology & Learning Date */}
                    <div className="grid grid-2 gap-6">
                      
                      {/* Technology Select */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="tech">
                          Technology <span className="required">*</span>
                        </label>
                        <select 
                          id="tech" 
                          name="tech" 
                          className={`select ${errors.tech ? 'input-error' : ''}`}
                          value={formData.tech}
                          onChange={handleInputChange}
                        >
                          <option value="" disabled>Select technology</option>
                          <option value="React">React</option>
                          <option value="JavaScript">JavaScript</option>
                          <option value="TypeScript">TypeScript</option>
                          <option value="Node.js">Node.js</option>
                          <option value="Express.js">Express.js</option>
                          <option value="MongoDB">MongoDB</option>
                          <option value="HTML">HTML</option>
                          <option value="CSS">CSS</option>
                          <option value="Git">Git</option>
                          <option value="DevOps">DevOps</option>
                          <option value="Database">Database</option>
                          <option value="Build Tools">Build Tools</option>
                          <option value="Security">Security</option>
                          <option value="Testing">Testing</option>
                          <option value="Other">Other</option>
                        </select>

                        {/* Tech suggestions */}
                        <div className="suggestion-pills mt-1 flex flex-wrap gap-1">
                          <span className="text-[10px] text-muted mr-1 self-center">Popular:</span>
                          {popularTechs.map(t => (
                            <button
                              key={t}
                              type="button"
                              className="badge badge-muted text-[10px] hover:border-primary-light"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, tech: t }));
                                setIsDirty(true);
                                if (errors.tech) setErrors(prev => ({ ...prev, tech: null }));
                              }}
                            >
                              {t}
                            </button>
                          ))}
                        </div>

                        {errors.tech && (
                          <span className="form-error">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            {errors.tech}
                          </span>
                        )}
                      </div>

                      {/* Learning Date */}
                      <div className="form-group">
                        <label className="form-label" htmlFor="date">
                          Learning Date <span className="required">*</span>
                        </label>
                        <input 
                          type="date" 
                          id="date" 
                          name="date" 
                          className="input"
                          value={formData.date}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Difficulty Segmented Control */}
                    <div className="form-group">
                      <span className="form-label">
                        Difficulty <span className="required">*</span>
                      </span>
                      <div className="difficulty-selector" role="radiogroup" aria-label="Select difficulty level">
                        {['Beginner', 'Intermediate', 'Advanced'].map((diff) => {
                          const isActive = formData.difficulty === diff
                          return (
                            <label 
                              key={diff} 
                              className={`difficulty-option ${isActive ? 'active' : ''}`}
                            >
                              <input 
                                type="radio" 
                                name="difficulty" 
                                value={diff}
                                checked={isActive}
                                onChange={handleInputChange}
                                className="hidden-radio"
                              />
                              {diff}
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    {/* Description Textarea */}
                    <div className="form-group">
                      <div className="flex justify-between items-center">
                        <label className="form-label" htmlFor="description">
                          Description (Markdown supported) <span className="required">*</span>
                        </label>
                        <span className={`char-counter text-xs ${charCount >= maxDescriptionLength ? 'text-error' : 'text-muted'}`}>
                          {charCount} / {maxDescriptionLength}
                        </span>
                      </div>
                      <textarea 
                        id="description" 
                        name="description" 
                        className={`textarea ${errors.description ? 'input-error' : ''}`}
                        placeholder="Detail what you learned today. Use **bold**, *italics*, and `code` tags to preview."
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        maxLength={maxDescriptionLength}
                      />
                      {errors.description && (
                        <span className="form-error">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                          {errors.description}
                        </span>
                      )}
                    </div>

                    {/* Multi-tag input */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="tags-input">
                        Tags
                      </label>
                      <div 
                        className="tags-input-container input"
                        onClick={() => document.getElementById('tags-input').focus()}
                      >
                        <div className="tags-list">
                           {tags.map((tag) => (
                            <span className="tag" key={tag}>
                              #{tag}
                              <button 
                                type="button" 
                                className="tag-remove" 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeTag(tag)
                                }} 
                                aria-label={`Remove tag ${tag}`}
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                          <input 
                            type="text" 
                            id="tags-input" 
                            placeholder={tags.length === 0 ? "Press Enter or comma to append" : ""}
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            onBlur={handleTagBlur}
                            className="tag-input-field"
                          />
                        </div>
                      </div>
                      
                      {/* Tag Suggestions */}
                      <div className="suggestion-pills mt-1 flex flex-wrap gap-1">
                        <span className="text-[10px] text-muted mr-1 self-center">Suggestions:</span>
                        {popularTags.map(tag => (
                          <button
                            key={tag}
                            type="button"
                            className="badge badge-muted text-[10px] hover:border-secondary-light"
                            disabled={tags.includes(tag)}
                            onClick={() => addTag(tag)}
                          >
                            +{tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Key Takeaways with Auto-Summarizer */}
                    <div className="form-group">
                      <div className="flex justify-between items-center">
                        <label className="form-label" htmlFor="takeaways">
                          Key Takeaways <span className="required">*</span>
                        </label>
                        <button 
                          type="button" 
                          className="btn btn-secondary btn-xs flex gap-1 items-center" 
                          onClick={handleAutoSummarize}
                          title="Generate summaries automatically from Description text"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                          Auto-Summarize
                        </button>
                      </div>
                      <textarea 
                        id="takeaways" 
                        name="takeaways" 
                        className={`textarea ${errors.takeaways ? 'input-error' : ''}`}
                        placeholder="Write key takeaways or main points (one per line)..."
                        value={formData.takeaways}
                        onChange={handleInputChange}
                      />
                      {errors.takeaways && (
                        <span className="form-error">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                          {errors.takeaways}
                        </span>
                      )}
                    </div>

                    {/* Optional URL Input */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="resource">
                        Resource URL
                      </label>
                      <div className="input-wrap">
                        <span className="input-icon-left">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                          </svg>
                        </span>
                        <input 
                          type="text" 
                          id="resource" 
                          name="resource" 
                          className={`input ${errors.resource ? 'input-error' : ''}`}
                          placeholder="https://reactjs.org/docs"
                          value={formData.resource}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.resource && (
                        <span className="form-error">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                          {errors.resource}
                        </span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-6">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        loading={isSaving} 
                        className="flex-1 hover-lift"
                      >
                        Save Entry
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleReset} 
                        className="hover-lift"
                      >
                        Reset
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={handleCancelClick} 
                        className="hover-lift"
                      >
                        Cancel
                      </Button>
                    </div>

                  </form>
                </div>

                {/* --- Live Preview Panel --- */}
                <div className="preview-panel">
                  <div className="preview-sticky">
                    
                    <div className="preview-header flex items-center justify-between mb-4">
                      <span className="text-sm font-semi text-muted uppercase tracking-wide">Live Preview</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-secondary font-medium">{readingTime} min read</span>
                        <span className="dot dot-success animate-pulse-glow" aria-hidden="true"></span>
                      </div>
                    </div>

                    {/* Render standard EntryCard */}
                    <div className="preview-card-wrap">
                      <EntryCard 
                        entry={{
                          id: 9999,
                          title: formData.title || 'Untitled Learning Entry',
                          description: formData.description || 'Describe what you learned today. This section supports standard HTML markdown parsing in real-time.',
                          tech: formData.tech || 'Technology',
                          difficulty: formData.difficulty,
                          date: formatDateDisplay(formData.date),
                          readingTime
                        }}
                      />
                    </div>

                    {/* Extended Details Preview */}
                    <div className="extended-preview glass-card-solid">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">Extended Details</h4>
                      
                      {/* Markdown Preview Area */}
                      <div className="mb-4">
                        <h5 className="text-xs font-bold text-primary mb-1">Markdown Render</h5>
                        <div 
                          className="text-sm text-secondary leading-relaxed bg-surface-2 p-3 rounded border border-border mt-1"
                          dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(formData.description) || '<i>No description entered yet.</i>' }}
                        ></div>
                      </div>

                      {/* Tags Preview */}
                      <div className="mb-4">
                        <h5 className="text-xs font-bold text-primary mb-1">Tags</h5>
                        {tags.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((t) => (
                              <span className="badge badge-secondary" key={t}>#{t}</span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted italic">No tags added yet</p>
                        )}
                      </div>

                      {/* Key Takeaways Preview */}
                      <div className="mb-4">
                        <h5 className="text-xs font-bold text-primary mb-1">Key Takeaways</h5>
                        {formData.takeaways.trim() ? (
                          <ul className="takeaways-preview-list flex-col gap-1">
                            {formData.takeaways.split('\n').filter(line => line.trim() !== '').map((line, idx) => (
                              <li key={idx}>{line}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-muted italic">No takeaways added yet</p>
                        )}
                      </div>

                    </div>

                  </div>
                </div>

              </div>

            </div>

          </div>
        </main>
      </div>

      {/* --- Confirmation Dialog Modal --- */}
      {showCancelModal && (
        <div className="overlay animate-fadeIn" role="dialog" aria-modal="true">
          <div className="modal animate-scaleIn">
            <div className="modal-header">
              <h3 className="text-lg font-bold">Discard Unsaved Changes?</h3>
              <button className="btn-icon" onClick={() => setShowCancelModal(false)} aria-label="Close dialog">
                &times;
              </button>
            </div>
            <div className="modal-body text-sm text-secondary">
              You have made modifications to this entry. Discarding will clear all inputs. Are you sure you want to proceed?
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={() => setShowCancelModal(false)}>Keep Editing</button>
              <button className="btn btn-danger btn-sm" onClick={() => { setShowCancelModal(false); navigate('/dashboard'); }}>Discard Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      {successToast && (
        <div className="toast-container" role="status" aria-live="polite">
          <div className="toast border-primary">
            <span className="dot dot-success animate-pulse-glow" aria-hidden="true"></span>
            <div className="flex-col">
              <p className="font-semi text-primary">Entry Saved!</p>
              <p className="text-xs text-muted">Your learning entry has been added successfully.</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AddEntry
