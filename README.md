# Film Hub

**Full-Stack Movie Theater Booking Platform** · CSCI 4050 Software Engineering — UGA, Spring 2026.

A complete cinema booking system: browse movies, pick a showtime, reserve seats, and check out — with admin tooling for movie/showroom CRUD, transactional emails, and a Supabase-backed persistence layer.

[![Next.js](https://img.shields.io/badge/Next.js-16-000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Django](https://img.shields.io/badge/Django_REST-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**Live Demo:** [film-hub-theta.vercel.app](https://film-hub-theta.vercel.app/)

> Heads up: the first click after a quiet period takes ~50s — the backend spins down on the free tier.

<!-- -->

## Highlights

- **Architected** a full-stack cinema booking system with a Next.js 16 / React 19 frontend and a Django REST Framework backend, enabling end-to-end movie browsing, showtime selection, seat reservation, and PCI-aware payment processing.
- **Designed** a real-time seat availability system with showroom management, supporting concurrent bookings across multiple theaters and showtimes with Supabase PostgreSQL as the persistence layer.
- **Developed** a comprehensive user experience including authentication, favorites, reviews, profile management, and an admin panel for movie/showroom CRUD operations, with Resend-powered transactional emails for password resets.
- **Stack:** Next.js · React 19 · Django REST · Tailwind CSS · Supabase (PostgreSQL) · Vercel · Render

<!-- -->

## Repository Structure

```
├── Backend/    # Django REST API
└── Frontend/   # Next.js application
```

## Course Context

CSCI 4050 — Software Engineering, University of Georgia, Spring 2026.
