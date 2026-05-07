import { ElectronicSubmissionSettingsRepository } from '../ports/electronic-submission-settings.repository';
import { ElectronicInvoiceSigner } from '../ports/electronic-invoice-signer';
import { ElectronicSignatureSettingsRepository } from '../ports/electronic-signature-settings.repository';
import { InvoiceNumberingSettingsRepository } from '../ports/invoice-numbering-settings.repository';
import { IssuerProfileRepository } from '../ports/issuer-profile.repository';
import { SecretReferenceResolver } from '../ports/secret-reference-resolver';
import {
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
    private readonly electronicInvoiceSigner: ElectronicInvoiceSigner,
  ) {}

  async execute(tenantSlug: string): Promise<ElectronicInvoicingSandboxReadiness> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const [
      issuerProfile,
      invoiceNumberingSettings,
      signatureSettings,
      submissionSettings,
    ] = await Promise.all([
      this.issuerProfileRepository.findByTenantId(tenant.id),
      this.invoiceNumberingSettingsRepository.findByTenantId(tenant.id),
      this.electronicSignatureSettingsRepository.findByTenantId(tenant.id),
      this.electronicSubmissionSettingsRepository.findByTenantId(tenant.id),
    ]);

    const checks: ElectronicInvoicingReadinessCheck[] = [];
    const blockers: string[] = [];
    const warnings: string[] = [];

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
            detail: 'Las referencias del PKCS#12 y password responden desde el resolver configurado.',
          });
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

    const isReadyForRemoteSandboxSubmission = blockers.length === 0;

    return {
      tenantSlug,
      stage: 'electronic_invoicing_ec_mvp',
      environment:
        submissionSettings?.environment ?? issuerProfile?.environment ?? null,
      signatureProvider: signatureSettings?.provider ?? null,
      submissionProvider: submissionSettings?.provider ?? null,
      transmissionMode: submissionSettings?.transmissionMode ?? null,
      isReadyForRemoteSandboxSubmission,
      blockers,
      warnings,
      checks,
      recommendedNextStep: isReadyForRemoteSandboxSubmission
        ? 'El tenant ya puede pasar a una prueba controlada contra SRI sandbox.'
        : 'Primero resuelve los blockers y despues cambia a una prueba controlada en sandbox.',
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
