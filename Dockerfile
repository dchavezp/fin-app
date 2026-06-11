# syntax=docker/dockerfile:1

FROM node:24-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI="true"
ENV HUSKY="0"

RUN corepack enable

WORKDIR /app

FROM base AS build

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter server build

FROM base AS migrate

COPY . .

RUN pnpm install --frozen-lockfile

CMD ["pnpm", "--filter", "@finn-app/db", "db:migrate"]

FROM base AS prod-deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/server/package.json apps/server/package.json
COPY packages/auth/package.json packages/auth/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/env/package.json packages/env/package.json

RUN pnpm install --prod --filter server --frozen-lockfile --ignore-scripts

FROM node:24-slim AS runner

ENV NODE_ENV="production"
ENV PORT="3000"

WORKDIR /app

COPY --from=prod-deps /app/package.json /app/package.json
COPY --from=prod-deps /app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=prod-deps /app/apps/server/package.json /app/apps/server/package.json
COPY --from=prod-deps /app/apps/server/node_modules /app/apps/server/node_modules
COPY --from=build /app/apps/server/dist /app/apps/server/dist
COPY --from=build /app/packages/db/src/migrations /app/packages/db/src/migrations

EXPOSE 3000

CMD ["node", "apps/server/dist/index.mjs"]
