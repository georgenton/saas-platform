import {
  EcuadorTaxDeclarationDraftPacketView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase } from './get-tenant-ecuador-tax-calendar-review-workspace.use-case';
import { RequestTenantEcuadorTaxPeriodPreparationPacketUseCase } from './request-tenant-ecuador-tax-period-preparation-packet.use-case';

export class RequestTenantEcuadorTaxDeclarationDraftPacketUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxPeriodPreparationPacketUseCase: RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
    private readonly getTenantEcuadorTaxCalendarReviewWorkspaceUseCase: GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxDeclarationDraftPacketView> {
    const [preparationPacket, reviewWorkspace] = await Promise.all([
      this.requestTenantEcuadorTaxPeriodPreparationPacketUseCase.execute(
        input.tenantSlug,
        input.period,
      ),
      this.getTenantEcuadorTaxCalendarReviewWorkspaceUseCase.execute(
        input.tenantSlug,
        input.year,
      ),
    ]);

    const declarationSections: EcuadorTaxDeclarationDraftPacketView['declarationSections'] =
      [
      {
        section: 'taxpayer_profile',
        readinessStatus: preparationPacket.taxpayerProfile.readinessStatus,
        source: 'invoicing_issuer_profile',
        summary: `Contribuyente ${preparationPacket.taxpayerProfile.legalName} con regimen ${preparationPacket.taxpayerProfile.regime}.`,
        blockers: preparationPacket.taxpayerProfile.missingFields.map(
          (field) => `taxpayer_profile.${field}`,
        ),
      },
      {
        section: 'invoicing_evidence',
        readinessStatus: getSectionReadiness(
          preparationPacket.evidenceSummary.invoicing.invoiceCount > 0,
          preparationPacket.evidenceSummary.invoicing.totalsByCurrency.length > 0,
        ),
        source: 'invoicing_report_summary',
        summary: `${preparationPacket.evidenceSummary.invoicing.invoiceCount} documentos tributarios disponibles para revisar.`,
        blockers:
          preparationPacket.evidenceSummary.invoicing.invoiceCount > 0
            ? []
            : ['invoicing_evidence.invoice_count_empty'],
      },
      {
        section: 'party_fiscal_evidence',
        readinessStatus:
          preparationPacket.evidenceSummary.parties.needsReviewParties > 0
            ? 'needs_review'
            : 'ready',
        source: 'party_fiscal_readiness_summary',
        summary: `${preparationPacket.evidenceSummary.parties.needsReviewParties} terceros fiscales pendientes de revision.`,
        blockers: preparationPacket.evidenceSummary.parties.incompletePartyIds.map(
          (partyId) => `party_fiscal_profile.${partyId}`,
        ),
      },
      {
        section: 'calendar_review',
        readinessStatus:
          reviewWorkspace.summary.blockedCount > 0
            ? 'blocked'
            : reviewWorkspace.summary.needsReviewCount > 0
              ? 'needs_review'
              : 'ready',
        source: 'tax_obligation_calendar_review_workspace',
        summary: `${reviewWorkspace.summary.overdueCount} vencidas, ${reviewWorkspace.summary.dueSoonCount} proximas y ${reviewWorkspace.summary.needsReviewCount} en revision.`,
        blockers: reviewWorkspace.priorityEntries
          .filter((entry) => entry.readinessStatus === 'blocked')
          .map((entry) => `calendar.${entry.obligationKey}.${entry.period}`),
      },
    ];
    const blockers = declarationSections.flatMap((section) => section.blockers);
    const readinessStatus = getPacketReadinessStatus(
      blockers,
      declarationSections.some(
        (section) => section.readinessStatus === 'needs_review',
      ) || preparationPacket.readinessStatus === 'needs_review',
    );
    const accountantReasons = [
      preparationPacket.accountantHandoff.recommended
        ? preparationPacket.accountantHandoff.reason
        : null,
      reviewWorkspace.summary.overdueCount > 0
        ? 'Existen obligaciones vencidas o potencialmente vencidas en el calendario operacional.'
        : null,
      preparationPacket.evidenceSummary.parties.needsReviewParties > 0
        ? 'Hay terceros fiscales incompletos que pueden afectar declaracion o sustento.'
        : null,
    ].filter((reason): reason is string => reason !== null);

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      generatedAt: this.nowProvider(),
      taxpayerProfile: preparationPacket.taxpayerProfile,
      readinessStatus,
      declarationSections,
      accountantReview: {
        required: readinessStatus !== 'ready' || accountantReasons.length > 0,
        reasons: accountantReasons,
        suggestedQuestions: [
          'Confirmar periodicidad aplicable para IVA, retenciones y anexos del periodo.',
          'Validar si existen comprobantes de compra o retenciones no cargadas en la plataforma.',
          'Confirmar si las obligaciones vencidas ya fueron declaradas o pagadas fuera del sistema.',
        ],
      },
      sourcePackets: {
        preparationPacketGeneratedAt: preparationPacket.generatedAt,
        calendarEntryCount: reviewWorkspace.summary.totalEntries,
        evidenceSummary: preparationPacket.evidenceSummary,
      },
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver blockers antes de preparar borrador de declaracion.'
          : readinessStatus === 'needs_review'
            ? 'Enviar borrador y preguntas al contador para revision previa a declaracion.'
            : 'Preparar declaracion final manteniendo aprobacion humana antes de presentar.',
      guardrails: [
        ...preparationPacket.guardrails,
        ...reviewWorkspace.guardrails,
        'Este packet organiza un borrador de declaracion; no presenta formularios ni calcula impuesto final exigible.',
      ],
    };
  }
}

function getSectionReadiness(
  hasEvidence: boolean,
  hasTotals: boolean,
): EcuadorTaxReadinessStatus {
  if (!hasEvidence) {
    return 'blocked';
  }

  return hasTotals ? 'ready' : 'needs_review';
}

function getPacketReadinessStatus(
  blockers: string[],
  needsReview: boolean,
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0) {
    return 'blocked';
  }

  return needsReview ? 'needs_review' : 'ready';
}
