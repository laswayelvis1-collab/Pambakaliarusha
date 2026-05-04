# Pambakali Arusha

A premium e-commerce website built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- Modern, responsive design with liquid glass UI effects
- User authentication (email/password and Google)
- Shopping cart with local storage
- Admin panel for product management
- Order management
- Dark/Light mode support
- WhatsApp, Instagram, and TikTok social links

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- Lucide React (Icons)

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Build

```bash
npm run build
```