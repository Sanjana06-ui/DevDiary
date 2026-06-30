import './StatsCard.css'

/**
 * StatsCard Component
 * @param {string} label - Stat label
 * @param {string|number} value - Stat value
 * @param {string} icon  - Emoji or icon element
 * @param {string} trend - 'up' | 'down' | 'neutral'
 * @param {string} trendValue - e.g. '+12%'
 */
const StatsCard = ({
  label      = 'Stat',
  value      = 0,
  icon       = '📊',
  trend      = 'neutral',
  trendValue = '',
  className  = '',
}) => {
  return (
    <div className={`stats-card glass-card ${className}`} role="figure" aria-label={`${label}: ${value}`}>
      <div className="stats-card__icon">{icon}</div>
      <div className="stats-card__body">
        <p className="stats-card__label">{label}</p>
        <p className="stats-card__value">{value}</p>
        {trendValue && (
          <span className={`stats-card__trend stats-card__trend--${trend}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
      </div>
    </div>
  )
}

export default StatsCard
