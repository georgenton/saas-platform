import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function loadDotEnv() {
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

export function getArg(name, fallback) {
  const flag = `--${name}`;
  const index = process.argv.indexOf(flag);

  if (index === -1 || !process.argv[index + 1]) {
    return fallback;
  }

  return process.argv[index + 1];
}

export function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

export function toBoolean(value) {
  return value === 'true' || value === '1' || value === 'yes';
}

export function toNullable(value) {
  if (value === undefined) {
    return undefined;
  }

  if (value === 'null' || value === 'NULL' || value === '') {
    return null;
  }

  return value;
}

export function printSection(title) {
  process.stdout.write(`\n${title}\n`);
}

export function printLine(label, value) {
  process.stdout.write(`- ${label}: ${value ?? 'n/a'}\n`);
}

export function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, '');
}

export function resolveToken() {
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

export async function apiRequest({
  baseUrl,
  path,
  token,
  method = 'GET',
  body,
}) {
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

export async function bootstrapRemoteSandboxConfiguration({
  baseUrl,
  tenantSlug,
  token,
}) {
  const signatureProvider = getArg('signature-provider', 'xades_pkcs12');
  const signatureStorageMode = getArg('signature-storage-mode', 'secret_ref');
  const pkcs12SecretRef = toNullable(
    getArg(
      'pkcs12-secret-ref',
      process.env.EC_PKCS12_SECRET_REF || 'env:EC_PKCS12',
    ),
  );
  const privateKeyPasswordSecretRef = toNullable(
    getArg(
      'pkcs12-password-secret-ref',
      process.env.EC_PKCS12_PASSWORD_SECRET_REF || 'env:EC_PKCS12_PASSWORD',
    ),
  );
  const certificateLabel = getArg(
    'certificate-label',
    'Firma interna PKCS#12 Sandbox',
  );
  const submissionProvider = getArg('submission-provider', 'sri_offline_ws');
  const submissionEnvironment = getArg('submission-environment', 'test');
  const submissionMode = getArg('submission-mode', 'offline');
  const receptionUrl = toNullable(
    getArg(
      'submission-reception-url',
      'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
    ),
  );
  const authorizationUrl = toNullable(
    getArg(
      'submission-authorization-url',
      'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
    ),
  );
  const credentialsSecretRef = toNullable(
    getArg(
      'submission-credentials-secret-ref',
      process.env.EC_SRI_WS_CREDENTIALS_SECRET_REF || 'null',
    ),
  );
  const timeoutMs = Number.parseInt(
    getArg('submission-timeout-ms', '10000'),
    10,
  );
  const hydrateMetadataFromPkcs12 = !(
    hasFlag('no-hydrate-metadata-from-pkcs12') ||
    toBoolean(getArg('no-hydrate-metadata-from-pkcs12', 'false'))
  );

  if (!pkcs12SecretRef || !privateKeyPasswordSecretRef) {
    throw new Error(
      'Bootstrap remoto incompleto. Proporciona --pkcs12-secret-ref y --pkcs12-password-secret-ref, o define EC_PKCS12_SECRET_REF / EC_PKCS12_PASSWORD_SECRET_REF.',
    );
  }

  if (Number.isNaN(timeoutMs) || timeoutMs <= 0) {
    throw new Error('submission-timeout-ms debe ser un entero positivo.');
  }

  const signatureSettings = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/electronic-signature`,
    token,
    method: 'POST',
    body: {
      provider: signatureProvider,
      certificateLabel,
      storageMode: signatureStorageMode,
      certificateFingerprint: null,
      pkcs12SecretRef,
      privateKeyPasswordSecretRef,
      subjectName: null,
      hydrateMetadataFromPkcs12,
      isActive: true,
    },
  });

  const submissionSettings = await apiRequest({
    baseUrl,
    path: `/invoicing/tenants/${encodeURIComponent(
      tenantSlug,
    )}/electronic-submission`,
    token,
    method: 'POST',
    body: {
      provider: submissionProvider,
      environment: submissionEnvironment,
      transmissionMode: submissionMode,
      receptionUrl,
      authorizationUrl,
      credentialsSecretRef,
      timeoutMs,
      isActive: true,
    },
  });

  printSection('Remote Sandbox Bootstrap');
  printLine('signatureProvider', signatureSettings.provider);
  printLine('signatureStorageMode', signatureSettings.storageMode);
  printLine('signatureMaterialConfigured', signatureSettings.materialConfigured);
  printLine('submissionProvider', submissionSettings.provider);
  printLine('submissionEnvironment', submissionSettings.environment);
  printLine('submissionMode', submissionSettings.transmissionMode);
  printLine('gatewayConfigured', submissionSettings.gatewayConfigured);

  return { signatureSettings, submissionSettings };
}
