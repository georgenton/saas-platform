import { Injectable } from '@nestjs/common';
import { WhatsappAutomationExecutionRepository } from '@saas-platform/growth-application';
import {
  ConversationMessageDeliveryStatus,
  WhatsappAutomationExecution,
  WhatsappAutomationExecutionStatus,
  WhatsappAutomationTriggerEvent,
} from '@saas-platform/growth-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaWhatsappAutomationExecutionRepository
  implements WhatsappAutomationExecutionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(execution: WhatsappAutomationExecution): Promise<void> {
    const data = execution.toPrimitives();

    await this.whatsappAutomationExecutionDelegate.upsert({
      where: { id: data.id },
      update: {
        triggerEvent: data.triggerEvent,
        triggerMessageId: data.triggerMessageId,
        triggerExternalMessageId: data.triggerExternalMessageId,
        triggerDeliveryStatus: data.triggerDeliveryStatus,
        executionKey: data.executionKey,
        status: data.status,
        reason: data.reason,
        outputMessageId: data.outputMessageId,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        threadId: data.threadId,
        ruleId: data.ruleId,
        triggerEvent: data.triggerEvent,
        triggerMessageId: data.triggerMessageId,
        triggerExternalMessageId: data.triggerExternalMessageId,
        triggerDeliveryStatus: data.triggerDeliveryStatus,
        executionKey: data.executionKey,
        status: data.status,
        reason: data.reason,
        outputMessageId: data.outputMessageId,
        createdAt: data.createdAt,
      },
    });
  }

  async findByTenantIdAndExecutionKey(
    tenantId: string,
    executionKey: string,
  ): Promise<WhatsappAutomationExecution | null> {
    const execution = await this.whatsappAutomationExecutionDelegate.findFirst({
      where: {
        tenantId,
        executionKey,
      },
    });

    return execution ? this.toDomain(execution as any) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    threadId: string;
    ruleId: string;
    triggerEvent: string;
    triggerMessageId: string | null;
    triggerExternalMessageId: string | null;
    triggerDeliveryStatus: string | null;
    executionKey: string;
    status: string;
    reason: string | null;
    outputMessageId: string | null;
    createdAt: Date;
  }): WhatsappAutomationExecution {
    return WhatsappAutomationExecution.create({
      id: record.id,
      tenantId: record.tenantId,
      threadId: record.threadId,
      ruleId: record.ruleId,
      triggerEvent: record.triggerEvent as WhatsappAutomationTriggerEvent,
      triggerMessageId: record.triggerMessageId,
      triggerExternalMessageId: record.triggerExternalMessageId,
      triggerDeliveryStatus:
        record.triggerDeliveryStatus as ConversationMessageDeliveryStatus | null,
      executionKey: record.executionKey,
      status: record.status as WhatsappAutomationExecutionStatus,
      reason: record.reason,
      outputMessageId: record.outputMessageId,
      createdAt: record.createdAt,
    });
  }

  private get prismaClient(): PrismaService {
    return this.prisma;
  }

  private get whatsappAutomationExecutionDelegate(): any {
    return (this.prismaClient as any).whatsappAutomationExecution;
  }
}

