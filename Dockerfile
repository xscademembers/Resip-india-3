# ─── Stage 1: Build the Vite frontend ───────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json .npmrc ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# ─── Stage 2: Production runtime ─────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Install only what's needed to run the server.
COPY package*.json .npmrc ./
RUN npm ci --legacy-peer-deps --omit=dev

# Server source + the built frontend (served as static files in production).
COPY server ./server
COPY --from=build /app/dist ./dist

EXPOSE 5000
CMD ["node", "server/server.js"]
