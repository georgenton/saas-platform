import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

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

function printSection(title) {
  process.stdout.write(`\n${title}\n`);
}

function printLine(label, value) {
  process.stdout.write(`- ${label}: ${value ?? 'n/a'}\n`);
}

function readPkcs12File(filePath) {
  const absolutePath = resolve(process.cwd(), filePath);

  if (!existsSync(absolutePath)) {
    throw new Error(`No existe el archivo PKCS#12: ${absolutePath}`);
  }

  const content = readFileSync(absolutePath);

  if (content.length === 0) {
    throw new Error(`El archivo PKCS#12 esta vacio: ${absolutePath}`);
  }

  return {
    absolutePath,
    bytes: content,
  };
}

function runOpenSsl(args, password) {
  return execFileSync('openssl', args, {
    encoding: 'utf8',
    env: password
      ? { ...process.env, PKCS12_PASSWORD: password }
      : process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 1024 * 1024,
  });
}

function tryRunOpenSsl(args, password) {
  try {
    return {
      ok: true,
      output: runOpenSsl(args, password),
    };
  } catch (error) {
    return {
      ok: false,
      error: cleanOpenSslError(error instanceof Error ? error.message : String(error)),
    };
  }
}

function parseOpenSslField(output, prefix) {
  const line = output
    .split('\n')
    .find((item) => item.toLowerCase().startsWith(prefix.toLowerCase()));

  if (!line) {
    return null;
  }

  return line.slice(prefix.length).trim() || null;
}

function parseFingerprint(output) {
  const line = output
    .split('\n')
    .find((item) => item.toLowerCase().includes('fingerprint='));

  if (!line) {
    return null;
  }

  const [, rawFingerprint] = line.split('=');
  return normalizeFingerprint(rawFingerprint ?? null);
}

function normalizeFingerprint(value) {
  if (!value) {
    return null;
  }

  const hex = value.replace(/[^a-fA-F0-9]/g, '').toUpperCase();

  if (hex.length === 0 || hex.length % 2 !== 0) {
    return null;
  }

  return hex.match(/.{1,2}/g)?.join(':') ?? null;
}

