# ── Stage 1: Build React App ─────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./
RUN npm install --silent

# Copy source and build
COPY . .
ENV REACT_APP_API_URL=http://localhost:8080
ENV CI=false
RUN npm run build

# ── Stage 2: Serve with nginx ─────────────────────────────────────────────────
# nginx:alpine supports arm64 (Apple Silicon)
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
