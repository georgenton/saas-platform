import { Module } from '@nestjs/common';
import {
  USER_REPOSITORY,
} from '@saas-platform/identity-application';
import {
  AssignTenantConversationThreadUseCase,
  AssignTenantOpportunityUseCase,
  CONVERSATION_DELIVERY_EVENT_ID_GENERATOR,
  CONVERSATION_DELIVERY_EVENT_REPOSITORY,
  CONVERSATION_MESSAGE_ID_GENERATOR,
  CONVERSATION_MESSAGE_REPOSITORY,
  CONVERSATION_THREAD_ID_GENERATOR,
  CONVERSATION_THREAD_REPOSITORY,
  CreateTenantWhatsappAutomationRuleUseCase,
  CreateTenantConversationMessageUseCase,
  CreateTenantConversationThreadUseCase,
  CreateTenantLeadUseCase,
  CreateTenantOpportunityUseCase,
  CreateTenantWhatsappMessageTemplateUseCase,
  GetTenantConversationThreadByIdUseCase,
  GetTenantGrowthAssignmentWorkloadUseCase,
  GetTenantLeadByIdUseCase,
  GetTenantOpportunityByIdUseCase,
  GetTenantWhatsappAutomationRuleByIdUseCase,
  GetTenantWhatsappAutomationSuggestionsUseCase,
  GetTenantWhatsappOutboundReportingSummaryUseCase,
  GetTenantWhatsappMessageTemplateByIdUseCase,
  GetTenantWebhookEventEnvelopeByIdUseCase,
  IngestTenantWhatsappConversationMessageUseCase,
  IngestTenantWhatsappDeliveryEventUseCase,
  ListTenantConversationMessageDeliveryEventsUseCase,
  LEAD_ID_GENERATOR,
  LEAD_REPOSITORY,
  ListTenantConversationMessagesUseCase,
  ListTenantConversationThreadsUseCase,
  ListTenantLeadsUseCase,
  ListTenantOpportunitiesUseCase,
  ListTenantWebhookEventEnvelopesUseCase,
  ListTenantWhatsappAutomationRulesUseCase,
  ListTenantWhatsappConversationThreadsUseCase,
  ListTenantWhatsappMessageTemplatesUseCase,
  OPPORTUNITY_ID_GENERATOR,
  OPPORTUNITY_REPOSITORY,
  ProcessTenantMetaWhatsappWebhookUseCase,
  ReceiveTenantMetaWhatsappWebhookUseCase,
  ReplayTenantWebhookEventEnvelopeUseCase,
  SendTenantWhatsappConversationMessageUseCase,
  UpdateTenantOpportunityStageUseCase,
  WEBHOOK_EVENT_ENVELOPE_ID_GENERATOR,
  WEBHOOK_EVENT_ENVELOPE_REPOSITORY,
  WHATSAPP_AUTOMATION_RULE_ID_GENERATOR,
  WHATSAPP_AUTOMATION_RULE_REPOSITORY,
  WHATSAPP_MESSAGE_TEMPLATE_ID_GENERATOR,
  WHATSAPP_MESSAGE_TEMPLATE_REPOSITORY,
  WHATSAPP_OUTBOUND_MESSAGE_GATEWAY,
} from '@saas-platform/growth-application';
import {
  GrowthPersistenceModule,
  IdentityPersistenceModule,
  TenancyPersistenceModule,
} from '@saas-platform/infra-prisma';
import {
  MEMBERSHIP_REPOSITORY,
  ResolveTenantAccessUseCase,
  TENANT_ACCESS_REPOSITORY,
  TENANT_REPOSITORY,
} from '@saas-platform/tenancy-application';
import { AuthModule } from '../auth/auth.module';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { GrowthController } from './growth.controller';
import { MetaCloudApiWhatsappOutboundMessageGateway } from './meta-cloud-api-whatsapp-outbound-message-gateway';
import { MetaWhatsappWebhookController } from './meta-whatsapp-webhook.controller';
import { MetaWhatsappWebhookSignatureVerifier } from './meta-whatsapp-webhook-signature-verifier';
import { MetaWhatsappWebhookTenantResolver } from './meta-whatsapp-webhook-tenant-resolver';
import { MetaWhatsappWebhookVerifier } from './meta-whatsapp-webhook-verifier';

