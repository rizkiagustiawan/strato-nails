# 💅 Strato Nails - Premium Nail Art Booking System

A modern, elegant, and full-stack nail salon booking system built with React, Vite, and Vercel Serverless Functions.

![UI Screenshot](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/sparkles.svg)

## ✨ Features

- **Customer Booking Widget**: 4-step intuitive booking process.
- **Availability Check**: Prevents double-booking on the same date & time.
- **Elegant UI/UX**: Masonry gallery, smooth Framer Motion animations, Lucide icons.
- **Dark Mode**: Persisted dark/light theme support.
- **Bilingual (i18n)**: Supports English and Indonesian.
- **PWA Ready**: Can be installed as a mobile app.
- **Admin Dashboard**: Secured with JWT. Manage bookings, view statistics, and update statuses.
- **QR Code Confirmation**: Generates downloadable QR codes for booking reference.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 8, TypeScript 6, Framer Motion, React Hook Form, Zod.
- **Backend**: Vercel Serverless Functions (`/api`).
- **Database**: PostgreSQL (Neon.tech serverless DB).
- **Styling**: Pure CSS with CSS Variables (Custom Properties).
- **Icons**: Lucide React.

---

## 🚀 Local Development Setup

### 1. Database Setup (Free)
1. Go to [Neon.tech](https://neon.tech/) and create a free account.
2. Create a new project.
3. Copy your Connection String (`postgres://...`).
4. Go to the Neon **SQL Editor**, copy the contents of `api/schema.sql` from this project, and run it.

### 2. Project Configuration
1. Clone this repository.
2. Rename `.env.example` to `.env`.
3. Fill in your environment variables:
```env
DATABASE_URL=your_neon_connection_string_here
VITE_WHATSAPP_NUMBER=6283129009539
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=a_very_long_random_string
```

### 3. Running Locally (Full Stack)
To test both the React frontend and Vercel backend locally:

```bash
# Install Vercel CLI globally (if you haven't)
npm install -g vercel

# Install dependencies for both frontend and backend
npm install --legacy-peer-deps
cd api && npm install --legacy-peer-deps && cd ..

# Login to Vercel
vercel login

# Start the local development server
vercel dev
```
Open `http://localhost:3000` in your browser.

---

## 🌐 Deployment to Vercel

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import your repository.
3. Add the following Environment Variables in Vercel settings:
   - `DATABASE_URL`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
4. Click **Deploy**.

*Vercel will automatically detect Vite and the serverless functions in the `api/` directory.*

## 🔒 Security Notes
- **Never commit your `.env` file**. It has been added to `.gitignore`.
- Change the `JWT_SECRET` in production to a strong random string.
- The `/admin` path is protected; accessing the API endpoints without a valid token will result in a 401 Unauthorized error.
