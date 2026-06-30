import './StatsCard.css'

const StatsCard = ({
  title      = 'Stat',
  value      = 0,
  icon,
  trend      = 'neutral',
  trendValue = '',
  className  = '',
}) => {
  return (
    <div className={`stats-card glass-card hover-lift ${className}`}>
      <div className="stats-card__header flex items-start justify-between mb-4">
        <p className="stats-card__title text-sm text-muted font-medium">{title}</p>
        <div className="stats-card__icon bg-surface-3">
          {icon}
        </div>
      </div>
      <div className="stats-card__body">
        <h3 className="stats-card__value text-3xl font-bold text-primary-text mb-2">{value}</h3>
        {trendValue && (
          <div className="flex items-center gap-1">
            <span className={`stats-card__trend text-xs font-semi stats-card__trend--${trend} flex items-center`}>
              {trend === 'up' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>}
              {trend === 'down' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>}
              <span className="ml-1">{trendValue}</span>
            </span>
            <span className="text-xs text-muted">vs last week</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsCard
