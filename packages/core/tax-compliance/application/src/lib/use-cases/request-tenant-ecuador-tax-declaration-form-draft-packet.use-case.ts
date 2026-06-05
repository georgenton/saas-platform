import {
  EcuadorTaxDeclarationFormDraftPacketView,
  EcuadorTaxDeclarationFormKey,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxDeclarationFormCatalogUseCase } from './get-tenant-ecuador-tax-declaration-form-catalog.use-case';
import { GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-sri-fiscal-evidence-workspace.use-case';
import { GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase } from './get-tenant-ecuador-tax-sri-platform-reconciliation-workspace.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase {
  constructor(
    private readonly getTenantEcuadorTaxDeclarationFormCatalogUseCase: GetTenantEcuadorTaxDeclarationFormCatalogUseCase,
    private readonly getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase: GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
    private readonly getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase: GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    formKey?: EcuadorTaxDeclarationFormKey;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxDeclarationFormDraftPacketView> {
    const formKey = input.formKey ?? 'iva';
    const [catalog, sriEvidence, reconciliation] = await Promise.all([
      this.getTenantEcuadorTaxDeclarationFormCatalogUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const form =
      catalog.forms.find((candidate) => candidate.formKey === formKey) ??
      catalog.forms[0];
    const totals = buildTotals(sriEvidence.voucherRows);
    const suggestedBoxes = form.draftableBoxes.map((box) => {
      const suggestion = suggestBoxValue({
        boxKey: box.boxKey,
        totals,
        sriEvidenceIds: sriEvidence.voucherRows.map(
          (voucher) => voucher.evidenceId,
        ),
      });
      const blockers = [
        ...form.blockers,
        reconciliation.issueSummary.blockingIssues > 0
          ? 'declaration_form_draft.sri_platform_blocking_issues'
          : null,
        suggestion.suggestedValueInCents === null
          ? `declaration_form_draft.${box.boxKey}.unsupported_calculation`
          : null,
      ].filter((blocker): blocker is string => blocker !== null);

      return {
        boxKey: box.boxKey,
        label: box.label,
        suggestedValueInCents: suggestion.suggestedValueInCents,
        currency: suggestion.currency,
        readinessStatus: resolveBoxStatus(blockers, reconciliation.issueSummary.reviewIssues),
        source: box.source,
        calculation: box.calculation,
        evidenceIds: suggestion.evidenceIds,
        platformReferences: reconciliation.issues.flatMap(
          (issue) => issue.platformReferences,
        ),
        explanation: suggestion.explanation,
        blockers,
      };
    });
    const blockers = [
      ...new Set([
        ...form.blockers,
        ...suggestedBoxes.flatMap((box) => box.blockers),
      ]),
    ];
    const readinessStatus = resolvePacketStatus(
      blockers,
      suggestedBoxes,
      reconciliation.issueSummary.reviewIssues,
    );
    const accountantReasons = [
      readinessStatus !== 'ready'
        ? 'El borrador contiene casilleros bloqueados o en revision.'
        : null,
      form.manualOnlyBoxes.length > 0
        ? 'El formulario conserva casilleros manuales que requieren criterio humano.'
        : null,
      reconciliation.issueSummary.totalIssues > 0
        ? 'Existen diferencias SRI vs plataforma que deben explicarse antes de copiar valores.'
        : null,
    ].filter((reason): reason is string => reason !== null);
    const view: EcuadorTaxDeclarationFormDraftPacketView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      formKey: form.formKey,
      formLabel: form.label,
      readinessStatus,
      supportStatus: form.supportStatus,
      suggestedBoxes,
      manualOnlyBoxes: form.manualOnlyBoxes.map((boxKey) => ({
        boxKey,
        reason:
          'Este casillero requiere contexto externo, criterio contable o confirmacion directa en SRI.',
        requiredOwner:
          boxKey.includes('adjustment') || boxKey.includes('loss')
            ? 'accountant'
            : 'operator',
      })),
      evidenceSummary: {
        sriVouchers: sriEvidence.summary.totalVouchers,
        reconciliationIssues: reconciliation.issueSummary.totalIssues,
        blockingIssues: reconciliation.issueSummary.blockingIssues,
        reviewIssues: reconciliation.issueSummary.reviewIssues,
      },
      accountantReview: {
        required: accountantReasons.length > 0,
        reasons: accountantReasons,
        suggestedQuestions: [
          'Los casilleros sugeridos coinciden con la declaracion que se va a preparar en SRI?',
          'Hay comprobantes SRI que deban excluirse por anulacion, nota de credito o no deducibilidad?',
          'Existen arrastres, saldos previos, multas o intereses que no esten en la evidencia operacional?',
        ],
      },
      blockers,
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver diferencias bloqueantes antes de usar el borrador del formulario.'
          : readinessStatus === 'needs_review'
            ? 'Revisar casilleros sugeridos con contador antes de copiarlos en SRI.'
            : 'Usar el borrador como soporte para entrada manual guiada en SRI.',
      guardrails: [
        'Este packet sugiere valores de casilleros; no presenta ni firma declaraciones.',
        'Los valores deben ser revisados por un humano antes de copiarlos al portal SRI.',
        'Casilleros manuales no deben ser inferidos por IA sin evidencia deterministica.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_declaration_form_draft_packet_requested',
        source: 'tax_declaration_form_draft_packet',
        payload: {
          formKey: view.formKey,
          readinessStatus,
          suggestedBoxCount: suggestedBoxes.length,
          manualOnlyBoxCount: view.manualOnlyBoxes.length,
          blockerCount: blockers.length,
        },
      });
    }

    return view;
  }
}

function buildTotals(
  vouchers: Awaited<
    ReturnType<GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase['execute']>
  >['voucherRows'],
) {
  return {
    issuedSubtotalInCents: vouchers
      .filter((voucher) => voucher.direction === 'issued')
      .reduce((total, voucher) => total + voucher.subtotalInCents, 0),
    issuedVatInCents: vouchers
      .filter((voucher) => voucher.direction === 'issued')
      .reduce((total, voucher) => total + voucher.vatInCents, 0),
    receivedVatInCents: vouchers
      .filter((voucher) => voucher.direction === 'received')
      .reduce((total, voucher) => total + voucher.vatInCents, 0),
    receivedSubtotalInCents: vouchers
      .filter((voucher) => voucher.direction === 'received')
      .reduce((total, voucher) => total + voucher.subtotalInCents, 0),
    withholdingInCents: vouchers.reduce(
      (total, voucher) =>
        total +
        voucher.incomeTaxWithholdingInCents +
        voucher.vatWithholdingInCents,
      0,
    ),
  };
}

function suggestBoxValue(input: {
  boxKey: string;
  totals: ReturnType<typeof buildTotals>;
  sriEvidenceIds: string[];
}): {
  suggestedValueInCents: number | null;
  currency: string | null;
  evidenceIds: string[];
  explanation: string;
} {
  const suggestions: Record<string, { value: number; explanation: string }> = {
    taxable_sales_base: {
      value: input.totals.issuedSubtotalInCents,
      explanation:
        'Suma de bases de comprobantes SRI emitidos del periodo importado.',
    },
    output_vat: {
      value: input.totals.issuedVatInCents,
      explanation:
        'Suma de IVA generado en comprobantes SRI emitidos del periodo.',
    },
    input_vat: {
      value: input.totals.receivedVatInCents,
      explanation:
        'Suma de IVA en comprobantes SRI recibidos; requiere clasificacion de deducibilidad.',
    },
    business_income: {
      value: input.totals.issuedSubtotalInCents,
      explanation:
        'Base de ingresos construida desde comprobantes SRI emitidos.',
    },
    deductible_costs_expenses: {
      value: input.totals.receivedSubtotalInCents,
      explanation:
        'Base preliminar de costos/gastos desde comprobantes SRI recibidos.',
    },
    withheld_income_tax_total: {
      value: input.totals.withholdingInCents,
      explanation:
        'Suma preliminar de retenciones identificadas en evidencia SRI.',
    },
  };
  const suggestion = suggestions[input.boxKey];

  if (!suggestion) {
    return {
      suggestedValueInCents: null,
      currency: null,
      evidenceIds: [],
      explanation:
        'No existe una regla deterministica soportada para este casillero.',
    };
  }

  return {
    suggestedValueInCents: suggestion.value,
    currency: 'USD',
    evidenceIds: input.sriEvidenceIds,
    explanation: suggestion.explanation,
  };
}

function resolveBoxStatus(
  blockers: string[],
  reviewIssueCount: number,
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0) {
    return 'blocked';
  }

  return reviewIssueCount > 0 ? 'needs_review' : 'ready';
}

function resolvePacketStatus(
  blockers: string[],
  boxes: EcuadorTaxDeclarationFormDraftPacketView['suggestedBoxes'],
  reviewIssueCount: number,
): EcuadorTaxReadinessStatus {
  if (
    blockers.length > 0 ||
    boxes.some((box) => box.readinessStatus === 'blocked')
  ) {
    return 'blocked';
  }

  return reviewIssueCount > 0 ||
    boxes.some((box) => box.readinessStatus === 'needs_review')
    ? 'needs_review'
    : 'ready';
}
