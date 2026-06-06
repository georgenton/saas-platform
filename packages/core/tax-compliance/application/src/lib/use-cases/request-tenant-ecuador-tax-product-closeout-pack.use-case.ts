import {
  EcuadorTaxProductCloseoutPackView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAnnualRollupWorkspaceUseCase } from './get-tenant-ecuador-tax-annual-rollup-workspace.use-case';
import { GetTenantEcuadorTaxCommandCenterUseCase } from './get-tenant-ecuador-tax-command-center.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class RequestTenantEcuadorTaxProductCloseoutPackUseCase {
  constructor(
    private readonly getTenantEcuadorTaxCommandCenterUseCase: GetTenantEcuadorTaxCommandCenterUseCase,
    private readonly getTenantEcuadorTaxAnnualRollupWorkspaceUseCase: GetTenantEcuadorTaxAnnualRollupWorkspaceUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxProductCloseoutPackView> {
    const [commandCenter, annualRollup] = await Promise.all([
      this.getTenantEcuadorTaxCommandCenterUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxAnnualRollupWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const closeoutChecklist = [
      {
        key: 'command_center',
        label: 'Command center operativo',
        status: commandCenter.commandStatus === 'blocked'
          ? ('blocked' as const)
          : commandCenter.commandStatus === 'ready' ||
              commandCenter.commandStatus === 'externally_filed'
            ? ('ready' as const)
            : ('needs_review' as const),
        evidence: ['tax_command_center', 'period_closeout_certification'],
      },
      {
        key: 'annual_rollup',
        label: 'Rollup anual conectado',
        status: annualRollup.readinessStatus,
        evidence: ['annual_rollup_workspace', 'income_tax_evidence'],
      },
      {
        key: 'guardrails',
        label: 'Guardrails SRI/contador',
        status: 'ready' as const,
        evidence: ['product_docs', 'assistant_guardrails', 'filing_handoff'],
      },
      {
        key: 'smoke_pack',
        label: 'Smoke narrativo operacional',
        status: 'ready' as const,
        evidence: ['run-ec-tax-compliance-operational-smoke.mjs'],
      },
    ];
    const blockers = [...commandCenter.blockers, ...annualRollup.blockers];
    const productStatus = resolveProductStatus(closeoutChecklist, blockers);
    const view: EcuadorTaxProductCloseoutPackView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      productStatus,
      commandCenter,
      annualRollup,
      closeoutChecklist,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter(
          (item) => item.status === 'ready',
        ).length,
        endpointSurfaceCount: 6,
        smokeCoverageCount: 1,
        blockerCount: blockers.length,
      },
      recommendedNextProduct:
        blockers.length > 0 ? 'tax_compliance_hardening' : 'parties_2_0',
      blockers: [...new Set(blockers)],
      nextStep:
        productStatus === 'mvp_complete'
          ? 'Tax Compliance EC puede considerarse MVP completo; evaluar Parties 2.0 como siguiente base compartida.'
          : 'Cerrar blockers y revisar checklist antes de declarar completo el producto.',
      guardrails: [
        'Closeout pack documenta alcance de producto, no obligaciones legales finales.',
        'Tax Compliance EC asiste cumplimiento; filing, firma y pago siguen fuera del sistema.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_product_closeout_pack_requested',
        source: 'tax_product_closeout_pack',
        payload: { productStatus, summary: view.summary },
      });
    }

    return view;
  }
}

function resolveProductStatus(
  checklist: Array<{ status: EcuadorTaxReadinessStatus }>,
  blockers: string[],
): EcuadorTaxProductCloseoutPackView['productStatus'] {
  if (blockers.length > 0 || checklist.some((item) => item.status === 'blocked')) {
    return 'blocked';
  }

  return checklist.every((item) => item.status === 'ready')
    ? 'mvp_complete'
    : 'needs_closeout';
}
