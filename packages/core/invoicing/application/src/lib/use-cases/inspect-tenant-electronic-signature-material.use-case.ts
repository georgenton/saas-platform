import { ElectronicSignatureMaterialInspector } from '../ports/electronic-signature-material-inspector';
import { ElectronicSignatureSettingsRepository } from '../ports/electronic-signature-settings.repository';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';

export interface TenantElectronicSignatureMaterialInspectionView {
  tenantSlug: string;
  signatureProvider: string | null;
  certificateLabel: string | null;
  storageMode: string | null;
  isActive: boolean;
  materialConfigured: boolean;
  inspection: {
    status: 'not_configured' | 'not_applicable' | 'likely_usable' | 'invalid';
    detail: string;
    encoding: 'not_applicable' | 'base64_der' | 'pem_like' | 'unknown';
    probeMethod: 'not_applicable' | 'shape_only' | 'openssl_pkcs12';
    certificateValidityStatus:
      | 'not_applicable'
      | 'unknown'
      | 'valid'
      | 'expiring_soon'
      | 'expired'
      | 'not_yet_valid';
    cryptographicProofStatus:
      | 'not_applicable'
      | 'unknown'
      | 'verified'
      | 'failed';
    cryptographicProofDetail: string;
    passwordPresent: boolean;
    hasAdvisoryWarning: boolean;
    fingerprintPresent: boolean;
    subjectNamePresent: boolean;
    extractedFingerprint: string | null;
    extractedTaxId: string | null;
    extractedSubjectName: string | null;
    extractedIssuerName: string | null;
    validFrom: string | null;
    validUntil: string | null;
    daysUntilExpiry: number | null;
    byteLength: number | null;
  };
}

export class InspectTenantElectronicSignatureMaterialUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly electronicSignatureSettingsRepository: ElectronicSignatureSettingsRepository,
    private readonly electronicSignatureMaterialInspector: ElectronicSignatureMaterialInspector,
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<TenantElectronicSignatureMaterialInspectionView> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const signatureSettings =
      await this.electronicSignatureSettingsRepository.findByTenantId(tenant.id);

    if (!signatureSettings) {
      return {
        tenantSlug,
        signatureProvider: null,
        certificateLabel: null,
        storageMode: null,
        isActive: false,
        materialConfigured: false,
        inspection: {
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
          fingerprintPresent: false,
          subjectNamePresent: false,
          extractedFingerprint: null,
          extractedTaxId: null,
          extractedSubjectName: null,
          extractedIssuerName: null,
          validFrom: null,
          validUntil: null,
          daysUntilExpiry: null,
          byteLength: null,
        },
      };
    }

    const inspection = await this.electronicSignatureMaterialInspector.inspect({
      signatureSettings,
    });

    return {
      tenantSlug,
      signatureProvider: signatureSettings.provider,
      certificateLabel: signatureSettings.certificateLabel,
      storageMode: signatureSettings.storageMode,
      isActive: signatureSettings.isActive,
      materialConfigured: signatureSettings.hasSigningMaterialConfigured(),
      inspection,
    };
  }
}
