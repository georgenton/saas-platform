import {
  EcuadorTaxDeclarationPartyRecalculationPacketView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase } from './get-tenant-ecuador-tax-assisted-fiscal-correction-flow.use-case';
import { GetTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase } from './get-tenant-ecuador-tax-declaration-party-impact-workspace.use-case';
import { GetTenantEcuadorTaxPartyFiscalValidationLedgerUseCase } from './get-tenant-ecuador-tax-party-fiscal-validation-ledger.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class RequestTenantEcuadorTaxDeclarationPartyRecalculationPacketUseCase {
  constructor(
    private readonly getTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase: GetTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
    private readonly getTenantEcuadorTaxPartyFiscalValidationLedgerUseCase: GetTenantEcuadorTaxPartyFiscalValidationLedgerUseCase,
    private readonly getTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase: GetTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxDeclarationPartyRecalculationPacketView> {
    const [impact, ledger, correctionFlow] = await Promise.all([
      this.getTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxPartyFiscalValidationLedgerUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase.execute(
        input,
      ),
    ]);
    const ledgerByPartyId = new Map(
      ledger.entries.map((entry) => [entry.partyId, entry]),
    );
    const correctionByPartyId = new Map(
      correctionFlow.correctionCandidates.map((candidate) => [
        candidate.partyId,
        candidate,
      ]),
    );
    const declarationsByPartyId = new Map<string, string[]>();

    for (const declaration of impact.declarationImpacts) {
      for (const partyId of declaration.impactedPartyIds) {
        declarationsByPartyId.set(partyId, [
          ...new Set([
            ...(declarationsByPartyId.get(partyId) ?? []),
            declaration.declarationKey,
          ]),
        ]);
      }
    }

    const recalculationRows = impact.partyRiskRows.map((party) => {
      const ledgerEntry = ledgerByPartyId.get(party.partyId);
      const correction = correctionByPartyId.get(party.partyId);
      const currentValidationStatus = ledgerEntry?.latestEvidenceStatus ?? null;
      const improved =
        party.riskLevel !== 'low' && currentValidationStatus === 'ready';

      return {
        partyId: party.partyId,
        displayName: party.displayName,
        affectedDeclarations: declarationsByPartyId.get(party.partyId) ?? [],
        previousRiskLevel: party.riskLevel,
        currentValidationStatus,
        correctionPending: Boolean(correction),
        before: `risk=${party.riskLevel}; missing=${party.missingFields.join(',') || 'none'}`,
        after: currentValidationStatus
          ? `validation=${currentValidationStatus}; discrepancies=${ledgerEntry?.discrepancyCount ?? 0}`
          : 'validation=pending',
        recommendedAction: improved
          ? 'Recalcular readiness de declaracion con evidencia SRI aplicada.'
          : correction
            ? 'Completar correccion fiscal antes de recalcular.'
            : 'Solicitar evidencia u override antes de cambiar readiness.',
      };
    });
    const blockers = [
      ...ledger.blockers,
      ...recalculationRows
        .filter(
          (row) =>
            row.correctionPending || row.currentValidationStatus === 'blocked',
        )
        .map((row) => `party_recalculation.${row.partyId}`),
    ];
    const recalculationStatus: EcuadorTaxReadinessStatus =
      blockers.length > 0
        ? 'blocked'
        : recalculationRows.some((row) => !row.currentValidationStatus)
          ? 'needs_review'
          : 'ready';
    const declarationCount = new Set(
      recalculationRows.flatMap((row) => row.affectedDeclarations),
    ).size;
    const packet: EcuadorTaxDeclarationPartyRecalculationPacketView = {
      ...input,
      generatedAt: this.nowProvider(),
      recalculationStatus,
      recalculationRows,
      summary: {
        rowCount: recalculationRows.length,
        declarationCount,
        improvedPartyCount: recalculationRows.filter(
          (row) => row.currentValidationStatus === 'ready',
        ).length,
        stillBlockedPartyCount: recalculationRows.filter(
          (row) =>
            row.correctionPending || row.currentValidationStatus === 'blocked',
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        recalculationStatus === 'ready'
          ? 'Aplicar recalculo como soporte para closeout tributario del periodo.'
          : 'Resolver correcciones pendientes antes de recalcular declaraciones.',
      guardrails: [
        'El recalculo es operativo y explicativo; no cambia formularios presentados.',
        'Toda mejora de readiness debe conservar evidencia SRI u override humano.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_declaration_party_recalculation_requested',
        source: 'tax_declaration_party_recalculation_packet',
        payload: {
          recalculationStatus,
          rowCount: packet.summary.rowCount,
          declarationCount,
        },
      });
    }

    return packet;
  }
}
