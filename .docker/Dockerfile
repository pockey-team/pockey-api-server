## =============================================================================
FROM node:20.18.0-alpine AS base

RUN npm i -g corepack@latest
RUN corepack enable pnpm
ENV PNPM_HOME=/usr/local/bin

RUN apk add dumb-init

## =============================================================================
FROM base AS dependencies

WORKDIR /app
COPY pnpm-lock.yaml ./
COPY package.json ./

RUN pnpm install --shamefully-hoist=true

## =============================================================================
FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

ARG ENV
ENV DB_NAME=pockey_${ENV}

RUN pnpm build
RUN pnpm exec mikro-orm cache:generate -c
RUN pnpm prune --prod

## =============================================================================
FROM base AS deploy

WORKDIR /app
COPY --from=build /app/temp/metadata.json ./temp/metadata.json
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000

CMD ["dumb-init", "node", "dist/main.js"]
