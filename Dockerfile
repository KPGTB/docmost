FROM node:21-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install --no-frozen-lockfile
RUN pnpm build

RUN apk add --no-cache curl bash

WORKDIR /app

RUN chown -R node:node /app

USER node

RUN pnpm install --frozen-lockfile --prod

RUN mkdir -p /app/data/storage

VOLUME ["/app/data/storage"]

EXPOSE 3000

ENTRYPOINT ["pnpm", "start"]
