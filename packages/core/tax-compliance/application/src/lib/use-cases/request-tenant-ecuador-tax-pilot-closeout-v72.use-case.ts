import {
  EcuadorTaxPilotCloseoutV72View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase } from './get-tenant-ecuador-tax-accountant-collaboration-workbench-v72.use-case';
import { GetTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase } from './get-tenant-ecuador-tax-pilot-evidence-persistence-ledger-v72.use-case';
import { GetTenantEcuadorTaxPilotMultiTenantCohortV72UseCase } from './get-tenant-ecuador-tax-pilot-multi-tenant-cohort-v72.use-case';
import { GetTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase } from './get-tenant-ecuador-tax-pilot-repeated-signal-detector-v72.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxAiPilotAssistantPacketV72UseCase } from './request-tenant-ecuador-tax-ai-pilot-assistant-packet-v72.use-case';

export class RequestTenantEcuadorTaxPilotCloseoutV72UseCase {
  constructor(
    private readonly getTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase: GetTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase,
    private readonly getTenantEcuadorTaxPilotMultiTenantCohortV72UseCase: GetTenantEcuadorTaxPilotMultiTenantCohortV72UseCase,
    private readonly getTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase: GetTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase,
    private readonly getTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase: GetTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase,
    private readonly requestTenantEcuadorTaxAiPilotAssistantPacketV72UseCase: RequestTenantEcuadorTaxAiPilotAssistantPacketV72UseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxPilotCloseoutV72View> {
    const [
      evidenceLedger,
      multiTenantCohort,
      repeatedSignalDetector,
      collaborationWorkbench,
      aiAssistantPacket,
    ] = await Promise.all([
      this.getTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxPilotMultiTenantCohortV72UseCase.execute(input),
      this.getTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase.execute(
        input,
      ),
      this.requestTenantEcuadorTaxAiPilotAssistantPacketV72UseCase.execute(
        input,
      ),
    ]);
    const closeoutChecklist: EcuadorTaxPilotCloseoutV72View['closeoutChecklist'] =
      [
        check('evidence_ledger', 'Pilot evidence persistence ledger', evidenceLedger.ledgerStatus, [
          'pilot_evidence_persistence_ledger_v72',
        ]),
        check('multi_tenant_cohort', 'Pilot multi-tenant cohort', multiTenantCohort.cohortStatus, [
          'pilot_multi_tenant_cohort_v72',
        ]),
        check(
          'repeated_signal_detector',
          'Pilot repeated signal detector',
          repeatedSignalDetector.detectorStatus,
          ['pilot_repeated_signal_detector_v72'],
        ),
        check(
          'accountant_workbench',
          'Accountant collaboration workbench',
          collaborationWorkbench.workbenchStatus,
          ['accountant_collaboration_workbench_v72'],
        ),
        check('ai_assistant_packet', 'AI pilot assistant packet', aiAssistantPacket.assistantStatus, [
          'ai_pilot_assistant_packet_v72',
        ]),
      ];
    const blockers = [
      ...evidenceLedger.blockers,
      ...multiTenantCohort.blockers,
      ...repeatedSignalDetector.blockers,
      ...collaborationWorkbench.blockers,
      ...aiAssistantPacket.blockers,
    ];
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((entry) => entry.status),
      blockers,
    );
    const recommendedNextProduct =
      repeatedSignalDetector.recommendation
        .shouldOpenAccountingAdvancedDiscovery
        ? 'accounting_advanced_discovery'
        : closeoutStatus === 'blocked'
          ? 'tax_compliance_hardening'
          : 'tax_compliance_pilot_iteration';
    const recordedEvent =
      input.recordEvent === false
        ? null
        : await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
            tenantSlug: input.tenantSlug,
            period: input.period,
            year: input.year,
            eventType: 'tax_pilot_operations_closeout_v72_requested',
            source: 'tax_pilot_closeout_v72',
            payload: {
              closeoutStatus,
              recommendedNextProduct,
              records: evidenceLedger.persistedRecords.map((record) => ({
                key: record.key,
                recordType: record.recordType,
                status: record.status,
                sourceRefs: record.sourceRefs,
                summary: record.summary,
              })),
            },
          });

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      evidenceLedger,
      multiTenantCohort,
      repeatedSignalDetector,
      collaborationWorkbench,
      aiAssistantPacket,
      closeoutChecklist,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter(
          (entry) => entry.status === 'ready',
        ).length,
        blockerCount: new Set(blockers).size,
        persistedRecordCount: evidenceLedger.summary.recordCount,
        repeatedSignalCount: repeatedSignalDetector.summary.signalCount,
        assistantActionCount: aiAssistantPacket.summary.actionCount,
      },
      recommendedNextProduct,
      recordedEventId: recordedEvent?.id ?? null,
      blockers: [...new Set(blockers)],
      nextStep:
        recommendedNextProduct === 'accounting_advanced_discovery'
          ? 'Preparar discovery Accounting Advanced con evidencia repetida del piloto.'
          : closeoutStatus === 'blocked'
            ? 'Volver a hardening Tax Compliance antes de ampliar piloto.'
            : 'Continuar piloto 7.2 con memoria operativa y asistente IA controlado.',
      guardrails: [
        'Closeout 7.2 registra memoria operativa; no presenta declaraciones ni certifica libros.',
        'Accounting Advanced sigue condicionado a senales repetidas y validacion profesional.',
      ],
    };
  }
}

function check(
  key: string,
  label: string,
  status: EcuadorTaxReadinessStatus,
  evidenceRefs: string[],
): EcuadorTaxPilotCloseoutV72View['closeoutChecklist'][number] {
  return { key, label, status, evidenceRefs };
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
