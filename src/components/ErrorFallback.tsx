import { AlertOctagon } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="error-fallback">
      <span className="error-fallback-icon"><AlertOctagon size={48} className="text-warning" /></span>
      <h2 className="error-fallback-title">Something went wrong</h2>
      <p className="error-fallback-message">{error.message}</p>
      <div className="error-fallback-actions">
        <button className="btn" onClick={resetError}>
          Try Again
        </button>
        <button className="btn btn-secondary" onClick={() => window.location.reload()}>
          Reload Page
        </button>
      </div>
    </div>
  );
}
