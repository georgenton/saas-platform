# Engineering Workflow

## Commit convention

Use Conventional Commits. Examples:

- `feat(auth): add tenant-aware login flow`
- `fix(prisma): handle missing database url in bootstrap`
- `chore(release): version packages`

## Local hooks

- `commit-msg`: validates commit messages with Commitlint.
- `pre-push`: runs `pnpm check` before code leaves your machine.

Install hooks locally with:

```sh
pnpm install
pnpm prepare
```

## Release flow

1. Create a feature branch.
2. Make changes using Conventional Commits.
3. Add a changeset with `pnpm changeset`.
4. Open a pull request.
5. CI validates Prisma, build, and end-to-end tests.
6. When the PR lands on `main`, GitHub Actions creates or updates the release PR.
7. Merge the release PR to persist the new version in git.

See [release-strategy.md](/Users/jorgequizamanchuro/Projects_local/saas-platform/docs/release-strategy.md) for the recommended branch model, merge strategy, hotfix policy, and GitHub protections.

## Delivery flow

Use the `Delivery` GitHub Actions workflow to build the API artifact for production.

- If `DATABASE_URL` is configured as a GitHub secret, Prisma migrations are applied with `prisma migrate deploy`.
- The workflow uploads `dist/apps/api-platform` as the deployable artifact.
- The workflow also builds the Docker image defined in [Dockerfile](/Users/jorgequizamanchuro/Projects_local/saas-platform/Dockerfile).

See [deployment.md](/Users/jorgequizamanchuro/Projects_local/saas-platform/docs/deployment.md) for local packaging, Docker usage, and deployment guidance.
