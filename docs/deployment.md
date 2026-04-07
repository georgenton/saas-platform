# Deployment

## Deployable outputs

This repository now produces two deployable forms for the API:

- `dist/apps/api-platform`: Nx-packaged Node.js artifact
- `Dockerfile`: container image for runtime environments that prefer Docker

## Local packaging

Build the deployable API package:

```sh
pnpm package:api
```

This runs:

1. `pnpm nx build api-platform`
2. `pnpm nx run api-platform:prune`

The final output lives in:

```sh
dist/apps/api-platform
```

## Local Docker build

Build the image:

```sh
docker build -t saas-platform-api:local .
```

Run it:

```sh
docker run --rm \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public" \
  saas-platform-api:local
```

The container will:

1. expose the API on `0.0.0.0:3000`
2. run `prisma migrate deploy`
3. start `node main.js`

## CI delivery

The `Delivery` workflow:

1. installs dependencies
2. generates Prisma Client
3. validates Prisma schema
4. packages the API artifact
5. optionally runs migrations when `DATABASE_URL` is configured
6. uploads the artifact
7. builds the Docker image

## Provider recommendation

For an early SaaS foundation:

- use Docker-based deployment if your provider supports it
- inject `DATABASE_URL` as a secret
- run only one migration step per deployment pipeline
- keep application startup separate from build

Good early-stage targets:

- Render
- Railway
- Fly.io
- ECS/Fargate if you already have AWS maturity
