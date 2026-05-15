import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { InvoiceElectronicSigningOperationError } from '@saas-platform/invoicing-application';
import {
  ElectronicSignatureSettings,
  IssuerProfile,
} from '@saas-platform/invoicing-domain';
import { validateSriOfflineSignedXmlShape } from '@saas-platform/invoicing-application';
import { StubXadesPkcs12ElectronicInvoiceSigner } from './stub-xades-pkcs12-electronic-invoice-signer';
import { XmllintSriInvoiceXmlSchemaValidator } from './xmllint-sri-invoice-xml-schema-validator';

const execFileAsync = promisify(execFile);

describe('StubXadesPkcs12ElectronicInvoiceSigner', () => {
  it('should produce an internally verifiable XMLDSig/XAdES-like signature block from a real PKCS#12', async () => {
    const { pkcs12Base64, password } = await createPkcs12Fixture();
    const signer = new StubXadesPkcs12ElectronicInvoiceSigner({
      resolve: jest.fn(async (secretRef: string) => {
        if (secretRef === 'env:EC_PKCS12') {
          return pkcs12Base64;
        }

        if (secretRef === 'env:EC_PKCS12_PASSWORD') {
          return password;
        }

        throw new Error(`Unexpected secret ref ${secretRef}`);
      }),
    });

    const result = await signer.sign({
      tenantSlug: 'saas-platform',
      invoiceId: 'invoice_001',
      accessKey: '1234567890123456789012345678901234567890123456789',
      xml: [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<factura id="comprobante" version="2.1.0">',
        '<infoTributaria><claveAcceso>1234567890123456789012345678901234567890123456789</claveAcceso></infoTributaria>',
        '</factura>',
      ].join(''),
      issuerProfile: buildIssuerProfile(),
      signatureSettings: buildSignatureSettings(),
    });

    expect(result.capability.signatureMode).toBe('xades_pkcs12_real');
    expect(result.capability.supportsSriOfflineSubmission).toBe(true);
    expect(result.signerName).toContain('xades_pkcs12:');
    expect(result.signedXml).toContain('<ds:Signature ');
    expect(result.signedXml).toContain('<ds:SignatureValue Id="');
    expect(result.signedXml).toContain('<ds:KeyInfo Id="');
    expect(result.signedXml).toContain('http://www.w3.org/2000/09/xmldsig#rsa-sha1');
    expect(result.signedXml).toContain('URI="#comprobante"');
    expect(result.signedXml).toContain('http://uri.etsi.org/01903#SignedProperties');
    expect(result.signedXml).toContain('<etsi:SignaturePolicyImplied />');
    expect(result.signedXml).toContain('<ds:X509Certificate>');
    expect(validateSriOfflineSignedXmlShape(result.signedXml)).toEqual([]);
  });

  it('should reject a PKCS#12 secret that is not valid base64', async () => {
    const signer = new StubXadesPkcs12ElectronicInvoiceSigner({
      resolve: jest.fn(async (secretRef: string) => {
        if (secretRef === 'env:EC_PKCS12') {
          return 'not-valid-base64';
        }

        return 'secret123';
      }),
    });

    await expect(
      signer.sign({
        tenantSlug: 'saas-platform',
        invoiceId: 'invoice_001',
        accessKey: '1234567890123456789012345678901234567890123456789',
        xml: '<factura id="comprobante" version="2.1.0"></factura>',
        issuerProfile: buildIssuerProfile(),
        signatureSettings: buildSignatureSettings(),
      }),
    ).rejects.toThrow(InvoiceElectronicSigningOperationError);

    await expect(
      signer.sign({
        tenantSlug: 'saas-platform',
        invoiceId: 'invoice_001',
        accessKey: '1234567890123456789012345678901234567890123456789',
        xml: '<factura id="comprobante" version="2.1.0"></factura>',
        issuerProfile: buildIssuerProfile(),
        signatureSettings: buildSignatureSettings(),
      }),
    ).rejects.toThrow(
      'El PKCS#12 resuelto no decodifica como base64 valido.',
    );
  });

  it.each([
    [
      '04',
      'vendor/sri/nota-credito-1.0.0/XML y XSD Nota de Credito/notaCredito_V1.0.0.xml',
      'notaCredito',
    ],
    [
      '05',
      'vendor/sri/nota-debito-1.0.0/XML y XSD Nota de Debito/notaDebito_V1.0.0.xml',
      'notaDebito',
    ],
    [
      '06',
      'vendor/sri/guia-remision-1.0.0/XML y XSD Guia de Remision/guiaRemision_V1.0.0.xml',
      'guiaRemision',
    ],
    [
      '07',
      'vendor/sri/comprobante-retencion-2.0.0/XML y XSD Comprobante de Retencion/comprobanteRetencion_V2.0.0.xml',
      'comprobanteRetencion',
    ],
  ])(
    'should keep signed XML schema-valid for document code %s',
    async (documentCode: string, xmlPath: string, rootTag: string) => {
      const { pkcs12Base64, password } = await createPkcs12Fixture();
      const signer = new StubXadesPkcs12ElectronicInvoiceSigner({
        resolve: jest.fn(async (secretRef: string) => {
          if (secretRef === 'env:EC_PKCS12') {
            return pkcs12Base64;
          }

          if (secretRef === 'env:EC_PKCS12_PASSWORD') {
            return password;
          }

          throw new Error(`Unexpected secret ref ${secretRef}`);
        }),
      });
      const validator = new XmllintSriInvoiceXmlSchemaValidator();
      const xml = await readFile(join(process.cwd(), xmlPath), 'utf8');

      const result = await signer.sign({
        tenantSlug: 'saas-platform',
        invoiceId: `${documentCode}-sample`,
        accessKey: '1234567890123456789012345678901234567890123456789',
        xml,
        issuerProfile: buildIssuerProfile(),
        signatureSettings: buildSignatureSettings(),
      });

      const issues = await validator.validate({
        documentCode,
        xml: result.signedXml,
      });

      expect(issues).toEqual([]);
      expect(result.signedXml).toContain('<ds:Signature ');
      expect(result.signedXml).toContain(`</${rootTag}>`);
    },
  );

  it('should still sign the official factura sample even if the vendor XML is not a clean schema fixture', async () => {
    const { pkcs12Base64, password } = await createPkcs12Fixture();
    const signer = new StubXadesPkcs12ElectronicInvoiceSigner({
      resolve: jest.fn(async (secretRef: string) => {
        if (secretRef === 'env:EC_PKCS12') {
          return pkcs12Base64;
        }

        if (secretRef === 'env:EC_PKCS12_PASSWORD') {
          return password;
        }

        throw new Error(`Unexpected secret ref ${secretRef}`);
      }),
    });
    const xml = await readFile(
      join(
        process.cwd(),
        'vendor/sri/factura-2.1.0/XML y XSD Factura/factura_V2.1.0.xml',
      ),
      'utf8',
    );

    const result = await signer.sign({
      tenantSlug: 'saas-platform',
      invoiceId: '01-sample',
      accessKey: '1234567890123456789012345678901234567890123456789',
      xml,
      issuerProfile: buildIssuerProfile(),
      signatureSettings: buildSignatureSettings(),
    });

    expect(result.signedXml).toContain('<ds:Signature ');
    expect(result.signedXml).toContain('</factura>');
    expect(result.signedXml).toContain('URI="#comprobante"');
  });

  it('should detect a broken signed xml shape before claiming offline compatibility', () => {
    const issues = validateSriOfflineSignedXmlShape(
      [
        '<factura id="comprobante" version="2.1.0">',
        '<ds:Signature Id="Signature-1" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#">',
        '<ds:SignedInfo>',
        '<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" />',
        '<ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1" />',
        '<ds:Reference Id="ref-sp" Type="http://uri.etsi.org/01903#SignedProperties" URI="#SignedProperties-1"><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" /><ds:DigestValue>abc</ds:DigestValue></ds:Reference>',
        '<ds:Reference Id="ref-key" URI="#KeyInfo-1"><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" /><ds:DigestValue>abc</ds:DigestValue></ds:Reference>',
        '<ds:Reference Id="ref-doc" URI=""><ds:Transforms><ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /></ds:Transforms><ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" /><ds:DigestValue>abc</ds:DigestValue></ds:Reference>',
        '</ds:SignedInfo>',
        '<ds:SignatureValue Id="sig-value">abc</ds:SignatureValue>',
        '<ds:KeyInfo Id="KeyInfo-1"><ds:X509Data><ds:X509SubjectName>CN=test</ds:X509SubjectName><ds:X509IssuerSerial><ds:X509IssuerName>CN=test</ds:X509IssuerName><ds:X509SerialNumber>ABC</ds:X509SerialNumber></ds:X509IssuerSerial><ds:X509Certificate>abc</ds:X509Certificate></ds:X509Data></ds:KeyInfo>',
        '<ds:Object Id="obj-1"><etsi:QualifyingProperties Id="qp-1" Target="#Signature-1"><etsi:SignedProperties Id="SignedProperties-1"><etsi:SignedSignatureProperties><etsi:SigningTime>2026-05-14T00:00:00.000Z</etsi:SigningTime><etsi:SigningCertificate /></etsi:SignedSignatureProperties><etsi:SignedDataObjectProperties><etsi:DataObjectFormat ObjectReference="#ref-doc" /></etsi:SignedDataObjectProperties></etsi:SignedProperties></etsi:QualifyingProperties></ds:Object>',
        '</ds:Signature>',
        '</factura>',
      ].join(''),
    );

    expect(issues).toContain(
      'La tercera referencia de SignedInfo debe apuntar al comprobante con URI="#comprobante".',
    );
    expect(issues).toContain(
      'X509SerialNumber debe serializarse como entero decimal.',
    );
    expect(issues).toContain(
      'SignedProperties debe incluir SignaturePolicyImplied en este carril offline.',
    );
  });
});

