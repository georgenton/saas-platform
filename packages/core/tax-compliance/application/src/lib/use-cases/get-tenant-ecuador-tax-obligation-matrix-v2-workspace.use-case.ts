import {
  EcuadorTaxObligationKey,
  EcuadorTaxObligationMatrixV2WorkspaceView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxDeclarationFormCatalogUseCase } from './get-tenant-ecuador-tax-declaration-form-catalog.use-case';
import { GetTenantEcuadorTaxObligationMatrixUseCase } from './get-tenant-ecuador-tax-obligation-matrix.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxObligationMatrixV2WorkspaceUseCase {
  constructor(
    private readonly getTenantEcuadorTaxObligationMatrixUseCase: GetTenantEcuadorTaxObligationMatrixUseCase,
    private readonly getTenantEcuadorTaxDeclarationFormCatalogUseCase: GetTenantEcuadorTaxDeclarationFormCatalogUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxObligationMatrixV2WorkspaceView> {
    const [matrix, formCatalog] = await Promise.all([
      this.getTenantEcuadorTaxObligationMatrixUseCase.execute(input.tenantSlug),
      this.getTenantEcuadorTaxDeclarationFormCatalogUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const obligations = matrix.obligations.map((obligation) => {
      const declarationForms = formCatalog.forms
        .filter((form) => form.obligationKey === obligation.key)
        .map((form) => form.formKey);
      const accountantRequired =
        obligation.readinessStatus !== 'ready' ||
        obligation.key === 'income_tax' ||
        obligation.key === 'annexes' ||
        matrix.taxpayerProfile.accountingObligated === true;
      const closeoutGate = resolveCloseoutGate({
        applies: obligation.applies,
        status: obligation.readinessStatus,
        accountantRequired,
      });

      return {
        ...obligation,
        periodApplicability: resolvePeriodApplicability(obligation.key),
        accountantRequired,
        declarationForms,
        evidenceSources: resolveEvidenceSources(obligation.key),
        closeoutGate,
      };
    });
    const blockers = obligations
      .filter((obligation) => obligation.applies && obligation.closeoutGate === 'blocked')
      .map((obligation) => `obligation.${obligation.key}.blocked`);
    const readinessStatus = resolveAggregateReadiness(
      obligations.map((obligation) => obligation.closeoutGate),
      blockers,
    );
    const view: EcuadorTaxObligationMatrixV2WorkspaceView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      taxpayerProfile: matrix.taxpayerProfile,
      matrix,
      obligations,
      summary: {
        obligationCount: obligations.length,
        appliesCount: obligations.filter((obligation) => obligation.applies).length,
        accountantRequiredCount: obligations.filter(
          (obligation) => obligation.accountantRequired,
        ).length,
        blockedCount: obligations.filter(
          (obligation) => obligation.closeoutGate === 'blocked',
        ).length,
        needsReviewCount: obligations.filter(
          (obligation) => obligation.closeoutGate === 'needs_review',
        ).length,
      },
      blockers,
      nextStep:
        readinessStatus === 'blocked'
          ? 'Completar perfil tributario y obligaciones bloqueadas antes del cierre.'
          : 'Usar matriz 2.0 como contrato de obligaciones para formularios, anexos y certificacion.',
      guardrails: [
        'La matriz 2.0 orienta el cumplimiento operativo; no reemplaza calendario tributario oficial ni criterio contable.',
        'Las obligaciones de contribuyentes especiales, RIMPE y obligados a contabilidad requieren revision humana.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_obligation_matrix_v2_reviewed',
        source: 'tax_obligation_matrix_v2',
        payload: {
          readinessStatus,
          summary: view.summary,
          blockerCount: blockers.length,
        },
      });
    }

    return view;
  }
}

function resolvePeriodApplicability(
  key: EcuadorTaxObligationKey,
): 'current_period' | 'annual_context' | 'needs_review' {
  if (key === 'income_tax') {
    return 'annual_context';
  }

  if (key === 'annexes') {
    return 'needs_review';
  }

  return 'current_period';
}

function resolveEvidenceSources(key: EcuadorTaxObligationKey): string[] {
  switch (key) {
    case 'vat':
      return ['declaration_source_ledger', 'sri_imports', 'purchase_evidence'];
    case 'income_tax':
      return ['declaration_source_ledger', 'income_tax_evidence_workspace'];
    case 'withholding':
      return ['withholding_registry', 'sri_imports', 'supplier_readiness'];
    case 'annexes':
      return ['annexes_readiness', 'declaration_source_ledger', 'evidence_vault'];
  }
}

function resolveCloseoutGate(input: {
  applies: boolean;
  status: EcuadorTaxReadinessStatus;
  accountantRequired: boolean;
}): EcuadorTaxReadinessStatus {
  if (!input.applies) {
    return 'ready';
  }

  if (input.status === 'blocked') {
    return 'blocked';
  }

  return input.accountantRequired || input.status === 'needs_review'
    ? 'needs_review'
    : 'ready';
}

function resolveAggregateReadiness(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
