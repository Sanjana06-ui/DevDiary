import { useNavigate } from 'react-router-dom'
import './EntryCard.css'

const EntryCard = ({ entry, onTogglePin, onToggleFavorite, onDelete }) => {
  const navigate = useNavigate()
  const { id, title, description, tech, difficulty, date, pinned, favorite, readingTime, tags } = entry

  const getDifficultyColor = (diff) => {
    switch (diff ? diff.toLowerCase() : '') {
      case 'easy':
      case 'beginner':
        return 'badge-success'
      case 'medium':
      case 'intermediate':
        return 'badge-warning'
      case 'hard':
      case 'advanced':
        return 'badge-error'
      default:
        return 'badge-muted'
    }
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    navigate(`/edit-entry/${id}`)
  }

  return (
    <div className={`entry-card glass-card flex-col h-full justify-between ${pinned ? 'entry-card--pinned' : ''}`}>
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-2 items-center flex-wrap">
            <span className="badge badge-primary">{tech}</span>
            <span className={`badge ${getDifficultyColor(difficulty)}`}>{difficulty}</span>
            {readingTime && <span className="text-[11px] text-muted">{readingTime} min read</span>}
          </div>
          <div className="flex gap-1">
            {onTogglePin && (
              <button 
                className={`btn-icon btn-icon-xs ${pinned ? 'text-primary' : 'text-muted'}`} 
                onClick={(e) => { e.stopPropagation(); onTogglePin(id); }}
                title={pinned ? "Unpin entry" : "Pin entry"}
                aria-label="Pin entry"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </button>
            )}
            {onToggleFavorite && (
              <button 
                className={`btn-icon btn-icon-xs ${favorite ? 'text-warning' : 'text-muted'}`} 
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(id); }}
                title={favorite ? "Remove from favorites" : "Add to favorites"}
                aria-label="Favorite entry"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </button>
            )}
          </div>
        </div>
        
        <h3 className="text-base font-bold mb-2 line-clamp-2" title={title}>{title}</h3>
        <p className="text-sm text-secondary line-clamp-3 mb-4">
          {description}
        </p>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.map(tag => (
              <span key={tag} className="text-[10px] bg-surface-2 border border-border px-2 py-0.5 rounded text-secondary">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
        <p className="text-xs text-muted">{date}</p>
        <div className="flex gap-2">
          <button className="btn-icon" onClick={handleEditClick} aria-label="Edit entry" title="Edit entry">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          {onDelete && (
            <button 
              className="btn-icon text-error hover:bg-[rgba(239,68,68,0.1)] hover:border-error" 
              onClick={(e) => { e.stopPropagation(); onDelete(id); }}
              aria-label="Delete entry"
              title="Delete entry"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EntryCard
