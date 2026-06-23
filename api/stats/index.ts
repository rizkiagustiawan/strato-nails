import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { verifyAuth } from '../lib/auth.js';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Protect GET /stats
  const isAuthorized = await verifyAuth(req);
  if (!isAuthorized) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const [stats] = await sql('SELECT * FROM booking_stats');
    
    // Get recent bookings
    const recentBookings = await sql(
      'SELECT booking_id, name, date, time, treatment, status, created_at FROM bookings ORDER BY created_at DESC LIMIT 5'
    );

    // Get popular treatments
    const popularTreatments = await sql(
      'SELECT treatment, COUNT(*) as count FROM bookings GROUP BY treatment ORDER BY count DESC LIMIT 5'
    );

    return res.status(200).json({
      success: true,
      data: {
        stats,
        recentBookings,
        popularTreatments,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
