import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

import img1 from '../assets/images/gallery/1.jpg';
import img2 from '../assets/images/gallery/2.jpg';
import img3 from '../assets/images/gallery/3.jpg';
import img4 from '../assets/images/gallery/4.jpg';
import img5 from '../assets/images/gallery/5.jpg';
import img6 from '../assets/images/gallery/6.jpg';
import img7 from '../assets/images/gallery/7.jpg';
import img8 from '../assets/images/gallery/8.jpg';
import img9 from '../assets/images/gallery/9.jpg';
import img10 from '../assets/images/gallery/10.jpg';
import img11 from '../assets/images/gallery/11.jpg';
import img12 from '../assets/images/gallery/12.jpg';

const galleryImages = [
  { id: 1, src: img1, alt: 'Elegant Nail Art 1' },
  { id: 2, src: img2, alt: 'Elegant Nail Art 2' },
  { id: 3, src: img3, alt: 'Elegant Nail Art 3' },
  { id: 4, src: img4, alt: 'Elegant Nail Art 4' },
  { id: 5, src: img5, alt: 'Elegant Nail Art 5' },
  { id: 6, src: img6, alt: 'Elegant Nail Art 6' },
  { id: 7, src: img7, alt: 'Elegant Nail Art 7' },
  { id: 8, src: img8, alt: 'Elegant Nail Art 8' },
  { id: 9, src: img9, alt: 'Elegant Nail Art 9' },
  { id: 10, src: img10, alt: 'Elegant Nail Art 10' },
  { id: 11, src: img11, alt: 'Elegant Nail Art 11' },
  { id: 12, src: img12, alt: 'Elegant Nail Art 12' },
];

export function Gallery() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="gallery-section">
      <div className="widget-header">
        <h2 className="widget-title">{t('galleryTitle')}</h2>
        <p className="widget-desc">{t('galleryDesc')}</p>
      </div>

      <div className="gallery-grid">
        {galleryImages.map((image) => (
          <motion.div
            key={image.id}
            className="gallery-item"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedImage(image.src)}
          >
            <img src={image.src} alt={image.alt} loading="lazy" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
              ✕
            </button>
            <motion.img
              src={selectedImage}
              alt="Full size"
              className="lightbox-image"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
