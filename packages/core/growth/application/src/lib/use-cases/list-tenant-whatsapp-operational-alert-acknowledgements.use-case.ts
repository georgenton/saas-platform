import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import {
  WhatsappOperationalAlertAcknowledgementRecord,
  WhatsappOperationalAlertAcknowledgementRepository,
} from '../ports/whatsapp-operational-alert-acknowledgement.repository';

export class ListTenantWhatsappOperationalAlertAcknowledgementsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly whatsappOperationalAlertAcknowledgementRepository: WhatsappOperationalAlertAcknowledgementRepository,
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<WhatsappOperationalAlertAcknowledgementRecord[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.whatsappOperationalAlertAcknowledgementRepository.findByTenantId(
      tenant.id,
    );
  }
}
