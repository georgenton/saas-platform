import { TenantAccountingPeriodCloseoutTimelineView } from '@saas-platform/accounting-domain';
import { GetTenantAccountingAuditTrailWorkspaceUseCase } from './get-tenant-accounting-audit-trail-workspace.use-case';
import { ListTenantAccountingCorrectionsQueueUseCase } from './list-tenant-accounting-corrections-queue.use-case';
import { ListTenantAccountingEvidenceAttachmentRegistryUseCase } from './list-tenant-accounting-evidence-attachment-registry.use-case';
import { ListTenantAccountingExternalCloseoutRecordsUseCase } from './list-tenant-accounting-external-closeout-records.use-case';

export class GetTenantAccountingPeriodCloseoutTimelineUseCase {
  constructor(
    private readonly getTenantAccountingAuditTrailWorkspaceUseCase: GetTenantAccountingAuditTrailWorkspaceUseCase,
    private readonly listTenantAccountingCorrectionsQueueUseCase: ListTenantAccountingCorrectionsQueueUseCase,
    private readonly listTenantAccountingEvidenceAttachmentRegistryUseCase: ListTenantAccountingEvidenceAttachmentRegistryUseCase,
    private readonly listTenantAccountingExternalCloseoutRecordsUseCase: ListTenantAccountingExternalCloseoutRecordsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingPeriodCloseoutTimelineView> {
    const [auditTrail, correctionsQueue, evidenceRegistry, externalRecords] =
      await Promise.all([
        this.getTenantAccountingAuditTrailWorkspaceUseCase.execute(input),
        this.listTenantAccountingCorrectionsQueueUseCase.execute(input),
        this.listTenantAccountingEvidenceAttachmentRegistryUseCase.execute(
          input,
        ),
        this.listTenantAccountingExternalCloseoutRecordsUseCase.execute(input),
      ]);
    const correctionEvents: TenantAccountingPeriodCloseoutTimelineView['events'] =
      correctionsQueue.corrections.map((correction) => ({
        eventKey: `correction:${correction.id}`,
        eventType: 'accounting_correction_recorded',
        source: 'corrections_queue',
        status: correction.status,
        actorEmail: correction.ownerEmail,
        occurredAt: correction.updatedAt,
        summary: correction.title,
        metadata: {
          correctionId: correction.id,
          source: correction.source,
          severity: correction.severity,
        },
      }));
    const evidenceEvents: TenantAccountingPeriodCloseoutTimelineView['events'] =
      evidenceRegistry.attachments.map((attachment) => ({
        eventKey: `evidence:${attachment.id}`,
        eventType: 'accounting_evidence_attached',
        source: 'evidence_attachment_registry',
        status: attachment.status,
        actorEmail: attachment.ownerEmail,
        occurredAt: attachment.updatedAt,
        summary: attachment.label,
        metadata: {
          attachmentId: attachment.id,
          attachmentType: attachment.attachmentType,
          reference: attachment.reference,
        },
      }));
    const externalEvents: TenantAccountingPeriodCloseoutTimelineView['events'] =
      externalRecords.map((record) => ({
        eventKey: `external-closeout:${record.id}`,
        eventType: 'external_professional_closeout_recorded',
        source: 'external_closeout_record',
        status: record.status,
        actorEmail: record.confirmedByEmail,
        occurredAt: record.confirmedAt ?? record.updatedAt,
        summary: `Cierre externo: ${record.accountantName}`,
        metadata: {
          recordId: record.id,
          accountantName: record.accountantName,
          evidenceReference: record.evidenceReference,
        },
      }));
    const events = [
      ...auditTrail.timeline,
      ...correctionEvents,
      ...evidenceEvents,
      ...externalEvents,
    ].sort((left, right) => left.occurredAt.getTime() - right.occurredAt.getTime());
    const blockers = [
      ...auditTrail.blockers,
      ...correctionsQueue.blockers,
      ...evidenceRegistry.blockers,
    ];
    const timelineStatus =
      events.length === 0
        ? 'empty'
        : blockers.length > 0 ||
            correctionsQueue.summary.openCount > 0 ||
            correctionsQueue.summary.inProgressCount > 0
          ? 'needs_review'
          : 'ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      timelineStatus,
      events,
      summary: {
        eventCount: events.length,
        journalEventCount: auditTrail.summary.journalEventCount,
        controlEventCount: auditTrail.summary.controlEventCount,
        correctionEventCount: correctionEvents.length,
        evidenceEventCount: evidenceEvents.length,
        externalCloseoutEventCount: externalEvents.length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        timelineStatus === 'ready'
          ? 'Usar timeline como bitacora consolidada del cierre.'
          : 'Resolver eventos pendientes antes de cerrar el periodo.',
      guardrails: [
        'Timeline consolida eventos internos y registros externos capturados; no es auditoria certificada.',
        'No modifica journals, controles ni evidencias.',
      ],
    };
  }
}
