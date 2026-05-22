import { Module } from '@nestjs/common';
import {
  USER_REPOSITORY,
} from '@saas-platform/identity-application';
import {
  AcknowledgeTenantWhatsappOperationalAlertUseCase,
  AutoAssignTenantGrowthOperationalCasesUseCase,
  AssignTenantConversationThreadUseCase,
  AssignTenantOpportunityUseCase,
  CONVERSATION_DELIVERY_EVENT_ID_GENERATOR,
  CONVERSATION_DELIVERY_EVENT_REPOSITORY,
  CONVERSATION_MESSAGE_ID_GENERATOR,
  CONVERSATION_MESSAGE_REPOSITORY,
  CONVERSATION_THREAD_ID_GENERATOR,
  CONVERSATION_THREAD_REPOSITORY,
  CreateTenantGrowthOperationalCaseUseCase,
  CreateTenantWhatsappAutomationRuleUseCase,
  CreateTenantConversationMessageUseCase,
  CreateTenantConversationThreadUseCase,
  CreateTenantLeadUseCase,
  CreateTenantOpportunityUseCase,
  CreateTenantWhatsappMessageTemplateUseCase,
  DeleteTenantWhatsappOperationalAlertAcknowledgementUseCase,
  ExecuteTenantWhatsappAutomationActionsUseCase,
  GROWTH_OPERATIONAL_CASE_REPOSITORY,
  GROWTH_OPERATIONAL_CASE_AUTO_ASSIGNMENT_SETTINGS_REPOSITORY,
  GetTenantConversationThreadByIdUseCase,
  GetTenantGrowthConversationWorkbenchUseCase,
  GetTenantGrowthAssignmentWorkloadUseCase,
  GetTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase,
  GetTenantLeadByIdUseCase,
  GetTenantOpportunityByIdUseCase,
  GetTenantWhatsappAutomationRuleByIdUseCase,
  GetTenantWhatsappAutomationSuggestionsUseCase,
  GetTenantWhatsappOperationalMonitorAnalyticsUseCase,
  GetTenantWhatsappOutboundReportingSummaryUseCase,
  GetTenantWhatsappMessageTemplateByIdUseCase,
  GetTenantWebhookEventEnvelopeByIdUseCase,
  IngestTenantWhatsappConversationMessageUseCase,
  IngestTenantWhatsappDeliveryEventUseCase,
  ListTenantConversationMessageDeliveryEventsUseCase,
  LEAD_ID_GENERATOR,
  LEAD_REPOSITORY,
  ListTenantConversationMessagesUseCase,
  ListTenantGrowthOperationalCasesUseCase,
  ListTenantConversationThreadsUseCase,
  ListTenantLeadsUseCase,
  ListTenantOpportunitiesUseCase,
  ListTenantWhatsappOperationalAlertAcknowledgementsUseCase,
  ListTenantWhatsappOperationalMonitorRunsUseCase,
  ListTenantWebhookEventEnvelopesUseCase,
  ListTenantWhatsappAutomationRulesUseCase,
  ListTenantWhatsappConversationThreadsUseCase,
  ListTenantWhatsappMessageTemplatesUseCase,
  OPPORTUNITY_ID_GENERATOR,
  OPPORTUNITY_REPOSITORY,
  ProcessTenantMetaWhatsappWebhookUseCase,
  ReceiveTenantMetaWhatsappWebhookUseCase,
  ReplayTenantWebhookEventEnvelopeUseCase,
  ReviewTenantGrowthOperationalCaseRoutingUseCase,
  ReopenTenantGrowthOperationalCaseUseCase,
  ResolveTenantGrowthOperationalCaseUseCase,
  RetryTenantWhatsappFailedConversationMessageUseCase,
  RunTenantWhatsappOperationalMonitorUseCase,
  RunTenantWhatsappReadyRetriesUseCase,
  SendTenantWhatsappConversationMessageUseCase,
  TakeTenantGrowthOperationalCaseUseCase,
  UpsertTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase,
  UpdateTenantGrowthOperationalCaseFollowUpStateUseCase,
  UpdateTenantOpportunityStageUseCase,
  WEBHOOK_EVENT_ENVELOPE_ID_GENERATOR,
  WEBHOOK_EVENT_ENVELOPE_REPOSITORY,
  WHATSAPP_AUTOMATION_EXECUTION_ID_GENERATOR,
  WHATSAPP_AUTOMATION_EXECUTION_REPOSITORY,
  WHATSAPP_AUTOMATION_RULE_ID_GENERATOR,
  WHATSAPP_AUTOMATION_RULE_REPOSITORY,
  WHATSAPP_MESSAGE_TEMPLATE_ID_GENERATOR,
  WHATSAPP_MESSAGE_TEMPLATE_REPOSITORY,
  WHATSAPP_OPERATIONAL_ALERT_ACKNOWLEDGEMENT_REPOSITORY,
  WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_SINK,
  WHATSAPP_OPERATIONAL_MONITOR_RUN_REPOSITORY,
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
import { GrowthWhatsappOperationalMonitorScheduler } from './growth-whatsapp-operational-monitor.scheduler';
import { HttpWhatsappOperationalMonitorObservabilitySink } from './http-whatsapp-operational-monitor-observability.sink';

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
    GrowthWhatsappOperationalMonitorScheduler,
    HttpWhatsappOperationalMonitorObservabilitySink,
    {
      provide: WHATSAPP_OUTBOUND_MESSAGE_GATEWAY,
      useExisting: MetaCloudApiWhatsappOutboundMessageGateway,
    },
    {
      provide: WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_SINK,
      useExisting: HttpWhatsappOperationalMonitorObservabilitySink,
    },
    {
      provide: ResolveTenantAccessUseCase,
      inject: [TENANT_REPOSITORY, TENANT_ACCESS_REPOSITORY],
      useFactory: (tenantRepository, tenantAccessRepository) =>
        new ResolveTenantAccessUseCase(tenantRepository, tenantAccessRepository),
    },
    {
      provide: AutoAssignTenantGrowthOperationalCasesUseCase,
      inject: [
        TENANT_REPOSITORY,
        MEMBERSHIP_REPOSITORY,
        TENANT_ACCESS_REPOSITORY,
        USER_REPOSITORY,
        GROWTH_OPERATIONAL_CASE_REPOSITORY,
        GROWTH_OPERATIONAL_CASE_AUTO_ASSIGNMENT_SETTINGS_REPOSITORY,
        CONVERSATION_THREAD_REPOSITORY,
        OPPORTUNITY_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        membershipRepository,
        tenantAccessRepository,
        userRepository,
        growthOperationalCaseRepository,
        growthOperationalCaseAutoAssignmentSettingsRepository,
        conversationThreadRepository,
        opportunityRepository,
      ) =>
        new AutoAssignTenantGrowthOperationalCasesUseCase(
          tenantRepository,
          membershipRepository,
          tenantAccessRepository,
          userRepository,
          growthOperationalCaseRepository,
          growthOperationalCaseAutoAssignmentSettingsRepository,
          conversationThreadRepository,
          opportunityRepository,
        ),
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
      provide: CreateTenantGrowthOperationalCaseUseCase,
      inject: [TENANT_REPOSITORY, GROWTH_OPERATIONAL_CASE_REPOSITORY],
      useFactory: (tenantRepository, growthOperationalCaseRepository) =>
        new CreateTenantGrowthOperationalCaseUseCase(
          tenantRepository,
          growthOperationalCaseRepository,
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
      provide: GetTenantGrowthConversationWorkbenchUseCase,
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
        new GetTenantGrowthConversationWorkbenchUseCase(
          tenantRepository,
          conversationThreadRepository,
          conversationMessageRepository,
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
      provide: GetTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase,
      inject: [
        TENANT_REPOSITORY,
        GROWTH_OPERATIONAL_CASE_AUTO_ASSIGNMENT_SETTINGS_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        growthOperationalCaseAutoAssignmentSettingsRepository,
      ) =>
        new GetTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase(
          tenantRepository,
          growthOperationalCaseAutoAssignmentSettingsRepository,
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
        CONVERSATION_DELIVERY_EVENT_REPOSITORY,
        WHATSAPP_MESSAGE_TEMPLATE_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        conversationThreadRepository,
        conversationMessageRepository,
        conversationDeliveryEventRepository,
        whatsappMessageTemplateRepository,
      ) =>
        new GetTenantWhatsappOutboundReportingSummaryUseCase(
          tenantRepository,
          conversationThreadRepository,
          conversationMessageRepository,
          conversationDeliveryEventRepository,
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
      provide: ListTenantGrowthOperationalCasesUseCase,
      inject: [TENANT_REPOSITORY, GROWTH_OPERATIONAL_CASE_REPOSITORY],
      useFactory: (tenantRepository, growthOperationalCaseRepository) =>
        new ListTenantGrowthOperationalCasesUseCase(
          tenantRepository,
          growthOperationalCaseRepository,
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
      provide: TakeTenantGrowthOperationalCaseUseCase,
      inject: [TENANT_REPOSITORY, GROWTH_OPERATIONAL_CASE_REPOSITORY],
      useFactory: (tenantRepository, growthOperationalCaseRepository) =>
        new TakeTenantGrowthOperationalCaseUseCase(
          tenantRepository,
          growthOperationalCaseRepository,
        ),
    },
    {
      provide: ResolveTenantGrowthOperationalCaseUseCase,
      inject: [TENANT_REPOSITORY, GROWTH_OPERATIONAL_CASE_REPOSITORY],
      useFactory: (tenantRepository, growthOperationalCaseRepository) =>
        new ResolveTenantGrowthOperationalCaseUseCase(
          tenantRepository,
          growthOperationalCaseRepository,
        ),
    },
    {
      provide: ReopenTenantGrowthOperationalCaseUseCase,
      inject: [TENANT_REPOSITORY, GROWTH_OPERATIONAL_CASE_REPOSITORY],
      useFactory: (tenantRepository, growthOperationalCaseRepository) =>
        new ReopenTenantGrowthOperationalCaseUseCase(
          tenantRepository,
          growthOperationalCaseRepository,
        ),
    },
    {
      provide: ReviewTenantGrowthOperationalCaseRoutingUseCase,
      inject: [TENANT_REPOSITORY, GROWTH_OPERATIONAL_CASE_REPOSITORY],
      useFactory: (tenantRepository, growthOperationalCaseRepository) =>
        new ReviewTenantGrowthOperationalCaseRoutingUseCase(
          tenantRepository,
          growthOperationalCaseRepository,
        ),
    },
    {
      provide: UpsertTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase,
      inject: [
        TENANT_REPOSITORY,
        GROWTH_OPERATIONAL_CASE_AUTO_ASSIGNMENT_SETTINGS_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        growthOperationalCaseAutoAssignmentSettingsRepository,
      ) =>
        new UpsertTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase(
          tenantRepository,
          growthOperationalCaseAutoAssignmentSettingsRepository,
        ),
    },
    {
      provide: UpdateTenantGrowthOperationalCaseFollowUpStateUseCase,
      inject: [TENANT_REPOSITORY, GROWTH_OPERATIONAL_CASE_REPOSITORY],
      useFactory: (tenantRepository, growthOperationalCaseRepository) =>
        new UpdateTenantGrowthOperationalCaseFollowUpStateUseCase(
          tenantRepository,
          growthOperationalCaseRepository,
        ),
    },
    {
      provide: SendTenantWhatsappConversationMessageUseCase,
      inject: [
        TENANT_REPOSITORY,
        CONVERSATION_THREAD_REPOSITORY,
        CONVERSATION_MESSAGE_REPOSITORY,
        CONVERSATION_MESSAGE_ID_GENERATOR,
        CONVERSATION_DELIVERY_EVENT_REPOSITORY,
        CONVERSATION_DELIVERY_EVENT_ID_GENERATOR,
        WHATSAPP_MESSAGE_TEMPLATE_REPOSITORY,
        WHATSAPP_OUTBOUND_MESSAGE_GATEWAY,
      ],
      useFactory: (
        tenantRepository,
        conversationThreadRepository,
        conversationMessageRepository,
        conversationMessageIdGenerator,
        conversationDeliveryEventRepository,
        conversationDeliveryEventIdGenerator,
        whatsappMessageTemplateRepository,
        whatsappOutboundMessageGateway,
      ) =>
        new SendTenantWhatsappConversationMessageUseCase(
          tenantRepository,
          conversationThreadRepository,
          conversationMessageRepository,
          conversationMessageIdGenerator,
          conversationDeliveryEventRepository,
          conversationDeliveryEventIdGenerator,
          whatsappMessageTemplateRepository,
          whatsappOutboundMessageGateway,
        ),
    },
    {
      provide: RetryTenantWhatsappFailedConversationMessageUseCase,
      inject: [
        TENANT_REPOSITORY,
        CONVERSATION_THREAD_REPOSITORY,
        CONVERSATION_MESSAGE_REPOSITORY,
        CONVERSATION_DELIVERY_EVENT_REPOSITORY,
        SendTenantWhatsappConversationMessageUseCase,
      ],
      useFactory: (
        tenantRepository,
        conversationThreadRepository,
        conversationMessageRepository,
        conversationDeliveryEventRepository,
        sendTenantWhatsappConversationMessageUseCase,
      ) =>
        new RetryTenantWhatsappFailedConversationMessageUseCase(
          tenantRepository,
          conversationThreadRepository,
          conversationMessageRepository,
          conversationDeliveryEventRepository,
          sendTenantWhatsappConversationMessageUseCase,
        ),
    },
    {
      provide: RunTenantWhatsappReadyRetriesUseCase,
      inject: [
        TENANT_REPOSITORY,
        CONVERSATION_MESSAGE_REPOSITORY,
        CONVERSATION_DELIVERY_EVENT_REPOSITORY,
        RetryTenantWhatsappFailedConversationMessageUseCase,
      ],
      useFactory: (
        tenantRepository,
        conversationMessageRepository,
        conversationDeliveryEventRepository,
        retryTenantWhatsappFailedConversationMessageUseCase,
      ) =>
        new RunTenantWhatsappReadyRetriesUseCase(
          tenantRepository,
          conversationMessageRepository,
          conversationDeliveryEventRepository,
          retryTenantWhatsappFailedConversationMessageUseCase,
        ),
    },
    {
      provide: RunTenantWhatsappOperationalMonitorUseCase,
      inject: [
        TENANT_REPOSITORY,
        GetTenantWhatsappOutboundReportingSummaryUseCase,
        RunTenantWhatsappReadyRetriesUseCase,
        WHATSAPP_OPERATIONAL_MONITOR_RUN_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        getTenantWhatsappOutboundReportingSummaryUseCase,
        runTenantWhatsappReadyRetriesUseCase,
        whatsappOperationalMonitorRunRepository,
      ) =>
        new RunTenantWhatsappOperationalMonitorUseCase(
          tenantRepository,
          getTenantWhatsappOutboundReportingSummaryUseCase,
          runTenantWhatsappReadyRetriesUseCase,
          whatsappOperationalMonitorRunRepository,
        ),
    },
    {
      provide: ListTenantWhatsappOperationalMonitorRunsUseCase,
      inject: [TENANT_REPOSITORY, WHATSAPP_OPERATIONAL_MONITOR_RUN_REPOSITORY],
      useFactory: (
        tenantRepository,
        whatsappOperationalMonitorRunRepository,
      ) =>
        new ListTenantWhatsappOperationalMonitorRunsUseCase(
          tenantRepository,
          whatsappOperationalMonitorRunRepository,
        ),
    },
    {
      provide: GetTenantWhatsappOperationalMonitorAnalyticsUseCase,
      inject: [TENANT_REPOSITORY, WHATSAPP_OPERATIONAL_MONITOR_RUN_REPOSITORY],
      useFactory: (
        tenantRepository,
        whatsappOperationalMonitorRunRepository,
      ) =>
        new GetTenantWhatsappOperationalMonitorAnalyticsUseCase(
          tenantRepository,
          whatsappOperationalMonitorRunRepository,
        ),
    },
    {
      provide: ListTenantWhatsappOperationalAlertAcknowledgementsUseCase,
      inject: [
        TENANT_REPOSITORY,
        WHATSAPP_OPERATIONAL_ALERT_ACKNOWLEDGEMENT_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        whatsappOperationalAlertAcknowledgementRepository,
      ) =>
        new ListTenantWhatsappOperationalAlertAcknowledgementsUseCase(
          tenantRepository,
          whatsappOperationalAlertAcknowledgementRepository,
        ),
    },
    {
      provide: AcknowledgeTenantWhatsappOperationalAlertUseCase,
      inject: [
        TENANT_REPOSITORY,
        WHATSAPP_OPERATIONAL_ALERT_ACKNOWLEDGEMENT_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        whatsappOperationalAlertAcknowledgementRepository,
      ) =>
        new AcknowledgeTenantWhatsappOperationalAlertUseCase(
          tenantRepository,
          whatsappOperationalAlertAcknowledgementRepository,
        ),
    },
    {
      provide: DeleteTenantWhatsappOperationalAlertAcknowledgementUseCase,
      inject: [
        TENANT_REPOSITORY,
        WHATSAPP_OPERATIONAL_ALERT_ACKNOWLEDGEMENT_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        whatsappOperationalAlertAcknowledgementRepository,
      ) =>
        new DeleteTenantWhatsappOperationalAlertAcknowledgementUseCase(
          tenantRepository,
          whatsappOperationalAlertAcknowledgementRepository,
        ),
    },
    {
      provide: ExecuteTenantWhatsappAutomationActionsUseCase,
      inject: [
        TENANT_REPOSITORY,
        LEAD_REPOSITORY,
        CONVERSATION_THREAD_REPOSITORY,
        CONVERSATION_MESSAGE_REPOSITORY,
        WHATSAPP_AUTOMATION_RULE_REPOSITORY,
        WHATSAPP_MESSAGE_TEMPLATE_REPOSITORY,
        WHATSAPP_AUTOMATION_EXECUTION_REPOSITORY,
        WHATSAPP_AUTOMATION_EXECUTION_ID_GENERATOR,
        SendTenantWhatsappConversationMessageUseCase,
      ],
      useFactory: (
        tenantRepository,
        leadRepository,
        conversationThreadRepository,
        conversationMessageRepository,
        whatsappAutomationRuleRepository,
        whatsappMessageTemplateRepository,
        whatsappAutomationExecutionRepository,
        whatsappAutomationExecutionIdGenerator,
        sendTenantWhatsappConversationMessageUseCase,
      ) =>
        new ExecuteTenantWhatsappAutomationActionsUseCase(
          tenantRepository,
          leadRepository,
          conversationThreadRepository,
          conversationMessageRepository,
          whatsappAutomationRuleRepository,
          whatsappMessageTemplateRepository,
          whatsappAutomationExecutionRepository,
          whatsappAutomationExecutionIdGenerator,
          sendTenantWhatsappConversationMessageUseCase,
        ),
    },
    {
      provide: ProcessTenantMetaWhatsappWebhookUseCase,
      inject: [
        IngestTenantWhatsappConversationMessageUseCase,
        IngestTenantWhatsappDeliveryEventUseCase,
        ExecuteTenantWhatsappAutomationActionsUseCase,
      ],
      useFactory: (
        ingestTenantWhatsappConversationMessageUseCase,
        ingestTenantWhatsappDeliveryEventUseCase,
        executeTenantWhatsappAutomationActionsUseCase,
      ) =>
        new ProcessTenantMetaWhatsappWebhookUseCase(
          ingestTenantWhatsappConversationMessageUseCase,
          ingestTenantWhatsappDeliveryEventUseCase,
          executeTenantWhatsappAutomationActionsUseCase,
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
