import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadDotEnv() {
  const envPath = resolve(process.cwd(), '.env');

  if (!existsSync(envPath)) {
    return;
  }

  const content = readFileSync(envPath, 'utf8');

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function getArg(name, fallback) {
  const flag = `--${name}`;
  const index = process.argv.indexOf(flag);

  if (index === -1 || !process.argv[index + 1]) {
    return fallback;
  }

  return process.argv[index + 1];
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function toBoolean(value) {
  return value === 'true' || value === '1' || value === 'yes';
}

function printSection(title) {
  process.stdout.write(`\n${title}\n`);
}

function printLine(label, value) {
  process.stdout.write(`- ${label}: ${value ?? 'n/a'}\n`);
}

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, '');
}

function resolveToken() {
  const explicitToken = getArg('token', process.env.SMOKE_OWNER_TOKEN);

  if (explicitToken) {
    return explicitToken;
  }

  const sub = getArg('sub', process.env.SMOKE_OWNER_SUB);
  const email = getArg('email', process.env.SMOKE_OWNER_EMAIL);

  if (!sub || !email) {
    throw new Error(
      'Missing authentication context. Provide --token or both --sub and --email.',
    );
  }

  return execFileSync(
    'node',
    [
      'tools/auth/generate-local-jwt.mjs',
      '--sub',
      sub,
      '--email',
      email,
    ],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
    },
  ).trim();
}

async function apiRequest({ baseUrl, path, token, method = 'GET', body }) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const error =
      typeof data === 'object' && data && 'message' in data
        ? data.message
        : text || response.statusText;

    throw new Error(`${method} ${path} failed (${response.status}): ${error}`);
  }

  return data;
}

async function main() {
  loadDotEnv();

  const baseUrl = normalizeBaseUrl(
    getArg('base-url', 'http://127.0.0.1:3000/api'),
  );
  const tenantSlug = getArg('tenant-slug', 'saas-platform-local');
  const syncIssuerTaxId =
    hasFlag('sync-issuer-tax-id') ||
    toBoolean(getArg('sync-issuer-tax-id', 'false'));
  const requireRemoteReady =
    hasFlag('require-remote-ready') ||
    toBoolean(getArg('require-remote-ready', 'false'));

  const token = resolveToken();

  const inspectionResponse = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/electronic-signature/inspection`,
    token,
  });

  const inspection = inspectionResponse.inspection;

  printSection('Electronic Signature Inspection');
  printLine('tenantSlug', inspectionResponse.tenantSlug);
  printLine('status', inspection.status);
  printLine('probeMethod', inspection.probeMethod);
  printLine('detail', inspection.detail);
  printLine('extractedTaxId', inspection.extractedTaxId);
  printLine('certificateValidityStatus', inspection.certificateValidityStatus);
  printLine('cryptographicProofStatus', inspection.cryptographicProofStatus);

  let issuerProfile = null;
  let issuerProfileFetchError = null;

  try {
    issuerProfile = await apiRequest({
      baseUrl,
      path: `/invoicing/tenants/${encodeURIComponent(
        tenantSlug,
      )}/electronic-profile`,
      token,
    });
  } catch (error) {
    issuerProfileFetchError = error;
  }

  if (issuerProfile) {
    printSection('Issuer Profile');
    printLine('legalName', issuerProfile.legalName);
    printLine('taxId', issuerProfile.taxId);
    printLine('environment', issuerProfile.environment);
  } else {
    printSection('Issuer Profile');
    printLine('status', 'not_configured');
    printLine(
      'detail',
      issuerProfileFetchError instanceof Error
        ? issuerProfileFetchError.message
        : 'Issuer profile is not configured.',
    );
  }

  if (
    syncIssuerTaxId &&
    issuerProfile &&
    inspection.extractedTaxId &&
    issuerProfile.taxId !== inspection.extractedTaxId
  ) {
    printSection('Issuer Alignment Action');
    printLine('action', 'upsert electronic profile using extracted certificate tax id');

    issuerProfile = await apiRequest({
      baseUrl,
      path: `/invoicing/tenants/${encodeURIComponent(
        tenantSlug,
      )}/electronic-profile/sync-certificate-tax-id`,
      token,
      method: 'POST',
    });

    printLine('updatedTaxId', issuerProfile.taxId);
  } else if (syncIssuerTaxId) {
    printSection('Issuer Alignment Action');
    if (!issuerProfile) {
      printLine(
        'result',
        'skipped: issuer profile is missing, so the script cannot align taxId automatically.',
      );
    } else if (!inspection.extractedTaxId) {
      printLine(
        'result',
        'skipped: the certificate inspection did not expose an extracted tax id.',
      );
    } else {
      printLine('result', 'skipped: issuer profile tax id already matches certificate.');
    }
  }

  const readiness = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/electronic-document/readiness`,
    token,
  });

  printSection('Sandbox Readiness');
  printLine(
    'isReadyForRemoteSandboxSubmission',
    readiness.isReadyForRemoteSandboxSubmission,
  );
  printLine(
    'isReadyForPresignedRemoteSandboxSubmission',
    readiness.isReadyForPresignedRemoteSandboxSubmission,
  );
  printLine(
    'internalSignerIssuerAlignmentStatus',
    readiness.internalSignerIssuerAlignmentStatus,
  );
  printLine(
    'internalSignerIssuerAlignmentDetail',
    readiness.internalSignerIssuerAlignmentDetail,
  );
  printLine(
    'internalSignerExtractedTaxId',
    readiness.internalSignerExtractedTaxId,
  );
  printLine(
    'internalSignerOfflineCompatibilityStatus',
    readiness.internalSignerOfflineCompatibilityStatus,
  );
  printLine('latestRemoteSriSubmissionStatus', readiness.latestRemoteSriSubmissionStatus);
  printLine(
    'latestRemoteSriSubmissionSummary',
    readiness.latestRemoteSriSubmissionSummary,
  );
  printLine('recommendedNextStep', readiness.recommendedNextStep);

  if (Array.isArray(readiness.blockers) && readiness.blockers.length > 0) {
    printSection('Blockers');
    for (const blocker of readiness.blockers) {
      printLine('blocker', blocker);
    }
  }

  if (Array.isArray(readiness.warnings) && readiness.warnings.length > 0) {
    printSection('Warnings');
    for (const warning of readiness.warnings) {
      printLine('warning', warning);
    }
  }

  if (requireRemoteReady && !readiness.isReadyForRemoteSandboxSubmission) {
    process.exitCode = 1;
    printSection('Result');
    printLine(
      'status',
      'failed: remote sandbox readiness is still blocked for internal signer flow.',
    );
    return;
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
