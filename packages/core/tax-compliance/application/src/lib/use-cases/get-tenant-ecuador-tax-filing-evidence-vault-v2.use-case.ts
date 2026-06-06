import {
  EcuadorTaxFilingEvidenceVaultV2View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPeriodEvidenceVaultUseCase } from './get-tenant-ecuador-tax-period-evidence-vault.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase } from './request-tenant-ecuador-tax-period-closeout-certification.use-case';

export class GetTenantEcuadorTaxFilingEvidenceVaultV2UseCase {
  constructor(
    private readonly getTenantEcuadorTaxPeriodEvidenceVaultUseCase: GetTenantEcuadorTaxPeriodEvidenceVaultUseCase,
    private readonly requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase: RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxFilingEvidenceVaultV2View> {
    const [baseVault, certification] = await Promise.all([
      this.getTenantEcuadorTaxPeriodEvidenceVaultUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const evidenceFolders = [
      ...baseVault.folders.map((folder) => ({
        key: folder.key,
        label: folder.label,
        readinessStatus: folder.readinessStatus,
        artifactCount: folder.artifactCount,
        requiredFor: ['period_closeout', 'audit_support'],
        missingItems: folder.missingItems,
      })),
      {
        key: 'period_certification',
        label: 'Certificacion tributaria operacional',
        readinessStatus:
          certification.certificationStatus === 'blocked'
            ? ('blocked' as const)
            : certification.certificationStatus === 'externally_filed'
              ? ('ready' as const)
              : ('needs_review' as const),
        artifactCount: certification.certificationChecklist.length,
        requiredFor: ['tax_period_closeout_certification'],
        missingItems: certification.blockers,
      },
    ];
    const blockers = [
      ...baseVault.missingItems,
      ...certification.blockers,
      ...evidenceFolders.flatMap((folder) => folder.missingItems),
    ];
    const readinessStatus = resolveReadiness(
      evidenceFolders.map((folder) => folder.readinessStatus),
      blockers,
    );
    const view: EcuadorTaxFilingEvidenceVaultV2View = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      baseVault,
      certification,
      evidenceFolders,
      summary: {
        folderCount: evidenceFolders.length,
        readyFolderCount: evidenceFolders.filter(
          (folder) => folder.readinessStatus === 'ready',
        ).length,
        artifactCount: evidenceFolders.reduce(
          (total, folder) => total + folder.artifactCount,
          0,
        ),
        missingItemCount: blockers.length,
        certificationBlockerCount: certification.blockers.length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'blocked'
          ? 'Completar items faltantes de carpeta fiscal antes de cerrar.'
          : 'Conservar carpeta fiscal 2.0 como soporte defendible del periodo.',
      guardrails: [
        'La carpeta fiscal organiza evidencia; no emite documentos oficiales SRI.',
        'Los soportes externos de filing/pago deben registrarse por humano.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_filing_evidence_vault_v2_reviewed',
        source: 'tax_filing_evidence_vault_v2',
        payload: { readinessStatus, summary: view.summary },
      });
    }

    return view;
  }
}

function resolveReadiness(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
