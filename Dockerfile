FROM node:22-alpine@sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402 AS migration-tools

RUN apk add --no-cache openssl \
    && npm install --prefix /opt/migrator --no-audit --no-fund prisma@5.6.0
COPY ./prisma/ /app/prisma/
RUN DATABASE_URL=mysql://validation:validation@localhost:3306/validation \
    node /opt/migrator/node_modules/prisma/build/index.js validate --schema=/app/prisma/schema.prisma

FROM alpine:3 AS build

WORKDIR /app

RUN apk add --no-cache nodejs npm

RUN npm i -g pnpm@8.15.9

COPY ./package.json ./pnpm-lock.yaml /app/

RUN pnpm i --frozen-lockfile

COPY ./prisma/ /app/prisma/

RUN pnpm prisma generate

RUN cp -r node_modules/.pnpm/@prisma+client*/ /app/@prisma+client/

COPY ./vite.config.ts ./postcss.config.js tailwind.config.js svelte.config.js /app/

COPY ./static/ /app/static/

COPY ./src/ /app/src/

RUN pnpm build

# --

FROM alpine:3 AS deps

WORKDIR /app

RUN apk add --no-cache nodejs npm

RUN npm i -g pnpm@8.15.9

COPY ./package.json ./pnpm-lock.yaml /app/

RUN pnpm i --prod --frozen-lockfile

# --

FROM alpine:3 AS runtime

WORKDIR /app

RUN apk add --no-cache nodejs openssl

RUN echo "{\"type\":\"module\"}" > package.json

COPY --from=deps /app/node_modules/ /app/node_modules/

COPY --from=build /app/@prisma+client /app/node_modules/@prisma/client/

COPY --from=build /app/build/ /app/build/

# Application and migration schema are published as one multi-architecture
# artifact, so GitOps cannot independently update them to different revisions.
COPY --from=migration-tools /opt/migrator/ /opt/migrator/
COPY ./prisma/ /app/prisma/

CMD ["node", "build"]
