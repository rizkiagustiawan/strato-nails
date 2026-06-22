import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { verifyAuth } from '../lib/auth';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET': {
        // Protect GET /bookings
        const isAuthorized = await verifyAuth(req);
        if (!isAuthorized) {
          return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const { status, limit = '50', offset = '0' } = req.query;
        
        let query = 'SELECT * FROM bookings';
        const params: string[] = [];
        
        if (status && status !== 'all') {
          query += ' WHERE status = $1';
          params.push(status);
        }
        
        query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
        params.push(parseInt(limit as string), parseInt(offset as string));
        
        const bookings = await sql(query, params);
        
        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM bookings';
        if (status && status !== 'all') {
          countQuery += ' WHERE status = $1';
        }
        const [{ total }] = await sql(countQuery, status && status !== 'all' ? [status] : []);
        
        return res.status(200).json({
          success: true,
          data: bookings,
          pagination: {
            total: parseInt(total),
            limit: parseInt(limit as string),
            offset: parseInt(offset as string),
          },
        });
      }

      case 'POST': {
        const { name, contact, date, time, treatment, budget, payment_method, photo_url } = req.body;

        if (!name || !contact || !date || !time || !treatment) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields',
          });
        }

        // BUSINESS HOURS VALIDATION (09:00 - 20:00)
        const hour = parseInt(time.split(':')[0], 10);
        if (hour < 9 || hour >= 20) {
          return res.status(400).json({
            success: false,
            error: 'Please select a time between 09:00 and 20:00',
          });
        }

        // AVAILABILITY CHECK: Prevent double booking
        // Check if there's any active booking at the same date & time (excluding cancelled ones)
        const existingBooking = await sql(
          `SELECT booking_id FROM bookings 
           WHERE date = $1 AND time = $2 AND status != 'cancelled'`,
          [date, time]
        );

        if (existingBooking.length > 0) {
          return res.status(409).json({
            success: false,
            error: 'Time slot is already booked. Please choose another date or time.',
          });
        }

        const bookingId = 'SN-' + Math.random().toString(36).substring(2, 8).toUpperCase();

        const [booking] = await sql(
          `INSERT INTO bookings (booking_id, name, contact, date, time, treatment, budget, payment_method, photo_url, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
           RETURNING *`,
          [bookingId, name, contact, date, time, treatment, budget || null, payment_method || 'Transfer', photo_url || null]
        );

        return res.status(201).json({
          success: true,
          data: booking,
        });
      }

      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
}
