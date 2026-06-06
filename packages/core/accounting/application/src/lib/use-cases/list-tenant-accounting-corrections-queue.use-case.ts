import { TenantAccountingCorrectionsQueueView } from '@saas-platform/accounting-domain';
import { AccountingCorrectionRepository } from '../ports/accounting-correction.repository';

export class ListTenantAccountingCorrectionsQueueUseCase {
  constructor(
    private readonly correctionRepository: AccountingCorrectionRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingCorrectionsQueueView> {
    const corrections = await this.correctionRepository.listByPeriod(input);
    const criticalCount = corrections.filter(
      (correction) => correction.severity === 'critical',
    ).length;
    const openCount = corrections.filter(
      (correction) => correction.status === 'open',
    ).length;
    const inProgressCount = corrections.filter(
      (correction) => correction.status === 'in_progress',
    ).length;
    const blockers =
      criticalCount > 0 ? ['accounting.corrections.critical_open'] : [];
    const queueStatus =
      corrections.length === 0
        ? 'empty'
        : criticalCount > 0
          ? 'blocked'
          : openCount + inProgressCount > 0
            ? 'needs_review'
            : 'ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      queueStatus,
      corrections,
      summary: {
        correctionCount: corrections.length,
        openCount,
        inProgressCount,
        resolvedCount: corrections.filter(
          (correction) => correction.status === 'resolved',
        ).length,
        dismissedCount: corrections.filter(
          (correction) => correction.status === 'dismissed',
        ).length,
        criticalCount,
      },
      blockers,
      nextStep:
        queueStatus === 'empty'
          ? 'Registrar correcciones si el contador solicita cambios.'
          : queueStatus === 'ready'
            ? 'Usar queue resuelta como soporte del cierre profesional.'
            : 'Resolver correcciones abiertas antes del closeout profesional.',
      guardrails: [
        'La queue organiza trabajo operativo; no crea ajustes automaticamente.',
        'Cada correccion debe conservar evidencia y responsable humano.',
      ],
    };
  }
}
