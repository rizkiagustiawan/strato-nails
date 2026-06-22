import { useState } from 'react';
import { Lock, LogIn } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (token: string) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLogin(data.data.token);
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('Connection failed. Are you offline?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', padding: '1rem' }}>
      <div className="admin-card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
          <Lock size={48} strokeWidth={1.5} />
        </div>
        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Admin Access</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem', fontSize: '0.9rem' }}>Enter your password to manage bookings.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              autoFocus
            />
            {error && <p className="error-text" style={{ marginTop: '0.5rem' }}>{error}</p>}
          </div>
          
          <button type="submit" className="btn" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading ? 'Verifying...' : <><LogIn size={18} /> Login</>}
          </button>
        </form>
      </div>
    </div>
  );
}
