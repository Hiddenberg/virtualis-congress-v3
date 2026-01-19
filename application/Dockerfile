# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:alpine AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS installer
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS builder
COPY --from=installer /temp/dev/node_modules node_modules
COPY . .

# build
ENV NODE_ENV=production
RUN bun --bun run build

# copy production dependencies and source code into final image
FROM base AS release

# copy next.js files
COPY --from=builder /usr/src/app/.next .next
COPY --from=builder /usr/src/app/public public
COPY --from=builder /usr/src/app/next.config.ts ./next.config.ts
COPY --from=builder /usr/src/app/.env .env
COPY --from=builder /usr/src/app/.env.production .env.production

# copy production dependencies
COPY --from=builder /usr/src/app/package.json .
COPY --from=installer /temp/prod/node_modules node_modules

# run the app
USER bun
EXPOSE 3000/tcp
CMD ["bun", "run", "start"]