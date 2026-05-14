import { ElectronicSubmissionSettingsRepository } from '../ports/electronic-submission-settings.repository';
import { ElectronicSignatureMaterialInspector } from '../ports/electronic-signature-material-inspector';
import { ElectronicInvoiceSigner } from '../ports/electronic-invoice-signer';
import { ElectronicInvoiceXmlSchemaValidator } from '../ports/electronic-invoice-xml-schema-validator';
import { ElectronicSignatureSettingsRepository } from '../ports/electronic-signature-settings.repository';
import { InvoiceNumberingSettingsRepository } from '../ports/invoice-numbering-settings.repository';
import { IssuerProfileRepository } from '../ports/issuer-profile.repository';
import { SecretReferenceResolver } from '../ports/secret-reference-resolver';
import {
  ElectronicInvoicingDocumentSupport,
  ElectronicInvoicingReadinessCheck,
  ElectronicInvoicingSandboxReadiness,
} from '../types/electronic-invoicing-readiness';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';

export class GetTenantElectronicSandboxReadinessUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly issuerProfileRepository: IssuerProfileRepository,
    private readonly invoiceNumberingSettingsRepository: InvoiceNumberingSettingsRepository,
    private readonly electronicSignatureSettingsRepository: ElectronicSignatureSettingsRepository,
    private readonly electronicSubmissionSettingsRepository: ElectronicSubmissionSettingsRepository,
    private readonly secretReferenceResolver: SecretReferenceResolver,
    private readonly electronicSignatureMaterialInspector: ElectronicSignatureMaterialInspector,
    private readonly electronicInvoiceSigner: ElectronicInvoiceSigner,
    private readonly electronicInvoiceXmlSchemaValidator: ElectronicInvoiceXmlSchemaValidator,
  ) {}

  async execute(tenantSlug: string): Promise<ElectronicInvoicingSandboxReadiness> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const [
      issuerProfile,
      invoiceNumberingSettings,
      creditNoteNumberingSettings,
      debitNoteNumberingSettings,
      remissionGuideNumberingSettings,
      withholdingNumberingSettings,
      signatureSettings,
      submissionSettings,
      invoiceSchemaSupport,
      creditNoteSchemaSupport,
      debitNoteSchemaSupport,
      remissionGuideSchemaSupport,
      withholdingSchemaSupport,
    ] = await Promise.all([
      this.issuerProfileRepository.findByTenantId(tenant.id),
      this.invoiceNumberingSettingsRepository.findByTenantIdAndDocumentCode(
        tenant.id,
        '01',
      ),
      this.invoiceNumberingSettingsRepository.findByTenantIdAndDocumentCode(
        tenant.id,
        '04',
      ),
      this.invoiceNumberingSettingsRepository.findByTenantIdAndDocumentCode(
        tenant.id,
        '05',
      ),
      this.invoiceNumberingSettingsRepository.findByTenantIdAndDocumentCode(
        tenant.id,
        '06',
      ),
      this.invoiceNumberingSettingsRepository.findByTenantIdAndDocumentCode(
        tenant.id,
        '07',
      ),
      this.electronicSignatureSettingsRepository.findByTenantId(tenant.id),
      this.electronicSubmissionSettingsRepository.findByTenantId(tenant.id),
      this.electronicInvoiceXmlSchemaValidator.describeSupport('01'),
      this.electronicInvoiceXmlSchemaValidator.describeSupport('04'),
      this.electronicInvoiceXmlSchemaValidator.describeSupport('05'),
      this.electronicInvoiceXmlSchemaValidator.describeSupport('06'),
      this.electronicInvoiceXmlSchemaValidator.describeSupport('07'),
    ]);

    const checks: ElectronicInvoicingReadinessCheck[] = [];
    const blockers: string[] = [];
    const warnings: string[] = [];
    let internalSignerMaterialStatus:
      | 'not_configured'
      | 'not_applicable'
      | 'likely_usable'
      | 'invalid' = 'not_configured';
    let internalSignerMaterialDetail =
      'No existe una configuracion activa de firma electronica.';

    if (!issuerProfile) {
      pushBlocked(
        checks,
        blockers,
        'issuer_profile',
        'Perfil fiscal',
        'Falta configurar el perfil fiscal del emisor para el tenant.',
      );
    } else {
      checks.push({
        key: 'issuer_profile',
        label: 'Perfil fiscal',
        status: 'ready',
        detail: `Configurado para ${issuerProfile.environment} con RUC ${issuerProfile.taxId}.`,
      });
    }

    if (!invoiceNumberingSettings) {
      pushBlocked(
        checks,
        blockers,
        'invoice_numbering',
        'Numeracion Ecuador',
        'Falta configurar establecimiento, punto de emision y secuencial.',
      );
    } else {
      checks.push({
        key: 'invoice_numbering',
        label: 'Numeracion Ecuador',
        status: 'ready',
        detail: `Preview ${invoiceNumberingSettings.establishmentCode}-${invoiceNumberingSettings.emissionPointCode}-${String(invoiceNumberingSettings.nextSequenceNumber).padStart(9, '0')}.`,
      });
    }

    if (!signatureSettings || !signatureSettings.isActive) {
      pushBlocked(
        checks,
        blockers,
        'signature_settings',
        'Firma electronica',
        'No existe una configuracion activa de firma electronica.',
      );
    } else {
      checks.push({
        key: 'signature_settings',
        label: 'Firma electronica',
        status: 'ready',
        detail: `Provider activo: ${signatureSettings.provider}.`,
      });

      if (!signatureSettings.hasSigningMaterialConfigured()) {
        internalSignerMaterialStatus = 'invalid';
        internalSignerMaterialDetail =
          'La configuracion de firma existe, pero el material PKCS#12 o su password siguen incompletos.';
        pushBlocked(
          checks,
          blockers,
          'signature_material',
          'Material de firma',
          'La configuracion de firma existe, pero el material PKCS#12 o su password siguen incompletos.',
        );
      } else {
        const signatureMaterialIssues = await this.validateSecretRefs([
          signatureSettings.pkcs12SecretRef,
          signatureSettings.privateKeyPasswordSecretRef,
        ]);

        if (signatureMaterialIssues.length > 0) {
          internalSignerMaterialStatus = 'invalid';
          internalSignerMaterialDetail = signatureMaterialIssues.join(' ');
          pushBlocked(
            checks,
            blockers,
            'signature_material',
            'Material de firma',
            signatureMaterialIssues.join(' '),
          );
        } else {
          checks.push({
            key: 'signature_material',
            label: 'Material de firma',
            status: 'ready',
            detail:
              signatureSettings.provider === 'xades_pkcs12'
                ? 'Las referencias del PKCS#12 y password responden desde el resolver configurado.'
                : 'El provider stub_local no requiere PKCS#12 ni password externo para el carril local.',
          });

          const signatureMaterialInspection =
            await this.electronicSignatureMaterialInspector.inspect({
              signatureSettings,
            });

          internalSignerMaterialStatus = signatureMaterialInspection.status;
          internalSignerMaterialDetail = signatureMaterialInspection.detail;

          if (signatureMaterialInspection.status === 'likely_usable') {
            checks.push({
              key: 'signature_material_probe',
              label: 'Inspeccion estructural PKCS#12',
              status: 'ready',
              detail: signatureMaterialInspection.detail,
            });

            if (
              !signatureMaterialInspection.fingerprintPresent ||
              !signatureMaterialInspection.subjectNamePresent
            ) {
              warnings.push(signatureMaterialInspection.detail);
            }
          } else if (signatureMaterialInspection.status === 'not_applicable') {
            checks.push({
              key: 'signature_material_probe',
              label: 'Inspeccion estructural PKCS#12',
              status: 'ready',
              detail: signatureMaterialInspection.detail,
            });
          } else {
            pushBlocked(
              checks,
              blockers,
              'signature_material_probe',
              'Inspeccion estructural PKCS#12',
              signatureMaterialInspection.detail,
            );
          }
        }
      }

      const signerCapability = this.electronicInvoiceSigner.describeCapability({
        signatureSettings,
      });

      if (signerCapability.supportsSriOfflineSubmission) {
        checks.push({
          key: 'signature_capability',
          label: 'Capacidad de firma real',
          status: 'ready',
          detail: signerCapability.detail,
        });
      } else {
        pushBlocked(
          checks,
          blockers,
          'signature_capability',
          'Capacidad de firma real',
          signerCapability.detail,
        );
      }
    }

    if (!submissionSettings || !submissionSettings.isActive) {
      pushBlocked(
        checks,
        blockers,
        'submission_settings',
        'Gateway SRI',
        'No existe una configuracion activa de envio electronico.',
      );
    } else {
      checks.push({
        key: 'submission_settings',
        label: 'Gateway SRI',
        status: 'ready',
        detail: `Provider ${submissionSettings.provider} en modo ${submissionSettings.transmissionMode}.`,
      });

      if (!submissionSettings.hasGatewayConfigured()) {
        pushBlocked(
          checks,
          blockers,
          'submission_gateway',
          'URLs del gateway',
          'La recepcion o la autorizacion del gateway SRI siguen incompletas.',
        );
      } else {
        checks.push({
          key: 'submission_gateway',
          label: 'URLs del gateway',
          status: 'ready',
          detail: 'Recepcion y autorizacion configuradas para el provider actual.',
        });
      }

      if (submissionSettings.provider !== 'sri_offline_ws') {
        pushBlocked(
          checks,
          blockers,
          'submission_transport',
          'Transporte remoto',
          'El provider actual sigue siendo stub_sri; para sandbox real debe usarse sri_offline_ws.',
        );
      } else if (submissionSettings.transmissionMode !== 'offline') {
        pushBlocked(
          checks,
          blockers,
          'submission_transport',
          'Transporte remoto',
          'El tenant sigue en sync_stub; para probar contra SRI debe usarse transmissionMode=offline.',
        );
      } else {
        checks.push({
          key: 'submission_transport',
          label: 'Transporte remoto',
          status: 'ready',
          detail: 'El tenant ya apunta al camino HTTP/SOAP remoto del esquema offline.',
        });
      }

      if (
        issuerProfile &&
        issuerProfile.environment !== submissionSettings.environment
      ) {
        pushBlocked(
          checks,
          blockers,
          'environment_alignment',
          'Alineacion de ambiente',
          `El perfil fiscal esta en ${issuerProfile.environment} pero el gateway esta en ${submissionSettings.environment}.`,
        );
      } else {
        checks.push({
          key: 'environment_alignment',
          label: 'Alineacion de ambiente',
          status: 'ready',
          detail: `Firma y envio apuntan al ambiente ${submissionSettings.environment}.`,
        });
      }

      if (!submissionSettings.credentialsSecretRef) {
        checks.push({
          key: 'credentials_secret',
          label: 'Credenciales del gateway',
          status: 'warning',
          detail: 'No hay credentialsSecretRef. Si el entorno SRI o el proxy requieren cabeceras adicionales, aun falta esa referencia.',
        });
        warnings.push(
          'No existe credentialsSecretRef configurado para el gateway remoto.',
        );
      } else {
        const credentialIssues = await this.validateSecretRefs([
          submissionSettings.credentialsSecretRef,
        ]);

        if (credentialIssues.length > 0) {
          pushBlocked(
            checks,
            blockers,
            'credentials_secret',
            'Credenciales del gateway',
            credentialIssues.join(' '),
          );
        } else {
          checks.push({
            key: 'credentials_secret',
            label: 'Credenciales del gateway',
            status: 'ready',
            detail: 'La referencia de credenciales responde desde el resolver configurado.',
          });
        }
      }
    }

    const documentSupport: ElectronicInvoicingDocumentSupport[] = [
      {
        documentCode: '01',
        label: 'Factura ECU (01)',
        numberingConfigured: Boolean(invoiceNumberingSettings),
        previewAvailable: true,
        rideAvailable: true,
        schemaValidationAvailable: invoiceSchemaSupport.isSchemaAvailable,
        submitSupported: invoiceSchemaSupport.isSchemaAvailable,
        detail: invoiceSchemaSupport.isSchemaAvailable
          ? 'La factura 01 ya tiene preview XML, RIDE, validacion XSD y el carril de submit electronico habilitado.'
          : invoiceSchemaSupport.detail,
      },
      {
        documentCode: '04',
        label: 'Nota de credito ECU (04)',
        numberingConfigured: Boolean(creditNoteNumberingSettings),
        previewAvailable: true,
        rideAvailable: true,
        schemaValidationAvailable: creditNoteSchemaSupport.isSchemaAvailable,
        submitSupported: creditNoteSchemaSupport.isSchemaAvailable,
        detail: creditNoteSchemaSupport.isSchemaAvailable
          ? 'La nota de credito 04 ya tiene preview XML, RIDE y validacion XSD local. El carril de submit electronico ya puede probarse con la misma frontera tecnica del documento 01.'
          : `${creditNoteSchemaSupport.detail} El documento 04 queda hoy en modo preview y RIDE, sin submit electronico.`,
      },
      {
        documentCode: '05',
        label: 'Nota de debito ECU (05)',
        numberingConfigured: Boolean(debitNoteNumberingSettings),
        previewAvailable: true,
        rideAvailable: true,
        schemaValidationAvailable: debitNoteSchemaSupport.isSchemaAvailable,
        submitSupported: debitNoteSchemaSupport.isSchemaAvailable,
        detail: debitNoteSchemaSupport.isSchemaAvailable
          ? 'La nota de debito 05 ya tiene draft, preview XML, RIDE y validacion XSD local. El carril de submit electronico queda habilitado sobre la misma frontera tecnica multi-documento.'
          : `${debitNoteSchemaSupport.detail} El documento 05 queda hoy en modo draft, preview y RIDE, sin submit electronico.`,
      },
      {
        documentCode: '06',
        label: 'Guia de remision ECU (06)',
        numberingConfigured: Boolean(remissionGuideNumberingSettings),
        previewAvailable: true,
        rideAvailable: true,
        schemaValidationAvailable: remissionGuideSchemaSupport.isSchemaAvailable,
        submitSupported: remissionGuideSchemaSupport.isSchemaAvailable,
        detail: remissionGuideSchemaSupport.isSchemaAvailable
          ? 'La guia de remision 06 ya tiene draft, preview XML, RIDE y validacion XSD local. El carril de submit electronico queda habilitado sobre la misma frontera tecnica multi-documento.'
          : `${remissionGuideSchemaSupport.detail} El documento 06 queda hoy en modo draft, preview y RIDE, sin submit electronico.`,
      },
      {
        documentCode: '07',
        label: 'Comprobante de retencion ECU (07)',
        numberingConfigured: Boolean(withholdingNumberingSettings),
        previewAvailable: true,
        rideAvailable: true,
        schemaValidationAvailable: withholdingSchemaSupport.isSchemaAvailable,
        submitSupported: withholdingSchemaSupport.isSchemaAvailable,
        detail: withholdingSchemaSupport.isSchemaAvailable
          ? 'El comprobante de retencion 07 ya tiene draft, preview XML, RIDE y validacion XSD local. El carril de submit electronico queda habilitado sobre la misma frontera tecnica multi-documento.'
          : `${withholdingSchemaSupport.detail} El documento 07 queda hoy en modo draft, preview y RIDE, sin submit electronico.`,
      },
    ];

    const blockedKeys = new Set(
      checks.filter((check) => check.status === 'blocked').map((check) => check.key),
    );
    const hasAnyDocumentSubmitSupport = documentSupport.some(
      (item) => item.submitSupported,
    );
    const isReadyForLocalStubSubmission =
      hasAnyDocumentSubmitSupport &&
      !blockedKeys.has('issuer_profile') &&
      !blockedKeys.has('signature_settings') &&
      !blockedKeys.has('signature_material') &&
      submissionSettings?.isActive === true &&
      submissionSettings.provider === 'stub_sri';
    const isReadyForPresignedRemoteSandboxSubmission =
      hasAnyDocumentSubmitSupport &&
      !blockedKeys.has('issuer_profile') &&
      !blockedKeys.has('submission_settings') &&
      !blockedKeys.has('submission_gateway') &&
      !blockedKeys.has('submission_transport') &&
      !blockedKeys.has('environment_alignment') &&
      !blockedKeys.has('credentials_secret');
    const isReadyForRemoteSandboxSubmission =
      isReadyForPresignedRemoteSandboxSubmission &&
      !blockedKeys.has('signature_settings') &&
      !blockedKeys.has('signature_material') &&
      !blockedKeys.has('signature_material_probe') &&
      !blockedKeys.has('signature_capability');
    const recommendedNextStep = isReadyForRemoteSandboxSubmission
      ? 'El tenant ya puede pasar a una prueba controlada contra SRI sandbox con firma interna.'
      : internalSignerMaterialStatus === 'likely_usable' &&
          isReadyForPresignedRemoteSandboxSubmission
        ? 'El material PKCS#12 ya parece cargable, pero la firma criptografica interna todavia sigue en modo stub. El siguiente paso es cerrar el signer real.'
      : isReadyForPresignedRemoteSandboxSubmission
        ? 'El tenant ya puede probar sandbox remoto usando XML prefirmado. La firma interna real sigue pendiente.'
        : isReadyForLocalStubSubmission
          ? 'El tenant puede seguir validando el pipeline interno con stub local mientras termina de cerrar el camino remoto.'
          : 'Primero resuelve los blockers del flujo 01 y despues cambia a una prueba controlada en sandbox.';

    return {
      tenantSlug,
      stage: 'electronic_invoicing_ec_mvp',
      environment:
        submissionSettings?.environment ?? issuerProfile?.environment ?? null,
      signatureProvider: signatureSettings?.provider ?? null,
      submissionProvider: submissionSettings?.provider ?? null,
      transmissionMode: submissionSettings?.transmissionMode ?? null,
      internalSignerMaterialStatus,
      internalSignerMaterialDetail,
      isInternalSignerMaterialReady:
        internalSignerMaterialStatus === 'likely_usable',
      isReadyForLocalStubSubmission,
      isReadyForRemoteSandboxSubmission,
      isReadyForPresignedRemoteSandboxSubmission,
      blockers,
      warnings,
      checks,
      documentSupport,
      recommendedNextStep,
    };
  }

  private async validateSecretRefs(
    refs: Array<string | null>,
  ): Promise<string[]> {
    const issues: string[] = [];

    for (const ref of refs) {
      if (!ref) {
        continue;
      }

      try {
        const resolved = await this.secretReferenceResolver.resolve(ref);

        if (!resolved) {
          issues.push(`La referencia "${ref}" no pudo resolverse.`);
        }
      } catch (error) {
        issues.push(
          error instanceof Error
            ? error.message
            : `La referencia "${ref}" fallo al resolverse.`,
        );
      }
    }

    return issues;
  }
}

function pushBlocked(
  checks: ElectronicInvoicingReadinessCheck[],
  blockers: string[],
  key: ElectronicInvoicingReadinessCheck['key'],
  label: string,
  detail: string,
): void {
  checks.push({
    key,
    label,
    status: 'blocked',
    detail,
  });
  blockers.push(detail);
}
