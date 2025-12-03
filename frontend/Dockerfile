FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

FROM base AS dev
ENV CI=false
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
EXPOSE 4242
CMD ["pnpm", "run", "dev"]


FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./app/
ENV CI=true
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
COPY package.json pnpm-lock.yaml ./app/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build || (echo "Build failed" && exit 1)

FROM base AS prod
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.vinxi /app/.vinxi
COPY --from=build /app/.output /app/.output
EXPOSE 4242
CMD [ "pnpm", "start"]
