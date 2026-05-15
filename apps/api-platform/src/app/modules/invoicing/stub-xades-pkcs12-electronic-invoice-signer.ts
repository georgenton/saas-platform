import { Inject, Injectable } from '@nestjs/common';
import { execFile } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import {
  DescribeElectronicInvoiceSignerCapabilityInput,
  ElectronicInvoiceSigner,
  ElectronicInvoiceSignerCapability,
  InvoiceElectronicSigningOperationError,
  SECRET_REFERENCE_RESOLVER,
  SecretReferenceResolver,
  SignElectronicInvoiceInput,
  SignedElectronicInvoice,
} from '@saas-platform/invoicing-application';
import { insertElectronicSignature } from './insert-electronic-signature';

const execFileAsync = promisify(execFile);

@Injectable()
export class StubXadesPkcs12ElectronicInvoiceSigner
  implements ElectronicInvoiceSigner
{
  constructor(
    @Inject(SECRET_REFERENCE_RESOLVER)
    private readonly secretReferenceResolver: SecretReferenceResolver,
  ) {}

  describeCapability(
    _input: DescribeElectronicInvoiceSignerCapabilityInput,
  ): ElectronicInvoiceSignerCapability {
    return {
      signatureMode: 'xades_pkcs12_real',
      supportsSriOfflineSubmission: true,
      detail:
        'El provider xades_pkcs12 ya puede producir una firma interna con PKCS#12 que supera la compatibilidad offline local del repo. El siguiente paso es probarlo de forma controlada contra SRI sandbox.',
    };
  }

  async sign(
    input: SignElectronicInvoiceInput,
  ): Promise<SignedElectronicInvoice> {
    const signedAt = new Date();
    const subjectName =
      input.signatureSettings.subjectName ??
      input.signatureSettings.certificateLabel;
    const resolvedPkcs12 = input.signatureSettings.pkcs12SecretRef
      ? await this.secretReferenceResolver.resolve(
          input.signatureSettings.pkcs12SecretRef,
        )
      : null;
    const resolvedPassword = input.signatureSettings.privateKeyPasswordSecretRef
      ? await this.secretReferenceResolver.resolve(
          input.signatureSettings.privateKeyPasswordSecretRef,
        )
      : null;

    if (!resolvedPkcs12?.trim() || !resolvedPassword?.trim()) {
      throw new InvoiceElectronicSigningOperationError(
        'El PKCS#12 o su password siguen incompletos para el signer interno.',
      );
    }

    const normalizedPkcs12 = resolvedPkcs12.trim();
    const decodedPkcs12 = decodeBase64Pkcs12(normalizedPkcs12);

    if (!decodedPkcs12) {
      throw new InvoiceElectronicSigningOperationError(
        'El PKCS#12 resuelto no decodifica como base64 valido.',
      );
    }

    const cryptographicSignature = await createInitialCryptographicSignature({
      xml: input.xml,
      pkcs12Bytes: decodedPkcs12,
      password: resolvedPassword,
      signedAt,
      subjectName,
      certificateFingerprint:
        input.signatureSettings.certificateFingerprint ?? null,
    });

    return {
      signedXml: insertElectronicSignature(
        input.xml,
        cryptographicSignature.signatureBlock,
      ),
      signedAt,
      signerName: `xades_pkcs12:${subjectName}`,
      capability: this.describeCapability({
        signatureSettings: input.signatureSettings,
      }),
    };
  }
}

