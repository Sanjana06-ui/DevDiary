import './EntryCard.css'

/**
 * EntryCard Component
 * @param {object} entry - { id, title, date, summary, tags, mood }
 */
const EntryCard = ({ entry = {} }) => {
  const { id, title, date, summary, tags = [], mood } = entry

  return (
    <article className="entry-card glass-card" id={`entry-card-${id}`}>
      {/* EntryCard placeholder – to be designed */}
      <div className="entry-card__header">
        <h3 className="entry-card__title">{title || 'Untitled Entry'}</h3>
        <span className="entry-card__date">{date || '--'}</span>
      </div>
      <p className="entry-card__summary">{summary || 'No summary available.'}</p>
      <div className="entry-card__footer">
        <div className="entry-card__tags">
          {tags.map((tag) => (
            <span key={tag} className="badge badge-primary">{tag}</span>
          ))}
        </div>
        {mood && <span className="entry-card__mood">{mood}</span>}
      </div>
    </article>
  )
}

export default EntryCard
