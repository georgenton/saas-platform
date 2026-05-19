import { Injectable } from '@nestjs/common';
import { WhatsappAutomationRuleRepository } from '@saas-platform/growth-application';
import {
  ConversationMessageDeliveryStatus,
  WhatsappAutomationRule,
  WhatsappAutomationActionType,
  WhatsappAutomationAssigneeMode,
  WhatsappAutomationRuleStatus,
  WhatsappAutomationTriggerEvent,
} from '@saas-platform/growth-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaWhatsappAutomationRuleRepository
  implements WhatsappAutomationRuleRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(rule: WhatsappAutomationRule): Promise<void> {
    const data = rule.toPrimitives();

    await this.whatsappAutomationRuleDelegate.upsert({
      where: { id: data.id },
      update: {
        key: data.key,
        name: data.name,
        triggerEvent: data.triggerEvent,
        matchOutboundIntentKey: data.matchOutboundIntentKey,
        matchDeliveryStatus: data.matchDeliveryStatus,
        matchAssigneeMode: data.matchAssigneeMode,
        templateId: data.templateId,
        actionType: data.actionType,
        actionOutboundIntentKey: data.actionOutboundIntentKey,
        status: data.status,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        key: data.key,
        name: data.name,
        triggerEvent: data.triggerEvent,
        matchOutboundIntentKey: data.matchOutboundIntentKey,
        matchDeliveryStatus: data.matchDeliveryStatus,
        matchAssigneeMode: data.matchAssigneeMode,
        templateId: data.templateId,
        actionType: data.actionType,
        actionOutboundIntentKey: data.actionOutboundIntentKey,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findByTenantId(tenantId: string): Promise<WhatsappAutomationRule[]> {
    const rules = await this.whatsappAutomationRuleDelegate.findMany({
      where: { tenantId },
      orderBy: [{ createdAt: 'desc' }],
    });

    return rules.map((rule) => this.toDomain(rule as any));
  }

  async findByTenantIdAndId(
    tenantId: string,
    ruleId: string,
  ): Promise<WhatsappAutomationRule | null> {
    const rule = await this.whatsappAutomationRuleDelegate.findFirst({
      where: {
        tenantId,
        id: ruleId,
      },
    });

    return rule ? this.toDomain(rule as any) : null;
  }

  async findByTenantIdAndKey(
    tenantId: string,
    key: string,
  ): Promise<WhatsappAutomationRule | null> {
    const rule = await this.whatsappAutomationRuleDelegate.findFirst({
      where: {
        tenantId,
        key,
      },
    });

    return rule ? this.toDomain(rule as any) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    key: string;
    name: string;
    triggerEvent: string;
    matchOutboundIntentKey: string | null;
    matchDeliveryStatus: string | null;
    matchAssigneeMode: string;
    templateId: string | null;
    actionType: string;
    actionOutboundIntentKey: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): WhatsappAutomationRule {
    return WhatsappAutomationRule.create({
      id: record.id,
      tenantId: record.tenantId,
      key: record.key,
      name: record.name,
      triggerEvent: record.triggerEvent as WhatsappAutomationTriggerEvent,
      matchOutboundIntentKey: record.matchOutboundIntentKey,
      matchDeliveryStatus:
        record.matchDeliveryStatus as ConversationMessageDeliveryStatus | null,
      matchAssigneeMode:
        record.matchAssigneeMode as WhatsappAutomationAssigneeMode,
      templateId: record.templateId,
      actionType: record.actionType as WhatsappAutomationActionType,
      actionOutboundIntentKey: record.actionOutboundIntentKey,
      status: record.status as WhatsappAutomationRuleStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private get prismaClient(): PrismaService {
    return this.prisma;
  }

  private get whatsappAutomationRuleDelegate(): any {
    return (this.prismaClient as any).whatsappAutomationRule;
  }
}
