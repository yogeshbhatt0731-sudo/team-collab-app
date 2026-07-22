// API base URL.
// In production/dev-server builds it is injected at BUILD TIME by Vite
// (see client/Dockerfile ARG VITE_API_BASE_URL, passed from Jenkins).
// For local `npm run dev` it falls back to the local backend.
export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'


export const config = {
    BASE_URL: API_BASE_URL,
}
