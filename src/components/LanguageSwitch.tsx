import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';

export function LanguageSwitch() {
  const { language, setLanguage, t } = useLanguage();

  const handleSwitch = (lang: 'en' | 'id') => {
    if (lang !== language) {
      setLanguage(lang);
      toast.success(t('toastLanguageChanged'));
    }
  };

  return (
    <div className="lang-toggle" role="group" aria-label={t('language')}>
      <button
        className={`lang-btn ${language === 'id' ? 'active' : ''}`}
        onClick={() => handleSwitch('id')}
        aria-label={t('switchToIndonesian')}
      >
        ID
      </button>
      <button
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => handleSwitch('en')}
        aria-label={t('switchToEnglish')}
      >
        EN
      </button>
    </div>
  );
}
