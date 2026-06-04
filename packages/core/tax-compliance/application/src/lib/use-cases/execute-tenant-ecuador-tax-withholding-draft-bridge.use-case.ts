import { EcuadorTaxWithholdingDraftExecutionPacketView } from '@saas-platform/tax-compliance-domain';
import { TaxComplianceWithholdingDraftExecutor } from '../ports/tax-compliance-withholding-draft.executor';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase } from './request-tenant-ecuador-tax-withholding-draft-bridge-packet.use-case';

export class ExecuteTenantEcuadorTaxWithholdingDraftBridgeUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase: RequestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase,
    private readonly withholdingDraftExecutor: TaxComplianceWithholdingDraftExecutor,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    candidateType?: 'sale' | 'purchase';
    candidateId?: string | null;
    taxRateId?: string | null;
    number?: string | null;
    issuedAt?: Date | null;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxWithholdingDraftExecutionPacketView> {
    const bridgePacket =
      await this.requestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase.execute(
        {
          tenantSlug: input.tenantSlug,
          period: input.period,
          year: input.year,
          candidateType: input.candidateType,
          candidateId: input.candidateId,
          taxRateId: input.taxRateId,
          recordEvent: false,
        },
      );

    if (!bridgePacket.createWithholdingDraftInput) {
      return this.buildBlockedView(input, bridgePacket);
    }

    const draftInput = bridgePacket.createWithholdingDraftInput;
    const withholdingDraft = await this.withholdingDraftExecutor.execute({
      tenantSlug: input.tenantSlug,
      sourceInvoiceId: draftInput.sourceInvoiceId,
      reason: draftInput.reason,
      amountInCents: draftInput.amountInCents,
      taxRateId: input.taxRateId ?? draftInput.taxRateId,
      number: input.number ?? draftInput.number,
      issuedAt: input.issuedAt ?? draftInput.issuedAt,
      notes: draftInput.notes,
    });
    const view: EcuadorTaxWithholdingDraftExecutionPacketView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus: 'ready',
      bridgePacket,
      withholdingDraft,
      blockers: [],
      nextStep:
        'Revisar borrador de retencion en Invoicing antes de firmar, emitir o autorizar.',
      guardrails: [
        'La ejecucion crea un borrador operativo; no firma, no envia al SRI y no autoriza automaticamente.',
        'Codigo, porcentaje y obligatoriedad de retencion deben validarse con contador.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'withholding_draft_executed',
        source: 'withholding_draft_execution_packet',
        payload: {
          readinessStatus: view.readinessStatus,
          withholdingDraftId: withholdingDraft.id,
          withholdingDraftNumber: withholdingDraft.number,
          sourceInvoiceId: withholdingDraft.sourceInvoiceId,
        },
      });
    }

    return view;
  }

  private buildBlockedView(
    input: { tenantSlug: string; period: string; year: number },
    bridgePacket: EcuadorTaxWithholdingDraftExecutionPacketView['bridgePacket'],
  ): EcuadorTaxWithholdingDraftExecutionPacketView {
    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus: 'blocked',
      bridgePacket,
      withholdingDraft: null,
      blockers: [...bridgePacket.blockers],
      nextStep:
        'Resolver blockers del bridge antes de crear el borrador de retencion en Invoicing.',
      guardrails: [
        'No se crea ningun comprobante si el bridge no tiene factura fuente valida.',
        'Compras externas siguen como evidencia para contador hasta tener documento fuente operativo.',
      ],
    };
  }
}
