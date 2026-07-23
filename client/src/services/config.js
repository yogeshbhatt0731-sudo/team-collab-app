// API base URL.
// In production/dev-server builds it is injected at BUILD TIME by Vite
// (see client/Dockerfile ARG VITE_API_BASE_URL, passed from Jenkins).
// For local `npm run dev` it falls back to the local backend.
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// Auth service base URL. It's a SEPARATE service on its own port (8081),
// so it needs its own URL — names/emails live in the Auth DB, not workspace.
// Same build-time injection trick as above (VITE_AUTH_BASE_URL from Jenkins).
export const AUTH_BASE_URL =
    import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:8081'


export const config = {
    BASE_URL: API_BASE_URL,
    AUTH_BASE_URL: AUTH_BASE_URL,
}
