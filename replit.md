# TIGON Spray E-Commerce Platform

## Overview

TIGON Spray is a direct-to-consumer e-commerce platform specializing in premium golf cart cleaning and protection products. The platform sells four spray variants (Original Formula, Pro Shield, Ultra Clean, and Elite Protection) with prices ranging from $24.99 to $44.99. The application features a modern shopping experience with product browsing, cart management, checkout, blog content, and an affiliate marketing program.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React 18 with TypeScript, using a Single Page Application (SPA) approach with client-side routing via Wouter.

**UI Component System:** Shadcn UI components built on Radix UI primitives, providing accessible and customizable components. The design follows the "new-york" style variant with a neutral base color scheme.

**Styling:** Tailwind CSS with custom design tokens for colors, spacing, and typography. The theme system supports light/dark modes with CSS variables for seamless switching. Custom utility classes like `hover-elevate` and `active-elevate-2` provide consistent interactive feedback.

**State Management:**
- React Context API for global state (Theme, Cart, Auth)
- TanStack Query (React Query) for server state management with aggressive caching (staleTime: Infinity)
- localStorage for cart persistence across sessions

**Design Philosophy:** Reference-based approach inspired by Shopify's clean product presentation and Stripe's professional restraint. Mobile-first responsive design with emphasis on conversion optimization and trust-building.

### Backend Architecture

**Server Framework:** Express.js with TypeScript running on Node.js

**API Design:** RESTful API with JSON responses, organized by resource type (products, orders, affiliates, blog). All endpoints are prefixed with `/api/`.

**Authentication:** Replit Auth (OIDC) integration using Passport.js strategy. Session management via express-session with PostgreSQL session store (connect-pg-simple). Session TTL is 7 days with secure cookies in production.

**Authorization:** Role-based access control with `isAdmin` flag on users. Protected routes use middleware (`isAuthenticated`, `isAdmin`) to control access.

**Request Handling:**
- JSON body parsing with raw body preservation for webhook verification
- URL-encoded form data support
- Request logging middleware tracking method, path, status, and duration

**Development Tooling:** Vite integration in development mode with HMR support, SSR template rendering, and error overlay plugins for Replit environment.

### Data Storage

**Database:** PostgreSQL via Neon's serverless driver with WebSocket connections

**ORM:** Drizzle ORM for type-safe database queries and schema management

**Schema Design:**
- `users`: Stores user profiles from Replit Auth (id, email, name, profile image, admin status)
- `products`: Product catalog with slug-based routing, pricing, images, features array, and inventory status
- `orders`: Order records with shipping details and total
- `orderItems`: Line items linking orders to products with quantities and prices
- `cartItems`: Persisted cart state for authenticated users
- `affiliates`: Affiliate program participants with unique referral codes and commission tracking
- `affiliateClicks`: Click tracking for affiliate links
- `affiliateSales`: Commission records for affiliate-generated sales
- `blogPosts`: Content management for SEO blog with title, slug, hero image, content, and publish status
- `sessions`: Express session storage (required for Replit Auth)

**Schema Validation:** Zod schemas generated from Drizzle tables using drizzle-zod for runtime type checking on API requests

### External Dependencies

**Authentication Provider:** Replit Auth (OIDC) - Provides user identity and session management

**Database Hosting:** Neon (PostgreSQL serverless) - Accessed via DATABASE_URL environment variable

**Payment Gateway:** Clover integration (planned/in development based on storage implementation)

**CDN & Assets:** 
- Google Fonts (Inter font family)
- Static assets served from `/attached_assets/` directory
- Product images stored in `/attached_assets/generated_images/`

**UI Component Libraries:**
- Radix UI (accessible primitives)
- Lucide React (icon library)
- cmdk (command palette)
- date-fns (date formatting)

**Build Tools:**
- Vite (frontend bundler with React plugin)
- esbuild (server bundling for production)
- Tailwind CSS (PostCSS processing)

**SEO & Discoverability:**
- Static files for AI/LLM discovery (ai.txt, llms.txt, humans.txt, robots.txt, security.txt)
- Manifest.json for PWA support
- Comprehensive meta tags in index.html

**Development Environment:** Replit-specific plugins for dev banner, cartographer, and runtime error overlay

**Third-Party Integrations:**
- Amazon marketplace integration (via product amazonUrl field)
- Affiliate tracking system (custom implementation)