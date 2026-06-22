import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <span className="not-found-icon"><SearchX size={64} className="text-primary" strokeWidth={1.5} /></span>
        <h1 className="not-found-title">404</h1>
        <p className="not-found-text">Page not found</p>
        <p className="not-found-desc">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Booking
        </Link>
      </div>
    </div>
  );
}
