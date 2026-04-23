import { createHmac } from 'node:crypto';
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

function base64UrlEncode(value) {
  const buffer = Buffer.isBuffer(value)
    ? value
    : Buffer.from(JSON.stringify(value));

  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function getArg(name, fallback) {
  const flag = `--${name}`;
  const index = process.argv.indexOf(flag);

  if (index === -1 || !process.argv[index + 1]) {
    return fallback;
  }

  return process.argv[index + 1];
}

loadDotEnv();

const secret = process.env.AUTH_JWT_SECRET;

if (!secret) {
  console.error(
    'AUTH_JWT_SECRET is required. Configure AUTH_JWT_VERIFIER_MODE=local and AUTH_JWT_SECRET in .env first.',
  );
  process.exit(1);
}

const now = Math.floor(Date.now() / 1000);
const expiresIn = Number(getArg('expires-in', '3600'));
const sub = getArg('sub', 'replace-with-user-id');
const email = getArg('email', 'hello@saas-platform.dev');
const provider = getArg('provider', 'password');
const externalAuthId = getArg('external-auth-id', undefined);
const iss = getArg('iss', undefined);
const aud = getArg('aud', undefined);

const header = {
  alg: 'HS256',
  typ: 'JWT',
};

const payload = {
  sub,
  email,
  provider,
  ...(externalAuthId ? { externalAuthId } : {}),
  ...(iss ? { iss } : {}),
  ...(aud ? { aud } : {}),
  iat: now,
  exp: now + expiresIn,
};

const encodedHeader = base64UrlEncode(header);
const encodedPayload = base64UrlEncode(payload);
const signingInput = `${encodedHeader}.${encodedPayload}`;
const signature = createHmac('sha256', secret).update(signingInput).digest();
const encodedSignature = base64UrlEncode(signature);

process.stdout.write(`${signingInput}.${encodedSignature}\n`);
