# AI Rules & Tech Stack Guide

## Tech Stack

- **Next.js 14** - React framework with App Router for server-side rendering and static site generation
- **TypeScript** - Type-safe JavaScript development with strict type checking
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Supabase** - Backend-as-a-Service with authentication, database, and real-time capabilities
- **React Router** - Client-side routing for Next.js App Router
- **Chart.js & React Chart.js 2** - Data visualization library for charts and graphs
- **Lucide React** - Beautiful, consistent icon library
- **Radix UI** - Low-level UI primitives for accessible components
- **shadcn/ui** - High-quality, accessible UI components built on Radix UI

## Library Usage Rules

### UI Components
- **Always use shadcn/ui components** when available for common UI elements (buttons, inputs, cards, etc.)
- **Use Tailwind CSS classes** for all styling - no custom CSS files unless absolutely necessary
- **Use Lucide React icons** for all icon needs - no other icon libraries
- **Create custom components** only when shadcn/ui doesn't provide the required functionality

### Data & State Management
- **Use React hooks** (useState, useEffect, useCallback) for all client-side state management
- **Use Supabase** for all database operations, authentication, and real-time features
- **No Redux or other state management libraries** - React hooks are sufficient for this app

### Charts & Visualization
- **Use Chart.js with React Chart.js 2** for all charting needs
- **Register Chart.js components** at the top of files that use charts
- **Use consistent color scheme** from brand colors (#091d28, #d49a30)

### Forms & Data Handling
- **Use native HTML forms** with Tailwind styling for simplicity
- **Implement form validation** using HTML5 validation attributes and custom validation
- **Use Supabase auth** for all authentication flows

### Routing
- **Keep all routes in src/App.tsx** as specified in guidelines
- **Use Next.js App Router** for file-based routing
- **Use client-side components** with 'use client' directive for interactive components

### Code Organization
- **Put pages in src/pages/** with corresponding route structure
- **Put components in src/components/** for reusable UI elements
- **Put utilities in src/utils/** for helper functions and configurations
- **Keep components under 100 lines** - refactor if they grow too large

### Styling Conventions
- **Use Tailwind utility classes** extensively for layout, spacing, colors
- **Follow the existing color scheme**: navy (#091d28), gold (#d49a30), white (#FFFFFF)
- **Use responsive design** with Tailwind's responsive utilities
- **No custom CSS** - use Tailwind classes or inline styles only

### Error Handling
- **Let errors bubble up** to the UI for debugging - no try/catch blocks unless specifically requested
- **Use console.error** for logging errors in development
- **Show user-friendly error messages** with appropriate styling

### Performance
- **Use React.memo** for expensive components that don't need re-rendering
- **Lazy load components** when they're not immediately needed
- **Optimize images** with Next.js Image component when applicable

### Development Practices
- **Follow TypeScript strict mode** - no any types unless absolutely necessary
- **Use meaningful variable and function names**
- **Write clear, concise code** with proper indentation and formatting
- **Add JSDoc comments** for complex functions and components