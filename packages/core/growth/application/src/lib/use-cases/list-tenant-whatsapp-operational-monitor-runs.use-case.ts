import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import {
  WhatsappOperationalMonitorRunRecord,
  WhatsappOperationalMonitorRunRepository,
} from '../ports/whatsapp-operational-monitor-run.repository';

export class ListTenantWhatsappOperationalMonitorRunsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly whatsappOperationalMonitorRunRepository: WhatsappOperationalMonitorRunRepository,
  ) {}

  async execute(
    tenantSlug: string,
    limit?: number | null,
  ): Promise<WhatsappOperationalMonitorRunRecord[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.whatsappOperationalMonitorRunRepository.findByTenantId(
      tenant.id,
      limit ?? null,
    );
  }
}
