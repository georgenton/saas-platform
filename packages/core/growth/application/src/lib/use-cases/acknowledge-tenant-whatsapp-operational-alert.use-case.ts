import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import {
  WhatsappOperationalAlertAcknowledgementRecord,
  WhatsappOperationalAlertAcknowledgementRepository,
} from '../ports/whatsapp-operational-alert-acknowledgement.repository';

export interface AcknowledgeTenantWhatsappOperationalAlertInput {
  tenantSlug: string;
  alertKey: string;
  title: string;
  severity: 'warning' | 'critical';
  summary: string;
  provider?: string | null;
  failureClass?: string | null;
  providerTaxonomyFamily?: string | null;
  providerTaxonomyDetail?: string | null;
  affectedMessageCount?: number | null;
  recommendedAction: string;
  lastSeenGeneratedAt?: Date | null;
  acknowledgedAt?: Date | null;
  acknowledgedByUserId: string;
  acknowledgedByEmail: string | null;
}

export class AcknowledgeTenantWhatsappOperationalAlertUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly whatsappOperationalAlertAcknowledgementRepository: WhatsappOperationalAlertAcknowledgementRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: AcknowledgeTenantWhatsappOperationalAlertInput,
  ): Promise<WhatsappOperationalAlertAcknowledgementRecord> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    return this.whatsappOperationalAlertAcknowledgementRepository.acknowledge({
      tenantId: tenant.id,
      alertKey: input.alertKey,
      title: input.title,
      severity: input.severity,
      summary: input.summary,
      provider: input.provider ?? null,
      failureClass: input.failureClass ?? null,
      providerTaxonomyFamily: input.providerTaxonomyFamily ?? null,
      providerTaxonomyDetail: input.providerTaxonomyDetail ?? null,
      affectedMessageCount: Math.max(0, input.affectedMessageCount ?? 0),
      recommendedAction: input.recommendedAction,
      lastSeenGeneratedAt: input.lastSeenGeneratedAt ?? null,
      acknowledgedAt: input.acknowledgedAt ?? this.nowProvider(),
      acknowledgedByUserId: input.acknowledgedByUserId,
      acknowledgedByEmail: input.acknowledgedByEmail,
    });
  }
}
