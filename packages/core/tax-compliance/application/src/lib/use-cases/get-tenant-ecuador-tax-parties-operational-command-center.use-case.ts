import {
  EcuadorTaxPartiesOperationalCommandCenterView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPartyFiscalValidationLedgerUseCase } from './get-tenant-ecuador-tax-party-fiscal-validation-ledger.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxAccountantPartyRiskReviewExecutionUseCase } from './request-tenant-ecuador-tax-accountant-party-risk-review-execution.use-case';
import { RequestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase } from './request-tenant-ecuador-tax-compliance-hardening-closeout-v4.use-case';
import { RequestTenantEcuadorTaxDeclarationPartyRecalculationPacketUseCase } from './request-tenant-ecuador-tax-declaration-party-recalculation-packet.use-case';
import { RequestTenantEcuadorTaxPartiesPersistenceDecisionPackUseCase } from './request-tenant-ecuador-tax-parties-persistence-decision-pack.use-case';

export class GetTenantEcuadorTaxPartiesOperationalCommandCenterUseCase {
  constructor(
    private readonly getTenantEcuadorTaxPartyFiscalValidationLedgerUseCase: GetTenantEcuadorTaxPartyFiscalValidationLedgerUseCase,
    private readonly requestTenantEcuadorTaxDeclarationPartyRecalculationPacketUseCase: RequestTenantEcuadorTaxDeclarationPartyRecalculationPacketUseCase,
    private readonly requestTenantEcuadorTaxAccountantPartyRiskReviewExecutionUseCase: RequestTenantEcuadorTaxAccountantPartyRiskReviewExecutionUseCase,
    private readonly requestTenantEcuadorTaxPartiesPersistenceDecisionPackUseCase: RequestTenantEcuadorTaxPartiesPersistenceDecisionPackUseCase,
    private readonly requestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase: RequestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxPartiesOperationalCommandCenterView> {
    const [
      validationLedger,
      recalculationPacket,
      accountantReviewExecution,
      persistenceDecision,
      hardeningCloseout,
    ] = await Promise.all([
      this.getTenantEcuadorTaxPartyFiscalValidationLedgerUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxDeclarationPartyRecalculationPacketUseCase.execute(
        { ...input, recordEvent: false },
      ),
      this.requestTenantEcuadorTaxAccountantPartyRiskReviewExecutionUseCase.execute(
        {
          ...input,
          executeReview: false,
          recordEvent: false,
        },
      ),
      this.requestTenantEcuadorTaxPartiesPersistenceDecisionPackUseCase.execute(
        { ...input, recordEvent: false },
      ),
      this.requestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase.execute(
        input,
      ),
    ]);
    const commandTiles = [
      tile(
        'validation_ledger',
        'Ledger fiscal de parties',
        validationLedger.ledgerStatus,
        `${validationLedger.summary.evidenceBackedCount}/${validationLedger.summary.entryCount}`,
        validationLedger.nextStep,
      ),
      tile(
        'declaration_recalculation',
        'Recalculo por correcciones',
        recalculationPacket.recalculationStatus,
        `${recalculationPacket.summary.rowCount} rows`,
        recalculationPacket.nextStep,
      ),
      tile(
        'accountant_party_review',
        'Review contador por terceros',
        accountantReviewExecution.executionStatus,
        `${accountantReviewExecution.partyRiskSummary.suggestedQuestionCount} preguntas`,
        accountantReviewExecution.nextStep,
      ),
      tile(
        'parties_persistence_decision',
        'Decision persistencia Parties',
        persistenceDecision.decisionStatus === 'blocked'
          ? 'blocked'
          : persistenceDecision.decisionStatus ===
              'parties_persistence_candidate'
            ? 'needs_review'
            : 'ready',
        persistenceDecision.decisionStatus,
        persistenceDecision.nextStep,
      ),
      tile(
        'hardening_closeout_v4',
        'Tax + Parties closeout v4',
        hardeningCloseout.closeoutStatus === 'tax_hardened'
          ? 'ready'
          : hardeningCloseout.closeoutStatus === 'blocked'
            ? 'blocked'
            : 'needs_review',
        hardeningCloseout.closeoutStatus,
        hardeningCloseout.nextStep,
      ),
    ];
    const blockers = [
      ...validationLedger.blockers,
      ...recalculationPacket.blockers,
      ...accountantReviewExecution.blockers,
      ...persistenceDecision.blockers,
      ...hardeningCloseout.blockers,
    ];
    const commandStatus =
      blockers.length > 0
        ? 'blocked'
        : commandTiles.some((item) => item.status === 'needs_review')
          ? 'needs_review'
          : 'ready';
    const commandCenter: EcuadorTaxPartiesOperationalCommandCenterView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      commandStatus,
      sriEvidenceImport: null,
      validationLedger,
      recalculationPacket,
      accountantReviewExecution,
      persistenceDecision,
      hardeningCloseout,
      commandTiles,
      summary: {
        tileCount: commandTiles.length,
        readyTileCount: commandTiles.filter((item) => item.status === 'ready')
          .length,
        blockerCount: new Set(blockers).size,
        validationDiscrepancyCount: validationLedger.summary.discrepancyCount,
        accountantQuestionCount:
          accountantReviewExecution.partyRiskSummary.suggestedQuestionCount,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        commandStatus === 'ready'
          ? 'Tax + Parties operativo; continuar hardening tributario sin abrir Accounting Advanced.'
          : 'Resolver tiles bloqueantes antes de decidir persistencia o producto nuevo.',
      guardrails: [
        'Command center agrega evidencia y decisiones; no muta Parties ni declara impuestos.',
        'Usar este centro como gate antes de crear persistencia propia de Parties.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_parties_operational_command_center_reviewed',
        source: 'tax_parties_operational_command_center',
        payload: {
          commandStatus,
          blockerCount: commandCenter.summary.blockerCount,
          decisionStatus: persistenceDecision.decisionStatus,
        },
      });
    }

    return commandCenter;
  }
}

function tile(
  key: string,
  label: string,
  status: EcuadorTaxReadinessStatus,
  metric: string,
  nextAction: string,
): EcuadorTaxPartiesOperationalCommandCenterView['commandTiles'][number] {
  return { key, label, status, metric, nextAction };
}
