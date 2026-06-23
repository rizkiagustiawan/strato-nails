import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { verifyAuth } from '../lib/auth.js';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Protect all operations in this route
  const isAuthorized = await verifyAuth(req);
  if (!isAuthorized) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET': {
        const [booking] = await sql(
          'SELECT * FROM bookings WHERE booking_id = $1',
          [id]
        );

        if (!booking) {
          return res.status(404).json({
            success: false,
            error: 'Booking not found',
          });
        }

        return res.status(200).json({
          success: true,
          data: booking,
        });
      }

      case 'PUT': {
        const { status, notes } = req.body;

        const [booking] = await sql(
          `UPDATE bookings 
           SET status = COALESCE($1, status), 
               notes = COALESCE($2, notes),
               updated_at = NOW()
           WHERE booking_id = $3
           RETURNING *`,
          [status, notes, id]
        );

        if (!booking) {
          return res.status(404).json({
            success: false,
            error: 'Booking not found',
          });
        }

        return res.status(200).json({
          success: true,
          data: booking,
        });
      }

      case 'DELETE': {
        const [booking] = await sql(
          'DELETE FROM bookings WHERE booking_id = $1 RETURNING *',
          [id]
        );

        if (!booking) {
          return res.status(404).json({
            success: false,
            error: 'Booking not found',
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Booking deleted successfully',
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
