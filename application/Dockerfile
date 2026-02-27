# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM node:lts-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS dev-installer
RUN mkdir -p /temp/dev
COPY package.json /temp/dev/
RUN cd /temp/dev && npm install --legacy-peer-deps

# build
# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS builder
COPY --from=dev-installer /temp/dev/node_modules node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000/tcp
CMD ["node", "server.js"]