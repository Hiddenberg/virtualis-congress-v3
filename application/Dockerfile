# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS dev-installer
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

FROM base AS prod-installer
# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS builder
COPY --from=dev-installer /temp/dev/node_modules node_modules
COPY . .

# build
ENV NODE_ENV=production
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release

# copy next.js files
COPY --from=builder --chown=bun:bun /app/.next .next
COPY --from=builder --chown=bun:bun /app/public public
COPY --from=builder --chown=bun:bun /app/next.config.ts ./next.config.ts
COPY --from=builder --chown=bun:bun /app/.env .env
COPY --from=builder --chown=bun:bun /app/.env.production .env.production

# copy production dependencies
COPY --from=builder --chown=bun:bun /app/package.json .
COPY --from=prod-installer --chown=bun:bun /temp/prod/node_modules node_modules

# run the app
USER bun
EXPOSE 3000/tcp
CMD ["bun", "run", "start"]