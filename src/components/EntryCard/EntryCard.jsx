import './EntryCard.css'

const EntryCard = ({ entry }) => {
  const { title, description, tech, difficulty, date } = entry

  const getDifficultyColor = (diff) => {
    switch(diff.toLowerCase()) {
      case 'easy': return 'badge-success'
      case 'medium': return 'badge-warning'
      case 'hard': return 'badge-error'
      default: return 'badge-muted'
    }
  }

  return (
    <div className="entry-card glass-card hover-lift flex-col h-full justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-2">
            <span className="badge badge-primary">{tech}</span>
            <span className={`badge ${getDifficultyColor(difficulty)}`}>{difficulty}</span>
          </div>
          <p className="text-xs text-muted">{date}</p>
        </div>
        
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-secondary line-clamp-3 mb-6">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.08)] mt-auto">
        <button className="text-xs font-semi text-primary hover:text-primary-light transition-colors">
          View Details →
        </button>
        <div className="flex gap-2">
          <button className="btn-icon" aria-label="Edit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button className="btn-icon text-error hover:bg-[rgba(239,68,68,0.1)] hover:border-error" aria-label="Delete">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default EntryCard
