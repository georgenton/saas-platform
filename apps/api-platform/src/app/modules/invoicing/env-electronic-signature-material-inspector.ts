import { Inject, Injectable } from '@nestjs/common';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import {
  ElectronicSignatureMaterialInspection,
  ElectronicSignatureMaterialInspector,
  InspectElectronicSignatureMaterialInput,
  SECRET_REFERENCE_RESOLVER,
  SecretReferenceResolver,
} from '@saas-platform/invoicing-application';

const execFileAsync = promisify(execFile);

@Injectable()
export class EnvElectronicSignatureMaterialInspector
  implements ElectronicSignatureMaterialInspector
{
  constructor(
    @Inject(SECRET_REFERENCE_RESOLVER)
    private readonly secretReferenceResolver: SecretReferenceResolver,
  ) {}

  async inspect(
    input: InspectElectronicSignatureMaterialInput,
  ): Promise<ElectronicSignatureMaterialInspection> {
    const { signatureSettings } = input;

    if (!signatureSettings.isActive) {
      return {
        status: 'not_configured',
        detail: 'No existe una configuracion activa de firma electronica.',
        encoding: 'not_applicable',
        probeMethod: 'not_applicable',
        certificateValidityStatus: 'not_applicable',
        cryptographicProofStatus: 'not_applicable',
        cryptographicProofDetail:
          'No existe una configuracion activa de firma electronica.',
        passwordPresent: false,
        hasAdvisoryWarning: false,
        fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
        subjectNamePresent: Boolean(signatureSettings.subjectName),
        extractedFingerprint: null,
        extractedTaxId: null,
        extractedSubjectName: null,
        extractedIssuerName: null,
        validFrom: null,
        validUntil: null,
        daysUntilExpiry: null,
        byteLength: null,
      };
    }

    if (signatureSettings.provider !== 'xades_pkcs12') {
      return {
        status: 'not_applicable',
        detail:
          'El provider actual no usa PKCS#12. Esta inspeccion solo aplica al carril de firma interna xades_pkcs12.',
        encoding: 'not_applicable',
        probeMethod: 'not_applicable',
        certificateValidityStatus: 'not_applicable',
        cryptographicProofStatus: 'not_applicable',
        cryptographicProofDetail:
          'El provider actual no usa PKCS#12. La prueba criptografica no aplica.',
        passwordPresent: false,
        hasAdvisoryWarning: false,
        fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
        subjectNamePresent: Boolean(signatureSettings.subjectName),
        extractedFingerprint: null,
        extractedTaxId: null,
        extractedSubjectName: null,
        extractedIssuerName: null,
        validFrom: null,
        validUntil: null,
        daysUntilExpiry: null,
        byteLength: null,
      };
    }

    if (
      !signatureSettings.pkcs12SecretRef ||
      !signatureSettings.privateKeyPasswordSecretRef
    ) {
      return {
        status: 'invalid',
        detail:
          'La configuracion xades_pkcs12 todavia no expone referencias completas para el PKCS#12 y su password.',
        encoding: 'unknown',
        probeMethod: 'shape_only',
        certificateValidityStatus: 'unknown',
        cryptographicProofStatus: 'unknown',
        cryptographicProofDetail:
          'La prueba criptografica no puede ejecutarse hasta resolver el PKCS#12 y su password.',
        passwordPresent: false,
        hasAdvisoryWarning: false,
        fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
        subjectNamePresent: Boolean(signatureSettings.subjectName),
        extractedFingerprint: null,
        extractedTaxId: null,
        extractedSubjectName: null,
        extractedIssuerName: null,
        validFrom: null,
        validUntil: null,
        daysUntilExpiry: null,
        byteLength: null,
      };
    }

    try {
      const [resolvedPkcs12, resolvedPassword] = await Promise.all([
        this.secretReferenceResolver.resolve(signatureSettings.pkcs12SecretRef),
        this.secretReferenceResolver.resolve(
          signatureSettings.privateKeyPasswordSecretRef,
        ),
      ]);
      const passwordPresent = resolvedPassword.trim().length > 0;

      if (!passwordPresent) {
        return {
          status: 'invalid',
          detail:
            'La referencia del password responde, pero el valor resuelto sigue vacio.',
          encoding: 'unknown',
          probeMethod: 'shape_only',
          certificateValidityStatus: 'unknown',
          cryptographicProofStatus: 'unknown',
          cryptographicProofDetail:
            'La prueba criptografica no puede ejecutarse porque el password resuelto sigue vacio.',
          passwordPresent: false,
          hasAdvisoryWarning: false,
          fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
          subjectNamePresent: Boolean(signatureSettings.subjectName),
          extractedFingerprint: null,
          extractedTaxId: null,
          extractedSubjectName: null,
          extractedIssuerName: null,
          validFrom: null,
          validUntil: null,
          daysUntilExpiry: null,
          byteLength: null,
        };
      }

      const normalizedPkcs12 = resolvedPkcs12.trim();

      if (!normalizedPkcs12) {
        return {
          status: 'invalid',
          detail:
            'La referencia del PKCS#12 responde, pero el valor resuelto sigue vacio.',
          encoding: 'unknown',
          probeMethod: 'shape_only',
          certificateValidityStatus: 'unknown',
          cryptographicProofStatus: 'unknown',
          cryptographicProofDetail:
            'La prueba criptografica no puede ejecutarse porque el PKCS#12 resuelto sigue vacio.',
          passwordPresent: true,
          hasAdvisoryWarning: false,
          fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
          subjectNamePresent: Boolean(signatureSettings.subjectName),
          extractedFingerprint: null,
          extractedTaxId: null,
          extractedSubjectName: null,
          extractedIssuerName: null,
          validFrom: null,
          validUntil: null,
          daysUntilExpiry: null,
          byteLength: null,
        };
      }

      if (/-----BEGIN [A-Z0-9 ]+-----/.test(normalizedPkcs12)) {
        return {
          status: 'invalid',
          detail:
            'El material resuelto parece PEM textual. Para xades_pkcs12 esperamos un PKCS#12 serializado en base64.',
          encoding: 'pem_like',
          probeMethod: 'shape_only',
          certificateValidityStatus: 'unknown',
          cryptographicProofStatus: 'unknown',
          cryptographicProofDetail:
            'La prueba criptografica no puede ejecutarse porque el material no corresponde a un PKCS#12 serializado en base64.',
          passwordPresent: true,
          hasAdvisoryWarning: false,
          fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
          subjectNamePresent: Boolean(signatureSettings.subjectName),
          extractedFingerprint: null,
          extractedTaxId: null,
          extractedSubjectName: null,
          extractedIssuerName: null,
          validFrom: null,
          validUntil: null,
          daysUntilExpiry: null,
          byteLength: null,
        };
      }

      const decodedPkcs12 = decodeBase64Pkcs12(normalizedPkcs12);

      if (!decodedPkcs12) {
        return {
          status: 'invalid',
          detail:
            'El material resuelto no parece un PKCS#12 base64 valido. La frontera interna todavia no podria cargarlo de forma confiable.',
          encoding: 'unknown',
          probeMethod: 'shape_only',
          certificateValidityStatus: 'unknown',
          cryptographicProofStatus: 'unknown',
          cryptographicProofDetail:
            'La prueba criptografica no puede ejecutarse porque el material no decodifica como PKCS#12 base64 valido.',
          passwordPresent: true,
          hasAdvisoryWarning: false,
          fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
          subjectNamePresent: Boolean(signatureSettings.subjectName),
          extractedFingerprint: null,
          extractedTaxId: null,
          extractedSubjectName: null,
          extractedIssuerName: null,
          validFrom: null,
          validUntil: null,
          daysUntilExpiry: null,
          byteLength: null,
        };
      }

      if (decodedPkcs12.length < 64 || decodedPkcs12[0] !== 0x30) {
        return {
          status: 'invalid',
          detail:
            'El material base64 decodifica, pero no conserva la forma ASN.1 esperada para un PKCS#12 utilizable.',
          encoding: 'base64_der',
          probeMethod: 'shape_only',
          certificateValidityStatus: 'unknown',
          cryptographicProofStatus: 'unknown',
          cryptographicProofDetail:
            'La prueba criptografica no puede ejecutarse porque el DER no conserva la forma esperada de un PKCS#12 utilizable.',
          passwordPresent: true,
          hasAdvisoryWarning: false,
          fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
          subjectNamePresent: Boolean(signatureSettings.subjectName),
          extractedFingerprint: null,
          extractedTaxId: null,
          extractedSubjectName: null,
          extractedIssuerName: null,
          validFrom: null,
          validUntil: null,
          daysUntilExpiry: null,
          byteLength: decodedPkcs12.length,
        };
      }

      const opensslInspection = await inspectPkcs12WithOpenSsl({
        pkcs12Bytes: decodedPkcs12,
        password: resolvedPassword,
      });
      const configuredFingerprint = normalizeFingerprint(
        signatureSettings.certificateFingerprint,
      );
      const extractedFingerprint = normalizeFingerprint(
        opensslInspection.fingerprint,
      );
      const extractedTaxId = extractLikelyTaxIdFromCertificate({
        subjectName: opensslInspection.subjectName,
        issuerName: opensslInspection.issuerName,
      });
      const extractedSubjectName = opensslInspection.subjectName?.trim() ?? null;
      const certificateValidity = describeCertificateValidity(
        opensslInspection.validFrom,
        opensslInspection.validUntil,
      );
      const cryptographicProof = opensslInspection.cryptographicProof;

      if (
        configuredFingerprint &&
        extractedFingerprint &&
        configuredFingerprint !== extractedFingerprint
      ) {
        return {
          status: 'invalid',
          detail: `El PKCS#12 pudo abrirse con OpenSSL, pero la huella configurada no coincide con el certificado extraido (${extractedFingerprint}).`,
          encoding: 'base64_der',
          probeMethod: 'openssl_pkcs12',
          certificateValidityStatus: certificateValidity.status,
          cryptographicProofStatus: cryptographicProof.status,
          cryptographicProofDetail: cryptographicProof.detail,
          passwordPresent: true,
          hasAdvisoryWarning: false,
          fingerprintPresent: true,
          subjectNamePresent: Boolean(signatureSettings.subjectName),
          extractedFingerprint,
          extractedTaxId,
          extractedSubjectName,
          extractedIssuerName: opensslInspection.issuerName,
          validFrom: opensslInspection.validFrom,
          validUntil: opensslInspection.validUntil,
          daysUntilExpiry: certificateValidity.daysUntilExpiry,
          byteLength: decodedPkcs12.length,
        };
      }

      const metadataHints: string[] = [];

      if (!configuredFingerprint && extractedFingerprint) {
        metadataHints.push(
          `conviene registrar certificateFingerprint=${extractedFingerprint}`,
        );
      }

      const configuredSubjectName = normalizeSubjectName(
        signatureSettings.subjectName,
      );
      const normalizedExtractedSubjectName = normalizeSubjectName(
        extractedSubjectName,
      );
      const validityHints: string[] = [];

      if (!configuredSubjectName && extractedSubjectName) {
        metadataHints.push(
          `conviene registrar subjectName="${extractedSubjectName}"`,
        );
      } else if (
        configuredSubjectName &&
        normalizedExtractedSubjectName &&
        configuredSubjectName !== normalizedExtractedSubjectName
      ) {
        metadataHints.push(
          `el subjectName configurado no coincide exactamente con el certificado extraido (${extractedSubjectName})`,
        );
      }

      if (certificateValidity.status === 'expired') {
        validityHints.push(
          `el certificado ya vencio${certificateValidity.daysUntilExpiry !== null ? ` hace ${Math.abs(certificateValidity.daysUntilExpiry)} dias` : ''}`,
        );
      } else if (certificateValidity.status === 'expiring_soon') {
        validityHints.push(
          `el certificado vence pronto${certificateValidity.daysUntilExpiry !== null ? ` (${certificateValidity.daysUntilExpiry} dias)` : ''}`,
        );
      } else if (certificateValidity.status === 'not_yet_valid') {
        validityHints.push('el certificado todavia no entra en vigencia');
      } else if (certificateValidity.status === 'unknown') {
        validityHints.push(
          'no fue posible interpretar con certeza la vigencia del certificado',
        );
      }

      const detailSegments = [
        metadataHints.length > 0 ? metadataHints.join('; ') : null,
        validityHints.length > 0 ? validityHints.join('; ') : null,
      ].filter(Boolean);

      return {
        status: 'likely_usable',
        detail:
          detailSegments.length > 0
            ? `OpenSSL pudo abrir el PKCS#12 con el password resuelto y leer su certificado. ${detailSegments.join('; ')}.`
            : 'OpenSSL pudo abrir el PKCS#12 con el password resuelto y leer su certificado. El material interno ya parece realmente cargable.',
        encoding: 'base64_der',
        probeMethod: 'openssl_pkcs12',
        certificateValidityStatus: certificateValidity.status,
        cryptographicProofStatus: cryptographicProof.status,
        cryptographicProofDetail: cryptographicProof.detail,
        passwordPresent: true,
        hasAdvisoryWarning: detailSegments.length > 0,
        fingerprintPresent: Boolean(
          signatureSettings.certificateFingerprint ?? extractedFingerprint,
        ),
        subjectNamePresent: Boolean(
          signatureSettings.subjectName ?? extractedSubjectName,
        ),
        extractedFingerprint,
        extractedTaxId,
        extractedSubjectName,
        extractedIssuerName: opensslInspection.issuerName,
        validFrom: opensslInspection.validFrom,
        validUntil: opensslInspection.validUntil,
        daysUntilExpiry: certificateValidity.daysUntilExpiry,
        byteLength: decodedPkcs12.length,
      };
    } catch (error) {
      if (isOpenSslMissingError(error)) {
        return {
          status: 'likely_usable',
          detail:
            'El PKCS#12 ya parece base64/DER utilizable, pero OpenSSL no esta disponible en este runtime para confirmar la apertura real del keystore.',
          encoding: 'base64_der',
          probeMethod: 'shape_only',
          certificateValidityStatus: 'unknown',
          cryptographicProofStatus: 'unknown',
          cryptographicProofDetail:
            'OpenSSL no esta disponible en este runtime para ejecutar una prueba criptografica real con el PKCS#12.',
          passwordPresent: true,
          hasAdvisoryWarning: true,
          fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
          subjectNamePresent: Boolean(signatureSettings.subjectName),
          extractedFingerprint: null,
          extractedTaxId: null,
          extractedSubjectName: null,
          extractedIssuerName: null,
          validFrom: null,
          validUntil: null,
          daysUntilExpiry: null,
          byteLength: null,
        };
      }

      return {
        status: 'invalid',
        detail: formatInspectionError(error),
        encoding: 'base64_der',
        probeMethod: 'openssl_pkcs12',
        certificateValidityStatus: 'unknown',
        cryptographicProofStatus: 'failed',
        cryptographicProofDetail:
          'La prueba criptografica no pudo ejecutarse porque el PKCS#12 no termino de abrir correctamente.',
        passwordPresent: true,
        hasAdvisoryWarning: false,
        fingerprintPresent: Boolean(signatureSettings.certificateFingerprint),
        subjectNamePresent: Boolean(signatureSettings.subjectName),
        extractedFingerprint: null,
        extractedTaxId: null,
        extractedSubjectName: null,
        extractedIssuerName: null,
        validFrom: null,
        validUntil: null,
        daysUntilExpiry: null,
        byteLength: null,
      };
    }
  }
}