function buildSignatureSettings(): ElectronicSignatureSettings {
  return ElectronicSignatureSettings.create({
    id: 'signature_settings_001',
    tenantId: 'tenant_123',
    provider: 'xades_pkcs12',
    certificateLabel: 'Firma Legal PKCS12',
    storageMode: 'secret_ref',
    certificateFingerprint: null,
    pkcs12SecretRef: 'env:EC_PKCS12',
    privateKeyPasswordSecretRef: 'env:EC_PKCS12_PASSWORD',
    subjectName: 'CN=Firma Pruebas,O=SaaS Platform,C=EC',
    isActive: true,
    createdAt: new Date('2026-05-01T16:50:00.000Z'),
    updatedAt: new Date('2026-05-01T16:50:00.000Z'),
  });
}

function buildIssuerProfile(): IssuerProfile {
  return IssuerProfile.create({
    id: 'issuer_profile_001',
    tenantId: 'tenant_123',
    legalName: 'SaaS Platform S.A.',
    commercialName: 'SaaS Platform',
    taxId: '1790012345001',
    environment: 'test',
    emissionType: 'normal',
    accountingObligated: true,
    specialTaxpayerCode: null,
    rimpeTaxpayerType: null,
    matrixAddress: 'Av. Principal y Calle Secundaria',
    establishmentAddress: 'Sucursal Matriz',
    createdAt: new Date('2026-05-01T16:00:00.000Z'),
    updatedAt: new Date('2026-05-01T16:00:00.000Z'),
  });
}

