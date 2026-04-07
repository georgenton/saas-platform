FROM node:20.20.1-bookworm-slim AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json jest.preset.js ./
COPY .changeset ./.changeset
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN pnpm prisma:generate
RUN pnpm package:api

FROM node:20.20.1-bookworm-slim AS runtime

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

RUN corepack enable

WORKDIR /app

COPY --from=build /workspace/dist/apps/api-platform/package.json ./package.json
COPY --from=build /workspace/dist/apps/api-platform/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --prod --frozen-lockfile

COPY --from=build /workspace/dist/apps/api-platform ./

EXPOSE 3000

CMD ["sh", "-c", "pnpm exec prisma migrate deploy --schema ./prisma/schema.prisma && node main.js"]
