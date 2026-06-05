import {
  EcuadorTaxReadinessStatus,
  EcuadorTaxReviewAssistantPacketView,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAnnexesReadinessUseCase } from './get-tenant-ecuador-tax-annexes-readiness.use-case';
import { GetTenantEcuadorTaxFilingHandoffUseCase } from './get-tenant-ecuador-tax-filing-handoff.use-case';
import { GetTenantEcuadorTaxOperationalCloseoutUseCase } from './get-tenant-ecuador-tax-operational-closeout.use-case';
import { GetTenantEcuadorTaxPeriodEvidenceVaultUseCase } from './get-tenant-ecuador-tax-period-evidence-vault.use-case';
import { GetTenantEcuadorTaxVatDeclarationApprovalUseCase } from './get-tenant-ecuador-tax-vat-declaration-approval.use-case';
import { GetTenantEcuadorTaxWithholdingRegistryUseCase } from './get-tenant-ecuador-tax-withholding-registry.use-case';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxAccountingBridgePreviewUseCase } from './request-tenant-ecuador-tax-accounting-bridge-preview.use-case';
import { RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase } from './request-tenant-ecuador-tax-income-tax-evidence-packet.use-case';

export class RequestTenantEcuadorTaxReviewAssistantPacketUseCase {
  constructor(
    private readonly getTenantEcuadorTaxVatDeclarationApprovalUseCase: GetTenantEcuadorTaxVatDeclarationApprovalUseCase,
    private readonly getTenantEcuadorTaxWithholdingRegistryUseCase: GetTenantEcuadorTaxWithholdingRegistryUseCase,
    private readonly getTenantEcuadorTaxPeriodEvidenceVaultUseCase: GetTenantEcuadorTaxPeriodEvidenceVaultUseCase,
    private readonly getTenantEcuadorTaxOperationalCloseoutUseCase: GetTenantEcuadorTaxOperationalCloseoutUseCase,
    private readonly getTenantEcuadorTaxFilingHandoffUseCase: GetTenantEcuadorTaxFilingHandoffUseCase,
    private readonly getTenantEcuadorTaxAnnexesReadinessUseCase: GetTenantEcuadorTaxAnnexesReadinessUseCase,
    private readonly requestTenantEcuadorTaxAccountingBridgePreviewUseCase: RequestTenantEcuadorTaxAccountingBridgePreviewUseCase,
    private readonly requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase: RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
    private readonly listTenantEcuadorTaxComplianceEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxReviewAssistantPacketView> {
    const [
      vatApproval,
      withholdingRegistry,
      evidenceVault,
      operationalCloseout,
      filingHandoff,
      annexesReadiness,
      accountingBridgePreview,
      incomeTaxEvidence,
      events,
    ] = await Promise.all([
      this.getTenantEcuadorTaxVatDeclarationApprovalUseCase.execute(input),
      this.getTenantEcuadorTaxWithholdingRegistryUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxPeriodEvidenceVaultUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxOperationalCloseoutUseCase.execute(input),
      this.getTenantEcuadorTaxFilingHandoffUseCase.execute(input),
      this.getTenantEcuadorTaxAnnexesReadinessUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxAccountingBridgePreviewUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.listTenantEcuadorTaxComplianceEventsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        limit: 100,
      }),
    ]);
    const blockers = [
      ...vatApproval.blockers.map((blocker) => `vat.${blocker}`),
      ...withholdingRegistry.blockers.map((blocker) => `withholding.${blocker}`),
      ...evidenceVault.missingItems.map((item) => `vault.${item}`),
      ...operationalCloseout.blockers.map((blocker) => `closeout.${blocker}`),
      ...filingHandoff.blockers.map((blocker) => `filing.${blocker}`),
      ...annexesReadiness.blockers.map((blocker) => `annexes.${blocker}`),
      ...accountingBridgePreview.blockers.map((blocker) => `accounting.${blocker}`),
      ...incomeTaxEvidence.blockers.map((blocker) => `income_tax.${blocker}`),
    ];
    const riskSignals = [
      ...buildRiskSignals('vat', vatApproval.status, vatApproval.blockers.length),
      ...buildRiskSignals(
        'withholding',
        withholdingRegistry.readinessStatus,
        withholdingRegistry.summary.pendingSupportCount,
      ),
      ...buildRiskSignals('vault', evidenceVault.readinessStatus, evidenceVault.missingItems.length),
      ...buildRiskSignals('annexes', annexesReadiness.readinessStatus, annexesReadiness.blockers.length),
      ...buildRiskSignals(
        'accounting_bridge',
        accountingBridgePreview.readinessStatus,
        accountingBridgePreview.summary.requiresChartOfAccountsCount,
      ),
      ...(filingHandoff.status === 'paid_externally'
        ? []
        : [
            {
              key: 'filing_handoff_pending',
              severity: 'high' as const,
              label: 'Presentacion/pago externo pendiente',
              detail: filingHandoff.nextStep,
              source: 'filing_handoff',
            },
          ]),
    ];
    const readinessStatus = resolveReadinessStatus(blockers, riskSignals.length);
    const accountantQuestions = [
      ...vatApproval.draft.accountantQuestions,
      ...incomeTaxEvidence.accountantQuestions,
      'Los anexos aplicables tienen soporte suficiente para preparacion externa?',
      'El closeout y el handoff externo tienen evidencia conservable para auditoria?',
    ];
    const suggestedActions = [
      ...riskSignals.slice(0, 5).map((signal) => ({
        key: `resolve_${signal.key}`,
        label: signal.detail,
        owner: signal.source === 'accounting_bridge' ? ('accountant' as const) : ('operator' as const),
        priority: signal.severity,
        source: signal.source,
      })),
      {
        key: 'review_closeout_report',
        label: 'Revisar reporte final del periodo antes de cerrar el ciclo.',
        owner: 'accountant' as const,
        priority: 'normal' as const,
        source: 'period_closeout_report',
      },
    ];
    const view: EcuadorTaxReviewAssistantPacketView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      executiveSummary:
        readinessStatus === 'blocked'
          ? `Periodo ${input.period} tiene ${blockers.length} blockers antes de cierre tributario.`
          : readinessStatus === 'needs_review'
            ? `Periodo ${input.period} esta listo para revision profesional con ${riskSignals.length} senales.`
            : `Periodo ${input.period} esta operacionalmente listo para cierre y conservacion de evidencia.`,
      riskSignals,
      accountantQuestions: [...new Set(accountantQuestions)],
      suggestedActions,
      contextSnapshot: {
        vatApprovalStatus: vatApproval.status,
        operationalCloseoutStatus: operationalCloseout.status,
        filingHandoffStatus: filingHandoff.status,
        annexesReadinessStatus: annexesReadiness.readinessStatus,
        accountingBridgeReadinessStatus: accountingBridgePreview.readinessStatus,
        evidenceVaultStatus: evidenceVault.readinessStatus,
        eventCount: events.length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver blockers antes de usar el asistente como handoff final.'
          : 'Usar preguntas y acciones sugeridas para la revision humana del periodo.',
      guardrails: [
        'El asistente explica evidencia y riesgos; no presenta declaraciones ni anexos.',
        'Las recomendaciones requieren validacion del contador o responsable tributario.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_review_assistant_packet_requested',
        source: 'tax_review_assistant',
        payload: {
          readinessStatus,
          riskSignalCount: riskSignals.length,
          blockerCount: view.blockers.length,
        },
      });
    }

    return view;
  }
}

function buildRiskSignals(source: string, status: string | null, count: number) {
  if (status === 'ready' || status === 'approved_for_external_filing') {
    return [];
  }

  return [
    {
      key: `${source}_${status ?? 'missing'}`,
      severity: count > 0 ? ('high' as const) : ('normal' as const),
      label: `${source} requiere revision`,
      detail:
        count > 0
          ? `${source} reporta ${count} pendientes.`
          : `${source} no esta en estado listo.`,
      source,
    },
  ];
}

function resolveReadinessStatus(
  blockers: string[],
  riskSignalCount: number,
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0) {
    return 'blocked';
  }

  return riskSignalCount > 0 ? 'needs_review' : 'ready';
}