async function createPkcs12Fixture(): Promise<{
  pkcs12Base64: string;
  password: string;
}> {
  const tempDir = await mkdtemp(join(tmpdir(), 'pkcs12-signer-spec-'));
  const privateKeyPath = join(tempDir, 'private-key.pem');
  const certificatePath = join(tempDir, 'certificate.pem');
  const pkcs12Path = join(tempDir, 'certificate.p12');
  const password = 'secret123';

  try {
    await execFileAsync('openssl', [
      'req',
      '-x509',
      '-newkey',
      'rsa:2048',
      '-keyout',
      privateKeyPath,
      '-out',
      certificatePath,
      '-days',
      '365',
      '-nodes',
      '-set_serial',
      '123456789',
      '-subj',
      '/CN=Firma Pruebas/O=SaaS Platform/C=EC',
    ]);
    await execFileAsync('openssl', [
      'pkcs12',
      '-export',
      '-out',
      pkcs12Path,
      '-inkey',
      privateKeyPath,
      '-in',
      certificatePath,
      '-passout',
      `pass:${password}`,
      '-name',
      'Firma Pruebas',
    ]);

    const pkcs12 = await readFile(pkcs12Path);

    return {
      pkcs12Base64: pkcs12.toString('base64'),
      password,
    };
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
}
