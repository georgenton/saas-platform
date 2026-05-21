import { TenantWhatsappOperationalMonitorSummaryView } from '../use-cases/run-tenant-whatsapp-operational-monitor.use-case';

export interface PublishWhatsappOperationalMonitorSummaryCommand {
  summary: TenantWhatsappOperationalMonitorSummaryView;
}

export interface WhatsappOperationalMonitorObservabilitySink {
  publish(
    command: PublishWhatsappOperationalMonitorSummaryCommand,
  ): Promise<void>;
}
