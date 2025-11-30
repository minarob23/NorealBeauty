# NORÉAL - Luxury Beauty E-Commerce Platform

## Overview

NORÉAL is a luxury beauty and skincare e-commerce platform inspired by premium brands like Glossier, Sephora, and Aesop. The application provides a sophisticated shopping experience with product browsing, wishlists, cart management, reviews, and subscription options. Built with a modern React frontend and Express backend, it emphasizes minimalist design, clean typography, and generous whitespace to create an aspirational yet approachable user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter for client-side routing, providing a lightweight alternative to React Router. Main routes include home (`/`), shop (`/shop`), product detail (`/product/:id`), and wishlist (`/wishlist`).

**State Management**: Zustand with persistence middleware for global application state. The store manages:
- Language preferences (multi-language support for English, French, Spanish)
- Shopping cart items with subscription options
- Wishlist items
- UI state (cart drawer visibility)

**Data Fetching**: TanStack Query (React Query) for server state management with aggressive caching (`staleTime: Infinity`). Custom query function handles unauthorized responses and credential-based requests.

**UI Components**: Shadcn/ui component library based on Radix UI primitives, configured with the "new-york" style preset. Components use Tailwind CSS with custom design tokens for colors, spacing, and typography.

**Design System**: 
- Typography: Playfair Display (serif) for headings, Inter (sans-serif) for body text
- Color scheme: Custom HSL-based color system with support for light/dark themes
- Spacing: Tailwind's default spacing scale with generous margins and padding
- Component styling: Variant-based approach using class-variance-authority

**Animation**: Framer Motion for page transitions, component animations, and interactive elements.

**Form Handling**: React Hook Form with Zod schema validation for type-safe form inputs and validation.

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API structure with endpoints for:
- Products: GET `/api/products`, GET `/api/products/:id`, POST/PATCH/DELETE for CRUD operations
- Reviews: GET `/api/products/:id/reviews`, POST for creating reviews, PATCH for updating helpfulness

**Data Storage**: Currently using in-memory storage with sample data. The architecture is designed to integrate with Drizzle ORM and PostgreSQL (Neon serverless) as indicated by configuration files.

**Schema Validation**: Zod schemas shared between frontend and backend (in `shared/schema.ts`) for type safety across the full stack. Validates product data, review submissions, and ensures consistent data structures.

**Development Server**: Custom Vite integration in development mode with HMR (Hot Module Replacement) support. Production builds serve static files from the `dist/public` directory.

**Build Process**: Custom esbuild configuration that bundles server code with selective dependencies. Allowlisted packages are bundled to reduce filesystem syscalls and improve cold start times.

**Middleware**: Express middleware for JSON parsing, URL encoding, and request logging with formatted timestamps.

### Data Models

**Product Schema**:
- Core fields: id, name, description, price, category, skinType
- Metadata: rating, reviewCount, inStock, isBestSeller, isNew
- Arrays: images, ingredients
- Categories: moisturizers, serums, cleansers, masks, toners, suncare, eye-care, treatments
- Skin types: all, dry, oily, combination, sensitive

**Review Schema**:
- User information and rating (1-5 stars)
- Title and content
- Metadata: helpfulCount, verified status, timestamps

**Cart & Wishlist**:
- Cart supports both one-time purchases and subscriptions
- Subscription frequencies: weekly, bi-weekly, monthly, bi-monthly
- 15% discount applied to subscription items

### Internationalization

Multi-language support implemented through a custom i18n system with translations stored in `client/src/lib/i18n.ts`. Supports English, French, and Spanish with language selection persisted in Zustand store. All UI strings are translated, including navigation, product categories, and user-facing messages.

## External Dependencies

### Database & ORM

**Drizzle ORM** (v0.39.1): Type-safe ORM configured for PostgreSQL with schema definitions in `shared/schema.ts`. Configuration points to PostgreSQL via `DATABASE_URL` environment variable.

**Neon Serverless** (@neondatabase/serverless v0.10.4): PostgreSQL database driver optimized for serverless environments with WebSocket support.

**Database Sessions**: connect-pg-simple for PostgreSQL-backed session storage (configured but not yet implemented with authentication).

### UI Component Libraries

**Radix UI**: Comprehensive set of unstyled, accessible component primitives including dialogs, dropdowns, tooltips, accordions, and form controls. Provides the foundation for the Shadcn/ui component system.

**Shadcn/ui**: Pre-built, customizable components based on Radix UI with Tailwind CSS styling. Configured with custom color schemes and design tokens matching NORÉAL's luxury aesthetic.

### Styling & Animation

**Tailwind CSS**: Utility-first CSS framework with custom configuration extending the default theme with brand colors, typography, and spacing.

**Framer Motion**: Animation library for smooth page transitions, component animations, and gesture-based interactions.

**class-variance-authority**: Utility for creating variant-based component APIs with TypeScript support.

### Forms & Validation

**React Hook Form**: Performant form library with minimal re-renders.

**Zod**: TypeScript-first schema validation used across frontend and backend for runtime type checking and validation error messages.

**@hookform/resolvers**: Integrates Zod schemas with React Hook Form.

### Development Tools

**Vite**: Next-generation frontend build tool providing fast HMR and optimized production builds.

**esbuild**: Fast JavaScript bundler used for server-side code compilation.

**TypeScript**: Type safety across the entire codebase with strict mode enabled.

**Replit Plugins**: Development plugins for runtime error overlay, cartographer, and dev banner (development environment only).

### Third-Party Integrations (Configured but Not Implemented)

The dependency list suggests future integration capabilities for:
- **Stripe**: Payment processing (package installed but not implemented)
- **Nodemailer**: Email notifications (package installed but not implemented)
- **Passport**: Authentication with local strategy (package installed but not implemented)

### Asset Management

Stock images stored in `attached_assets/stock_images/` directory with luxury skincare photography. Images are imported directly in components and accessed via Vite's asset handling system with path aliases configured in `vite.config.ts`.