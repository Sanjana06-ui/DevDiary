import './Button.css'

/**
 * Button Component
 * @param {string}   variant   - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string}   size      - 'sm' | 'md' | 'lg'
 * @param {string}   type      - HTML button type
 * @param {boolean}  disabled
 * @param {boolean}  loading
 * @param {function} onClick
 * @param {node}     children
 * @param {string}   className
 */
const Button = ({
  variant   = 'primary',
  size      = 'md',
  type      = 'button',
  disabled  = false,
  loading   = false,
  onClick,
  children,
  className = '',
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn btn--${variant} btn--${size} ${loading ? 'btn--loading' : ''} ${className}`}
      {...rest}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      <span className="btn__label">{children}</span>
    </button>
  )
}

export default Button