async function createInitialCryptographicSignature(input: {
  xml: string;
  pkcs12Bytes: Buffer;
  password: string;
  signedAt: Date;
  subjectName: string;
  certificateFingerprint: string | null;
}): Promise<{
  signatureBlock: string;
}> {
  const tempDir = await mkdtemp(join(tmpdir(), 'pkcs12-sign-'));
  const pkcs12Path = join(tempDir, 'certificate.p12');
  const certificatePemPath = join(tempDir, 'certificate.pem');
  const privateKeyPemPath = join(tempDir, 'private-key.pem');
  const publicKeyPemPath = join(tempDir, 'public-key.pem');
  const certificateDerPath = join(tempDir, 'certificate.der');
  const originalXmlPath = join(tempDir, 'document.xml');
  const keyInfoPath = join(tempDir, 'key-info.xml');
  const signedPropertiesPath = join(tempDir, 'signed-properties.xml');
  const signedInfoPath = join(tempDir, 'signed-info.xml');
  const canonicalSignedInfoPath = join(tempDir, 'signed-info.c14n.xml');
  const signaturePath = join(tempDir, 'signature.bin');

  try {
    await writeFile(pkcs12Path, input.pkcs12Bytes);

    const certificateExport = await runPkcs12CertificateExport({
      pkcs12Path,
      certificatePemPath,
      password: input.password,
    });

    if (certificateExport.ok === false) {
      throw new InvoiceElectronicSigningOperationError(certificateExport.error);
    }

    const privateKeyExport = await runPkcs12PrivateKeyExport({
      pkcs12Path,
      privateKeyPemPath,
      password: input.password,
    });

    if (privateKeyExport.ok === false) {
      throw new InvoiceElectronicSigningOperationError(privateKeyExport.error);
    }

    const certificateMetadata = await extractCertificateMetadata({
      certificatePemPath,
      certificateDerPath,
    });
    const signatureId = `Signature-${randomUUID()}`;
    const signatureValueId = `${signatureId}-SignatureValue`;
    const keyInfoId = `Certificate-${randomUUID()}`;
    const objectId = `${signatureId}-Object`;
    const documentReferenceId = `Reference-ID-${randomUUID()}`;
    const signedPropertiesReferenceId = `SignedPropertiesID-${randomUUID()}`;
    const keyInfoReferenceId = `KeyInfoReference-${randomUUID()}`;
    const signedPropertiesId = `${signatureId}-SignedProperties`;
    const qualifyingPropertiesId = `${signatureId}-QualifyingProperties`;

    await writeFile(originalXmlPath, input.xml, 'utf8');
    const canonicalDocument = await canonicalizeXmlFile(originalXmlPath);
    const documentDigestValue = createSha1Base64(canonicalDocument);
    const keyInfoXml = buildKeyInfoXml({
      keyInfoId,
      subjectName: input.subjectName,
      certificatePem: await readFile(certificatePemPath, 'utf8'),
      certificateIssuerName: certificateMetadata.issuerName,
      certificateSerialNumber: certificateMetadata.serialNumber,
    });
    await writeFile(keyInfoPath, keyInfoXml, 'utf8');
    const canonicalKeyInfo = await canonicalizeXmlFile(keyInfoPath);
    const keyInfoDigestValue = createSha1Base64(canonicalKeyInfo);
    const signedProperties = buildSignedPropertiesXml({
      signatureId,
      signedPropertiesId,
      documentReferenceId,
      signedAt: input.signedAt,
      certificateDigestValue: certificateMetadata.certificateDigestValue,
      certificateIssuerName: certificateMetadata.issuerName,
      certificateSerialNumber: certificateMetadata.serialNumber,
    });
    await writeFile(signedPropertiesPath, signedProperties, 'utf8');
    const canonicalSignedProperties =
      await canonicalizeXmlFile(signedPropertiesPath);
    const signedPropertiesDigestValue = createSha1Base64(
      canonicalSignedProperties,
    );
    const signedInfo = buildSignedInfoXml({
      signedPropertiesDigestValue,
      keyInfoDigestValue,
      documentDigestValue,
      keyInfoReferenceId,
      documentReferenceId,
      signedPropertiesReferenceId,
      keyInfoId,
      signedPropertiesId,
    });
    await writeFile(signedInfoPath, signedInfo, 'utf8');
    const canonicalSignedInfo = await canonicalizeXmlFile(signedInfoPath);
    await writeFile(canonicalSignedInfoPath, canonicalSignedInfo);
    await runOpenSsl([
      'dgst',
      '-sha1',
      '-sign',
      privateKeyPemPath,
      '-out',
      signaturePath,
      canonicalSignedInfoPath,
    ]);
    await verifyGeneratedSignature({
      certificatePemPath,
      publicKeyPemPath,
      canonicalSignedInfoPath,
      signaturePath,
    });

    const signatureValue = (await readFile(signaturePath)).toString('base64');

    const signatureBlock = [
      `<ds:Signature Id="${escapeXml(signatureId)}" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#">`,
      signedInfo,
      `<ds:SignatureValue Id="${escapeXml(signatureValueId)}">${signatureValue}</ds:SignatureValue>`,
      keyInfoXml,
      `<ds:Object Id="${escapeXml(objectId)}">`,
      `<etsi:QualifyingProperties Id="${escapeXml(qualifyingPropertiesId)}" Target="#${escapeXml(signatureId)}">`,
      signedProperties,
      '</etsi:QualifyingProperties>',
      '</ds:Object>',
      '</ds:Signature>',
    ]
      .filter(Boolean)
      .join('');
    const signedXml = insertElectronicSignature(input.xml, signatureBlock);
    const assembledValidation = await verifyAssembledSignedXml({
      tempDir,
      signedXml,
      certificatePemPath,
    });

    if (assembledValidation.ok === false) {
      throw new InvoiceElectronicSigningOperationError(
        assembledValidation.detail,
      );
    }

    return {
      signatureBlock,
    };
  } catch (error) {
    if (error instanceof InvoiceElectronicSigningOperationError) {
      throw error;
    }

    throw new InvoiceElectronicSigningOperationError(
      formatOpenSslError(error),
    );
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
}

async function verifyAssembledSignedXml(input: {
  tempDir: string;
  signedXml: string;
  certificatePemPath: string;
}): Promise<{ ok: true } | { ok: false; detail: string }> {
  const signedXmlPath = join(input.tempDir, 'signed-document.xml');
  const keyInfoPath = join(input.tempDir, 'verify-key-info.xml');
  const signedInfoPath = join(input.tempDir, 'verify-signed-info.xml');
  const canonicalSignedInfoPath = join(
    input.tempDir,
    'verify-signed-info.c14n.xml',
  );
  const signedPropertiesPath = join(
    input.tempDir,
    'verify-signed-properties.xml',
  );
  const unsignedDocumentPath = join(input.tempDir, 'unsigned-document.xml');
  const publicKeyPemPath = join(input.tempDir, 'verify-public-key.pem');
  const signaturePath = join(input.tempDir, 'verify-signature.bin');

  await writeFile(signedXmlPath, input.signedXml, 'utf8');

  const signedInfoMatch = input.signedXml.match(
    /<ds:SignedInfo\b[\s\S]*?<\/ds:SignedInfo>/,
  );
  const signatureValueMatch = input.signedXml.match(
    /<ds:SignatureValue\b[^>]*>([\s\S]*?)<\/ds:SignatureValue>/,
  );
  const signedPropertiesMatch = input.signedXml.match(
    /<etsi:SignedProperties\b[\s\S]*?<\/etsi:SignedProperties>/,
  );
  const keyInfoMatch = input.signedXml.match(/<ds:KeyInfo\b[\s\S]*?<\/ds:KeyInfo>/);
  const digestMatches = Array.from(
    input.signedXml.matchAll(/<ds:DigestValue>([\s\S]*?)<\/ds:DigestValue>/g),
  ).map((match) => match[1]?.trim() ?? '');

  if (
    !signedInfoMatch?.[0] ||
    !signatureValueMatch?.[1] ||
    !signedPropertiesMatch?.[0] ||
    !keyInfoMatch?.[0] ||
    digestMatches.length < 4
  ) {
    return {
      ok: false,
      detail:
        'No fue posible reconstruir los fragmentos XMLDSig necesarios para validar el XML firmado ensamblado.',
    };
  }

  await writeFile(signedInfoPath, signedInfoMatch[0], 'utf8');
  const canonicalSignedInfo = await canonicalizeXmlFile(signedInfoPath);
  await writeFile(canonicalSignedInfoPath, canonicalSignedInfo, 'utf8');
  await writeFile(signedPropertiesPath, signedPropertiesMatch[0], 'utf8');
  const canonicalSignedProperties =
    await canonicalizeXmlFile(signedPropertiesPath);
  const signedPropertiesDigestValue = createSha1Base64(
    canonicalSignedProperties,
  );
  const expectedSignedPropertiesDigestValue = digestMatches[0];

  if (signedPropertiesDigestValue !== expectedSignedPropertiesDigestValue) {
    return {
      ok: false,
      detail:
        'El digest de SignedProperties ya no coincide una vez ensamblado el XML firmado.',
    };
  }

  await writeFile(keyInfoPath, keyInfoMatch[0], 'utf8');
  const canonicalKeyInfo = await canonicalizeXmlFile(keyInfoPath);
  const keyInfoDigestValue = createSha1Base64(canonicalKeyInfo);
  const expectedKeyInfoDigestValue = digestMatches[1];

  if (keyInfoDigestValue !== expectedKeyInfoDigestValue) {
    return {
      ok: false,
      detail:
        'El digest de KeyInfo ya no coincide una vez ensamblado el XML firmado.',
    };
  }

  const unsignedXml = removeSignatureBlock(input.signedXml);

  if (!unsignedXml) {
    return {
      ok: false,
      detail:
        'No fue posible remover el bloque ds:Signature del XML firmado para recomputar el digest del documento.',
    };
  }

  await writeFile(unsignedDocumentPath, unsignedXml, 'utf8');
  const canonicalUnsignedDocument =
    await canonicalizeXmlFile(unsignedDocumentPath);
  const unsignedDocumentDigestValue = createSha1Base64(
    canonicalUnsignedDocument,
  );
  const expectedDocumentDigestValue = digestMatches[2];

  if (unsignedDocumentDigestValue !== expectedDocumentDigestValue) {
    return {
      ok: false,
      detail:
        'El digest del documento ya no coincide una vez ensamblado el XML firmado.',
    };
  }

  await writeFile(
    signaturePath,
    Buffer.from(signatureValueMatch[1].replace(/\s+/g, ''), 'base64'),
  );
  await runOpenSsl([
    'x509',
    '-in',
    input.certificatePemPath,
    '-pubkey',
    '-noout',
    '-out',
    publicKeyPemPath,
  ]);
  const verification = await runOpenSsl([
    'dgst',
    '-sha1',
    '-verify',
    publicKeyPemPath,
    '-signature',
    signaturePath,
    canonicalSignedInfoPath,
  ]);
  const verificationOutput = [verification.stdout, verification.stderr]
    .filter(Boolean)
    .join('\n')
    .trim();

  if (!/verified ok/i.test(verificationOutput)) {
    return {
      ok: false,
      detail:
        verificationOutput.length > 0
          ? `La firma ensamblada no logro verificarse contra el SignedInfo final. ${verificationOutput}`
          : 'La firma ensamblada no logro verificarse contra el SignedInfo final.',
    };
  }

  return { ok: true };
}

function buildSignedInfoXml(input: {
  signedPropertiesDigestValue: string;
  keyInfoDigestValue: string;
  documentDigestValue: string;
  keyInfoReferenceId: string;
  documentReferenceId: string;
  signedPropertiesReferenceId: string;
  keyInfoId: string;
  signedPropertiesId: string;
}): string {
  return [
    '<ds:SignedInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">',
    '<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" />',
    '<ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1" />',
    `<ds:Reference Id="${escapeXml(input.signedPropertiesReferenceId)}" Type="http://uri.etsi.org/01903#SignedProperties" URI="#${escapeXml(input.signedPropertiesId)}">`,
    '<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" />',
    `<ds:DigestValue>${input.signedPropertiesDigestValue}</ds:DigestValue>`,
    '</ds:Reference>',
    `<ds:Reference Id="${escapeXml(input.keyInfoReferenceId)}" URI="#${escapeXml(input.keyInfoId)}">`,
    '<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" />',
    `<ds:DigestValue>${input.keyInfoDigestValue}</ds:DigestValue>`,
    '</ds:Reference>',
    `<ds:Reference Id="${escapeXml(input.documentReferenceId)}" URI="#comprobante">`,
    '<ds:Transforms>',
    '<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" />',
    '</ds:Transforms>',
    '<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" />',
    `<ds:DigestValue>${input.documentDigestValue}</ds:DigestValue>`,
    '</ds:Reference>',
    '</ds:SignedInfo>',
  ].join('');
}

function buildKeyInfoXml(input: {
  keyInfoId: string;
  subjectName: string;
  certificatePem: string;
  certificateIssuerName: string;
  certificateSerialNumber: string;
}): string {
  const x509Certificate = certificatePemToBase64(input.certificatePem);

  return [
    `<ds:KeyInfo Id="${escapeXml(input.keyInfoId)}">`,
    '<ds:X509Data>',
    `<ds:X509SubjectName>${escapeXml(input.subjectName)}</ds:X509SubjectName>`,
    `<ds:X509IssuerSerial><ds:X509IssuerName>${escapeXml(input.certificateIssuerName)}</ds:X509IssuerName><ds:X509SerialNumber>${escapeXml(input.certificateSerialNumber)}</ds:X509SerialNumber></ds:X509IssuerSerial>`,
    x509Certificate
      ? `<ds:X509Certificate>${x509Certificate}</ds:X509Certificate>`
      : '',
    '</ds:X509Data>',
    '</ds:KeyInfo>',
  ]
    .filter(Boolean)
    .join('');
}

function buildSignedPropertiesXml(input: {
  signatureId: string;
  signedPropertiesId: string;
  documentReferenceId: string;
  signedAt: Date;
  certificateDigestValue: string;
  certificateIssuerName: string;
  certificateSerialNumber: string;
}): string {
  return [
    `<etsi:SignedProperties Id="${escapeXml(input.signedPropertiesId)}" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#" xmlns:ds="http://www.w3.org/2000/09/xmldsig#">`,
    '<etsi:SignedSignatureProperties>',
    `<etsi:SigningTime>${input.signedAt.toISOString()}</etsi:SigningTime>`,
    '<etsi:SigningCertificate>',
    '<etsi:Cert>',
    '<etsi:CertDigest>',
    '<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" />',
    `<ds:DigestValue>${input.certificateDigestValue}</ds:DigestValue>`,
    '</etsi:CertDigest>',
    '<etsi:IssuerSerial>',
    `<ds:X509IssuerName>${escapeXml(input.certificateIssuerName)}</ds:X509IssuerName>`,
    `<ds:X509SerialNumber>${escapeXml(input.certificateSerialNumber)}</ds:X509SerialNumber>`,
    '</etsi:IssuerSerial>',
    '</etsi:Cert>',
    '</etsi:SigningCertificate>',
    '<etsi:SignaturePolicyIdentifier>',
    '<etsi:SignaturePolicyImplied />',
    '</etsi:SignaturePolicyIdentifier>',
    '</etsi:SignedSignatureProperties>',
    '<etsi:SignedDataObjectProperties>',
    `<etsi:DataObjectFormat ObjectReference="#${escapeXml(input.documentReferenceId)}">`,
    '<etsi:Description>contenido comprobante</etsi:Description>',
    '<etsi:MimeType>text/xml</etsi:MimeType>',
    '</etsi:DataObjectFormat>',
    '</etsi:SignedDataObjectProperties>',
    '</etsi:SignedProperties>',
  ]
    .filter(Boolean)
    .join('');
}

function createSha256Base64(value: string | Buffer): string {
  return createHash('sha256').update(value).digest('base64');
}

function createSha1Base64(value: string | Buffer): string {
  return createHash('sha1').update(value).digest('base64');
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

  return runPkcs12Export(baseArgs, input.password);
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

  return runPkcs12Export(baseArgs, input.password);
}

async function runPkcs12Export(
  baseArgs: string[],
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await runOpenSsl(baseArgs, password);
    return { ok: true };
  } catch (error) {
    if (isOpenSslMissingError(error)) {
      throw error;
    }

    try {
      await runOpenSsl(['pkcs12', '-legacy', ...baseArgs.slice(1)], password);
      return { ok: true };
    } catch (legacyError) {
      if (isOpenSslMissingError(legacyError)) {
        throw legacyError;
      }

      return {
        ok: false,
        error: formatOpenSslError(legacyError, error),
      };
    }
  }
}

