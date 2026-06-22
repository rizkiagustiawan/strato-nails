import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const handleToggle = () => {
    toggleTheme();
    toast.success(
      t('toastThemeChanged', {
        theme: theme === 'light' ? 'Dark' : 'Light',
      })
    );
  };

  return (
    <button
      className="control-btn"
      onClick={handleToggle}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
