import { EcuadorTaxDeclarationApprovalPacketView } from '@saas-platform/tax-compliance-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { TaxComplianceAccountantReviewRepository } from '../ports/tax-compliance-accountant-review.repository';
import { TaxComplianceEventRepository } from '../ports/tax-compliance-event.repository';
import { RequestTenantEcuadorTaxDeclarationDraftPacketUseCase } from './request-tenant-ecuador-tax-declaration-draft-packet.use-case';

export class RequestTenantEcuadorTaxDeclarationApprovalPacketUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly reviewRepository: TaxComplianceAccountantReviewRepository,
    private readonly eventRepository: TaxComplianceEventRepository,
    private readonly requestTenantEcuadorTaxDeclarationDraftPacketUseCase: RequestTenantEcuadorTaxDeclarationDraftPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxDeclarationApprovalPacketView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const [latestReview, events, draftPacket] = await Promise.all([
      this.reviewRepository.findLatestByTenantIdAndPeriod(
        tenant.id,
        input.period,
      ),
      this.eventRepository.listByTenantAndPeriod({
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        period: input.period,
        limit: 20,
      }),
      this.requestTenantEcuadorTaxDeclarationDraftPacketUseCase.execute(input),
    ]);
    const remainingBlockers = [
      ...draftPacket.declarationSections.flatMap((section) => section.blockers),
      ...(latestReview?.status === 'approved'
        ? []
        : ['accountant_review.not_approved']),
    ];

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      latestAccountantReview: latestReview,
      approvalReadiness:
        remainingBlockers.length > 0
          ? latestReview
            ? 'blocked'
            : 'needs_accountant_review'
          : 'ready_for_human_approval',
      remainingBlockers,
      evidenceSummary: draftPacket.sourcePackets.evidenceSummary,
      declarationSections: draftPacket.declarationSections,
      availableAuditEvents: events,
      approvalChecklist: [
        'Confirmar revision aprobada por contador o responsable tributario.',
        'Verificar que no existan blockers fiscales o terceros incompletos.',
        'Confirmar evidencia de ventas, retenciones, compras y pagos del periodo.',
        'Mantener aprobacion humana antes de declarar fuera de la plataforma.',
      ],
      nextStep:
        remainingBlockers.length > 0
          ? 'Resolver blockers antes de declarar.'
          : 'Solicitar aprobacion humana final para declaracion externa.',
      guardrails: [
        'Este packet no presenta formularios al SRI.',
        'La aprobacion final debe permanecer humana y auditable.',
      ],
    };
  }
}
