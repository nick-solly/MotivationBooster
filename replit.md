# Inspirational Messages Application

## Overview

A full-stack web application that displays random inspirational messages. The application features a React frontend with a Node.js/Express backend, using PostgreSQL as the database with Drizzle ORM for data management. The frontend is built with modern UI components using shadcn/ui and Tailwind CSS.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon serverless PostgreSQL driver
- **Development**: tsx for TypeScript execution in development

### Data Storage
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle Kit for database schema management
- **Tables**: Users and Messages with proper relationships

## Key Components

### Database Schema
- **Users Table**: ID, username, password (for future authentication)
- **Messages Table**: ID, text content, author
- **Validation**: Zod schemas generated from Drizzle schema for type safety

### API Endpoints
- `GET /api/messages/random` - Fetch a random inspirational message
- `GET /api/messages` - Fetch recent messages for history display
- Database seeding functionality for initial message population

### Frontend Features
- **Home Page**: Displays random messages with refresh functionality
- **Favorites System**: Local state management for favorite messages
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Toast Notifications**: User feedback for actions
- **Loading States**: Skeleton loaders during data fetching

### UI Components
- Comprehensive shadcn/ui component library
- Custom theme with light/dark mode support via CSS variables
- Consistent design system with proper accessibility considerations

## Data Flow

1. **Initial Load**: Frontend fetches random message from backend API
2. **Message Display**: React Query manages caching and state synchronization
3. **User Actions**: Refresh button triggers new random message fetch
4. **Favorites**: Local state management with Set data structure
5. **History**: Separate endpoint provides recent messages for user reference

## External Dependencies

### Production Dependencies
- **Frontend**: React ecosystem, TanStack Query, Wouter, shadcn/ui, Radix UI
- **Backend**: Express.js, Drizzle ORM, Neon PostgreSQL driver
- **Shared**: Zod for validation, TypeScript for type safety
- **Styling**: Tailwind CSS, class-variance-authority, clsx

### Development Dependencies
- **Build Tools**: Vite, esbuild, tsx
- **Database**: Drizzle Kit for migrations
- **Type Checking**: TypeScript compiler

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit modules
- **Database**: PostgreSQL 16 module
- **Development Server**: Concurrent frontend (Vite) and backend (Express) servers
- **Port Configuration**: Backend on port 5000, proxied through Vite

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Deployment**: Autoscale deployment target on Replit
- **Static Serving**: Express serves built frontend assets in production

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Development/production mode switching via `NODE_ENV`
- Replit-specific optimizations and error handling

## Changelog

- June 27, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.