function parseDate(output, prefix) {
  const rawValue = parseOpenSslField(output, prefix);

  if (!rawValue) {
    return null;
  }

  const parsed = new Date(rawValue);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function describeValidity(validFrom, validUntil) {
  if (!validFrom || !validUntil) {
    return {
      status: 'unknown',
      daysUntilExpiry: null,
    };
  }

  const from = new Date(validFrom);
  const until = new Date(validUntil);
  const now = new Date();

  if (Number.isNaN(from.getTime()) || Number.isNaN(until.getTime())) {
    return {
      status: 'unknown',
      daysUntilExpiry: null,
    };
  }

  if (from.getTime() > now.getTime()) {
    return {
      status: 'not_yet_valid',
      daysUntilExpiry: Math.ceil((until.getTime() - now.getTime()) / 86400000),
    };
  }

  const daysUntilExpiry = Math.ceil((until.getTime() - now.getTime()) / 86400000);

  if (daysUntilExpiry < 0) {
    return {
      status: 'expired',
      daysUntilExpiry,
    };
  }

  if (daysUntilExpiry <= 30) {
    return {
      status: 'expiring_soon',
      daysUntilExpiry,
    };
  }

  return {
    status: 'valid',
    daysUntilExpiry,
  };
}

function extractLikelyTaxId(subjectName, issuerName) {
  const candidates = [subjectName, issuerName]
    .filter(Boolean)
    .map((value) => value.replace(/\s+/g, ' ').trim());

  for (const candidate of candidates) {
    const labeledMatch = candidate.match(
      /(?:ruc|serialnumber|serial number|oid\.2\.5\.4\.5)\s*[=:]\s*([0-9]{10,13})/i,
    );

    if (labeledMatch?.[1]) {
      return labeledMatch[1];
    }

    const freeNumberMatch = candidate.match(/\b([0-9]{13})\b/);

    if (freeNumberMatch?.[1]) {
      return freeNumberMatch[1];
    }
  }

  return null;
}

function cleanOpenSslError(message) {
  return message
    .replace(/^Command failed: .*?\n?/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function quoteEnv(value) {
  return JSON.stringify(value);
}

function ensureCryptographicProof(pkcs12Path, password) {
  const challengePath = `${pkcs12Path}.challenge.txt`;
  const signaturePath = `${pkcs12Path}.challenge.sig`;
  const certificatePath = `${pkcs12Path}.certificate.pem`;
  const privateKeyPath = `${pkcs12Path}.private-key.pem`;
  const publicKeyPath = `${pkcs12Path}.public-key.pem`;

  writeFileSync(challengePath, 'saas-platform-pkcs12-proof\n', 'utf8');

  const certificateExport = tryRunOpenSsl(
    [
      'pkcs12',
      '-in',
      pkcs12Path,
      '-passin',
      'env:PKCS12_PASSWORD',
      '-clcerts',
      '-nokeys',
      '-out',
      certificatePath,
    ],
    password,
  );

  if (!certificateExport.ok) {
    return {
      status: 'failed',
      detail: `OpenSSL no pudo exportar el certificado. ${certificateExport.error}`,
    };
  }

  const privateKeyExport = tryRunOpenSsl(
    [
      'pkcs12',
      '-in',
      pkcs12Path,
      '-passin',
      'env:PKCS12_PASSWORD',
      '-nocerts',
      '-nodes',
      '-out',
      privateKeyPath,
    ],
    password,
  );

  if (!privateKeyExport.ok) {
    return {
      status: 'failed',
      detail: `OpenSSL no pudo extraer la llave privada. ${privateKeyExport.error}`,
    };
  }

  const publicKeyExport = tryRunOpenSsl(
    ['x509', '-in', certificatePath, '-pubkey', '-noout', '-out', publicKeyPath],
    password,
  );

  if (!publicKeyExport.ok) {
    return {
      status: 'failed',
      detail: `OpenSSL no pudo extraer la clave publica del certificado. ${publicKeyExport.error}`,
    };
  }

  const signResult = tryRunOpenSsl(
    ['dgst', '-sha256', '-sign', privateKeyPath, '-out', signaturePath, challengePath],
    password,
  );

  if (!signResult.ok) {
    return {
      status: 'failed',
      detail: `OpenSSL no pudo firmar el challenge. ${signResult.error}`,
    };
  }

  const verifyResult = tryRunOpenSsl(
    [
      'dgst',
      '-sha256',
      '-verify',
      publicKeyPath,
      '-signature',
      signaturePath,
      challengePath,
    ],
    password,
  );

  if (!verifyResult.ok) {
    return {
      status: 'failed',
      detail: `OpenSSL no pudo verificar la firma del challenge. ${verifyResult.error}`,
    };
  }

  if (!/verified ok/i.test(verifyResult.output)) {
    return {
      status: 'failed',
      detail: `La verificacion no devolvio "Verified OK". ${verifyResult.output.trim()}`,
    };
  }

  return {
    status: 'verified',
    detail:
      'OpenSSL pudo abrir el PKCS#12, extraer la llave privada, firmar un challenge SHA-256 y verificarlo con el certificado.',
  };
}

function main() {
  const file = getArg('file', null);
  const password = getArg('password', null);
  const outFile = getArg('out-file', null);
  const envPkcs12Name = getArg('env-pkcs12-name', 'EC_PKCS12');
  const envPasswordName = getArg('env-password-name', 'EC_PKCS12_PASSWORD');

  if (!file || !password) {
    throw new Error(
      'Uso: pnpm prepare:ec:pkcs12-env -- --file /ruta/certificado.p12 --password TU_PASSWORD [--out-file .env.pkcs12.local]',
    );
  }

  const { absolutePath, bytes } = readPkcs12File(file);
  const metadata = tryRunOpenSsl(
    [
      'pkcs12',
      '-in',
      absolutePath,
      '-passin',
      'env:PKCS12_PASSWORD',
      '-clcerts',
      '-nokeys',
      '-nodes',
      '-legacy',
    ],
    password,
  );

  if (!metadata.ok) {
    const fallback = tryRunOpenSsl(
      [
        'pkcs12',
        '-in',
        absolutePath,
        '-passin',
        'env:PKCS12_PASSWORD',
        '-clcerts',
        '-nokeys',
        '-nodes',
      ],
      password,
    );

    if (!fallback.ok) {
      throw new Error(
        `No se pudo abrir el PKCS#12 con OpenSSL. ${metadata.error} ${fallback.error}`.trim(),
      );
    }
  }

  const tempCertPath = resolve(process.cwd(), '.tmp.pkcs12.certificate.pem');
  let certificateMetadata;

  try {
    const x509Output = runOpenSsl(
      [
        'pkcs12',
        '-in',
        absolutePath,
        '-passin',
        'env:PKCS12_PASSWORD',
        '-clcerts',
        '-nokeys',
        '-legacy',
        '-nodes',
      ],
      password,
    );

    writeFileSync(tempCertPath, x509Output, 'utf8');

    certificateMetadata = runOpenSsl(
      ['x509', '-in', tempCertPath, '-noout', '-subject', '-issuer', '-dates', '-fingerprint', '-sha1'],
      password,
    );
  } finally {
    rmSync(tempCertPath, { force: true });
  }

  const subjectName = parseOpenSslField(certificateMetadata, 'subject=');
  const issuerName = parseOpenSslField(certificateMetadata, 'issuer=');
  const fingerprint = parseFingerprint(certificateMetadata);
  const validFrom = parseDate(certificateMetadata, 'notBefore=');
  const validUntil = parseDate(certificateMetadata, 'notAfter=');
  const validity = describeValidity(validFrom, validUntil);
  const extractedTaxId = extractLikelyTaxId(subjectName, issuerName);
  const cryptographicProof = ensureCryptographicProof(absolutePath, password);

  const envBlock = [
    `# PKCS#12 preparado para sandbox remoto Ecuador`,
    `${envPkcs12Name}=${quoteEnv(bytes.toString('base64'))}`,
    `${envPasswordName}=${quoteEnv(password)}`,
    `EC_PKCS12_SECRET_REF=${quoteEnv(`env:${envPkcs12Name}`)}`,
    `EC_PKCS12_PASSWORD_SECRET_REF=${quoteEnv(`env:${envPasswordName}`)}`,
  ].join('\n');

  if (outFile) {
    const absoluteOutFile = resolve(process.cwd(), outFile);
    mkdirSync(dirname(absoluteOutFile), { recursive: true });
    writeFileSync(absoluteOutFile, `${envBlock}\n`, 'utf8');
  }

  printSection('PKCS#12 Inspection');
  printLine('file', absolutePath);
  printLine('byteLength', bytes.length);
  printLine('fingerprint', fingerprint);
  printLine('subjectName', subjectName);
  printLine('issuerName', issuerName);
  printLine('extractedTaxId', extractedTaxId);
  printLine('validFrom', validFrom);
  printLine('validUntil', validUntil);
  printLine('certificateValidityStatus', validity.status);
  printLine('daysUntilExpiry', validity.daysUntilExpiry);
  printLine('cryptographicProofStatus', cryptographicProof.status);
  printLine('cryptographicProofDetail', cryptographicProof.detail);

  if (outFile) {
    printSection('Output File');
    printLine('path', resolve(process.cwd(), outFile));
  }

  printSection('Env Block');
  process.stdout.write(`${envBlock}\n`);

  if (hasFlag('print-next-steps')) {
    printSection('Next Steps');
    printLine(
      '1',
      `Carga ${envPkcs12Name} y ${envPasswordName} en tu entorno local o pega el bloque anterior en un archivo que no vaya al repo.`,
    );
    printLine(
      '2',
      'Reinicia api-platform para que pueda resolver env:EC_PKCS12 y env:EC_PKCS12_PASSWORD.',
    );
    printLine(
      '3',
      'Vuelve a correr pnpm smoke:ec:remote-submit con el owner y tenant correctos.',
    );
  }
}

try {
  main();
} catch (error) {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
}
