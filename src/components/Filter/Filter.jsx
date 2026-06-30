import './Filter.css'

/**
 * Filter Component
 * @param {Array}    options  - [{ label, value }]
 * @param {string}   active   - Currently active filter value
 * @param {function} onChange - Called with the selected value
 * @param {string}   className
 */
const Filter = ({
  options   = [],
  active    = '',
  onChange,
  className = '',
}) => {
  return (
    <div className={`filter-group ${className}`} role="group" aria-label="Filter options">
      {options.map((opt) => (
        <button
          key={opt.value}
          id={`filter-${opt.value}`}
          className={`filter-btn ${active === opt.value ? 'filter-btn--active' : ''}`}
          onClick={() => onChange?.(opt.value)}
          aria-pressed={active === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default Filter
