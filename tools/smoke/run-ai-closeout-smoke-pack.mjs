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
  return [
    '--base-url',
    baseUrl,
    '--tenant-slug',
    tenantSlug,
    '--token',
    token,
  ];
}

function runSmokeStep({ label, script, args }) {
  printSection(`Smoke Step · ${label}`);
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
  const bootstrapPlanKey = getArg('bootstrap-plan-key', '');
  const shouldBootstrapIfDisabled =
    hasFlag('bootstrap-if-disabled') || bootstrapPlanKey.length > 0;

  const sharedArgs = buildSharedArgs({ baseUrl, tenantSlug, token });
  const ecommerceArgs = [...sharedArgs];

  if (shouldBootstrapIfDisabled) {
    ecommerceArgs.push('--bootstrap-if-disabled');
  }

  if (bootstrapPlanKey) {
    ecommerceArgs.push('--bootstrap-plan-key', bootstrapPlanKey);
  }

  const steps = [
    {
      label: 'Retrieval-fed run',
      script: 'tools/smoke/run-ai-retrieval-fed-run-smoke.mjs',
      args: sharedArgs,
    },
    {
      label: 'Ecommerce launch',
      script: 'tools/smoke/run-ai-ecommerce-launch-smoke.mjs',
      args: ecommerceArgs,
    },
    {
      label: 'Growth guarded lane',
      script: 'tools/smoke/run-ai-guarded-execution-growth-lane-smoke.mjs',
      args: sharedArgs,
    },
    {
      label: 'Growth rejection fallback',
      script: 'tools/smoke/run-ai-guarded-execution-rejection-fallback-smoke.mjs',
      args: sharedArgs,
    },
    {
      label: 'Invoice guarded lane',
      script: 'tools/smoke/run-ai-guarded-execution-invoice-lane-smoke.mjs',
      args: sharedArgs,
    },
    {
      label: 'Invoice rejection fallback',
      script:
        'tools/smoke/run-ai-guarded-execution-invoice-rejection-fallback-smoke.mjs',
      args: sharedArgs,
    },
  ];

  printSection('AI Closeout Smoke Pack');
  printLine('tenantSlug', tenantSlug);
  printLine('baseUrl', baseUrl);
  printLine('steps', steps.length);

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
