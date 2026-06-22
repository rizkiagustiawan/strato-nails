import { useState, useEffect } from 'react';
import { ThemeProvider } from '../context/ThemeProvider';
import { LanguageProvider } from '../context/LanguageProvider';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminLogin } from '../components/admin/AdminLogin';
import { Toaster } from 'sonner';
import '../index.css';
import '../admin.css';

export function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  if (isLoading) return null;

  return (
    <ThemeProvider>
      <LanguageProvider>
        {token ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <AdminLogin onLogin={handleLogin} />
        )}
        <Toaster position="top-center" richColors closeButton />
      </LanguageProvider>
    </ThemeProvider>
  );
}
