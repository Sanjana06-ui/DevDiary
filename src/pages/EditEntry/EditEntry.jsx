import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Sidebar from '../../components/Sidebar/Sidebar'
import Button from '../../components/Button/Button'
import EntryCard from '../../components/EntryCard/EntryCard'
import entryService from '../../services/entry.service'
import './EditEntry.css'

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
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="preview-inline-code">$1</code>')
    .replace(/^### (.*$)/gim, '<h5 class="text-sm font-bold mt-2 mb-1">$1</h5>')
    .replace(/^## (.*$)/gim, '<h4 class="text-base font-bold mt-3 mb-1 text-primary">$1</h4>')
    .replace(/\n/g, '<br />')
  return html
}

const popularTechs = ['React', 'TypeScript', 'CSS', 'Node.js', 'Docker', 'Git']
const popularTags = ['Hooks', 'Layout', 'Performance', 'Database', 'Security', 'Caching', 'Testing']

const EditEntry = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [originalData, setOriginalData] = useState(null)
  const [originalTags, setOriginalTags] = useState([])
  
  const [formData, setFormData] = useState({
    title: '',
    tech: '',
    difficulty: 'Intermediate',
    date: '',
    description: '',
    takeaways: '',
    resource: '',
  })
  
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})
  const [charCount, setCharCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [successToast, setSuccessToast] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [readingTime, setReadingTime] = useState(1)

  const maxDescriptionLength = 500

  // Load Prefill Data from our Local Storage Database
  useEffect(() => {
    const loadEntry = async () => {
      try {
        const entry = await entryService.getById(id)
        if (!entry) {
          triggerToast('Learning log not found', 'error')
          navigate('/entries')
          return
        }
        setOriginalData(entry)
        setOriginalTags(entry.tags || [])
        
        setFormData({
          title: entry.title,
          tech: entry.tech,
          difficulty: entry.difficulty,
          date: entry.date,
          description: entry.description,
          takeaways: entry.takeaways,
          resource: entry.resource,
        })
        setTags(entry.tags || [])
        setCharCount(entry.description.length)
        setErrors({})
      } catch (err) {
        console.error(err)
        navigate('/entries')
      }
    }
    loadEntry()
  }, [id])

  // Calculate estimated reading time in real-time
  useEffect(() => {
    const words = formData.description.trim().split(/\s+/).filter(w => w.length > 0).length
    const minutes = Math.max(1, Math.ceil(words / 150))
    setReadingTime(minutes)
  }, [formData.description])

  // Track if changes are modified compared to loaded prefilled data
  const isModified = originalData && (
    formData.title !== originalData.title ||
    formData.tech !== originalData.tech ||
    formData.difficulty !== originalData.difficulty ||
    formData.date !== originalData.date ||
    formData.description !== originalData.description ||
    formData.takeaways !== originalData.takeaways ||
    formData.resource !== originalData.resource ||
    JSON.stringify(tags) !== JSON.stringify(originalTags)
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleDescriptionChange = (e) => {
    const { value } = e.target
    if (value.length <= maxDescriptionLength) {
      setFormData((prev) => ({
        ...prev,
        description: value
      }))
      setCharCount(value.length)
      
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
      setTags([...tags, cleanTag])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleReset = () => {
    if (originalData) {
      setFormData({
        title: originalData.title,
        tech: originalData.tech,
        difficulty: originalData.difficulty,
        date: originalData.date,
        description: originalData.description,
        takeaways: originalData.takeaways,
        resource: originalData.resource,
      })
      setTags(originalData.tags || [])
      setCharCount(originalData.description.length)
      setTagInput('')
      setErrors({})
    }
  }

  const handleCancelClick = () => {
    if (isModified) {
      setShowCancelModal(true)
    } else {
      navigate('/entries')
    }
  }

  const handleAutoSummarize = () => {
    const desc = formData.description.trim()
    if (!desc) {
      setErrors(prev => ({ ...prev, takeaways: 'Enter description text first to auto-summarize.' }))
      return
    }
    const sentences = desc.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0)
    const summary = sentences.slice(0, 3).map(s => `• ${s}.`).join('\n')
    setFormData(prev => ({ ...prev, takeaways: summary }))
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
      await entryService.update(id, {
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

      setTimeout(() => {
        setSuccessToast(false)
        navigate('/entries')
      }, 1500)
    } catch (err) {
      setIsSaving(false)
      setErrors(prev => ({ ...prev, submit: 'Failed to update learning entry.' }))
    }
  }

  // Helper to highlight modified fields
  const isFieldModified = (name) => {
    if (!originalData) return false
    if (name === 'tags') {
      return JSON.stringify(tags) !== JSON.stringify(originalTags)
    }
    return formData[name] !== originalData[name]
  }

  return (
    <>
      <Navbar isAuth={true} />
      
      <div className="page-with-sidebar" id="edit-entry-page">
        <Sidebar />
        
        <main className="main-content">
          <div className="container-wide">
            
            <div className="edit-entry-container">
              
              {/* --- Page Header --- */}
              <header className="dashboard-header mb-6">
                <div className="flex items-center gap-2 text-sm text-primary font-semi mb-3">
                  <Link to="/dashboard" className="hover:text-primary-light transition-colors">Dashboard</Link>
                  <span className="text-muted">/</span>
                  <Link to="/entries" className="hover:text-primary-light transition-colors">My Entries</Link>
                  <span className="text-muted">/</span>
                  <span className="text-muted">Edit Log</span>
                </div>
                
                <div className="flex justify-between items-center flex-wrap gap-4 w-full">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">Edit Learning Entry</h1>
                    <p className="text-muted text-sm">Refine technical parameters, links, or takeaways details.</p>
                  </div>

                  <div className="flex gap-2 items-center flex-wrap">
                    {originalData && originalData.lastEdited && (
                      <span className="text-xs text-muted">Edited: {new Date(originalData.lastEdited).toLocaleDateString()}</span>
                    )}
                    {isModified && (
                      <div className="glass-card-solid py-1.5 px-3.5 rounded-full border border-warning border-opacity-35 flex items-center gap-2 animate-fadeInUp shadow-sm">
                        <span className="dot dot-warning" aria-hidden="true"></span>
                        <span className="text-xs font-semi text-warning uppercase tracking-wide">Unsaved Changes</span>
                      </div>
                    )}
                  </div>
                </div>
              </header>

              {/* --- Grid Layout --- */}
              <div className="edit-entry-grid">
                
                {/* --- Form Panel --- */}
                <div className="form-panel glass-card-solid">
                  <form onSubmit={handleSubmit} className="flex-col gap-6" noValidate>
                    
                    {/* Learning Title */}
                    <div className="form-group">
                      <label className="form-label" htmlFor="title">
                        Learning Title <span className="required">*</span>
                        {isFieldModified('title') && <span className="text-[10px] text-warning ml-2 font-normal">(Modified)</span>}
                      </label>
                      <input 
                        type="text" 
                        id="title" 
                        name="title" 
                        className={`input ${errors.title ? 'input-error' : ''} ${isFieldModified('title') ? 'border-warning' : ''}`}
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
                          {isFieldModified('tech') && <span className="text-[10px] text-warning ml-2 font-normal">(Modified)</span>}
                        </label>
                        <select 
                          id="tech" 
                          name="tech" 
                          className={`select ${errors.tech ? 'input-error' : ''} ${isFieldModified('tech') ? 'border-warning' : ''}`}
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
                          {isFieldModified('date') && <span className="text-[10px] text-warning ml-2 font-normal">(Modified)</span>}
                        </label>
                        <input 
                          type="date" 
                          id="date" 
                          name="date" 
                          className={`input ${isFieldModified('date') ? 'border-warning' : ''}`}
                          value={formData.date}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Difficulty Segmented Control */}
                    <div className="form-group">
                      <span className="form-label">
                        Difficulty <span className="required">*</span>
                        {isFieldModified('difficulty') && <span className="text-[10px] text-warning ml-2 font-normal">(Modified)</span>}
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
                          {isFieldModified('description') && <span className="text-[10px] text-warning ml-2 font-normal">(Modified)</span>}
                        </label>
                        <span className={`char-counter text-xs ${charCount >= maxDescriptionLength ? 'text-error' : 'text-muted'}`}>
                          {charCount} / {maxDescriptionLength}
                        </span>
                      </div>
                      <textarea 
                        id="description" 
                        name="description" 
                        className={`textarea ${errors.description ? 'input-error' : ''} ${isFieldModified('description') ? 'border-warning' : ''}`}
                        placeholder="What did you learn? Describe in detail..."
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
                        {isFieldModified('tags') && <span className="text-[10px] text-warning ml-2 font-normal">(Modified)</span>}
                      </label>
                      <div 
                        className={`tags-input-container input ${isFieldModified('tags') ? 'border-warning' : ''}`}
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

                    {/* Key Takeaways */}
                    <div className="form-group">
                      <div className="flex justify-between items-center">
                        <label className="form-label" htmlFor="takeaways">
                          Key Takeaways <span className="required">*</span>
                          {isFieldModified('takeaways') && <span className="text-[10px] text-warning ml-2 font-normal">(Modified)</span>}
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
                        className={`textarea ${errors.takeaways ? 'input-error' : ''} ${isFieldModified('takeaways') ? 'border-warning' : ''}`}
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
                        {isFieldModified('resource') && <span className="text-[10px] text-warning ml-2 font-normal">(Modified)</span>}
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
                          className={`input ${errors.resource ? 'input-error' : ''} ${isFieldModified('resource') ? 'border-warning' : ''}`}
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
                        disabled={!isModified}
                        className="flex-grow hover-lift"
                      >
                        Update Entry
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleReset} 
                        disabled={!isModified}
                        className="hover-lift"
                      >
                        Reset Changes
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
                          id: parseInt(id) || 9999,
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

      {/* Discard Confirmation Modal Overlay */}
      {showCancelModal && (
        <div className="overlay animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal animate-scaleIn">
            <div className="modal-header">
              <h3 id="modal-title" className="text-xl font-bold">Discard Unsaved Changes?</h3>
              <button 
                type="button"
                className="btn-icon" 
                onClick={() => setShowCancelModal(false)}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p className="text-sm text-secondary">
                You have modified this learning entry. Discarding will revert all your updates. Are you sure you want to proceed?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost btn-sm" onClick={() => setShowCancelModal(false)}>Keep Editing</button>
              <button className="btn btn-danger btn-sm" onClick={() => { setShowCancelModal(false); navigate('/entries'); }}>Discard Changes</button>
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
              <p className="font-semi text-primary">Entry Updated!</p>
              <p className="text-xs text-muted">Learning entry updated successfully!</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EditEntry
