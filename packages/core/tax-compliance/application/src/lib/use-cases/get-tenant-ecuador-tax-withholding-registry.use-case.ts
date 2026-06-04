import { EcuadorTaxWithholdingRegistryView } from '@saas-platform/tax-compliance-domain';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase } from './request-tenant-ecuador-tax-withholding-evidence-packet.use-case';

export class GetTenantEcuadorTaxWithholdingRegistryUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxWithholdingEvidencePacketUseCase: RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
    private readonly listTenantEcuadorTaxComplianceEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxWithholdingRegistryView> {
    const [evidence, events] = await Promise.all([
      this.requestTenantEcuadorTaxWithholdingEvidencePacketUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.listTenantEcuadorTaxComplianceEventsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        limit: 100,
      }),
    ]);
    const executedDraftRows = events
      .filter((event) => event.eventType === 'withholding_draft_executed')
      .map((event) => ({
        key: `executed:${readString(event.payload.withholdingDraftId, event.id)}`,
        source: 'executed_draft' as const,
        label: readString(
          event.payload.withholdingDraftNumber,
          'Draft de retencion',
        ),
        readinessStatus: 'ready' as const,
        amountInCents: 0,
        currency: 'USD',
        supportReference: readStringOrNull(event.payload.sourceInvoiceId),
        nextStep: 'Revisar emision/autorizacion desde Invoicing.',
      }));
    const salesRows = evidence.salesCandidates.map((candidate) => ({
      key: `sale:${candidate.invoiceId}`,
      source: 'sales_candidate' as const,
      label: candidate.number,
      readinessStatus: 'needs_review' as const,
      amountInCents: candidate.taxableBaseInCents,
      currency: candidate.currency,
      supportReference: candidate.invoiceId,
      nextStep: 'Cruzar comprobante de retencion recibido o crear seguimiento.',
    }));
    const purchaseRows = evidence.purchaseCandidates.map((candidate) => ({
      key: `purchase:${candidate.evidenceId}`,
      source: 'purchase_candidate' as const,
      label: candidate.supplierName,
      readinessStatus: 'needs_review' as const,
      amountInCents: candidate.taxableBaseInCents,
      currency: candidate.currency,
      supportReference: candidate.supplierTaxpayerId,
      nextStep: 'Validar obligacion/codigo de retencion con contador.',
    }));
    const rows = [...executedDraftRows, ...salesRows, ...purchaseRows];
    const pendingSupportCount = rows.filter(
      (row) => row.source !== 'executed_draft',
    ).length;
    const readinessStatus =
      evidence.readinessStatus === 'blocked'
        ? 'blocked'
        : pendingSupportCount > 0
          ? 'needs_review'
          : 'ready';
    const view: EcuadorTaxWithholdingRegistryView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      summary: {
        salesCandidateCount: evidence.salesCandidates.length,
        purchaseCandidateCount: evidence.purchaseCandidates.length,
        executedDraftCount: executedDraftRows.length,
        pendingSupportCount,
      },
      rows,
      blockers: [...evidence.blockers],
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver blockers antes de cerrar retenciones del periodo.'
          : readinessStatus === 'needs_review'
            ? 'Completar soportes de retenciones recibidas/emitidas pendientes.'
            : 'Retenciones listas como soporte del closeout operacional.',
      guardrails: [
        'Registry consolida evidencia operacional; no reemplaza anexo ni formulario oficial.',
        'Codigos y porcentajes siguen sujetos a validacion profesional.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'withholding_registry_reviewed',
        source: 'withholding_registry',
        payload: {
          readinessStatus,
          summary: view.summary,
          blockerCount: view.blockers.length,
        },
      });
    }

    return view;
  }
}

function readString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function readStringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}
