import {
  EcuadorTaxVatDeclarationReadinessPacketView,
  EcuadorTaxVatDeclarationReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxObligationCalendarUseCase } from './get-tenant-ecuador-tax-obligation-calendar.use-case';
import { GetTenantEcuadorTaxReconciliationWorkspaceUseCase } from './get-tenant-ecuador-tax-reconciliation-workspace.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxSalesBookUseCase } from './request-tenant-ecuador-tax-sales-book.use-case';

export class RequestTenantEcuadorTaxVatDeclarationReadinessPacketUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxSalesBookUseCase: RequestTenantEcuadorTaxSalesBookUseCase,
    private readonly getTenantEcuadorTaxReconciliationWorkspaceUseCase: GetTenantEcuadorTaxReconciliationWorkspaceUseCase,
    private readonly getTenantEcuadorTaxObligationCalendarUseCase: GetTenantEcuadorTaxObligationCalendarUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxVatDeclarationReadinessPacketView> {
    const [salesBook, reconciliation, calendar] = await Promise.all([
      this.requestTenantEcuadorTaxSalesBookUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxReconciliationWorkspaceUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxObligationCalendarUseCase.execute(
        input.tenantSlug,
        input.year,
      ),
    ]);
    const vatObligation =
      calendar.entries.find(
        (entry) => entry.obligationKey === 'vat' && entry.period === input.period,
      ) ?? null;
    const blockers = [
      ...reconciliation.blockers,
      ...(vatObligation?.readinessStatus === 'blocked'
        ? ['vat_obligation.calendar_blocked']
        : []),
      ...(vatObligation ? [] : ['vat_obligation.not_scheduled_for_period']),
    ];
    const readinessStatus = resolveReadinessStatus({
      blockers,
      reconciliationStatus: reconciliation.status,
      vatObligationStatus: vatObligation?.readinessStatus ?? 'blocked',
    });
    const vatSummaryByCurrency = salesBook.totalsByCurrency.map((total) => ({
      currency: total.currency,
      taxableBaseInCents: total.subtotalInCents,
      vatInCents: total.taxInCents,
      documentCount: total.documentCount,
    }));
    const accountantQuestions = [
      reconciliation.status !== 'reconciled'
        ? 'Que ajustes necesita el periodo antes de declarar IVA?'
        : null,
      salesBook.ecommerceEvidence.readyToInvoiceCount >
      salesBook.documentRows.length
        ? 'Existen ventas ecommerce listas para facturar que deban incluirse en el periodo?'
        : null,
      salesBook.ecommerceEvidence.disputedPaymentEventCount > 0
        ? 'Las disputas de pago abiertas modifican base imponible o reconocimiento del periodo?'
        : null,
      vatObligation?.dueDate
        ? `Confirmar fecha limite operacional estimada: ${vatObligation.dueDate}.`
        : 'Confirmar fecha limite de IVA porque el calendario no pudo derivarla.',
    ].filter((question): question is string => question !== null);

    const view: EcuadorTaxVatDeclarationReadinessPacketView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      reconciliationStatus: reconciliation.status,
      vatObligation,
      salesTotalsByCurrency: salesBook.totalsByCurrency,
      vatSummaryByCurrency,
      blockers: [...new Set(blockers)],
      accountantQuestions,
      supportChecklist: [
        'Libro de ventas del periodo generado y revisado.',
        'Conciliacion ecommerce-invoicing-parties sin diferencias bloqueantes.',
        'Revision o preguntas del contador asociadas al periodo.',
        'Evidencia de autorizaciones electronicas y datos fiscales de terceros.',
        'Confirmacion humana antes de declarar fuera de la plataforma.',
      ],
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver blockers antes de preparar declaracion IVA.'
          : readinessStatus === 'needs_review'
            ? 'Enviar preguntas y soporte al contador para revision IVA.'
            : 'Entregar packet IVA al contador o responsable tributario para aprobacion.',
      guardrails: [
        'Este packet prepara soporte IVA; no calcula formulario oficial ni presenta al SRI.',
        'El IVA detectado proviene del libro de ventas derivado de facturacion.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'vat_readiness_packet_requested',
        source: 'vat_declaration_readiness_packet',
        payload: {
          readinessStatus,
          reconciliationStatus: reconciliation.status,
          blockerCount: view.blockers.length,
          vatSummaryByCurrency,
        },
      });
    }

    return view;
  }
}

function resolveReadinessStatus(input: {
  blockers: string[];
  reconciliationStatus: string;
  vatObligationStatus: string;
}): EcuadorTaxVatDeclarationReadinessStatus {
  if (input.blockers.length > 0 || input.vatObligationStatus === 'blocked') {
    return 'blocked';
  }

  if (
    input.reconciliationStatus === 'needs_review' ||
    input.vatObligationStatus === 'needs_review'
  ) {
    return 'needs_review';
  }

  return 'ready_for_accountant';
}
