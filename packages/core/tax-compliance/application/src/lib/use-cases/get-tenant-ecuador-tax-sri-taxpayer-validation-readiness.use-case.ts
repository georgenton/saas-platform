import { GetTenantPartyFiscalIdentityProfileWorkspaceUseCase } from '@saas-platform/parties-application';
import {
  EcuadorTaxReadinessStatus,
  EcuadorTaxSriTaxpayerValidationReadinessView,
} from '@saas-platform/tax-compliance-domain';

export class GetTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase {
  constructor(
    private readonly getTenantPartyFiscalIdentityProfileWorkspaceUseCase: GetTenantPartyFiscalIdentityProfileWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxSriTaxpayerValidationReadinessView> {
    const identity =
      await this.getTenantPartyFiscalIdentityProfileWorkspaceUseCase.execute(
        input.tenantSlug,
      );
    const validationCandidates = identity.profiles.map((profile) => {
      const checks = [
        {
          key: 'taxpayer_id_present',
          label: 'RUC/cedula presente',
          status: profile.taxpayerId ? 'ready' : 'blocked',
          detail: profile.taxpayerId
            ? 'Identificador tributario capturado.'
            : 'Falta RUC/cedula para validar contra SRI.',
        },
        {
          key: 'identification_type_present',
          label: 'Tipo de identificacion presente',
          status: profile.identificationType ? 'ready' : 'blocked',
          detail: profile.identificationType
            ? `Tipo ${profile.identificationType} disponible.`
            : 'Falta tipo de identificacion.',
        },
        {
          key: 'taxpayer_name_present',
          label: 'Razon social/nombre presente',
          status: profile.taxpayerName ? 'ready' : 'needs_review',
          detail: profile.taxpayerName
            ? 'Nombre fiscal capturado para comparacion posterior.'
            : 'Falta nombre fiscal para comparacion.',
        },
        {
          key: 'sri_online_validation',
          label: 'Validacion oficial SRI',
          status: 'needs_review',
          detail:
            'Contrato preparado; integracion oficial o evidencia importada queda fuera de este slice.',
        },
      ] satisfies Array<{
        key: string;
        label: string;
        status: EcuadorTaxReadinessStatus;
        detail: string;
      }>;
      const validationStatus: EcuadorTaxReadinessStatus = checks.some(
        (check) => check.status === 'blocked',
      )
        ? 'blocked'
        : checks.some((check) => check.status === 'needs_review')
          ? 'needs_review'
          : 'ready';

      return {
        partyId: profile.partyId,
        displayName: profile.displayName,
        taxpayerId: profile.taxpayerId,
        identificationType: profile.identificationType,
        validationStatus,
        checks,
        recommendedAction:
          validationStatus === 'blocked'
            ? 'Completar identidad fiscal antes de intentar validacion SRI.'
            : 'Preparar comparacion contra fuente oficial o evidencia SRI importada.',
      };
    });
    const blockers = validationCandidates
      .filter((candidate) => candidate.validationStatus === 'blocked')
      .map((candidate) => `sri_taxpayer_validation.${candidate.partyId}`);
    const readinessStatus =
      blockers.length > 0
        ? 'blocked'
        : validationCandidates.some(
              (candidate) => candidate.validationStatus === 'needs_review',
            )
          ? 'needs_review'
          : 'ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      readinessStatus,
      validationMode: 'readiness_only',
      validationCandidates,
      summary: {
        candidateCount: validationCandidates.length,
        readyCandidateCount: validationCandidates.filter(
          (candidate) => candidate.validationStatus === 'ready',
        ).length,
        blockedCandidateCount: validationCandidates.filter(
          (candidate) => candidate.validationStatus === 'blocked',
        ).length,
        needsReviewCandidateCount: validationCandidates.filter(
          (candidate) => candidate.validationStatus === 'needs_review',
        ).length,
      },
      blockers,
      nextStep:
        readinessStatus === 'blocked'
          ? 'Completar RUC/cedula y tipo antes de validacion oficial.'
          : 'Conectar validador SRI o conciliacion con evidencia importada.',
      guardrails: [
        'Este workspace no consulta SRI; solo prepara readiness de validacion.',
        'La comparacion oficial debe manejar caidas del SRI y trazabilidad de fuente.',
      ],
    };
  }
}
