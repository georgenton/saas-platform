import { WhatsappOperationalAlertAcknowledgementRecord } from '@saas-platform/growth-application';

export interface WhatsappOperationalAlertAcknowledgementResponseDto {
  id: string;
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
  lastSeenGeneratedAt: string | null;
  acknowledgedAt: string;
  acknowledgedByUserId: string;
  acknowledgedByEmail: string | null;
  createdAt: string;
  updatedAt: string;
}

export const toWhatsappOperationalAlertAcknowledgementResponseDto = (
  record: WhatsappOperationalAlertAcknowledgementRecord,
): WhatsappOperationalAlertAcknowledgementResponseDto => ({
  id: record.id,
  alertKey: record.alertKey,
  title: record.title,
  severity: record.severity,
  summary: record.summary,
  provider: record.provider,
  failureClass: record.failureClass,
  providerTaxonomyFamily: record.providerTaxonomyFamily,
  providerTaxonomyDetail: record.providerTaxonomyDetail,
  affectedMessageCount: record.affectedMessageCount,
  recommendedAction: record.recommendedAction,
  lastSeenGeneratedAt: record.lastSeenGeneratedAt?.toISOString() ?? null,
  acknowledgedAt: record.acknowledgedAt.toISOString(),
  acknowledgedByUserId: record.acknowledgedByUserId,
  acknowledgedByEmail: record.acknowledgedByEmail,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});
