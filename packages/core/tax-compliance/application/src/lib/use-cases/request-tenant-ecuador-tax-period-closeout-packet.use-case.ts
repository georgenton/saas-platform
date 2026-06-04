import {
  EcuadorTaxComplianceEventType,
  EcuadorTaxPeriodCloseoutPacketView,
  EcuadorTaxPeriodCloseoutStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPeriodWorkspaceUseCase } from './get-tenant-ecuador-tax-period-workspace.use-case';
import { GetTenantEcuadorTaxReconciliationWorkspaceUseCase } from './get-tenant-ecuador-tax-reconciliation-workspace.use-case';
import { ListTenantEcuadorTaxAccountantReviewsUseCase } from './list-tenant-ecuador-tax-accountant-reviews.use-case';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxDeclarationApprovalPacketUseCase } from './request-tenant-ecuador-tax-declaration-approval-packet.use-case';
import { RequestTenantEcuadorTaxSalesBookUseCase } from './request-tenant-ecuador-tax-sales-book.use-case';
import { RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase } from './request-tenant-ecuador-tax-vat-declaration-readiness-packet.use-case';

const REQUIRED_CLOSEOUT_EVENTS: EcuadorTaxComplianceEventType[] = [
  'tax_sales_book_generated',
  'tax_reconciliation_reviewed',
  'vat_readiness_packet_requested',
  'accountant_review_transitioned',
];

export class RequestTenantEcuadorTaxPeriodCloseoutPacketUseCase {
  constructor(
    private readonly getTenantEcuadorTaxPeriodWorkspaceUseCase: GetTenantEcuadorTaxPeriodWorkspaceUseCase,
    private readonly requestTenantEcuadorTaxSalesBookUseCase: RequestTenantEcuadorTaxSalesBookUseCase,
    private readonly getTenantEcuadorTaxReconciliationWorkspaceUseCase: GetTenantEcuadorTaxReconciliationWorkspaceUseCase,
    private readonly requestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase: RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase,
    private readonly listTenantEcuadorTaxAccountantReviewsUseCase: ListTenantEcuadorTaxAccountantReviewsUseCase,
    private readonly requestTenantEcuadorTaxDeclarationApprovalPacketUseCase: RequestTenantEcuadorTaxDeclarationApprovalPacketUseCase,
    private readonly listTenantEcuadorTaxComplianceEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxPeriodCloseoutPacketView> {
    const [
      workspace,
      salesBook,
      reconciliation,
      vatReadiness,
      accountantReviews,
      approvalPacket,
      events,
    ] = await Promise.all([
      this.getTenantEcuadorTaxPeriodWorkspaceUseCase.execute(input),
      this.requestTenantEcuadorTaxSalesBookUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxReconciliationWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.listTenantEcuadorTaxAccountantReviewsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
      }),
      this.requestTenantEcuadorTaxDeclarationApprovalPacketUseCase.execute(input),
      this.listTenantEcuadorTaxComplianceEventsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        limit: 100,
      }),
    ]);
    const presentEventTypes = new Set(events.map((event) => event.eventType));
    const latestAccountantReview = accountantReviews[0] ?? null;
    const ledgerCompleteness = {
      requiredEventTypes: REQUIRED_CLOSEOUT_EVENTS,
      presentEventTypes: REQUIRED_CLOSEOUT_EVENTS.filter((eventType) =>
        presentEventTypes.has(eventType),
      ),
      missingEventTypes: REQUIRED_CLOSEOUT_EVENTS.filter(
        (eventType) => !presentEventTypes.has(eventType),
      ),
    };
    const blockers = [
      ...workspace.blockers,
      ...salesBook.blockers,
      ...reconciliation.blockers,
      ...vatReadiness.blockers,
      ...approvalPacket.remainingBlockers,
    ];
    const closeoutStatus = resolveCloseoutStatus({
      blockers,
      workspaceStatus: workspace.status,
      reconciliationStatus: reconciliation.status,
      vatReadinessStatus: vatReadiness.readinessStatus,
      approvalReadiness: approvalPacket.approvalReadiness,
      missingEventCount: ledgerCompleteness.missingEventTypes.length,
    });
    const view: EcuadorTaxPeriodCloseoutPacketView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      workspaceStatus: workspace.status,
      salesBookStatus: salesBook.readinessStatus,
      reconciliationStatus: reconciliation.status,
      vatReadinessStatus: vatReadiness.readinessStatus,
      latestAccountantReview,
      approvalReadiness: approvalPacket.approvalReadiness,
      ledgerCompleteness,
      closeoutChecklist: [
        'Libro de ventas generado y sin blockers.',
        'Conciliacion ecommerce-invoicing-parties revisada.',
        'Packet IVA listo para contador o responsable tributario.',
        'Revision de contador aprobada o decision humana documentada.',
        'Eventos minimos del ledger presentes antes de cerrar el periodo.',
      ],
      blockers: [...new Set(blockers)],
      nextStep:
        closeoutStatus === 'blocked'
          ? 'Resolver blockers tributarios antes de cerrar el periodo.'
          : closeoutStatus === 'needs_review'
            ? 'Completar revision humana y eventos faltantes antes del cierre operativo.'
            : closeoutStatus === 'ready_for_accountant'
              ? 'Enviar packet de cierre al contador para aprobacion final.'
              : 'Mantener evidencia y proceder con presentacion externa bajo aprobacion humana.',
      guardrails: [
        'El closeout es un cierre operacional interno; no equivale a declaracion presentada.',
        'La presentacion, pago y firma ante SRI deben permanecer fuera de este workflow hasta integrar un producto contable/fiscal completo.',
      ],
    };

    await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      eventType: 'period_closeout_packet_requested',
      source: 'period_closeout_packet',
      payload: {
        closeoutStatus,
        workspaceStatus: workspace.status,
        reconciliationStatus: reconciliation.status,
        vatReadinessStatus: vatReadiness.readinessStatus,
        missingEventTypes: ledgerCompleteness.missingEventTypes,
        blockerCount: view.blockers.length,
      },
    });

    return view;
  }
}

function resolveCloseoutStatus(input: {
  blockers: string[];
  workspaceStatus: string;
  reconciliationStatus: string;
  vatReadinessStatus: string;
  approvalReadiness: string;
  missingEventCount: number;
}): EcuadorTaxPeriodCloseoutStatus {
  if (
    input.blockers.length > 0 ||
    input.workspaceStatus === 'blocked' ||
    input.vatReadinessStatus === 'blocked'
  ) {
    return 'blocked';
  }

  if (
    input.reconciliationStatus === 'needs_review' ||
    input.vatReadinessStatus === 'needs_review' ||
    input.missingEventCount > 0
  ) {
    return 'needs_review';
  }

  return input.approvalReadiness === 'ready_for_human_approval'
    ? 'ready_for_external_filing'
    : 'ready_for_accountant';
}