async function extractCertificateMetadata(input: {
  certificatePemPath: string;
  certificateDerPath: string;
}): Promise<{
  issuerName: string;
  serialNumber: string;
  fingerprint: string | null;
  certificateDigestValue: string;
}> {
  const metadata = await runOpenSsl([
    'x509',
    '-in',
    input.certificatePemPath,
    '-noout',
    '-issuer',
    '-serial',
    '-fingerprint',
    '-sha256',
  ]);
  const metadataOutput = [metadata.stdout, metadata.stderr]
    .filter(Boolean)
    .join('\n');
  await runOpenSsl([
    'x509',
    '-in',
    input.certificatePemPath,
    '-outform',
    'der',
    '-out',
    input.certificateDerPath,
  ]);
  const certificateDer = await readFile(input.certificateDerPath);

  return {
    issuerName: parseOpenSslIssuer(metadataOutput) ?? 'issuer-not-available',
    serialNumber: parseOpenSslSerial(metadataOutput) ?? 'serial-not-available',
    fingerprint: parseOpenSslFingerprint(metadataOutput),
    certificateDigestValue: createSha1Base64(certificateDer),
  };
}

async function verifyGeneratedSignature(input: {
  certificatePemPath: string;
  publicKeyPemPath: string;
  canonicalSignedInfoPath: string;
  signaturePath: string;
}): Promise<void> {
  await runOpenSsl([
    'x509',
    '-in',
    input.certificatePemPath,
    '-pubkey',
    '-noout',
    '-out',
    input.publicKeyPemPath,
  ]);
  const verification = await runOpenSsl([
    'dgst',
    '-sha1',
    '-verify',
    input.publicKeyPemPath,
    '-signature',
    input.signaturePath,
    input.canonicalSignedInfoPath,
  ]);
  const verificationOutput = [verification.stdout, verification.stderr]
    .filter(Boolean)
    .join('\n')
    .trim();

  if (!/verified ok/i.test(verificationOutput)) {
    throw new InvoiceElectronicSigningOperationError(
      verificationOutput.length > 0
        ? `La firma generada no logro verificarse internamente. ${verificationOutput}`
        : 'La firma generada no logro verificarse internamente.',
    );
  }
}

