import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { WhatsappOperationalAlertAcknowledgementRepository } from '../ports/whatsapp-operational-alert-acknowledgement.repository';

export class DeleteTenantWhatsappOperationalAlertAcknowledgementUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly whatsappOperationalAlertAcknowledgementRepository: WhatsappOperationalAlertAcknowledgementRepository,
  ) {}

  async execute(tenantSlug: string, alertKey: string): Promise<void> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    await this.whatsappOperationalAlertAcknowledgementRepository.deleteByTenantIdAndAlertKey(
      tenant.id,
      alertKey,
    );
  }
}
