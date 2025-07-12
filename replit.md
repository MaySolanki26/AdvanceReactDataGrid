# DataGrid Application

## Overview

This is a full-stack web application built with React, TypeScript, and Express that features a sophisticated DataGrid component. The application is designed to handle large datasets with Excel-like functionality, including virtualization, filtering, sorting, and data export capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **UI Components**: Radix UI primitives for accessibility and consistency

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Development Server**: Custom Vite integration for seamless development experience
- **Storage**: In-memory storage with interface for future database integration
- **API Design**: RESTful API structure with `/api` prefix routing

### Database Layer
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (configured but not yet connected)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Neon Database serverless driver ready for deployment

## Key Components

### DataGrid Component
The core feature is a highly optimized DataGrid component located in `client/src/components/DataGrid/` with the following capabilities:

**Performance Features:**
- Virtual scrolling for handling large datasets (10,000+ rows)
- Row and column virtualization
- Minimal re-rendering optimization
- Responsive design with adaptive sizing

**Excel-like Features:**
- Column sorting (single and multi-column)
- Column resizing and reordering
- Row selection with checkboxes
- Cell rendering with custom components
- Data filtering and search
- Export functionality (CSV, JSON)
- Sticky headers and fixed columns

**Architecture:**
- Modular component structure with separate files for different concerns
- Custom hooks for state management (useColumnResize, useColumnOrder, useSelection, etc.)
- TypeScript interfaces for type safety
- CSS-in-JS styling with CSS variables for theming

### UI Component System
- Complete shadcn/ui component library integration
- Consistent design system with CSS variables
- Dark/light mode support
- Accessibility-first approach using Radix UI primitives

### Development Tools
- Hot module replacement with Vite
- TypeScript strict mode enabled
- ESLint and Prettier configuration
- Replit-specific optimizations and error handling

## Data Flow

1. **Client-Server Communication**: React Query handles API calls with built-in caching and error handling
2. **State Management**: Component-level state for UI interactions, server state managed by React Query
3. **Data Processing**: Client-side data transformation for sorting, filtering, and virtualization
4. **Rendering Pipeline**: Virtual scrolling calculates visible rows, renders only what's needed

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React 18, React Query, React Hook Form
- **UI Libraries**: Radix UI components, Tailwind CSS, shadcn/ui
- **Development**: Vite, TypeScript, date-fns for date handling
- **Utilities**: clsx, class-variance-authority for styling

### Backend Dependencies
- **Server**: Express.js with middleware for JSON parsing and CORS
- **Database**: Drizzle ORM, Neon Database driver
- **Development**: tsx for TypeScript execution, esbuild for production builds
- **Session Management**: connect-pg-simple for PostgreSQL session storage

### Development Dependencies
- **Replit Integration**: Custom Vite plugins for Replit environment
- **Build Tools**: PostCSS, Autoprefixer for CSS processing
- **Type Safety**: TypeScript with strict configuration

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` starts both frontend and backend with hot reload
- **Replit Integration**: Custom Vite configuration for Replit environment
- **Error Handling**: Runtime error overlay for development debugging

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations ready for PostgreSQL deployment
- **Environment**: Node.js production server with static file serving

### Database Deployment
- **Schema**: Defined in `shared/schema.ts` with user table structure
- **Migrations**: Generated and managed through Drizzle Kit
- **Connection**: Environment variable `DATABASE_URL` for production database
- **Fallback**: In-memory storage for development without database

The application is designed to be easily deployable to platforms like Replit, Vercel, or any Node.js hosting service with minimal configuration changes.