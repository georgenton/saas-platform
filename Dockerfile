FROM node:20.20.1-bookworm-slim AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json jest.preset.js ./
COPY .changeset ./.changeset
COPY apps ./apps
COPY docs/api ./docs/api
COPY packages ./packages
COPY vendor ./vendor

RUN apt-get update && apt-get install -y --no-install-recommends libxml2-utils openssl \
  && rm -rf /var/lib/apt/lists/*

RUN pnpm install --frozen-lockfile
RUN pnpm prisma:generate
RUN pnpm package:api

FROM node:20.20.1-bookworm-slim AS runtime

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends libxml2-utils openssl \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /workspace/dist/apps/api-platform/package.json ./package.json
COPY --from=build /workspace/dist/apps/api-platform/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --prod --frozen-lockfile

COPY --from=build /workspace/dist/apps/api-platform ./
COPY --from=build /workspace/docs ./docs
COPY --from=build /workspace/vendor ./vendor

RUN pnpm exec prisma generate --schema ./prisma/schema.prisma

EXPOSE 3000

CMD ["sh", "-c", "pnpm exec prisma migrate deploy --schema ./prisma/schema.prisma && node main.js"]
