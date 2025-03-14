FROM node:18-alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy runtime necessities
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Ensure correct permissions
RUN chown -R node:node .
USER node

EXPOSE 3000
CMD ["node", "server.js"]