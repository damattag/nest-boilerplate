FROM node:24.11.1-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk update && \
    apk add --no-cache openssl dumb-init

RUN corepack enable

FROM base AS installer

WORKDIR /app

COPY pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch --frozen-lockfile

COPY package.json ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --offline

COPY prisma ./prisma

RUN pnpm run db:generate

FROM base AS runner

WORKDIR /app

COPY . .

COPY --from=installer /app/node_modules ./node_modules

ENV SERVER_PORT=3001
ENV NODE_ENV=development

EXPOSE 3001

CMD ["pnpm", "run", "start:dev"]
