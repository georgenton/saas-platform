import {
  PsychologyClinicReadinessStatus,
  TenantPsychologyClinicBillingTaxBridge,
} from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class RequestTenantPsychologyClinicBillingTaxBridgeUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicBillingTaxBridge> {
    const sessions =
      (await this.operationsRepository?.listSessions(input.tenantSlug)) ?? [];
    const invoiceableItems = sessions
      .filter((session) =>
        ['confirmed', 'checked_in', 'completed'].includes(session.status),
      )
      .map((session) => ({
        sessionId: session.id,
        patientDisplayName: session.patientDisplayName,
        serviceName: session.serviceName,
        therapistName: session.therapistName,
        occurredAt: session.startsAt.toISOString(),
        partyStatus: 'needs_review' as PsychologyClinicReadinessStatus,
        invoiceDraftStatus: session.billingStatus,
        taxEvidenceStatus:
          session.status === 'completed'
            ? ('needs_review' as PsychologyClinicReadinessStatus)
            : ('blocked' as PsychologyClinicReadinessStatus),
      }));
    const blockers = invoiceableItems
      .filter(
        (item) =>
          item.invoiceDraftStatus === 'blocked' ||
          item.taxEvidenceStatus === 'blocked',
      )
      .map((item) => item.sessionId);

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      bridgeStatus:
        blockers.length > 0
          ? 'blocked'
          : invoiceableItems.length > 0
            ? 'needs_review'
            : 'needs_review',
      invoiceableItems,
      handoff: {
        invoicingProductKey: 'invoicing',
        taxComplianceProductKey: 'tax-compliance-ec',
        requiresHumanReview: true,
      },
      summary: {
        invoiceableItemCount: invoiceableItems.length,
        readyItemCount: invoiceableItems.filter(
          (item) =>
            item.partyStatus === 'ready' &&
            item.invoiceDraftStatus === 'ready' &&
            item.taxEvidenceStatus === 'ready',
        ).length,
        blockedItemCount: blockers.length,
      },
      blockers,
      nextStep:
        'Preparar party fiscal, invoice draft y evidencia tributaria revisable.',
      guardrails: psychologyGuardrails(),
    };
  }
}
