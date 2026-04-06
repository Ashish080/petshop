# Monorepo Architecture Blueprint

This document outlines the architecture and migration plan for transitioning from three separate Next.js frontend applications to a highly optimized, scalable Turborepo monorepo. It consolidates the frontends into a single Next.js application using Role-Based Access Control (RBAC) and separates shared concerns into local packages.

## 1. High-Level Architecture Overview

We will use **Turborepo** to manage a monorepo structure. This allows shared code to be easily imported while enabling aggressive caching for faster builds.

- **`apps/web`**: The Unified Next.js Frontend (merging user, rider, and admin)
- **`apps/api`**: A lightweight backend API (NestJS or Express) to handle core business logic offloaded from Next.js, allowing the frontend to remain snappy.
- **`packages/ui`**: Shared UI component library using Tailwind CSS and Radix/shadcn-ui.
- **`packages/types`**: Shared TypeScript definitions (e.g., Zod schemas, DB models) shared across web and API.
- **`packages/store`**: Shared state management (React Query / Zustand).
- **`packages/config`**: Shared configuration for ESLint, TypeScript, and Prettier.

### Advantages of this Architecture
1. **Single Dev Server for Frontend (`npm run dev`)**: Only ONE Next.js dev server will run, dramatically reducing CPU/RAM usage and eliminating Mac system hangs.
2. **Unified Caching**: Turborepo handles caching; if shared UI changes, only dependent apps rebuild.
3. **Role-Based Access Control**: Middleware protects routes; users are routed to `/dashboard`, `/rider`, or `/admin` dynamically.
4. **Clean Code Isolation**: API logic moves to `apps/api` if necessary, keeping Next.js primarily for SSR and UI.

---

## 2. Folder Structure

```text
pet-store-monorepo/
├── turbo.json                  # Turborepo configuration
├── package.json                # Root package.json (Workspace setup)
├── pnpm-workspace.yaml         # (Or package.json workspaces if using npm/yarn)
│
├── apps/
│   ├── web/                    # Single Next.js App Router (Replaces all 3)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/     # Public login/signup pages
│   │   │   │   ├── (rbac)/     # Protected by root layout & middleware
│   │   │   │   │   ├── admin/  # /admin route
│   │   │   │   │   ├── rider/  # /rider route
│   │   │   │   │   └── dashboard/ # /dashboard (User) route
│   │   │   │   ├── api/        # Next.js BFF (Backend For Frontend) routes
│   │   │   │   └── layout.tsx
│   │   │   ├── middleware.ts   # Core RBAC Engine
│   │   │   └── package.json    # Depends on @repo/ui, @repo/types
│   │   │
│   ├── api/                    # NestJS or Express backend
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   └── modules/        # API specific modules
│   │   └── package.json        # Depends on @repo/types
│
├── packages/
│   ├── ui/                     # Shared UI components (Tailwind + shadcn/ui)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── lib/
│   │   │   └── index.ts
│   │   ├── tailwind.config.ts  # Shared Tailwind config
│   │   └── package.json
│   │
│   ├── types/                  # Shared TS Interfaces / Zod DTOs
│   │   ├── src/
│   │   │   ├── user.ts
│   │   │   ├── api-responses.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── store/                  # Zustand / React Query hooks
│   │   ├── src/
│   │   │   ├── useAuthStore.ts
│   │   │   └── queries/
│   │   └── package.json
│   │
│   └── config/                 # Base TypeScript / ESLint configs
│       ├── base.json
│       ├── nextjs.json
│       └── package.json
```

---

## 3. Core Configurations

### A. Root `package.json`
```json
{
  "name": "pet-store-monorepo",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  },
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "devDependencies": {
    "turbo": "latest",
    "prettier": "^3.0.0"
  }
}
```

### B. `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## 4. Next.js Setup & RBAC Middleware

By unifying into a single `apps/web` repository, we will rely heavily on `middleware.ts` to manage routing based on user session roles.

### `apps/web/src/middleware.ts`
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define protected roots
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isAdminRoute = pathname.startsWith('/admin');
  const isRiderRoute = pathname.startsWith('/rider');
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // Basic mock check: Get token from cookie
  const token = request.cookies.get('session_token')?.value;
  
  if (!token && (isAdminRoute || isRiderRoute || isDashboardRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    // Decode token to get user role (this is a simplified conceptual example)
    const role = 'USER'; // 'ADMIN' | 'RIDER' | 'USER'

    // RBAC Redirects
    if (isAdminRoute && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (isRiderRoute && role !== 'RIDER') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (isDashboardRoute && role !== 'USER') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Redirect logged in users away from auth pages
    if (isAuthRoute) {
      if (role === 'ADMIN') return NextResponse.redirect(new URL('/admin', request.url));
      if (role === 'RIDER') return NextResponse.redirect(new URL('/rider', request.url));
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 5. Shared Packages

### `packages/ui` (Tailwind Settings)
The UI package shares Button, Card, Table, and Input components.
`tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // Important: Tell Tailwind to scan apps/web as well when imported
    "../../apps/web/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Shared brand colors
      colors: {
        brand: {
          primary: "#1d4ed8",
          secondary: "#9333ea"
        }
      }
    },
  },
  plugins: [],
};
export default config;
```

### `packages/types`
Export interfaces to keep API and Web synced.
```typescript
// packages/types/src/index.ts
export type UserRole = 'ADMIN' | 'RIDER' | 'USER';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}
```

---

## 6. Step-by-Step Migration Plan

1. **Scaffold Turborepo structure**: 
   - Move into an empty directory or initialize at your root. 
   - Create `apps/` and `packages/` directories.
   - Set up root `package.json` for npm/pnpm workspaces.
   - Add `turbo.json`.
2. **Setup Shared Packages**:
   - Create `@repo/types`, `@repo/ui` and `@repo/config`.
   - Setup basic components and export them.
3. **Initialize Unified Next.js API (`apps/web`)**:
   - Initialize a fresh Next.js App Router here.
   - Install dependencies. Add `@repo/ui` and `@repo/types` as dependencies.
   - Copy components from old `user`, `rider`, and `admin` apps into appropriate paths (`app/dashboard/*`, `app/rider/*`, `app/admin/*`).
4. **Implement RBAC Middleware**:
   - Implement the generic `middleware.ts` to seamlessly redirect traffic to correct folders based on the session role.
5. **Set Up The API (`apps/api`)** (Optional initially):
   - You can start by relying on Server Actions or API routes in Next.js, and later peel off heavy data-processing into an Express/NestJS server in `apps/api`.
6. **State Management**:
   - Install `zustand` or `@tanstack/react-query` in `@repo/store`. 
   - Define your React Query clients or Zustand hooks here.
7. **Refactor existing code**:
   - Instead of relative imports (e.g. `../../../components/Button`), use `import { Button } from '@repo/ui'`.
8. **Dev Experience**:
   - Run `npm run dev` at the root. Turborepo will start ONE Next.js server (`apps/web:dev`) and potentially the Express server (`apps/api:dev`), resulting in vastly less CPU memory allocation.

---

## Outcome
With this setup, you replace three heavy Next.js processes spanning `3000`, `3001`, `3002` with **one single Next.js watcher**. This will eliminate the Turbopack out-of-memory lockups and MacOS hangs entirely, drastically improve HMR (fast refresh), and scale cleanly as your codebase grows.
