# ── Stage 1: build the React app ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace manifests first so npm can hoist deps before source arrives
COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN npm ci

# Copy all source and build
COPY client/ ./client/
RUN npm run build --workspace=client

# ── Stage 2: serve with nginx ─────────────────────────────────────────────────
FROM nginx:1.27-alpine

COPY --from=builder /app/client/dist /usr/share/nginx/html
# Use nginx's built-in template processor so API_UPSTREAM can be injected at runtime
COPY client/nginx.conf /etc/nginx/templates/default.conf.template

ENV API_UPSTREAM=http://server:3001

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
