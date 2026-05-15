import {
  GetTenantElectronicSandboxReadinessUseCase,
} from '@saas-platform/invoicing-application';
import {
  ElectronicSubmissionSettings,
  ElectronicSignatureSettings,
  InvoiceNumberingSettings,
  IssuerProfile,
} from '@saas-platform/invoicing-domain';

describe('GetTenantElectronicSandboxReadinessUseCase', () => {
  it('should block remote sandbox readiness for the known local demo RUC in CELCER', async () => {
    const tenantRepository = {
      findBySlug: jest.fn().mockResolvedValue({
        id: 'tenant_001',
        slug: 'pkcs12-demo-ruc',
      }),
    };
    const issuerProfileRepository = {
      findByTenantId: jest.fn().mockResolvedValue(
        IssuerProfile.create({
          id: 'issuer_001',
          tenantId: 'tenant_001',
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
          createdAt: new Date('2026-05-14T00:00:00.000Z'),
          updatedAt: new Date('2026-05-14T00:00:00.000Z'),
        }),
      ),
    };
    const invoiceNumberingSettingsRepository = {
      findByTenantIdAndDocumentCode: jest
        .fn()
        .mockImplementation(async (_tenantId: string, documentCode: string) =>
          documentCode === '01'
            ? InvoiceNumberingSettings.create({
                id: 'numbering_01',
                tenantId: 'tenant_001',
                documentCode: '01',
                establishmentCode: '001',
                emissionPointCode: '002',
                nextSequenceNumber: 1,
                createdAt: new Date('2026-05-14T00:00:00.000Z'),
                updatedAt: new Date('2026-05-14T00:00:00.000Z'),
              })
            : null,
        ),
    };
    const electronicSignatureSettingsRepository = {
      findByTenantId: jest.fn().mockResolvedValue(
        ElectronicSignatureSettings.create({
          id: 'signature_001',
          tenantId: 'tenant_001',
          provider: 'xades_pkcs12',
          certificateLabel: 'Firma pruebas',
          storageMode: 'secret_ref',
          certificateFingerprint: null,
          pkcs12SecretRef: 'env:EC_PKCS12',
          privateKeyPasswordSecretRef: 'env:EC_PKCS12_PASSWORD',
          subjectName: 'CN=Smoke',
          isActive: true,
          createdAt: new Date('2026-05-14T00:00:00.000Z'),
          updatedAt: new Date('2026-05-14T00:00:00.000Z'),
        }),
      ),
    };
    const electronicSubmissionSettingsRepository = {
      findByTenantId: jest.fn().mockResolvedValue(
        ElectronicSubmissionSettings.create({
          id: 'submission_001',
          tenantId: 'tenant_001',
          provider: 'sri_offline_ws',
          environment: 'test',
          transmissionMode: 'offline',
          receptionUrl:
            'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
          authorizationUrl:
            'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
          credentialsSecretRef: null,
          timeoutMs: 10000,
          isActive: true,
          createdAt: new Date('2026-05-14T00:00:00.000Z'),
          updatedAt: new Date('2026-05-14T00:00:00.000Z'),
        }),
      ),
    };
    const invoiceElectronicEventRepository = {
      findLatestByTenantIdAndProvider: jest.fn().mockResolvedValue(null),
    };
    const secretReferenceResolver = {
      resolve: jest.fn().mockResolvedValue('resolved-secret'),
    };
    const electronicSignatureMaterialInspector = {
      inspect: jest.fn().mockResolvedValue({
        status: 'likely_usable',
        detail: 'OpenSSL pudo abrir el PKCS#12.',
        encoding: 'base64_der',
        probeMethod: 'openssl_pkcs12',
        certificateValidityStatus: 'valid',
        cryptographicProofStatus: 'verified',
        cryptographicProofDetail:
          'La llave privada firmo y verifico correctamente un challenge local.',
        passwordPresent: true,
        hasAdvisoryWarning: false,
        fingerprintPresent: true,
        subjectNamePresent: true,
        extractedFingerprint: 'AA:BB:CC',
        extractedTaxId: '1790012345001',
        extractedSubjectName: 'CN=Smoke',
        extractedIssuerName: 'CN=Smoke CA',
        validFrom: '2026-01-01T00:00:00.000Z',
        validUntil: '2027-01-01T00:00:00.000Z',
        daysUntilExpiry: 200,
        byteLength: 2048,
      }),
    };
    const electronicInvoiceSigner = {
      describeCapability: jest.fn().mockReturnValue({
        signatureMode: 'xades_pkcs12_real',
        supportsSriOfflineSubmission: true,
        detail: 'El signer interno ya supera la compatibilidad offline local.',
      }),
      sign: jest.fn(),
    };
    const electronicInvoiceXmlSchemaValidator = {
      describeSupport: jest.fn().mockResolvedValue({
        isSchemaAvailable: true,
        detail: 'Schema disponible.',
      }),
      validate: jest.fn(),
    };
    const electronicInvoiceOfflineSignatureProbe = {
      inspect: jest.fn().mockResolvedValue({
        status: 'verified',
        detail:
          'La firma interna ya supero la compatibilidad offline local del repo.',
        verifiedDocumentCodes: ['04', '05', '06', '07'],
      }),
    };

    const useCase = new GetTenantElectronicSandboxReadinessUseCase(
      tenantRepository as any,
      issuerProfileRepository as any,
      invoiceNumberingSettingsRepository as any,
      electronicSignatureSettingsRepository as any,
      electronicSubmissionSettingsRepository as any,
      invoiceElectronicEventRepository as any,
      secretReferenceResolver as any,
      electronicSignatureMaterialInspector as any,
      electronicInvoiceSigner as any,
      electronicInvoiceXmlSchemaValidator as any,
      electronicInvoiceOfflineSignatureProbe as any,
    );

    const readiness = await useCase.execute('pkcs12-demo-ruc');

    expect(readiness.isReadyForLocalStubSubmission).toBe(false);
    expect(readiness.isReadyForPresignedRemoteSandboxSubmission).toBe(false);
    expect(readiness.isReadyForRemoteSandboxSubmission).toBe(false);
    expect(readiness.blockers).toContain(
      'El RUC 1790012345001 corresponde al fixture local por defecto y no a un contribuyente habilitado en CELCER. Para probar contra SRI sandbox necesitas un emisor realmente registrado en el ambiente de pruebas.',
    );
    expect(
      readiness.checks.find(
        (check) => check.key === 'sandbox_taxpayer_registration',
      ),
    ).toMatchObject({
      status: 'blocked',
    });
    expect(readiness.recommendedNextStep).toContain(
      'RUC demo local',
    );
  });

  it('should expose the latest remote sri submission as categorized feedback', async () => {
    const tenantRepository = {
      findBySlug: jest.fn().mockResolvedValue({
        id: 'tenant_001',
        slug: 'pkcs12-xml-feedback',
      }),
    };
    const issuerProfileRepository = {
      findByTenantId: jest.fn().mockResolvedValue(
        IssuerProfile.create({
          id: 'issuer_001',
          tenantId: 'tenant_001',
          legalName: 'Comercializadora Demo S.A.',
          commercialName: 'Comercializadora Demo',
          taxId: '0999999999001',
          environment: 'test',
          emissionType: 'normal',
          accountingObligated: true,
          specialTaxpayerCode: null,
          rimpeTaxpayerType: null,
          matrixAddress: 'Av. Principal',
          establishmentAddress: 'Sucursal Norte',
          createdAt: new Date('2026-05-14T00:00:00.000Z'),
          updatedAt: new Date('2026-05-14T00:00:00.000Z'),
        }),
      ),
    };
    const invoiceNumberingSettingsRepository = {
      findByTenantIdAndDocumentCode: jest
        .fn()
        .mockImplementation(async (_tenantId: string, documentCode: string) =>
          documentCode === '01'
            ? InvoiceNumberingSettings.create({
                id: 'numbering_01',
                tenantId: 'tenant_001',
                documentCode: '01',
                establishmentCode: '001',
                emissionPointCode: '002',
                nextSequenceNumber: 12,
                createdAt: new Date('2026-05-14T00:00:00.000Z'),
                updatedAt: new Date('2026-05-14T00:00:00.000Z'),
              })
            : null,
        ),
    };
    const electronicSignatureSettingsRepository = {
      findByTenantId: jest.fn().mockResolvedValue(
        ElectronicSignatureSettings.create({
          id: 'signature_001',
          tenantId: 'tenant_001',
          provider: 'xades_pkcs12',
          certificateLabel: 'Firma sandbox',
          storageMode: 'secret_ref',
          certificateFingerprint: null,
          pkcs12SecretRef: 'env:EC_PKCS12',
          privateKeyPasswordSecretRef: 'env:EC_PKCS12_PASSWORD',
          subjectName: 'CN=Sandbox Issuer',
          isActive: true,
          createdAt: new Date('2026-05-14T00:00:00.000Z'),
          updatedAt: new Date('2026-05-14T00:00:00.000Z'),
        }),
      ),
    };
    const electronicSubmissionSettingsRepository = {
      findByTenantId: jest.fn().mockResolvedValue(
        ElectronicSubmissionSettings.create({
          id: 'submission_001',
          tenantId: 'tenant_001',
          provider: 'sri_offline_ws',
          environment: 'test',
          transmissionMode: 'offline',
          receptionUrl:
            'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
          authorizationUrl:
            'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
          credentialsSecretRef: null,
          timeoutMs: 10000,
          isActive: true,
          createdAt: new Date('2026-05-14T00:00:00.000Z'),
          updatedAt: new Date('2026-05-14T00:00:00.000Z'),
        }),
      ),
    };
    const invoiceElectronicEventRepository = {
      findLatestByTenantIdAndProvider: jest.fn().mockResolvedValue({
        providerStatus: 'DEVUELTA',
        message:
          '35 - ARCHIVO NO CUMPLE ESTRUCTURA XML · Firma XML no cumple el perfil esperado.',
        responsePayload: `
          <RespuestaRecepcionComprobante>
            <estado>DEVUELTA</estado>
            <comprobantes>
              <comprobante>
                <mensajes>
                  <mensaje>
                    <identificador>35</identificador>
                    <mensaje>ARCHIVO NO CUMPLE ESTRUCTURA XML</mensaje>
                    <informacionAdicional>Firma XML no cumple el perfil esperado.</informacionAdicional>
                  </mensaje>
                </mensajes>
              </comprobante>
            </comprobantes>
          </RespuestaRecepcionComprobante>
        `,
        occurredAt: new Date('2026-05-14T03:00:00.000Z'),
      }),
    };
    const secretReferenceResolver = {
      resolve: jest.fn().mockResolvedValue('resolved-secret'),
    };
    const electronicSignatureMaterialInspector = {
      inspect: jest.fn().mockResolvedValue({
        status: 'likely_usable',
        detail: 'OpenSSL pudo abrir el PKCS#12.',
        encoding: 'base64_der',
        probeMethod: 'openssl_pkcs12',
        certificateValidityStatus: 'valid',
        cryptographicProofStatus: 'verified',
        cryptographicProofDetail:
          'La llave privada firmo y verifico correctamente un challenge local.',
        passwordPresent: true,
        hasAdvisoryWarning: false,
        fingerprintPresent: true,
        subjectNamePresent: true,
        extractedFingerprint: 'AA:BB:CC',
        extractedTaxId: '0999999999001',
        extractedSubjectName: 'CN=Sandbox Issuer',
        extractedIssuerName: 'CN=Sandbox CA',
        validFrom: '2026-01-01T00:00:00.000Z',
        validUntil: '2027-01-01T00:00:00.000Z',
        daysUntilExpiry: 200,
        byteLength: 2048,
      }),
    };
    const electronicInvoiceSigner = {
      describeCapability: jest.fn().mockReturnValue({
        signatureMode: 'xades_pkcs12_real',
        supportsSriOfflineSubmission: true,
        detail: 'El signer interno ya supera la compatibilidad offline local.',
      }),
      sign: jest.fn(),
    };
    const electronicInvoiceXmlSchemaValidator = {
      describeSupport: jest.fn().mockResolvedValue({
        isSchemaAvailable: true,
        detail: 'Schema disponible.',
      }),
      validate: jest.fn(),
    };
    const electronicInvoiceOfflineSignatureProbe = {
      inspect: jest.fn().mockResolvedValue({
        status: 'verified',
        detail:
          'La firma interna ya supero la compatibilidad offline local del repo.',
        verifiedDocumentCodes: ['04', '05', '06', '07'],
      }),
    };

    const useCase = new GetTenantElectronicSandboxReadinessUseCase(
      tenantRepository as any,
      issuerProfileRepository as any,
      invoiceNumberingSettingsRepository as any,
      electronicSignatureSettingsRepository as any,
      electronicSubmissionSettingsRepository as any,
      invoiceElectronicEventRepository as any,
      secretReferenceResolver as any,
      electronicSignatureMaterialInspector as any,
      electronicInvoiceSigner as any,
      electronicInvoiceXmlSchemaValidator as any,
      electronicInvoiceOfflineSignatureProbe as any,
    );

    const readiness = await useCase.execute('pkcs12-xml-feedback');

    expect(readiness.latestRemoteSriSubmissionStatus).toBe('DEVUELTA');
    expect(readiness.latestRemoteSriSubmissionCategory).toBe('xml_structure');
    expect(readiness.latestRemoteSriSubmissionSummary).toContain(
      'ARCHIVO NO CUMPLE ESTRUCTURA XML',
    );
    expect(readiness.latestRemoteSriSubmissionOccurredAt).toBe(
      '2026-05-14T03:00:00.000Z',
    );
    expect(
      readiness.checks.find((check) => check.key === 'remote_feedback'),
    ).toMatchObject({
      status: 'warning',
    });
    expect(readiness.warnings).toContain(
      'Ultimo feedback remoto SRI: 35 - ARCHIVO NO CUMPLE ESTRUCTURA XML · Firma XML no cumple el perfil esperado.',
    );
    expect(readiness.recommendedNextStep).toContain(
      'estructura XML o firma XAdES',
    );
    expect(readiness.blockers).not.toContain(
      expect.stringContaining('contribuyente registrado'),
    );
  });

  it('should block remote readiness when the certificate suggests a different ruc than the tenant issuer', async () => {
    const tenantRepository = {
      findBySlug: jest.fn().mockResolvedValue({
        id: 'tenant_001',
        slug: 'pkcs12-ruc-mismatch',
      }),
    };
    const issuerProfileRepository = {
      findByTenantId: jest.fn().mockResolvedValue(
        IssuerProfile.create({
          id: 'issuer_001',
          tenantId: 'tenant_001',
          legalName: 'Emisor Tenant S.A.',
          commercialName: 'Emisor Tenant',
          taxId: '0999999999001',
          environment: 'test',
          emissionType: 'normal',
          accountingObligated: true,
          specialTaxpayerCode: null,
          rimpeTaxpayerType: null,
          matrixAddress: 'Av. Central',
          establishmentAddress: 'Sucursal Centro',
          createdAt: new Date('2026-05-14T00:00:00.000Z'),
          updatedAt: new Date('2026-05-14T00:00:00.000Z'),
        }),
      ),
    };
    const invoiceNumberingSettingsRepository = {
      findByTenantIdAndDocumentCode: jest
        .fn()
        .mockImplementation(async (_tenantId: string, documentCode: string) =>
          documentCode === '01'
            ? InvoiceNumberingSettings.create({
                id: 'numbering_01',
                tenantId: 'tenant_001',
                documentCode: '01',
                establishmentCode: '001',
                emissionPointCode: '002',
                nextSequenceNumber: 4,
                createdAt: new Date('2026-05-14T00:00:00.000Z'),
                updatedAt: new Date('2026-05-14T00:00:00.000Z'),
              })
            : null,
        ),
    };
    const electronicSignatureSettingsRepository = {
      findByTenantId: jest.fn().mockResolvedValue(
        ElectronicSignatureSettings.create({
          id: 'signature_001',
          tenantId: 'tenant_001',
          provider: 'xades_pkcs12',
          certificateLabel: 'Firma mismatch',
          storageMode: 'secret_ref',
          certificateFingerprint: null,
          pkcs12SecretRef: 'env:EC_PKCS12',
          privateKeyPasswordSecretRef: 'env:EC_PKCS12_PASSWORD',
          subjectName: null,
          isActive: true,
          createdAt: new Date('2026-05-14T00:00:00.000Z'),
          updatedAt: new Date('2026-05-14T00:00:00.000Z'),
        }),
      ),
    };
    const electronicSubmissionSettingsRepository = {
      findByTenantId: jest.fn().mockResolvedValue(
        ElectronicSubmissionSettings.create({
          id: 'submission_001',
          tenantId: 'tenant_001',
          provider: 'sri_offline_ws',
          environment: 'test',
          transmissionMode: 'offline',
          receptionUrl:
            'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
          authorizationUrl:
            'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl',
          credentialsSecretRef: null,
          timeoutMs: 10000,
          isActive: true,
          createdAt: new Date('2026-05-14T00:00:00.000Z'),
          updatedAt: new Date('2026-05-14T00:00:00.000Z'),
        }),
      ),
    };
    const invoiceElectronicEventRepository = {
      findLatestByTenantIdAndProvider: jest.fn().mockResolvedValue(null),
    };
    const secretReferenceResolver = {
      resolve: jest.fn().mockResolvedValue('resolved-secret'),
    };
    const electronicSignatureMaterialInspector = {
      inspect: jest.fn().mockResolvedValue({
        status: 'likely_usable',
        detail: 'OpenSSL pudo abrir el PKCS#12.',
        encoding: 'base64_der',
        probeMethod: 'openssl_pkcs12',
        certificateValidityStatus: 'valid',
        cryptographicProofStatus: 'verified',
        cryptographicProofDetail:
          'La llave privada firmo y verifico correctamente un challenge local.',
        passwordPresent: true,
        hasAdvisoryWarning: false,
        fingerprintPresent: true,
        subjectNamePresent: true,
        extractedFingerprint: 'AA:BB:CC',
        extractedTaxId: '1111111111001',
        extractedSubjectName: 'serialNumber=RUC 1111111111001, CN=Cert Mismatch',
        extractedIssuerName: 'CN=Sandbox CA',
        validFrom: '2026-01-01T00:00:00.000Z',
        validUntil: '2027-01-01T00:00:00.000Z',
        daysUntilExpiry: 200,
        byteLength: 2048,
      }),
    };
    const electronicInvoiceSigner = {
      describeCapability: jest.fn().mockReturnValue({
        signatureMode: 'xades_pkcs12_real',
        supportsSriOfflineSubmission: true,
        detail: 'El signer interno ya supera la compatibilidad offline local.',
      }),
      sign: jest.fn(),
    };
    const electronicInvoiceXmlSchemaValidator = {
      describeSupport: jest.fn().mockResolvedValue({
        isSchemaAvailable: true,
        detail: 'Schema disponible.',
      }),
      validate: jest.fn(),
    };
    const electronicInvoiceOfflineSignatureProbe = {
      inspect: jest.fn().mockResolvedValue({
        status: 'verified',
        detail:
          'La firma interna ya supero la compatibilidad offline local del repo.',
        verifiedDocumentCodes: ['04', '05', '06', '07'],
      }),
    };

    const useCase = new GetTenantElectronicSandboxReadinessUseCase(
      tenantRepository as any,
      issuerProfileRepository as any,
      invoiceNumberingSettingsRepository as any,
      electronicSignatureSettingsRepository as any,
      electronicSubmissionSettingsRepository as any,
      invoiceElectronicEventRepository as any,
      secretReferenceResolver as any,
      electronicSignatureMaterialInspector as any,
      electronicInvoiceSigner as any,
      electronicInvoiceXmlSchemaValidator as any,
      electronicInvoiceOfflineSignatureProbe as any,
    );

    const readiness = await useCase.execute('pkcs12-ruc-mismatch');

    expect(readiness.internalSignerIssuerAlignmentStatus).toBe('mismatched');
    expect(readiness.isInternalSignerIssuerAligned).toBe(false);
    expect(readiness.internalSignerExtractedTaxId).toBe('1111111111001');
    expect(
      readiness.checks.find(
        (check) => check.key === 'signature_issuer_alignment',
      ),
    ).toMatchObject({
      status: 'blocked',
    });
    expect(readiness.isReadyForRemoteSandboxSubmission).toBe(false);
    expect(readiness.recommendedNextStep).toContain(
      'emisor distinto del RUC configurado',
    );
  });
});
