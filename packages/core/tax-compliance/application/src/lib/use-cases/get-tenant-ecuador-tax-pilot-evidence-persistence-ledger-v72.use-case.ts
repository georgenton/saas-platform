import {
  EcuadorTaxComplianceEventView,
  EcuadorTaxPilotEvidencePersistenceLedgerV72View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';
import { RequestTenantEcuadorTaxPilotOperationsCloseoutV71UseCase } from './request-tenant-ecuador-tax-pilot-operations-closeout-v71.use-case';

export class GetTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase {
  constructor(
    private readonly requestTenantEcuadorTaxPilotOperationsCloseoutV71UseCase: RequestTenantEcuadorTaxPilotOperationsCloseoutV71UseCase,
    private readonly listTenantEcuadorTaxComplianceEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxPilotEvidencePersistenceLedgerV72View> {
    const [operationsCloseout, events] = await Promise.all([
      this.requestTenantEcuadorTaxPilotOperationsCloseoutV71UseCase.execute(
        input,
      ),
      this.listTenantEcuadorTaxComplianceEventsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        limit: 100,
      }),
    ]);
    const pilotEvents = events.filter(
      (event) =>
        event.eventType === 'tax_pilot_operations_closeout_v72_requested',
    );
    const eventRecords = pilotEvents.flatMap((event) =>
      recordsFromEvent(event, operationsCloseout.generatedAt),
    );
    const derivedRecords = derivedRecordsFromCloseout(operationsCloseout);
    const persistedRecords =
      eventRecords.length > 0 ? eventRecords : derivedRecords;
    const blockers = [
      ...operationsCloseout.blockers,
      ...persistedRecords
        .filter((record) => record.status === 'blocked')
        .map((record) => `tax_pilot_record.${record.key}.blocked`),
    ];
    const ledgerStatus = resolveStatus(
      persistedRecords.map((record) => record.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      ledgerStatus,
      operationsCloseout,
      persistedRecords,
      summary: {
        recordCount: persistedRecords.length,
        persistedEventCount: pilotEvents.length,
        derivedRecordCount:
          eventRecords.length > 0 ? 0 : derivedRecords.length,
        blockedRecordCount: persistedRecords.filter(
          (record) => record.status === 'blocked',
        ).length,
        accountingGateRecordCount: persistedRecords.filter(
          (record) => record.recordType === 'accounting_gate',
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        eventRecords.length > 0
          ? 'Usar memoria persistida del piloto para comparar periodos y cohortes.'
          : 'Registrar closeout 7.2 para convertir vistas piloto en memoria operativa.',
      guardrails: [
        'El ledger 7.2 persiste aprendizaje operativo; no presenta ni certifica declaraciones.',
        'Los registros derivados mantienen continuidad hasta que exista evento de closeout 7.2.',
      ],
    };
  }
}

function recordsFromEvent(
  event: EcuadorTaxComplianceEventView,
  fallbackDate: Date,
): EcuadorTaxPilotEvidencePersistenceLedgerV72View['persistedRecords'] {
  const payload = event.payload as {
    records?: Array<{
      key?: string;
      recordType?: EcuadorTaxPilotEvidencePersistenceLedgerV72View['persistedRecords'][number]['recordType'];
      status?: EcuadorTaxReadinessStatus;
      sourceRefs?: string[];
      summary?: string;
    }>;
  };

  return (payload.records ?? []).map((record, index) => ({
    key: record.key ?? `${event.id}_${index}`,
    recordType: record.recordType ?? 'closeout',
    status: record.status ?? 'needs_review',
    sourceEventId: event.id,
    sourceRefs: record.sourceRefs ?? [event.source],
    summary: record.summary ?? 'Registro persistido desde closeout piloto 7.2.',
    persistedAt: event.occurredAt ?? fallbackDate,
  }));
}

function derivedRecordsFromCloseout(
  closeout: EcuadorTaxPilotEvidencePersistenceLedgerV72View['operationsCloseout'],
): EcuadorTaxPilotEvidencePersistenceLedgerV72View['persistedRecords'] {
  return [
    {
      key: 'derived_cohort_registry_v71',
      recordType: 'cohort',
      status: closeout.cohortRegistry.registryStatus,
      sourceEventId: null,
      sourceRefs: ['pilot_cohort_registry_v71'],
      summary: `${closeout.cohortRegistry.summary.memberCount} tenant piloto en ${closeout.period}.`,
      persistedAt: closeout.generatedAt,
    },
    {
      key: 'derived_feedback_analytics_v71',
      recordType: 'feedback',
      status: closeout.analyticsDashboard.dashboardStatus,
      sourceEventId: null,
      sourceRefs: ['pilot_feedback_analytics_dashboard_v71'],
      summary: `${closeout.analyticsDashboard.summary.criticalFeedbackCount} feedback critico.`,
      persistedAt: closeout.generatedAt,
    },
    {
      key: 'derived_accountant_sla_v71',
      recordType: 'sla',
      status: closeout.slaTracker.trackerStatus,
      sourceEventId: null,
      sourceRefs: ['accountant_collaboration_sla_tracker_v71'],
      summary: `${closeout.slaTracker.summary.overdueCount} SLA vencidos.`,
      persistedAt: closeout.generatedAt,
    },
    {
      key: 'derived_learning_backlog_v71',
      recordType: 'learning',
      status: closeout.learningBacklog.backlogStatus,
      sourceEventId: null,
      sourceRefs: ['pilot_learning_backlog_v71'],
      summary: `${closeout.learningBacklog.summary.itemCount} aprendizajes piloto.`,
      persistedAt: closeout.generatedAt,
    },
    {
      key: 'derived_accounting_gate_v71',
      recordType: 'accounting_gate',
      status: closeout.accountingAdvancedGate.gateStatus,
      sourceEventId: null,
      sourceRefs: ['accounting_advanced_evidence_gate_v71'],
      summary: closeout.accountingAdvancedGate.recommendation.reason,
      persistedAt: closeout.generatedAt,
    },
    {
      key: 'derived_operations_closeout_v71',
      recordType: 'closeout',
      status: closeout.closeoutStatus,
      sourceEventId: null,
      sourceRefs: ['pilot_operations_closeout_v71'],
      summary: closeout.nextStep,
      persistedAt: closeout.generatedAt,
    },
  ];
}

function resolveStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
