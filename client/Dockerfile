# ===== Stage 1: Build the static bundle with Vite =====
FROM node:22-alpine AS builder
WORKDIR /app

# Vite bakes env vars into the bundle at BUILD time, so the backend URL
# must be known here. Jenkins passes it:
#   --build-arg VITE_API_BASE_URL=http://8.231.96.214:8082
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Auth service is a separate backend on its own port; same build-time trick.
ARG VITE_AUTH_BASE_URL
ENV VITE_AUTH_BASE_URL=$VITE_AUTH_BASE_URL

# Optional: Syncfusion license key (main.jsx reads VITE_SYNCFUSION_LICENSE)
ARG VITE_SYNCFUSION_LICENSE
ENV VITE_SYNCFUSION_LICENSE=$VITE_SYNCFUSION_LICENSE

# Install deps first for better layer caching (only re-runs if manifests change)
COPY package*.json ./
RUN npm install

# Then copy source and build
COPY . .
RUN npm run build

# ===== Stage 2: Serve the bundle with nginx =====
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
