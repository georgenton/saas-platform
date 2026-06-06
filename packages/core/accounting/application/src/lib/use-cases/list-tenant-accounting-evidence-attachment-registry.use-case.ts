import { TenantAccountingEvidenceAttachmentRegistryView } from '@saas-platform/accounting-domain';
import { AccountingEvidenceAttachmentRepository } from '../ports/accounting-evidence-attachment.repository';
import { GetTenantAccountingPeriodEvidenceVaultUseCase } from './get-tenant-accounting-period-evidence-vault.use-case';

export class ListTenantAccountingEvidenceAttachmentRegistryUseCase {
  constructor(
    private readonly attachmentRepository: AccountingEvidenceAttachmentRepository,
    private readonly getTenantAccountingPeriodEvidenceVaultUseCase: GetTenantAccountingPeriodEvidenceVaultUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingEvidenceAttachmentRegistryView> {
    const [attachments, evidenceVault] = await Promise.all([
      this.attachmentRepository.listByPeriod(input),
      this.getTenantAccountingPeriodEvidenceVaultUseCase.execute(input),
    ]);
    const needsReviewAttachmentCount = attachments.filter(
      (attachment) => attachment.status === 'needs_review',
    ).length;
    const registryStatus =
      attachments.length === 0
        ? 'empty'
        : needsReviewAttachmentCount > 0
          ? 'needs_review'
          : 'ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      registryStatus,
      attachments,
      evidenceVault,
      summary: {
        attachmentCount: attachments.length,
        readyAttachmentCount: attachments.filter(
          (attachment) => attachment.status === 'ready',
        ).length,
        needsReviewAttachmentCount,
        archivedAttachmentCount: attachments.filter(
          (attachment) => attachment.status === 'archived',
        ).length,
        vaultArtifactCount: evidenceVault.summary.artifactCount,
      },
      blockers: [],
      nextStep:
        registryStatus === 'ready'
          ? 'Usar adjuntos como evidencia externa trazable del periodo.'
          : 'Registrar adjuntos clave antes del cierre profesional.',
      guardrails: [
        'El registry guarda referencias, no valida legalmente documentos.',
        'Hash/reference deben venir de sistemas externos confiables cuando aplique.',
      ],
    };
  }
}
