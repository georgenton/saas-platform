import {
  EcuadorTaxDeclarationFormKey,
  EcuadorTaxFormBoxEvidenceBinderView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxDeclarationSourceLedgerUseCase } from './get-tenant-ecuador-tax-declaration-source-ledger.use-case';
import { GetTenantEcuadorTaxPartiesOperationalCommandCenterUseCase } from './get-tenant-ecuador-tax-parties-operational-command-center.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase } from './request-tenant-ecuador-tax-declaration-form-draft-packet.use-case';

export class GetTenantEcuadorTaxFormBoxEvidenceBinderUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase: RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
    private readonly getTenantEcuadorTaxDeclarationSourceLedgerUseCase: GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
    private readonly getTenantEcuadorTaxPartiesOperationalCommandCenterUseCase: GetTenantEcuadorTaxPartiesOperationalCommandCenterUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    formKey?: EcuadorTaxDeclarationFormKey;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxFormBoxEvidenceBinderView> {
    const [draftPacket, sourceLedger, partyCommandCenter] = await Promise.all([
      this.requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxDeclarationSourceLedgerUseCase.execute(input),
      this.getTenantEcuadorTaxPartiesOperationalCommandCenterUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const partyRiskCount =
      partyCommandCenter.summary.validationDiscrepancyCount +
      partyCommandCenter.summary.accountantQuestionCount;
    const boxes: EcuadorTaxFormBoxEvidenceBinderView['boxes'] =
      draftPacket.suggestedBoxes.map((box) => {
        const sourceRowCount = resolveSourceRowCount(
          box.boxKey,
          sourceLedger.sourceRows,
        );
        const sriPlatformDifferenceCount = box.platformReferences.length;
        const accountantRequired =
          box.readinessStatus !== 'ready' ||
          partyRiskCount > 0 ||
          sriPlatformDifferenceCount > 0;

        return {
          boxKey: box.boxKey,
          label: box.label,
          suggestedValueInCents: box.suggestedValueInCents ?? 0,
          currency: box.currency ?? 'USD',
          readinessStatus: box.readinessStatus,
          evidenceIds: box.evidenceIds,
          sourceRowCount,
          partyRiskCount,
          sriPlatformDifferenceCount,
          confidence: resolveConfidence(
            box.readinessStatus,
            sourceRowCount,
            sriPlatformDifferenceCount,
            partyRiskCount,
          ),
          accountantRequired,
          explanation: `${box.explanation} Evidencia ledger: ${sourceRowCount} filas; party risks: ${partyRiskCount}.`,
        };
      });
    const blockers = [
      ...draftPacket.blockers,
      ...sourceLedger.blockers,
      ...partyCommandCenter.blockers,
      ...boxes
        .filter((box) => box.readinessStatus === 'blocked')
        .map((box) => `form_box.${box.boxKey}.blocked`),
    ];
    const binderStatus = resolveStatus(
      boxes.map((box) => box.readinessStatus),
      blockers,
    );
    const uniqueBlockers = [...new Set(blockers)];
    const view: EcuadorTaxFormBoxEvidenceBinderView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      formKey: draftPacket.formKey,
      binderStatus,
      boxes,
      manualOnlyBoxes: draftPacket.manualOnlyBoxes,
      sourceLedger,
      partyCommandCenter,
      summary: {
        boxCount: boxes.length,
        readyBoxCount: boxes.filter((box) => box.readinessStatus === 'ready')
          .length,
        accountantRequiredBoxCount: boxes.filter(
          (box) => box.accountantRequired,
        ).length,
        manualOnlyBoxCount: draftPacket.manualOnlyBoxes.length,
        evidenceReferenceCount: boxes.reduce(
          (total, box) => total + box.evidenceIds.length,
          0,
        ),
      },
      blockers: uniqueBlockers,
      nextStep:
        binderStatus === 'ready'
          ? 'Usar binder como evidencia de casilleros para export y handoff.'
          : 'Resolver casilleros con baja confianza, diferencias o riesgos de parties.',
      guardrails: [
        'Binder explica evidencia por casillero; no sustituye revision humana.',
        'La confianza baja debe escalarse a contador antes de copiar valores en SRI.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_form_box_evidence_binder_reviewed',
        source: 'tax_form_box_evidence_binder',
        payload: {
          formKey: view.formKey,
          binderStatus,
          summary: view.summary,
        },
      });
    }

    return view;
  }
}

function resolveSourceRowCount(
  boxKey: string,
  rows: EcuadorTaxFormBoxEvidenceBinderView['sourceLedger']['sourceRows'],
): number {
  if (boxKey.includes('sales') || boxKey.includes('output')) {
    return rows.filter((row) => row.direction === 'sale').length;
  }

  if (boxKey.includes('purchase') || boxKey.includes('input')) {
    return rows.filter((row) => row.direction === 'purchase').length;
  }

  if (boxKey.includes('withholding')) {
    return rows.filter((row) => row.direction === 'withholding').length;
  }

  return rows.length;
}

function resolveConfidence(
  status: EcuadorTaxReadinessStatus,
  sourceRowCount: number,
  sriPlatformDifferenceCount: number,
  partyRiskCount: number,
): 'high' | 'medium' | 'low' {
  if (
    status === 'blocked' ||
    sourceRowCount === 0 ||
    sriPlatformDifferenceCount > 0
  ) {
    return 'low';
  }

  return status === 'needs_review' || partyRiskCount > 0 ? 'medium' : 'high';
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