async function canonicalizeXmlFile(filePath: string): Promise<string> {
  const canonical = await execFileAsync('xmllint', ['--c14n', filePath], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
  });

  return canonical.stdout ?? '';
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

function certificatePemToBase64(pem: string): string | null {
  const match = pem.match(
    /-----BEGIN CERTIFICATE-----([\s\S]+?)-----END CERTIFICATE-----/i,
  );

  if (!match) {
    return null;
  }

  return match[1]?.replace(/\s+/g, '') ?? null;
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

function parseOpenSslIssuer(output: string): string | null {
  const line = output
    .split('\n')
    .find((item) => item.toLowerCase().startsWith('issuer='));

  if (!line) {
    return null;
  }

  return line.slice('issuer='.length).trim() || null;
}

function parseOpenSslSerial(output: string): string | null {
  const line = output
    .split('\n')
    .find((item) => item.toLowerCase().startsWith('serial='));

  if (!line) {
    return null;
  }

  const rawSerial = line.slice('serial='.length).trim();

  if (rawSerial.length === 0) {
    return null;
  }

  try {
    return BigInt(`0x${rawSerial}`).toString(10);
  } catch {
    return rawSerial;
  }
}

function removeSignatureBlock(xml: string): string | null {
  const signedXml = xml.replace(
    /<ds:Signature\b[\s\S]*?<\/ds:Signature>/i,
    '',
  );

  return signedXml === xml ? null : signedXml;
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

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isOpenSslMissingError(error: unknown): boolean {
  return (
    Boolean(error) &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code?: unknown }).code === 'ENOENT'
  );
}

function formatOpenSslError(primary: unknown, secondary?: unknown): string {
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

  return 'Fallo una operacion OpenSSL durante la firma interna.';
}

function cleanOpenSslError(message: string): string {
  return message
    .replace(/^Command failed: .*?\n?/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
