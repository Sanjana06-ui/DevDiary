import './SearchBar.css'

/**
 * SearchBar Component
 * @param {string}   value       - Controlled input value
 * @param {function} onChange    - Change handler
 * @param {string}   placeholder
 * @param {string}   className
 */
const SearchBar = ({
  value       = '',
  onChange,
  placeholder = 'Search entries...',
  className   = '',
}) => {
  return (
    <div className={`search-bar ${className}`}>
      <span className="search-bar__icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </span>
      <input
        id="search-input"
        type="text"
        className="search-bar__input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label="Search"
      />
    </div>
  )
}

export default SearchBar
