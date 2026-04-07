# GitHub Activation

## Target repository

- Repository: `georgenton/saas-platform`
- Visibility: `private`

## What is already prepared in the codebase

- CI workflow: [ci.yml](/Users/jorgequizamanchuro/Projects_local/saas-platform/.github/workflows/ci.yml)
- Release PR workflow: [release.yml](/Users/jorgequizamanchuro/Projects_local/saas-platform/.github/workflows/release.yml)
- Delivery workflow: [delivery.yml](/Users/jorgequizamanchuro/Projects_local/saas-platform/.github/workflows/delivery.yml)
- PR title validation: [pr-title.yml](/Users/jorgequizamanchuro/Projects_local/saas-platform/.github/workflows/pr-title.yml)
- Pull request template: [pull_request_template.md](/Users/jorgequizamanchuro/Projects_local/saas-platform/.github/pull_request_template.md)
- Code owners: [CODEOWNERS](/Users/jorgequizamanchuro/Projects_local/saas-platform/.github/CODEOWNERS)

## Step 1: create the repository in GitHub

Create a private repository named `saas-platform` under `georgenton`.

Do not initialize it with:

- README
- `.gitignore`
- license

The local repository already contains those files.

## Step 2: connect the local repo

Run:

```sh
git remote add origin https://github.com/georgenton/saas-platform.git
git push -u origin main
```

If `origin` already exists, use:

```sh
git remote set-url origin https://github.com/georgenton/saas-platform.git
git push -u origin main
```

## Step 3: configure repository settings

In GitHub:

1. Open `Settings` -> `General`
2. Enable `Squash merge`
3. Disable merge commits if you want a cleaner history
4. Set the default branch to `main`

## Step 4: branch protection for `main`

In `Settings` -> `Branches` -> `Add branch protection rule`:

- Branch name pattern: `main`
- Require a pull request before merging
- Require approvals: `1`
- Dismiss stale approvals when new commits are pushed
- Require review from Code Owners
- Require status checks to pass before merging
- Required checks:
  - `CI / validate`
  - `PR Title / semantic-pr-title`
- Require branches to be up to date before merging
- Restrict pushes that create matching branches
- Do not allow bypassing the above settings

## Step 5: secrets

In `Settings` -> `Secrets and variables` -> `Actions`, create:

- `DATABASE_URL`

Optional later, depending on provider:

- `RENDER_API_KEY`
- `RAILWAY_TOKEN`
- `FLY_API_TOKEN`
- cloud provider credentials

## Step 6: verify workflows

Open the `Actions` tab and confirm these workflows are available:

- `CI`
- `PR Title`
- `Release PR`
- `Delivery`

## Step 7: first release-ready PR

For your first feature PR:

1. create a feature branch
2. make your changes
3. run `pnpm changeset`
4. open a PR with a semantic title, for example:
   - `feat(core): bootstrap tenancy and identity foundations`

After merge to `main`, the release workflow should open or update the release PR.
