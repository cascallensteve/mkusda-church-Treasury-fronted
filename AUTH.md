# Authentication System

## Overview

The app uses a simple client-side auth model backed by `localStorage`. There is no backend or token refresh; authentication state is a boolean flag plus an optional user record.

## Storage Keys

| Key | Purpose |
|---|---|
| `isAuthenticated` | `"true"` when the user is logged in; absent otherwise. |
| `user` | JSON string of the current user payload, e.g. `{ name, role }`. |

## Login Methods

### Email + Password
- Route: `/login`
- Component: `src/pages/login.tsx`
- Flow:
  1. User enters email and password.
  2. On submit, the app stores `isAuthenticated = "true"` and a `user` object in `localStorage`.
  3. A success animation is shown, then the user is redirected to `/app/dashboard`.

### PIN
- Route: `/login` (PIN tab)
- Component: `src/pages/login.tsx`
- Flow:
  1. User enters a 4-digit numeric PIN.
  2. On submit, the app stores `isAuthenticated = "true"` and a `user` object in `localStorage`.
  3. Redirects to `/app/dashboard`.

### Forgot Password
- Route: `/forgot-password`
- Component: `src/pages/forgot-password.tsx`
- Simulates sending a reset email. Does not change auth state.

## Route Protection

| Route | Guard | Behavior |
|---|---|---|
| `/login` | `PublicRoute` | Redirects authenticated users to `/app/dashboard`. |
| `/forgot-password` | `PublicRoute` | Same as above. |
| `/app/*` | `ProtectedRoute` | Redirects unauthenticated users to `/login`. |
| `*` | `NotFoundPage` | Renders the 404 page. |

## Session Check

`ProtectedRoute` and `PublicRoute` read `localStorage.getItem("isAuthenticated")` on mount. Until the check completes, a loading screen is shown.

## Logout

- Entry point: topbar avatar dropdown -> Sign out
- Route: `/app/logout`
- Component: `src/pages/app/logout.tsx`
- Behavior:
  1. Shows a 2-second animated logout screen.
  2. Clears `isAuthenticated` and `user` from `localStorage`.
  3. Redirects to `/login`.

## Current PIN Behavior

PIN login currently works independently of email login. Both methods store a default user (`Anna Mushi`, Treasurer). There is no server-side PIN verification, no PIN binding to a specific user, and no rate limiting.

## Suggested Improvements

1. **Quick-login PIN**: After a successful email login, bind the PIN to that user so subsequent PIN entries log in as the same user without re-entering credentials.
2. **User switcher**: Add a "Switch account" item in the topbar dropdown that clears the current user and returns to `/login`.
3. **Server-side auth**: Replace `localStorage` with HTTP-only cookies or a token-based flow to prevent client-side tampering.
4. **PIN security**: Store PINs hashed on the server; enforce retry limits and lockout after failed attempts.
5. **Session expiry**: Add a TTL to the auth state and auto-redirect to login when expired.
