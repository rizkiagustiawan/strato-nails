-- Strato Nails Database Schema for Vercel Postgres / Neon

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  booking_id VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  contact VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  treatment VARCHAR(100) NOT NULL,
  budget VARCHAR(50),
  payment_method VARCHAR(20) DEFAULT 'Transfer',
  photo_url TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON bookings(booking_id);

-- Stats view
CREATE OR REPLACE VIEW booking_stats AS
SELECT
  COUNT(*) as total_bookings,
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
  COUNT(*) FILTER (WHERE date = CURRENT_DATE) as today,
  COUNT(*) FILTER (WHERE date >= CURRENT_DATE AND date <= CURRENT_DATE + INTERVAL '7 days') as this_week
FROM bookings;
