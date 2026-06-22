import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown } from 'lucide-react';
import heroImg from '../assets/hero.png';

interface HeroProps {
  onBookClick: () => void;
}

export function Hero({ onBookClick }: HeroProps) {
  const { t } = useLanguage();

  return (
    <div className="hero-section">
      <div 
        className="hero-background" 
        style={{ backgroundImage: `url(${heroImg})` }}
      />
      <div className="hero-overlay" />
      
      <div className="hero-content">
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t('heroTitle')}
        </motion.h1>
        
        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {t('heroSubtitle')}
        </motion.p>
        
        <motion.button 
          className="btn hero-btn"
          onClick={onBookClick}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {t('heroCta')}
        </motion.button>
      </div>

      <motion.div 
        className="hero-scroll-indicator"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown size={32} />
      </motion.div>
    </div>
  );
}
