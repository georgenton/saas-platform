import {
  ConversationMessage,
  ConversationMessageDeliveryStatus,
  ConversationThread,
  Lead,
  WhatsappAutomationExecution,
  WhatsappAutomationRule,
  WhatsappMessageTemplate,
} from '@saas-platform/growth-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { ConversationMessageRepository } from '../ports/conversation-message.repository';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';
import { LeadRepository } from '../ports/lead.repository';
import { WhatsappAutomationExecutionIdGenerator } from '../ports/whatsapp-automation-execution-id.generator';
import { WhatsappAutomationExecutionRepository } from '../ports/whatsapp-automation-execution.repository';
import { WhatsappAutomationRuleRepository } from '../ports/whatsapp-automation-rule.repository';
import { WhatsappMessageTemplateRepository } from '../ports/whatsapp-message-template.repository';
import { SendTenantWhatsappConversationMessageUseCase } from './send-tenant-whatsapp-conversation-message.use-case';

export interface ExecuteTenantWhatsappAutomationActionsInput {
  tenantSlug: string;
  threadId: string;
  triggerEvent: WhatsappAutomationRule['triggerEvent'];
  triggerMessageId?: string | null;
  triggerExternalMessageId?: string | null;
  triggerDeliveryStatus?: ConversationMessageDeliveryStatus | null;
  executionKey?: string | null;
  occurredAt?: Date | null;
}

export interface TenantWhatsappAutomationActionExecutionView {
  ruleId: string;
  executionKey: string;
  status: 'sent' | 'skipped' | 'failed';
  outputMessageId: string | null;
  reason: string | null;
}

export interface ExecuteTenantWhatsappAutomationActionsResult {
  tenantSlug: string;
  threadId: string;
  triggerEvent: WhatsappAutomationRule['triggerEvent'];
  executedAt: Date;
  executions: TenantWhatsappAutomationActionExecutionView[];
}

