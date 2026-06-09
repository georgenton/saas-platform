import {
  EcuadorTaxOperationalHardeningCloseoutV62View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase } from './get-tenant-ecuador-tax-sri-evidence-import-persistence-ledger-v62.use-case';
import { GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase } from './get-tenant-ecuador-tax-sri-reconciliation-exception-queue-v62.use-case';
import { GetTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase } from './get-tenant-ecuador-tax-form-box-evidence-binder-v2.use-case';
import { RequestTenantEcuadorTaxAccountantPacketExportV62UseCase } from './request-tenant-ecuador-tax-accountant-packet-export-v62.use-case';
import { GetTenantEcuadorTaxOperatorActionCenterV62UseCase } from './get-tenant-ecuador-tax-operator-action-center-v62.use-case';

export class RequestTenantEcuadorTaxOperationalHardeningCloseoutV62UseCase {
  constructor(
    private readonly getTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase: GetTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase,
    private readonly getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase: GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
    private readonly getTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase: GetTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
    private readonly requestTenantEcuadorTaxAccountantPacketExportV62UseCase: RequestTenantEcuadorTaxAccountantPacketExportV62UseCase,
    private readonly getTenantEcuadorTaxOperatorActionCenterV62UseCase: GetTenantEcuadorTaxOperatorActionCenterV62UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxOperationalHardeningCloseoutV62View> {
    const [
      importLedger,
      exceptionQueue,
      formBinder,
      accountantPacket,
      actionCenter,
    ] = await Promise.all([
      this.getTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase.execute(input),
      this.requestTenantEcuadorTaxAccountantPacketExportV62UseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxOperatorActionCenterV62UseCase.execute(input),
    ]);
    const closeoutChecklist = [
      check(
        'import_ledger',
        'Ledger importaciones SRI',
        importLedger.ledgerStatus,
        ['sri_import_persistence_ledger'],
      ),
      check(
        'exception_queue',
        'Queue excepciones',
        exceptionQueue.queueStatus,
        ['sri_reconciliation_exception_queue'],
      ),
      check('form_binder', 'Binder casilleros 2.0', formBinder.binderStatus, [
        'form_box_evidence_binder_v2',
      ]),
      check(
        'accountant_packet',
        'Packet contador',
        accountantPacket.packetStatus,
        ['accountant_packet_export_v62'],
      ),
      check(
        'action_center',
        'Action center operador',
        actionCenter.actionCenterStatus,
        ['operator_action_center_v62'],
      ),
    ];
    const blockers = [
      ...importLedger.blockers,
      ...exceptionQueue.blockers,
      ...formBinder.blockers,
      ...accountantPacket.blockers,
      ...actionCenter.blockers,
    ];
    const closeoutStatus = resolveStatus(
      closeoutChecklist.map((entry) => entry.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      importLedger,
      exceptionQueue,
      formBinder,
      accountantPacket,
      actionCenter,
      closeoutChecklist,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter(
          (entry) => entry.status === 'ready',
        ).length,
        blockerCount: new Set(blockers).size,
        actionCount: actionCenter.summary.actionCount,
        accountantQuestionCount: accountantPacket.summary.questionCount,
      },
      recommendedNextProduct:
        closeoutStatus === 'ready'
          ? 'tax_compliance_operational_pilot'
          : accountantPacket.closeout.decision.openAdvancedAccountingNow
            ? 'accounting_advanced_discovery'
            : 'medical_clinics_activation',
      blockers: [...new Set(blockers)],
      nextStep:
        closeoutStatus === 'ready'
          ? 'Tax Compliance EC puede entrar a piloto operativo Ecuador con contador en el loop.'
          : 'Cerrar blockers 6.2 antes de graduar producto o abrir otro frente mayor.',
      guardrails: [
        'Closeout 6.2 valida operacion, packet y acciones; no certifica cumplimiento.',
        'El siguiente producto debe abrirse solo despues de mantener controles humanos del periodo.',
      ],
    };
  }
}

function check(
  key: string,
  label: string,
  status: EcuadorTaxReadinessStatus,
  evidenceRefs: string[],
): EcuadorTaxOperationalHardeningCloseoutV62View['closeoutChecklist'][number] {
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
