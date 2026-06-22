import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarHeart, Image as ImageIcon } from 'lucide-react';
import { BookingWidget } from './components/BookingWidget';
import { Gallery } from './components/Gallery';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageSwitch } from './components/LanguageSwitch';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useLanguage } from './context/LanguageContext';
import './index.css';

function BookingPage() {
  const [activeTab, setActiveTab] = useState<'booking' | 'gallery'>('booking');
  const { t } = useLanguage();

  return (
    <div className="app-container" id="main-content" role="main">
      <div className="header-controls">
        <LanguageSwitch />
        <ThemeToggle />
      </div>

      <div className="main-tabs">
        <button
          className={`main-tab-btn ${activeTab === 'booking' ? 'active' : ''}`}
          onClick={() => setActiveTab('booking')}
        >
          <CalendarHeart size={18} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
          {t('tabBooking')}
        </button>
        <button
          className={`main-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          <ImageIcon size={18} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
          {t('tabGallery')}
        </button>
      </div>

      <ErrorBoundary>
        <AnimatePresence mode="wait">
          {activeTab === 'booking' ? (
            <motion.div
              key="booking"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <BookingWidget />
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Gallery />
            </motion.div>
          )}
        </AnimatePresence>
      </ErrorBoundary>

      <PWAInstallPrompt />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{
          className: 'toast-custom',
          duration: 3000,
        }}
      />
    </BrowserRouter>
  );
}

export default App;
