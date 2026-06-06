import {
  EcuadorTaxAnnexesWorkspaceView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAnnexesReadinessUseCase } from './get-tenant-ecuador-tax-annexes-readiness.use-case';
import { GetTenantEcuadorTaxDeclarationSourceLedgerUseCase } from './get-tenant-ecuador-tax-declaration-source-ledger.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxAnnexesWorkspaceUseCase {
  constructor(
    private readonly getTenantEcuadorTaxAnnexesReadinessUseCase: GetTenantEcuadorTaxAnnexesReadinessUseCase,
    private readonly getTenantEcuadorTaxDeclarationSourceLedgerUseCase: GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxAnnexesWorkspaceView> {
    const [annexesReadiness, sourceLedger] = await Promise.all([
      this.getTenantEcuadorTaxAnnexesReadinessUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxDeclarationSourceLedgerUseCase.execute(input),
    ]);
    const annexWorkItems = annexesReadiness.annexes.map((annex) => ({
      key: annex.key,
      label: annex.label,
      readinessStatus: annex.readinessStatus,
      sourceRowCount: resolveSourceRowCount(annex.key, sourceLedger.sourceRows),
      evidenceSources: annex.evidenceSources,
      blockers: annex.blockers,
      nextStep: annex.nextStep,
    }));
    const blockers = [
      ...annexesReadiness.blockers,
      ...annexWorkItems
        .filter((item) => item.readinessStatus === 'blocked')
        .flatMap((item) => item.blockers),
    ];
    const readinessStatus = resolveReadinessStatus(
      annexWorkItems.map((item) => item.readinessStatus),
      blockers,
    );
    const view: EcuadorTaxAnnexesWorkspaceView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      annexesReadiness,
      sourceLedger,
      annexWorkItems,
      summary: {
        applicableAnnexCount: annexesReadiness.annexes.filter(
          (annex) => annex.applies,
        ).length,
        readyAnnexCount: annexWorkItems.filter(
          (item) => item.readinessStatus === 'ready',
        ).length,
        sourceRowCount: sourceLedger.summary.rowCount,
        blockerCount: blockers.length,
      },
      blockers,
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver soportes de anexos antes de certificar el periodo.'
          : 'Preparar insumos de anexos para revision/presentacion externa.',
      guardrails: [
        'Workspace de anexos no genera archivos oficiales SRI.',
        'La presentacion de anexos se mantiene como accion humana/contador externa.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_annexes_workspace_reviewed',
        source: 'tax_annexes_workspace',
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

function resolveSourceRowCount(
  annexKey: string,
  rows: Array<{ direction: string; source: string }>,
): number {
  if (annexKey === 'withholding_support') {
    return rows.filter((row) => row.direction === 'withholding').length;
  }

  return rows.filter(
    (row) => row.direction === 'purchase' || row.source === 'sri_import',
  ).length;
}

function resolveReadinessStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
