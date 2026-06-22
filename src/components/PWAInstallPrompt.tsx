import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="pwa-install-prompt" role="dialog" aria-label={t('installApp')}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Download size={20} className="text-primary" /> {t('installApp')}
      </h3>
      <p>{t('installDesc')}</p>
      <div className="pwa-buttons">
        <button className="btn" onClick={handleInstall}>
          {t('installBtn')}
        </button>
        <button className="btn btn-secondary" onClick={handleDismiss}>
          {t('dismissBtn')}
        </button>
      </div>
    </div>
  );
}
