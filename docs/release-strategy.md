# Release Strategy

## Branch model

- `main`: production-ready branch. Only reviewed and green changes land here.
- `develop`: optional integration branch for batching ongoing work before promoting to `main`.
- `feature/<scope>`: regular feature work.
- `fix/<scope>`: bug fixes.
- `hotfix/<scope>`: urgent production fixes that should land on `main` first and then be back-merged.

If your team is still small, you can simplify this to `main` + short-lived feature branches and add `develop` later.

## Merge strategy

Use **Squash and merge** in GitHub.

Repository settings should be configured to:

- enable squash merge
- disable merge commits if you want a cleaner history
- default squash commit message to the PR title

This matters because the PR title is part of the semantic workflow enforced by CI.

## Versioning model

This repository uses Changesets even though it is private.

- Every user-facing or operationally relevant change should have a changeset.
- Internal-only refactors can skip a changeset if they truly do not affect release notes or deployment behavior.
- Private packages are still versioned and tagged so the team can track deployments and recover releases.

Recommended bump policy:

- `patch`: fixes, internal hardening, non-breaking infrastructure changes
- `minor`: new backward-compatible capabilities
- `major`: breaking changes to contracts, runtime requirements, or deployment expectations

## Release process

1. Open a feature PR with a Conventional Commit title.
2. Add a changeset with `pnpm changeset` if the change deserves release notes or a version bump.
3. Merge into `main`.
4. The `Release PR` workflow opens or updates the release PR.
5. Review the generated version updates and changelog.
6. Merge the release PR.
7. Trigger the `Delivery` workflow for the environment you want to package or deploy.

## Hotfix process

1. Create `hotfix/<scope>` from `main`.
2. Apply the minimal fix.
3. Add a patch changeset.
4. Merge the PR into `main`.
5. Run delivery.
6. Back-merge into `develop` if you are using it.

## Protections to enable in GitHub

For `main`:

- require pull requests before merging
- require status checks to pass:
  - `CI / validate`
  - `PR Title / semantic-pr-title`
- require branch to be up to date before merging
- restrict direct pushes
- require linear history if you want squash-only history

For `develop` if used:

- require pull requests before merging
- require `CI / validate`
