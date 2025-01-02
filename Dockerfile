FROM node:21-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm
RUN pnpm install --no-frozen-lockfile
RUN pnpm build

RUN mkdir -p /app/data/storage

VOLUME ["/app/data/storage"]

EXPOSE 3000

ENTRYPOINT ["pnpm", "start"]
