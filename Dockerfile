FROM node:24.11.1-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk update && \
    apk add --no-cache openssl dumb-init

RUN corepack enable

FROM base AS deps

WORKDIR /app

COPY pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch --frozen-lockfile

COPY package.json ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --offline

COPY prisma ./prisma

RUN pnpm run db:generate

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN pnpm run build

FROM base AS prod-deps

WORKDIR /app

COPY pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch --prod --frozen-lockfile

COPY package.json ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --offline

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV SERVER_PORT=4001
ENV NODE_OPTIONS="--enable-source-maps"

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 || true

RUN mkdir -p /app/logs && chown -R nodejs:nodejs /app/logs

USER nodejs

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 4001

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["node", "dist/src/main.js"]
