import { Link } from 'react-router-dom'
import './NotFound.css'

const NotFound = () => {
  return (
    <main className="not-found-page" id="not-found-page">
      <div className="not-found-page__content">
        <span className="not-found-page__code gradient-text">404</span>
        <h1 className="not-found-page__title">Page Not Found</h1>
        <p className="not-found-page__desc">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="not-found-page__link">
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}

export default NotFound
