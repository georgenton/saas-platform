import {
  EcuadorTaxCommandCenterView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAnnexesWorkspaceUseCase } from './get-tenant-ecuador-tax-annexes-workspace.use-case';
import { GetTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase } from './get-tenant-ecuador-tax-income-tax-form-contract-workspace.use-case';
import { GetTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase } from './get-tenant-ecuador-tax-sri-evidence-intake-v2-workspace.use-case';
import { GetTenantEcuadorTaxVatFormContractWorkspaceUseCase } from './get-tenant-ecuador-tax-vat-form-contract-workspace.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase } from './request-tenant-ecuador-tax-period-closeout-certification.use-case';

export class GetTenantEcuadorTaxCommandCenterUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase: RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
    private readonly getTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase: GetTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase,
    private readonly getTenantEcuadorTaxVatFormContractWorkspaceUseCase: GetTenantEcuadorTaxVatFormContractWorkspaceUseCase,
    private readonly getTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase: GetTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase,
    private readonly getTenantEcuadorTaxAnnexesWorkspaceUseCase: GetTenantEcuadorTaxAnnexesWorkspaceUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxCommandCenterView> {
    const [certification, sriIntake, vatContract, incomeContract, annexes] =
      await Promise.all([
        this.requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.getTenantEcuadorTaxSriEvidenceIntakeV2WorkspaceUseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.getTenantEcuadorTaxVatFormContractWorkspaceUseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.getTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.getTenantEcuadorTaxAnnexesWorkspaceUseCase.execute({
          ...input,
          recordEvent: false,
        }),
      ]);
    const commandTiles = [
      {
        key: 'certification',
        label: 'Certificacion del periodo',
        status: certification.certificationStatus === 'externally_filed'
          ? ('ready' as const)
          : certification.certificationStatus === 'blocked'
            ? ('blocked' as const)
            : ('needs_review' as const),
        primaryMetric: `${certification.summary.readyChecklistCount}/${certification.summary.checklistCount}`,
        secondaryMetric: `${certification.summary.blockerCount} blockers`,
        nextAction: certification.nextStep,
      },
      {
        key: 'sri_intake',
        label: 'Evidencia SRI',
        status: sriIntake.readinessStatus,
        primaryMetric: `${sriIntake.deduplication.ledgerSriRows} filas`,
        secondaryMetric: `${sriIntake.deduplication.duplicateAccessKeys} duplicadas`,
        nextAction: sriIntake.nextStep,
      },
      {
        key: 'vat_contract',
        label: 'Contrato IVA',
        status: vatContract.readinessStatus,
        primaryMetric: `${vatContract.summary.highConfidenceBoxCount}/${vatContract.summary.contractBoxCount}`,
        secondaryMetric: `IVA ${vatContract.summary.estimatedVatPayableInCents}`,
        nextAction: vatContract.nextStep,
      },
      {
        key: 'income_contract',
        label: 'Contrato renta',
        status: incomeContract.readinessStatus,
        primaryMetric: `${incomeContract.contractLines.length} lineas`,
        secondaryMetric: `Base ${incomeContract.summary.estimatedTaxableBaseInCents}`,
        nextAction: incomeContract.nextStep,
      },
      {
        key: 'annexes',
        label: 'Anexos',
        status: annexes.readinessStatus,
        primaryMetric: `${annexes.summary.readyAnnexCount}/${annexes.summary.applicableAnnexCount}`,
        secondaryMetric: `${annexes.summary.blockerCount} blockers`,
        nextAction: annexes.nextStep,
      },
    ];
    const blockers = [
      ...certification.blockers,
      ...sriIntake.blockers,
      ...vatContract.blockers,
      ...incomeContract.blockers,
      ...annexes.blockers,
    ];
    const commandStatus = certification.summary.filedExternally
      ? 'externally_filed'
      : resolveCommandStatus(commandTiles.map((tile) => tile.status), blockers);
    const view: EcuadorTaxCommandCenterView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      commandStatus,
      certification,
      commandTiles,
      summary: {
        tileCount: commandTiles.length,
        readyTileCount: commandTiles.filter((tile) => tile.status === 'ready')
          .length,
        blockerCount: blockers.length,
        accountantQuestionCount:
          certification.summary.accountantQuestionCount,
        filedExternally: certification.summary.filedExternally,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        commandStatus === 'blocked'
          ? 'Resolver excepciones bloqueantes del periodo desde el command center.'
          : commandStatus === 'externally_filed'
            ? 'Conservar evidencia y cerrar el periodo tributario operacionalmente.'
            : 'Enviar pendientes a contador y completar acciones de certificacion.',
      guardrails: [
        'Command center operacional; no presenta, firma ni paga declaraciones.',
        'Las acciones finales ante SRI permanecen como handoff humano/contador.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_command_center_reviewed',
        source: 'tax_command_center',
        payload: { commandStatus, summary: view.summary },
      });
    }

    return view;
  }
}

function resolveCommandStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxCommandCenterView['commandStatus'] {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
