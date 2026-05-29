# ============================================================
# FRONTEND DOCKERFILE — React Application
# Uses multi-stage build: Node to build, nginx to serve
# ============================================================

# STAGE 1 — BUILD
# Use Node.js to install dependencies and build the React app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --silent

# Copy source code and build the production bundle
COPY . .
ENV CI=false
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# ============================================================

# STAGE 2 — SERVE
# Use nginx to serve the built React files (very lightweight)
FROM nginx:alpine

# Remove the default nginx page
RUN rm /etc/nginx/conf.d/default.conf

# Use our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from Stage 1
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
