export interface AcknowledgeWhatsappOperationalAlertCommand {
  tenantId: string;
  alertKey: string;
  title: string;
  severity: 'warning' | 'critical';
  summary: string;
  provider: string | null;
  failureClass: string | null;
  providerTaxonomyFamily: string | null;
  providerTaxonomyDetail: string | null;
  affectedMessageCount: number;
  recommendedAction: string;
  lastSeenGeneratedAt: Date | null;
  acknowledgedAt: Date;
  acknowledgedByUserId: string;
  acknowledgedByEmail: string | null;
}

export interface WhatsappOperationalAlertAcknowledgementRecord
  extends AcknowledgeWhatsappOperationalAlertCommand {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsappOperationalAlertAcknowledgementRepository {
  acknowledge(
    command: AcknowledgeWhatsappOperationalAlertCommand,
  ): Promise<WhatsappOperationalAlertAcknowledgementRecord>;
  deleteByTenantIdAndAlertKey(
    tenantId: string,
    alertKey: string,
  ): Promise<void>;
  findByTenantId(
    tenantId: string,
  ): Promise<WhatsappOperationalAlertAcknowledgementRecord[]>;
}
