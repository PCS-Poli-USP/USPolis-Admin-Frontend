# syntax=docker/dockerfile:1

FROM node:20-slim AS base
WORKDIR /app/frontend

# Yarn 4 (Berry) is vendored in the repo itself (.yarnrc.yml -> yarnPath),
# nodeLinker is node-modules — no Corepack/global yarn install needed, just
# these files present before `yarn install`.
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install --immutable

# ---- dev: source mounted over this in compose, hot-reload via `yarn dev` ----
FROM base AS dev

COPY . .
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["yarn", "dev"]

# ---- build: static app bundle + built docs, mirrors .github/workflows/ci_cd.yml ----
FROM base AS build

# Vite bakes these into the static bundle at build time — supplying them as
# `environment:` on a running `prod` container has no effect, they must be
# passed as build args here.
ARG VITE_APP_NAME
ARG VITE_USPOLIS_API_ENDPOINT
ARG VITE_REDIRECT_URI
ARG VITE_GOOGLE_AUTH_CLIENT_ID
ARG VITE_USPOLIS_DOCS_URL
ARG VITE_ENVIROMENT
ARG VITE_OVERRIDE_AUTH

COPY . .
RUN yarn docs:build \
    && rm -rf public/docs \
    && mv docs/.vitepress/dist public/docs \
    && yarn build

# ---- prod: only the built static output + a static file server ----
FROM node:20-slim AS prod
WORKDIR /app/frontend

# Kept as `serve` (not bundled as a package.json dependency) to match exactly
# how production serves the app today (`serve -s build`, see the frontend dev
# docs) — zero repo diff, only present in this final image layer.
RUN npm install --global serve

COPY --from=build /app/frontend/build ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
