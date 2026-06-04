import {
  EcuadorTaxCalendarEntryView,
  EcuadorTaxCalendarReviewEntryView,
  EcuadorTaxCalendarReviewWorkspaceView,
  EcuadorTaxDueStatus,
  EcuadorTaxReadinessStatus,
  EcuadorTaxReviewPriority,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxObligationCalendarUseCase } from './get-tenant-ecuador-tax-obligation-calendar.use-case';

export class GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase {
  constructor(
    private readonly getTenantEcuadorTaxObligationCalendarUseCase: GetTenantEcuadorTaxObligationCalendarUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    year: number,
    asOfDate?: string,
  ): Promise<EcuadorTaxCalendarReviewWorkspaceView> {
    const calendar =
      await this.getTenantEcuadorTaxObligationCalendarUseCase.execute(
        tenantSlug,
        year,
      );
    const now = this.nowProvider();
    const resolvedAsOfDate = asOfDate ?? toDateOnly(now);
    const priorityEntries = calendar.entries
      .map((entry) => toReviewEntry(entry, resolvedAsOfDate))
      .filter(
        (entry) =>
          entry.dueStatus !== 'upcoming' ||
          entry.readinessStatus !== 'ready',
      )
      .sort(compareReviewEntries);

    const overdueCount = priorityEntries.filter(
      (entry) => entry.dueStatus === 'overdue',
    ).length;
    const dueSoonCount = priorityEntries.filter(
      (entry) => entry.dueStatus === 'due_soon',
    ).length;
    const blockedCount = priorityEntries.filter(
      (entry) => entry.readinessStatus === 'blocked',
    ).length;
    const needsReviewCount = priorityEntries.filter(
      (entry) => entry.readinessStatus === 'needs_review',
    ).length;

    return {
      tenantSlug,
      year,
      generatedAt: now,
      asOfDate: resolvedAsOfDate,
      taxpayerProfile: calendar.taxpayerProfile,
      summary: {
        totalEntries: calendar.entries.length,
        overdueCount,
        dueSoonCount,
        blockedCount,
        needsReviewCount,
      },
      priorityEntries,
      nextActions: buildNextActions({
        overdueCount,
        dueSoonCount,
        blockedCount,
        needsReviewCount,
      }),
      guardrails: [
        ...calendar.guardrails,
        'Este workspace prioriza revision operativa; no confirma presentacion ni pago de obligaciones ante SRI.',
      ],
    };
  }
}

function toReviewEntry(
  entry: EcuadorTaxCalendarEntryView,
  asOfDate: string,
): EcuadorTaxCalendarReviewEntryView {
  const daysUntilDue = getDaysUntilDue(entry.dueDate, asOfDate);
  const dueStatus = getDueStatus(daysUntilDue);
  const reviewPriority = getReviewPriority({
    dueStatus,
    readinessStatus: entry.readinessStatus,
  });
  const reviewReasons = [
    dueStatus === 'overdue' ? 'obligation_due_date_passed' : null,
    dueStatus === 'due_soon' ? 'obligation_due_within_review_window' : null,
    dueStatus === 'unscheduled' ? 'obligation_due_date_missing' : null,
    entry.readinessStatus === 'blocked' ? 'readiness_blocked' : null,
    entry.readinessStatus === 'needs_review' ? 'readiness_needs_review' : null,
  ].filter((reason): reason is string => reason !== null);

  return {
    ...entry,
    dueStatus,
    daysUntilDue,
    reviewPriority,
    reviewReasons,
  };
}

function getDaysUntilDue(
  dueDate: string | null,
  asOfDate: string,
): number | null {
  if (!dueDate) {
    return null;
  }

  const due = Date.parse(`${dueDate}T00:00:00.000Z`);
  const asOf = Date.parse(`${asOfDate}T00:00:00.000Z`);

  return Math.round((due - asOf) / 86_400_000);
}

function getDueStatus(daysUntilDue: number | null): EcuadorTaxDueStatus {
  if (daysUntilDue === null) {
    return 'unscheduled';
  }

  if (daysUntilDue < 0) {
    return 'overdue';
  }

  return daysUntilDue <= 15 ? 'due_soon' : 'upcoming';
}

function getReviewPriority(input: {
  dueStatus: EcuadorTaxDueStatus;
  readinessStatus: EcuadorTaxReadinessStatus;
}): EcuadorTaxReviewPriority {
  if (input.dueStatus === 'overdue' || input.readinessStatus === 'blocked') {
    return 'critical';
  }

  if (
    input.dueStatus === 'due_soon' ||
    input.readinessStatus === 'needs_review'
  ) {
    return 'high';
  }

  return 'normal';
}

function compareReviewEntries(
  left: EcuadorTaxCalendarReviewEntryView,
  right: EcuadorTaxCalendarReviewEntryView,
): number {
  const priorityRank: Record<EcuadorTaxReviewPriority, number> = {
    critical: 0,
    high: 1,
    normal: 2,
  };

  const priorityDiff =
    priorityRank[left.reviewPriority] - priorityRank[right.reviewPriority];

  if (priorityDiff !== 0) {
    return priorityDiff;
  }

  return (left.daysUntilDue ?? 9999) - (right.daysUntilDue ?? 9999);
}

function buildNextActions(input: {
  overdueCount: number;
  dueSoonCount: number;
  blockedCount: number;
  needsReviewCount: number;
}): string[] {
  return [
    input.blockedCount > 0
      ? 'Resolver bloqueos de perfil tributario, terceros fiscales o calendario antes de preparar declaraciones.'
      : null,
    input.overdueCount > 0
      ? 'Priorizar obligaciones vencidas y confirmar con contador si ya fueron presentadas o pagadas.'
      : null,
    input.dueSoonCount > 0
      ? 'Preparar packets de obligaciones próximas a vencer dentro de la ventana operativa.'
      : null,
    input.needsReviewCount > 0
      ? 'Enviar obligaciones en revision al contador o responsable tributario antes de declarar.'
      : null,
  ].filter((action): action is string => action !== null);
}

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}
