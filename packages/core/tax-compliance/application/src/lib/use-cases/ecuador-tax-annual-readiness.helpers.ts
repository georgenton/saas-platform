import {
  EcuadorTaxComplianceEventView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';

export async function listAnnualTaxEvents(
  listEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
  tenantSlug: string,
  year: number,
): Promise<EcuadorTaxComplianceEventView[]> {
  const monthlyEvents = await Promise.all(
    Array.from({ length: 12 }, (_, index) =>
      listEventsUseCase.execute({
        tenantSlug,
        period: `${year}-${String(index + 1).padStart(2, '0')}`,
        limit: 200,
      }),
    ),
  );

  return monthlyEvents.flat();
}

export function annualGuardrails(): string[] {
  return [
    'No inicia sesion en SRI.',
    'No presenta declaraciones ni anexos.',
    'No paga obligaciones automaticamente.',
    'No certifica cumplimiento oficial ni reemplaza al contador.',
    'Solo prepara evidencia, preguntas y paquetes para revision humana.',
  ];
}

export function statusFromBlockers(
  blockers: string[],
  needsReviewCount: number,
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0) {
    return 'blocked';
  }

  return needsReviewCount > 0 ? 'needs_review' : 'ready';
}

export function countEvents(
  events: EcuadorTaxComplianceEventView[],
  patterns: string[],
): number {
  return events.filter((event) =>
    patterns.some((pattern) => event.eventType.includes(pattern)),
  ).length;
}
