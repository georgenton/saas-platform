import { Injectable } from '@nestjs/common';
import {
  AcknowledgeWhatsappOperationalAlertCommand,
  WhatsappOperationalAlertAcknowledgementRecord,
  WhatsappOperationalAlertAcknowledgementRepository,
} from '@saas-platform/growth-application';
import { PrismaService } from '../prisma.service';

type AlertAcknowledgementRow = {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaWhatsappOperationalAlertAcknowledgementRepository
  implements WhatsappOperationalAlertAcknowledgementRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async acknowledge(
    command: AcknowledgeWhatsappOperationalAlertCommand,
  ): Promise<WhatsappOperationalAlertAcknowledgementRecord> {
    const record = await this.delegate.upsert({
      where: {
        tenantId_alertKey: {
          tenantId: command.tenantId,
          alertKey: command.alertKey,
        },
      },
      update: {
        title: command.title,
        severity: command.severity,
        summary: command.summary,
        provider: command.provider,
        failureClass: command.failureClass,
        providerTaxonomyFamily: command.providerTaxonomyFamily,
        providerTaxonomyDetail: command.providerTaxonomyDetail,
        affectedMessageCount: command.affectedMessageCount,
        recommendedAction: command.recommendedAction,
        lastSeenGeneratedAt: command.lastSeenGeneratedAt,
        acknowledgedAt: command.acknowledgedAt,
        acknowledgedByUserId: command.acknowledgedByUserId,
        acknowledgedByEmail: command.acknowledgedByEmail,
      },
      create: {
        tenantId: command.tenantId,
        alertKey: command.alertKey,
        title: command.title,
        severity: command.severity,
        summary: command.summary,
        provider: command.provider,
        failureClass: command.failureClass,
        providerTaxonomyFamily: command.providerTaxonomyFamily,
        providerTaxonomyDetail: command.providerTaxonomyDetail,
        affectedMessageCount: command.affectedMessageCount,
        recommendedAction: command.recommendedAction,
        lastSeenGeneratedAt: command.lastSeenGeneratedAt,
        acknowledgedAt: command.acknowledgedAt,
        acknowledgedByUserId: command.acknowledgedByUserId,
        acknowledgedByEmail: command.acknowledgedByEmail,
      },
    });

    return this.toRecord(record as AlertAcknowledgementRow);
  }

  async deleteByTenantIdAndAlertKey(
    tenantId: string,
    alertKey: string,
  ): Promise<void> {
    await this.delegate.deleteMany({
      where: {
        tenantId,
        alertKey,
      },
    });
  }

  async findByTenantId(
    tenantId: string,
  ): Promise<WhatsappOperationalAlertAcknowledgementRecord[]> {
    const records = await this.delegate.findMany({
      where: {
        tenantId,
      },
      orderBy: [{ acknowledgedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record) => this.toRecord(record as AlertAcknowledgementRow));
  }

  private toRecord(
    record: AlertAcknowledgementRow,
  ): WhatsappOperationalAlertAcknowledgementRecord {
    return {
      id: record.id,
      tenantId: record.tenantId,
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
      lastSeenGeneratedAt: record.lastSeenGeneratedAt,
      acknowledgedAt: record.acknowledgedAt,
      acknowledgedByUserId: record.acknowledgedByUserId,
      acknowledgedByEmail: record.acknowledgedByEmail,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).whatsappOperationalAlertAcknowledgement;
  }
}
