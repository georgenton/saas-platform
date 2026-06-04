import { EcuadorTaxVatDeclarationDraftView } from '@saas-platform/tax-compliance-domain';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase } from './request-tenant-ecuador-tax-vat-input-output-reconciliation-packet.use-case';

export class RequestTenantEcuadorTaxVatDeclarationDraftUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase: RequestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxVatDeclarationDraftView> {
    const reconciliation =
      await this.requestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase.execute(
        { ...input, recordEvent: false },
      );
    const declarationSections =
      reconciliation.netVatByCurrency.flatMap((total) => [
        {
          key: `output_vat_${total.currency}`,
          label: `IVA causado ${total.currency}`,
          readinessStatus: reconciliation.readinessStatus,
          amountInCents: total.outputVatInCents,
          currency: total.currency,
          notes: ['Tomado de ventas/facturacion del periodo.'],
        },
        {
          key: `input_vat_${total.currency}`,
          label: `Credito tributario ${total.currency}`,
          readinessStatus:
            reconciliation.purchaseExpenseEvidenceStatus === 'ready'
              ? reconciliation.readinessStatus
              : 'needs_review',
          amountInCents: total.inputVatInCents,
          currency: total.currency,
          notes: ['Requiere soporte autorizado y validacion contable.'],
        },
        {
          key: `estimated_payable_${total.currency}`,
          label: `IVA estimado por pagar ${total.currency}`,
          readinessStatus: reconciliation.readinessStatus,
          amountInCents: total.estimatedVatPayableInCents,
          currency: total.currency,
          notes: ['Estimacion operacional; no representa formulario SRI.'],
        },
      ]);
    const view: EcuadorTaxVatDeclarationDraftView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus: reconciliation.readinessStatus,
      vatObligation: null,
      outputVatByCurrency: reconciliation.outputVatByCurrency,
      inputVatByCurrency: reconciliation.inputVatByCurrency,
      netVatByCurrency: reconciliation.netVatByCurrency,
      declarationSections,
      blockers: [...reconciliation.blockers],
      accountantQuestions: [
        ...reconciliation.accountantQuestions,
        'Los valores estimados coinciden con soportes y casilleros del formulario IVA externo?',
      ],
      nextStep:
        reconciliation.readinessStatus === 'blocked'
          ? 'Resolver blockers de ventas/compras antes de preparar borrador IVA.'
          : reconciliation.readinessStatus === 'needs_review'
            ? 'Enviar borrador IVA al contador para validar credito tributario y casilleros.'
            : 'Usar borrador IVA como soporte operacional para declaracion externa.',
      guardrails: [
        'Borrador IVA 1.0 no presenta formularios ni calcula sanciones/intereses.',
        'Casilleros oficiales, ajustes y pagos deben validarse fuera del producto o por contador.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'vat_declaration_draft_requested',
        source: 'vat_declaration_draft',
        payload: {
          readinessStatus: view.readinessStatus,
          netVatByCurrency: view.netVatByCurrency,
          blockerCount: view.blockers.length,
        },
      });
    }

    return view;
  }
}