@Module({
  imports: [
    AuthModule,
    GrowthPersistenceModule,
    IdentityPersistenceModule,
    TenancyPersistenceModule,
  ],
  controllers: [GrowthController, MetaWhatsappWebhookController],
  providers: [
    MetaCloudApiWhatsappOutboundMessageGateway,
    {
      provide: WHATSAPP_OUTBOUND_MESSAGE_GATEWAY,
      useExisting: MetaCloudApiWhatsappOutboundMessageGateway,
    },
    {
      provide: ResolveTenantAccessUseCase,
      inject: [TENANT_REPOSITORY, TENANT_ACCESS_REPOSITORY],
      useFactory: (tenantRepository, tenantAccessRepository) =>
        new ResolveTenantAccessUseCase(tenantRepository, tenantAccessRepository),
    },
    {
      provide: AssignTenantConversationThreadUseCase,
      inject: [
        TENANT_REPOSITORY,
        MEMBERSHIP_REPOSITORY,
        CONVERSATION_THREAD_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        membershipRepository,
        conversationThreadRepository,
      ) =>
        new AssignTenantConversationThreadUseCase(
          tenantRepository,
          membershipRepository,
          conversationThreadRepository,
        ),
    },
    {
      provide: AssignTenantOpportunityUseCase,
      inject: [TENANT_REPOSITORY, MEMBERSHIP_REPOSITORY, OPPORTUNITY_REPOSITORY],
      useFactory: (
        tenantRepository,
        membershipRepository,
        opportunityRepository,
      ) =>
        new AssignTenantOpportunityUseCase(
          tenantRepository,
          membershipRepository,
          opportunityRepository,
        ),
    },
    {
      provide: CreateTenantWhatsappAutomationRuleUseCase,
      inject: [
        TENANT_REPOSITORY,
        WHATSAPP_AUTOMATION_RULE_REPOSITORY,
        WHATSAPP_AUTOMATION_RULE_ID_GENERATOR,
        WHATSAPP_MESSAGE_TEMPLATE_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        whatsappAutomationRuleRepository,
        whatsappAutomationRuleIdGenerator,
        whatsappMessageTemplateRepository,
      ) =>
        new CreateTenantWhatsappAutomationRuleUseCase(
          tenantRepository,
          whatsappAutomationRuleRepository,
          whatsappAutomationRuleIdGenerator,
          whatsappMessageTemplateRepository,
        ),
    },
    {
      provide: CreateTenantConversationThreadUseCase,
      inject: [
        TENANT_REPOSITORY,
        LEAD_REPOSITORY,
        CONVERSATION_THREAD_REPOSITORY,
        CONVERSATION_THREAD_ID_GENERATOR,
      ],
      useFactory: (
        tenantRepository,
        leadRepository,
        conversationThreadRepository,
        conversationThreadIdGenerator,
      ) =>
        new CreateTenantConversationThreadUseCase(
          tenantRepository,
          leadRepository,
          conversationThreadRepository,
          conversationThreadIdGenerator,
        ),
    },
    {
      provide: CreateTenantWhatsappMessageTemplateUseCase,
      inject: [
        TENANT_REPOSITORY,
        WHATSAPP_MESSAGE_TEMPLATE_REPOSITORY,
        WHATSAPP_MESSAGE_TEMPLATE_ID_GENERATOR,
      ],
      useFactory: (
        tenantRepository,
        whatsappMessageTemplateRepository,
        whatsappMessageTemplateIdGenerator,
      ) =>
        new CreateTenantWhatsappMessageTemplateUseCase(
          tenantRepository,
          whatsappMessageTemplateRepository,
          whatsappMessageTemplateIdGenerator,
        ),
    },
    {
      provide: CreateTenantOpportunityUseCase,
      inject: [
        TENANT_REPOSITORY,
        LEAD_REPOSITORY,
        CONVERSATION_THREAD_REPOSITORY,
        OPPORTUNITY_REPOSITORY,
        OPPORTUNITY_ID_GENERATOR,
      ],
      useFactory: (
        tenantRepository,
        leadRepository,
        conversationThreadRepository,
        opportunityRepository,
        opportunityIdGenerator,
      ) =>
        new CreateTenantOpportunityUseCase(
          tenantRepository,
          leadRepository,
          conversationThreadRepository,
          opportunityRepository,
          opportunityIdGenerator,
        ),
    },
    {
      provide: IngestTenantWhatsappConversationMessageUseCase,
      inject: [
        TENANT_REPOSITORY,
        LEAD_REPOSITORY,
        CONVERSATION_THREAD_REPOSITORY,
        CONVERSATION_THREAD_ID_GENERATOR,
        CONVERSATION_MESSAGE_REPOSITORY,
        CONVERSATION_MESSAGE_ID_GENERATOR,
      ],
      useFactory: (
        tenantRepository,
        leadRepository,
        conversationThreadRepository,
        conversationThreadIdGenerator,
        conversationMessageRepository,
        conversationMessageIdGenerator,
      ) =>
        new IngestTenantWhatsappConversationMessageUseCase(
          tenantRepository,
          leadRepository,
          conversationThreadRepository,
          conversationThreadIdGenerator,
          conversationMessageRepository,
          conversationMessageIdGenerator,
        ),
    },
    {
      provide: IngestTenantWhatsappDeliveryEventUseCase,
      inject: [
        TENANT_REPOSITORY,
        CONVERSATION_MESSAGE_REPOSITORY,
        CONVERSATION_DELIVERY_EVENT_REPOSITORY,
        CONVERSATION_DELIVERY_EVENT_ID_GENERATOR,
      ],
      useFactory: (
        tenantRepository,
        conversationMessageRepository,
        conversationDeliveryEventRepository,
        conversationDeliveryEventIdGenerator,
      ) =>
        new IngestTenantWhatsappDeliveryEventUseCase(
          tenantRepository,
          conversationMessageRepository,
          conversationDeliveryEventRepository,
          conversationDeliveryEventIdGenerator,
        ),
    },
    {
      provide: GetTenantConversationThreadByIdUseCase,
      inject: [TENANT_REPOSITORY, CONVERSATION_THREAD_REPOSITORY],
      useFactory: (tenantRepository, conversationThreadRepository) =>
        new GetTenantConversationThreadByIdUseCase(
          tenantRepository,
          conversationThreadRepository,
        ),
    },
    {
      provide: GetTenantGrowthAssignmentWorkloadUseCase,
      inject: [
        TENANT_REPOSITORY,
        MEMBERSHIP_REPOSITORY,
        USER_REPOSITORY,
        CONVERSATION_THREAD_REPOSITORY,
        OPPORTUNITY_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        membershipRepository,
        userRepository,
        conversationThreadRepository,
        opportunityRepository,
      ) =>
        new GetTenantGrowthAssignmentWorkloadUseCase(
          tenantRepository,
          membershipRepository,
          userRepository,
          conversationThreadRepository,
          opportunityRepository,
        ),
    },
    {
      provide: GetTenantWhatsappAutomationRuleByIdUseCase,
      inject: [TENANT_REPOSITORY, WHATSAPP_AUTOMATION_RULE_REPOSITORY],
      useFactory: (tenantRepository, whatsappAutomationRuleRepository) =>
        new GetTenantWhatsappAutomationRuleByIdUseCase(
          tenantRepository,
          whatsappAutomationRuleRepository,
        ),
    },
    {
      provide: GetTenantWhatsappAutomationSuggestionsUseCase,
      inject: [
        TENANT_REPOSITORY,
        CONVERSATION_THREAD_REPOSITORY,
        CONVERSATION_MESSAGE_REPOSITORY,
        WHATSAPP_AUTOMATION_RULE_REPOSITORY,
        WHATSAPP_MESSAGE_TEMPLATE_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        conversationThreadRepository,
        conversationMessageRepository,
        whatsappAutomationRuleRepository,
        whatsappMessageTemplateRepository,
      ) =>
        new GetTenantWhatsappAutomationSuggestionsUseCase(
          tenantRepository,
          conversationThreadRepository,
          conversationMessageRepository,
          whatsappAutomationRuleRepository,
          whatsappMessageTemplateRepository,
        ),
    },
    {
      provide: GetTenantWhatsappMessageTemplateByIdUseCase,
      inject: [TENANT_REPOSITORY, WHATSAPP_MESSAGE_TEMPLATE_REPOSITORY],
      useFactory: (tenantRepository, whatsappMessageTemplateRepository) =>
        new GetTenantWhatsappMessageTemplateByIdUseCase(
          tenantRepository,
          whatsappMessageTemplateRepository,
        ),
    },
    {
      provide: GetTenantWhatsappOutboundReportingSummaryUseCase,
      inject: [
        TENANT_REPOSITORY,
        CONVERSATION_THREAD_REPOSITORY,
        CONVERSATION_MESSAGE_REPOSITORY,
        WHATSAPP_MESSAGE_TEMPLATE_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        conversationThreadRepository,
        conversationMessageRepository,
        whatsappMessageTemplateRepository,
      ) =>
        new GetTenantWhatsappOutboundReportingSummaryUseCase(
          tenantRepository,
          conversationThreadRepository,
          conversationMessageRepository,
          whatsappMessageTemplateRepository,
        ),
    },
    {
      provide: GetTenantOpportunityByIdUseCase,
      inject: [TENANT_REPOSITORY, OPPORTUNITY_REPOSITORY],
      useFactory: (tenantRepository, opportunityRepository) =>
        new GetTenantOpportunityByIdUseCase(
          tenantRepository,
          opportunityRepository,
        ),
    },
    {
      provide: GetTenantWebhookEventEnvelopeByIdUseCase,
      inject: [TENANT_REPOSITORY, WEBHOOK_EVENT_ENVELOPE_REPOSITORY],
      useFactory: (tenantRepository, webhookEventEnvelopeRepository) =>
        new GetTenantWebhookEventEnvelopeByIdUseCase(
          tenantRepository,
          webhookEventEnvelopeRepository,
        ),
    },
    {
      provide: ListTenantConversationThreadsUseCase,
      inject: [TENANT_REPOSITORY, CONVERSATION_THREAD_REPOSITORY],
      useFactory: (tenantRepository, conversationThreadRepository) =>
        new ListTenantConversationThreadsUseCase(
          tenantRepository,
          conversationThreadRepository,
        ),
    },
    {
      provide: ListTenantOpportunitiesUseCase,
      inject: [TENANT_REPOSITORY, OPPORTUNITY_REPOSITORY],
      useFactory: (tenantRepository, opportunityRepository) =>
        new ListTenantOpportunitiesUseCase(
          tenantRepository,
          opportunityRepository,
        ),
    },
    {
      provide: ListTenantWhatsappConversationThreadsUseCase,
      inject: [TENANT_REPOSITORY, CONVERSATION_THREAD_REPOSITORY],
      useFactory: (tenantRepository, conversationThreadRepository) =>
        new ListTenantWhatsappConversationThreadsUseCase(
          tenantRepository,
          conversationThreadRepository,
        ),
    },
    {
      provide: ListTenantWhatsappAutomationRulesUseCase,
      inject: [TENANT_REPOSITORY, WHATSAPP_AUTOMATION_RULE_REPOSITORY],
      useFactory: (tenantRepository, whatsappAutomationRuleRepository) =>
        new ListTenantWhatsappAutomationRulesUseCase(
          tenantRepository,
          whatsappAutomationRuleRepository,
        ),
    },
    {
      provide: ListTenantWhatsappMessageTemplatesUseCase,
      inject: [TENANT_REPOSITORY, WHATSAPP_MESSAGE_TEMPLATE_REPOSITORY],
      useFactory: (tenantRepository, whatsappMessageTemplateRepository) =>
        new ListTenantWhatsappMessageTemplatesUseCase(
          tenantRepository,
          whatsappMessageTemplateRepository,
        ),
    },
    {
      provide: ListTenantWebhookEventEnvelopesUseCase,
      inject: [TENANT_REPOSITORY, WEBHOOK_EVENT_ENVELOPE_REPOSITORY],
      useFactory: (tenantRepository, webhookEventEnvelopeRepository) =>
        new ListTenantWebhookEventEnvelopesUseCase(
          tenantRepository,
          webhookEventEnvelopeRepository,
        ),
    },
    {
      provide: ListTenantConversationMessageDeliveryEventsUseCase,
      inject: [
        TENANT_REPOSITORY,
        CONVERSATION_THREAD_REPOSITORY,
        CONVERSATION_MESSAGE_REPOSITORY,
        CONVERSATION_DELIVERY_EVENT_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        conversationThreadRepository,
        conversationMessageRepository,
        conversationDeliveryEventRepository,
      ) =>
        new ListTenantConversationMessageDeliveryEventsUseCase(
          tenantRepository,
          conversationThreadRepository,
          conversationMessageRepository,
          conversationDeliveryEventRepository,
        ),
    },
    {
      provide: SendTenantWhatsappConversationMessageUseCase,
      inject: [
        TENANT_REPOSITORY,
        CONVERSATION_THREAD_REPOSITORY,
        CONVERSATION_MESSAGE_REPOSITORY,
        CONVERSATION_MESSAGE_ID_GENERATOR,
        WHATSAPP_MESSAGE_TEMPLATE_REPOSITORY,
        WHATSAPP_OUTBOUND_MESSAGE_GATEWAY,
      ],
      useFactory: (
        tenantRepository,
        conversationThreadRepository,
        conversationMessageRepository,
        conversationMessageIdGenerator,
        whatsappMessageTemplateRepository,
        whatsappOutboundMessageGateway,
      ) =>
        new SendTenantWhatsappConversationMessageUseCase(
          tenantRepository,
          conversationThreadRepository,
          conversationMessageRepository,
          conversationMessageIdGenerator,
          whatsappMessageTemplateRepository,
          whatsappOutboundMessageGateway,
        ),
    },
    {
      provide: ProcessTenantMetaWhatsappWebhookUseCase,
      inject: [
        IngestTenantWhatsappConversationMessageUseCase,
        IngestTenantWhatsappDeliveryEventUseCase,
      ],
      useFactory: (
        ingestTenantWhatsappConversationMessageUseCase,
        ingestTenantWhatsappDeliveryEventUseCase,
      ) =>
        new ProcessTenantMetaWhatsappWebhookUseCase(
          ingestTenantWhatsappConversationMessageUseCase,
          ingestTenantWhatsappDeliveryEventUseCase,
        ),
    },
    {
      provide: ReceiveTenantMetaWhatsappWebhookUseCase,
      inject: [
        TENANT_REPOSITORY,
        WEBHOOK_EVENT_ENVELOPE_REPOSITORY,
        WEBHOOK_EVENT_ENVELOPE_ID_GENERATOR,
        ProcessTenantMetaWhatsappWebhookUseCase,
      ],
      useFactory: (
        tenantRepository,
        webhookEventEnvelopeRepository,
        webhookEventEnvelopeIdGenerator,
        processTenantMetaWhatsappWebhookUseCase,
      ) =>
        new ReceiveTenantMetaWhatsappWebhookUseCase(
          tenantRepository,
          webhookEventEnvelopeRepository,
          webhookEventEnvelopeIdGenerator,
          processTenantMetaWhatsappWebhookUseCase,
        ),
    },
    {
      provide: ReplayTenantWebhookEventEnvelopeUseCase,
      inject: [
        TENANT_REPOSITORY,
        WEBHOOK_EVENT_ENVELOPE_REPOSITORY,
        ProcessTenantMetaWhatsappWebhookUseCase,
      ],
      useFactory: (
        tenantRepository,
        webhookEventEnvelopeRepository,
        processTenantMetaWhatsappWebhookUseCase,
      ) =>
        new ReplayTenantWebhookEventEnvelopeUseCase(
          tenantRepository,
          webhookEventEnvelopeRepository,
          processTenantMetaWhatsappWebhookUseCase,
        ),
    },
    {
      provide: CreateTenantConversationMessageUseCase,
      inject: [
        TENANT_REPOSITORY,
        CONVERSATION_THREAD_REPOSITORY,
        CONVERSATION_MESSAGE_REPOSITORY,
        CONVERSATION_MESSAGE_ID_GENERATOR,
      ],
      useFactory: (
        tenantRepository,
        conversationThreadRepository,
        conversationMessageRepository,
        conversationMessageIdGenerator,
      ) =>
        new CreateTenantConversationMessageUseCase(
          tenantRepository,
          conversationThreadRepository,
          conversationMessageRepository,
          conversationMessageIdGenerator,
        ),
    },
    {
      provide: ListTenantConversationMessagesUseCase,
      inject: [
        TENANT_REPOSITORY,
        CONVERSATION_THREAD_REPOSITORY,
        CONVERSATION_MESSAGE_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        conversationThreadRepository,
        conversationMessageRepository,
      ) =>
        new ListTenantConversationMessagesUseCase(
          tenantRepository,
          conversationThreadRepository,
          conversationMessageRepository,
        ),
    },
    {
      provide: CreateTenantLeadUseCase,
      inject: [TENANT_REPOSITORY, LEAD_REPOSITORY, LEAD_ID_GENERATOR],
      useFactory: (tenantRepository, leadRepository, leadIdGenerator) =>
        new CreateTenantLeadUseCase(
          tenantRepository,
          leadRepository,
          leadIdGenerator,
        ),
    },
    {
      provide: UpdateTenantOpportunityStageUseCase,
      inject: [TENANT_REPOSITORY, OPPORTUNITY_REPOSITORY],
      useFactory: (tenantRepository, opportunityRepository) =>
        new UpdateTenantOpportunityStageUseCase(
          tenantRepository,
          opportunityRepository,
        ),
    },
    {
      provide: GetTenantLeadByIdUseCase,
      inject: [TENANT_REPOSITORY, LEAD_REPOSITORY],
      useFactory: (tenantRepository, leadRepository) =>
        new GetTenantLeadByIdUseCase(tenantRepository, leadRepository),
    },
    {
      provide: ListTenantLeadsUseCase,
      inject: [TENANT_REPOSITORY, LEAD_REPOSITORY],
      useFactory: (tenantRepository, leadRepository) =>
        new ListTenantLeadsUseCase(tenantRepository, leadRepository),
    },
    MetaWhatsappWebhookSignatureVerifier,
    MetaWhatsappWebhookTenantResolver,
    MetaWhatsappWebhookVerifier,
    TenantMembershipGuard,
    TenantPermissionGuard,
  ],
})
export class GrowthModule {}
