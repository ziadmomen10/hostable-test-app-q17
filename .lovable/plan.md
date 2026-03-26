

# Fix: Login Race Condition — User Gets Signed Out Immediately

## Root Cause

There is a race condition between authentication and role loading:

1. User signs in successfully → `onAuthStateChange` fires with `SIGNED_IN`
2. `user` is set immediately, `authLoading` is already `false`
3. Role fetching happens in a `setTimeout` (deferred) — so `isAdmin` is still `false`
4. The `useEffect` in `AdminLayout` (line 127-131) sees `user && !authLoading && !isAdmin` → calls `signOut()` immediately
5. User sees "Welcome back!" toast (from signIn success) but gets logged out instantly

The console logs confirm this: `SIGNED_IN` → `Login successful` → `SIGNED_OUT` in rapid succession.

## Fix

### 1. `src/contexts/AuthContext.tsx` — Add a `rolesLoaded` flag

- Add a new state `rolesLoaded` (default `false`) that tracks whether roles have been fetched for the current user
- Set `rolesLoaded = false` when auth state changes to `SIGNED_IN` (before the deferred role fetch)
- Set `rolesLoaded = true` after roles are fetched
- On `SIGNED_OUT`, set `rolesLoaded = false`
- Expose `rolesLoaded` in the context

### 2. `src/components/AdminLayout.tsx` — Wait for roles before acting

- Read `rolesLoaded` from `useAuth()`
- Change the loading check: show spinner if `authLoading` OR (`user` exists but `!rolesLoaded`)
- Remove the `useEffect` that auto-signs out non-admin users (the race condition source)
- Keep the `!isAdmin` check that shows `<AdminLogin errorMessage="..."/>`, but only reach it after roles are confirmed loaded

```text
Flow after fix:
  Sign in → user set → show loading (roles not loaded yet)
         → roles fetched → rolesLoaded = true
         → isAdmin? → show admin panel
         → !isAdmin? → show login with error message (no auto sign-out)
```

### 3. `src/components/AdminLogin.tsx` — Add sign-out on retry

- When the error message is shown and user submits the form, call `signOut()` first before attempting `signIn()` with new credentials. This ensures the old non-admin session is cleared.

### Files changed
- `src/contexts/AuthContext.tsx` — add `rolesLoaded` state + expose it
- `src/components/AdminLayout.tsx` — use `rolesLoaded` in guards, remove auto-signout `useEffect`
- `src/components/AdminLogin.tsx` — sign out before retrying login

