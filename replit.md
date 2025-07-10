# OPSIGHT - Property Management Intelligence Platform

## Overview

OPSIGHT is a comprehensive property management intelligence platform built for multifamily real estate owners, operators, and limited partners. The application provides real-time KPI monitoring, predictive analytics, AI-powered insights, and automated alert systems to optimize property performance and management efficiency.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API for authentication and global state
- **Data Fetching**: TanStack Query for server state management
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Custom auth system with session management
- **API Design**: RESTful API structure with /api prefix

### Development Setup
- **Monorepo Structure**: Shared client, server, and shared directories
- **Hot Module Replacement**: Vite dev server with Express middleware
- **Build Process**: Separate build for client (Vite) and server (esbuild)
- **TypeScript**: Strict mode with path aliases for clean imports

## Key Components

### Authentication System
- Custom authentication context with user management
- Role-based access control (Asset Manager, Property Manager, Limited Partner)
- Multi-step onboarding with property setup and payment integration
- Session management with persistent login state

### Data Management
- Drizzle ORM for type-safe database operations
- PostgreSQL schema with user and property management tables
- Real-time data synchronization capabilities
- Property management system integration framework

### AI & Analytics Engine
- AI-powered document analysis and insights
- Predictive signals for property performance
- Automated red flag detection and alerting
- Performance scoring algorithms for property managers

### Dashboard & Visualization
- Real-time KPI monitoring dashboard
- Property portfolio overview with performance metrics
- Interactive charts using Recharts library
- Responsive design for mobile and desktop

### Alert & Notification System
- Multi-channel alert delivery (email, SMS, push notifications)
- Configurable alert thresholds and escalation rules
- Alert resolution tracking and follow-up actions
- Automated notification templates

## Data Flow

### User Authentication Flow
1. User registration with company and role information
2. Multi-step onboarding including property setup
3. Payment method configuration and subscription management
4. Data source connection and initial sync
5. Dashboard activation with personalized insights

### Property Data Pipeline
1. Integration with property management systems (Yardi, AppFolio, etc.)
2. Real-time data ingestion and validation
3. KPI calculation and performance scoring
4. AI analysis for patterns and anomalies
5. Alert generation based on configurable thresholds

### Alert Processing
1. Continuous monitoring of property metrics
2. Threshold breach detection
3. AI-powered root cause analysis
4. Multi-channel alert delivery
5. Resolution tracking and follow-up actions

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL with connection pooling
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Authentication**: Custom implementation with session management
- **Email Service**: Configurable email delivery system
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for date manipulation

### Development Dependencies
- **Build Tools**: Vite, esbuild, TypeScript compiler
- **Linting**: ESLint configuration
- **Styling**: Tailwind CSS with PostCSS processing
- **Development**: tsx for TypeScript execution, nodemon equivalent

### Integration Capabilities
- Property management system APIs (Yardi, AppFolio, RentManager)
- Payment processing systems
- Email and SMS delivery services
- Document processing and AI analysis services

## Deployment Strategy

### Development Environment
- Local development with Vite dev server
- Express middleware for API routes
- Hot module replacement for rapid development
- Environment-based configuration

### Production Build
- Client build output to `dist/public`
- Server build with esbuild bundling
- Static asset serving through Express
- Environment variable configuration for database and services

### Database Management
- Drizzle migrations for schema changes
- Environment-specific database connections
- Connection pooling for performance
- Schema validation and type safety

### Environment Configuration
- Development and production environment separation
- Database URL configuration
- Service API keys and credentials management
- Build-time and runtime configuration options

The application is designed as a scalable, multi-tenant platform with strong type safety, real-time capabilities, and comprehensive property management intelligence features.