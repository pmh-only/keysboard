FROM alpine:3 AS build

WORKDIR /app

RUN apk add --no-cache nodejs npm

RUN npm i -g pnpm

COPY ./package.json ./pnpm-lock.yaml /app/

RUN pnpm i

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

RUN npm i -g pnpm

COPY ./package.json ./pnpm-lock.yaml /app/

RUN pnpm i -P

# --

FROM alpine:3 AS runtime

WORKDIR /app

RUN apk add --no-cache nodejs

RUN echo "{\"type\":\"module\"}" > package.json

COPY --from=deps /app/node_modules/ /app/node_modules/

COPY --from=build /app/@prisma+client /app/node_modules/@prisma/client/

COPY --from=build /app/build/ /app/build/

CMD ["node", "build"]
