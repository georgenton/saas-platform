import {
  EcuadorTaxOperatorActionCenterV62View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase } from './get-tenant-ecuador-tax-sri-evidence-import-persistence-ledger-v62.use-case';
import { GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase } from './get-tenant-ecuador-tax-sri-reconciliation-exception-queue-v62.use-case';
import { GetTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase } from './get-tenant-ecuador-tax-form-box-evidence-binder-v2.use-case';
import { RequestTenantEcuadorTaxAccountantPacketExportV62UseCase } from './request-tenant-ecuador-tax-accountant-packet-export-v62.use-case';
import { GetTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase } from './get-tenant-ecuador-tax-declaration-handoff-closeout-v6.use-case';

export class GetTenantEcuadorTaxOperatorActionCenterV62UseCase {
  constructor(
    private readonly getTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase: GetTenantEcuadorTaxSriEvidenceImportPersistenceLedgerV62UseCase,
    private readonly getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase: GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
    private readonly getTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase: GetTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
    private readonly requestTenantEcuadorTaxAccountantPacketExportV62UseCase: RequestTenantEcuadorTaxAccountantPacketExportV62UseCase,
    private readonly getTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase: GetTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxOperatorActionCenterV62View> {
    const [ledger, queue, binder, packet, closeout] = await Promise.all([
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
      this.getTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase.execute(
        input,
      ),
    ]);
    const actions: EcuadorTaxOperatorActionCenterV62View['actions'] = [
      action(
        'import_sri_evidence',
        'Importar/confirmar evidencia SRI',
        'sri_import',
        ledger.ledgerStatus,
        ledger.summary.persistedBatchCount === 0 ? 'high' : 'normal',
        'operator',
        ['sri_import_persistence_ledger'],
        ledger.nextStep,
      ),
      action(
        'resolve_reconciliation_exceptions',
        'Resolver excepciones SRI vs plataforma',
        'reconciliation',
        queue.queueStatus,
        queue.summary.criticalCount > 0 ? 'critical' : 'high',
        queue.summary.accountantOwnedCount > 0 ? 'accountant' : 'operator',
        queue.exceptions.map((exception) => exception.key),
        queue.nextStep,
      ),
      action(
        'review_form_boxes',
        'Revisar casilleros IVA/renta',
        'form_binder',
        binder.binderStatus,
        binder.summary.lowConfidenceCount > 0 ? 'high' : 'normal',
        binder.summary.reviewRequiredCount > 0
          ? 'accountant'
          : 'tax_compliance',
        binder.boxEvidenceContracts.map((box) => box.boxKey),
        binder.nextStep,
      ),
      action(
        'send_accountant_packet',
        'Enviar packet contador',
        'accountant_packet',
        packet.packetStatus,
        packet.summary.blockerCount > 0 ? 'critical' : 'high',
        'accountant',
        packet.packetSections.map((section) => section.key),
        packet.nextStep,
      ),
      action(
        'close_period_handoff',
        'Cerrar handoff del periodo',
        'closeout',
        closeout.closeoutStatus,
        closeout.summary.blockerCount > 0 ? 'critical' : 'normal',
        closeout.decision.accountantRequired ? 'accountant' : 'operator',
        ['declaration_handoff_closeout_v6'],
        closeout.nextStep,
      ),
    ];
    const blockers = [
      ...ledger.blockers,
      ...queue.blockers,
      ...binder.blockers,
      ...packet.blockers,
      ...closeout.blockers,
    ];
    const actionCenterStatus = resolveStatus(
      actions.map((entry) => entry.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      actionCenterStatus,
      actions,
      summary: {
        actionCount: actions.length,
        blockedActionCount: actions.filter(
          (entry) => entry.status === 'blocked',
        ).length,
        accountantActionCount: actions.filter(
          (entry) => entry.owner === 'accountant',
        ).length,
        operatorActionCount: actions.filter(
          (entry) => entry.owner === 'operator',
        ).length,
        readyActionCount: actions.filter((entry) => entry.status === 'ready')
          .length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        actionCenterStatus === 'ready'
          ? 'Operar filing asistido o piloto Tax Compliance con controles humanos.'
          : 'Atender acciones bloqueantes antes de mover el periodo a cierre.',
      guardrails: [
        'Action center ordena trabajo; no ejecuta filing, pagos o correcciones automaticas.',
        'Acciones de contador permanecen fuera de automatizacion y con evidencia trazable.',
      ],
    };
  }
}

function action(
  key: string,
  label: string,
  lane: EcuadorTaxOperatorActionCenterV62View['actions'][number]['lane'],
  status: EcuadorTaxReadinessStatus,
  priority: EcuadorTaxOperatorActionCenterV62View['actions'][number]['priority'],
  owner: EcuadorTaxOperatorActionCenterV62View['actions'][number]['owner'],
  evidenceRefs: string[],
  nextAction: string,
): EcuadorTaxOperatorActionCenterV62View['actions'][number] {
  return {
    key,
    label,
    lane,
    priority,
    status,
    owner,
    evidenceRefs,
    nextAction,
  };
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
