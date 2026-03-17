# Liberelo

The premier discovery and engagement platform for authors and reviewers. Liberelo connects real, genre-matched readers with manuscripts directly, without the noise of algorithms.

## Features
- **Guaranteed Reach:** Connect directly with verified readers who love your specific genre.
- **Secure ARCs:** Non-downloadable streaming formats for pre-published works to prevent piracy.
- **Real-time Analytics:** Track exactly who is reading your book, how far along they are, and cross-platform engagement.
- **Author First:** Old money premium design tailored for the sophisticated literary professional.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4 & Custom Premium Design System
- **Database:** Prisma ORM & Supabase
- **Authentication:** Supabase Auth (App Router optimized)
- **State Management:** Zustand
- **Animations:** Framer Motion

## Quick Start
```bash
# Install dependencies
npm install

# Setup environment variables (add .env file containing Supabase keys)
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Setup Database
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application running.

## Philosophy
We skip the middle steps. You don't pay for ads hoping someone clicks, buys, and reviews. You pay for guaranteed reader reach.

Built with ❤️ for the author community.