function extractLikelyTaxIdFromCertificate(input: {
  subjectName?: string | null;
  issuerName?: string | null;
}): string | null {
  const candidates = [input.subjectName, input.issuerName]
    .filter((value): value is string => Boolean(value))
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

function decodeBase64Pkcs12(value: string): Buffer | null {
  const normalized = value.replace(/\s+/g, '');

  if (
    normalized.length < 16 ||
    normalized.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/=]+$/.test(normalized)
  ) {
    return null;
  }

  try {
    const decoded = Buffer.from(normalized, 'base64');

    if (decoded.length === 0) {
      return null;
    }

    const canonicalInput = normalized.replace(/=+$/, '');
    const canonicalDecoded = decoded.toString('base64').replace(/=+$/, '');

    return canonicalInput === canonicalDecoded ? decoded : null;
  } catch {
    return null;
  }
}

async function inspectPkcs12WithOpenSsl(input: {
  pkcs12Bytes: Buffer;
  password: string;
}): Promise<{
  fingerprint: string | null;
  subjectName: string | null;
  issuerName: string | null;
  validFrom: string | null;
  validUntil: string | null;
  cryptographicProof: {
    status: 'verified' | 'failed';
    detail: string;
  };
}> {
  const tempDir = await mkdtemp(join(tmpdir(), 'pkcs12-inspect-'));
  const pkcs12Path = join(tempDir, 'certificate.p12');
  const certificatePemPath = join(tempDir, 'certificate.pem');
  const privateKeyPemPath = join(tempDir, 'private-key.pem');
  const publicKeyPemPath = join(tempDir, 'public-key.pem');
  const challengePath = join(tempDir, 'challenge.txt');
  const signaturePath = join(tempDir, 'challenge.sig');

  try {
    await writeFile(pkcs12Path, input.pkcs12Bytes);

    const exportResult = await runPkcs12CertificateExport({
      pkcs12Path,
      certificatePemPath,
      password: input.password,
    });

    if (exportResult.ok === false) {
      throw new Error(cleanOpenSslError(exportResult.error));
    }

    const certificateMetadata = await runOpenSsl([
      'x509',
      '-in',
      certificatePemPath,
      '-noout',
      '-subject',
      '-issuer',
      '-dates',
      '-fingerprint',
      '-sha1',
    ]);
    const metadataOutput = [
      certificateMetadata.stdout,
      certificateMetadata.stderr,
    ]
      .filter(Boolean)
      .join('\n');
    const cryptographicProof = await runCryptographicProof({
      pkcs12Path,
      privateKeyPemPath,
      certificatePemPath,
      publicKeyPemPath,
      challengePath,
      signaturePath,
      password: input.password,
    });

    return {
      fingerprint: parseOpenSslFingerprint(metadataOutput),
      subjectName: parseOpenSslSubject(metadataOutput),
      issuerName: parseOpenSslIssuer(metadataOutput),
      validFrom: parseOpenSslDate(metadataOutput, 'notbefore'),
      validUntil: parseOpenSslDate(metadataOutput, 'notafter'),
      cryptographicProof,
    };
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
}

async function runPkcs12CertificateExport(input: {
  pkcs12Path: string;
  certificatePemPath: string;
  password: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const baseArgs = [
    'pkcs12',
    '-in',
    input.pkcs12Path,
    '-passin',
    'env:PKCS12_PASSWORD',
    '-clcerts',
    '-nokeys',
    '-out',
    input.certificatePemPath,
  ];

  try {
    await runOpenSsl(baseArgs, input.password);
    return { ok: true };
  } catch (error) {
    if (isOpenSslMissingError(error)) {
      throw error;
    }

    try {
      await runOpenSsl(['pkcs12', '-legacy', ...baseArgs.slice(1)], input.password);
      return { ok: true };
    } catch (legacyError) {
      if (isOpenSslMissingError(legacyError)) {
        throw legacyError;
      }

      return {
        ok: false,
        error: formatInspectionError(legacyError, error),
      };
    }
  }
}

async function runCryptographicProof(input: {
  pkcs12Path: string;
  privateKeyPemPath: string;
  certificatePemPath: string;
  publicKeyPemPath: string;
  challengePath: string;
  signaturePath: string;
  password: string;
}): Promise<{
  status: 'verified' | 'failed';
  detail: string;
}> {
  const privateKeyExport = await runPkcs12PrivateKeyExport({
    pkcs12Path: input.pkcs12Path,
    privateKeyPemPath: input.privateKeyPemPath,
    password: input.password,
  });

  if (privateKeyExport.ok === false) {
    return {
      status: 'failed',
      detail: `OpenSSL pudo leer el certificado, pero no logro extraer una llave privada utilizable del PKCS#12. ${privateKeyExport.error}`,
    };
  }

  await writeFile(
    input.challengePath,
    'saas-platform-pkcs12-crypto-proof\n',
    'utf8',
  );

  try {
    await runOpenSsl([
      'x509',
      '-in',
      input.certificatePemPath,
      '-pubkey',
      '-noout',
      '-out',
      input.publicKeyPemPath,
    ]);

    await runOpenSsl([
      'dgst',
      '-sha256',
      '-sign',
      input.privateKeyPemPath,
      '-out',
      input.signaturePath,
      input.challengePath,
    ]);

    const verification = await runOpenSsl([
      'dgst',
      '-sha256',
      '-verify',
      input.publicKeyPemPath,
      '-signature',
      input.signaturePath,
      input.challengePath,
    ]);
    const verificationOutput = [
      verification.stdout,
      verification.stderr,
    ]
      .filter(Boolean)
      .join('\n')
      .trim();

    if (/verified ok/i.test(verificationOutput)) {
      return {
        status: 'verified',
        detail:
          'OpenSSL pudo extraer la llave privada, firmar un challenge SHA-256 y verificarlo con el certificado del PKCS#12.',
      };
    }

    return {
      status: 'failed',
      detail:
        verificationOutput.length > 0
          ? `La prueba criptografica no devolvio una verificacion valida. ${verificationOutput}`
          : 'La prueba criptografica no devolvio una verificacion valida.',
    };
  } catch (error) {
    return {
      status: 'failed',
      detail: formatInspectionError(error),
    };
  }
}

async function runPkcs12PrivateKeyExport(input: {
  pkcs12Path: string;
  privateKeyPemPath: string;
  password: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const baseArgs = [
    'pkcs12',
    '-in',
    input.pkcs12Path,
    '-passin',
    'env:PKCS12_PASSWORD',
    '-nocerts',
    '-nodes',
    '-out',
    input.privateKeyPemPath,
  ];

  try {
    await runOpenSsl(baseArgs, input.password);
    return { ok: true };
  } catch (error) {
    if (isOpenSslMissingError(error)) {
      throw error;
    }

    try {
      await runOpenSsl(
        ['pkcs12', '-legacy', ...baseArgs.slice(1)],
        input.password,
      );
      return { ok: true };
    } catch (legacyError) {
      if (isOpenSslMissingError(legacyError)) {
        throw legacyError;
      }

      return {
        ok: false,
        error: formatInspectionError(legacyError, error),
      };
    }
  }
}

async function runOpenSsl(
  args: string[],
  password?: string,
): Promise<{ stdout: string; stderr: string }> {
  const result = await execFileAsync('openssl', args, {
    env: password
      ? { ...process.env, PKCS12_PASSWORD: password }
      : process.env,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
  });

  return {
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

function parseOpenSslFingerprint(output: string): string | null {
  const line = output
    .split('\n')
    .find((item) => item.toLowerCase().includes('fingerprint='));

  if (!line) {
    return null;
  }

  const [, rawFingerprint] = line.split('=');

  return normalizeFingerprint(rawFingerprint ?? null);
}

function parseOpenSslSubject(output: string): string | null {
  const line = output
    .split('\n')
    .find((item) => item.toLowerCase().startsWith('subject='));

  if (!line) {
    return null;
  }

  return line.slice('subject='.length).trim() || null;
}

function parseOpenSslIssuer(output: string): string | null {
  const line = output
    .split('\n')
    .find((item) => item.toLowerCase().startsWith('issuer='));

  if (!line) {
    return null;
  }

  return line.slice('issuer='.length).trim() || null;
}

function parseOpenSslDate(
  output: string,
  key: 'notbefore' | 'notafter',
): string | null {
  const prefix = `${key}=`;
  const line = output
    .split('\n')
    .find((item) => item.toLowerCase().startsWith(prefix));

  if (!line) {
    return null;
  }

  const rawValue = line.slice(prefix.length).trim();
  const parsedDate = new Date(rawValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString();
}

function describeCertificateValidity(
  validFrom: string | null,
  validUntil: string | null,
): {
  status:
    | 'not_applicable'
    | 'unknown'
    | 'valid'
    | 'expiring_soon'
    | 'expired'
    | 'not_yet_valid';
  daysUntilExpiry: number | null;
} {
  if (!validFrom || !validUntil) {
    return {
      status: 'unknown',
      daysUntilExpiry: null,
    };
  }

  const validFromDate = new Date(validFrom);
  const validUntilDate = new Date(validUntil);

  if (
    Number.isNaN(validFromDate.getTime()) ||
    Number.isNaN(validUntilDate.getTime())
  ) {
    return {
      status: 'unknown',
      daysUntilExpiry: null,
    };
  }

  const now = new Date();

  if (validFromDate.getTime() > now.getTime()) {
    return {
      status: 'not_yet_valid',
      daysUntilExpiry: Math.ceil(
        (validUntilDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      ),
    };
  }

  const daysUntilExpiry = Math.ceil(
    (validUntilDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

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

function normalizeFingerprint(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const hex = value.replace(/[^a-fA-F0-9]/g, '').toUpperCase();

  if (hex.length === 0 || hex.length % 2 !== 0) {
    return null;
  }

  return hex.match(/.{1,2}/g)?.join(':') ?? null;
}

function normalizeSubjectName(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return value.replace(/\s+/g, ' ').trim().toLowerCase();
}

function isOpenSslMissingError(error: unknown): boolean {
  return (
    Boolean(error) &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code?: unknown }).code === 'ENOENT'
  );
}

function formatInspectionError(primary: unknown, secondary?: unknown): string {
  const primaryMessage = cleanOpenSslError(readErrorMessage(primary));
  const secondaryMessage = secondary
    ? cleanOpenSslError(readErrorMessage(secondary))
    : null;

  if (
    secondaryMessage &&
    secondaryMessage.length > 0 &&
    secondaryMessage !== primaryMessage
  ) {
    return `${primaryMessage} ${secondaryMessage}`.trim();
  }

  return primaryMessage;
}

function readErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'No se pudo inspeccionar el material PKCS#12 del signer interno.';
}

function cleanOpenSslError(message: string): string {
  return message
    .replace(/^Command failed: .*?\n?/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
