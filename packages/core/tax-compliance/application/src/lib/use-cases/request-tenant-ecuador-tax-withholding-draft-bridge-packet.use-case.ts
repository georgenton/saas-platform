import { EcuadorTaxWithholdingDraftBridgePacketView } from '@saas-platform/tax-compliance-domain';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase } from './request-tenant-ecuador-tax-withholding-evidence-packet.use-case';

export class RequestTenantEcuadorTaxWithholdingDraftBridgePacketUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxWithholdingEvidencePacketUseCase: RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
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
    recordEvent?: boolean;
  }): Promise<EcuadorTaxWithholdingDraftBridgePacketView> {
    const evidencePacket =
      await this.requestTenantEcuadorTaxWithholdingEvidencePacketUseCase.execute(
        {
          tenantSlug: input.tenantSlug,
          period: input.period,
          year: input.year,
          recordEvent: false,
        },
      );
    const requestedType = input.candidateType ?? 'sale';
    const selectedSale =
      requestedType === 'sale'
        ? (evidencePacket.salesCandidates.find((candidate) =>
            input.candidateId
              ? candidate.invoiceId === input.candidateId
              : true,
          ) ?? null)
        : null;
    const selectedPurchase =
      requestedType === 'purchase'
        ? (evidencePacket.purchaseCandidates.find((candidate) =>
            input.candidateId
              ? candidate.evidenceId === input.candidateId
              : true,
          ) ?? null)
        : null;
    const selectedCandidate = selectedSale
      ? {
          candidateType: 'sale' as const,
          candidateId: selectedSale.invoiceId,
          label: selectedSale.number,
          currency: selectedSale.currency,
          taxableBaseInCents: selectedSale.taxableBaseInCents,
          vatInCents: selectedSale.vatInCents,
          candidateReason: selectedSale.candidateReason,
        }
      : selectedPurchase
        ? {
            candidateType: 'purchase' as const,
            candidateId: selectedPurchase.evidenceId,
            label: selectedPurchase.supplierName,
            currency: selectedPurchase.currency,
            taxableBaseInCents: selectedPurchase.taxableBaseInCents,
            vatInCents: selectedPurchase.vatInCents,
            candidateReason: selectedPurchase.candidateReason,
          }
        : null;
    const blockers = [
      ...evidencePacket.blockers,
      ...(selectedCandidate ? [] : ['withholding_bridge.candidate_not_found']),
      ...(selectedCandidate?.candidateType === 'purchase'
        ? ['withholding_bridge.purchase_candidate_requires_invoicing_source']
        : []),
    ];
    const createWithholdingDraftInput =
      selectedSale && blockers.length === 0
        ? {
            sourceInvoiceId: selectedSale.invoiceId,
            reason: `Retencion preparada desde Tax Compliance ${input.period}`,
            amountInCents: Math.max(1, selectedSale.taxableBaseInCents),
            taxRateId: input.taxRateId?.trim() || null,
            number: null,
            issuedAt: null,
            notes:
              'Bridge operativo: revisar codigo y porcentaje con contador antes de emitir.',
          }
        : null;
    const readinessStatus = blockers.length > 0 ? 'blocked' : 'ready';
    const view: EcuadorTaxWithholdingDraftBridgePacketView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      source: 'withholding_evidence_packet',
      selectedCandidate,
      createWithholdingDraftInput,
      bridgeChecklist: [
        'Confirmar que la factura fuente corresponde al comprobante de retencion.',
        'Validar codigo y porcentaje con contador antes de emitir documento oficial.',
        'Usar Invoicing para numeracion, XML, RIDE y autorizacion cuando aplique.',
      ],
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'ready'
          ? 'Crear borrador de retencion en Invoicing con el input sugerido.'
          : 'Resolver blockers antes de preparar el borrador de retencion.',
      guardrails: [
        'Este bridge prepara input operativo; no emite ni autoriza comprobantes automaticamente.',
        'Compras sin factura fuente en Invoicing quedan como evidencia para revision, no como draft automático.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'withholding_draft_bridge_requested',
        source: 'withholding_draft_bridge_packet',
        payload: {
          readinessStatus,
          candidateType: selectedCandidate?.candidateType ?? requestedType,
          candidateId:
            selectedCandidate?.candidateId ?? input.candidateId ?? null,
          blockerCount: view.blockers.length,
          hasCreateWithholdingDraftInput: Boolean(createWithholdingDraftInput),
        },
      });
    }

    return view;
  }
}
