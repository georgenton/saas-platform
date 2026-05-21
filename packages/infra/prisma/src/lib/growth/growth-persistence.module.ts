import { Module } from '@nestjs/common';
import {
  CONVERSATION_DELIVERY_EVENT_ID_GENERATOR,
  CONVERSATION_DELIVERY_EVENT_REPOSITORY,
  CONVERSATION_MESSAGE_ID_GENERATOR,
  CONVERSATION_MESSAGE_REPOSITORY,
  CONVERSATION_THREAD_ID_GENERATOR,
  CONVERSATION_THREAD_REPOSITORY,
  LEAD_ID_GENERATOR,
  LEAD_REPOSITORY,
  OPPORTUNITY_ID_GENERATOR,
  OPPORTUNITY_REPOSITORY,
  WHATSAPP_AUTOMATION_EXECUTION_ID_GENERATOR,
  WHATSAPP_AUTOMATION_EXECUTION_REPOSITORY,
  WHATSAPP_AUTOMATION_RULE_ID_GENERATOR,
  WHATSAPP_AUTOMATION_RULE_REPOSITORY,
  WHATSAPP_MESSAGE_TEMPLATE_ID_GENERATOR,
  WHATSAPP_MESSAGE_TEMPLATE_REPOSITORY,
  WEBHOOK_EVENT_ENVELOPE_ID_GENERATOR,
  WEBHOOK_EVENT_ENVELOPE_REPOSITORY,
} from '@saas-platform/growth-application';
import { PrismaModule } from '../prisma.module';
import { PrismaConversationDeliveryEventRepository } from './prisma-conversation-delivery-event.repository';
import { PrismaConversationMessageRepository } from './prisma-conversation-message.repository';
import { PrismaConversationThreadRepository } from './prisma-conversation-thread.repository';
import { PrismaLeadRepository } from './prisma-lead.repository';
import { PrismaOpportunityRepository } from './prisma-opportunity.repository';
import { PrismaWhatsappAutomationExecutionRepository } from './prisma-whatsapp-automation-execution.repository';
import { PrismaWhatsappAutomationRuleRepository } from './prisma-whatsapp-automation-rule.repository';
import { PrismaWhatsappMessageTemplateRepository } from './prisma-whatsapp-message-template.repository';
import { PrismaWebhookEventEnvelopeRepository } from './prisma-webhook-event-envelope.repository';
import { UuidConversationDeliveryEventIdGenerator } from './uuid-conversation-delivery-event-id.generator';
import { UuidConversationMessageIdGenerator } from './uuid-conversation-message-id.generator';
import { UuidConversationThreadIdGenerator } from './uuid-conversation-thread-id.generator';
import { UuidLeadIdGenerator } from './uuid-lead-id.generator';
import { UuidOpportunityIdGenerator } from './uuid-opportunity-id.generator';
import { UuidWhatsappAutomationExecutionIdGenerator } from './uuid-whatsapp-automation-execution-id.generator';
import { UuidWhatsappAutomationRuleIdGenerator } from './uuid-whatsapp-automation-rule-id.generator';
import { UuidWhatsappMessageTemplateIdGenerator } from './uuid-whatsapp-message-template-id.generator';
import { UuidWebhookEventEnvelopeIdGenerator } from './uuid-webhook-event-envelope-id.generator';

