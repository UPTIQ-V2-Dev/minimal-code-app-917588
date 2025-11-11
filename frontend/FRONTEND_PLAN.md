# Frontend Implementation Plan - Minimal React 19 App

## Tech Stack
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS v4** for styling
- **shadcn/ui** components (pre-configured)
- **React Router DOM** for navigation

## Minimal App Structure (Least Code)

### 1. Single Page Application
**File**: `src/App.tsx`
- Main container with minimal UI
- Single welcome/dashboard page
- Uses existing shadcn components: Button, Card
- No routing needed for minimal version

**Components needed**:
- `src/components/WelcomeCard.tsx` - Simple card with app title and description

**Utils**: 
- Use existing `src/lib/utils.ts` (cn function)

**API**: None required for minimal version

---

### Alternative: Two-Page Version (if routing needed)

### 1. Home Page
**Route**: `/`
**File**: `src/pages/HomePage.tsx`
- Welcome message
- Navigation to About page
- Uses: Card, Button components

### 2. About Page  
**Route**: `/about`
**File**: `src/pages/AboutPage.tsx`
- Simple about text
- Back to Home button
- Uses: Card, Button components

**Routing Setup**:
- Update `src/App.tsx` with Router setup
- Create `src/components/Layout.tsx` for common layout

**Shared Components**:
- `src/components/Navigation.tsx` - Simple nav bar
- Use existing shadcn Button, Card components

**Utils**:
- Use existing `src/lib/utils.ts`

**Types**: 
- Use existing type structure

**API Endpoints**: None needed

---

### 3. Authentication System (Login Page)

### Login Page
**Route**: `/login`
**File**: `src/pages/LoginPage.tsx`
- Email/password login form
- Form validation with error handling
- Redirect to dashboard after successful login
- Uses existing auth service in `src/services/auth.ts`
- Uses: Card, Button, Input, Label, Alert components

**Auth Components**:
- `src/hooks/useAuth.tsx` - Custom hook for authentication state
- Update routing in `src/App.tsx` to include login route
- Protected route wrapper for authenticated pages

**Form Handling**:
- React Hook Form with validation
- Error states and loading indicators
- Integration with existing authService.login()

**Types**: 
- Uses existing LoginRequest, AuthResponse from `src/types/user.ts`

**API Integration**:
- Uses existing authService from `src/services/auth.ts`
- Handles mock data with VITE_USE_MOCK_DATA env variable
- Auto token refresh and storage handling

---

## Implementation Priority
1. **Option 1**: Single page with WelcomeCard (absolute minimum)
2. **Option 2**: Two-page app with routing (if navigation needed)  
3. **Option 3**: Authentication system with login page (recommended)

## Existing Assets to Use
- All shadcn/ui components already configured
- Tailwind v4 setup complete
- TypeScript config ready
- Vite dev server configured
- Testing setup with Vitest

## Estimated Files to Create/Modify
**Minimal (Option 1)**: 2 files
- Modify: `src/App.tsx`
- Create: `src/components/WelcomeCard.tsx`

**With Routing (Option 2)**: 5 files
- Modify: `src/App.tsx`
- Create: `src/pages/HomePage.tsx`, `src/pages/AboutPage.tsx`
- Create: `src/components/Layout.tsx`, `src/components/Navigation.tsx`