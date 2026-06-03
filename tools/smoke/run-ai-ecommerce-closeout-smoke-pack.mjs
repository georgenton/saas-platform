import { execFileSync } from 'node:child_process';

import {
  getArg,
  hasFlag,
  loadDotEnv,
  normalizeBaseUrl,
  printLine,
  printSection,
  resolveToken,
} from './ec-sandbox-smoke-lib.mjs';

function buildSharedArgs({ baseUrl, tenantSlug, token }) {
  return ['--base-url', baseUrl, '--tenant-slug', tenantSlug, '--token', token];
}

function appendLaunchBootstrapArgs(args) {
  const bootstrapPlanKey = getArg('bootstrap-plan-key', '');
  const shouldBootstrapIfDisabled =
    hasFlag('bootstrap-if-disabled') || bootstrapPlanKey.length > 0;

  if (shouldBootstrapIfDisabled) {
    args.push('--bootstrap-if-disabled');
  }

  if (bootstrapPlanKey) {
    args.push('--bootstrap-plan-key', bootstrapPlanKey);
  }
}

function appendInvoiceBootstrapArgs(args) {
  const bootstrapDraftId = getArg('bootstrap-draft-id', '');
  const bootstrapPlanKey = getArg('bootstrap-plan-key', '');

  if (hasFlag('no-bootstrap-product-entity')) {
    args.push('--no-bootstrap-product-entity');
  }

  if (bootstrapPlanKey) {
    args.push('--bootstrap-plan-key', bootstrapPlanKey);
  }

  if (bootstrapDraftId) {
    args.push('--bootstrap-draft-id', bootstrapDraftId);
  }
}

function runSmokeStep({ label, script, args }) {
  printSection(`Ecommerce Smoke Step · ${label}`);
  printLine('script', script);

  execFileSync('node', [script, ...args], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}

async function main() {
  loadDotEnv();

  const baseUrl = normalizeBaseUrl(
    getArg('base-url', 'http://127.0.0.1:3000/api'),
  );
  const tenantSlug = getArg('tenant-slug', 'saas-platform-local');
  const token = resolveToken();
  const sharedArgs = buildSharedArgs({ baseUrl, tenantSlug, token });
  const launchArgs = [...sharedArgs];
  const invoiceArgs = [...sharedArgs];

  appendLaunchBootstrapArgs(launchArgs);
  appendInvoiceBootstrapArgs(invoiceArgs);

  const steps = [
    !hasFlag('skip-launch') && {
      label: 'Launch readiness',
      script: 'tools/smoke/run-ai-ecommerce-launch-smoke.mjs',
      args: launchArgs,
    },
    !hasFlag('skip-post-sale') && {
      label: 'Post-sale closeout',
      script: 'tools/smoke/run-ai-ecommerce-post-sale-closeout-smoke.mjs',
      args: sharedArgs,
    },
    !hasFlag('skip-invoice-handoff') && {
      label: 'Invoice handoff',
      script: 'tools/smoke/run-ai-ecommerce-invoice-handoff-smoke.mjs',
      args: invoiceArgs,
    },
  ].filter(Boolean);

  printSection('AI Ecommerce Closeout Smoke Pack');
  printLine('tenantSlug', tenantSlug);
  printLine('baseUrl', baseUrl);
  printLine('steps', steps.length);

  if (steps.length === 0) {
    throw new Error('No ecommerce smoke steps selected.');
  }

  for (const step of steps) {
    runSmokeStep(step);
  }

  printSection('Result');
  printLine('status', 'ok');
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
