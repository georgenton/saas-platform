import {
  EcuadorTaxAnnexesReadinessV2View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAnnexesWorkspaceUseCase } from './get-tenant-ecuador-tax-annexes-workspace.use-case';
import { GetTenantEcuadorTaxPartiesOperationalCommandCenterUseCase } from './get-tenant-ecuador-tax-parties-operational-command-center.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxAnnexesReadinessV2UseCase {
  constructor(
    private readonly getTenantEcuadorTaxAnnexesWorkspaceUseCase: GetTenantEcuadorTaxAnnexesWorkspaceUseCase,
    private readonly getTenantEcuadorTaxPartiesOperationalCommandCenterUseCase: GetTenantEcuadorTaxPartiesOperationalCommandCenterUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxAnnexesReadinessV2View> {
    const [annexesWorkspace, partyCommandCenter] = await Promise.all([
      this.getTenantEcuadorTaxAnnexesWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxPartiesOperationalCommandCenterUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const partyBlockerCount =
      partyCommandCenter.summary.validationDiscrepancyCount;
    const accountantQuestionCount =
      partyCommandCenter.summary.accountantQuestionCount;
    const annexes: EcuadorTaxAnnexesReadinessV2View['annexes'] =
      annexesWorkspace.annexWorkItems.map((item) => ({
        key: item.key,
        label: item.label,
        status: resolveAnnexStatus(item.readinessStatus, partyBlockerCount),
        requiredSources: item.evidenceSources,
        sourceRowCount: item.sourceRowCount,
        partyBlockerCount,
        accountantQuestionCount,
        nextAction:
          item.readinessStatus === 'blocked'
            ? item.nextStep
            : partyBlockerCount > 0
              ? 'Resolver terceros bloqueantes antes de preparar anexo.'
              : 'Preparar checklist de anexo para revision externa.',
      }));
    const blockers = [
      ...annexesWorkspace.blockers,
      ...partyCommandCenter.blockers,
      ...annexes
        .filter((annex) => annex.status === 'blocked')
        .map((annex) => `annex.${annex.key}.blocked`),
    ];
    const readinessStatus = resolveStatus(
      annexes.map((annex) => annex.status),
      blockers,
    );
    const uniqueBlockers = [...new Set(blockers)];
    const view: EcuadorTaxAnnexesReadinessV2View = {
      ...input,
      generatedAt: this.nowProvider(),
      readinessStatus,
      annexesWorkspace,
      partyCommandCenter,
      annexes,
      summary: {
        annexCount: annexes.length,
        readyAnnexCount: annexes.filter((annex) => annex.status === 'ready')
          .length,
        blockedAnnexCount: annexes.filter((annex) => annex.status === 'blocked')
          .length,
        partyBlockerCount,
        accountantQuestionCount,
      },
      blockers: uniqueBlockers,
      nextStep:
        readinessStatus === 'ready'
          ? 'Incluir anexos en el room del contador y artifact export.'
          : 'Resolver evidencia y parties bloqueantes antes de cerrar anexos.',
      guardrails: [
        'Annexes 2.0 prepara evidencia y checklist; no genera ni sube anexos oficiales.',
        'La presentacion de anexos continua como accion externa humana o del contador.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_annexes_readiness_v2_reviewed',
        source: 'tax_annexes_readiness_v2',
        payload: {
          readinessStatus,
          summary: view.summary,
        },
      });
    }

    return view;
  }
}

function resolveAnnexStatus(
  status: EcuadorTaxReadinessStatus,
  partyBlockerCount: number,
): EcuadorTaxReadinessStatus {
  if (status === 'blocked') {
    return 'blocked';
  }

  return status === 'needs_review' || partyBlockerCount > 0
    ? 'needs_review'
    : 'ready';
}

function resolveStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
