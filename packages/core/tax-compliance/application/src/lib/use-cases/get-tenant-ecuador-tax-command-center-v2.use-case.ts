import { EcuadorTaxCommandCenterV2View } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase } from './get-tenant-ecuador-tax-accounting-evidence-from-foundation.use-case';
import { GetTenantEcuadorTaxCommandCenterUseCase } from './get-tenant-ecuador-tax-command-center.use-case';

export class GetTenantEcuadorTaxCommandCenterV2UseCase {
  constructor(
    private readonly getTenantEcuadorTaxCommandCenterUseCase: GetTenantEcuadorTaxCommandCenterUseCase,
    private readonly getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase: GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxCommandCenterV2View> {
    const [baseCommandCenter, accountingEvidence] = await Promise.all([
      this.getTenantEcuadorTaxCommandCenterUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase.execute(
        input,
      ),
    ]);
    const accountingTile = {
      key: 'accounting_foundation',
      label: 'Accounting Foundation',
      status: accountingEvidence.readinessStatus,
      primaryMetric: `${accountingEvidence.summary.readySourceCount}/${accountingEvidence.summary.sourceCount}`,
      secondaryMetric: `${accountingEvidence.summary.accountingUnmappedHints} unmapped`,
      nextAction: accountingEvidence.nextStep,
    };
    const commandTiles = [...baseCommandCenter.commandTiles, accountingTile];
    const blockers = [...baseCommandCenter.blockers, ...accountingEvidence.blockers];
    const commandStatus =
      baseCommandCenter.commandStatus === 'externally_filed'
        ? 'externally_filed'
        : blockers.length > 0 || accountingEvidence.readinessStatus === 'blocked'
          ? 'blocked'
          : baseCommandCenter.commandStatus === 'ready' &&
              accountingEvidence.readinessStatus === 'ready'
            ? 'ready'
            : 'needs_review';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      commandStatus,
      baseCommandCenter,
      accountingEvidence,
      commandTiles,
      summary: {
        ...baseCommandCenter.summary,
        tileCount: commandTiles.length,
        readyTileCount: commandTiles.filter((tile) => tile.status === 'ready')
          .length,
        blockerCount: new Set(blockers).size,
        accountingReadySourceCount: accountingEvidence.summary.readySourceCount,
        accountingBlockedSourceCount:
          accountingEvidence.summary.blockedSourceCount,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        commandStatus === 'ready'
          ? 'Usar command center 2.0 para review tributario con evidencia Accounting.'
          : accountingEvidence.nextStep,
      guardrails: [
        'Command center 2.0 agrega Accounting como evidencia, no como fuente fiscal unica.',
        'Las acciones finales de declaracion siguen siendo humanas/contador.',
      ],
    };
  }
}