export class ExecuteTenantWhatsappAutomationActionsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly leadRepository: LeadRepository,
    private readonly conversationThreadRepository: ConversationThreadRepository,
    private readonly conversationMessageRepository: ConversationMessageRepository,
    private readonly whatsappAutomationRuleRepository: WhatsappAutomationRuleRepository,
    private readonly whatsappMessageTemplateRepository: WhatsappMessageTemplateRepository,
    private readonly whatsappAutomationExecutionRepository: WhatsappAutomationExecutionRepository,
    private readonly whatsappAutomationExecutionIdGenerator: WhatsappAutomationExecutionIdGenerator,
    private readonly sendTenantWhatsappConversationMessageUseCase: SendTenantWhatsappConversationMessageUseCase,
  ) {}

  async execute(
    input: ExecuteTenantWhatsappAutomationActionsInput,
  ): Promise<ExecuteTenantWhatsappAutomationActionsResult> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const thread = await this.conversationThreadRepository.findByTenantIdAndId(
      tenant.id,
      input.threadId,
    );

    if (!thread || thread.channel !== 'whatsapp' || thread.status !== 'open') {
      return this.emptyResult(input);
    }

    const [lead, messages, rules, templates] = await Promise.all([
      this.resolveLead(tenant.id, thread.leadId),
      this.conversationMessageRepository.findByTenantIdAndThreadId(
        tenant.id,
        thread.id,
      ),
      this.whatsappAutomationRuleRepository.findByTenantId(tenant.id),
      this.whatsappMessageTemplateRepository.findByTenantId(tenant.id),
    ]);

    const templateIndex = new Map(templates.map((template) => [template.id, template] as const));
    const latestMessage = messages[messages.length - 1] ?? null;
    const latestOutboundMessage =
      [...messages].reverse().find((message) => message.direction === 'outbound') ??
      null;

    const matchingRules = rules.filter((rule) =>
      this.matchesRule(
        rule,
        thread,
        latestMessage,
        latestOutboundMessage,
        input,
      ),
    );

    const executions: TenantWhatsappAutomationActionExecutionView[] = [];

    for (const rule of matchingRules) {
      const executionKey = this.buildExecutionKey(input, rule.id);
      const existingExecution =
        await this.whatsappAutomationExecutionRepository.findByTenantIdAndExecutionKey(
          tenant.id,
          executionKey,
        );

      if (existingExecution) {
        continue;
      }

      const template =
        rule.templateId ? templateIndex.get(rule.templateId) ?? null : null;

      const execution = await this.executeRule({
        tenantId: tenant.id,
        tenantSlug: input.tenantSlug,
        thread,
        lead,
        rule,
        template,
        triggerMessageId: input.triggerMessageId ?? latestMessage?.id ?? null,
        triggerExternalMessageId:
          input.triggerExternalMessageId ??
          latestMessage?.externalMessageId ??
          null,
        triggerDeliveryStatus: input.triggerDeliveryStatus ?? null,
        occurredAt: input.occurredAt ?? new Date(),
        executionKey,
      });

      await this.whatsappAutomationExecutionRepository.save(execution);
      executions.push({
        ruleId: execution.ruleId,
        executionKey: execution.executionKey,
        status: execution.status,
        outputMessageId: execution.outputMessageId,
        reason: execution.reason,
      });
    }

    return {
      tenantSlug: input.tenantSlug,
      threadId: input.threadId,
      triggerEvent: input.triggerEvent,
      executedAt: input.occurredAt ?? new Date(),
      executions,
    };
  }

  private emptyResult(
    input: ExecuteTenantWhatsappAutomationActionsInput,
  ): ExecuteTenantWhatsappAutomationActionsResult {
    return {
      tenantSlug: input.tenantSlug,
      threadId: input.threadId,
      triggerEvent: input.triggerEvent,
      executedAt: input.occurredAt ?? new Date(),
      executions: [],
    };
  }

  private async resolveLead(
    tenantId: string,
    leadId: string | null,
  ): Promise<Lead | null> {
    if (!leadId) {
      return null;
    }

    return this.leadRepository.findByTenantIdAndId(tenantId, leadId);
  }

  private matchesRule(
    rule: WhatsappAutomationRule,
    thread: ConversationThread,
    latestMessage: ConversationMessage | null,
    latestOutboundMessage: ConversationMessage | null,
    input: ExecuteTenantWhatsappAutomationActionsInput,
  ): boolean {
    if (rule.status !== 'active' || rule.triggerEvent !== input.triggerEvent) {
      return false;
    }

    if (rule.actionType !== 'send_template') {
      return false;
    }

    if (rule.matchAssigneeMode === 'assigned' && !thread.assigneeUserId) {
      return false;
    }

    if (rule.matchAssigneeMode === 'unassigned' && !!thread.assigneeUserId) {
      return false;
    }

    if (
      input.triggerEvent === 'inbound_message' &&
      (latestMessage?.direction !== 'inbound' ||
        (input.triggerMessageId && latestMessage.id !== input.triggerMessageId))
    ) {
      return false;
    }

    if (input.triggerEvent === 'delivery_status_changed') {
      if (
        !latestOutboundMessage?.deliveryStatus ||
        latestOutboundMessage.direction !== 'outbound'
      ) {
        return false;
      }

      if (
        input.triggerExternalMessageId &&
        latestOutboundMessage.externalMessageId !== input.triggerExternalMessageId
      ) {
        return false;
      }
    }

    if (
      rule.matchOutboundIntentKey &&
      latestOutboundMessage?.outboundIntentKey !== rule.matchOutboundIntentKey
    ) {
      return false;
    }

    if (
      rule.matchDeliveryStatus &&
      latestOutboundMessage?.deliveryStatus !== rule.matchDeliveryStatus
    ) {
      return false;
    }

    return true;
  }

  private async executeRule(input: {
    tenantId: string;
    tenantSlug: string;
    thread: ConversationThread;
    lead: Lead | null;
    rule: WhatsappAutomationRule;
    template: WhatsappMessageTemplate | null;
    triggerMessageId: string | null;
    triggerExternalMessageId: string | null;
    triggerDeliveryStatus: ConversationMessageDeliveryStatus | null;
    occurredAt: Date;
    executionKey: string;
  }): Promise<WhatsappAutomationExecution> {
    const baseProps = {
      id: this.whatsappAutomationExecutionIdGenerator.generate(),
      tenantId: input.tenantId,
      threadId: input.thread.id,
      ruleId: input.rule.id,
      triggerEvent: input.rule.triggerEvent,
      triggerMessageId: input.triggerMessageId,
      triggerExternalMessageId: input.triggerExternalMessageId,
      triggerDeliveryStatus: input.triggerDeliveryStatus,
      executionKey: input.executionKey,
      createdAt: input.occurredAt,
    } as const;

    if (!input.template) {
      return WhatsappAutomationExecution.create({
        ...baseProps,
        status: 'skipped',
        reason: 'The automation template could not be resolved.',
        outputMessageId: null,
      });
    }

    const templateData = input.template.toPrimitives();

    if (templateData.status !== 'active') {
      return WhatsappAutomationExecution.create({
        ...baseProps,
        status: 'skipped',
        reason: 'The automation template is not active.',
        outputMessageId: null,
      });
    }

    if (
      templateData.providerApprovalStatus !== 'approved' ||
      !templateData.providerTemplateName
    ) {
      return WhatsappAutomationExecution.create({
        ...baseProps,
        status: 'skipped',
        reason:
          'The automation template is not provider-approved for automatic sends.',
        outputMessageId: null,
      });
    }

    try {
      const message =
        await this.sendTenantWhatsappConversationMessageUseCase.execute({
          tenantSlug: input.tenantSlug,
          threadId: input.thread.id,
          templateId: input.template.id,
          templateVariables: this.buildTemplateVariables(
            input.thread,
            input.lead,
            input.tenantSlug,
          ),
          outboundIntentKey:
            input.rule.actionOutboundIntentKey ?? templateData.intentKey,
          occurredAt: input.occurredAt,
        });

      return WhatsappAutomationExecution.create({
        ...baseProps,
        status: 'sent',
        reason: null,
        outputMessageId: message.id,
      });
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : 'Unknown automation error.';

      return WhatsappAutomationExecution.create({
        ...baseProps,
        status: 'failed',
        reason,
        outputMessageId: null,
      });
    }
  }

  private buildTemplateVariables(
    thread: ConversationThread,
    lead: Lead | null,
    tenantSlug: string,
  ): Record<string, string | number | boolean | null> {
    const fullName =
      this.normalizeOptionalValue(lead?.fullName) ??
      this.normalizeOptionalValue(thread.participantDisplayName) ??
      this.normalizeOptionalValue(thread.subject) ??
      'cliente';
    const firstName = fullName.split(/\s+/)[0] ?? fullName;

    return {
      tenantSlug,
      threadId: thread.id,
      subject: thread.subject,
      participantDisplayName: thread.participantDisplayName,
      participantHandle: thread.participantHandle,
      fullName,
      firstName,
      leadEmail: lead?.email ?? null,
      leadPhoneE164: lead?.phoneE164 ?? null,
      leadWhatsappE164: lead?.whatsappE164 ?? null,
      assigneeUserId: thread.assigneeUserId,
    };
  }

  private buildExecutionKey(
    input: ExecuteTenantWhatsappAutomationActionsInput,
    ruleId: string,
  ): string {
    const explicitExecutionKey = this.normalizeOptionalValue(input.executionKey);

    if (explicitExecutionKey) {
      return `${explicitExecutionKey}:${ruleId}`;
    }

    const triggerIdentity =
      this.normalizeOptionalValue(input.triggerMessageId) ??
      this.normalizeOptionalValue(input.triggerExternalMessageId) ??
      (input.triggerDeliveryStatus ? `${input.triggerDeliveryStatus}` : null) ??
      (input.occurredAt ?? new Date()).toISOString();

    return [
      input.threadId,
      input.triggerEvent,
      triggerIdentity,
      ruleId,
    ].join(':');
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