@Module({
  imports: [PrismaModule],
  providers: [
    PrismaConversationMessageRepository,
    PrismaConversationDeliveryEventRepository,
    PrismaConversationThreadRepository,
    PrismaLeadRepository,
    PrismaOpportunityRepository,
    PrismaWhatsappAutomationExecutionRepository,
    PrismaWhatsappAutomationRuleRepository,
    PrismaWhatsappMessageTemplateRepository,
    PrismaWebhookEventEnvelopeRepository,
    UuidConversationMessageIdGenerator,
    UuidConversationDeliveryEventIdGenerator,
    UuidConversationThreadIdGenerator,
    UuidLeadIdGenerator,
    UuidOpportunityIdGenerator,
    UuidWhatsappAutomationExecutionIdGenerator,
    UuidWhatsappAutomationRuleIdGenerator,
    UuidWhatsappMessageTemplateIdGenerator,
    UuidWebhookEventEnvelopeIdGenerator,
    {
      provide: CONVERSATION_MESSAGE_REPOSITORY,
      useExisting: PrismaConversationMessageRepository,
    },
    {
      provide: CONVERSATION_DELIVERY_EVENT_REPOSITORY,
      useExisting: PrismaConversationDeliveryEventRepository,
    },
    {
      provide: CONVERSATION_THREAD_REPOSITORY,
      useExisting: PrismaConversationThreadRepository,
    },
    {
      provide: CONVERSATION_MESSAGE_ID_GENERATOR,
      useExisting: UuidConversationMessageIdGenerator,
    },
    {
      provide: CONVERSATION_DELIVERY_EVENT_ID_GENERATOR,
      useExisting: UuidConversationDeliveryEventIdGenerator,
    },
    {
      provide: CONVERSATION_THREAD_ID_GENERATOR,
      useExisting: UuidConversationThreadIdGenerator,
    },
    {
      provide: LEAD_REPOSITORY,
      useExisting: PrismaLeadRepository,
    },
    {
      provide: OPPORTUNITY_REPOSITORY,
      useExisting: PrismaOpportunityRepository,
    },
    {
      provide: LEAD_ID_GENERATOR,
      useExisting: UuidLeadIdGenerator,
    },
    {
      provide: OPPORTUNITY_ID_GENERATOR,
      useExisting: UuidOpportunityIdGenerator,
    },
    {
      provide: WHATSAPP_AUTOMATION_EXECUTION_REPOSITORY,
      useExisting: PrismaWhatsappAutomationExecutionRepository,
    },
    {
      provide: WHATSAPP_AUTOMATION_EXECUTION_ID_GENERATOR,
      useExisting: UuidWhatsappAutomationExecutionIdGenerator,
    },
    {
      provide: WHATSAPP_AUTOMATION_RULE_REPOSITORY,
      useExisting: PrismaWhatsappAutomationRuleRepository,
    },
    {
      provide: WHATSAPP_AUTOMATION_RULE_ID_GENERATOR,
      useExisting: UuidWhatsappAutomationRuleIdGenerator,
    },
    {
      provide: WHATSAPP_MESSAGE_TEMPLATE_REPOSITORY,
      useExisting: PrismaWhatsappMessageTemplateRepository,
    },
    {
      provide: WHATSAPP_MESSAGE_TEMPLATE_ID_GENERATOR,
      useExisting: UuidWhatsappMessageTemplateIdGenerator,
    },
    {
      provide: WEBHOOK_EVENT_ENVELOPE_REPOSITORY,
      useExisting: PrismaWebhookEventEnvelopeRepository,
    },
    {
      provide: WEBHOOK_EVENT_ENVELOPE_ID_GENERATOR,
      useExisting: UuidWebhookEventEnvelopeIdGenerator,
    },
  ],
  exports: [
    CONVERSATION_MESSAGE_ID_GENERATOR,
    CONVERSATION_MESSAGE_REPOSITORY,
    CONVERSATION_DELIVERY_EVENT_ID_GENERATOR,
    CONVERSATION_DELIVERY_EVENT_REPOSITORY,
    CONVERSATION_THREAD_ID_GENERATOR,
    CONVERSATION_THREAD_REPOSITORY,
    LEAD_REPOSITORY,
    LEAD_ID_GENERATOR,
    OPPORTUNITY_REPOSITORY,
    OPPORTUNITY_ID_GENERATOR,
    WHATSAPP_AUTOMATION_EXECUTION_REPOSITORY,
    WHATSAPP_AUTOMATION_EXECUTION_ID_GENERATOR,
    WHATSAPP_AUTOMATION_RULE_REPOSITORY,
    WHATSAPP_AUTOMATION_RULE_ID_GENERATOR,
    WHATSAPP_MESSAGE_TEMPLATE_REPOSITORY,
    WHATSAPP_MESSAGE_TEMPLATE_ID_GENERATOR,
    WEBHOOK_EVENT_ENVELOPE_REPOSITORY,
    WEBHOOK_EVENT_ENVELOPE_ID_GENERATOR,
  ],
})
export class GrowthPersistenceModule {}
