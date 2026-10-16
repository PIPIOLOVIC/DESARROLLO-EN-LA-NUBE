# ── Etapa 1: build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production=false

COPY . .
RUN npm run build

# ── Etapa 2: producción ──────────────────────────────────────────────────────
FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
