import { INestApplication } from '@nestjs/common';
import { createSign, generateKeyPairSync } from 'node:crypto';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import {
  ChangeTenantPlanUseCase,
  ENTITLEMENT_REPOSITORY,
  GetPlanByKeyUseCase,
  GetTenantEnabledProductByKeyUseCase,
  GetTenantSubscriptionUseCase,
  ListTenantEnabledProductsUseCase,
  ListPlanEntitlementsUseCase,
  ListPlansUseCase,
  ListTenantEntitlementsUseCase,
  PlanNotFoundError,
  SUBSCRIPTION_REPOSITORY,
  SubscriptionNotFoundError,
  TenantProductAccessDeniedError,
} from '@saas-platform/commercial-application';
import {
  Entitlement,
  Plan,
  PlanEntitlement,
  Subscription,
} from '@saas-platform/commercial-domain';
import {
  GetProductByKeyUseCase,
  ListProductModulesUseCase,
  ListProductsUseCase,
  ProductNotFoundError,
} from '@saas-platform/catalog-application';
import { PlatformModule, Product } from '@saas-platform/catalog-domain';
import {
  GetUserByIdUseCase,
  RegisterUserUseCase,
  USER_REPOSITORY,
} from '@saas-platform/identity-application';
import { AuthProvider, User } from '@saas-platform/identity-domain';
import {
  ListTenantFeatureFlagsUseCase,
  SetTenantFeatureFlagUseCase,
} from '@saas-platform/feature-flags-application';
import { FeatureFlag } from '@saas-platform/feature-flags-domain';
import {
  CreateTenantAiGuardedExecutionEventUseCase,
  GetTenantAiSuggestionRunDetailUseCase,
  AiSuggestionRunNotFoundError,
  ListTenantAiApprovalRequestsUseCase,
  ListTenantAiGuardedExecutionEventsUseCase,
  ListTenantAiSuggestionRunsUseCase,
  PrepareTenantAiSuggestionRunUseCase,
  RequestTenantAiSuggestionRunApprovalUseCase,
  ReviewTenantAiApprovalRequestUseCase,
} from '@saas-platform/ai-application';
import {
  AutoAssignTenantGrowthOperationalCasesUseCase,
  AssignTenantConversationThreadUseCase,
  AssignTenantOpportunityUseCase,
  CreateTenantGrowthOperationalCaseUseCase,
  CreateTenantWhatsappAutomationRuleUseCase,
  CreateTenantConversationMessageUseCase,
  CreateTenantConversationThreadUseCase,
  CreateTenantLeadUseCase,
  CreateTenantOpportunityUseCase,
  CreateTenantWhatsappMessageTemplateUseCase,
  ExecuteTenantWhatsappAutomationActionsUseCase,
  GetTenantConversationThreadByIdUseCase,
  GetTenantGrowthAssistDailyAgendaUseCase,
  GetTenantGrowthConversationWorkbenchUseCase,
  GetTenantGrowthAssignmentWorkloadUseCase,
  GetTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase,
  GetTenantLeadByIdUseCase,
  GetTenantOpportunityByIdUseCase,
  GetTenantWhatsappAutomationRuleByIdUseCase,
  GetTenantWhatsappAutomationSuggestionsUseCase,
  GetTenantWhatsappOutboundReportingSummaryUseCase,
  GetTenantWhatsappMessageTemplateByIdUseCase,
  GetTenantWebhookEventEnvelopeByIdUseCase,
  GROWTH_PERMISSIONS,
  IngestTenantWhatsappConversationMessageUseCase,
  IngestTenantWhatsappDeliveryEventUseCase,
  ListTenantConversationMessageDeliveryEventsUseCase,
  ListTenantConversationMessagesUseCase,
  ListTenantGrowthOperationalCasesUseCase,
  ListTenantConversationThreadsUseCase,
  ListTenantLeadsUseCase,
  ListTenantOpportunitiesUseCase,
  ListTenantWebhookEventEnvelopesUseCase,
  ListTenantWhatsappAutomationRulesUseCase,
  ListTenantWhatsappConversationThreadsUseCase,
  ListTenantWhatsappMessageTemplatesUseCase,
  ProcessTenantMetaWhatsappWebhookUseCase,
  ReceiveTenantMetaWhatsappWebhookUseCase,
  ReleaseTenantGrowthOperationalCaseUseCase,
  ReopenTenantGrowthOperationalCaseUseCase,
  ReplayTenantWebhookEventEnvelopeUseCase,
  ReviewTenantGrowthOperationalCaseRoutingUseCase,
  ResolveTenantGrowthOperationalCaseUseCase,
  RetryTenantWhatsappFailedConversationMessageUseCase,
  RunTenantWhatsappOperationalMonitorUseCase,
  RunTenantWhatsappReadyRetriesUseCase,
  SendTenantWhatsappConversationMessageUseCase,
  TakeTenantGrowthOperationalCaseUseCase,
  UpsertTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase,
  UpdateTenantGrowthOperationalCaseFollowUpStateUseCase,
  UpdateTenantOpportunityStageUseCase,
  WebhookEventEnvelopeNotFoundError,
} from '@saas-platform/growth-application';
import {
  ConversationDeliveryEvent,
  ConversationMessage,
  ConversationThread,
  Lead,
  Opportunity,
  WebhookEventEnvelope,
  WhatsappAutomationRule,
  WhatsappMessageTemplate,
} from '@saas-platform/growth-domain';
import {
  CheckTenantInvoiceElectronicAuthorizationUseCase,
  CreateTenantCustomerUseCase,
  CreateTenantCreditNoteUseCase,
  CreateTenantDebitNoteUseCase,
  CreateTenantRemissionGuideUseCase,
  CreateTenantWithholdingUseCase,
  CreateTenantInvoiceUseCase,
  CreateTenantInvoiceItemUseCase,
  CreateTenantInvoicePaymentUseCase,
  CreateTenantTaxRateUseCase,
  GetTenantElectronicSandboxReadinessUseCase,
  InspectTenantElectronicSignatureMaterialUseCase,
  InvoiceElectronicRemoteSubmissionReadinessError,
  InvoiceElectronicXmlValidationError,
  GetTenantElectronicSubmissionSettingsUseCase,
  GetTenantElectronicSignatureSettingsUseCase,
  GetTenantInvoiceNumberingSettingsUseCase,
  GetTenantCustomerByIdUseCase,
  GetTenantInvoiceDetailUseCase,
  GetTenantInvoiceDocumentUseCase,
  GetTenantInvoiceDocumentDraftingAssistUseCase,
  GetTenantInvoiceElectronicXmlPreviewUseCase,
  GetTenantInvoicingReportSummaryUseCase,
  GetTenantInvoiceByIdUseCase,
  GetTenantInvoiceItemByIdUseCase,
  GetTenantIssuerProfileUseCase,
  INVOICING_PERMISSIONS,
  ListTenantCustomersUseCase,
  ListTenantInvoiceItemsUseCase,
  ListTenantInvoicePaymentsUseCase,
  ListTenantInvoiceSummariesUseCase,
  ListTenantInvoicesUseCase,
  ListTenantTaxRatesUseCase,
  ReverseTenantInvoicePaymentUseCase,
  SendTenantInvoiceEmailUseCase,
  SubmitTenantInvoiceElectronicDocumentUseCase,
  SubmitTenantPresignedInvoiceElectronicDocumentUseCase,
  SyncTenantIssuerProfileTaxIdFromSignatureUseCase,
  UpdateTenantInvoiceStatusUseCase,
  UpdateTenantInvoiceElectronicStatusUseCase,
  UpsertTenantElectronicSubmissionSettingsUseCase,
  UpsertTenantElectronicSignatureSettingsUseCase,
  UpsertTenantInvoiceNumberingSettingsUseCase,
  UpsertTenantIssuerProfileUseCase,
} from '@saas-platform/invoicing-application';
import {
  Customer,
  ElectronicSubmissionSettings,
  ElectronicSignatureSettings,
  Invoice,
  InvoiceElectronicEvent,
  InvoiceNumberingSettings,
  InvoiceItem,
  IssuerProfile,
  Payment,
  TaxRate,
} from '@saas-platform/invoicing-domain';
import {
  GetTenantPartyByIdUseCase,
  ListTenantPartiesUseCase,
} from '@saas-platform/parties-application';
import { Party } from '@saas-platform/parties-domain';
import { PrismaService } from '@saas-platform/infra-prisma';
import {
  AcceptTenantInvitationUseCase,
  AssignMembershipRoleUseCase,
  CancelTenantInvitationUseCase,
  CreateTenantUseCase,
  GetAuthenticatedUserInvitationUseCase,
  GetTenantBySlugUseCase,
  GetTenantInvitationByIdUseCase,
  GetTenantMemberAccessUseCase,
  GetTenantMembershipByUserUseCase,
  InviteUserToTenantUseCase,
  ListTenantInvitationsUseCase,
  ListUserPendingInvitationsUseCase,
  ListUserTenanciesUseCase,
  ListTenantMembershipsUseCase,
  RemoveMembershipRoleUseCase,
  ResendTenantInvitationUseCase,
  ResolveTenantAccessUseCase,
  TENANT_PERMISSIONS,
  TenantRoleManagementPolicyError,
} from '@saas-platform/tenancy-application';
import {
  Invitation,
  InvitationStatus,
  Membership,
  MembershipStatus,
  Tenant,
  TenantStatus,
} from '@saas-platform/tenancy-domain';
import { AcceptAuthenticatedUserInvitationUseCase } from '../../../api-platform/src/app/modules/auth/accept-authenticated-user-invitation.use-case';
import { AppModule } from '../../../api-platform/src/app/app.module';
import { configureApp } from '../../../api-platform/src/app/app.setup';
import { MetaWhatsappWebhookSignatureVerifier } from '../../../api-platform/src/app/modules/growth/meta-whatsapp-webhook-signature-verifier';
import { MetaWhatsappWebhookTenantResolver } from '../../../api-platform/src/app/modules/growth/meta-whatsapp-webhook-tenant-resolver';
import { MetaWhatsappWebhookVerifier } from '../../../api-platform/src/app/modules/growth/meta-whatsapp-webhook-verifier';

describe('API', () => {
  let app: INestApplication;
  let httpServer: any;
  let changeTenantPlanUseCase: { execute: jest.Mock };
  let entitlementRepository: { findByTenantId: jest.Mock };
  let getPlanByKeyUseCase: { execute: jest.Mock };
  let getTenantEnabledProductByKeyUseCase: { execute: jest.Mock };
  let getUserByIdUseCase: { execute: jest.Mock };
  let getProductByKeyUseCase: { execute: jest.Mock };
  let getTenantCustomerByIdUseCase: { execute: jest.Mock };
  let getTenantElectronicSubmissionSettingsUseCase: { execute: jest.Mock };
  let getTenantElectronicSandboxReadinessUseCase: { execute: jest.Mock };
  let inspectTenantElectronicSignatureMaterialUseCase: { execute: jest.Mock };
  let getTenantElectronicSignatureSettingsUseCase: { execute: jest.Mock };
  let getTenantInvoiceDetailUseCase: { execute: jest.Mock };
  let getTenantInvoiceDocumentUseCase: { execute: jest.Mock };
  let getTenantInvoiceDocumentDraftingAssistUseCase: { execute: jest.Mock };
  let getTenantInvoiceElectronicXmlPreviewUseCase: { execute: jest.Mock };
  let getTenantInvoiceNumberingSettingsUseCase: { execute: jest.Mock };
  let getTenantInvoicingReportSummaryUseCase: { execute: jest.Mock };
  let getTenantInvoiceByIdUseCase: { execute: jest.Mock };
  let getTenantInvoiceItemByIdUseCase: { execute: jest.Mock };
  let getTenantIssuerProfileUseCase: { execute: jest.Mock };
  let getTenantPartyByIdUseCase: { execute: jest.Mock };
  let getTenantConversationThreadByIdUseCase: { execute: jest.Mock };
  let getTenantGrowthAssistDailyAgendaUseCase: { execute: jest.Mock };
  let listTenantAiApprovalRequestsUseCase: { execute: jest.Mock };
  let createTenantAiGuardedExecutionEventUseCase: { execute: jest.Mock };
  let getTenantAiSuggestionRunDetailUseCase: { execute: jest.Mock };
  let listTenantAiGuardedExecutionEventsUseCase: { execute: jest.Mock };
  let listTenantAiSuggestionRunsUseCase: { execute: jest.Mock };
  let prepareTenantAiSuggestionRunUseCase: { execute: jest.Mock };
  let requestTenantAiSuggestionRunApprovalUseCase: { execute: jest.Mock };
  let reviewTenantAiApprovalRequestUseCase: { execute: jest.Mock };
  let getTenantGrowthConversationWorkbenchUseCase: { execute: jest.Mock };
  let getTenantGrowthAssignmentWorkloadUseCase: { execute: jest.Mock };
  let getTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase: {
    execute: jest.Mock;
  };
  let getTenantLeadByIdUseCase: { execute: jest.Mock };
  let getTenantOpportunityByIdUseCase: { execute: jest.Mock };
  let getTenantWhatsappAutomationRuleByIdUseCase: { execute: jest.Mock };
  let getTenantWhatsappAutomationSuggestionsUseCase: { execute: jest.Mock };
  let getTenantWhatsappOutboundReportingSummaryUseCase: { execute: jest.Mock };
  let getTenantWhatsappMessageTemplateByIdUseCase: { execute: jest.Mock };
  let getTenantWebhookEventEnvelopeByIdUseCase: { execute: jest.Mock };
  let getTenantSubscriptionUseCase: { execute: jest.Mock };
  let executeTenantWhatsappAutomationActionsUseCase: { execute: jest.Mock };
  let ingestTenantWhatsappConversationMessageUseCase: { execute: jest.Mock };
  let ingestTenantWhatsappDeliveryEventUseCase: { execute: jest.Mock };
  let processTenantMetaWhatsappWebhookUseCase: { execute: jest.Mock };
  let receiveTenantMetaWhatsappWebhookUseCase: { execute: jest.Mock };
  let reopenTenantGrowthOperationalCaseUseCase: { execute: jest.Mock };
  let replayTenantWebhookEventEnvelopeUseCase: { execute: jest.Mock };
  let autoAssignTenantGrowthOperationalCasesUseCase: { execute: jest.Mock };
  let reviewTenantGrowthOperationalCaseRoutingUseCase: { execute: jest.Mock };
  let resolveTenantGrowthOperationalCaseUseCase: { execute: jest.Mock };
  let retryTenantWhatsappFailedConversationMessageUseCase: { execute: jest.Mock };
  let runTenantWhatsappOperationalMonitorUseCase: { execute: jest.Mock };
  let runTenantWhatsappReadyRetriesUseCase: { execute: jest.Mock };
  let releaseTenantGrowthOperationalCaseUseCase: { execute: jest.Mock };
  let takeTenantGrowthOperationalCaseUseCase: { execute: jest.Mock };
  let upsertTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase: {
    execute: jest.Mock;
  };
  let updateTenantGrowthOperationalCaseFollowUpStateUseCase: {
    execute: jest.Mock;
  };
  let metaWhatsappWebhookSignatureVerifier: {
    isConfigured: jest.Mock;
    verify: jest.Mock;
  };
  let metaWhatsappWebhookTenantResolver: { resolve: jest.Mock };
  let listTenantCustomersUseCase: { execute: jest.Mock };
  let listTenantPartiesUseCase: { execute: jest.Mock };
  let listTenantInvoiceItemsUseCase: { execute: jest.Mock };
  let listTenantInvoicePaymentsUseCase: { execute: jest.Mock };
  let listTenantInvoiceSummariesUseCase: { execute: jest.Mock };
  let listTenantInvoicesUseCase: { execute: jest.Mock };
  let listTenantTaxRatesUseCase: { execute: jest.Mock };
  let listTenantEnabledProductsUseCase: { execute: jest.Mock };
  let listTenantFeatureFlagsUseCase: { execute: jest.Mock };
  let listTenantConversationMessagesUseCase: { execute: jest.Mock };
  let listTenantConversationMessageDeliveryEventsUseCase: { execute: jest.Mock };
  let listTenantGrowthOperationalCasesUseCase: { execute: jest.Mock };
  let listTenantConversationThreadsUseCase: { execute: jest.Mock };
  let listTenantLeadsUseCase: { execute: jest.Mock };
  let listTenantOpportunitiesUseCase: { execute: jest.Mock };
  let listTenantWebhookEventEnvelopesUseCase: { execute: jest.Mock };
  let listTenantWhatsappAutomationRulesUseCase: { execute: jest.Mock };
  let listTenantWhatsappConversationThreadsUseCase: { execute: jest.Mock };
  let listTenantWhatsappMessageTemplatesUseCase: { execute: jest.Mock };
  let listPlanEntitlementsUseCase: { execute: jest.Mock };
  let listPlansUseCase: { execute: jest.Mock };
  let registerUserUseCase: { execute: jest.Mock };
  let subscriptionRepository: { findByTenantId: jest.Mock };
  let userRepository: {
    findById: jest.Mock;
    findByEmail: jest.Mock;
    save: jest.Mock;
  };
  let assignMembershipRoleUseCase: { execute: jest.Mock };
  let acceptAuthenticatedUserInvitationUseCase: { execute: jest.Mock };
  let acceptTenantInvitationUseCase: { execute: jest.Mock };
  let cancelTenantInvitationUseCase: { execute: jest.Mock };
  let getAuthenticatedUserInvitationUseCase: { execute: jest.Mock };
  let getTenantBySlugUseCase: { execute: jest.Mock };
  let getTenantInvitationByIdUseCase: { execute: jest.Mock };
  let getTenantMemberAccessUseCase: { execute: jest.Mock };
  let getTenantMembershipByUserUseCase: { execute: jest.Mock };
  let inviteUserToTenantUseCase: { execute: jest.Mock };
  let listProductModulesUseCase: { execute: jest.Mock };
  let listProductsUseCase: { execute: jest.Mock };
  let listTenantInvitationsUseCase: { execute: jest.Mock };
  let listTenantEntitlementsUseCase: { execute: jest.Mock };
  let listUserPendingInvitationsUseCase: { execute: jest.Mock };
  let listUserTenanciesUseCase: { execute: jest.Mock };
  let listTenantMembershipsUseCase: { execute: jest.Mock };
  let removeMembershipRoleUseCase: { execute: jest.Mock };
  let resendTenantInvitationUseCase: { execute: jest.Mock };
  let resolveTenantAccessUseCase: { execute: jest.Mock };
  let setTenantFeatureFlagUseCase: { execute: jest.Mock };
  let createTenantCustomerUseCase: { execute: jest.Mock };
  let createTenantConversationMessageUseCase: { execute: jest.Mock };
  let createTenantConversationThreadUseCase: { execute: jest.Mock };
  let createTenantGrowthOperationalCaseUseCase: { execute: jest.Mock };
  let createTenantLeadUseCase: { execute: jest.Mock };
  let createTenantOpportunityUseCase: { execute: jest.Mock };
  let createTenantWhatsappAutomationRuleUseCase: { execute: jest.Mock };
  let createTenantWhatsappMessageTemplateUseCase: { execute: jest.Mock };
  let assignTenantConversationThreadUseCase: { execute: jest.Mock };
  let assignTenantOpportunityUseCase: { execute: jest.Mock };
  let sendTenantWhatsappConversationMessageUseCase: { execute: jest.Mock };
  let createTenantCreditNoteUseCase: { execute: jest.Mock };
  let createTenantDebitNoteUseCase: { execute: jest.Mock };
  let createTenantRemissionGuideUseCase: { execute: jest.Mock };
  let createTenantWithholdingUseCase: { execute: jest.Mock };
  let createTenantInvoiceUseCase: { execute: jest.Mock };
  let createTenantInvoiceItemUseCase: { execute: jest.Mock };
  let createTenantInvoicePaymentUseCase: { execute: jest.Mock };
  let createTenantTaxRateUseCase: { execute: jest.Mock };
  let checkTenantInvoiceElectronicAuthorizationUseCase: { execute: jest.Mock };
  let reverseTenantInvoicePaymentUseCase: { execute: jest.Mock };
  let sendTenantInvoiceEmailUseCase: { execute: jest.Mock };
  let submitTenantInvoiceElectronicDocumentUseCase: { execute: jest.Mock };
  let submitTenantPresignedInvoiceElectronicDocumentUseCase: { execute: jest.Mock };
  let updateTenantOpportunityStageUseCase: { execute: jest.Mock };
  let updateTenantInvoiceStatusUseCase: { execute: jest.Mock };
  let updateTenantInvoiceElectronicStatusUseCase: { execute: jest.Mock };
  let upsertTenantElectronicSubmissionSettingsUseCase: { execute: jest.Mock };
  let upsertTenantElectronicSignatureSettingsUseCase: { execute: jest.Mock };
  let upsertTenantInvoiceNumberingSettingsUseCase: { execute: jest.Mock };
  let upsertTenantIssuerProfileUseCase: { execute: jest.Mock };
  let syncTenantIssuerProfileTaxIdFromSignatureUseCase: { execute: jest.Mock };
  let metaWhatsappWebhookVerifier: { verify: jest.Mock };
  let createTenantUseCase: { execute: jest.Mock };
  let ownerToken: string;
  let inviteeToken: string;
  let memberToken: string;
  let issuer: string;
  let audience: string;

  const registeredAt = new Date('2026-04-14T17:00:00.000Z');
  const tenantCreatedAt = new Date('2026-04-14T17:30:00.000Z');
  const invitationCreatedAt = new Date('2026-04-22T20:00:00.000Z');
  const commercialCreatedAt = new Date('2026-04-23T18:00:00.000Z');
  const ownerTenantPermissionKeys = [
    TENANT_PERMISSIONS.READ,
    TENANT_PERMISSIONS.MEMBERSHIPS_READ,
    TENANT_PERMISSIONS.MEMBERSHIP_ACCESS_READ,
    TENANT_PERMISSIONS.MEMBERSHIP_ROLES_MANAGE,
    TENANT_PERMISSIONS.INVITATIONS_MANAGE,
    TENANT_PERMISSIONS.SUBSCRIPTION_READ,
    TENANT_PERMISSIONS.SUBSCRIPTION_MANAGE,
    TENANT_PERMISSIONS.ENTITLEMENTS_READ,
    TENANT_PERMISSIONS.FEATURE_FLAGS_READ,
    TENANT_PERMISSIONS.FEATURE_FLAGS_MANAGE,
    INVOICING_PERMISSIONS.CUSTOMERS_READ,
    INVOICING_PERMISSIONS.CUSTOMERS_MANAGE,
    INVOICING_PERMISSIONS.INVOICES_READ,
    INVOICING_PERMISSIONS.INVOICES_MANAGE,
    INVOICING_PERMISSIONS.PAYMENTS_READ,
    INVOICING_PERMISSIONS.PAYMENTS_MANAGE,
    INVOICING_PERMISSIONS.TAXES_READ,
    INVOICING_PERMISSIONS.TAXES_MANAGE,
    INVOICING_PERMISSIONS.NOTIFICATIONS_SEND,
    INVOICING_PERMISSIONS.REPORTS_READ,
    GROWTH_PERMISSIONS.CONVERSATIONS_READ,
    GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE,
    GROWTH_PERMISSIONS.LEADS_READ,
    GROWTH_PERMISSIONS.LEADS_MANAGE,
    GROWTH_PERMISSIONS.OPPORTUNITIES_READ,
    GROWTH_PERMISSIONS.OPPORTUNITIES_MANAGE,
  ];
  const user = User.create({
    id: 'user_123',
    email: 'hello@saas-platform.dev',
    name: 'Jorge',
    avatarUrl: null,
    authProvider: AuthProvider.Password,
    externalAuthId: null,
    preferredTenantId: null,
    createdAt: registeredAt,
    updatedAt: registeredAt,
  });
  const tenant = Tenant.create({
    id: 'tenant_123',
    name: 'SaaS Platform',
    slug: 'saas-platform',
    status: TenantStatus.Draft,
    createdAt: tenantCreatedAt,
    updatedAt: tenantCreatedAt,
  });
  const membership = Membership.create({
    id: 'membership_123',
    tenantId: 'tenant_123',
    userId: 'user_123',
    status: MembershipStatus.Active,
    invitedBy: 'user_123',
    createdAt: tenantCreatedAt,
    updatedAt: tenantCreatedAt,
  });
  const secondaryTenant = Tenant.create({
    id: 'tenant_456',
    name: 'Analytics Workspace',
    slug: 'analytics-workspace',
    status: TenantStatus.Active,
    createdAt: new Date('2026-04-15T10:00:00.000Z'),
    updatedAt: new Date('2026-04-15T10:00:00.000Z'),
  });
  const secondaryMembership = Membership.create({
    id: 'membership_456',
    tenantId: 'tenant_456',
    userId: 'user_123',
    status: MembershipStatus.Active,
    invitedBy: 'user_999',
    createdAt: new Date('2026-04-15T10:00:00.000Z'),
    updatedAt: new Date('2026-04-15T10:00:00.000Z'),
  });
  const invitation = Invitation.create({
    id: 'invitation_123',
    tenantId: 'tenant_123',
    email: 'invitee@saas-platform.dev',
    roleKey: 'tenant_member',
    status: InvitationStatus.Pending,
    invitedByUserId: 'user_123',
    acceptedByUserId: null,
    expiresAt: new Date('2026-04-29T20:00:00.000Z'),
    acceptedAt: null,
    createdAt: invitationCreatedAt,
    updatedAt: invitationCreatedAt,
  });
  const invoicingProduct = Product.create({
    id: 'product_invoicing',
    key: 'invoicing',
    name: 'Invoicing',
    description: 'Facturacion, clientes, catalogo y reportes.',
    isActive: true,
    createdAt: new Date('2026-04-23T17:00:00.000Z'),
    updatedAt: new Date('2026-04-23T17:00:00.000Z'),
  });
  const psychologyProduct = Product.create({
    id: 'product_psychology',
    key: 'psychology',
    name: 'Psychology',
    description: 'Gestion de profesionales, pacientes y sesiones.',
    isActive: true,
    createdAt: new Date('2026-04-23T17:00:00.000Z'),
    updatedAt: new Date('2026-04-23T17:00:00.000Z'),
  });
  const invoicingModules = [
    PlatformModule.create({
      id: 'module_invoicing_customers',
      productId: 'product_invoicing',
      key: 'customers',
      name: 'Customers',
      description: 'Gestion de clientes.',
      isCore: true,
      isActive: true,
      createdAt: new Date('2026-04-23T17:00:00.000Z'),
      updatedAt: new Date('2026-04-23T17:00:00.000Z'),
    }),
    PlatformModule.create({
      id: 'module_invoicing_invoices',
      productId: 'product_invoicing',
      key: 'invoices',
      name: 'Invoices',
      description: 'Emision de facturas.',
      isCore: true,
      isActive: true,
      createdAt: new Date('2026-04-23T17:00:00.000Z'),
      updatedAt: new Date('2026-04-23T17:00:00.000Z'),
    }),
  ];
  const growthPlan = Plan.create({
    id: 'plan_growth_monthly',
    key: 'growth',
    name: 'Growth',
    description: 'Plan para equipos en crecimiento con multiples capacidades activas.',
    priceInCents: 9900,
    currency: 'USD',
    billingCycle: 'monthly',
    isActive: true,
    createdAt: commercialCreatedAt,
    updatedAt: commercialCreatedAt,
  });
  const enterprisePlan = Plan.create({
    id: 'plan_enterprise_monthly',
    key: 'enterprise',
    name: 'Enterprise',
    description: 'Plan avanzado con acceso amplio a productos y limites elevados.',
    priceInCents: 29900,
    currency: 'USD',
    billingCycle: 'monthly',
    isActive: true,
    createdAt: commercialCreatedAt,
    updatedAt: commercialCreatedAt,
  });
  const growthPlanEntitlements = [
    PlanEntitlement.create({
      id: 'plan_entitlement_growth_products',
      planId: 'plan_growth_monthly',
      key: 'products',
      value: ['invoicing', 'learning'],
      createdAt: commercialCreatedAt,
      updatedAt: commercialCreatedAt,
    }),
    PlanEntitlement.create({
      id: 'plan_entitlement_growth_max_users',
      planId: 'plan_growth_monthly',
      key: 'max_users',
      value: 15,
      createdAt: commercialCreatedAt,
      updatedAt: commercialCreatedAt,
    }),
  ];
  const tenantSubscription = Subscription.create({
    id: 'subscription_123',
    tenantId: 'tenant_123',
    planId: 'plan_growth_monthly',
    status: 'active',
    startedAt: commercialCreatedAt,
    expiresAt: null,
    trialEndsAt: null,
    createdAt: commercialCreatedAt,
    updatedAt: commercialCreatedAt,
  });
  const tenantEntitlements = [
    Entitlement.create({
      id: 'entitlement_tenant_123_max_users',
      tenantId: 'tenant_123',
      key: 'max_users',
      value: 15,
      source: 'plan',
      createdAt: commercialCreatedAt,
      updatedAt: commercialCreatedAt,
    }),
    Entitlement.create({
      id: 'entitlement_tenant_123_products',
      tenantId: 'tenant_123',
      key: 'products',
      value: ['invoicing', 'learning'],
      source: 'plan',
      createdAt: commercialCreatedAt,
      updatedAt: commercialCreatedAt,
    }),
  ];
  const psychologyProductDisabledFlag = FeatureFlag.create({
    id: 'feature_flag_tenant_123_product.psychology.enabled',
    tenantId: 'tenant_123',
    key: 'product.psychology.enabled',
    enabled: false,
    createdAt: commercialCreatedAt,
    updatedAt: commercialCreatedAt,
  });
  const customerCreatedAt = new Date('2026-04-27T15:00:00.000Z');
  const acmeCustomer = Customer.create({
    id: 'customer_acme',
    tenantId: 'tenant_123',
    name: 'Acme Corp',
    email: 'billing@acme.dev',
    taxId: '1790012345001',
    identificationType: '04',
    identification: '1790012345001',
    billingAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
    createdAt: customerCreatedAt,
    updatedAt: customerCreatedAt,
  });
  const globexCustomer = Customer.create({
    id: 'customer_globex',
    tenantId: 'tenant_123',
    name: 'Globex LLC',
    email: null,
    taxId: null,
    identificationType: null,
    identification: null,
    billingAddress: null,
    createdAt: new Date('2026-04-27T15:10:00.000Z'),
    updatedAt: new Date('2026-04-27T15:10:00.000Z'),
  });
  const acmeParty = Party.create({
    id: 'customer_acme',
    tenantId: 'tenant_123',
    displayName: 'Acme Corp',
    email: 'billing@acme.dev',
    taxId: '1790012345001',
    identificationType: '04',
    identification: '1790012345001',
    billingAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
    roles: ['customer'],
    kind: 'organization',
    sourceContext: 'invoicing_customer',
    createdAt: customerCreatedAt,
    updatedAt: customerCreatedAt,
  });
  const globexParty = Party.create({
    id: 'customer_globex',
    tenantId: 'tenant_123',
    displayName: 'Globex LLC',
    email: null,
    taxId: null,
    identificationType: null,
    identification: null,
    billingAddress: null,
    roles: ['customer'],
    kind: 'unknown',
    sourceContext: 'invoicing_customer',
    createdAt: new Date('2026-04-27T15:10:00.000Z'),
    updatedAt: new Date('2026-04-27T15:10:00.000Z'),
  });
  const capturedLead = Lead.create({
    id: 'lead_001',
    tenantId: 'tenant_123',
    fullName: 'Maria Perez',
    email: 'maria@example.com',
    phoneE164: '+593999111222',
    whatsappE164: '+593999111222',
    source: 'landing_page',
    status: 'captured',
    notes: 'Quiere demo del modulo de facturacion.',
    createdAt: new Date('2026-05-15T14:30:00.000Z'),
    updatedAt: new Date('2026-05-15T14:30:00.000Z'),
  });
  const qualifiedLead = Lead.create({
    id: 'lead_002',
    tenantId: 'tenant_123',
    fullName: 'Carlos Mena',
    email: null,
    phoneE164: '+593988000777',
    whatsappE164: null,
    source: 'whatsapp_campaign',
    status: 'qualified',
    notes: null,
    createdAt: new Date('2026-05-15T13:10:00.000Z'),
    updatedAt: new Date('2026-05-15T13:10:00.000Z'),
  });
  const conversationThread = ConversationThread.create({
    id: 'thread_001',
    tenantId: 'tenant_123',
    leadId: 'lead_001',
    assigneeUserId: null,
    subject: 'Demo de onboarding facturacion',
    channel: 'manual',
    externalConversationId: null,
    participantDisplayName: null,
    participantHandle: null,
    status: 'open',
    latestMessagePreview: 'Hola Maria, te comparto los siguientes pasos para la demo.',
    messageCount: 2,
    openedAt: new Date('2026-05-15T14:40:00.000Z'),
    closedAt: null,
    lastActivityAt: new Date('2026-05-15T14:45:00.000Z'),
    createdAt: new Date('2026-05-15T14:40:00.000Z'),
    updatedAt: new Date('2026-05-15T14:45:00.000Z'),
  });
  const firstConversationMessage = ConversationMessage.create({
    id: 'message_001',
    tenantId: 'tenant_123',
    threadId: 'thread_001',
    direction: 'outbound',
    body: 'Hola Maria, te comparto los siguientes pasos para la demo.',
    templateId: null,
    outboundIntentKey: null,
    provider: null,
    deliveryStatus: null,
    externalMessageId: null,
    failureReason: null,
    deliveredAt: null,
    readAt: null,
    createdAt: new Date('2026-05-15T14:40:00.000Z'),
  });
  const secondConversationMessage = ConversationMessage.create({
    id: 'message_002',
    tenantId: 'tenant_123',
    threadId: 'thread_001',
    direction: 'inbound',
    body: 'Perfecto, quedo atenta a la hora de la llamada.',
    templateId: null,
    outboundIntentKey: null,
    provider: null,
    deliveryStatus: null,
    externalMessageId: null,
    failureReason: null,
    deliveredAt: null,
    readAt: null,
    createdAt: new Date('2026-05-15T14:45:00.000Z'),
  });
  const whatsappConversationThread = ConversationThread.create({
    id: 'thread_whatsapp_001',
    tenantId: 'tenant_123',
    leadId: 'lead_001',
    assigneeUserId: null,
    subject: 'Maria Perez',
    channel: 'whatsapp',
    externalConversationId: 'wa_conv_001',
    participantDisplayName: 'Maria Perez',
    participantHandle: '+593999111222',
    status: 'open',
    latestMessagePreview: 'Hola, quiero retomar la propuesta.',
    messageCount: 1,
    openedAt: new Date('2026-05-16T14:00:00.000Z'),
    closedAt: null,
    lastActivityAt: new Date('2026-05-16T14:00:00.000Z'),
    createdAt: new Date('2026-05-16T14:00:00.000Z'),
    updatedAt: new Date('2026-05-16T14:00:00.000Z'),
  });
  const inboundWhatsappMessage = ConversationMessage.create({
    id: 'message_whatsapp_001',
    tenantId: 'tenant_123',
    threadId: 'thread_whatsapp_001',
    direction: 'inbound',
    body: 'Hola, quiero retomar la propuesta.',
    templateId: null,
    outboundIntentKey: null,
    provider: 'meta_cloud_api_stub',
    deliveryStatus: 'delivered',
    externalMessageId: 'wamid-001',
    failureReason: null,
    deliveredAt: new Date('2026-05-16T14:00:10.000Z'),
    readAt: null,
    createdAt: new Date('2026-05-16T14:00:00.000Z'),
  });
  const outboundWhatsappMessage = ConversationMessage.create({
    id: 'message_whatsapp_002',
    tenantId: 'tenant_123',
    threadId: 'thread_whatsapp_001',
    direction: 'outbound',
    body: 'Perfecto, te escribo en unos minutos.',
    templateId: null,
    outboundIntentKey: 'follow_up',
    provider: 'meta_cloud_api_stub',
    deliveryStatus: 'pending',
    externalMessageId: 'wamid-002',
    failureReason: null,
    deliveredAt: null,
    readAt: null,
    createdAt: new Date('2026-05-16T14:05:00.000Z'),
  });
  const failedOutboundWhatsappMessage = ConversationMessage.create({
    ...outboundWhatsappMessage.toPrimitives(),
    deliveryStatus: 'failed',
    failureReason: 'temporary_provider_timeout',
  });
  const retriedOutboundWhatsappMessage = ConversationMessage.create({
    id: 'message_whatsapp_003',
    tenantId: 'tenant_123',
    threadId: 'thread_whatsapp_001',
    direction: 'outbound',
    body: 'Perfecto, te escribo en unos minutos.',
    templateId: null,
    outboundIntentKey: 'follow_up',
    provider: 'meta_cloud_api_stub',
    deliveryStatus: 'pending',
    externalMessageId: 'wamid-003',
    failureReason: null,
    deliveredAt: null,
    readAt: null,
    createdAt: new Date('2026-05-16T14:12:00.000Z'),
  });
  const whatsappDeliveryEvent = ConversationDeliveryEvent.create({
    id: 'delivery_event_001',
    tenantId: 'tenant_123',
    messageId: 'message_whatsapp_002',
    provider: 'meta_cloud_api_stub',
    eventKey: 'wamid-002:delivered:0:0:0',
    providerEventId: 'status:wamid-002',
    externalMessageId: 'wamid-002',
    deliveryStatus: 'delivered',
    failureReason: null,
    providerStatusDetail: 'conversation:service;pricing:utility',
    providerConversationCategory: 'service',
    providerPricingCategory: 'utility',
    providerErrorCode: null,
    payloadJson: '{"status":"delivered"}',
    occurredAt: new Date('2026-05-16T14:06:00.000Z'),
    createdAt: new Date('2026-05-16T14:06:00.000Z'),
  });
  const qualifiedOpportunity = Opportunity.create({
    id: 'opportunity_001',
    tenantId: 'tenant_123',
    leadId: 'lead_001',
    threadId: 'thread_001',
    assigneeUserId: null,
    title: 'Onboarding anual facturacion electronica',
    stage: 'proposal',
    amountInCents: 199000,
    currency: 'USD',
    notes: 'Cliente con alto interes y decision esta semana.',
    closedAt: null,
    createdAt: new Date('2026-05-15T15:00:00.000Z'),
    updatedAt: new Date('2026-05-15T15:20:00.000Z'),
  });
  const growthAssignmentWorkload = {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-05-18T16:00:00.000Z'),
    totals: {
      openThreadCount: 2,
      unassignedOpenThreadCount: 1,
      openOpportunityCount: 2,
      unassignedOpenOpportunityCount: 1,
      openOpportunityAmountInCents: 289000,
    },
    assignees: [
      {
        userId: 'user_456',
        displayName: 'Maria Sales',
        email: 'sales@saas-platform.dev',
        openThreadCount: 1,
        openWhatsappThreadCount: 1,
        openManualThreadCount: 0,
        openOpportunityCount: 1,
        openOpportunityAmountInCents: 199000,
        wonOpportunityCount: 0,
        lostOpportunityCount: 0,
      },
      {
        userId: 'user_123',
        displayName: 'Jorge',
        email: 'hello@saas-platform.dev',
        openThreadCount: 0,
        openWhatsappThreadCount: 0,
        openManualThreadCount: 0,
        openOpportunityCount: 0,
        openOpportunityAmountInCents: 0,
        wonOpportunityCount: 0,
        lostOpportunityCount: 0,
      },
    ],
  };
  const growthConversationWorkbench = {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-05-19T16:45:00.000Z'),
    policy: {
      firstResponseSlaHours: 1,
      followUpSlaHours: 12,
      staleThreadHours: 48,
    },
    summary: {
      openThreadCount: 2,
      unassignedThreadCount: 1,
      waitingOnTeamCount: 1,
      waitingOnCustomerCount: 1,
      overdueFirstResponseCount: 0,
      overdueFollowUpCount: 0,
      staleThreadCount: 0,
    },
    threads: [
      {
        threadId: 'thread_001',
        leadId: 'lead_001',
        assigneeUserId: null,
        subject: 'Demo de onboarding facturacion',
        channel: 'manual',
        status: 'open',
        latestMessagePreview:
          'Hola Maria, te comparto los siguientes pasos para la demo.',
        nextActionOwner: 'customer',
        firstResponseStatus: 'not_applicable',
        followUpStatus: 'not_applicable',
        staleStatus: 'fresh',
        priority: 'normal',
        messageCount: 2,
        hoursSinceLastActivity: 1.5,
        hoursSinceLastInbound: 1.5,
        hoursSinceOpened: 1.58,
        openedAt: new Date('2026-05-15T14:40:00.000Z'),
        lastActivityAt: new Date('2026-05-15T14:45:00.000Z'),
        lastInboundAt: new Date('2026-05-15T14:45:00.000Z'),
        lastOutboundAt: new Date('2026-05-15T14:40:00.000Z'),
      },
      {
        threadId: 'thread_whatsapp_001',
        leadId: 'lead_001',
        assigneeUserId: null,
        subject: 'Maria Perez',
        channel: 'whatsapp',
        status: 'open',
        latestMessagePreview: 'Hola, quiero retomar la propuesta.',
        nextActionOwner: 'team',
        firstResponseStatus: 'not_applicable',
        followUpStatus: 'pending',
        staleStatus: 'fresh',
        priority: 'high',
        messageCount: 1,
        hoursSinceLastActivity: 0.75,
        hoursSinceLastInbound: 0.75,
        hoursSinceOpened: 0.75,
        openedAt: new Date('2026-05-16T14:00:00.000Z'),
        lastActivityAt: new Date('2026-05-16T14:00:00.000Z'),
        lastInboundAt: new Date('2026-05-16T14:00:00.000Z'),
        lastOutboundAt: null,
      },
    ],
  };
  const whatsappOutboundReportingSummary = {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-05-18T16:30:00.000Z'),
    totals: {
      outboundMessageCount: 3,
      freeformMessageCount: 1,
      templateMessageCount: 2,
      approvedTemplateMessageCount: 1,
      pendingCount: 1,
      sentCount: 0,
      deliveredCount: 1,
      readCount: 0,
      failedCount: 1,
      immediateSendRejectionFailedCount: 1,
      asynchronousDeliveryFailedCount: 0,
      retryableFailedCount: 1,
      permanentFailedCount: 0,
    },
    byIntent: [
      {
        outboundIntentKey: 'follow_up',
        messageCount: 2,
        pendingCount: 1,
        sentCount: 0,
        deliveredCount: 1,
        readCount: 0,
        failedCount: 0,
      },
      {
        outboundIntentKey: 'renewal_offer',
        messageCount: 1,
        pendingCount: 0,
        sentCount: 0,
        deliveredCount: 0,
        readCount: 0,
        failedCount: 1,
      },
    ],
    byTemplate: [
      {
        templateId: 'template_001',
        templateKey: 'follow_up_demo',
        templateName: 'Follow Up Demo',
        providerTemplateName: 'follow_up_demo_meta',
        providerApprovalStatus: 'approved',
        messageCount: 1,
        pendingCount: 1,
        sentCount: 0,
        deliveredCount: 0,
        readCount: 0,
        failedCount: 0,
      },
      {
        templateId: 'template_002',
        templateKey: 'renewal_offer_demo',
        templateName: 'Renewal Offer Demo',
        providerTemplateName: 'renewal_offer_demo_meta',
        providerApprovalStatus: 'pending_review',
        messageCount: 1,
        pendingCount: 0,
        sentCount: 0,
        deliveredCount: 0,
        readCount: 0,
        failedCount: 1,
      },
    ],
    byProvider: [
      {
        provider: 'meta_cloud_api_stub',
        messageCount: 2,
        pendingCount: 1,
        sentCount: 0,
        deliveredCount: 1,
        readCount: 0,
        failedCount: 0,
      },
      {
        provider: 'meta_cloud_api',
        messageCount: 1,
        pendingCount: 0,
        sentCount: 0,
        deliveredCount: 0,
        readCount: 0,
        failedCount: 1,
      },
    ],
    byFailureClass: [
      {
        provider: 'meta_cloud_api',
        failureClass: 'rate_limited',
        failurePhase: 'immediate_send_rejection',
        messageCount: 1,
        retryableCount: 1,
        permanentCount: 0,
      },
    ],
    byProviderTaxonomy: [
      {
        provider: 'meta_cloud_api',
        providerTaxonomyFamily: 'throughput_limit',
        providerTaxonomyDetail: 'meta_pair_rate_limit',
        failureClass: 'rate_limited',
        failurePhase: 'immediate_send_rejection',
        messageCount: 1,
        retryableCount: 1,
        permanentCount: 0,
      },
    ],
    topProviderErrorCodes: [
      {
        provider: 'meta_cloud_api',
        providerErrorCode: '131053',
        failureClass: 'rate_limited',
        failurePhase: 'immediate_send_rejection',
        retryDisposition: 'retryable',
        providerTaxonomyFamily: 'throughput_limit',
        providerTaxonomyDetail: 'meta_pair_rate_limit',
        occurrenceCount: 1,
        latestFailureReason: 'rate_limit_hit',
        latestProviderStatusDetail: 'temporary_throttle',
      },
    ],
    retryOperations: {
      totalFailedMessageCount: 1,
      retryableFailedMessageCount: 1,
      permanentFailedMessageCount: 0,
      cooldownBlockedCount: 0,
      readyNowCount: 1,
      defaultBaseBackoffMinutes: 5,
      maxBackoffMinutes: 180,
    },
    operationalThresholds: {
      immediateSendRejectionRateWarning: 0.05,
      asynchronousDeliveryFailureRateWarning: 0.03,
      readyRetryQueueWarningCount: 1,
      cooldownRetryQueueWarningCount: 3,
      authOrConfigurationCriticalCount: 1,
      policyBlockCriticalCount: 1,
      rateLimitedWarningCount: 1,
      unknownFailureWarningCount: 1,
    },
    operationalDashboard: {
      overallStatus: 'warning',
      immediateSendRejectionRate: 0.3333,
      asynchronousDeliveryFailureRate: 0,
      readyRetryQueueCount: 1,
      cooldownRetryQueueCount: 0,
      permanentFailureCount: 0,
      leadingFailureClass: 'rate_limited',
      leadingProvider: 'meta_cloud_api',
      leadingProviderTaxonomyFamily: 'throughput_limit',
      leadingProviderTaxonomyDetail: 'meta_pair_rate_limit',
    },
    operationalAlerts: [
      {
        key: 'immediate_send_rejection_rate',
        severity: 'warning',
        title: 'Immediate send rejection rate is elevated',
        summary:
          'Immediate outbound rejections reached 33.33% of outbound traffic.',
        thresholdKey: 'immediateSendRejectionRateWarning',
        observedValue: 0.3333,
        thresholdValue: 0.05,
        thresholdUnit: 'rate',
        provider: 'meta_cloud_api',
        failureClass: 'rate_limited',
        providerTaxonomyFamily: 'throughput_limit',
        providerTaxonomyDetail: 'meta_pair_rate_limit',
        affectedMessageCount: 1,
        recommendedAction:
          'Inspect provider-facing failures before throughput or template automation keeps amplifying the rejection rate.',
      },
      {
        key: 'rate_limit:meta_cloud_api:meta_pair_rate_limit',
        severity: 'warning',
        title: 'Provider throttling is affecting outbound throughput',
        summary:
          '1 outbound failures were classified as provider throttling or rate limiting.',
        thresholdKey: 'rateLimitedWarningCount',
        observedValue: 1,
        thresholdValue: 1,
        thresholdUnit: 'count',
        provider: 'meta_cloud_api',
        failureClass: 'rate_limited',
        providerTaxonomyFamily: 'throughput_limit',
        providerTaxonomyDetail: 'meta_pair_rate_limit',
        affectedMessageCount: 1,
        recommendedAction:
          'Reduce burst size, watch retry queue growth, and consider staggering automation traffic.',
      },
      {
        key: 'retry_queue_ready',
        severity: 'warning',
        title: 'Retry queue has ready-now messages',
        summary:
          '1 failed outbound messages are ready for retry execution now.',
        thresholdKey: 'readyRetryQueueWarningCount',
        observedValue: 1,
        thresholdValue: 1,
        thresholdUnit: 'count',
        provider: null,
        failureClass: null,
        providerTaxonomyFamily: null,
        providerTaxonomyDetail: null,
        affectedMessageCount: 1,
        recommendedAction:
          'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
      },
    ],
  };
  const whatsappRetryRunnerSummary = {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-05-19T09:15:00.000Z'),
    limitApplied: 10,
    candidateFailedMessageCount: 3,
    leafFailedMessageCount: 2,
    supersededFailedMessageCount: 1,
    readyNowCount: 1,
    retriedCount: 1,
    skippedCooldownCount: 1,
    skippedPermanentCount: 0,
    executions: [
      {
        sourceMessageId: 'message_whatsapp_002',
        sourceExternalMessageId: 'wamid-002',
        disposition: 'retryable',
        status: 'retried',
        failedAttemptCount: 1,
        backoffMinutes: 5,
        nextRetryAt: new Date('2026-05-16T14:11:00.000Z'),
        retryMessageId: 'message_whatsapp_003',
        retryExternalMessageId: 'wamid-003',
      },
      {
        sourceMessageId: 'message_whatsapp_004',
        sourceExternalMessageId: 'wamid-004',
        disposition: 'retryable',
        status: 'skipped_cooldown',
        failedAttemptCount: 1,
        backoffMinutes: 5,
        nextRetryAt: new Date('2026-05-16T14:18:00.000Z'),
        retryMessageId: null,
        retryExternalMessageId: null,
      },
    ],
  };
  const whatsappOperationalMonitorSummary = {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-05-20T10:00:00.000Z'),
    autoRunReadyRetriesEnabled: true,
    overallStatus: 'warning',
    totalAlertCount: 3,
    criticalAlertCount: 0,
    warningAlertCount: 3,
    operationalThresholds: whatsappOutboundReportingSummary.operationalThresholds,
    operationalDashboard: whatsappOutboundReportingSummary.operationalDashboard,
    operationalAlerts: whatsappOutboundReportingSummary.operationalAlerts,
    retryRunnerExecuted: true,
    retryRunnerSummary: whatsappRetryRunnerSummary,
  };
  const growthOperationalCase = {
    id: 'op-case-001',
    tenantId: 'tenant_123',
    sourceKey: 'alert:retry_queue_ready',
    caseType: 'alert_escalation' as const,
    status: 'open' as const,
    priority: 'warning' as const,
    title: 'Retry queue has ready-now messages',
    summary: '1 failed outbound messages are ready for retry execution now.',
    nextAction:
      'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
    followUpState: null,
    routingPolicyKey: 'growth_ops' as const,
    threadId: null,
    alertKey: 'retry_queue_ready',
    dueAt: new Date('2026-05-20T11:00:00.000Z'),
    assignedUserId: null,
    assignedUserEmail: null,
    createdByUserId: 'user_123',
    createdByEmail: 'hello@saas-platform.dev',
    resolvedAt: null,
    resolvedByUserId: null,
    resolvedByEmail: null,
    createdAt: new Date('2026-05-20T10:05:00.000Z'),
    updatedAt: new Date('2026-05-20T10:05:00.000Z'),
  };
  const growthOperationalCaseAutoAssignmentSettings = {
    id: 'tenant_123:growth-operational-case-auto-assignment-settings',
    tenantId: 'tenant_123',
    defaultPolicyKey: 'follow_up_first' as const,
    createdAt: new Date('2026-05-20T10:00:00.000Z'),
    updatedAt: new Date('2026-05-20T10:32:00.000Z'),
  };
  const growthAssistDailyAgenda = {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-05-20T10:36:00.000Z'),
    summary: {
      tone: 'warning' as const,
      headline: 'La bandeja no esta rota, pero si hay seguimientos que no conviene dejar enfriar.',
      detail:
        'Usa esta agenda como recordatorio simple: primero sigue lo que ya esta caliente, luego reparte owner nuevo si hace falta.',
      replyNowCount: 1,
      followUpNowCount: 2,
      waitingCustomerCount: 0,
      queueToOrganizeCount: 1,
      channelRiskCount: 0,
      savedPolicyKey: 'follow_up_first' as const,
    },
    leadWarmthSummary: {
      hotCount: 1,
      warmCount: 0,
      watchCount: 0,
      dominantWarmth: 'hot' as const,
      recommendedFocus:
        'Prioriza respuestas o seguimientos que ya estan pidiendo movimiento hoy.',
    },
    tasks: [
      {
        key: 'reply:thread_001',
        urgency: 'today' as const,
        category: 'reply_now' as const,
        title: 'Responder a WhatsApp Maria Perez',
        summary: 'WhatsApp lleva 2 horas esperando una respuesta del equipo.',
        actionLabel: 'Asignar y responder',
        dueAt: new Date('2026-05-20T08:00:00.000Z'),
        threadId: 'thread_001',
        operationalCaseId: null,
      },
    ],
    conversationCues: [
      {
        key: 'thread_001',
        warmth: 'hot' as const,
        title: 'WhatsApp Maria Perez',
        summary: 'WhatsApp · ultima actividad hace 2 horas · Hola, quisiera una demo.',
        suggestedReply:
          'Hola WhatsApp Maria Perez, gracias por escribirnos. Quiero retomar esto hoy mismo y dejarte el siguiente paso claro.',
        nextMove: 'Primero deja owner claro y luego responde.',
        threadId: 'thread_001',
      },
    ],
    replySuggestions: [
      {
        key: 'reply-suggestion:thread_001',
        warmth: 'hot' as const,
        title: 'WhatsApp Maria Perez',
        reason: 'La conversacion sigue sin primera respuesta despues de 2 horas.',
        goal:
          'Reconocer el contacto, retomar confianza y proponer el siguiente paso.',
        suggestedReply:
          'Hola WhatsApp Maria Perez, gracias por escribirnos. Retomo esto hoy para ayudarte sin dejarlo enfriar. Si te parece, te comparto el siguiente paso y lo dejamos encaminado ahora mismo.',
        followUpPrompt:
          'Pregunta si prefiere demo, cotizacion o una respuesta puntual para destrabar la conversacion.',
        checklist: [
          'Deja un owner claro antes de cerrar el siguiente paso.',
          'Agradece el contacto y reconoce la espera si aplica.',
          'Propón un siguiente paso concreto en lugar de una pregunta abierta genérica.',
          'Cierra con una pregunta simple que facilite responder rápido.',
        ],
        threadId: 'thread_001',
      },
    ],
    nextActions: [
      {
        key: 'next-action:reply:thread_001',
        emphasis: 'do_now' as const,
        actionType: 'reply_now' as const,
        title: 'Responder a WhatsApp Maria Perez',
        whyNow: 'WhatsApp lleva 2 horas esperando una respuesta del equipo.',
        recommendedAction:
          'Responder hoy mismo y cerrar con un siguiente paso concreto.',
        businessImpact:
          'Responder tarde enfria conversaciones que ya llegaron con intencion activa.',
        threadId: 'thread_001',
        operationalCaseId: null,
      },
    ],
    leadWarmthHints: [
      {
        key: 'warmth:thread_001',
        warmth: 'hot' as const,
        title: 'WhatsApp Maria Perez',
        signalSummary:
          'WhatsApp · ultima actividad hace 2 horas · Hola, quisiera una demo.',
        whyWarmth:
          'Se ve caliente porque ya pide respuesta o seguimiento del equipo y puede enfriarse rapido.',
        recommendedCadence: 'Muévelo hoy mismo.',
        riskNote: 'Si se demora, puedes perder la intención más fuerte.',
        threadId: 'thread_001',
      },
    ],
    playbooks: [
      {
        key: 'reply-now',
        title: 'Responder primero',
        detail:
          'Antes de abrir nueva prospeccion, responde lo que ya llego caliente. Esa es la forma mas simple de no perder conversion por demora.',
        goal:
          'Recuperar velocidad de respuesta y dejar un siguiente paso claro sin sonar robotico.',
        avoid:
          'No contestes con un texto generico que ignore el contexto ni dejes la conversacion abierta sin siguiente paso.',
        successSignal:
          'El lead responde o acepta el siguiente paso dentro de la misma ventana de seguimiento.',
        whenToUse:
          'Cuando hay conversaciones sin primera respuesta o follow-up vencido.',
        steps: [
          'Agradece el contacto y retoma el contexto en una frase simple.',
          'Propone un siguiente paso concreto para hoy.',
          'Cierra con una pregunta que facilite una respuesta corta.',
        ],
      },
    ],
    waitingCustomerQueue: [],
    channelHealth: {
      overallStatus: 'healthy' as const,
      totalAlertCount: 0,
      readyRetryCount: 0,
      topAlertTitle: null,
      topAlertSummary: null,
      topAlertRecommendedAction: null,
    },
  };
  const invoiceDocumentDraftingAssist = {
    tenantSlug: 'saas-platform',
    generatedAt: new Date('2026-05-23T10:30:00.000Z'),
    summary: {
      tone: 'warning' as const,
      readinessStatus: 'needs_attention' as const,
      headline:
        'El tenant ya puede apoyarse en sugerencias, aunque conviene revisar detalles antes de empujar documentos.',
      detail:
        'Usa esta superficie para ordenar checklist, documentar riesgos y preparar mejor la revision humana.',
      suggestedFocus:
        'Conviene revisar vigencia del certificado antes de empujar mas documentos.',
    },
    checklist: [
      {
        key: 'issuer_profile',
        label: 'Perfil fiscal',
        status: 'ready' as const,
        detail: 'Configurado para pruebas con RUC 1790012345001.',
      },
      {
        key: 'signature_material',
        label: 'Material de firma',
        status: 'warning' as const,
        detail: 'Conviene revisar vigencia del certificado.',
      },
    ],
    documentGuidance: [
      {
        documentCode: '01' as const,
        label: 'Factura',
        status: 'ready' as const,
        detail: 'Documento listo para trabajar.',
        recommendedUse:
          'Usalo para preparar facturas nuevas y revisar si el tenant ya tiene base suficiente para emitirlas sin improvisar.',
      },
      {
        documentCode: '04' as const,
        label: 'Nota de credito',
        status: 'blocked' as const,
        detail: 'Falta numeracion.',
        recommendedUse:
          'Usalo cuando haya que corregir o anular una factura previa con criterio documentado.',
      },
    ],
    reportSnapshot: {
      customerCount: 3,
      invoiceCount: 9,
      outstandingTotalInCents: 145000,
      dominantStatus: 'issued',
      busiestMonth: '2026-05',
    },
    draftingHints: [
      {
        key: 'drafting-brief',
        title: 'Brief de preparacion',
        objective:
          'Explicar que piezas conviene completar antes de redactar o revisar un comprobante.',
        whenToUse:
          'Cuando el operador necesita una guia corta para entender si el tenant esta listo o todavia tiene huecos.',
        recommendedInputs: ['Resumen del checklist formal', 'Estado de numeracion y firma'],
        caution:
          'Toma la sugerencia como checklist guiado y no como validacion fiscal final.',
      },
    ],
    safeActions: ['Explicar checklist'],
    blockedActions: [
      'Firmar electronicamente el documento sin aprobacion humana.',
    ],
  };
  const whatsappMessageTemplate = WhatsappMessageTemplate.create({
    id: 'template_001',
    tenantId: 'tenant_123',
    key: 'follow_up_demo',
    name: 'Follow Up Demo',
    languageCode: 'es_EC',
    category: 'utility',
    bodyTemplate: 'Hola {{firstName}}, retomamos la demo de {{product}}.',
    intentKey: 'follow_up',
    providerTemplateName: 'follow_up_demo_meta',
    providerApprovalStatus: 'approved',
    status: 'active',
    createdAt: new Date('2026-05-18T15:30:00.000Z'),
    updatedAt: new Date('2026-05-18T15:30:00.000Z'),
  });
  const whatsappAutomationRule = WhatsappAutomationRule.create({
    id: 'automation_001',
    tenantId: 'tenant_123',
    key: 'follow_up_unassigned',
    name: 'Follow Up Unassigned',
    triggerEvent: 'inbound_message',
    matchOutboundIntentKey: 'follow_up',
    matchDeliveryStatus: null,
    matchAssigneeMode: 'unassigned',
    templateId: 'template_001',
    actionType: 'suggest_template',
    actionOutboundIntentKey: 'follow_up',
    status: 'active',
    createdAt: new Date('2026-05-18T15:40:00.000Z'),
    updatedAt: new Date('2026-05-18T15:40:00.000Z'),
  });
  const whatsappAutomationSuggestions = {
    tenantSlug: 'saas-platform',
    threadId: 'thread_whatsapp_001',
    generatedAt: new Date('2026-05-19T09:00:00.000Z'),
    suggestions: [
      {
        ruleId: 'automation_001',
        ruleKey: 'follow_up_unassigned',
        ruleName: 'Follow Up Unassigned',
        triggerEvent: 'inbound_message',
        actionType: 'suggest_template',
        actionOutboundIntentKey: 'follow_up',
        templateId: 'template_001',
        templateKey: 'follow_up_demo',
        templateName: 'Follow Up Demo',
        providerTemplateName: 'follow_up_demo_meta',
        providerApprovalStatus: 'approved',
        bodyTemplatePreview:
          'Hola {{firstName}}, retomamos la demo de {{product}}.',
      },
    ],
  };
  const growthAssistSuggestionRun = {
    id: 'ai-run-001',
    tenantId: 'tenant_123',
    tenantSlug: 'saas-platform',
    agentKey: 'growth-assist-coach',
    mode: 'suggestion' as const,
    status: 'prepared' as const,
    surfaceKey: 'growth_assist_daily_agenda',
    sourceContractKey: 'growth.assist.daily_agenda',
    sourceGeneratedAt: new Date('2026-05-20T10:36:00.000Z'),
    promptPackKey: 'growth-assist-coach-core',
    promptPackVersion: 'v1',
    generatedAt: new Date('2026-05-20T10:36:00.000Z'),
    requestedByUserId: user.id,
    requestedByEmail: user.email,
    summary:
      'Growth Assist Coach prepared a suggestion-mode handoff for Growth Assist daily agenda using prompt pack growth-assist-coach-core@v1.',
    suggestedOutputKeys: ['reply_draft', 'next_action_brief', 'follow_up_plan'],
    approvalSummary: {
      status: 'pending' as const,
      totalRequests: 1,
      latestRequestId: 'ai-approval-001',
      latestPolicyKey: 'growth-assist-suggestion-review',
      latestRequestedAt: new Date('2026-05-20T10:38:00.000Z'),
      latestReviewedAt: null,
    },
    envelope: {
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-20T10:36:00.000Z'),
      mode: 'suggestion' as const,
      agent: {
        key: 'growth-assist-coach',
        title: 'Growth Assist Coach',
        summary:
          'Turns deterministic Growth Assist signals into tenant-scoped commercial suggestions without executing actions automatically.',
        domainKey: 'growth' as const,
        productKey: 'growth',
        availability: 'ready' as const,
        defaultMode: 'suggestion' as const,
        supportedSurfaceKeys: ['growth_assist_daily_agenda'],
      },
      surface: {
        key: 'growth_assist_daily_agenda',
        title: 'Growth Assist daily agenda',
        sourceContractKey: 'growth.assist.daily_agenda',
        sourceGeneratedAt: new Date('2026-05-20T10:36:00.000Z'),
      },
      promptPack: {
        key: 'growth-assist-coach-core',
        version: 'v1',
        agentKey: 'growth-assist-coach',
        mode: 'suggestion' as const,
        title: 'Growth Assist Coach Core',
        summary:
          'Prompt pack for turning deterministic Growth Assist agenda signals into commercial suggestions for non-expert operators.',
        objective:
          'Propose clear commercial suggestions for a non-expert operator using the deterministic Growth Assist agenda as the source of truth.',
        styleGuidance: [
          'Prefer short, direct, Spanish-first suggestions.',
          'Explain business impact in simple operator language instead of internal queue jargon.',
          'Keep outputs practical and oriented to what the business should do today.',
        ],
        constraints: [
          'Stay in suggestion mode only. Do not assume messages are sent or cases are mutated automatically.',
          'Use only the tenant-scoped Growth Assist agenda and its embedded operational signals.',
          'Prefer short, direct, Spanish-first suggestions that help a small business operator move today.',
          'Respect domain boundaries: business rules, approvals, and workflow state still belong to Growth.',
        ],
        suggestedOutputs: [
          {
            key: 'reply_draft',
            label: 'Reply draft',
            description:
              'Draft a customer-facing WhatsApp reply using the hottest conversation cues and reply suggestions.',
          },
          {
            key: 'next_action_brief',
            label: 'Next action brief',
            description:
              'Explain the top commercial action to take now and why it matters today.',
          },
          {
            key: 'follow_up_plan',
            label: 'Follow-up plan',
            description:
              'Suggest a short follow-up sequence grounded in playbooks and waiting-customer timing.',
          },
        ],
      },
      contextBlocks: [
        {
          key: 'agenda_summary',
          title: 'Agenda summary',
          detail:
            'La bandeja no esta rota, pero si hay seguimientos que no conviene dejar enfriar. Usa esta agenda como recordatorio simple: primero sigue lo que ya esta caliente, luego reparte owner nuevo si hace falta.',
          bullets: [
            'Reply now count: 1',
            'Follow-up now count: 2',
            'Waiting customer count: 0',
            'Queue to organize count: 1',
            'Channel risk count: 0',
            'Saved auto-assignment policy: follow_up_first',
          ],
        },
      ],
    },
    createdAt: new Date('2026-05-20T10:37:00.000Z'),
  };
  const growthAssistApprovalRequest = {
    id: 'ai-approval-001',
    tenantId: 'tenant_123',
    tenantSlug: 'saas-platform',
    agentKey: 'growth-assist-coach',
    policyKey: 'growth-assist-suggestion-review',
    scope: 'suggestion_review' as const,
    suggestionRunId: 'ai-run-001',
    requestedByUserId: user.id,
    requestedByEmail: user.email,
    rationale: 'Quiero dejar trazable la revisión humana.',
    summary:
      'Growth Assist Coach requested human review for suggestion handoff ai-run-001 under policy growth-assist-suggestion-review.',
    status: 'pending' as const,
    reviewedAt: null,
    reviewedByUserId: null,
    reviewedByEmail: null,
    reviewNote: null,
    createdAt: new Date('2026-05-20T10:38:00.000Z'),
    updatedAt: new Date('2026-05-20T10:38:00.000Z'),
  };
  const whatsappWebhookEnvelope = WebhookEventEnvelope.create({
    id: 'webhook-envelope-001',
    tenantId: 'tenant_123',
    provider: 'meta_cloud_api_stub',
    channel: 'whatsapp',
    eventKey: 'event-key-001',
    providerEventId: 'message:wamid-001',
    payloadHash: 'payload-hash-001',
    signatureHeader: 'sha256=test-signature',
    objectType: 'whatsapp_business_account',
    externalAccountId: 'waba-001',
    externalPhoneNumberId: '1234567890',
    status: 'processed',
    replayCount: 0,
    lastReplayedAt: null,
    processedInboundMessages: 1,
    processedDeliveryEvents: 1,
    failureReason: null,
    payloadJson: '{"object":"whatsapp_business_account"}',
    receivedAt: new Date('2026-05-18T15:00:00.000Z'),
    processedAt: new Date('2026-05-18T15:00:01.000Z'),
    createdAt: new Date('2026-05-18T15:00:00.000Z'),
    updatedAt: new Date('2026-05-18T15:00:01.000Z'),
  });
  const invoiceCreatedAt = new Date('2026-04-27T16:00:00.000Z');
  const draftInvoice = Invoice.create({
    id: 'invoice_001',
    tenantId: 'tenant_123',
    customerId: 'customer_acme',
    number: 'INV-001',
    buyerIdentificationType: '04',
    buyerIdentification: '1790012345001',
    buyerName: 'Acme Corp',
    buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
    status: 'draft',
    currency: 'USD',
    issuedAt: invoiceCreatedAt,
    dueAt: new Date('2026-05-11T16:00:00.000Z'),
    notes: 'Primer borrador para onboarding de invoicing.',
    createdAt: invoiceCreatedAt,
    updatedAt: invoiceCreatedAt,
  });
  const issuedInvoice = Invoice.create({
    id: 'invoice_002',
    tenantId: 'tenant_123',
    customerId: 'customer_globex',
    number: 'INV-002',
    buyerIdentificationType: null,
    buyerIdentification: null,
    buyerName: 'Globex LLC',
    buyerAddress: null,
    status: 'partially_paid',
    currency: 'USD',
    issuedAt: new Date('2026-04-27T17:00:00.000Z'),
    dueAt: null,
    notes: null,
    createdAt: new Date('2026-04-27T17:00:00.000Z'),
    updatedAt: new Date('2026-04-27T17:00:00.000Z'),
  });
  const invoiceItemCreatedAt = new Date('2026-04-27T16:05:00.000Z');
  const vatTaxRate = TaxRate.create({
    id: 'tax_rate_vat_12',
    tenantId: 'tenant_123',
    name: 'VAT 12%',
    percentage: 12,
    isActive: true,
    createdAt: new Date('2026-04-28T12:00:00.000Z'),
    updatedAt: new Date('2026-04-28T12:00:00.000Z'),
  });
  const firstInvoiceItem = InvoiceItem.create({
    id: 'invoice_item_001',
    tenantId: 'tenant_123',
    invoiceId: 'invoice_001',
    position: 1,
    description: 'Suscripcion mensual Growth',
    quantity: 2,
    unitPriceInCents: 5000,
    lineTotalInCents: 10000,
    taxRateId: 'tax_rate_vat_12',
    taxRateName: 'VAT 12%',
    taxRatePercentage: 12,
    lineTaxInCents: 1200,
    createdAt: invoiceItemCreatedAt,
    updatedAt: invoiceItemCreatedAt,
  });
  const secondInvoiceItem = InvoiceItem.create({
    id: 'invoice_item_002',
    tenantId: 'tenant_123',
    invoiceId: 'invoice_001',
    position: 2,
    description: 'Setup inicial',
    quantity: 1,
    unitPriceInCents: 2500,
    lineTotalInCents: 2500,
    taxRateId: null,
    taxRateName: null,
    taxRatePercentage: null,
    lineTaxInCents: 0,
    createdAt: new Date('2026-04-27T16:06:00.000Z'),
    updatedAt: new Date('2026-04-27T16:06:00.000Z'),
  });
  const receivedPayment = Payment.create({
    id: 'payment_001',
    tenantId: 'tenant_123',
    invoiceId: 'invoice_002',
    amountInCents: 2500,
    currency: 'USD',
    status: 'posted',
    method: 'bank_transfer',
    reference: 'PAY-001',
    paidAt: new Date('2026-04-28T21:00:00.000Z'),
    notes: 'Abono inicial de prueba.',
    reversedAt: null,
    reversalReason: null,
    createdAt: new Date('2026-04-28T21:00:00.000Z'),
    updatedAt: new Date('2026-04-28T21:00:00.000Z'),
  });
  const issuerProfile = IssuerProfile.create({
    id: 'issuer_profile_001',
    tenantId: 'tenant_123',
    legalName: 'SaaS Platform S.A.',
    commercialName: 'SaaS Platform',
    taxId: '1790012345001',
    environment: 'test',
    emissionType: 'normal',
    accountingObligated: true,
    specialTaxpayerCode: null,
    rimpeTaxpayerType: null,
    matrixAddress: 'Av. Principal y Calle Secundaria',
    establishmentAddress: 'Sucursal Matriz',
    createdAt: new Date('2026-04-29T16:00:00.000Z'),
    updatedAt: new Date('2026-04-29T16:00:00.000Z'),
  });
  const electronicSignatureSettings = ElectronicSignatureSettings.create({
    id: 'signature_settings_001',
    tenantId: 'tenant_123',
    provider: 'stub_local',
    certificateLabel: 'Firma pruebas SaaS Platform',
    storageMode: 'stub_inline',
    certificateFingerprint: 'AA:BB:CC:DD',
    pkcs12SecretRef: null,
    privateKeyPasswordSecretRef: null,
    subjectName: null,
    isActive: true,
    createdAt: new Date('2026-05-01T16:50:00.000Z'),
    updatedAt: new Date('2026-05-01T16:50:00.000Z'),
  });
  const electronicSignatureMaterialInspection = {
    tenantSlug: 'saas-platform',
    signatureProvider: 'stub_local',
    certificateLabel: 'Firma pruebas SaaS Platform',
    storageMode: 'stub_inline',
    isActive: true,
    materialConfigured: true,
    inspection: {
      status: 'not_applicable' as const,
      detail:
        'El provider actual no usa PKCS#12. Esta inspeccion solo aplica al carril de firma interna xades_pkcs12.',
      encoding: 'not_applicable' as const,
      probeMethod: 'not_applicable' as const,
      certificateValidityStatus: 'not_applicable' as const,
      cryptographicProofStatus: 'not_applicable' as const,
      cryptographicProofDetail:
        'El provider actual no usa PKCS#12. La prueba criptografica no aplica.',
      passwordPresent: false,
      hasAdvisoryWarning: false,
      fingerprintPresent: true,
      subjectNamePresent: false,
      extractedFingerprint: null,
      extractedTaxId: null,
      extractedSubjectName: null,
      extractedIssuerName: null,
      validFrom: null,
      validUntil: null,
      daysUntilExpiry: null,
      byteLength: null,
    },
  };
  const electronicSubmissionSettings = ElectronicSubmissionSettings.create({
    id: 'submission_settings_001',
    tenantId: 'tenant_123',
    provider: 'stub_sri',
    environment: 'test',
    transmissionMode: 'sync_stub',
    receptionUrl: null,
    authorizationUrl: null,
    credentialsSecretRef: null,
    timeoutMs: 10000,
    isActive: true,
    createdAt: new Date('2026-05-01T17:20:00.000Z'),
    updatedAt: new Date('2026-05-01T17:20:00.000Z'),
  });
  const electronicSandboxReadiness = {
    tenantSlug: 'saas-platform',
    stage: 'electronic_invoicing_ec_mvp' as const,
    environment: 'test' as const,
    signatureProvider: 'stub_local',
    submissionProvider: 'stub_sri',
    transmissionMode: 'sync_stub',
    internalSignerMaterialStatus: 'not_applicable' as const,
    internalSignerMaterialDetail:
      'El provider actual no usa PKCS#12. Esta inspeccion solo aplica al carril de firma interna xades_pkcs12.',
    isInternalSignerMaterialReady: false,
    internalSignerCertificateValidityStatus: 'not_applicable' as const,
    internalSignerCertificateValidityDetail:
      'La vigencia del certificado no aplica para providers que no usan PKCS#12.',
    internalSignerCertificateValidUntil: null,
    isInternalSignerCertificateCurrentlyValid: false,
    internalSignerCryptoProofStatus: 'not_applicable' as const,
    internalSignerCryptoProofDetail:
      'La prueba criptografica no aplica para providers que no usan PKCS#12.',
    isInternalSignerCryptographicallyReady: false,
    internalSignerOfflineCompatibilityStatus: 'not_applicable' as const,
    internalSignerOfflineCompatibilityDetail:
      'La compatibilidad offline local no aplica para providers que no usan PKCS#12.',
    isInternalSignerOfflineCompatible: false,
    internalSignerIssuerAlignmentStatus: 'not_applicable' as const,
    internalSignerIssuerAlignmentDetail:
      'La alineacion entre certificado y emisor no aplica para providers que no usan PKCS#12.',
    internalSignerExtractedTaxId: null,
    isInternalSignerIssuerAligned: false,
    latestRemoteSriSubmissionStatus: null,
    latestRemoteSriSubmissionSummary: null,
    latestRemoteSriSubmissionCategory: null,
    latestRemoteSriSubmissionOccurredAt: null,
    isReadyForLocalStubSubmission: true,
    isReadyForRemoteSandboxSubmission: false,
    isReadyForPresignedRemoteSandboxSubmission: false,
    blockers: [
      'La firma stub_local sirve para demos y previews, pero no genera una firma valida para el esquema offline del SRI.',
      'El provider actual sigue siendo stub_sri; para sandbox real debe usarse sri_offline_ws.',
    ],
    warnings: [],
    checks: [
      {
        key: 'issuer_profile',
        label: 'Perfil fiscal',
        status: 'ready' as const,
        detail: 'Configurado para test con RUC 1790012345001.',
      },
      {
        key: 'signature_material_probe',
        label: 'Inspeccion estructural PKCS#12',
        status: 'ready' as const,
        detail:
          'El provider actual no usa PKCS#12. Esta inspeccion solo aplica al carril de firma interna xades_pkcs12.',
      },
      {
        key: 'signature_certificate_validity',
        label: 'Vigencia del certificado',
        status: 'ready' as const,
        detail:
          'La vigencia del certificado no aplica para providers que no usan PKCS#12.',
      },
      {
        key: 'signature_crypto_proof',
        label: 'Prueba criptografica interna',
        status: 'ready' as const,
        detail:
          'La prueba criptografica no aplica para providers que no usan PKCS#12.',
      },
      {
        key: 'signature_offline_probe',
        label: 'Compatibilidad offline local',
        status: 'ready' as const,
        detail:
          'La compatibilidad offline local no aplica para providers que no usan PKCS#12.',
      },
      {
        key: 'signature_issuer_alignment',
        label: 'Alineacion emisor-certificado',
        status: 'ready' as const,
        detail:
          'La alineacion entre certificado y emisor no aplica para providers que no usan PKCS#12.',
      },
      {
        key: 'signature_capability',
        label: 'Capacidad de firma real',
        status: 'blocked' as const,
        detail:
          'La firma stub_local sirve para demos y previews, pero no genera una firma valida para el esquema offline del SRI.',
      },
      {
        key: 'submission_transport',
        label: 'Transporte remoto',
        status: 'blocked' as const,
        detail:
          'El provider actual sigue siendo stub_sri; para sandbox real debe usarse sri_offline_ws.',
      },
    ],
    documentSupport: [
      {
        documentCode: '01' as const,
        label: 'Factura ECU (01)',
        numberingConfigured: true,
        previewAvailable: true,
        rideAvailable: true,
        schemaValidationAvailable: true,
        submitSupported: true,
        detail:
          'La factura 01 ya tiene preview XML, RIDE, validacion XSD y el carril de submit electronico habilitado.',
      },
      {
        documentCode: '04' as const,
        label: 'Nota de credito ECU (04)',
        numberingConfigured: true,
        previewAvailable: true,
        rideAvailable: true,
        schemaValidationAvailable: true,
        submitSupported: true,
        detail:
          'La nota de credito 04 ya tiene preview XML, RIDE y validacion XSD local. El carril de submit electronico ya puede probarse con la misma frontera tecnica del documento 01.',
      },
      {
        documentCode: '05' as const,
        label: 'Nota de debito ECU (05)',
        numberingConfigured: true,
        previewAvailable: true,
        rideAvailable: true,
        schemaValidationAvailable: true,
        submitSupported: true,
        detail:
          'La nota de debito 05 ya tiene draft, preview XML, RIDE y validacion XSD local. El carril de submit electronico queda habilitado sobre la misma frontera tecnica multi-documento.',
      },
      {
        documentCode: '06' as const,
        label: 'Guia de remision ECU (06)',
        numberingConfigured: true,
        previewAvailable: true,
        rideAvailable: true,
        schemaValidationAvailable: true,
        submitSupported: true,
        detail:
          'La guia de remision 06 ya tiene draft, preview XML, RIDE y validacion XSD local. El carril de submit electronico queda habilitado sobre la misma frontera tecnica multi-documento.',
      },
      {
        documentCode: '07' as const,
        label: 'Comprobante de retencion ECU (07)',
        numberingConfigured: true,
        previewAvailable: true,
        rideAvailable: true,
        schemaValidationAvailable: true,
        submitSupported: true,
        detail:
          'El comprobante de retencion 07 ya tiene draft, preview XML, RIDE y validacion XSD local. El carril de submit electronico queda habilitado sobre la misma frontera tecnica multi-documento.',
      },
    ],
    recommendedNextStep:
      'El tenant puede seguir validando el pipeline interno con stub local mientras termina de cerrar el camino remoto.',
  };
  const invoiceElectronicEvent = InvoiceElectronicEvent.create({
    id: 'invoice_event_001',
    tenantId: 'tenant_123',
    invoiceId: 'invoice_001',
    eventType: 'submission',
    provider: 'stub_sri',
    providerStatus: 'submitted',
    endpoint: null,
    soapAction: null,
    message: 'Documento enviado al gateway stub del SRI.',
    requestPayload: '{"gateway":"stub_sri"}',
    responsePayload: '{"state":"submitted"}',
    submissionReference: 'stub-sri-invoice_001-123456789',
    authorizationNumber: null,
    occurredAt: new Date('2026-05-01T18:00:00.000Z'),
  });
  const sriRejectedInvoiceElectronicEvent = InvoiceElectronicEvent.create({
    id: 'invoice_event_sri_001',
    tenantId: 'tenant_123',
    invoiceId: 'invoice_001',
    eventType: 'submission',
    provider: 'sri_offline_ws',
    providerStatus: 'DEVUELTA',
    endpoint:
      'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl',
    soapAction: 'validarComprobante',
    message:
      '35 - ARCHIVO NO CUMPLE ESTRUCTURA XML · No existe un contribuyente registrado con el RUC 1790012345001',
    requestPayload: '<soap:Envelope>request</soap:Envelope>',
    responsePayload: `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <ns2:validarComprobanteResponse xmlns:ns2="http://ec.gob.sri.ws.recepcion">
            <RespuestaRecepcionComprobante>
              <estado>DEVUELTA</estado>
              <comprobantes>
                <comprobante>
                  <claveAcceso>120520260117900123450010010020000000011234567815</claveAcceso>
                  <mensajes>
                    <mensaje>
                      <identificador>35</identificador>
                      <mensaje>ARCHIVO NO CUMPLE ESTRUCTURA XML</mensaje>
                      <informacionAdicional>No existe un contribuyente registrado con el RUC 1790012345001</informacionAdicional>
                    </mensaje>
                  </mensajes>
                </comprobante>
              </comprobantes>
            </RespuestaRecepcionComprobante>
          </ns2:validarComprobanteResponse>
        </soap:Body>
      </soap:Envelope>
    `,
    submissionReference: 'SRI-HTTP-invoice_001-1778815396909',
    authorizationNumber: null,
    occurredAt: new Date('2026-05-14T15:39:56.909Z'),
  });
  const invoiceNumberingSettings = InvoiceNumberingSettings.create({
    id: 'invoice_numbering_001',
    tenantId: 'tenant_123',
    documentCode: '01',
    establishmentCode: '001',
    emissionPointCode: '002',
    nextSequenceNumber: 31,
    createdAt: new Date('2026-04-29T16:05:00.000Z'),
    updatedAt: new Date('2026-04-29T16:05:00.000Z'),
  });
  const creditNoteNumberingSettings = InvoiceNumberingSettings.create({
    id: 'invoice_numbering_004',
    tenantId: 'tenant_123',
    documentCode: '04',
    establishmentCode: '003',
    emissionPointCode: '001',
    nextSequenceNumber: 12,
    createdAt: new Date('2026-04-29T16:10:00.000Z'),
    updatedAt: new Date('2026-04-29T16:10:00.000Z'),
  });
  const debitNoteNumberingSettings = InvoiceNumberingSettings.create({
    id: 'invoice_numbering_005',
    tenantId: 'tenant_123',
    documentCode: '05',
    establishmentCode: '004',
    emissionPointCode: '001',
    nextSequenceNumber: 7,
    createdAt: new Date('2026-05-08T15:10:00.000Z'),
    updatedAt: new Date('2026-05-08T15:10:00.000Z'),
  });
  const remissionGuideNumberingSettings = InvoiceNumberingSettings.create({
    id: 'invoice_numbering_006',
    tenantId: 'tenant_123',
    documentCode: '06',
    establishmentCode: '006',
    emissionPointCode: '001',
    nextSequenceNumber: 4,
    createdAt: new Date('2026-05-12T15:10:00.000Z'),
    updatedAt: new Date('2026-05-12T15:10:00.000Z'),
  });
  const withholdingNumberingSettings = InvoiceNumberingSettings.create({
    id: 'invoice_numbering_007',
    tenantId: 'tenant_123',
    documentCode: '07',
    establishmentCode: '005',
    emissionPointCode: '001',
    nextSequenceNumber: 9,
    createdAt: new Date('2026-05-08T19:10:00.000Z'),
    updatedAt: new Date('2026-05-08T19:10:00.000Z'),
  });
  const electronicDraftInvoice = Invoice.create({
    id: 'invoice_003',
    tenantId: 'tenant_123',
    customerId: 'customer_acme',
    number: '001-002-000000031',
    buyerIdentificationType: '04',
    buyerIdentification: '1790012345001',
    buyerName: 'Acme Corp',
    buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
    status: 'draft',
    currency: 'USD',
    issuedAt: new Date('2026-04-29T16:30:00.000Z'),
    dueAt: null,
    notes: 'Factura con numeracion Ecuador.',
    documentCode: '01',
    establishmentCode: '001',
    emissionPointCode: '002',
    sequenceNumber: 31,
    createdAt: new Date('2026-04-29T16:30:00.000Z'),
    updatedAt: new Date('2026-04-29T16:30:00.000Z'),
  });
  const creditNoteDraftInvoice = Invoice.create({
    id: 'credit_note_001',
    tenantId: 'tenant_123',
    customerId: 'customer_acme',
    number: '003-001-000000012',
    documentCode: '04',
    establishmentCode: '003',
    emissionPointCode: '001',
    sequenceNumber: 12,
    modifiedDocumentId: 'invoice_001',
    modifiedDocumentNumber: 'INV-001',
    modifiedDocumentIssuedAt: new Date('2026-04-27T16:00:00.000Z'),
    modificationReason: 'Devolucion parcial de la factura origen.',
    buyerIdentificationType: '04',
    buyerIdentification: '1790012345001',
    buyerName: 'Acme Corp',
    buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
    status: 'draft',
    currency: 'USD',
    issuedAt: new Date('2026-05-07T16:00:00.000Z'),
    dueAt: null,
    notes: 'Nota de credito de prueba.',
    createdAt: new Date('2026-05-07T16:00:00.000Z'),
    updatedAt: new Date('2026-05-07T16:00:00.000Z'),
  });
  const creditNoteFirstItem = InvoiceItem.create({
    id: 'credit_note_item_001',
    tenantId: 'tenant_123',
    invoiceId: 'credit_note_001',
    position: 1,
    description: 'Suscripcion mensual Growth',
    quantity: 2,
    unitPriceInCents: -5000,
    lineTotalInCents: -10000,
    taxRateId: 'tax_rate_vat_12',
    taxRateName: 'VAT 12%',
    taxRatePercentage: 12,
    lineTaxInCents: -1200,
    createdAt: new Date('2026-05-07T16:00:00.000Z'),
    updatedAt: new Date('2026-05-07T16:00:00.000Z'),
  });
  const creditNoteSecondItem = InvoiceItem.create({
    id: 'credit_note_item_002',
    tenantId: 'tenant_123',
    invoiceId: 'credit_note_001',
    position: 2,
    description: 'Setup inicial',
    quantity: 1,
    unitPriceInCents: -2500,
    lineTotalInCents: -2500,
    taxRateId: null,
    taxRateName: null,
    taxRatePercentage: null,
    lineTaxInCents: 0,
    createdAt: new Date('2026-05-07T16:00:00.000Z'),
    updatedAt: new Date('2026-05-07T16:00:00.000Z'),
  });
  const debitNoteDraftInvoice = Invoice.create({
    id: 'debit_note_001',
    tenantId: 'tenant_123',
    customerId: 'customer_acme',
    number: '004-001-000000007',
    documentCode: '05',
    establishmentCode: '004',
    emissionPointCode: '001',
    sequenceNumber: 7,
    modifiedDocumentId: 'invoice_001',
    modifiedDocumentNumber: 'INV-001',
    modifiedDocumentIssuedAt: new Date('2026-04-27T16:00:00.000Z'),
    modificationReason: 'Interes por mora de la factura origen.',
    buyerIdentificationType: '04',
    buyerIdentification: '1790012345001',
    buyerName: 'Acme Corp',
    buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
    status: 'draft',
    currency: 'USD',
    issuedAt: new Date('2026-05-08T16:00:00.000Z'),
    dueAt: new Date('2026-05-11T16:00:00.000Z'),
    notes: 'Nota de debito de prueba.',
    createdAt: new Date('2026-05-08T16:00:00.000Z'),
    updatedAt: new Date('2026-05-08T16:00:00.000Z'),
  });
  const debitNoteFirstItem = InvoiceItem.create({
    id: 'debit_note_item_001',
    tenantId: 'tenant_123',
    invoiceId: 'debit_note_001',
    position: 1,
    description: 'Interes por mora de la factura origen.',
    quantity: 1,
    unitPriceInCents: 2500,
    lineTotalInCents: 2500,
    taxRateId: 'tax_rate_vat_12',
    taxRateName: 'VAT 12%',
    taxRatePercentage: 12,
    lineTaxInCents: 300,
    createdAt: new Date('2026-05-08T16:00:00.000Z'),
    updatedAt: new Date('2026-05-08T16:00:00.000Z'),
  });
  const withholdingDraftInvoice = Invoice.create({
    id: 'withholding_001',
    tenantId: 'tenant_123',
    customerId: 'customer_acme',
    number: '005-001-000000009',
    documentCode: '07',
    establishmentCode: '005',
    emissionPointCode: '001',
    sequenceNumber: 9,
    modifiedDocumentId: 'invoice_001',
    modifiedDocumentNumber: 'INV-001',
    modifiedDocumentIssuedAt: new Date('2026-04-27T16:00:00.000Z'),
    modificationReason: 'Retencion sobre la factura origen.',
    buyerIdentificationType: '04',
    buyerIdentification: '1790012345001',
    buyerName: 'Acme Corp',
    buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
    status: 'draft',
    currency: 'USD',
    issuedAt: new Date('2026-05-08T19:30:00.000Z'),
    dueAt: null,
    notes: 'Comprobante de retencion de prueba.',
    createdAt: new Date('2026-05-08T19:30:00.000Z'),
    updatedAt: new Date('2026-05-08T19:30:00.000Z'),
  });
  const remissionGuideDraftInvoice = Invoice.create({
    id: 'remission_001',
    tenantId: 'tenant_123',
    customerId: 'customer_acme',
    number: '006-001-000000004',
    documentCode: '06',
    establishmentCode: '006',
    emissionPointCode: '001',
    sequenceNumber: 4,
    modifiedDocumentId: 'invoice_001',
    modifiedDocumentNumber: 'INV-001',
    modifiedDocumentIssuedAt: new Date('2026-04-27T16:00:00.000Z'),
    modificationReason: 'Traslado de mercaderia al cliente.',
    shipmentReason: 'Traslado de mercaderia al cliente.',
    shipmentStartAt: new Date('2026-05-12T13:00:00.000Z'),
    shipmentEndAt: new Date('2026-05-12T18:00:00.000Z'),
    departureAddress: 'Sucursal Matriz',
    arrivalAddress: 'Bodega del cliente',
    carrierName: 'Transportes Demo S.A.',
    carrierIdentificationType: '04',
    carrierIdentification: '1790012345001',
    vehiclePlate: 'ABC-1234',
    destinationRoute: 'Matriz - Cliente',
    buyerIdentificationType: '04',
    buyerIdentification: '1790012345001',
    buyerName: 'Acme Corp',
    buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
    status: 'draft',
    currency: 'USD',
    issuedAt: new Date('2026-05-12T13:00:00.000Z'),
    dueAt: new Date('2026-05-12T18:00:00.000Z'),
    notes: 'Guia de remision de prueba.',
    createdAt: new Date('2026-05-12T13:00:00.000Z'),
    updatedAt: new Date('2026-05-12T13:00:00.000Z'),
  });
  const withholdingFirstItem = InvoiceItem.create({
    id: 'withholding_item_001',
    tenantId: 'tenant_123',
    invoiceId: 'withholding_001',
    position: 1,
    description: 'Retencion sobre la factura origen.',
    quantity: 1,
    unitPriceInCents: 1000,
    lineTotalInCents: 1000,
    taxRateId: 'tax_rate_vat_12',
    taxRateName: 'VAT 12%',
    taxRatePercentage: 12,
    lineTaxInCents: 0,
    createdAt: new Date('2026-05-08T19:30:00.000Z'),
    updatedAt: new Date('2026-05-08T19:30:00.000Z'),
  });
  const remissionGuideFirstItem = InvoiceItem.create({
    id: 'remission_item_001',
    tenantId: 'tenant_123',
    invoiceId: 'remission_001',
    position: 1,
    description: 'Suscripcion mensual Growth',
    quantity: 2,
    unitPriceInCents: 0,
    lineTotalInCents: 0,
    taxRateId: null,
    taxRateName: null,
    taxRatePercentage: null,
    lineTaxInCents: 0,
    createdAt: new Date('2026-05-12T13:00:00.000Z'),
    updatedAt: new Date('2026-05-12T13:00:00.000Z'),
  });
  const remissionGuideSecondItem = InvoiceItem.create({
    id: 'remission_item_002',
    tenantId: 'tenant_123',
    invoiceId: 'remission_001',
    position: 2,
    description: 'Setup inicial',
    quantity: 1,
    unitPriceInCents: 0,
    lineTotalInCents: 0,
    taxRateId: null,
    taxRateName: null,
    taxRatePercentage: null,
    lineTaxInCents: 0,
    createdAt: new Date('2026-05-12T13:00:00.000Z'),
    updatedAt: new Date('2026-05-12T13:00:00.000Z'),
  });
  const creditNoteDocumentView = {
    issuer: {
      tenantId: 'tenant_123',
      tenantName: 'SaaS Platform',
      tenantSlug: 'saas-platform',
      legalName: 'SaaS Platform S.A.',
      commercialName: 'SaaS Platform',
      taxId: '1790012345001',
      environment: 'test',
      emissionType: 'normal',
      accountingObligated: true,
      specialTaxpayerCode: null,
      rimpeTaxpayerType: null,
      matrixAddress: 'Av. Principal y Calle Secundaria',
      establishmentAddress: 'Sucursal Matriz',
    },
    customer: {
      name: 'Acme Corp',
      email: 'billing@acme.dev',
      taxId: '1790012345001',
      identificationType: '04',
      identification: '1790012345001',
      billingAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
    },
    invoice: creditNoteDraftInvoice,
    lines: [
      {
        id: 'credit_note_item_001',
        position: 1,
        description: 'Suscripcion mensual Growth',
        quantity: 2,
        unitPriceInCents: -5000,
        lineSubtotalInCents: -10000,
        taxRateId: 'tax_rate_vat_12',
        taxRateName: 'VAT 12%',
        taxRatePercentage: 12,
        lineTaxInCents: -1200,
        lineTotalInCents: -11200,
      },
      {
        id: 'credit_note_item_002',
        position: 2,
        description: 'Setup inicial',
        quantity: 1,
        unitPriceInCents: -2500,
        lineSubtotalInCents: -2500,
        taxRateId: null,
        taxRateName: null,
        taxRatePercentage: null,
        lineTaxInCents: 0,
        lineTotalInCents: -2500,
      },
    ],
    totals: {
      subtotalInCents: -12500,
      taxInCents: -1200,
      totalInCents: -13700,
    },
  };
  const creditNoteXmlPreview = `<?xml version="1.0" encoding="UTF-8"?>
<notaCredito id="comprobante" version="1.0.0">
  <infoTributaria>
    <claveAcceso>0705202604179001234500110030010000000121234567810</claveAcceso>
    <codDoc>04</codDoc>
  </infoTributaria>
  <infoNotaCredito>
    <codDocModificado>01</codDocModificado>
    <numDocModificado>INV-001</numDocModificado>
    <valorModificacion>137.00</valorModificacion>
  </infoNotaCredito>
</notaCredito>`;
  const debitNoteDocumentView = {
    issuer: {
      tenantId: 'tenant_123',
      tenantName: 'SaaS Platform',
      tenantSlug: 'saas-platform',
      legalName: 'SaaS Platform S.A.',
      commercialName: 'SaaS Platform',
      taxId: '1790012345001',
      environment: 'test',
      emissionType: 'normal',
      accountingObligated: true,
      specialTaxpayerCode: null,
      rimpeTaxpayerType: null,
      matrixAddress: 'Av. Principal y Calle Secundaria',
      establishmentAddress: 'Sucursal Matriz',
    },
    customer: {
      name: 'Acme Corp',
      email: 'billing@acme.dev',
      taxId: '1790012345001',
      identificationType: '04',
      identification: '1790012345001',
      billingAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
    },
    invoice: debitNoteDraftInvoice,
    lines: [
      {
        id: 'debit_note_item_001',
        position: 1,
        description: 'Interes por mora de la factura origen.',
        quantity: 1,
        unitPriceInCents: 2500,
        lineSubtotalInCents: 2500,
        taxRateId: 'tax_rate_vat_12',
        taxRateName: 'VAT 12%',
        taxRatePercentage: 12,
        lineTaxInCents: 300,
        lineTotalInCents: 2800,
      },
    ],
    totals: {
      subtotalInCents: 2500,
      taxInCents: 300,
      totalInCents: 2800,
    },
  };
  const debitNoteXmlPreview = `<?xml version="1.0" encoding="UTF-8"?>
<notaDebito id="comprobante" version="1.0.0">
  <infoTributaria>
    <claveAcceso>080520260517900123450010040010000000071234567814</claveAcceso>
    <codDoc>05</codDoc>
  </infoTributaria>
  <infoNotaDebito>
    <codDocModificado>01</codDocModificado>
    <numDocModificado>INV-001</numDocModificado>
    <valorTotal>28.00</valorTotal>
  </infoNotaDebito>
  <motivos>
    <motivo>
      <razon>Interes por mora de la factura origen.</razon>
      <valor>25.00</valor>
    </motivo>
  </motivos>
</notaDebito>`;
  const withholdingDocumentView = {
    issuer: {
      tenantId: 'tenant_123',
      tenantName: 'SaaS Platform',
      tenantSlug: 'saas-platform',
      legalName: 'SaaS Platform S.A.',
      commercialName: 'SaaS Platform',
      taxId: '1790012345001',
      environment: 'test',
      emissionType: 'normal',
      accountingObligated: true,
      specialTaxpayerCode: null,
      rimpeTaxpayerType: null,
      matrixAddress: 'Av. Principal y Calle Secundaria',
      establishmentAddress: 'Sucursal Matriz',
    },
    customer: {
      name: 'Acme Corp',
      email: 'billing@acme.dev',
      taxId: '1790012345001',
      identificationType: '04',
      identification: '1790012345001',
      billingAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
    },
    invoice: withholdingDraftInvoice,
    lines: [
      {
        id: 'withholding_item_001',
        position: 1,
        description: 'Retencion sobre la factura origen.',
        quantity: 1,
        unitPriceInCents: 1000,
        lineSubtotalInCents: 1000,
        taxRateId: 'tax_rate_vat_12',
        taxRateName: 'VAT 12%',
        taxRatePercentage: 12,
        lineTaxInCents: 0,
        lineTotalInCents: 1000,
      },
    ],
    totals: {
      subtotalInCents: 1000,
      taxInCents: 0,
      totalInCents: 1000,
    },
  };
  const withholdingXmlPreview = `<?xml version="1.0" encoding="UTF-8"?>
<comprobanteRetencion id="comprobante" version="2.0.0">
  <infoTributaria>
    <claveAcceso>080520260717900123450010050010000000091234567813</claveAcceso>
    <codDoc>07</codDoc>
  </infoTributaria>
  <infoCompRetencion>
    <periodoFiscal>05/2026</periodoFiscal>
  </infoCompRetencion>
  <impuestos>
    <impuesto>
      <codDocSustento>01</codDocSustento>
      <numDocSustento>001002000000031</numDocSustento>
      <valorRetenido>10.00</valorRetenido>
    </impuesto>
  </impuestos>
</comprobanteRetencion>`;
  const remissionGuideDocumentView = {
    issuer: {
      tenantId: 'tenant_123',
      tenantName: 'SaaS Platform',
      tenantSlug: 'saas-platform',
      legalName: 'SaaS Platform S.A.',
      commercialName: 'SaaS Platform',
      taxId: '1790012345001',
      environment: 'test',
      emissionType: 'normal',
      accountingObligated: true,
      specialTaxpayerCode: null,
      rimpeTaxpayerType: null,
      matrixAddress: 'Av. Principal y Calle Secundaria',
      establishmentAddress: 'Sucursal Matriz',
    },
    customer: {
      name: 'Acme Corp',
      email: 'billing@acme.dev',
      taxId: '1790012345001',
      identificationType: '04',
      identification: '1790012345001',
      billingAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
    },
    invoice: remissionGuideDraftInvoice,
    lines: [
      {
        id: 'remission_item_001',
        position: 1,
        description: 'Suscripcion mensual Growth',
        quantity: 2,
        unitPriceInCents: 0,
        lineSubtotalInCents: 0,
        taxRateId: null,
        taxRateName: null,
        taxRatePercentage: null,
        lineTaxInCents: 0,
        lineTotalInCents: 0,
      },
      {
        id: 'remission_item_002',
        position: 2,
        description: 'Setup inicial',
        quantity: 1,
        unitPriceInCents: 0,
        lineSubtotalInCents: 0,
        taxRateId: null,
        taxRateName: null,
        taxRatePercentage: null,
        lineTaxInCents: 0,
        lineTotalInCents: 0,
      },
    ],
    totals: {
      subtotalInCents: 0,
      taxInCents: 0,
      totalInCents: 0,
    },
  };
  const remissionGuideXmlPreview = `<?xml version="1.0" encoding="UTF-8"?>
<guiaRemision id="comprobante" version="1.0.0">
  <infoTributaria>
    <claveAcceso>120520260617900123450010060010000000041234567810</claveAcceso>
    <codDoc>06</codDoc>
  </infoTributaria>
  <infoGuiaRemision>
    <dirPartida>Sucursal Matriz</dirPartida>
    <fechaIniTransporte>12/05/2026</fechaIniTransporte>
    <fechaFinTransporte>12/05/2026</fechaFinTransporte>
    <placa>ABC-1234</placa>
  </infoGuiaRemision>
  <destinatarios>
    <destinatario>
      <motivoTraslado>Traslado de mercaderia al cliente.</motivoTraslado>
      <numDocSustento>INV-001</numDocSustento>
    </destinatario>
  </destinatarios>
</guiaRemision>`;

  const signJwt = (payload: Record<string, unknown>): string => {
    const encode = (value: unknown): string =>
      Buffer.from(JSON.stringify(value))
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');

    const header = encode({ alg: 'RS256', typ: 'JWT' });
    const body = encode(payload);
    const signature = createSign('RSA-SHA256')
      .update(`${header}.${body}`)
      .sign(privateKey)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');

    return `${header}.${body}.${signature}`;
  };

  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
  });

  beforeAll(async () => {
    issuer = 'https://auth.saas-platform.local/realms/main';
    audience = 'saas-platform-api';
    process.env.AUTH_JWT_VERIFIER_MODE = 'provider';
    process.env.AUTH_JWT_PUBLIC_KEY = publicKey.export({
      type: 'spki',
      format: 'pem',
    }) as string;
    process.env.AUTH_JWT_ISSUER = issuer;
    process.env.AUTH_JWT_AUDIENCE = audience;

    const now = Math.floor(Date.now() / 1000);
    ownerToken = signJwt({
      sub: 'user_123',
      iss: issuer,
      aud: audience,
      iat: now,
      exp: now + 3600,
      email: 'hello@saas-platform.dev',
      provider: 'password',
    });
    memberToken = signJwt({
      sub: 'user_456',
      iss: issuer,
      aud: audience,
      iat: now,
      exp: now + 3600,
      email: 'member@saas-platform.dev',
      provider: 'password',
    });
    inviteeToken = signJwt({
      sub: 'user_456',
      iss: issuer,
      aud: audience,
      iat: now,
      exp: now + 3600,
      email: 'invitee@saas-platform.dev',
      provider: 'password',
    });
    changeTenantPlanUseCase = {
      execute: jest.fn().mockResolvedValue({
        subscription: tenantSubscription,
        entitlements: tenantEntitlements,
      }),
    };
    entitlementRepository = {
      findByTenantId: jest.fn().mockImplementation((tenantId: string) =>
        tenantId === 'tenant_123' ? Promise.resolve(tenantEntitlements) : Promise.resolve([]),
      ),
    };
    getPlanByKeyUseCase = {
      execute: jest.fn().mockResolvedValue(growthPlan),
    };
    getTenantEnabledProductByKeyUseCase = {
      execute: jest.fn().mockResolvedValue(invoicingProduct),
    };
    getUserByIdUseCase = {
      execute: jest.fn().mockResolvedValue(user),
    };
    getProductByKeyUseCase = {
      execute: jest.fn().mockResolvedValue(invoicingProduct),
    };
    getTenantCustomerByIdUseCase = {
      execute: jest.fn().mockResolvedValue(acmeCustomer),
    };
    getTenantElectronicSubmissionSettingsUseCase = {
      execute: jest.fn().mockResolvedValue(electronicSubmissionSettings),
    };
    getTenantElectronicSandboxReadinessUseCase = {
      execute: jest.fn().mockResolvedValue(electronicSandboxReadiness),
    };
    inspectTenantElectronicSignatureMaterialUseCase = {
      execute: jest
        .fn()
        .mockResolvedValue(electronicSignatureMaterialInspection),
    };
    getTenantElectronicSignatureSettingsUseCase = {
      execute: jest.fn().mockResolvedValue(electronicSignatureSettings),
    };
    getTenantInvoiceDetailUseCase = {
      execute: jest.fn().mockResolvedValue({
        invoice: draftInvoice,
        items: [firstInvoiceItem, secondInvoiceItem],
        payments: [],
        electronicEvents: [invoiceElectronicEvent],
        totals: {
          subtotalInCents: 12500,
          taxInCents: 1200,
          totalInCents: 13700,
        },
        settlement: {
          paidInCents: 0,
          balanceDueInCents: 13700,
          isFullyPaid: false,
        },
      }),
    };
    getTenantIssuerProfileUseCase = {
      execute: jest.fn().mockResolvedValue(issuerProfile),
    };
    getTenantInvoiceNumberingSettingsUseCase = {
      execute: jest.fn().mockResolvedValue(invoiceNumberingSettings),
    };
    getTenantInvoiceDocumentUseCase = {
      execute: jest.fn().mockResolvedValue({
        issuer: {
          tenantId: 'tenant_123',
          tenantName: 'SaaS Platform',
          tenantSlug: 'saas-platform',
          legalName: 'SaaS Platform S.A.',
          commercialName: 'SaaS Platform',
          taxId: '1790012345001',
          environment: 'test',
          emissionType: 'normal',
          accountingObligated: true,
          specialTaxpayerCode: null,
          rimpeTaxpayerType: null,
          matrixAddress: 'Av. Principal y Calle Secundaria',
          establishmentAddress: 'Sucursal Matriz',
        },
        customer: {
          name: 'Acme Corp',
          email: 'billing@acme.dev',
          taxId: '1790012345001',
          identificationType: '04',
          identification: '1790012345001',
          billingAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
        },
        invoice: draftInvoice,
        lines: [
          {
            id: 'invoice_item_001',
            position: 1,
            description: 'Suscripcion mensual Growth',
            quantity: 2,
            unitPriceInCents: 5000,
            lineSubtotalInCents: 10000,
            taxRateId: 'tax_rate_vat_12',
            taxRateName: 'VAT 12%',
            taxRatePercentage: 12,
            lineTaxInCents: 1200,
            lineTotalInCents: 11200,
          },
          {
            id: 'invoice_item_002',
            position: 2,
            description: 'Setup inicial',
            quantity: 1,
            unitPriceInCents: 2500,
            lineSubtotalInCents: 2500,
            taxRateId: null,
            taxRateName: null,
            taxRatePercentage: null,
            lineTaxInCents: 0,
            lineTotalInCents: 2500,
          },
        ],
        totals: {
          subtotalInCents: 12500,
          taxInCents: 1200,
          totalInCents: 13700,
        },
      }),
    };
    getTenantInvoiceDocumentDraftingAssistUseCase = {
      execute: jest.fn().mockResolvedValue(invoiceDocumentDraftingAssist),
    };
    getTenantInvoiceElectronicXmlPreviewUseCase = {
      execute: jest.fn().mockResolvedValue(`<?xml version="1.0" encoding="UTF-8"?>
<factura id="comprobante" version="2.1.0">
  <infoTributaria>
    <claveAcceso>2904202601179001234500110010020000000311234567815</claveAcceso>
  </infoTributaria>
</factura>`),
    };
    getTenantInvoicingReportSummaryUseCase = {
      execute: jest.fn().mockResolvedValue({
        generatedAt: '2026-04-28T22:30:00.000Z',
        customerCount: 2,
        invoiceCount: 2,
        statusBreakdown: [
          { status: 'draft', count: 1 },
          { status: 'partially_paid', count: 1 },
        ],
        totalsByCurrency: [
          {
            currency: 'USD',
            subtotalInCents: 17500,
            taxInCents: 1200,
            totalInCents: 18700,
            paidInCents: 2500,
            outstandingTotalInCents: 16200,
          },
        ],
        monthlyTotals: [
          {
            month: '2026-04',
            currency: 'USD',
            invoiceCount: 2,
            totalInCents: 18700,
            taxInCents: 1200,
          },
        ],
      }),
    };
    getTenantInvoiceByIdUseCase = {
      execute: jest.fn().mockResolvedValue(draftInvoice),
    };
    getTenantInvoiceItemByIdUseCase = {
      execute: jest.fn().mockResolvedValue(firstInvoiceItem),
    };
    getTenantPartyByIdUseCase = {
      execute: jest.fn().mockResolvedValue(acmeParty),
    };
    getTenantConversationThreadByIdUseCase = {
      execute: jest.fn().mockResolvedValue(conversationThread),
    };
    getTenantGrowthAssistDailyAgendaUseCase = {
      execute: jest.fn().mockResolvedValue(growthAssistDailyAgenda),
    };
    listTenantAiApprovalRequestsUseCase = {
      execute: jest.fn().mockResolvedValue([growthAssistApprovalRequest]),
    };
    createTenantAiGuardedExecutionEventUseCase = {
      execute: jest.fn().mockResolvedValue({
        id: 'ai-guarded-event-001',
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        agentKey: 'growth-assist-coach',
        eventType: 'executed',
        approvalRequestId: 'ai-approval-001',
        suggestionRunId: 'ai-run-001',
        toolKey: 'growth_case_assignment_execution',
        caseId: 'op-case-001',
        safeFallbackMode: null,
        summary:
          'Guarded execution completed for growth_case_assignment_execution after approved request ai-approval-001.',
        detail:
          'Operational case op-case-001 is now assigned to hello@saas-platform.dev under the named human gate.',
        occurredAt: new Date('2026-05-20T10:12:00.000Z'),
        createdByUserId: user.id,
        createdByEmail: user.email,
        createdAt: new Date('2026-05-20T10:12:00.000Z'),
      }),
    };
    getTenantAiSuggestionRunDetailUseCase = {
      execute: jest.fn().mockResolvedValue({
        ...growthAssistSuggestionRun,
        approvalRequests: [growthAssistApprovalRequest],
      }),
    };
    listTenantAiGuardedExecutionEventsUseCase = {
      execute: jest.fn().mockResolvedValue([]),
    };
    listTenantAiSuggestionRunsUseCase = {
      execute: jest.fn().mockResolvedValue([growthAssistSuggestionRun]),
    };
    prepareTenantAiSuggestionRunUseCase = {
      execute: jest.fn().mockResolvedValue(growthAssistSuggestionRun),
    };
    requestTenantAiSuggestionRunApprovalUseCase = {
      execute: jest.fn().mockResolvedValue(growthAssistApprovalRequest),
    };
    reviewTenantAiApprovalRequestUseCase = {
      execute: jest.fn().mockResolvedValue({
        ...growthAssistApprovalRequest,
        status: 'approved',
        reviewedAt: new Date('2026-05-20T10:39:00.000Z'),
        reviewedByUserId: user.id,
        reviewedByEmail: user.email,
        reviewNote: 'Se ve segura para uso guiado.',
        updatedAt: new Date('2026-05-20T10:39:00.000Z'),
      }),
    };
    getTenantGrowthConversationWorkbenchUseCase = {
      execute: jest.fn().mockResolvedValue(growthConversationWorkbench),
    };
    getTenantGrowthAssignmentWorkloadUseCase = {
      execute: jest.fn().mockResolvedValue(growthAssignmentWorkload),
    };
    getTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase = {
      execute: jest
        .fn()
        .mockResolvedValue(growthOperationalCaseAutoAssignmentSettings),
    };
    getTenantWhatsappAutomationRuleByIdUseCase = {
      execute: jest.fn().mockResolvedValue(whatsappAutomationRule),
    };
    getTenantWhatsappAutomationSuggestionsUseCase = {
      execute: jest.fn().mockResolvedValue(whatsappAutomationSuggestions),
    };
    getTenantWhatsappOutboundReportingSummaryUseCase = {
      execute: jest.fn().mockResolvedValue(whatsappOutboundReportingSummary),
    };
    getTenantLeadByIdUseCase = {
      execute: jest.fn().mockResolvedValue(capturedLead),
    };
    getTenantOpportunityByIdUseCase = {
      execute: jest.fn().mockResolvedValue(qualifiedOpportunity),
    };
    getTenantWhatsappMessageTemplateByIdUseCase = {
      execute: jest.fn().mockResolvedValue(whatsappMessageTemplate),
    };
    getTenantWebhookEventEnvelopeByIdUseCase = {
      execute: jest.fn().mockResolvedValue(whatsappWebhookEnvelope),
    };
    getTenantSubscriptionUseCase = {
      execute: jest.fn().mockResolvedValue(tenantSubscription),
    };
    executeTenantWhatsappAutomationActionsUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        threadId: 'thread_whatsapp_001',
        triggerEvent: 'inbound_message',
        executedAt: new Date('2026-05-19T09:00:00.000Z'),
        executions: [],
      }),
    };
    ingestTenantWhatsappConversationMessageUseCase = {
      execute: jest.fn().mockResolvedValue({
        createdThread: true,
        thread: whatsappConversationThread,
        message: inboundWhatsappMessage,
      }),
    };
    ingestTenantWhatsappDeliveryEventUseCase = {
      execute: jest.fn().mockResolvedValue(
        ConversationMessage.create({
          ...outboundWhatsappMessage.toPrimitives(),
          deliveryStatus: 'delivered',
          deliveredAt: new Date('2026-05-16T14:06:00.000Z'),
        }),
      ),
    };
    processTenantMetaWhatsappWebhookUseCase = {
      execute: jest.fn().mockResolvedValue({
        processedInboundMessages: 1,
        processedDeliveryEvents: 1,
      }),
    };
    receiveTenantMetaWhatsappWebhookUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        envelopeId: 'webhook-envelope-001',
        eventKey: 'event-key-001',
        duplicate: false,
        envelopeStatus: 'processed',
        processedInboundMessages: 1,
        processedDeliveryEvents: 1,
      }),
    };
    reopenTenantGrowthOperationalCaseUseCase = {
      execute: jest.fn().mockResolvedValue({
        ...growthOperationalCase,
        status: 'open',
        updatedAt: new Date('2026-05-20T10:20:00.000Z'),
      }),
    };
    replayTenantWebhookEventEnvelopeUseCase = {
      execute: jest.fn().mockResolvedValue({
        envelope: WebhookEventEnvelope.create({
          ...whatsappWebhookEnvelope.toPrimitives(),
          replayCount: 1,
          lastReplayedAt: new Date('2026-05-18T16:00:00.000Z'),
          updatedAt: new Date('2026-05-18T16:00:00.000Z'),
        }),
        processedInboundMessages: 1,
        processedDeliveryEvents: 1,
      }),
    };
    retryTenantWhatsappFailedConversationMessageUseCase = {
      execute: jest.fn().mockResolvedValue(retriedOutboundWhatsappMessage),
    };
    runTenantWhatsappOperationalMonitorUseCase = {
      execute: jest.fn().mockResolvedValue(whatsappOperationalMonitorSummary),
    };
    runTenantWhatsappReadyRetriesUseCase = {
      execute: jest.fn().mockResolvedValue(whatsappRetryRunnerSummary),
    };
    releaseTenantGrowthOperationalCaseUseCase = {
      execute: jest.fn().mockResolvedValue({
        ...growthOperationalCase,
        status: 'open',
        assignedUserId: null,
        assignedUserEmail: null,
        updatedAt: new Date('2026-05-20T10:14:00.000Z'),
      }),
    };
    autoAssignTenantGrowthOperationalCasesUseCase = {
      execute: jest.fn().mockResolvedValue({
        policyKey: 'owner_queue_first',
        candidateCount: 2,
        reviewedCount: 2,
        assignedCount: 2,
        threadAssignmentCount: 1,
        inheritedOwnerCount: 1,
        fallbackAssignmentCount: 1,
        cases: [
          {
            ...growthOperationalCase,
            caseType: 'ownership_routing',
            routingPolicyKey: 'owner_assignment',
            threadId: 'thread_001',
            assignedUserId: 'user_456',
            assignedUserEmail: 'ops@saas-platform.dev',
            updatedAt: new Date('2026-05-20T10:25:00.000Z'),
          },
          {
            ...growthOperationalCase,
            id: 'op-case-002',
            sourceKey: 'thread:thread_002:follow_up',
            caseType: 'follow_up',
            followUpState: 'pending_team',
            routingPolicyKey: 'follow_up_team',
            threadId: 'thread_002',
            assignedUserId: 'user_789',
            assignedUserEmail: 'owner@saas-platform.dev',
            updatedAt: new Date('2026-05-20T10:25:00.000Z'),
          },
        ],
      }),
    };
    reviewTenantGrowthOperationalCaseRoutingUseCase = {
      execute: jest.fn().mockResolvedValue({
        reviewedCount: 2,
        updatedCount: 1,
        escalationReviewCount: 1,
        cases: [
          {
            ...growthOperationalCase,
            caseType: 'ownership_routing',
            priority: 'critical',
            routingPolicyKey: 'escalation_review',
            dueAt: new Date('2026-05-20T09:45:00.000Z'),
            updatedAt: new Date('2026-05-20T10:30:00.000Z'),
          },
        ],
      }),
    };
    resolveTenantGrowthOperationalCaseUseCase = {
      execute: jest.fn().mockResolvedValue({
        ...growthOperationalCase,
        status: 'resolved',
        assignedUserId: 'user_123',
        assignedUserEmail: 'hello@saas-platform.dev',
        resolvedAt: new Date('2026-05-20T10:16:00.000Z'),
        resolvedByUserId: 'user_123',
        resolvedByEmail: 'hello@saas-platform.dev',
        updatedAt: new Date('2026-05-20T10:16:00.000Z'),
      }),
    };
    takeTenantGrowthOperationalCaseUseCase = {
      execute: jest.fn().mockResolvedValue({
        ...growthOperationalCase,
        status: 'in_progress',
        assignedUserId: 'user_123',
        assignedUserEmail: 'hello@saas-platform.dev',
        updatedAt: new Date('2026-05-20T10:12:00.000Z'),
      }),
    };
    upsertTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase = {
      execute: jest.fn().mockResolvedValue({
        ...growthOperationalCaseAutoAssignmentSettings,
        defaultPolicyKey: 'owner_queue_first',
        updatedAt: new Date('2026-05-20T10:35:00.000Z'),
      }),
    };
    updateTenantGrowthOperationalCaseFollowUpStateUseCase = {
      execute: jest.fn().mockResolvedValue({
        ...growthOperationalCase,
        caseType: 'follow_up',
        status: 'in_progress',
        threadId: 'thread_001',
        followUpState: 'waiting_customer',
        routingPolicyKey: 'follow_up_waiting_customer',
        nextAction:
          'Esperar respuesta del cliente antes del siguiente outreach.',
        dueAt: null,
        assignedUserId: 'user_123',
        assignedUserEmail: 'hello@saas-platform.dev',
        updatedAt: new Date('2026-05-20T10:13:00.000Z'),
      }),
    };
    metaWhatsappWebhookSignatureVerifier = {
      isConfigured: jest.fn().mockReturnValue(true),
      verify: jest.fn().mockReturnValue(true),
    };
    metaWhatsappWebhookTenantResolver = {
      resolve: jest.fn().mockReturnValue({
        tenantSlug: 'saas-platform',
        source: 'phone_number_id',
        evidence: '1234567890',
      }),
    };
    listPlanEntitlementsUseCase = {
      execute: jest.fn().mockResolvedValue(growthPlanEntitlements),
    };
    listPlansUseCase = {
      execute: jest.fn().mockResolvedValue([growthPlan, enterprisePlan]),
    };
    registerUserUseCase = {
      execute: jest.fn().mockResolvedValue(user),
    };
    subscriptionRepository = {
      findByTenantId: jest.fn().mockImplementation((tenantId: string) =>
        tenantId === 'tenant_123' ? Promise.resolve(tenantSubscription) : Promise.resolve(null),
      ),
    };
    userRepository = {
      findById: jest.fn().mockResolvedValue(user),
      findByEmail: jest.fn(),
      save: jest.fn().mockResolvedValue(undefined),
    };

    getTenantBySlugUseCase = {
      execute: jest.fn().mockResolvedValue(tenant),
    };
    inviteUserToTenantUseCase = {
      execute: jest.fn().mockResolvedValue(invitation),
    };
    listProductsUseCase = {
      execute: jest.fn().mockResolvedValue([
        invoicingProduct,
        psychologyProduct,
      ]),
    };
    listProductModulesUseCase = {
      execute: jest.fn().mockResolvedValue(invoicingModules),
    };
    listTenantInvitationsUseCase = {
      execute: jest.fn().mockResolvedValue([invitation]),
    };
    listTenantEntitlementsUseCase = {
      execute: jest.fn().mockResolvedValue(tenantEntitlements),
    };
    listTenantEnabledProductsUseCase = {
      execute: jest.fn().mockResolvedValue([invoicingProduct]),
    };
    listTenantCustomersUseCase = {
      execute: jest.fn().mockResolvedValue([acmeCustomer, globexCustomer]),
    };
    listTenantPartiesUseCase = {
      execute: jest.fn().mockResolvedValue([acmeParty, globexParty]),
    };
    listTenantConversationThreadsUseCase = {
      execute: jest.fn().mockResolvedValue([conversationThread]),
    };
    listTenantConversationMessagesUseCase = {
      execute: jest
        .fn()
        .mockResolvedValue([
          firstConversationMessage,
          secondConversationMessage,
        ]),
    };
    listTenantConversationMessageDeliveryEventsUseCase = {
      execute: jest.fn().mockResolvedValue([whatsappDeliveryEvent]),
    };
    listTenantGrowthOperationalCasesUseCase = {
      execute: jest.fn().mockResolvedValue([growthOperationalCase]),
    };
    listTenantLeadsUseCase = {
      execute: jest.fn().mockResolvedValue([capturedLead, qualifiedLead]),
    };
    listTenantOpportunitiesUseCase = {
      execute: jest.fn().mockResolvedValue([qualifiedOpportunity]),
    };
    listTenantWebhookEventEnvelopesUseCase = {
      execute: jest.fn().mockResolvedValue([whatsappWebhookEnvelope]),
    };
    listTenantWhatsappConversationThreadsUseCase = {
      execute: jest.fn().mockResolvedValue([whatsappConversationThread]),
    };
    listTenantWhatsappAutomationRulesUseCase = {
      execute: jest.fn().mockResolvedValue([whatsappAutomationRule]),
    };
    listTenantWhatsappMessageTemplatesUseCase = {
      execute: jest.fn().mockResolvedValue([whatsappMessageTemplate]),
    };
    listTenantInvoiceItemsUseCase = {
      execute: jest.fn().mockResolvedValue([
        firstInvoiceItem,
        secondInvoiceItem,
      ]),
    };
    listTenantInvoicePaymentsUseCase = {
      execute: jest.fn().mockResolvedValue([receivedPayment]),
    };
    listTenantInvoiceSummariesUseCase = {
      execute: jest.fn().mockResolvedValue([
        {
          invoice: draftInvoice,
          itemCount: 2,
          totals: {
            subtotalInCents: 12500,
            taxInCents: 1200,
            totalInCents: 13700,
          },
          settlement: {
            paidInCents: 0,
            balanceDueInCents: 13700,
            isFullyPaid: false,
          },
        },
        {
          invoice: issuedInvoice,
          itemCount: 0,
          totals: {
            subtotalInCents: 5000,
            taxInCents: 0,
            totalInCents: 5000,
          },
          settlement: {
            paidInCents: 2500,
            balanceDueInCents: 2500,
            isFullyPaid: false,
          },
        },
      ]),
    };
    listTenantInvoicesUseCase = {
      execute: jest.fn().mockResolvedValue([draftInvoice, issuedInvoice]),
    };
    listTenantTaxRatesUseCase = {
      execute: jest.fn().mockResolvedValue([vatTaxRate]),
    };
    listTenantFeatureFlagsUseCase = {
      execute: jest.fn().mockResolvedValue([psychologyProductDisabledFlag]),
    };
    setTenantFeatureFlagUseCase = {
      execute: jest.fn().mockResolvedValue(psychologyProductDisabledFlag),
    };
    createTenantCustomerUseCase = {
      execute: jest.fn().mockResolvedValue(acmeCustomer),
    };
    createTenantConversationThreadUseCase = {
      execute: jest.fn().mockResolvedValue(conversationThread),
    };
    createTenantGrowthOperationalCaseUseCase = {
      execute: jest.fn().mockResolvedValue(growthOperationalCase),
    };
    createTenantWhatsappAutomationRuleUseCase = {
      execute: jest.fn().mockResolvedValue(whatsappAutomationRule),
    };
    createTenantWhatsappMessageTemplateUseCase = {
      execute: jest.fn().mockResolvedValue(whatsappMessageTemplate),
    };
    assignTenantConversationThreadUseCase = {
      execute: jest.fn().mockResolvedValue(
        ConversationThread.create({
          ...whatsappConversationThread.toPrimitives(),
          assigneeUserId: 'user_456',
          updatedAt: new Date('2026-05-16T14:10:00.000Z'),
        }),
      ),
    };
    createTenantConversationMessageUseCase = {
      execute: jest.fn().mockResolvedValue(firstConversationMessage),
    };
    createTenantLeadUseCase = {
      execute: jest.fn().mockResolvedValue(capturedLead),
    };
    createTenantOpportunityUseCase = {
      execute: jest.fn().mockResolvedValue(qualifiedOpportunity),
    };
    assignTenantOpportunityUseCase = {
      execute: jest.fn().mockResolvedValue(
        Opportunity.create({
          ...qualifiedOpportunity.toPrimitives(),
          assigneeUserId: 'user_456',
          updatedAt: new Date('2026-05-15T15:30:00.000Z'),
        }),
      ),
    };
    sendTenantWhatsappConversationMessageUseCase = {
      execute: jest.fn().mockResolvedValue(
        ConversationMessage.create({
          ...outboundWhatsappMessage.toPrimitives(),
          templateId: 'template_001',
          outboundIntentKey: 'follow_up',
        }),
      ),
    };
    createTenantCreditNoteUseCase = {
      execute: jest.fn().mockResolvedValue({
        creditNote: creditNoteDraftInvoice,
        sourceInvoice: draftInvoice,
      }),
    };
    createTenantDebitNoteUseCase = {
      execute: jest.fn().mockResolvedValue({
        debitNote: debitNoteDraftInvoice,
        sourceInvoice: draftInvoice,
        initialItem: debitNoteFirstItem,
      }),
    };
    createTenantRemissionGuideUseCase = {
      execute: jest.fn().mockResolvedValue({
        remissionGuide: remissionGuideDraftInvoice,
        sourceInvoice: draftInvoice,
        items: [remissionGuideFirstItem, remissionGuideSecondItem],
      }),
    };
    createTenantWithholdingUseCase = {
      execute: jest.fn().mockResolvedValue({
        withholding: withholdingDraftInvoice,
        sourceInvoice: draftInvoice,
        initialItem: withholdingFirstItem,
      }),
    };
    createTenantInvoiceUseCase = {
      execute: jest.fn().mockResolvedValue(draftInvoice),
    };
    createTenantInvoiceItemUseCase = {
      execute: jest.fn().mockResolvedValue(firstInvoiceItem),
    };
    createTenantInvoicePaymentUseCase = {
      execute: jest.fn().mockResolvedValue(receivedPayment),
    };
    createTenantTaxRateUseCase = {
      execute: jest.fn().mockResolvedValue(vatTaxRate),
    };
    checkTenantInvoiceElectronicAuthorizationUseCase = {
      execute: jest.fn().mockResolvedValue(
        draftInvoice.updateElectronicStatus(
          {
            electronicStatus: 'authorized',
            accessKey:
              '2904202601179001234500110010020000000311234567815',
            authorizationNumber:
              '2904202601179001234500110010020000000311234567815',
            authorizedAt: new Date('2026-05-01T15:25:00.000Z'),
            electronicStatusMessage:
              'Documento autorizado por el stub del SRI. Listo para reemplazar por polling real.',
            signedAt: new Date('2026-05-01T15:20:00.000Z'),
            submittedAt: new Date('2026-05-01T15:20:05.000Z'),
            submissionReference: 'stub-sri-invoice_001-1746112805000',
          },
          new Date('2026-05-01T15:25:00.000Z'),
        ),
      ),
    };
    reverseTenantInvoicePaymentUseCase = {
      execute: jest.fn().mockResolvedValue(
        receivedPayment.reverse(
          new Date('2026-04-28T22:00:00.000Z'),
          'Pago duplicado.',
        ),
      ),
    };
    sendTenantInvoiceEmailUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    };
    submitTenantInvoiceElectronicDocumentUseCase = {
      execute: jest.fn().mockResolvedValue(
        draftInvoice.updateElectronicStatus(
          {
            electronicStatus: 'submitted',
            accessKey:
              '2904202601179001234500110010020000000311234567815',
            authorizationNumber: null,
            authorizedAt: null,
            electronicStatusMessage:
              'Documento firmado y enviado al gateway stub del SRI. Pendiente de autorizacion real.',
            signedAt: new Date('2026-05-01T15:20:00.000Z'),
            submittedAt: new Date('2026-05-01T15:20:05.000Z'),
            submissionReference: 'stub-sri-invoice_001-1746112805000',
          },
          new Date('2026-05-01T15:20:05.000Z'),
        ),
      ),
    };
    submitTenantPresignedInvoiceElectronicDocumentUseCase = {
      execute: jest.fn().mockResolvedValue(
        draftInvoice.updateElectronicStatus(
          {
            electronicStatus: 'submitted',
            accessKey: '2904202601179001234500110010020000000311234567815',
            authorizationNumber: null,
            authorizedAt: null,
            electronicStatusMessage:
              'XML firmado externamente por sandbox-signer. Documento enviado al gateway stub del SRI.',
            signedAt: new Date('2026-05-02T18:25:00.000Z'),
            submittedAt: new Date('2026-05-02T18:26:00.000Z'),
            submissionReference: 'stub-sri-presigned-invoice_001-123456789',
          },
          new Date('2026-05-02T18:26:00.000Z'),
        ),
      ),
    };
    updateTenantOpportunityStageUseCase = {
      execute: jest.fn().mockResolvedValue(
        Opportunity.create({
          ...qualifiedOpportunity.toPrimitives(),
          stage: 'won',
          closedAt: new Date('2026-05-15T15:45:00.000Z'),
          updatedAt: new Date('2026-05-15T15:45:00.000Z'),
        }),
      ),
    };
    updateTenantInvoiceStatusUseCase = {
      execute: jest.fn().mockResolvedValue(
        Invoice.create({
          id: 'invoice_001',
          tenantId: 'tenant_123',
          customerId: 'customer_acme',
          number: 'INV-001',
          status: 'issued',
          currency: 'USD',
          issuedAt: invoiceCreatedAt,
          dueAt: new Date('2026-05-11T16:00:00.000Z'),
          notes: 'Primer borrador para onboarding de invoicing.',
          createdAt: invoiceCreatedAt,
          updatedAt: new Date('2026-04-28T23:00:00.000Z'),
        }),
      ),
    };
    updateTenantInvoiceElectronicStatusUseCase = {
      execute: jest.fn().mockResolvedValue(
        draftInvoice.updateElectronicStatus(
          {
            electronicStatus: 'authorized',
            accessKey:
              '2904202601179001234500110010020000000311234567815',
            authorizationNumber: '2904202601179001234500110010020000000311234567815',
            authorizedAt: new Date('2026-04-29T17:00:00.000Z'),
            electronicStatusMessage: 'AUTORIZADO',
            signedAt: null,
            submittedAt: null,
            submissionReference: null,
          },
          new Date('2026-04-29T17:00:00.000Z'),
        ),
      ),
    };
    upsertTenantElectronicSubmissionSettingsUseCase = {
      execute: jest.fn().mockResolvedValue(electronicSubmissionSettings),
    };
    upsertTenantElectronicSignatureSettingsUseCase = {
      execute: jest.fn().mockResolvedValue(electronicSignatureSettings),
    };
    upsertTenantIssuerProfileUseCase = {
      execute: jest.fn().mockResolvedValue(issuerProfile),
    };
    syncTenantIssuerProfileTaxIdFromSignatureUseCase = {
      execute: jest.fn().mockResolvedValue(issuerProfile),
    };
    upsertTenantInvoiceNumberingSettingsUseCase = {
      execute: jest.fn().mockResolvedValue(invoiceNumberingSettings),
    };
    cancelTenantInvitationUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    };
    getAuthenticatedUserInvitationUseCase = {
      execute: jest.fn().mockResolvedValue({
        invitation,
        tenant,
        canAccept: true,
      }),
    };
    getTenantInvitationByIdUseCase = {
      execute: jest.fn().mockResolvedValue(invitation),
    };
    resendTenantInvitationUseCase = {
      execute: jest.fn().mockResolvedValue(
        invitation.resend(
          new Date('2026-04-23T12:00:00.000Z'),
          new Date('2026-04-30T12:00:00.000Z'),
        ),
      ),
    };
    acceptTenantInvitationUseCase = {
      execute: jest.fn().mockResolvedValue(membership),
    };
    acceptAuthenticatedUserInvitationUseCase = {
      execute: jest.fn().mockResolvedValue({
        authenticatedUser: {
          id: 'user_456',
          email: 'invitee@saas-platform.dev',
          provider: 'password',
          externalAuthId: null,
        },
        currentTenancy: {
          tenant,
          membership,
          roleKeys: ['tenant_member'],
          permissionKeys: [
            TENANT_PERMISSIONS.READ,
            TENANT_PERMISSIONS.SUBSCRIPTION_READ,
            TENANT_PERMISSIONS.ENTITLEMENTS_READ,
          ],
          subscription: tenantSubscription,
          entitlements: tenantEntitlements,
        },
        pendingInvitations: [],
        sessionState: {
          canSelectTenancy: false,
          hasPendingInvitations: false,
          hasTenancies: true,
          recommendedFlow: 'workspace',
        },
        tenancies: [
          {
            tenant,
            membership,
            roleKeys: ['tenant_member'],
            permissionKeys: [
              TENANT_PERMISSIONS.READ,
              TENANT_PERMISSIONS.SUBSCRIPTION_READ,
              TENANT_PERMISSIONS.ENTITLEMENTS_READ,
            ],
          },
        ],
      }),
    };
    listUserPendingInvitationsUseCase = {
      execute: jest.fn().mockResolvedValue([]),
    };
    getTenantMemberAccessUseCase = {
      execute: jest.fn().mockResolvedValue({
        userId: 'user_123',
        membershipId: 'membership_123',
        membershipStatus: MembershipStatus.Active,
        roleKeys: ['tenant_owner'],
        permissionKeys: ownerTenantPermissionKeys,
      }),
    };
    getTenantMembershipByUserUseCase = {
      execute: jest.fn().mockResolvedValue(membership),
    };
    listUserTenanciesUseCase = {
      execute: jest.fn().mockResolvedValue([
        {
          tenant,
          membership,
          roleKeys: ['tenant_owner'],
          permissionKeys: ownerTenantPermissionKeys,
        },
      ]),
    };
    listTenantMembershipsUseCase = {
      execute: jest.fn().mockResolvedValue([membership]),
    };
    resolveTenantAccessUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantId: 'tenant_123',
        tenantSlug: 'saas-platform',
        userId: 'user_123',
        membershipId: 'membership_123',
        membershipStatus: MembershipStatus.Active,
        roleKeys: ['tenant_owner'],
        permissionKeys: ownerTenantPermissionKeys,
      }),
    };
    assignMembershipRoleUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    };
    removeMembershipRoleUseCase = {
      execute: jest.fn().mockResolvedValue(undefined),
    };
    createTenantUseCase = {
      execute: jest.fn().mockResolvedValue(tenant),
    };
    metaWhatsappWebhookVerifier = {
      verify: jest.fn().mockReturnValue(true),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
      })
      .overrideProvider(ChangeTenantPlanUseCase)
      .useValue(changeTenantPlanUseCase)
      .overrideProvider(ENTITLEMENT_REPOSITORY)
      .useValue(entitlementRepository)
      .overrideProvider(GetPlanByKeyUseCase)
      .useValue(getPlanByKeyUseCase)
      .overrideProvider(GetTenantEnabledProductByKeyUseCase)
      .useValue(getTenantEnabledProductByKeyUseCase)
      .overrideProvider(GetUserByIdUseCase)
      .useValue(getUserByIdUseCase)
      .overrideProvider(GetProductByKeyUseCase)
      .useValue(getProductByKeyUseCase)
      .overrideProvider(GetTenantCustomerByIdUseCase)
      .useValue(getTenantCustomerByIdUseCase)
      .overrideProvider(GetTenantElectronicSubmissionSettingsUseCase)
      .useValue(getTenantElectronicSubmissionSettingsUseCase)
      .overrideProvider(GetTenantElectronicSandboxReadinessUseCase)
      .useValue(getTenantElectronicSandboxReadinessUseCase)
      .overrideProvider(InspectTenantElectronicSignatureMaterialUseCase)
      .useValue(inspectTenantElectronicSignatureMaterialUseCase)
      .overrideProvider(GetTenantElectronicSignatureSettingsUseCase)
      .useValue(getTenantElectronicSignatureSettingsUseCase)
      .overrideProvider(GetTenantIssuerProfileUseCase)
      .useValue(getTenantIssuerProfileUseCase)
      .overrideProvider(GetTenantInvoiceNumberingSettingsUseCase)
      .useValue(getTenantInvoiceNumberingSettingsUseCase)
      .overrideProvider(GetTenantInvoiceDetailUseCase)
      .useValue(getTenantInvoiceDetailUseCase)
      .overrideProvider(GetTenantInvoiceDocumentUseCase)
      .useValue(getTenantInvoiceDocumentUseCase)
      .overrideProvider(GetTenantInvoiceDocumentDraftingAssistUseCase)
      .useValue(getTenantInvoiceDocumentDraftingAssistUseCase)
      .overrideProvider(GetTenantInvoiceElectronicXmlPreviewUseCase)
      .useValue(getTenantInvoiceElectronicXmlPreviewUseCase)
      .overrideProvider(GetTenantInvoicingReportSummaryUseCase)
      .useValue(getTenantInvoicingReportSummaryUseCase)
      .overrideProvider(GetTenantInvoiceByIdUseCase)
      .useValue(getTenantInvoiceByIdUseCase)
      .overrideProvider(GetTenantInvoiceItemByIdUseCase)
      .useValue(getTenantInvoiceItemByIdUseCase)
      .overrideProvider(GetTenantPartyByIdUseCase)
      .useValue(getTenantPartyByIdUseCase)
      .overrideProvider(GetTenantConversationThreadByIdUseCase)
      .useValue(getTenantConversationThreadByIdUseCase)
      .overrideProvider(GetTenantGrowthConversationWorkbenchUseCase)
      .useValue(getTenantGrowthConversationWorkbenchUseCase)
      .overrideProvider(GetTenantGrowthAssignmentWorkloadUseCase)
      .useValue(getTenantGrowthAssignmentWorkloadUseCase)
      .overrideProvider(GetTenantWhatsappAutomationRuleByIdUseCase)
      .useValue(getTenantWhatsappAutomationRuleByIdUseCase)
      .overrideProvider(GetTenantWhatsappAutomationSuggestionsUseCase)
      .useValue(getTenantWhatsappAutomationSuggestionsUseCase)
      .overrideProvider(GetTenantWhatsappOutboundReportingSummaryUseCase)
      .useValue(getTenantWhatsappOutboundReportingSummaryUseCase)
      .overrideProvider(GetTenantLeadByIdUseCase)
      .useValue(getTenantLeadByIdUseCase)
      .overrideProvider(GetTenantOpportunityByIdUseCase)
      .useValue(getTenantOpportunityByIdUseCase)
      .overrideProvider(GetTenantWhatsappMessageTemplateByIdUseCase)
      .useValue(getTenantWhatsappMessageTemplateByIdUseCase)
      .overrideProvider(GetTenantWebhookEventEnvelopeByIdUseCase)
      .useValue(getTenantWebhookEventEnvelopeByIdUseCase)
      .overrideProvider(GetTenantSubscriptionUseCase)
      .useValue(getTenantSubscriptionUseCase)
      .overrideProvider(ListTenantEnabledProductsUseCase)
      .useValue(listTenantEnabledProductsUseCase)
      .overrideProvider(ListTenantCustomersUseCase)
      .useValue(listTenantCustomersUseCase)
      .overrideProvider(ListTenantPartiesUseCase)
      .useValue(listTenantPartiesUseCase)
      .overrideProvider(ListTenantConversationMessagesUseCase)
      .useValue(listTenantConversationMessagesUseCase)
      .overrideProvider(ListTenantConversationMessageDeliveryEventsUseCase)
      .useValue(listTenantConversationMessageDeliveryEventsUseCase)
      .overrideProvider(ListTenantGrowthOperationalCasesUseCase)
      .useValue(listTenantGrowthOperationalCasesUseCase)
      .overrideProvider(ListTenantConversationThreadsUseCase)
      .useValue(listTenantConversationThreadsUseCase)
      .overrideProvider(ListTenantLeadsUseCase)
      .useValue(listTenantLeadsUseCase)
      .overrideProvider(ListTenantOpportunitiesUseCase)
      .useValue(listTenantOpportunitiesUseCase)
      .overrideProvider(ListTenantWebhookEventEnvelopesUseCase)
      .useValue(listTenantWebhookEventEnvelopesUseCase)
      .overrideProvider(ListTenantWhatsappAutomationRulesUseCase)
      .useValue(listTenantWhatsappAutomationRulesUseCase)
      .overrideProvider(ListTenantWhatsappConversationThreadsUseCase)
      .useValue(listTenantWhatsappConversationThreadsUseCase)
      .overrideProvider(ListTenantWhatsappMessageTemplatesUseCase)
      .useValue(listTenantWhatsappMessageTemplatesUseCase)
      .overrideProvider(ListTenantInvoiceItemsUseCase)
      .useValue(listTenantInvoiceItemsUseCase)
      .overrideProvider(ListTenantInvoicePaymentsUseCase)
      .useValue(listTenantInvoicePaymentsUseCase)
      .overrideProvider(ListTenantInvoiceSummariesUseCase)
      .useValue(listTenantInvoiceSummariesUseCase)
      .overrideProvider(ListTenantInvoicesUseCase)
      .useValue(listTenantInvoicesUseCase)
      .overrideProvider(ListTenantTaxRatesUseCase)
      .useValue(listTenantTaxRatesUseCase)
      .overrideProvider(ListTenantFeatureFlagsUseCase)
      .useValue(listTenantFeatureFlagsUseCase)
      .overrideProvider(ListPlanEntitlementsUseCase)
      .useValue(listPlanEntitlementsUseCase)
      .overrideProvider(ListPlansUseCase)
      .useValue(listPlansUseCase)
      .overrideProvider(RegisterUserUseCase)
      .useValue(registerUserUseCase)
      .overrideProvider(SUBSCRIPTION_REPOSITORY)
      .useValue(subscriptionRepository)
      .overrideProvider(USER_REPOSITORY)
      .useValue(userRepository)
      .overrideProvider(GetTenantBySlugUseCase)
      .useValue(getTenantBySlugUseCase)
      .overrideProvider(InviteUserToTenantUseCase)
      .useValue(inviteUserToTenantUseCase)
      .overrideProvider(ListProductModulesUseCase)
      .useValue(listProductModulesUseCase)
      .overrideProvider(ListProductsUseCase)
      .useValue(listProductsUseCase)
      .overrideProvider(ListTenantInvitationsUseCase)
      .useValue(listTenantInvitationsUseCase)
      .overrideProvider(ListTenantEntitlementsUseCase)
      .useValue(listTenantEntitlementsUseCase)
      .overrideProvider(CancelTenantInvitationUseCase)
      .useValue(cancelTenantInvitationUseCase)
      .overrideProvider(GetAuthenticatedUserInvitationUseCase)
      .useValue(getAuthenticatedUserInvitationUseCase)
      .overrideProvider(GetTenantInvitationByIdUseCase)
      .useValue(getTenantInvitationByIdUseCase)
      .overrideProvider(ResendTenantInvitationUseCase)
      .useValue(resendTenantInvitationUseCase)
      .overrideProvider(SetTenantFeatureFlagUseCase)
      .useValue(setTenantFeatureFlagUseCase)
      .overrideProvider(CreateTenantCustomerUseCase)
      .useValue(createTenantCustomerUseCase)
      .overrideProvider(CreateTenantConversationMessageUseCase)
      .useValue(createTenantConversationMessageUseCase)
      .overrideProvider(CreateTenantConversationThreadUseCase)
      .useValue(createTenantConversationThreadUseCase)
      .overrideProvider(CreateTenantGrowthOperationalCaseUseCase)
      .useValue(createTenantGrowthOperationalCaseUseCase)
      .overrideProvider(GetTenantGrowthAssistDailyAgendaUseCase)
      .useValue(getTenantGrowthAssistDailyAgendaUseCase)
      .overrideProvider(ListTenantAiApprovalRequestsUseCase)
      .useValue(listTenantAiApprovalRequestsUseCase)
      .overrideProvider(CreateTenantAiGuardedExecutionEventUseCase)
      .useValue(createTenantAiGuardedExecutionEventUseCase)
      .overrideProvider(GetTenantAiSuggestionRunDetailUseCase)
      .useValue(getTenantAiSuggestionRunDetailUseCase)
      .overrideProvider(ListTenantAiGuardedExecutionEventsUseCase)
      .useValue(listTenantAiGuardedExecutionEventsUseCase)
      .overrideProvider(ListTenantAiSuggestionRunsUseCase)
      .useValue(listTenantAiSuggestionRunsUseCase)
      .overrideProvider(PrepareTenantAiSuggestionRunUseCase)
      .useValue(prepareTenantAiSuggestionRunUseCase)
      .overrideProvider(RequestTenantAiSuggestionRunApprovalUseCase)
      .useValue(requestTenantAiSuggestionRunApprovalUseCase)
      .overrideProvider(ReviewTenantAiApprovalRequestUseCase)
      .useValue(reviewTenantAiApprovalRequestUseCase)
      .overrideProvider(GetTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase)
      .useValue(getTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase)
      .overrideProvider(CreateTenantWhatsappAutomationRuleUseCase)
      .useValue(createTenantWhatsappAutomationRuleUseCase)
      .overrideProvider(ExecuteTenantWhatsappAutomationActionsUseCase)
      .useValue(executeTenantWhatsappAutomationActionsUseCase)
      .overrideProvider(CreateTenantWhatsappMessageTemplateUseCase)
      .useValue(createTenantWhatsappMessageTemplateUseCase)
      .overrideProvider(AssignTenantConversationThreadUseCase)
      .useValue(assignTenantConversationThreadUseCase)
      .overrideProvider(CreateTenantLeadUseCase)
      .useValue(createTenantLeadUseCase)
      .overrideProvider(CreateTenantOpportunityUseCase)
      .useValue(createTenantOpportunityUseCase)
      .overrideProvider(AssignTenantOpportunityUseCase)
      .useValue(assignTenantOpportunityUseCase)
      .overrideProvider(IngestTenantWhatsappConversationMessageUseCase)
      .useValue(ingestTenantWhatsappConversationMessageUseCase)
      .overrideProvider(IngestTenantWhatsappDeliveryEventUseCase)
      .useValue(ingestTenantWhatsappDeliveryEventUseCase)
      .overrideProvider(ProcessTenantMetaWhatsappWebhookUseCase)
      .useValue(processTenantMetaWhatsappWebhookUseCase)
      .overrideProvider(ReceiveTenantMetaWhatsappWebhookUseCase)
      .useValue(receiveTenantMetaWhatsappWebhookUseCase)
      .overrideProvider(ReopenTenantGrowthOperationalCaseUseCase)
      .useValue(reopenTenantGrowthOperationalCaseUseCase)
      .overrideProvider(ReplayTenantWebhookEventEnvelopeUseCase)
      .useValue(replayTenantWebhookEventEnvelopeUseCase)
      .overrideProvider(AutoAssignTenantGrowthOperationalCasesUseCase)
      .useValue(autoAssignTenantGrowthOperationalCasesUseCase)
      .overrideProvider(ReviewTenantGrowthOperationalCaseRoutingUseCase)
      .useValue(reviewTenantGrowthOperationalCaseRoutingUseCase)
      .overrideProvider(ResolveTenantGrowthOperationalCaseUseCase)
      .useValue(resolveTenantGrowthOperationalCaseUseCase)
      .overrideProvider(RetryTenantWhatsappFailedConversationMessageUseCase)
      .useValue(retryTenantWhatsappFailedConversationMessageUseCase)
      .overrideProvider(RunTenantWhatsappOperationalMonitorUseCase)
      .useValue(runTenantWhatsappOperationalMonitorUseCase)
      .overrideProvider(RunTenantWhatsappReadyRetriesUseCase)
      .useValue(runTenantWhatsappReadyRetriesUseCase)
      .overrideProvider(ReleaseTenantGrowthOperationalCaseUseCase)
      .useValue(releaseTenantGrowthOperationalCaseUseCase)
      .overrideProvider(TakeTenantGrowthOperationalCaseUseCase)
      .useValue(takeTenantGrowthOperationalCaseUseCase)
      .overrideProvider(UpsertTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase)
      .useValue(upsertTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase)
      .overrideProvider(UpdateTenantGrowthOperationalCaseFollowUpStateUseCase)
      .useValue(updateTenantGrowthOperationalCaseFollowUpStateUseCase)
      .overrideProvider(MetaWhatsappWebhookSignatureVerifier)
      .useValue(metaWhatsappWebhookSignatureVerifier)
      .overrideProvider(MetaWhatsappWebhookTenantResolver)
      .useValue(metaWhatsappWebhookTenantResolver)
      .overrideProvider(SendTenantWhatsappConversationMessageUseCase)
      .useValue(sendTenantWhatsappConversationMessageUseCase)
      .overrideProvider(CreateTenantCreditNoteUseCase)
      .useValue(createTenantCreditNoteUseCase)
      .overrideProvider(CreateTenantDebitNoteUseCase)
      .useValue(createTenantDebitNoteUseCase)
      .overrideProvider(CreateTenantRemissionGuideUseCase)
      .useValue(createTenantRemissionGuideUseCase)
      .overrideProvider(CreateTenantWithholdingUseCase)
      .useValue(createTenantWithholdingUseCase)
      .overrideProvider(CreateTenantInvoiceUseCase)
      .useValue(createTenantInvoiceUseCase)
      .overrideProvider(CreateTenantInvoiceItemUseCase)
      .useValue(createTenantInvoiceItemUseCase)
      .overrideProvider(CreateTenantInvoicePaymentUseCase)
      .useValue(createTenantInvoicePaymentUseCase)
      .overrideProvider(CreateTenantTaxRateUseCase)
      .useValue(createTenantTaxRateUseCase)
      .overrideProvider(CheckTenantInvoiceElectronicAuthorizationUseCase)
      .useValue(checkTenantInvoiceElectronicAuthorizationUseCase)
      .overrideProvider(ReverseTenantInvoicePaymentUseCase)
      .useValue(reverseTenantInvoicePaymentUseCase)
      .overrideProvider(SendTenantInvoiceEmailUseCase)
      .useValue(sendTenantInvoiceEmailUseCase)
      .overrideProvider(SubmitTenantInvoiceElectronicDocumentUseCase)
      .useValue(submitTenantInvoiceElectronicDocumentUseCase)
      .overrideProvider(SubmitTenantPresignedInvoiceElectronicDocumentUseCase)
      .useValue(submitTenantPresignedInvoiceElectronicDocumentUseCase)
      .overrideProvider(UpdateTenantOpportunityStageUseCase)
      .useValue(updateTenantOpportunityStageUseCase)
      .overrideProvider(UpdateTenantInvoiceStatusUseCase)
      .useValue(updateTenantInvoiceStatusUseCase)
      .overrideProvider(UpdateTenantInvoiceElectronicStatusUseCase)
      .useValue(updateTenantInvoiceElectronicStatusUseCase)
      .overrideProvider(UpsertTenantElectronicSubmissionSettingsUseCase)
      .useValue(upsertTenantElectronicSubmissionSettingsUseCase)
      .overrideProvider(UpsertTenantElectronicSignatureSettingsUseCase)
      .useValue(upsertTenantElectronicSignatureSettingsUseCase)
      .overrideProvider(UpsertTenantIssuerProfileUseCase)
      .useValue(upsertTenantIssuerProfileUseCase)
      .overrideProvider(SyncTenantIssuerProfileTaxIdFromSignatureUseCase)
      .useValue(syncTenantIssuerProfileTaxIdFromSignatureUseCase)
      .overrideProvider(MetaWhatsappWebhookVerifier)
      .useValue(metaWhatsappWebhookVerifier)
      .overrideProvider(UpsertTenantInvoiceNumberingSettingsUseCase)
      .useValue(upsertTenantInvoiceNumberingSettingsUseCase)
      .overrideProvider(AcceptTenantInvitationUseCase)
      .useValue(acceptTenantInvitationUseCase)
      .overrideProvider(AcceptAuthenticatedUserInvitationUseCase)
      .useValue(acceptAuthenticatedUserInvitationUseCase)
      .overrideProvider(GetTenantMemberAccessUseCase)
      .useValue(getTenantMemberAccessUseCase)
      .overrideProvider(ListUserPendingInvitationsUseCase)
      .useValue(listUserPendingInvitationsUseCase)
      .overrideProvider(GetTenantMembershipByUserUseCase)
      .useValue(getTenantMembershipByUserUseCase)
      .overrideProvider(ListUserTenanciesUseCase)
      .useValue(listUserTenanciesUseCase)
      .overrideProvider(ListTenantMembershipsUseCase)
      .useValue(listTenantMembershipsUseCase)
      .overrideProvider(AssignMembershipRoleUseCase)
      .useValue(assignMembershipRoleUseCase)
      .overrideProvider(RemoveMembershipRoleUseCase)
      .useValue(removeMembershipRoleUseCase)
      .overrideProvider(ResolveTenantAccessUseCase)
      .useValue(resolveTenantAccessUseCase)
      .overrideProvider(CreateTenantUseCase)
      .useValue(createTenantUseCase)
      .compile();

    app = moduleFixture.createNestApplication({
      rawBody: true,
    });
    configureApp(app);
    await app.init();
    await app.listen(0);
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api should return a message', async () => {
    await request(httpServer)
      .get('/api')
      .expect(200)
      .expect({ message: 'Hello API' });
  });

  it('GET /api/growth/webhooks/whatsapp/meta should verify the webhook challenge without auth', async () => {
    await request(httpServer)
      .get('/api/growth/webhooks/whatsapp/meta')
      .query({
        'hub.mode': 'subscribe',
        'hub.verify_token': 'verify-token-123',
        'hub.challenge': 'challenge-xyz',
      })
      .expect(200)
      .expect('challenge-xyz');

    expect(metaWhatsappWebhookVerifier.verify).toHaveBeenCalledWith(
      'verify-token-123',
    );
  });

  it('GET /api/growth/webhooks/whatsapp/meta/tenants/:slug should verify the webhook challenge without auth', async () => {
    await request(httpServer)
      .get('/api/growth/webhooks/whatsapp/meta/tenants/saas-platform')
      .query({
        'hub.mode': 'subscribe',
        'hub.verify_token': 'verify-token-123',
        'hub.challenge': 'challenge-xyz',
      })
      .expect(200)
      .expect('challenge-xyz');

    expect(metaWhatsappWebhookVerifier.verify).toHaveBeenCalledWith(
      'verify-token-123',
    );
  });

  it('GET /api/growth/webhooks/whatsapp/meta/tenants/:slug should reject an invalid verify token', async () => {
    metaWhatsappWebhookVerifier.verify.mockReturnValueOnce(false);

    await request(httpServer)
      .get('/api/growth/webhooks/whatsapp/meta/tenants/saas-platform')
      .query({
        'hub.mode': 'subscribe',
        'hub.verify_token': 'wrong-token',
        'hub.challenge': 'challenge-xyz',
      })
      .expect(403)
      .expect({
        statusCode: 403,
        message: 'WhatsApp webhook verification token is invalid.',
        error: 'Forbidden',
      });
  });

  it('POST /api/growth/webhooks/whatsapp/meta should process a signed Meta-like webhook payload without auth', async () => {
    const payload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: 'waba-001',
          changes: [
            {
              field: 'messages',
              value: {
                metadata: {
                  phone_number_id: '1234567890',
                },
                contacts: [
                  {
                    wa_id: '+593999111222',
                    profile: {
                      name: 'Maria Perez',
                    },
                  },
                ],
                messages: [
                  {
                    id: 'wamid-001',
                    from: '+593999111222',
                    timestamp: '1715868000',
                    type: 'text',
                    text: {
                      body: 'Hola, quiero retomar la propuesta.',
                    },
                  },
                ],
                statuses: [
                  {
                    id: 'wamid-002',
                    status: 'delivered',
                    timestamp: '1715868060',
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    await request(httpServer)
      .post('/api/growth/webhooks/whatsapp/meta')
      .set('x-hub-signature-256', 'sha256=test-signature')
      .send(payload)
      .expect(201)
      .expect({
        status: 'EVENT_RECEIVED',
        tenantSlug: 'saas-platform',
        tenantResolutionSource: 'phone_number_id',
        envelopeId: 'webhook-envelope-001',
        eventKey: 'event-key-001',
        duplicate: false,
        envelopeStatus: 'processed',
        processedInboundMessages: 1,
        processedDeliveryEvents: 1,
      });

    expect(metaWhatsappWebhookSignatureVerifier.isConfigured).toHaveBeenCalled();
    expect(metaWhatsappWebhookSignatureVerifier.verify).toHaveBeenCalled();
    expect(metaWhatsappWebhookTenantResolver.resolve).toHaveBeenCalledWith(
      payload,
      null,
    );
    expect(receiveTenantMetaWhatsappWebhookUseCase.execute).toHaveBeenCalledWith(
      {
        tenantSlug: 'saas-platform',
        provider: 'meta_cloud_api',
        payload,
        rawPayloadJson: JSON.stringify(payload),
        signatureHeader: 'sha256=test-signature',
      },
    );
  });

  it('POST /api/growth/webhooks/whatsapp/meta should reject an invalid webhook signature', async () => {
    metaWhatsappWebhookSignatureVerifier.verify.mockReturnValueOnce(false);

    await request(httpServer)
      .post('/api/growth/webhooks/whatsapp/meta')
      .set('x-hub-signature-256', 'sha256=wrong-signature')
      .send({
        object: 'whatsapp_business_account',
        entry: [],
      })
      .expect(403)
      .expect({
        statusCode: 403,
        message: 'WhatsApp webhook signature is invalid.',
        error: 'Forbidden',
      });
  });

  it('POST /api/growth/webhooks/whatsapp/meta/tenants/:slug should process a Meta-like webhook payload without auth', async () => {
    await request(httpServer)
      .post('/api/growth/webhooks/whatsapp/meta/tenants/saas-platform')
      .send({
        object: 'whatsapp_business_account',
        entry: [
          {
            changes: [
              {
                field: 'messages',
                value: {
                  contacts: [
                    {
                      wa_id: '+593999111222',
                      profile: {
                        name: 'Maria Perez',
                      },
                    },
                  ],
                  messages: [
                    {
                      id: 'wamid-001',
                      from: '+593999111222',
                      timestamp: '1715868000',
                      type: 'text',
                      text: {
                        body: 'Hola, quiero retomar la propuesta.',
                      },
                    },
                  ],
                  statuses: [
                    {
                      id: 'wamid-002',
                      status: 'delivered',
                      timestamp: '1715868060',
                    },
                  ],
                },
              },
            ],
          },
        ],
      })
      .expect(201)
      .expect({
        status: 'EVENT_RECEIVED',
        tenantSlug: 'saas-platform',
        tenantResolutionSource: 'phone_number_id',
        envelopeId: 'webhook-envelope-001',
        eventKey: 'event-key-001',
        duplicate: false,
        envelopeStatus: 'processed',
        processedInboundMessages: 1,
        processedDeliveryEvents: 1,
      });

    expect(metaWhatsappWebhookTenantResolver.resolve).toHaveBeenCalledWith(
      {
        object: 'whatsapp_business_account',
        entry: [
          {
            changes: [
              {
                field: 'messages',
                value: {
                  contacts: [
                    {
                      wa_id: '+593999111222',
                      profile: {
                        name: 'Maria Perez',
                      },
                    },
                  ],
                  messages: [
                    {
                      id: 'wamid-001',
                      from: '+593999111222',
                      timestamp: '1715868000',
                      type: 'text',
                      text: {
                        body: 'Hola, quiero retomar la propuesta.',
                      },
                    },
                  ],
                  statuses: [
                    {
                      id: 'wamid-002',
                      status: 'delivered',
                      timestamp: '1715868060',
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
      'saas-platform',
    );
    expect(receiveTenantMetaWhatsappWebhookUseCase.execute).toHaveBeenCalledWith(
      {
        tenantSlug: 'saas-platform',
        provider: 'meta_cloud_api_stub',
        payload: {
          object: 'whatsapp_business_account',
          entry: [
            {
              changes: [
                {
                  field: 'messages',
                  value: {
                    contacts: [
                      {
                        wa_id: '+593999111222',
                        profile: {
                          name: 'Maria Perez',
                        },
                      },
                    ],
                    messages: [
                      {
                        id: 'wamid-001',
                        from: '+593999111222',
                        timestamp: '1715868000',
                        type: 'text',
                        text: {
                          body: 'Hola, quiero retomar la propuesta.',
                        },
                      },
                    ],
                    statuses: [
                      {
                        id: 'wamid-002',
                        status: 'delivered',
                        timestamp: '1715868060',
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        rawPayloadJson: JSON.stringify({
          object: 'whatsapp_business_account',
          entry: [
            {
              changes: [
                {
                  field: 'messages',
                  value: {
                    contacts: [
                      {
                        wa_id: '+593999111222',
                        profile: {
                          name: 'Maria Perez',
                        },
                      },
                    ],
                    messages: [
                      {
                        id: 'wamid-001',
                        from: '+593999111222',
                        timestamp: '1715868000',
                        type: 'text',
                        text: {
                          body: 'Hola, quiero retomar la propuesta.',
                        },
                      },
                    ],
                    statuses: [
                      {
                        id: 'wamid-002',
                        status: 'delivered',
                        timestamp: '1715868060',
                      },
                    ],
                  },
                },
              ],
            },
          ],
        }),
        signatureHeader: null,
      },
    );
  });

  it('POST /api/growth/webhooks/whatsapp/meta should expose duplicate webhook processing safely', async () => {
    receiveTenantMetaWhatsappWebhookUseCase.execute.mockResolvedValueOnce({
      tenantSlug: 'saas-platform',
      envelopeId: 'webhook-envelope-001',
      eventKey: 'event-key-001',
      duplicate: true,
      envelopeStatus: 'processed',
      processedInboundMessages: 1,
      processedDeliveryEvents: 1,
    });

    await request(httpServer)
      .post('/api/growth/webhooks/whatsapp/meta')
      .set('x-hub-signature-256', 'sha256=test-signature')
      .send({
        object: 'whatsapp_business_account',
        entry: [
          {
            id: 'waba-001',
            changes: [
              {
                field: 'messages',
                value: {
                  metadata: {
                    phone_number_id: '1234567890',
                  },
                  messages: [
                    {
                      id: 'wamid-001',
                      from: '+593999111222',
                      timestamp: '1715868000',
                      type: 'text',
                      text: {
                        body: 'Hola otra vez',
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      })
      .expect(201)
      .expect({
        status: 'EVENT_RECEIVED',
        tenantSlug: 'saas-platform',
        tenantResolutionSource: 'phone_number_id',
        envelopeId: 'webhook-envelope-001',
        eventKey: 'event-key-001',
        duplicate: true,
        envelopeStatus: 'processed',
        processedInboundMessages: 1,
        processedDeliveryEvents: 1,
      });
  });

  it('GET /api/growth/tenants/:slug/conversations/whatsapp-inbox/webhook-envelopes should return persisted webhook envelopes', async () => {
    await request(httpServer)
      .get(
        '/api/growth/tenants/saas-platform/conversations/whatsapp-inbox/webhook-envelopes',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'webhook-envelope-001',
          tenantId: 'tenant_123',
          provider: 'meta_cloud_api_stub',
          channel: 'whatsapp',
          eventKey: 'event-key-001',
          providerEventId: 'message:wamid-001',
          payloadHash: 'payload-hash-001',
          signatureHeader: 'sha256=test-signature',
          objectType: 'whatsapp_business_account',
          externalAccountId: 'waba-001',
          externalPhoneNumberId: '1234567890',
          status: 'processed',
          replayCount: 0,
          lastReplayedAt: null,
          processedInboundMessages: 1,
          processedDeliveryEvents: 1,
          failureReason: null,
          payloadJson: '{"object":"whatsapp_business_account"}',
          receivedAt: '2026-05-18T15:00:00.000Z',
          processedAt: '2026-05-18T15:00:01.000Z',
          createdAt: '2026-05-18T15:00:00.000Z',
          updatedAt: '2026-05-18T15:00:01.000Z',
        },
      ]);

    expect(listTenantWebhookEventEnvelopesUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/growth/tenants/:slug/conversations/whatsapp-inbox/webhook-envelopes/:envelopeId should return one webhook envelope', async () => {
    await request(httpServer)
      .get(
        '/api/growth/tenants/saas-platform/conversations/whatsapp-inbox/webhook-envelopes/webhook-envelope-001',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'webhook-envelope-001',
        tenantId: 'tenant_123',
        provider: 'meta_cloud_api_stub',
        channel: 'whatsapp',
        eventKey: 'event-key-001',
        providerEventId: 'message:wamid-001',
        payloadHash: 'payload-hash-001',
        signatureHeader: 'sha256=test-signature',
        objectType: 'whatsapp_business_account',
        externalAccountId: 'waba-001',
        externalPhoneNumberId: '1234567890',
        status: 'processed',
        replayCount: 0,
        lastReplayedAt: null,
        processedInboundMessages: 1,
        processedDeliveryEvents: 1,
        failureReason: null,
        payloadJson: '{"object":"whatsapp_business_account"}',
        receivedAt: '2026-05-18T15:00:00.000Z',
        processedAt: '2026-05-18T15:00:01.000Z',
        createdAt: '2026-05-18T15:00:00.000Z',
        updatedAt: '2026-05-18T15:00:01.000Z',
      });

    expect(getTenantWebhookEventEnvelopeByIdUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'webhook-envelope-001',
    );
  });

  it('POST /api/growth/tenants/:slug/conversations/whatsapp-inbox/webhook-envelopes/:envelopeId/replay should replay a persisted envelope', async () => {
    await request(httpServer)
      .post(
        '/api/growth/tenants/saas-platform/conversations/whatsapp-inbox/webhook-envelopes/webhook-envelope-001/replay',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201)
      .expect({
        id: 'webhook-envelope-001',
        tenantId: 'tenant_123',
        provider: 'meta_cloud_api_stub',
        channel: 'whatsapp',
        eventKey: 'event-key-001',
        providerEventId: 'message:wamid-001',
        payloadHash: 'payload-hash-001',
        signatureHeader: 'sha256=test-signature',
        objectType: 'whatsapp_business_account',
        externalAccountId: 'waba-001',
        externalPhoneNumberId: '1234567890',
        status: 'processed',
        replayCount: 1,
        lastReplayedAt: '2026-05-18T16:00:00.000Z',
        processedInboundMessages: 1,
        processedDeliveryEvents: 1,
        failureReason: null,
        payloadJson: '{"object":"whatsapp_business_account"}',
        receivedAt: '2026-05-18T15:00:00.000Z',
        processedAt: '2026-05-18T15:00:01.000Z',
        createdAt: '2026-05-18T15:00:00.000Z',
        updatedAt: '2026-05-18T16:00:00.000Z',
      });

    expect(replayTenantWebhookEventEnvelopeUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'webhook-envelope-001',
    );
  });

  it('GET /api/identity/users/:id should return a user', async () => {
    await request(httpServer)
      .get('/api/identity/users/user_123')
      .expect(200)
      .expect({
        id: 'user_123',
        email: 'hello@saas-platform.dev',
        name: 'Jorge',
        avatarUrl: null,
        authProvider: AuthProvider.Password,
        externalAuthId: null,
        createdAt: registeredAt.toISOString(),
        updatedAt: registeredAt.toISOString(),
      });

    expect(registerUserUseCase.execute).toHaveBeenCalledTimes(0);
    expect(getUserByIdUseCase.execute).toHaveBeenCalledWith('user_123');
  });

  it('GET /api/platform/products should return the platform catalog products', async () => {
    await request(httpServer)
      .get('/api/platform/products')
      .expect(200)
      .expect([
        {
          id: 'product_invoicing',
          key: 'invoicing',
          name: 'Invoicing',
          description: 'Facturacion, clientes, catalogo y reportes.',
          isActive: true,
          createdAt: '2026-04-23T17:00:00.000Z',
          updatedAt: '2026-04-23T17:00:00.000Z',
        },
        {
          id: 'product_psychology',
          key: 'psychology',
          name: 'Psychology',
          description: 'Gestion de profesionales, pacientes y sesiones.',
          isActive: true,
          createdAt: '2026-04-23T17:00:00.000Z',
          updatedAt: '2026-04-23T17:00:00.000Z',
        },
      ]);
  });

  it('GET /api/platform/products/:productKey should return one product', async () => {
    await request(httpServer)
      .get('/api/platform/products/invoicing')
      .expect(200)
      .expect({
        id: 'product_invoicing',
        key: 'invoicing',
        name: 'Invoicing',
        description: 'Facturacion, clientes, catalogo y reportes.',
        isActive: true,
        createdAt: '2026-04-23T17:00:00.000Z',
        updatedAt: '2026-04-23T17:00:00.000Z',
      });

    expect(getProductByKeyUseCase.execute).toHaveBeenCalledWith('invoicing');
  });

  it('GET /api/platform/products/:productKey should return 404 when the product does not exist', async () => {
    getProductByKeyUseCase.execute.mockRejectedValueOnce(new ProductNotFoundError('unknown'));

    await request(httpServer)
      .get('/api/platform/products/unknown')
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'Product with key "unknown" was not found.',
        error: 'Not Found',
      });
  });

  it('GET /api/platform/products/:productKey/modules should return catalog modules', async () => {
    await request(httpServer)
      .get('/api/platform/products/invoicing/modules')
      .expect(200)
      .expect([
        {
          id: 'module_invoicing_customers',
          productId: 'product_invoicing',
          key: 'customers',
          name: 'Customers',
          description: 'Gestion de clientes.',
          isCore: true,
          isActive: true,
          createdAt: '2026-04-23T17:00:00.000Z',
          updatedAt: '2026-04-23T17:00:00.000Z',
        },
        {
          id: 'module_invoicing_invoices',
          productId: 'product_invoicing',
          key: 'invoices',
          name: 'Invoices',
          description: 'Emision de facturas.',
          isCore: true,
          isActive: true,
          createdAt: '2026-04-23T17:00:00.000Z',
          updatedAt: '2026-04-23T17:00:00.000Z',
        },
      ]);

    expect(listProductModulesUseCase.execute).toHaveBeenCalledWith('invoicing');
  });

  it('GET /api/platform/plans should return the commercial plan catalog', async () => {
    await request(httpServer)
      .get('/api/platform/plans')
      .expect(200)
      .expect([
        {
          id: 'plan_growth_monthly',
          key: 'growth',
          name: 'Growth',
          description:
            'Plan para equipos en crecimiento con multiples capacidades activas.',
          priceInCents: 9900,
          currency: 'USD',
          billingCycle: 'monthly',
          isActive: true,
          createdAt: '2026-04-23T18:00:00.000Z',
          updatedAt: '2026-04-23T18:00:00.000Z',
        },
        {
          id: 'plan_enterprise_monthly',
          key: 'enterprise',
          name: 'Enterprise',
          description:
            'Plan avanzado con acceso amplio a productos y limites elevados.',
          priceInCents: 29900,
          currency: 'USD',
          billingCycle: 'monthly',
          isActive: true,
          createdAt: '2026-04-23T18:00:00.000Z',
          updatedAt: '2026-04-23T18:00:00.000Z',
        },
      ]);
  });

  it('GET /api/platform/plans/:planKey should return one plan', async () => {
    await request(httpServer)
      .get('/api/platform/plans/growth')
      .expect(200)
      .expect({
        id: 'plan_growth_monthly',
        key: 'growth',
        name: 'Growth',
        description:
          'Plan para equipos en crecimiento con multiples capacidades activas.',
        priceInCents: 9900,
        currency: 'USD',
        billingCycle: 'monthly',
        isActive: true,
        createdAt: '2026-04-23T18:00:00.000Z',
        updatedAt: '2026-04-23T18:00:00.000Z',
      });

    expect(getPlanByKeyUseCase.execute).toHaveBeenCalledWith('growth');
  });

  it('GET /api/platform/plans/:planKey/entitlements should return the plan entitlements', async () => {
    await request(httpServer)
      .get('/api/platform/plans/growth/entitlements')
      .expect(200)
      .expect([
        {
          id: 'plan_entitlement_growth_products',
          planId: 'plan_growth_monthly',
          key: 'products',
          value: ['invoicing', 'learning'],
          createdAt: '2026-04-23T18:00:00.000Z',
          updatedAt: '2026-04-23T18:00:00.000Z',
        },
        {
          id: 'plan_entitlement_growth_max_users',
          planId: 'plan_growth_monthly',
          key: 'max_users',
          value: 15,
          createdAt: '2026-04-23T18:00:00.000Z',
          updatedAt: '2026-04-23T18:00:00.000Z',
        },
      ]);

    expect(listPlanEntitlementsUseCase.execute).toHaveBeenCalledWith('growth');
  });

  it('GET /api/platform/plans/:planKey should return 404 when the plan does not exist', async () => {
    getPlanByKeyUseCase.execute.mockRejectedValueOnce(new PlanNotFoundError('missing'));

    await request(httpServer)
      .get('/api/platform/plans/missing')
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'Plan with key "missing" was not found.',
        error: 'Not Found',
      });
  });

  it('GET /api/tenancy/tenants/:slug/subscription should return the current tenant subscription', async () => {
    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/subscription')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'subscription_123',
        tenantId: 'tenant_123',
        planId: 'plan_growth_monthly',
        status: 'active',
        startedAt: '2026-04-23T18:00:00.000Z',
        expiresAt: null,
        trialEndsAt: null,
        createdAt: '2026-04-23T18:00:00.000Z',
        updatedAt: '2026-04-23T18:00:00.000Z',
      });

    expect(getTenantSubscriptionUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/tenancy/tenants/:slug/products should return the enabled tenant products', async () => {
    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/products')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'product_invoicing',
          key: 'invoicing',
          name: 'Invoicing',
          description: 'Facturacion, clientes, catalogo y reportes.',
          isActive: true,
          createdAt: '2026-04-23T17:00:00.000Z',
          updatedAt: '2026-04-23T17:00:00.000Z',
        },
      ]);

    expect(listTenantEnabledProductsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/tenancy/tenants/:slug/products should require entitlement visibility permission', async () => {
    resolveTenantAccessUseCase.execute.mockResolvedValueOnce({
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      userId: 'user_456',
      membershipId: 'membership_456',
      membershipStatus: MembershipStatus.Active,
      roleKeys: ['tenant_member'],
      permissionKeys: [TENANT_PERMISSIONS.READ],
    });

    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/products')
      .set('Authorization', `Bearer ${memberToken}`)
      .expect(403)
      .expect({
        statusCode: 403,
        message:
          'Permission "tenant.entitlements.read" is required for this tenant resource.',
        error: 'Forbidden',
      });
  });

  it('GET /api/tenancy/tenants/:slug/products/:productKey/modules should return enabled modules for the tenant product', async () => {
    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/products/invoicing/modules')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'module_invoicing_customers',
          productId: 'product_invoicing',
          key: 'customers',
          name: 'Customers',
          description: 'Gestion de clientes.',
          isCore: true,
          isActive: true,
          createdAt: '2026-04-23T17:00:00.000Z',
          updatedAt: '2026-04-23T17:00:00.000Z',
        },
        {
          id: 'module_invoicing_invoices',
          productId: 'product_invoicing',
          key: 'invoices',
          name: 'Invoices',
          description: 'Emision de facturas.',
          isCore: true,
          isActive: true,
          createdAt: '2026-04-23T17:00:00.000Z',
          updatedAt: '2026-04-23T17:00:00.000Z',
        },
      ]);

    expect(getTenantEnabledProductByKeyUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoicing',
    );
    expect(listProductModulesUseCase.execute).toHaveBeenCalledWith('invoicing');
  });

  it('GET /api/tenancy/tenants/:slug/products/:productKey/modules should return 403 when the product is not enabled for the tenant', async () => {
    getTenantEnabledProductByKeyUseCase.execute.mockRejectedValueOnce(
      new TenantProductAccessDeniedError('saas-platform', 'psychology'),
    );

    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/products/psychology/modules')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(403)
      .expect({
        statusCode: 403,
        message: 'Product "psychology" is not enabled for tenant "saas-platform".',
        error: 'Forbidden',
      });
  });

  it('GET /api/tenancy/tenants/:slug/products/:productKey/modules should return 404 when the product does not exist', async () => {
    getTenantEnabledProductByKeyUseCase.execute.mockRejectedValueOnce(
      new ProductNotFoundError('unknown'),
    );

    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/products/unknown/modules')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'Product with key "unknown" was not found.',
        error: 'Not Found',
      });
  });

  it('GET /api/invoicing/tenants/:slug/customers should return tenant-scoped customers', async () => {
    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/customers')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'customer_acme',
          tenantId: 'tenant_123',
          name: 'Acme Corp',
          email: 'billing@acme.dev',
          taxId: '1790012345001',
          identificationType: '04',
          identification: '1790012345001',
          billingAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
          createdAt: '2026-04-27T15:00:00.000Z',
          updatedAt: '2026-04-27T15:00:00.000Z',
        },
        {
          id: 'customer_globex',
          tenantId: 'tenant_123',
          name: 'Globex LLC',
          email: null,
          taxId: null,
          identificationType: null,
          identification: null,
          billingAddress: null,
          createdAt: '2026-04-27T15:10:00.000Z',
          updatedAt: '2026-04-27T15:10:00.000Z',
        },
      ]);

    expect(getTenantEnabledProductByKeyUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoicing',
    );
    expect(listTenantCustomersUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/parties/tenants/:slug/parties should return tenant-scoped shared parties', async () => {
    await request(httpServer)
      .get('/api/parties/tenants/saas-platform/parties')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'customer_acme',
          tenantId: 'tenant_123',
          displayName: 'Acme Corp',
          email: 'billing@acme.dev',
          taxId: '1790012345001',
          identificationType: '04',
          identification: '1790012345001',
          billingAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
          roles: ['customer'],
          kind: 'organization',
          sourceContext: 'invoicing_customer',
          createdAt: '2026-04-27T15:00:00.000Z',
          updatedAt: '2026-04-27T15:00:00.000Z',
        },
        {
          id: 'customer_globex',
          tenantId: 'tenant_123',
          displayName: 'Globex LLC',
          email: null,
          taxId: null,
          identificationType: null,
          identification: null,
          billingAddress: null,
          roles: ['customer'],
          kind: 'unknown',
          sourceContext: 'invoicing_customer',
          createdAt: '2026-04-27T15:10:00.000Z',
          updatedAt: '2026-04-27T15:10:00.000Z',
        },
      ]);

    expect(getTenantEnabledProductByKeyUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoicing',
    );
    expect(listTenantPartiesUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/parties/tenants/:slug/parties/:partyId should return one shared party', async () => {
    await request(httpServer)
      .get('/api/parties/tenants/saas-platform/parties/customer_acme')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'customer_acme',
        tenantId: 'tenant_123',
        displayName: 'Acme Corp',
        email: 'billing@acme.dev',
        taxId: '1790012345001',
        identificationType: '04',
        identification: '1790012345001',
        billingAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
        roles: ['customer'],
        kind: 'organization',
        sourceContext: 'invoicing_customer',
        createdAt: '2026-04-27T15:00:00.000Z',
        updatedAt: '2026-04-27T15:00:00.000Z',
      });

    expect(getTenantPartyByIdUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'customer_acme',
    );
  });

  it('GET /api/parties/tenants/:slug/parties should require customer visibility permission', async () => {
    resolveTenantAccessUseCase.execute.mockResolvedValueOnce({
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      userId: 'user_456',
      membershipId: 'membership_456',
      membershipStatus: MembershipStatus.Active,
      roleKeys: ['tenant_member'],
      permissionKeys: [TENANT_PERMISSIONS.READ],
    });

    await request(httpServer)
      .get('/api/parties/tenants/saas-platform/parties')
      .set('Authorization', `Bearer ${memberToken}`)
      .expect(403)
      .expect({
        statusCode: 403,
        message:
          'Permission "invoicing.customers.read" is required for this tenant resource.',
        error: 'Forbidden',
      });
  });

  it('GET /api/growth/tenants/:slug/leads should return tenant-scoped leads', async () => {
    await request(httpServer)
      .get('/api/growth/tenants/saas-platform/leads')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'lead_001',
          tenantId: 'tenant_123',
          fullName: 'Maria Perez',
          email: 'maria@example.com',
          phoneE164: '+593999111222',
          whatsappE164: '+593999111222',
          source: 'landing_page',
          status: 'captured',
          notes: 'Quiere demo del modulo de facturacion.',
          createdAt: '2026-05-15T14:30:00.000Z',
          updatedAt: '2026-05-15T14:30:00.000Z',
        },
        {
          id: 'lead_002',
          tenantId: 'tenant_123',
          fullName: 'Carlos Mena',
          email: null,
          phoneE164: '+593988000777',
          whatsappE164: null,
          source: 'whatsapp_campaign',
          status: 'qualified',
          notes: null,
          createdAt: '2026-05-15T13:10:00.000Z',
          updatedAt: '2026-05-15T13:10:00.000Z',
        },
      ]);

    expect(listTenantLeadsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/growth/tenants/:slug/leads/:leadId should return one tenant lead', async () => {
    await request(httpServer)
      .get('/api/growth/tenants/saas-platform/leads/lead_001')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'lead_001',
        tenantId: 'tenant_123',
        fullName: 'Maria Perez',
        email: 'maria@example.com',
        phoneE164: '+593999111222',
        whatsappE164: '+593999111222',
        source: 'landing_page',
        status: 'captured',
        notes: 'Quiere demo del modulo de facturacion.',
        createdAt: '2026-05-15T14:30:00.000Z',
        updatedAt: '2026-05-15T14:30:00.000Z',
      });

    expect(getTenantLeadByIdUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'lead_001',
    );
  });

  it('POST /api/growth/tenants/:slug/leads should create a tenant lead', async () => {
    await request(httpServer)
      .post('/api/growth/tenants/saas-platform/leads')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        fullName: 'Maria Perez',
        email: 'Maria@Example.com',
        phoneE164: '+593999111222',
        whatsappE164: '+593999111222',
        source: 'landing_page',
        status: 'captured',
        notes: 'Quiere demo del modulo de facturacion.',
      })
      .expect(201)
      .expect({
        id: 'lead_001',
        tenantId: 'tenant_123',
        fullName: 'Maria Perez',
        email: 'maria@example.com',
        phoneE164: '+593999111222',
        whatsappE164: '+593999111222',
        source: 'landing_page',
        status: 'captured',
        notes: 'Quiere demo del modulo de facturacion.',
        createdAt: '2026-05-15T14:30:00.000Z',
        updatedAt: '2026-05-15T14:30:00.000Z',
      });

    expect(createTenantLeadUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      fullName: 'Maria Perez',
      email: 'Maria@Example.com',
      phoneE164: '+593999111222',
      whatsappE164: '+593999111222',
      source: 'landing_page',
      status: 'captured',
      notes: 'Quiere demo del modulo de facturacion.',
    });
  });

  it('GET /api/growth/tenants/:slug/leads should require growth read permission', async () => {
    resolveTenantAccessUseCase.execute.mockResolvedValueOnce({
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      userId: 'user_456',
      membershipId: 'membership_456',
      membershipStatus: MembershipStatus.Active,
      roleKeys: ['tenant_member'],
      permissionKeys: [TENANT_PERMISSIONS.READ],
    });

    await request(httpServer)
      .get('/api/growth/tenants/saas-platform/leads')
      .set('Authorization', `Bearer ${memberToken}`)
      .expect(403)
      .expect({
        statusCode: 403,
        message:
          'Permission "growth.leads.read" is required for this tenant resource.',
        error: 'Forbidden',
      });
  });

  it('GET /api/growth/tenants/:slug/conversations should return tenant-scoped conversation threads', async () => {
    await request(httpServer)
      .get('/api/growth/tenants/saas-platform/conversations')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'thread_001',
          tenantId: 'tenant_123',
          leadId: 'lead_001',
          assigneeUserId: null,
          subject: 'Demo de onboarding facturacion',
          channel: 'manual',
          externalConversationId: null,
          participantDisplayName: null,
          participantHandle: null,
          status: 'open',
          latestMessagePreview:
            'Hola Maria, te comparto los siguientes pasos para la demo.',
          messageCount: 2,
          openedAt: '2026-05-15T14:40:00.000Z',
          closedAt: null,
          lastActivityAt: '2026-05-15T14:45:00.000Z',
          createdAt: '2026-05-15T14:40:00.000Z',
          updatedAt: '2026-05-15T14:45:00.000Z',
        },
      ]);

    expect(listTenantConversationThreadsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/growth/tenants/:slug/conversations?assigneeUserId=:userId should forward the assignee filter', async () => {
    await request(httpServer)
      .get('/api/growth/tenants/saas-platform/conversations?assigneeUserId=user_456')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(listTenantConversationThreadsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'user_456',
    );
  });

  it('GET /api/growth/tenants/:slug/conversations/workbench should return conversation workbench analytics', async () => {
    await request(httpServer)
      .get(
        '/api/growth/tenants/saas-platform/conversations/workbench?assigneeUserId=user_456&channel=whatsapp&firstResponseSlaHours=2&followUpSlaHours=6&staleThreadHours=24',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        tenantSlug: 'saas-platform',
        generatedAt: '2026-05-19T16:45:00.000Z',
        policy: {
          firstResponseSlaHours: 1,
          followUpSlaHours: 12,
          staleThreadHours: 48,
        },
        summary: {
          openThreadCount: 2,
          unassignedThreadCount: 1,
          waitingOnTeamCount: 1,
          waitingOnCustomerCount: 1,
          overdueFirstResponseCount: 0,
          overdueFollowUpCount: 0,
          staleThreadCount: 0,
        },
        threads: [
          {
            threadId: 'thread_001',
            leadId: 'lead_001',
            assigneeUserId: null,
            subject: 'Demo de onboarding facturacion',
            channel: 'manual',
            status: 'open',
            latestMessagePreview:
              'Hola Maria, te comparto los siguientes pasos para la demo.',
            nextActionOwner: 'customer',
            firstResponseStatus: 'not_applicable',
            followUpStatus: 'not_applicable',
            staleStatus: 'fresh',
            priority: 'normal',
            messageCount: 2,
            hoursSinceLastActivity: 1.5,
            hoursSinceLastInbound: 1.5,
            hoursSinceOpened: 1.58,
            openedAt: '2026-05-15T14:40:00.000Z',
            lastActivityAt: '2026-05-15T14:45:00.000Z',
            lastInboundAt: '2026-05-15T14:45:00.000Z',
            lastOutboundAt: '2026-05-15T14:40:00.000Z',
          },
          {
            threadId: 'thread_whatsapp_001',
            leadId: 'lead_001',
            assigneeUserId: null,
            subject: 'Maria Perez',
            channel: 'whatsapp',
            status: 'open',
            latestMessagePreview: 'Hola, quiero retomar la propuesta.',
            nextActionOwner: 'team',
            firstResponseStatus: 'not_applicable',
            followUpStatus: 'pending',
            staleStatus: 'fresh',
            priority: 'high',
            messageCount: 1,
            hoursSinceLastActivity: 0.75,
            hoursSinceLastInbound: 0.75,
            hoursSinceOpened: 0.75,
            openedAt: '2026-05-16T14:00:00.000Z',
            lastActivityAt: '2026-05-16T14:00:00.000Z',
            lastInboundAt: '2026-05-16T14:00:00.000Z',
            lastOutboundAt: null,
          },
        ],
      });

    expect(getTenantGrowthConversationWorkbenchUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      {
        assigneeUserId: 'user_456',
        channel: 'whatsapp',
        firstResponseSlaHours: 2,
        followUpSlaHours: 6,
        staleThreadHours: 24,
      },
    );
  });

  it('GET /api/growth/tenants/:slug/conversations/assist/daily-agenda should return the simplified Growth Assist agenda', async () => {
    await request(httpServer)
      .get('/api/growth/tenants/saas-platform/conversations/assist/daily-agenda')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        tenantSlug: 'saas-platform',
        generatedAt: '2026-05-20T10:36:00.000Z',
        summary: {
          tone: 'warning',
          headline:
            'La bandeja no esta rota, pero si hay seguimientos que no conviene dejar enfriar.',
          detail:
            'Usa esta agenda como recordatorio simple: primero sigue lo que ya esta caliente, luego reparte owner nuevo si hace falta.',
          replyNowCount: 1,
          followUpNowCount: 2,
          waitingCustomerCount: 0,
          queueToOrganizeCount: 1,
          channelRiskCount: 0,
          savedPolicyKey: 'follow_up_first',
        },
        leadWarmthSummary: {
          hotCount: 1,
          warmCount: 0,
          watchCount: 0,
          dominantWarmth: 'hot',
          recommendedFocus:
            'Prioriza respuestas o seguimientos que ya estan pidiendo movimiento hoy.',
        },
        tasks: [
          {
            key: 'reply:thread_001',
            urgency: 'today',
            category: 'reply_now',
            title: 'Responder a WhatsApp Maria Perez',
            summary: 'WhatsApp lleva 2 horas esperando una respuesta del equipo.',
            actionLabel: 'Asignar y responder',
            dueAt: '2026-05-20T08:00:00.000Z',
            threadId: 'thread_001',
            operationalCaseId: null,
          },
        ],
        conversationCues: [
          {
            key: 'thread_001',
            warmth: 'hot',
            title: 'WhatsApp Maria Perez',
            summary:
              'WhatsApp · ultima actividad hace 2 horas · Hola, quisiera una demo.',
            suggestedReply:
              'Hola WhatsApp Maria Perez, gracias por escribirnos. Quiero retomar esto hoy mismo y dejarte el siguiente paso claro.',
            nextMove: 'Primero deja owner claro y luego responde.',
            threadId: 'thread_001',
          },
        ],
        replySuggestions: [
          {
            key: 'reply-suggestion:thread_001',
            warmth: 'hot',
            title: 'WhatsApp Maria Perez',
            reason: 'La conversacion sigue sin primera respuesta despues de 2 horas.',
            goal:
              'Reconocer el contacto, retomar confianza y proponer el siguiente paso.',
            suggestedReply:
              'Hola WhatsApp Maria Perez, gracias por escribirnos. Retomo esto hoy para ayudarte sin dejarlo enfriar. Si te parece, te comparto el siguiente paso y lo dejamos encaminado ahora mismo.',
            followUpPrompt:
              'Pregunta si prefiere demo, cotizacion o una respuesta puntual para destrabar la conversacion.',
            checklist: [
              'Deja un owner claro antes de cerrar el siguiente paso.',
              'Agradece el contacto y reconoce la espera si aplica.',
              'Propón un siguiente paso concreto en lugar de una pregunta abierta genérica.',
              'Cierra con una pregunta simple que facilite responder rápido.',
            ],
            threadId: 'thread_001',
          },
        ],
        nextActions: [
          {
            key: 'next-action:reply:thread_001',
            emphasis: 'do_now',
            actionType: 'reply_now',
            title: 'Responder a WhatsApp Maria Perez',
            whyNow: 'WhatsApp lleva 2 horas esperando una respuesta del equipo.',
            recommendedAction:
              'Responder hoy mismo y cerrar con un siguiente paso concreto.',
            businessImpact:
              'Responder tarde enfria conversaciones que ya llegaron con intencion activa.',
            threadId: 'thread_001',
            operationalCaseId: null,
          },
        ],
        leadWarmthHints: [
          {
            key: 'warmth:thread_001',
            warmth: 'hot',
            title: 'WhatsApp Maria Perez',
            signalSummary:
              'WhatsApp · ultima actividad hace 2 horas · Hola, quisiera una demo.',
            whyWarmth:
              'Se ve caliente porque ya pide respuesta o seguimiento del equipo y puede enfriarse rapido.',
            recommendedCadence: 'Muévelo hoy mismo.',
            riskNote: 'Si se demora, puedes perder la intención más fuerte.',
            threadId: 'thread_001',
          },
        ],
        playbooks: [
          {
            key: 'reply-now',
            title: 'Responder primero',
            detail:
              'Antes de abrir nueva prospeccion, responde lo que ya llego caliente. Esa es la forma mas simple de no perder conversion por demora.',
            goal:
              'Recuperar velocidad de respuesta y dejar un siguiente paso claro sin sonar robotico.',
            avoid:
              'No contestes con un texto generico que ignore el contexto ni dejes la conversacion abierta sin siguiente paso.',
            successSignal:
              'El lead responde o acepta el siguiente paso dentro de la misma ventana de seguimiento.',
            whenToUse:
              'Cuando hay conversaciones sin primera respuesta o follow-up vencido.',
            steps: [
              'Agradece el contacto y retoma el contexto en una frase simple.',
              'Propone un siguiente paso concreto para hoy.',
              'Cierra con una pregunta que facilite una respuesta corta.',
            ],
          },
        ],
        waitingCustomerQueue: [],
        channelHealth: {
          overallStatus: 'healthy',
          totalAlertCount: 0,
          readyRetryCount: 0,
          topAlertTitle: null,
          topAlertSummary: null,
          topAlertRecommendedAction: null,
        },
      });

    expect(getTenantGrowthAssistDailyAgendaUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/invoicing/tenants/:slug/assist/document-drafting should return the deterministic invoicing drafting surface', async () => {
    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/assist/document-drafting')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        tenantSlug: 'saas-platform',
        generatedAt: '2026-05-23T10:30:00.000Z',
        summary: {
          tone: 'warning',
          readinessStatus: 'needs_attention',
          headline:
            'El tenant ya puede apoyarse en sugerencias, aunque conviene revisar detalles antes de empujar documentos.',
          detail:
            'Usa esta superficie para ordenar checklist, documentar riesgos y preparar mejor la revision humana.',
          suggestedFocus:
            'Conviene revisar vigencia del certificado antes de empujar mas documentos.',
        },
        checklist: [
          {
            key: 'issuer_profile',
            label: 'Perfil fiscal',
            status: 'ready',
            detail: 'Configurado para pruebas con RUC 1790012345001.',
          },
          {
            key: 'signature_material',
            label: 'Material de firma',
            status: 'warning',
            detail: 'Conviene revisar vigencia del certificado.',
          },
        ],
        documentGuidance: [
          {
            documentCode: '01',
            label: 'Factura',
            status: 'ready',
            detail: 'Documento listo para trabajar.',
            recommendedUse:
              'Usalo para preparar facturas nuevas y revisar si el tenant ya tiene base suficiente para emitirlas sin improvisar.',
          },
          {
            documentCode: '04',
            label: 'Nota de credito',
            status: 'blocked',
            detail: 'Falta numeracion.',
            recommendedUse:
              'Usalo cuando haya que corregir o anular una factura previa con criterio documentado.',
          },
        ],
        reportSnapshot: {
          customerCount: 3,
          invoiceCount: 9,
          outstandingTotalInCents: 145000,
          dominantStatus: 'issued',
          busiestMonth: '2026-05',
        },
        draftingHints: [
          {
            key: 'drafting-brief',
            title: 'Brief de preparacion',
            objective:
              'Explicar que piezas conviene completar antes de redactar o revisar un comprobante.',
            whenToUse:
              'Cuando el operador necesita una guia corta para entender si el tenant esta listo o todavia tiene huecos.',
            recommendedInputs: [
              'Resumen del checklist formal',
              'Estado de numeracion y firma',
            ],
            caution:
              'Toma la sugerencia como checklist guiado y no como validacion fiscal final.',
          },
        ],
        safeActions: ['Explicar checklist'],
        blockedActions: [
          'Firmar electronicamente el documento sin aprobacion humana.',
        ],
      });

    expect(getTenantInvoiceDocumentDraftingAssistUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/ai/agents should return the transversal AI agent catalog', async () => {
    await request(httpServer)
      .get('/api/ai/agents')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          key: 'growth-assist-coach',
          title: 'Growth Assist Coach',
          summary:
            'Turns deterministic Growth Assist signals into tenant-scoped commercial suggestions without executing actions automatically.',
          domainKey: 'growth',
          productKey: 'growth',
          availability: 'ready',
          defaultMode: 'suggestion',
          supportedSurfaceKeys: ['growth_assist_daily_agenda'],
        },
        {
          key: 'invoice-document-assistant',
          title: 'Invoice Document Assistant',
          summary:
            'Turns deterministic invoicing drafting and readiness signals into tenant-scoped document guidance without executing fiscal actions automatically.',
          domainKey: 'invoicing',
          productKey: 'invoicing',
          availability: 'ready',
          defaultMode: 'suggestion',
          supportedSurfaceKeys: ['invoice_document_drafting'],
        },
        {
          key: 'ecommerce-launch-assistant',
          title: 'Ecommerce Launch Assistant',
          summary:
            'Will help shape product, catalog, landing, and campaign suggestions once the ecommerce domain is active.',
          domainKey: 'ecommerce',
          productKey: 'ecommerce',
          availability: 'planned',
          defaultMode: 'suggestion',
          supportedSurfaceKeys: ['ecommerce_launch_workspace'],
        },
      ]);
  });

  it('GET /api/ai/prompts should return the transversal prompt registry', async () => {
    await request(httpServer)
      .get('/api/ai/prompts')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          key: 'growth-assist-coach-core',
          version: 'v1',
          agentKey: 'growth-assist-coach',
          mode: 'suggestion',
          title: 'Growth Assist Coach Core',
          summary:
            'Prompt pack for turning deterministic Growth Assist agenda signals into commercial suggestions for non-expert operators.',
          objective:
            'Propose clear commercial suggestions for a non-expert operator using the deterministic Growth Assist agenda as the source of truth.',
          styleGuidance: [
            'Prefer short, direct, Spanish-first suggestions.',
            'Explain business impact in simple operator language instead of internal queue jargon.',
            'Keep outputs practical and oriented to what the business should do today.',
          ],
          constraints: [
            'Stay in suggestion mode only. Do not assume messages are sent or cases are mutated automatically.',
            'Use only the tenant-scoped Growth Assist agenda and its embedded operational signals.',
            'Prefer short, direct, Spanish-first suggestions that help a small business operator move today.',
            'Respect domain boundaries: business rules, approvals, and workflow state still belong to Growth.',
          ],
          suggestedOutputs: [
            {
              key: 'reply_draft',
              label: 'Reply draft',
              description:
                'Draft a customer-facing WhatsApp reply using the hottest conversation cues and reply suggestions.',
            },
            {
              key: 'next_action_brief',
              label: 'Next action brief',
              description:
                'Explain the top commercial action to take now and why it matters today.',
            },
            {
              key: 'follow_up_plan',
              label: 'Follow-up plan',
              description:
                'Suggest a short follow-up sequence grounded in playbooks and waiting-customer timing.',
            },
          ],
        },
        {
          key: 'invoice-document-assistant-core',
          version: 'v1',
          agentKey: 'invoice-document-assistant',
          mode: 'suggestion',
          title: 'Invoice Document Assistant Core',
          summary:
            'Prompt pack for document drafting, review, and checklist suggestions in Ecuador electronic invoicing.',
          objective:
            'Help operators draft and review tax document workflows without replacing fiscal validation owned by the invoicing domain.',
          styleGuidance: [
            'Explain tax-document steps in concrete operator language.',
            'Prefer checklist-driven wording over abstract tax jargon.',
            'Surface checklist gaps before proposing any draft output.',
          ],
          constraints: [
            'Do not treat prompt output as fiscal validation.',
            'Do not approve, sign, or submit tax documents automatically.',
            'Use only the tenant-scoped invoicing drafting surface and its embedded readiness/report signals.',
            'Keep the suggestion explicitly advisory and suitable for human review.',
          ],
          suggestedOutputs: [
            {
              key: 'drafting_brief',
              label: 'Drafting brief',
              description:
                'Summarize what needs to be drafted or reviewed before the document can move forward.',
            },
            {
              key: 'review_checklist',
              label: 'Review checklist',
              description:
                'Explain the human review checklist that should be completed before the document advances.',
            },
            {
              key: 'blocker_explanation',
              label: 'Blocker explanation',
              description:
                'Translate current blockers or warnings into simple operator language and next steps.',
            },
          ],
        },
        {
          key: 'ecommerce-launch-assistant-core',
          version: 'planned-v1',
          agentKey: 'ecommerce-launch-assistant',
          mode: 'suggestion',
          title: 'Ecommerce Launch Assistant Core',
          summary:
            'Planned prompt pack for product, landing, and campaign suggestions once ecommerce surfaces exist.',
          objective:
            'Propose launch content and structure suggestions without becoming the source of truth for catalog or storefront workflows.',
          styleGuidance: [
            'Favor concise, conversion-oriented recommendations.',
            'Keep brand and product structure grounded in deterministic ecommerce context.',
          ],
          constraints: [
            'Do not publish products or landing pages automatically.',
            'Do not invent catalog facts that are missing from the ecommerce domain surface.',
          ],
          suggestedOutputs: [
            {
              key: 'launch_brief',
              label: 'Launch brief',
              description:
                'Summarize the recommended launch angle, landing structure, and first content direction.',
            },
          ],
        },
      ]);
  });

  it('GET /api/ai/tools should return the transversal AI tool registry', async () => {
    await request(httpServer)
      .get('/api/ai/tools')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          key: 'growth_assist_reply_drafting',
          title: 'Growth Assist reply drafting',
          summary:
            'Drafts customer-facing reply suggestions grounded in the deterministic Growth Assist agenda.',
          domainKey: 'growth',
          availability: 'ready',
          riskLevel: 'low',
          actionKind: 'draft',
          requiresApproval: false,
          inputContract: {
            sourceSurfaceKeys: ['growth_assist_daily_agenda'],
            primaryPayload:
              'Tenant-scoped Growth Assist agenda with hottest conversation cues and deterministic reply suggestions.',
            requiredContext: [
              'conversation heat',
              'reply recommendation',
              'playbook hints',
            ],
          },
          outputContract: {
            primaryArtifact: 'Customer-facing reply draft.',
            suggestedOutputKeys: ['reply_draft'],
            humanReviewFocus: [
              'Confirm tone still fits the customer context.',
              'Verify no promise, discount, or operational commitment was invented.',
            ],
          },
          executionBoundary: {
            executionMode: 'suggestion_only',
            stateMutation: 'none',
            externalSideEffects: 'none',
            reviewRequirement:
              'An operator should review the draft before sending it through any real channel.',
            blockedCapabilities: [
              'send_whatsapp_message',
              'mutate_conversation_state',
            ],
          },
        },
        {
          key: 'growth_assist_follow_up_planning',
          title: 'Growth Assist follow-up planning',
          summary:
            'Proposes follow-up plans and next-action briefs without mutating Growth workflow state.',
          domainKey: 'growth',
          availability: 'ready',
          riskLevel: 'low',
          actionKind: 'propose',
          requiresApproval: false,
          inputContract: {
            sourceSurfaceKeys: ['growth_assist_daily_agenda'],
            primaryPayload:
              'Tenant-scoped Growth Assist agenda with waiting-customer timing, playbooks, and hottest commercial opportunities.',
            requiredContext: [
              'follow-up timing',
              'playbook guidance',
              'next-action recommendation',
            ],
          },
          outputContract: {
            primaryArtifact: 'Follow-up plan and next-action brief.',
            suggestedOutputKeys: ['follow_up_plan', 'next_action_brief'],
            humanReviewFocus: [
              'Confirm the sequence matches the operator capacity and business context.',
              'Check that escalation or discount ideas stay within policy.',
            ],
          },
          executionBoundary: {
            executionMode: 'suggestion_only',
            stateMutation: 'none',
            externalSideEffects: 'none',
            reviewRequirement:
              'The operator should translate the plan into real CRM or messaging actions manually.',
            blockedCapabilities: [
              'schedule_message_send',
              'update_case_follow_up_state',
            ],
          },
        },
        {
          key: 'growth_case_assignment_execution',
          title: 'Growth case assignment execution',
          summary:
            'Would execute operational-case assignment or routing changes once guarded execution exists.',
          domainKey: 'growth',
          availability: 'planned',
          riskLevel: 'high',
          actionKind: 'execute',
          requiresApproval: true,
          inputContract: {
            sourceSurfaceKeys: ['growth_assist_daily_agenda'],
            primaryPayload:
              'Tenant-scoped operational routing signals and deterministic assignment recommendations.',
            requiredContext: [
              'assignment recommendation',
              'queue pressure',
              'assignee availability',
            ],
          },
          outputContract: {
            primaryArtifact: 'Assignment or routing change intent.',
            suggestedOutputKeys: ['assignment_change_intent'],
            humanReviewFocus: [
              'Validate the assignee or queue target still makes operational sense.',
              'Confirm any routing mutation is explicitly approved before execution.',
            ],
          },
          executionBoundary: {
            executionMode: 'guarded_execution_planned',
            stateMutation: 'planned',
            externalSideEffects: 'planned',
            reviewRequirement:
              'This tool stays blocked until approval memory and guarded execution flows are operational.',
            blockedCapabilities: [
              'assign_operational_case',
              'reroute_queue_membership',
            ],
          },
        },
        {
          key: 'invoice_document_drafting',
          title: 'Invoice document drafting',
          summary:
            'Prepares deterministic drafting, checklist, and review suggestions for invoicing document workflows.',
          domainKey: 'invoicing',
          availability: 'ready',
          riskLevel: 'medium',
          actionKind: 'draft',
          requiresApproval: false,
          inputContract: {
            sourceSurfaceKeys: ['invoice_document_drafting'],
            primaryPayload:
              'Tenant-scoped invoicing drafting surface with deterministic readiness, checklist, and blocker signals.',
            requiredContext: [
              'readiness summary',
              'drafting checklist',
              'fiscal blocker explanation',
            ],
          },
          outputContract: {
            primaryArtifact: 'Document drafting brief and review checklist.',
            suggestedOutputKeys: [
              'drafting_brief',
              'review_checklist',
              'blocker_explanation',
            ],
            humanReviewFocus: [
              'Verify the suggestion does not replace fiscal validation.',
              'Confirm tax-document facts still match the deterministic invoicing surface.',
            ],
          },
          executionBoundary: {
            executionMode: 'suggestion_only',
            stateMutation: 'none',
            externalSideEffects: 'none',
            reviewRequirement:
              'Document guidance must stay advisory and be reviewed before any operator uses it in fiscal work.',
            blockedCapabilities: [
              'sign_tax_document',
              'submit_tax_document',
              'mark_document_authorized',
            ],
          },
        },
        {
          key: 'ecommerce_launch_briefing',
          title: 'Ecommerce launch briefing',
          summary:
            'Will suggest landing, catalog, and campaign structure once ecommerce deterministic surfaces exist.',
          domainKey: 'ecommerce',
          availability: 'planned',
          riskLevel: 'medium',
          actionKind: 'propose',
          requiresApproval: false,
          inputContract: {
            sourceSurfaceKeys: ['ecommerce_launch_workspace'],
            primaryPayload:
              'Planned ecommerce launch workspace with deterministic catalog, landing, and campaign context once available.',
            requiredContext: [
              'catalog facts',
              'landing structure',
              'campaign scope',
            ],
          },
          outputContract: {
            primaryArtifact: 'Launch brief and structured launch proposal.',
            suggestedOutputKeys: ['launch_brief'],
            humanReviewFocus: [
              'Check that launch claims stay grounded in real catalog data.',
              'Review that campaign structure fits the operator plan before publication.',
            ],
          },
          executionBoundary: {
            executionMode: 'guarded_execution_planned',
            stateMutation: 'planned',
            externalSideEffects: 'planned',
            reviewRequirement:
              'Suggestions should be reviewed by an operator before they influence storefront or campaign work.',
            blockedCapabilities: [
              'publish_storefront_content',
              'launch_campaign',
            ],
          },
        },
      ]);
  });

  it('GET /api/ai/tools/:toolKey should return one explicit AI tool contract', async () => {
    await request(httpServer)
      .get('/api/ai/tools/invoice_document_drafting')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        key: 'invoice_document_drafting',
        title: 'Invoice document drafting',
        summary:
          'Prepares deterministic drafting, checklist, and review suggestions for invoicing document workflows.',
        domainKey: 'invoicing',
        availability: 'ready',
        riskLevel: 'medium',
        actionKind: 'draft',
        requiresApproval: false,
        inputContract: {
          sourceSurfaceKeys: ['invoice_document_drafting'],
          primaryPayload:
            'Tenant-scoped invoicing drafting surface with deterministic readiness, checklist, and blocker signals.',
          requiredContext: [
            'readiness summary',
            'drafting checklist',
            'fiscal blocker explanation',
          ],
        },
        outputContract: {
          primaryArtifact: 'Document drafting brief and review checklist.',
          suggestedOutputKeys: [
            'drafting_brief',
            'review_checklist',
            'blocker_explanation',
          ],
          humanReviewFocus: [
            'Verify the suggestion does not replace fiscal validation.',
            'Confirm tax-document facts still match the deterministic invoicing surface.',
          ],
        },
        executionBoundary: {
          executionMode: 'suggestion_only',
          stateMutation: 'none',
          externalSideEffects: 'none',
          reviewRequirement:
            'Document guidance must stay advisory and be reviewed before any operator uses it in fiscal work.',
          blockedCapabilities: [
            'sign_tax_document',
            'submit_tax_document',
            'mark_document_authorized',
          ],
        },
      });
  });

  it('GET /api/ai/approval-policies should return the transversal AI approval policy registry', async () => {
    await request(httpServer)
      .get('/api/ai/approval-policies')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          policyKey: 'growth-assist-suggestion-review',
          agentKey: 'growth-assist-coach',
          scope: 'suggestion_review',
          title: 'Growth Assist suggestion review',
          summary:
            'Requests human review before a Growth Assist suggestion handoff is treated as approved for operator use.',
          reviewGuidance:
            'Verify that the suggestion stays grounded in deterministic Growth signals, does not overreach beyond the tenant context, and still sounds safe for a human operator to adapt.',
          approvalRequired: true,
        },
        {
          policyKey: 'invoice-document-assistant-suggestion-review',
          agentKey: 'invoice-document-assistant',
          scope: 'suggestion_review',
          title: 'Invoice suggestion review',
          summary:
            'Keeps document-drafting suggestions behind explicit operator review before they influence invoicing work.',
          reviewGuidance:
            'Confirm that the suggestion is only advisory, matches the fiscal document context, and does not replace domain validation or tax compliance checks.',
          approvalRequired: true,
        },
        {
          policyKey: 'ecommerce-launch-assistant-suggestion-review',
          agentKey: 'ecommerce-launch-assistant',
          scope: 'suggestion_review',
          title: 'Ecommerce launch suggestion review',
          summary:
            'Keeps launch and campaign suggestions behind operator review before they influence storefront work.',
          reviewGuidance:
            'Check that the suggestion stays grounded in product context, does not invent catalog facts, and is safe to translate into real launch work.',
          approvalRequired: true,
        },
      ]);
  });

  it('GET /api/ai/agents/:agentKey/approval-policies should return approval policies for one agent', async () => {
    await request(httpServer)
      .get('/api/ai/agents/growth-assist-coach/approval-policies')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          policyKey: 'growth-assist-suggestion-review',
          agentKey: 'growth-assist-coach',
          scope: 'suggestion_review',
          title: 'Growth Assist suggestion review',
          summary:
            'Requests human review before a Growth Assist suggestion handoff is treated as approved for operator use.',
          reviewGuidance:
            'Verify that the suggestion stays grounded in deterministic Growth signals, does not overreach beyond the tenant context, and still sounds safe for a human operator to adapt.',
          approvalRequired: true,
        },
      ]);
  });

  it('GET /api/ai/agents/:agentKey/prompt-pack should return one prompt pack', async () => {
    await request(httpServer)
      .get('/api/ai/agents/growth-assist-coach/prompt-pack')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        key: 'growth-assist-coach-core',
        version: 'v1',
        agentKey: 'growth-assist-coach',
        mode: 'suggestion',
        title: 'Growth Assist Coach Core',
        summary:
          'Prompt pack for turning deterministic Growth Assist agenda signals into commercial suggestions for non-expert operators.',
        objective:
          'Propose clear commercial suggestions for a non-expert operator using the deterministic Growth Assist agenda as the source of truth.',
        styleGuidance: [
          'Prefer short, direct, Spanish-first suggestions.',
          'Explain business impact in simple operator language instead of internal queue jargon.',
          'Keep outputs practical and oriented to what the business should do today.',
        ],
        constraints: [
          'Stay in suggestion mode only. Do not assume messages are sent or cases are mutated automatically.',
          'Use only the tenant-scoped Growth Assist agenda and its embedded operational signals.',
          'Prefer short, direct, Spanish-first suggestions that help a small business operator move today.',
          'Respect domain boundaries: business rules, approvals, and workflow state still belong to Growth.',
        ],
        suggestedOutputs: [
          {
            key: 'reply_draft',
            label: 'Reply draft',
            description:
              'Draft a customer-facing WhatsApp reply using the hottest conversation cues and reply suggestions.',
          },
          {
            key: 'next_action_brief',
            label: 'Next action brief',
            description:
              'Explain the top commercial action to take now and why it matters today.',
          },
          {
            key: 'follow_up_plan',
            label: 'Follow-up plan',
            description:
              'Suggest a short follow-up sequence grounded in playbooks and waiting-customer timing.',
          },
        ],
      });
  });

  it('GET /api/ai/agents/:agentKey/tool-access should return tool access rules for one agent', async () => {
    await request(httpServer)
      .get('/api/ai/agents/growth-assist-coach/tool-access')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          tool: {
            key: 'growth_assist_reply_drafting',
            title: 'Growth Assist reply drafting',
            summary:
              'Drafts customer-facing reply suggestions grounded in the deterministic Growth Assist agenda.',
            domainKey: 'growth',
            availability: 'ready',
            riskLevel: 'low',
            actionKind: 'draft',
            requiresApproval: false,
            inputContract: {
              sourceSurfaceKeys: ['growth_assist_daily_agenda'],
              primaryPayload:
                'Tenant-scoped Growth Assist agenda with hottest conversation cues and deterministic reply suggestions.',
              requiredContext: [
                'conversation heat',
                'reply recommendation',
                'playbook hints',
              ],
            },
            outputContract: {
              primaryArtifact: 'Customer-facing reply draft.',
              suggestedOutputKeys: ['reply_draft'],
              humanReviewFocus: [
                'Confirm tone still fits the customer context.',
                'Verify no promise, discount, or operational commitment was invented.',
              ],
            },
            executionBoundary: {
              executionMode: 'suggestion_only',
              stateMutation: 'none',
              externalSideEffects: 'none',
              reviewRequirement:
                'An operator should review the draft before sending it through any real channel.',
              blockedCapabilities: [
                'send_whatsapp_message',
                'mutate_conversation_state',
              ],
            },
          },
          accessLevel: 'allowed',
          rationale:
            'The agent can safely prepare reply drafts because Growth remains the source of truth and no message is sent automatically.',
        },
        {
          tool: {
            key: 'growth_assist_follow_up_planning',
            title: 'Growth Assist follow-up planning',
            summary:
              'Proposes follow-up plans and next-action briefs without mutating Growth workflow state.',
            domainKey: 'growth',
            availability: 'ready',
            riskLevel: 'low',
            actionKind: 'propose',
            requiresApproval: false,
            inputContract: {
              sourceSurfaceKeys: ['growth_assist_daily_agenda'],
              primaryPayload:
                'Tenant-scoped Growth Assist agenda with waiting-customer timing, playbooks, and hottest commercial opportunities.',
              requiredContext: [
                'follow-up timing',
                'playbook guidance',
                'next-action recommendation',
              ],
            },
            outputContract: {
              primaryArtifact: 'Follow-up plan and next-action brief.',
              suggestedOutputKeys: ['follow_up_plan', 'next_action_brief'],
              humanReviewFocus: [
                'Confirm the sequence matches the operator capacity and business context.',
                'Check that escalation or discount ideas stay within policy.',
              ],
            },
            executionBoundary: {
              executionMode: 'suggestion_only',
              stateMutation: 'none',
              externalSideEffects: 'none',
              reviewRequirement:
                'The operator should translate the plan into real CRM or messaging actions manually.',
              blockedCapabilities: [
                'schedule_message_send',
                'update_case_follow_up_state',
              ],
            },
          },
          accessLevel: 'allowed',
          rationale:
            'The agent can suggest follow-up sequencing and next actions while staying inside suggestion mode.',
        },
        {
          tool: {
            key: 'growth_case_assignment_execution',
            title: 'Growth case assignment execution',
            summary:
              'Would execute operational-case assignment or routing changes once guarded execution exists.',
            domainKey: 'growth',
            availability: 'planned',
            riskLevel: 'high',
            actionKind: 'execute',
            requiresApproval: true,
            inputContract: {
              sourceSurfaceKeys: ['growth_assist_daily_agenda'],
              primaryPayload:
                'Tenant-scoped operational routing signals and deterministic assignment recommendations.',
              requiredContext: [
                'assignment recommendation',
                'queue pressure',
                'assignee availability',
              ],
            },
            outputContract: {
              primaryArtifact: 'Assignment or routing change intent.',
              suggestedOutputKeys: ['assignment_change_intent'],
              humanReviewFocus: [
                'Validate the assignee or queue target still makes operational sense.',
                'Confirm any routing mutation is explicitly approved before execution.',
              ],
            },
            executionBoundary: {
              executionMode: 'guarded_execution_planned',
              stateMutation: 'planned',
              externalSideEffects: 'planned',
              reviewRequirement:
                'This tool stays blocked until approval memory and guarded execution flows are operational.',
              blockedCapabilities: [
                'assign_operational_case',
                'reroute_queue_membership',
              ],
            },
          },
          accessLevel: 'blocked',
          rationale:
            'Direct assignment or workflow mutation remains blocked until approval flows and guarded execution are in place.',
        },
      ]);
  });

  it('GET /api/ai/tenants/:slug/agents/:agentKey/suggestion-envelope should return a tenant-scoped Growth Assist suggestion envelope', async () => {
    await request(httpServer)
      .get(
        '/api/ai/tenants/saas-platform/agents/growth-assist-coach/suggestion-envelope',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        tenantSlug: 'saas-platform',
        generatedAt: '2026-05-20T10:36:00.000Z',
        mode: 'suggestion',
        agent: {
          key: 'growth-assist-coach',
          title: 'Growth Assist Coach',
          summary:
            'Turns deterministic Growth Assist signals into tenant-scoped commercial suggestions without executing actions automatically.',
          domainKey: 'growth',
          productKey: 'growth',
          availability: 'ready',
          defaultMode: 'suggestion',
          supportedSurfaceKeys: ['growth_assist_daily_agenda'],
        },
        surface: {
          key: 'growth_assist_daily_agenda',
          title: 'Growth Assist daily agenda',
          sourceContractKey: 'growth.assist.daily_agenda',
          sourceGeneratedAt: '2026-05-20T10:36:00.000Z',
        },
        promptPack: {
          key: 'growth-assist-coach-core',
          version: 'v1',
          agentKey: 'growth-assist-coach',
          mode: 'suggestion',
          title: 'Growth Assist Coach Core',
          summary:
            'Prompt pack for turning deterministic Growth Assist agenda signals into commercial suggestions for non-expert operators.',
          objective:
            'Propose clear commercial suggestions for a non-expert operator using the deterministic Growth Assist agenda as the source of truth.',
          styleGuidance: [
            'Prefer short, direct, Spanish-first suggestions.',
            'Explain business impact in simple operator language instead of internal queue jargon.',
            'Keep outputs practical and oriented to what the business should do today.',
          ],
          constraints: [
            'Stay in suggestion mode only. Do not assume messages are sent or cases are mutated automatically.',
            'Use only the tenant-scoped Growth Assist agenda and its embedded operational signals.',
            'Prefer short, direct, Spanish-first suggestions that help a small business operator move today.',
            'Respect domain boundaries: business rules, approvals, and workflow state still belong to Growth.',
          ],
          suggestedOutputs: [
            {
              key: 'reply_draft',
              label: 'Reply draft',
              description:
                'Draft a customer-facing WhatsApp reply using the hottest conversation cues and reply suggestions.',
            },
            {
              key: 'next_action_brief',
              label: 'Next action brief',
              description:
                'Explain the top commercial action to take now and why it matters today.',
            },
            {
              key: 'follow_up_plan',
              label: 'Follow-up plan',
              description:
                'Suggest a short follow-up sequence grounded in playbooks and waiting-customer timing.',
            },
          ],
        },
        toolAccess: [
          {
            tool: {
              key: 'growth_assist_reply_drafting',
              title: 'Growth Assist reply drafting',
              summary:
                'Drafts customer-facing reply suggestions grounded in the deterministic Growth Assist agenda.',
              domainKey: 'growth',
              availability: 'ready',
              riskLevel: 'low',
              actionKind: 'draft',
              requiresApproval: false,
              inputContract: {
                sourceSurfaceKeys: ['growth_assist_daily_agenda'],
                primaryPayload:
                  'Tenant-scoped Growth Assist agenda with hottest conversation cues and deterministic reply suggestions.',
                requiredContext: [
                  'conversation heat',
                  'reply recommendation',
                  'playbook hints',
                ],
              },
              outputContract: {
                primaryArtifact: 'Customer-facing reply draft.',
                suggestedOutputKeys: ['reply_draft'],
                humanReviewFocus: [
                  'Confirm tone still fits the customer context.',
                  'Verify no promise, discount, or operational commitment was invented.',
                ],
              },
              executionBoundary: {
                executionMode: 'suggestion_only',
                stateMutation: 'none',
                externalSideEffects: 'none',
                reviewRequirement:
                  'An operator should review the draft before sending it through any real channel.',
                blockedCapabilities: [
                  'send_whatsapp_message',
                  'mutate_conversation_state',
                ],
              },
            },
            accessLevel: 'allowed',
            rationale:
              'The agent can safely prepare reply drafts because Growth remains the source of truth and no message is sent automatically.',
          },
          {
            tool: {
              key: 'growth_assist_follow_up_planning',
              title: 'Growth Assist follow-up planning',
              summary:
                'Proposes follow-up plans and next-action briefs without mutating Growth workflow state.',
              domainKey: 'growth',
              availability: 'ready',
              riskLevel: 'low',
              actionKind: 'propose',
              requiresApproval: false,
              inputContract: {
                sourceSurfaceKeys: ['growth_assist_daily_agenda'],
                primaryPayload:
                  'Tenant-scoped Growth Assist agenda with waiting-customer timing, playbooks, and hottest commercial opportunities.',
                requiredContext: [
                  'follow-up timing',
                  'playbook guidance',
                  'next-action recommendation',
                ],
              },
              outputContract: {
                primaryArtifact: 'Follow-up plan and next-action brief.',
                suggestedOutputKeys: ['follow_up_plan', 'next_action_brief'],
                humanReviewFocus: [
                  'Confirm the sequence matches the operator capacity and business context.',
                  'Check that escalation or discount ideas stay within policy.',
                ],
              },
              executionBoundary: {
                executionMode: 'suggestion_only',
                stateMutation: 'none',
                externalSideEffects: 'none',
                reviewRequirement:
                  'The operator should translate the plan into real CRM or messaging actions manually.',
                blockedCapabilities: [
                  'schedule_message_send',
                  'update_case_follow_up_state',
                ],
              },
            },
            accessLevel: 'allowed',
            rationale:
              'The agent can suggest follow-up sequencing and next actions while staying inside suggestion mode.',
          },
          {
            tool: {
              key: 'growth_case_assignment_execution',
              title: 'Growth case assignment execution',
              summary:
                'Would execute operational-case assignment or routing changes once guarded execution exists.',
              domainKey: 'growth',
              availability: 'planned',
              riskLevel: 'high',
              actionKind: 'execute',
              requiresApproval: true,
              inputContract: {
                sourceSurfaceKeys: ['growth_assist_daily_agenda'],
                primaryPayload:
                  'Tenant-scoped operational routing signals and deterministic assignment recommendations.',
                requiredContext: [
                  'assignment recommendation',
                  'queue pressure',
                  'assignee availability',
                ],
              },
              outputContract: {
                primaryArtifact: 'Assignment or routing change intent.',
                suggestedOutputKeys: ['assignment_change_intent'],
                humanReviewFocus: [
                  'Validate the assignee or queue target still makes operational sense.',
                  'Confirm any routing mutation is explicitly approved before execution.',
                ],
              },
              executionBoundary: {
                executionMode: 'guarded_execution_planned',
                stateMutation: 'planned',
                externalSideEffects: 'planned',
                reviewRequirement:
                  'This tool stays blocked until approval memory and guarded execution flows are operational.',
                blockedCapabilities: [
                  'assign_operational_case',
                  'reroute_queue_membership',
                ],
              },
            },
            accessLevel: 'blocked',
            rationale:
              'Direct assignment or workflow mutation remains blocked until approval flows and guarded execution are in place.',
          },
        ],
        contextBlocks: [
          {
            key: 'agenda_summary',
            title: 'Agenda summary',
            detail:
              'La bandeja no esta rota, pero si hay seguimientos que no conviene dejar enfriar. Usa esta agenda como recordatorio simple: primero sigue lo que ya esta caliente, luego reparte owner nuevo si hace falta.',
            bullets: [
              'Reply now count: 1',
              'Follow-up now count: 2',
              'Waiting customer count: 0',
              'Queue to organize count: 1',
              'Channel risk count: 0',
              'Saved auto-assignment policy: follow_up_first',
            ],
          },
          {
            key: 'top_next_actions',
            title: 'Top next actions',
            detail:
              'These are the clearest business actions the deterministic Growth Assist contract already recommends today.',
            bullets: [
              'Responder a WhatsApp Maria Perez: Responder hoy mismo y cerrar con un siguiente paso concreto. (Responder tarde enfria conversaciones que ya llegaron con intencion activa.)',
            ],
          },
          {
            key: 'reply_suggestions',
            title: 'Reply suggestions',
            detail:
              'These drafts and goals are safe starting points for suggestion-mode coaching.',
            bullets: [
              'WhatsApp Maria Perez: goal=Reconocer el contacto, retomar confianza y proponer el siguiente paso.; draft=Hola WhatsApp Maria Perez, gracias por escribirnos. Retomo esto hoy para ayudarte sin dejarlo enfriar. Si te parece, te comparto el siguiente paso y lo dejamos encaminado ahora mismo.',
            ],
          },
          {
            key: 'lead_warmth',
            title: 'Lead warmth radar',
            detail:
              'Prioriza respuestas o seguimientos que ya estan pidiendo movimiento hoy.',
            bullets: [
              'WhatsApp Maria Perez: Se ve caliente porque ya pide respuesta o seguimiento del equipo y puede enfriarse rapido.; cadence=Muévelo hoy mismo.',
            ],
          },
          {
            key: 'playbooks',
            title: 'Operator playbooks',
            detail:
              'These playbooks describe the deterministic operating guidance the AI layer must respect and explain.',
            bullets: [
              'Responder primero: goal=Recuperar velocidad de respuesta y dejar un siguiente paso claro sin sonar robotico.; avoid=No contestes con un texto generico que ignore el contexto ni dejes la conversacion abierta sin siguiente paso.; success=El lead responde o acepta el siguiente paso dentro de la misma ventana de seguimiento.',
            ],
          },
          {
            key: 'channel_health',
            title: 'Channel health',
            detail: 'No top alert summary is active right now.',
            bullets: [
              'Overall status: healthy',
              'Total alerts: 0',
              'Ready retries: 0',
              'Top action: No action required',
            ],
          },
        ],
      });

    expect(getTenantGrowthAssistDailyAgendaUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/ai/tenants/:slug/agents/:agentKey/suggestion-envelope should return a tenant-scoped Invoice Document Assistant suggestion envelope', async () => {
    await request(httpServer)
      .get(
        '/api/ai/tenants/saas-platform/agents/invoice-document-assistant/suggestion-envelope',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        tenantSlug: 'saas-platform',
        generatedAt: '2026-05-23T10:30:00.000Z',
        mode: 'suggestion',
        agent: {
          key: 'invoice-document-assistant',
          title: 'Invoice Document Assistant',
          summary:
            'Turns deterministic invoicing drafting and readiness signals into tenant-scoped document guidance without executing fiscal actions automatically.',
          domainKey: 'invoicing',
          productKey: 'invoicing',
          availability: 'ready',
          defaultMode: 'suggestion',
          supportedSurfaceKeys: ['invoice_document_drafting'],
        },
        surface: {
          key: 'invoice_document_drafting',
          title: 'Invoice document drafting',
          sourceContractKey: 'invoicing.assist.document_drafting',
          sourceGeneratedAt: '2026-05-23T10:30:00.000Z',
        },
        promptPack: {
          key: 'invoice-document-assistant-core',
          version: 'v1',
          agentKey: 'invoice-document-assistant',
          mode: 'suggestion',
          title: 'Invoice Document Assistant Core',
          summary:
            'Prompt pack for document drafting, review, and checklist suggestions in Ecuador electronic invoicing.',
          objective:
            'Help operators draft and review tax document workflows without replacing fiscal validation owned by the invoicing domain.',
          styleGuidance: [
            'Explain tax-document steps in concrete operator language.',
            'Prefer checklist-driven wording over abstract tax jargon.',
            'Surface checklist gaps before proposing any draft output.',
          ],
          constraints: [
            'Do not treat prompt output as fiscal validation.',
            'Do not approve, sign, or submit tax documents automatically.',
            'Use only the tenant-scoped invoicing drafting surface and its embedded readiness/report signals.',
            'Keep the suggestion explicitly advisory and suitable for human review.',
          ],
          suggestedOutputs: [
            {
              key: 'drafting_brief',
              label: 'Drafting brief',
              description:
                'Summarize what needs to be drafted or reviewed before the document can move forward.',
            },
            {
              key: 'review_checklist',
              label: 'Review checklist',
              description:
                'Explain the human review checklist that should be completed before the document advances.',
            },
            {
              key: 'blocker_explanation',
              label: 'Blocker explanation',
              description:
                'Translate current blockers or warnings into simple operator language and next steps.',
            },
          ],
        },
        toolAccess: [
          {
            tool: {
              key: 'invoice_document_drafting',
              title: 'Invoice document drafting',
              summary:
                'Prepares deterministic drafting, checklist, and review suggestions for invoicing document workflows.',
              domainKey: 'invoicing',
              availability: 'ready',
              riskLevel: 'medium',
              actionKind: 'draft',
              requiresApproval: false,
              inputContract: {
                sourceSurfaceKeys: ['invoice_document_drafting'],
                primaryPayload:
                  'Tenant-scoped invoicing drafting surface with deterministic readiness, checklist, and blocker signals.',
                requiredContext: [
                  'readiness summary',
                  'drafting checklist',
                  'fiscal blocker explanation',
                ],
              },
              outputContract: {
                primaryArtifact: 'Document drafting brief and review checklist.',
                suggestedOutputKeys: [
                  'drafting_brief',
                  'review_checklist',
                  'blocker_explanation',
                ],
                humanReviewFocus: [
                  'Verify the suggestion does not replace fiscal validation.',
                  'Confirm tax-document facts still match the deterministic invoicing surface.',
                ],
              },
              executionBoundary: {
                executionMode: 'suggestion_only',
                stateMutation: 'none',
                externalSideEffects: 'none',
                reviewRequirement:
                  'Document guidance must stay advisory and be reviewed before any operator uses it in fiscal work.',
                blockedCapabilities: [
                  'sign_tax_document',
                  'submit_tax_document',
                  'mark_document_authorized',
                ],
              },
            },
            accessLevel: 'approval_required',
            rationale:
              'Invoice drafting suggestions are available, but they should stay behind explicit operator review before influencing invoicing work.',
          },
        ],
        contextBlocks: [
          {
            key: 'drafting_summary',
            title: 'Drafting summary',
            detail:
              'El tenant ya puede apoyarse en sugerencias, aunque conviene revisar detalles antes de empujar documentos. Usa esta superficie para ordenar checklist, documentar riesgos y preparar mejor la revision humana.',
            bullets: [
              'Readiness status: needs_attention',
              'Suggested focus: Conviene revisar vigencia del certificado antes de empujar mas documentos.',
              'Outstanding amount in cents: 145000',
              'Invoice count: 9',
              'Customer count: 3',
            ],
          },
          {
            key: 'formal_checklist',
            title: 'Formal checklist',
            detail:
              'These are the deterministic controls the assistant must explain before it suggests any drafting or review help.',
            bullets: [
              'Perfil fiscal: status=ready; Configurado para pruebas con RUC 1790012345001.',
              'Material de firma: status=warning; Conviene revisar vigencia del certificado.',
            ],
          },
          {
            key: 'document_guidance',
            title: 'Document guidance',
            detail:
              'This tells the assistant which Ecuador document lanes are more usable today and how they should be framed.',
            bullets: [
              'Factura: status=ready; use=Usalo para preparar facturas nuevas y revisar si el tenant ya tiene base suficiente para emitirlas sin improvisar.',
              'Nota de credito: status=blocked; use=Usalo cuando haya que corregir o anular una factura previa con criterio documentado.',
            ],
          },
          {
            key: 'drafting_hints',
            title: 'Drafting hints',
            detail:
              'These deterministic hints shape what kind of help the assistant may offer in suggestion mode.',
            bullets: [
              'Brief de preparacion: objective=Explicar que piezas conviene completar antes de redactar o revisar un comprobante.; caution=Toma la sugerencia como checklist guiado y no como validacion fiscal final.',
            ],
          },
          {
            key: 'safety_boundaries',
            title: 'Safety boundaries',
            detail:
              'These actions stay blocked even if the assistant can already help with drafting or review guidance.',
            bullets: [
              'Firmar electronicamente el documento sin aprobacion humana.',
            ],
          },
        ],
      });

    expect(getTenantInvoiceDocumentDraftingAssistUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/ai/tenants/:slug/agents/:agentKey/suggestion-runs should return suggestion-mode run history', async () => {
    await request(httpServer)
      .get(
        '/api/ai/tenants/saas-platform/agents/growth-assist-coach/suggestion-runs?limit=5',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'ai-run-001',
          tenantSlug: 'saas-platform',
          agentKey: 'growth-assist-coach',
          mode: 'suggestion',
          status: 'prepared',
          surfaceKey: 'growth_assist_daily_agenda',
          sourceContractKey: 'growth.assist.daily_agenda',
          sourceGeneratedAt: '2026-05-20T10:36:00.000Z',
          promptPackKey: 'growth-assist-coach-core',
          promptPackVersion: 'v1',
          generatedAt: '2026-05-20T10:36:00.000Z',
          requestedByUserId: user.id,
          requestedByEmail: user.email,
          summary:
            'Growth Assist Coach prepared a suggestion-mode handoff for Growth Assist daily agenda using prompt pack growth-assist-coach-core@v1.',
          suggestedOutputKeys: [
            'reply_draft',
            'next_action_brief',
            'follow_up_plan',
          ],
          approvalSummary: {
            status: 'pending',
            totalRequests: 1,
            latestRequestId: 'ai-approval-001',
            latestPolicyKey: 'growth-assist-suggestion-review',
            latestRequestedAt: '2026-05-20T10:38:00.000Z',
            latestReviewedAt: null,
          },
          envelope: {
            tenantSlug: 'saas-platform',
            generatedAt: '2026-05-20T10:36:00.000Z',
            mode: 'suggestion',
            agent: {
              key: 'growth-assist-coach',
              title: 'Growth Assist Coach',
              summary:
                'Turns deterministic Growth Assist signals into tenant-scoped commercial suggestions without executing actions automatically.',
              domainKey: 'growth',
              productKey: 'growth',
              availability: 'ready',
              defaultMode: 'suggestion',
              supportedSurfaceKeys: ['growth_assist_daily_agenda'],
            },
            surface: {
              key: 'growth_assist_daily_agenda',
              title: 'Growth Assist daily agenda',
              sourceContractKey: 'growth.assist.daily_agenda',
              sourceGeneratedAt: '2026-05-20T10:36:00.000Z',
            },
            promptPack: {
              key: 'growth-assist-coach-core',
              version: 'v1',
              agentKey: 'growth-assist-coach',
              mode: 'suggestion',
              title: 'Growth Assist Coach Core',
              summary:
                'Prompt pack for turning deterministic Growth Assist agenda signals into commercial suggestions for non-expert operators.',
              objective:
                'Propose clear commercial suggestions for a non-expert operator using the deterministic Growth Assist agenda as the source of truth.',
              styleGuidance: [
                'Prefer short, direct, Spanish-first suggestions.',
                'Explain business impact in simple operator language instead of internal queue jargon.',
                'Keep outputs practical and oriented to what the business should do today.',
              ],
              constraints: [
                'Stay in suggestion mode only. Do not assume messages are sent or cases are mutated automatically.',
                'Use only the tenant-scoped Growth Assist agenda and its embedded operational signals.',
                'Prefer short, direct, Spanish-first suggestions that help a small business operator move today.',
                'Respect domain boundaries: business rules, approvals, and workflow state still belong to Growth.',
              ],
              suggestedOutputs: [
                {
                  key: 'reply_draft',
                  label: 'Reply draft',
                  description:
                    'Draft a customer-facing WhatsApp reply using the hottest conversation cues and reply suggestions.',
                },
                {
                  key: 'next_action_brief',
                  label: 'Next action brief',
                  description:
                    'Explain the top commercial action to take now and why it matters today.',
                },
                {
                  key: 'follow_up_plan',
                  label: 'Follow-up plan',
                  description:
                    'Suggest a short follow-up sequence grounded in playbooks and waiting-customer timing.',
                },
              ],
            },
            toolAccess: [],
            contextBlocks: [
              {
                key: 'agenda_summary',
                title: 'Agenda summary',
                detail:
                  'La bandeja no esta rota, pero si hay seguimientos que no conviene dejar enfriar. Usa esta agenda como recordatorio simple: primero sigue lo que ya esta caliente, luego reparte owner nuevo si hace falta.',
                bullets: [
                  'Reply now count: 1',
                  'Follow-up now count: 2',
                  'Waiting customer count: 0',
                  'Queue to organize count: 1',
                  'Channel risk count: 0',
                  'Saved auto-assignment policy: follow_up_first',
                ],
              },
            ],
          },
          createdAt: '2026-05-20T10:37:00.000Z',
        },
      ]);

    expect(listTenantAiSuggestionRunsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      5,
    );
  });

  it('GET /api/ai/tenants/:slug/suggestion-runs should return the tenant-scoped transversal handoff workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      envelope: {
        ...growthAssistSuggestionRun.envelope,
        agent: {
          key: 'invoice-document-assistant',
          title: 'Invoice Document Assistant',
          summary:
            'Explains and drafts deterministic invoice-document suggestions without mutating fiscal workflow.',
          domainKey: 'invoicing',
          productKey: 'electronic_invoicing_ec',
          availability: 'ready' as const,
          defaultMode: 'suggestion' as const,
          supportedSurfaceKeys: ['invoice_document_drafting_assist'],
        },
        surface: {
          key: 'invoice_document_drafting_assist',
          title: 'Invoice document drafting assist',
          sourceContractKey: 'invoicing.assist.document_drafting',
          sourceGeneratedAt: '2026-05-20T10:36:00.000Z',
        },
        promptPack: {
          key: 'invoice-document-assistant-core',
          version: 'v1',
          agentKey: 'invoice-document-assistant',
          mode: 'suggestion' as const,
          title: 'Invoice Document Assistant Core',
          summary:
            'Prompt pack for tenant-scoped invoice drafting suggestions that stay advisory.',
          objective:
            'Draft safe invoice-document suggestions without replacing deterministic compliance checks.',
          styleGuidance: [
            'Keep recommendations short and grounded in the document context.',
          ],
          constraints: [
            'Stay in suggestion mode only.',
          ],
          suggestedOutputs: [
            {
              key: 'document_draft_brief',
              label: 'Document draft brief',
              description: 'Summarize the suggested drafting move.',
            },
          ],
        },
        toolAccess: [],
        contextBlocks: [],
      },
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
    };

    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/suggestion-runs?limit=5')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual([
          expect.objectContaining({
            id: 'ai-run-002',
            agentKey: 'invoice-document-assistant',
            promptPackKey: 'invoice-document-assistant-core',
            summary:
              'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
            approvalSummary: {
              status: 'not_requested',
              totalRequests: 0,
              latestRequestId: null,
              latestPolicyKey: null,
              latestRequestedAt: null,
              latestReviewedAt: null,
            },
          }),
          expect.objectContaining({
            id: 'ai-run-001',
            agentKey: 'growth-assist-coach',
            promptPackKey: 'growth-assist-coach-core',
            approvalSummary: {
              status: 'pending',
              totalRequests: 1,
              latestRequestId: 'ai-approval-001',
              latestPolicyKey: 'growth-assist-suggestion-review',
              latestRequestedAt: '2026-05-20T10:38:00.000Z',
              latestReviewedAt: null,
            },
          }),
        ]);
      });

    expect(listTenantAiSuggestionRunsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      5,
    );
    expect(listTenantAiSuggestionRunsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice-document-assistant',
      5,
    );
  });

  it('GET /api/ai/tenants/:slug/action-center should return the tenant-scoped transversal AI action center summary', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      envelope: {
        ...growthAssistSuggestionRun.envelope,
        agent: {
          key: 'invoice-document-assistant',
          title: 'Invoice Document Assistant',
          summary:
            'Explains and drafts deterministic invoice-document suggestions without mutating fiscal workflow.',
          domainKey: 'invoicing',
          productKey: 'electronic_invoicing_ec',
          availability: 'ready' as const,
          defaultMode: 'suggestion' as const,
          supportedSurfaceKeys: ['invoice_document_drafting_assist'],
        },
        surface: {
          key: 'invoice_document_drafting_assist',
          title: 'Invoice document drafting assist',
          sourceContractKey: 'invoicing.assist.document_drafting',
          sourceGeneratedAt: '2026-05-20T10:36:00.000Z',
        },
        promptPack: {
          key: 'invoice-document-assistant-core',
          version: 'v1',
          agentKey: 'invoice-document-assistant',
          mode: 'suggestion' as const,
          title: 'Invoice Document Assistant Core',
          summary:
            'Prompt pack for tenant-scoped invoice drafting suggestions that stay advisory.',
          objective:
            'Draft safe invoice-document suggestions without replacing deterministic compliance checks.',
          styleGuidance: [
            'Keep recommendations short and grounded in the document context.',
          ],
          constraints: ['Stay in suggestion mode only.'],
          suggestedOutputs: [
            {
              key: 'document_draft_brief',
              label: 'Document draft brief',
              description: 'Summarize the suggested drafting move.',
            },
          ],
        },
        toolAccess: [],
        contextBlocks: [],
      },
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/action-center')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          counts: {
            pendingApprovalRequests: 1,
            reviewableSuggestionRuns: 1,
            reviewedApprovalRequests: 1,
          },
          featuredPendingApprovalRequest: {
            id: 'ai-approval-001',
            tenantSlug: 'saas-platform',
            agentKey: 'growth-assist-coach',
            policyKey: 'growth-assist-suggestion-review',
            scope: 'suggestion_review',
            suggestionRunId: 'ai-run-001',
            requestedByUserId: user.id,
            requestedByEmail: user.email,
            rationale: 'Quiero dejar trazable la revisión humana.',
            summary:
              'Growth Assist Coach requested human review for suggestion handoff ai-run-001 under policy growth-assist-suggestion-review.',
            status: 'pending',
            reviewedAt: null,
            reviewedByUserId: null,
            reviewedByEmail: null,
            reviewNote: null,
            createdAt: '2026-05-20T10:38:00.000Z',
            updatedAt: '2026-05-20T10:38:00.000Z',
          },
          featuredReviewableSuggestionRun: expect.objectContaining({
            id: 'ai-run-002',
            agentKey: 'invoice-document-assistant',
            promptPackKey: 'invoice-document-assistant-core',
            approvalSummary: {
              status: 'not_requested',
              totalRequests: 0,
              latestRequestId: null,
              latestPolicyKey: null,
              latestRequestedAt: null,
              latestReviewedAt: null,
            },
          }),
          latestReviewedApprovalRequest: {
            id: 'ai-approval-002',
            tenantSlug: 'saas-platform',
            agentKey: 'invoice-document-assistant',
            policyKey: 'invoice-document-assistant-suggestion-review',
            scope: 'suggestion_review',
            suggestionRunId: 'ai-run-002',
            requestedByUserId: user.id,
            requestedByEmail: user.email,
            rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
            summary:
              'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
            status: 'approved',
            reviewedAt: '2026-05-20T10:41:00.000Z',
            reviewedByUserId: user.id,
            reviewedByEmail: user.email,
            reviewNote: 'Se puede usar como guía.',
            createdAt: '2026-05-20T10:40:00.000Z',
            updatedAt: '2026-05-20T10:41:00.000Z',
          },
        });
      });

    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      {
        limit: null,
        status: null,
      },
    );
    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice-document-assistant',
      {
        limit: null,
        status: null,
      },
    );
    expect(listTenantAiSuggestionRunsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      null,
    );
    expect(listTenantAiSuggestionRunsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice-document-assistant',
      null,
    );
  });

  it('GET /api/ai/tenants/:slug/activity-feed should return the tenant-scoped transversal AI activity feed', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'approved' as const,
        totalRequests: 1,
        latestRequestId: 'ai-approval-002',
        latestPolicyKey: 'invoice-document-assistant-suggestion-review',
        latestRequestedAt: '2026-05-20T10:40:00.000Z',
        latestReviewedAt: '2026-05-20T10:41:00.000Z',
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/activity-feed?limit=5')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          entries: [
            {
              id: 'approval-reviewed:ai-approval-002',
              tenantSlug: 'saas-platform',
              agentKey: 'invoice-document-assistant',
              eventType: 'approval_reviewed',
              occurredAt: '2026-05-20T10:41:00.000Z',
              suggestionRunId: 'ai-run-002',
              approvalRequestId: 'ai-approval-002',
              actorUserId: user.id,
              actorEmail: user.email,
              summary:
                'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
              detail: 'Se puede usar como guía.',
            },
            {
              id: 'approval-requested:ai-approval-002',
              tenantSlug: 'saas-platform',
              agentKey: 'invoice-document-assistant',
              eventType: 'approval_requested',
              occurredAt: '2026-05-20T10:40:00.000Z',
              suggestionRunId: 'ai-run-002',
              approvalRequestId: 'ai-approval-002',
              actorUserId: user.id,
              actorEmail: user.email,
              summary:
                'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
              detail: 'Necesito revisión antes de usar esta sugerencia documental.',
            },
            {
              id: 'suggestion-run-prepared:ai-run-002',
              tenantSlug: 'saas-platform',
              agentKey: 'invoice-document-assistant',
              eventType: 'suggestion_run_prepared',
              occurredAt: '2026-05-20T10:39:00.000Z',
              suggestionRunId: 'ai-run-002',
              approvalRequestId: null,
              actorUserId: user.id,
              actorEmail: user.email,
              summary:
                'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
              detail:
                'Prepared handoff with invoice-document-assistant-core@v1.',
            },
            {
              id: 'approval-requested:ai-approval-001',
              tenantSlug: 'saas-platform',
              agentKey: 'growth-assist-coach',
              eventType: 'approval_requested',
              occurredAt: '2026-05-20T10:38:00.000Z',
              suggestionRunId: 'ai-run-001',
              approvalRequestId: 'ai-approval-001',
              actorUserId: user.id,
              actorEmail: user.email,
              summary:
                'Growth Assist Coach requested human review for suggestion handoff ai-run-001 under policy growth-assist-suggestion-review.',
              detail: 'Quiero dejar trazable la revisión humana.',
            },
            {
              id: 'suggestion-run-prepared:ai-run-001',
              tenantSlug: 'saas-platform',
              agentKey: 'growth-assist-coach',
              eventType: 'suggestion_run_prepared',
              occurredAt: '2026-05-20T10:37:00.000Z',
              suggestionRunId: 'ai-run-001',
              approvalRequestId: null,
              actorUserId: user.id,
              actorEmail: user.email,
              summary:
                'Growth Assist Coach prepared a suggestion-mode handoff for Growth Assist daily agenda using prompt pack growth-assist-coach-core@v1.',
              detail: 'Prepared handoff with growth-assist-coach-core@v1.',
            },
          ],
        });
      });

    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      {
        limit: null,
        status: null,
      },
    );
    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice-document-assistant',
      {
        limit: null,
        status: null,
      },
    );
    expect(listTenantAiSuggestionRunsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      null,
    );
    expect(listTenantAiSuggestionRunsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice-document-assistant',
      null,
    );
  });

  it('GET /api/ai/tenants/:slug/memory-workspace should return the tenant-scoped transversal AI memory workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'approved' as const,
        totalRequests: 1,
        latestRequestId: 'ai-approval-002',
        latestPolicyKey: 'invoice-document-assistant-suggestion-review',
        latestRequestedAt: '2026-05-20T10:40:00.000Z',
        latestReviewedAt: '2026-05-20T10:41:00.000Z',
      },
      envelope: {
        ...growthAssistSuggestionRun.envelope,
        agent: {
          key: 'invoice-document-assistant',
          title: 'Invoice Document Assistant',
          summary:
            'Explains and drafts deterministic invoice-document suggestions without mutating fiscal workflow.',
          domainKey: 'invoicing',
          productKey: 'electronic_invoicing_ec',
          availability: 'ready' as const,
          defaultMode: 'suggestion' as const,
          supportedSurfaceKeys: ['invoice_document_drafting_assist'],
        },
        surface: {
          key: 'invoice_document_drafting_assist',
          title: 'Invoice document drafting assist',
          sourceContractKey: 'invoicing.assist.document_drafting',
          sourceGeneratedAt: '2026-05-20T10:36:00.000Z',
        },
        promptPack: {
          key: 'invoice-document-assistant-core',
          version: 'v1',
          agentKey: 'invoice-document-assistant',
          mode: 'suggestion' as const,
          title: 'Invoice Document Assistant Core',
          summary:
            'Prompt pack for tenant-scoped invoice drafting suggestions that stay advisory.',
          objective:
            'Draft safe invoice-document suggestions without replacing deterministic compliance checks.',
          styleGuidance: [
            'Keep recommendations short and grounded in the document context.',
          ],
          constraints: ['Stay in suggestion mode only.'],
          suggestedOutputs: [
            {
              key: 'document_draft_brief',
              label: 'Document draft brief',
              description: 'Summarize the suggested drafting move.',
            },
          ],
        },
        toolAccess: [],
        contextBlocks: [],
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/memory-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          counts: {
            totalAgents: 2,
            agentsWithSuggestionRuns: 2,
            agentsWithPendingApprovals: 1,
            totalPendingApprovalRequests: 1,
          },
          agents: [
            expect.objectContaining({
              agentKey: 'invoice-document-assistant',
              title: 'Invoice Document Assistant',
              domainKey: 'invoicing',
              productKey: 'invoicing',
              promptPack: {
                key: 'invoice-document-assistant-core',
                version: 'v1',
                mode: 'suggestion',
                title: 'Invoice Document Assistant Core',
                summary:
                  'Prompt pack for document drafting, review, and checklist suggestions in Ecuador electronic invoicing.',
              },
              toolAccessSummary: {
                allowedCount: 0,
                approvalRequiredCount: 1,
                blockedCount: 0,
              },
              pendingApprovalRequestsCount: 0,
              oldestPendingApprovalRequest: null,
              latestReviewedApprovalRequest: expect.objectContaining({
                id: 'ai-approval-002',
                status: 'approved',
              }),
              latestSuggestionRun: expect.objectContaining({
                id: 'ai-run-002',
                agentKey: 'invoice-document-assistant',
              }),
              recentActivityAt: '2026-05-20T10:41:00.000Z',
              memoryNotes: expect.arrayContaining([
                'Prompt pack invoice-document-assistant-core@v1 in suggestion mode.',
                'No pending human reviews right now.',
                'Tool posture: 0 allowed, 1 approval-required, 0 blocked.',
              ]),
            }),
            expect.objectContaining({
              agentKey: 'growth-assist-coach',
              title: 'Growth Assist Coach',
              domainKey: 'growth',
              productKey: 'growth',
              promptPack: {
                key: 'growth-assist-coach-core',
                version: 'v1',
                mode: 'suggestion',
                title: 'Growth Assist Coach Core',
                summary:
                  'Prompt pack for turning deterministic Growth Assist agenda signals into commercial suggestions for non-expert operators.',
              },
              toolAccessSummary: {
                allowedCount: 2,
                approvalRequiredCount: 0,
                blockedCount: 1,
              },
              pendingApprovalRequestsCount: 1,
              oldestPendingApprovalRequest: expect.objectContaining({
                id: 'ai-approval-001',
                status: 'pending',
              }),
              latestReviewedApprovalRequest: null,
              latestSuggestionRun: expect.objectContaining({
                id: 'ai-run-001',
                agentKey: 'growth-assist-coach',
              }),
              recentActivityAt: '2026-05-20T10:38:00.000Z',
              memoryNotes: expect.arrayContaining([
                'Prompt pack growth-assist-coach-core@v1 in suggestion mode.',
                '1 pending human review request(s).',
                'No reviewed approvals recorded yet.',
                'Tool posture: 2 allowed, 0 approval-required, 1 blocked.',
              ]),
            }),
          ],
        });
      });

    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      {
        limit: null,
        status: null,
      },
    );
    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice-document-assistant',
      {
        limit: null,
        status: null,
      },
    );
    expect(listTenantAiSuggestionRunsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      null,
    );
    expect(listTenantAiSuggestionRunsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice-document-assistant',
      null,
    );
  });

  it('GET /api/ai/tenants/:slug/health-workspace should return the tenant-scoped transversal AI health workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      envelope: {
        ...growthAssistSuggestionRun.envelope,
        agent: {
          key: 'invoice-document-assistant',
          title: 'Invoice Document Assistant',
          summary:
            'Explains and drafts deterministic invoice-document suggestions without mutating fiscal workflow.',
          domainKey: 'invoicing',
          productKey: 'electronic_invoicing_ec',
          availability: 'ready' as const,
          defaultMode: 'suggestion' as const,
          supportedSurfaceKeys: ['invoice_document_drafting_assist'],
        },
        surface: {
          key: 'invoice_document_drafting_assist',
          title: 'Invoice document drafting assist',
          sourceContractKey: 'invoicing.assist.document_drafting',
          sourceGeneratedAt: '2026-05-20T10:36:00.000Z',
        },
        promptPack: {
          key: 'invoice-document-assistant-core',
          version: 'v1',
          agentKey: 'invoice-document-assistant',
          mode: 'suggestion' as const,
          title: 'Invoice Document Assistant Core',
          summary:
            'Prompt pack for tenant-scoped invoice drafting suggestions that stay advisory.',
          objective:
            'Draft safe invoice-document suggestions without replacing deterministic compliance checks.',
          styleGuidance: [
            'Keep recommendations short and grounded in the document context.',
          ],
          constraints: ['Stay in suggestion mode only.'],
          suggestedOutputs: [
            {
              key: 'document_draft_brief',
              label: 'Document draft brief',
              description: 'Summarize the suggested drafting move.',
            },
          ],
        },
        toolAccess: [],
        contextBlocks: [],
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/health-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          overallStatus: 'critical',
          counts: {
            totalAgents: 2,
            healthyAgents: 0,
            warningAgents: 1,
            criticalAgents: 1,
          },
          agents: [
            {
              agentKey: 'growth-assist-coach',
              title: 'Growth Assist Coach',
              domainKey: 'growth',
              status: 'critical',
              pendingApprovalRequestsCount: 1,
              reviewableSuggestionRunsCount: 0,
              toolAccessSummary: {
                allowedCount: 2,
                approvalRequiredCount: 0,
                blockedCount: 1,
              },
              recentActivityAt: '2026-05-20T10:38:00.000Z',
              oldestPendingApprovalRequest: expect.objectContaining({
                id: 'ai-approval-001',
                status: 'pending',
              }),
              latestSuggestionRun: expect.objectContaining({
                id: 'ai-run-001',
                agentKey: 'growth-assist-coach',
              }),
              notes: [
                '1 pending approval request(s) require attention.',
                'No reviewable handoffs waiting for escalation.',
                'Tool posture: 2 allowed, 0 approval-required, 1 blocked.',
              ],
            },
            {
              agentKey: 'invoice-document-assistant',
              title: 'Invoice Document Assistant',
              domainKey: 'invoicing',
              status: 'warning',
              pendingApprovalRequestsCount: 0,
              reviewableSuggestionRunsCount: 1,
              toolAccessSummary: {
                allowedCount: 0,
                approvalRequiredCount: 1,
                blockedCount: 0,
              },
              recentActivityAt: '2026-05-20T10:39:00.000Z',
              oldestPendingApprovalRequest: null,
              latestSuggestionRun: expect.objectContaining({
                id: 'ai-run-002',
                agentKey: 'invoice-document-assistant',
              }),
              notes: [
                'No pending approvals right now.',
                '1 suggestion run(s) still need an explicit review request.',
                'Tool posture: 0 allowed, 1 approval-required, 0 blocked.',
              ],
            },
          ],
        });
      });

    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      {
        limit: null,
        status: null,
      },
    );
    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice-document-assistant',
      {
        limit: null,
        status: null,
      },
    );
    expect(listTenantAiSuggestionRunsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      null,
    );
    expect(listTenantAiSuggestionRunsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice-document-assistant',
      null,
    );
  });

  it('GET /api/ai/tenants/:slug/evaluation-workspace should return the tenant-scoped transversal AI evaluation workspace', async () => {
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/evaluation-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          overallStatus: 'warning',
          counts: {
            totalAgents: 2,
            agentsWithReviewedOutcomes: 1,
            reviewedApprovalRequests: 1,
            approvedReviewedApprovalRequests: 1,
            rejectedReviewedApprovalRequests: 0,
          },
          agents: [
            {
              agentKey: 'growth-assist-coach',
              title: 'Growth Assist Coach',
              domainKey: 'growth',
              status: 'warning',
              reviewedApprovalRequestsCount: 0,
              approvedReviewedApprovalRequestsCount: 0,
              rejectedReviewedApprovalRequestsCount: 0,
              approvalRatePercentage: null,
              latestReviewedAt: null,
              latestReviewedApprovalRequest: null,
              notes: [
                'No reviewed outcomes recorded yet for this agent.',
                'Approval-rate signal is still unavailable.',
                'No latest reviewed decision is available yet.',
              ],
            },
            {
              agentKey: 'invoice-document-assistant',
              title: 'Invoice Document Assistant',
              domainKey: 'invoicing',
              status: 'healthy',
              reviewedApprovalRequestsCount: 1,
              approvedReviewedApprovalRequestsCount: 1,
              rejectedReviewedApprovalRequestsCount: 0,
              approvalRatePercentage: 100,
              latestReviewedAt: '2026-05-20T10:41:00.000Z',
              latestReviewedApprovalRequest: expect.objectContaining({
                id: 'ai-approval-002',
                status: 'approved',
              }),
              notes: [
                '1 approved and 0 rejected reviewed outcome(s).',
                'Approval rate currently sits at 100%.',
                'Latest reviewed outcome was approved on 2026-05-20T10:41:00.000Z.',
              ],
            },
          ],
        });
      });

    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      {
        limit: null,
        status: null,
      },
    );
    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice-document-assistant',
      {
        limit: null,
        status: null,
      },
    );
  });

  it('GET /api/ai/tenants/:slug/governance-workspace should return the tenant-scoped transversal AI governance workspace', async () => {
    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/governance-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          counts: {
            totalAgents: 2,
            suggestionModeAgents: 2,
            guardedExecutionPlannedAgents: 1,
            approvalRequiredTools: 1,
            blockedTools: 1,
          },
          agents: [
            {
              agentKey: 'growth-assist-coach',
              title: 'Growth Assist Coach',
              domainKey: 'growth',
              productKey: 'growth',
              defaultMode: 'suggestion',
              promptPack: {
                key: 'growth-assist-coach-core',
                version: 'v1',
                mode: 'suggestion',
                title: 'Growth Assist Coach Core',
              },
              approvalPolicyKeys: ['growth-assist-suggestion-review'],
              toolAccessSummary: {
                allowedCount: 2,
                approvalRequiredCount: 0,
                blockedCount: 1,
              },
              executionModes: [
                'guarded_execution_planned',
                'suggestion_only',
              ],
              blockedCapabilities: [
                'assign_operational_case',
                'mutate_conversation_state',
                'reroute_queue_membership',
                'schedule_message_send',
                'send_whatsapp_message',
                'update_case_follow_up_state',
              ],
              reviewRequirementHighlights: [
                'An operator should review the draft before sending it through any real channel.',
                'The operator should translate the plan into real CRM or messaging actions manually.',
                'This tool stays blocked until approval memory and guarded execution flows are operational.',
              ],
              notes: [
                'Prompt pack growth-assist-coach-core@v1 anchors this agent in suggestion mode.',
                '1 approval policy rule(s) govern the current handoff posture.',
                '2 allowed, 0 approval-required, 1 blocked tool(s).',
                'Guarded execution remains planned, not unlocked.',
              ],
            },
            {
              agentKey: 'invoice-document-assistant',
              title: 'Invoice Document Assistant',
              domainKey: 'invoicing',
              productKey: 'invoicing',
              defaultMode: 'suggestion',
              promptPack: {
                key: 'invoice-document-assistant-core',
                version: 'v1',
                mode: 'suggestion',
                title: 'Invoice Document Assistant Core',
              },
              approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
              toolAccessSummary: {
                allowedCount: 0,
                approvalRequiredCount: 1,
                blockedCount: 0,
              },
              executionModes: ['suggestion_only'],
              blockedCapabilities: [
                'mark_document_authorized',
                'sign_tax_document',
                'submit_tax_document',
              ],
              reviewRequirementHighlights: [
                'Document guidance must stay advisory and be reviewed before any operator uses it in fiscal work.',
              ],
              notes: [
                'Prompt pack invoice-document-assistant-core@v1 anchors this agent in suggestion mode.',
                '1 approval policy rule(s) govern the current handoff posture.',
                '0 allowed, 1 approval-required, 0 blocked tool(s).',
                'All visible tools stay in suggestion-only mode.',
              ],
            },
          ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/policy-simulation-workspace should return the tenant-scoped transversal AI policy simulation workspace', async () => {
    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/policy-simulation-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
        tenantSlug: 'saas-platform',
        generatedAt: expect.any(String),
        counts: {
          totalAgents: 2,
          agentsWithSimulationDelta: 1,
          toolsPromotedToApprovalRequired: 1,
          toolsStillBlocked: 0,
        },
        agents: [
          {
            agentKey: 'growth-assist-coach',
            title: 'Growth Assist Coach',
            domainKey: 'growth',
            productKey: 'growth',
            defaultMode: 'suggestion',
            approvalPolicyKeys: ['growth-assist-suggestion-review'],
            currentToolAccessSummary: {
              allowedCount: 2,
              approvalRequiredCount: 0,
              blockedCount: 1,
            },
            simulatedToolAccessSummary: {
              allowedCount: 2,
              approvalRequiredCount: 1,
              blockedCount: 0,
            },
            simulationStatus: 'more_reviewable',
            promotedToolKeys: ['growth_case_assignment_execution'],
            stillBlockedToolKeys: [],
            notes: [
              '1 blocked tool(s) could move to approval-required if guarded execution is unlocked safely.',
              'No tool stays blocked after the simulated policy shift.',
              'Simulated review-first posture would leave 1 tool(s) behind explicit human approval.',
              'The same 1 approval policy rule(s) would keep governing this agent in the simulation.',
            ],
          },
          {
            agentKey: 'invoice-document-assistant',
            title: 'Invoice Document Assistant',
            domainKey: 'invoicing',
            productKey: 'invoicing',
            defaultMode: 'suggestion',
            approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
            currentToolAccessSummary: {
              allowedCount: 0,
              approvalRequiredCount: 1,
              blockedCount: 0,
            },
            simulatedToolAccessSummary: {
              allowedCount: 0,
              approvalRequiredCount: 1,
              blockedCount: 0,
            },
            simulationStatus: 'review_ready',
            promotedToolKeys: [],
            stillBlockedToolKeys: [],
            notes: [
              'No blocked tool needs promotion in this simulation.',
              'No tool stays blocked after the simulated policy shift.',
              'Simulated review-first posture would leave 1 tool(s) behind explicit human approval.',
              'The same 1 approval policy rule(s) would keep governing this agent in the simulation.',
            ],
          },
        ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/approval-design-workspace should return the tenant-scoped transversal AI approval design workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/approval-design-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
        tenantSlug: 'saas-platform',
        generatedAt: expect.any(String),
        counts: {
          totalAgents: 2,
          agentsWithHeavierReview: 1,
          currentExpectedHumanReviews: 2,
          simulatedExpectedHumanReviews: 3,
          addedHumanReviewTouches: 1,
        },
        agents: [
          {
            agentKey: 'growth-assist-coach',
            title: 'Growth Assist Coach',
            domainKey: 'growth',
            productKey: 'growth',
            approvalPolicyKeys: ['growth-assist-suggestion-review'],
            currentExpectedReviewLoad: {
              pendingApprovalRequests: 1,
              reviewableSuggestionRuns: 0,
              totalHumanReviewTouches: 1,
            },
            simulatedExpectedReviewLoad: {
              pendingApprovalRequests: 1,
              reviewableSuggestionRuns: 0,
              promotedToolReviewPoints: 1,
              totalHumanReviewTouches: 2,
            },
            designStatus: 'heavier_review',
            promotedToolKeys: ['growth_case_assignment_execution'],
            stillBlockedToolKeys: [],
            notes: [
              'Current review load combines 1 pending approval request(s) and 0 reviewable handoff(s).',
              '1 additional tool approval checkpoint(s) would appear in a review-first guarded execution design.',
              'No extra blocked tool would constrain this approval design.',
              'The same 1 approval policy rule(s) remain the governance base for this design scenario.',
            ],
          },
          {
            agentKey: 'invoice-document-assistant',
            title: 'Invoice Document Assistant',
            domainKey: 'invoicing',
            productKey: 'invoicing',
            approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
            currentExpectedReviewLoad: {
              pendingApprovalRequests: 0,
              reviewableSuggestionRuns: 1,
              totalHumanReviewTouches: 1,
            },
            simulatedExpectedReviewLoad: {
              pendingApprovalRequests: 0,
              reviewableSuggestionRuns: 1,
              promotedToolReviewPoints: 0,
              totalHumanReviewTouches: 1,
            },
            designStatus: 'unchanged',
            promotedToolKeys: [],
            stillBlockedToolKeys: [],
            notes: [
              'Current review load combines 0 pending approval request(s) and 1 reviewable handoff(s).',
              'No extra tool checkpoint would be added in this design scenario.',
              'No extra blocked tool would constrain this approval design.',
              'The same 1 approval policy rule(s) remain the governance base for this design scenario.',
            ],
          },
        ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/approval-capacity-workspace should return the tenant-scoped transversal AI approval capacity workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/approval-capacity-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
        tenantSlug: 'saas-platform',
        generatedAt: expect.any(String),
        counts: {
          totalAgents: 2,
          agentsAtCapacityRisk: 1,
          currentMinimumReviewsPerDay: 2,
          simulatedMinimumReviewsPerDay: 3,
          addedReviewsPerDay: 1,
        },
        agents: [
          {
            agentKey: 'growth-assist-coach',
            title: 'Growth Assist Coach',
            domainKey: 'growth',
            productKey: 'growth',
            approvalPolicyKeys: ['growth-assist-suggestion-review'],
            currentMinimumReviewsPerDay: 1,
            simulatedMinimumReviewsPerDay: 2,
            addedReviewsPerDay: 1,
            capacityStatus: 'watch',
            promotedToolKeys: ['growth_case_assignment_execution'],
            stillBlockedToolKeys: [],
            bottleneckReasons: [
              '1 pending approval request(s) already consume reviewer attention.',
              '1 extra tool checkpoint(s) would enter the daily review path.',
            ],
            notes: [
              'Current posture suggests at least 1 human review touch(es) per day-equivalent.',
              'Simulated review-first posture suggests 2 touch(es) per day-equivalent.',
              'That means 1 additional review touch(es) to staff for this agent.',
              'The same 1 approval policy rule(s) still anchor reviewer governance here.',
            ],
          },
          {
            agentKey: 'invoice-document-assistant',
            title: 'Invoice Document Assistant',
            domainKey: 'invoicing',
            productKey: 'invoicing',
            approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
            currentMinimumReviewsPerDay: 1,
            simulatedMinimumReviewsPerDay: 1,
            addedReviewsPerDay: 0,
            capacityStatus: 'stable',
            promotedToolKeys: [],
            stillBlockedToolKeys: [],
            bottleneckReasons: [
              '1 handoff(s) still need explicit review escalation.',
            ],
            notes: [
              'Current posture suggests at least 1 human review touch(es) per day-equivalent.',
              'Simulated review-first posture suggests 1 touch(es) per day-equivalent.',
              'This scenario does not add extra review load for this agent.',
              'The same 1 approval policy rule(s) still anchor reviewer governance here.',
            ],
          },
        ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/approval-sla-workspace should return the tenant-scoped transversal AI approval SLA workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/approval-sla-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
        tenantSlug: 'saas-platform',
        generatedAt: expect.any(String),
        counts: {
          totalAgents: 2,
          agentsAtRisk: 1,
          agentsBreached: 0,
          currentBacklogTouches: 2,
          simulatedBacklogTouches: 3,
          addedBacklogTouches: 1,
        },
        agents: [
          {
            agentKey: 'growth-assist-coach',
            title: 'Growth Assist Coach',
            domainKey: 'growth',
            productKey: 'growth',
            approvalPolicyKeys: ['growth-assist-suggestion-review'],
            pendingApprovalRequests: 1,
            reviewableSuggestionRuns: 0,
            promotedToolKeys: ['growth_case_assignment_execution'],
            stillBlockedToolKeys: [],
            currentEstimatedClearDays: 1,
            simulatedEstimatedClearDays: 2,
            currentSlaStatus: 'on_track',
            simulatedSlaStatus: 'at_risk',
            notes: [
              'Current backlog implies roughly 1 day-equivalent(s) to clear if one reviewer-touch per day is available for this agent.',
              'Simulated review-first backlog implies roughly 2 day-equivalent(s) to clear under the same baseline.',
              '1 promoted tool checkpoint(s) would push the same-day SLA closer to risk.',
              'No blocked tool is adding extra SLA uncertainty in this scenario.',
            ],
          },
          {
            agentKey: 'invoice-document-assistant',
            title: 'Invoice Document Assistant',
            domainKey: 'invoicing',
            productKey: 'invoicing',
            approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
            pendingApprovalRequests: 0,
            reviewableSuggestionRuns: 1,
            promotedToolKeys: [],
            stillBlockedToolKeys: [],
            currentEstimatedClearDays: 1,
            simulatedEstimatedClearDays: 1,
            currentSlaStatus: 'on_track',
            simulatedSlaStatus: 'on_track',
            notes: [
              'Current backlog implies roughly 1 day-equivalent(s) to clear if one reviewer-touch per day is available for this agent.',
              'Simulated review-first backlog implies roughly 1 day-equivalent(s) to clear under the same baseline.',
              'No promoted tool checkpoint changes the same-day SLA in this scenario.',
              'No blocked tool is adding extra SLA uncertainty in this scenario.',
            ],
          },
        ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/approval-staffing-workspace should return the tenant-scoped transversal AI approval staffing workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/approval-staffing-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
        tenantSlug: 'saas-platform',
        generatedAt: expect.any(String),
        counts: {
          totalAgents: 2,
          agentsNeedingMoreCoverage: 1,
          currentRequiredReviewerEquivalents: 2,
          simulatedRequiredReviewerEquivalents: 3,
          addedReviewerEquivalents: 1,
        },
        agents: [
          {
            agentKey: 'growth-assist-coach',
            title: 'Growth Assist Coach',
            domainKey: 'growth',
            productKey: 'growth',
            approvalPolicyKeys: ['growth-assist-suggestion-review'],
            currentRequiredReviewerEquivalents: 1,
            simulatedRequiredReviewerEquivalents: 2,
            addedReviewerEquivalents: 1,
            staffingStatus: 'watch',
            promotedToolKeys: ['growth_case_assignment_execution'],
            stillBlockedToolKeys: [],
            staffingReasons: [
              '1 pending approval request(s) already need reviewer capacity.',
              '1 promoted tool checkpoint(s) would require additional reviewer coverage.',
            ],
            notes: [
              'Current posture needs at least 1 reviewer-equivalent(s) for same-day handling under this simplified model.',
              'Simulated review-first posture needs 2 reviewer-equivalent(s) under the same model.',
              'That means 1 extra reviewer-equivalent(s) to staff for this agent.',
              'The same 1 approval policy rule(s) still define who can review and gate outcomes here.',
            ],
          },
          {
            agentKey: 'invoice-document-assistant',
            title: 'Invoice Document Assistant',
            domainKey: 'invoicing',
            productKey: 'invoicing',
            approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
            currentRequiredReviewerEquivalents: 1,
            simulatedRequiredReviewerEquivalents: 1,
            addedReviewerEquivalents: 0,
            staffingStatus: 'sufficient',
            promotedToolKeys: [],
            stillBlockedToolKeys: [],
            staffingReasons: [
              '1 handoff(s) would still need manual review escalation.',
            ],
            notes: [
              'Current posture needs at least 1 reviewer-equivalent(s) for same-day handling under this simplified model.',
              'Simulated review-first posture needs 1 reviewer-equivalent(s) under the same model.',
              'This scenario does not demand additional reviewer-equivalents for this agent.',
              'The same 1 approval policy rule(s) still define who can review and gate outcomes here.',
            ],
          },
        ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/approval-staffing-plan-workspace should return the tenant-scoped transversal AI approval staffing plan workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/approval-staffing-plan-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
        tenantSlug: 'saas-platform',
        generatedAt: expect.any(String),
        counts: {
          totalAgents: 2,
          agentsRequiringIncrease: 1,
          totalRecommendedReviewerEquivalents: 3,
          totalAdditionalReviewerEquivalents: 1,
          highestPriorityAgents: 1,
        },
        agents: [
          {
            agentKey: 'growth-assist-coach',
            title: 'Growth Assist Coach',
            domainKey: 'growth',
            productKey: 'growth',
            approvalPolicyKeys: ['growth-assist-suggestion-review'],
            currentRequiredReviewerEquivalents: 1,
            simulatedRequiredReviewerEquivalents: 2,
            recommendedReviewerEquivalents: 2,
            additionalReviewerEquivalentsToAssign: 1,
            priorityRank: 1,
            planStatus: 'increase',
            promotedToolKeys: ['growth_case_assignment_execution'],
            stillBlockedToolKeys: [],
            planActions: [
              'Add 1 reviewer-equivalent(s) before opening the review-first path.',
              'Stage explicit review coverage for growth_case_assignment_execution before enabling the new checkpoint.',
              'No blocked tool forces a separate staffing hold right now.',
            ],
            notes: [
              'Current coverage baseline is 1 reviewer-equivalent(s).',
              'Recommended coverage for the simulated target posture is 2 reviewer-equivalent(s).',
              'This plan adds 1 reviewer-equivalent(s) over the current baseline.',
              'The same 1 approval policy rule(s) still govern who can perform the reviews in this plan.',
            ],
          },
          {
            agentKey: 'invoice-document-assistant',
            title: 'Invoice Document Assistant',
            domainKey: 'invoicing',
            productKey: 'invoicing',
            approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
            currentRequiredReviewerEquivalents: 1,
            simulatedRequiredReviewerEquivalents: 1,
            recommendedReviewerEquivalents: 1,
            additionalReviewerEquivalentsToAssign: 0,
            priorityRank: 2,
            planStatus: 'maintain',
            promotedToolKeys: [],
            stillBlockedToolKeys: [],
            planActions: [
              'Maintain current reviewer coverage for this agent.',
              'No extra promoted tool checkpoint needs dedicated staging.',
              'No blocked tool forces a separate staffing hold right now.',
            ],
            notes: [
              'Current coverage baseline is 1 reviewer-equivalent(s).',
              'Recommended coverage for the simulated target posture is 1 reviewer-equivalent(s).',
              'This plan keeps reviewer coverage flat versus the current baseline.',
              'The same 1 approval policy rule(s) still govern who can perform the reviews in this plan.',
            ],
          },
        ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/approval-rollout-workspace should return the tenant-scoped transversal AI approval rollout workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/approval-rollout-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
        tenantSlug: 'saas-platform',
        generatedAt: expect.any(String),
        counts: {
          totalAgents: 2,
          phase1Agents: 1,
          phase2Agents: 1,
          holdAgents: 0,
          totalAdditionalReviewerEquivalents: 1,
        },
        agents: [
          {
            agentKey: 'growth-assist-coach',
            title: 'Growth Assist Coach',
            domainKey: 'growth',
            productKey: 'growth',
            approvalPolicyKeys: ['growth-assist-suggestion-review'],
            currentRequiredReviewerEquivalents: 1,
            recommendedReviewerEquivalents: 2,
            additionalReviewerEquivalentsToAssign: 1,
            priorityRank: 1,
            rolloutPhase: 'phase_1',
            rolloutStatus: 'increase_then_rollout',
            promotedToolKeys: ['growth_case_assignment_execution'],
            stillBlockedToolKeys: [],
            rolloutActions: [
              'Assign 1 additional reviewer-equivalent(s), then open this agent in phase 1.',
              'Gate growth_case_assignment_execution behind explicit review before rollout.',
              'Use policy growth-assist-suggestion-review as the human gate throughout rollout.',
            ],
            notes: [
              'Current reviewer baseline is 1, while the rollout target asks for 2.',
              'This rollout phase adds 1 reviewer-equivalent(s) before activation.',
              'No blocked tool path prevents the rollout once the assigned coverage is in place.',
            ],
          },
          {
            agentKey: 'invoice-document-assistant',
            title: 'Invoice Document Assistant',
            domainKey: 'invoicing',
            productKey: 'invoicing',
            approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
            currentRequiredReviewerEquivalents: 1,
            recommendedReviewerEquivalents: 1,
            additionalReviewerEquivalentsToAssign: 0,
            priorityRank: 2,
            rolloutPhase: 'phase_2',
            rolloutStatus: 'safe_to_rollout',
            promotedToolKeys: [],
            stillBlockedToolKeys: [],
            rolloutActions: [
              'Keep current reviewer coverage and schedule this agent for phase 2 rollout.',
              'No promoted tool checkpoint needs extra rollout gating.',
              'Use policy invoice-document-assistant-suggestion-review as the human gate throughout rollout.',
            ],
            notes: [
              'Current reviewer baseline is 1, while the rollout target asks for 1.',
              'This rollout phase can proceed without adding reviewer-equivalents first.',
              'No blocked tool path prevents the rollout once the assigned coverage is in place.',
            ],
          },
        ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/approval-readiness-workspace should return the tenant-scoped transversal AI approval readiness workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/approval-readiness-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
        tenantSlug: 'saas-platform',
        generatedAt: expect.any(String),
        counts: {
          totalAgents: 2,
          readyNowAgents: 1,
          needsCoverageAgents: 1,
          blockedAgents: 0,
        },
        agents: [
          {
            agentKey: 'growth-assist-coach',
            title: 'Growth Assist Coach',
            domainKey: 'growth',
            productKey: 'growth',
            approvalPolicyKeys: ['growth-assist-suggestion-review'],
            currentRequiredReviewerEquivalents: 1,
            recommendedReviewerEquivalents: 2,
            additionalReviewerEquivalentsToAssign: 1,
            currentSlaStatus: 'on_track',
            simulatedSlaStatus: 'at_risk',
            rolloutPhase: 'phase_1',
            readinessStatus: 'needs_coverage',
            readinessReasons: [
              '1 pending approval request(s) already consume reviewer capacity.',
              'No suggestion run is waiting for an explicit review request right now.',
              '1 guarded execution checkpoint(s) would move into the review path.',
              'No blocked tool is preventing operational readiness in this scenario.',
            ],
            nextStep:
              'Assign 1 reviewer-equivalent(s) before opening review-first rollout.',
            notes: [
              'Current reviewer baseline is 1, while the readiness target asks for 2.',
              'Current SLA reads on_track, and the simulated review-first SLA reads at_risk.',
              'Rollout sequencing places this agent in phase_1.',
              'The same 1 approval policy rule(s) remain the human gate for this readiness call.',
            ],
          },
          {
            agentKey: 'invoice-document-assistant',
            title: 'Invoice Document Assistant',
            domainKey: 'invoicing',
            productKey: 'invoicing',
            approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
            currentRequiredReviewerEquivalents: 1,
            recommendedReviewerEquivalents: 1,
            additionalReviewerEquivalentsToAssign: 0,
            currentSlaStatus: 'on_track',
            simulatedSlaStatus: 'on_track',
            rolloutPhase: 'phase_2',
            readinessStatus: 'ready_now',
            readinessReasons: [
              'No pending approval request is consuming reviewer capacity right now.',
              '1 suggestion run(s) still need an explicit review request.',
              'No extra guarded execution checkpoint would widen the review path.',
              'No blocked tool is preventing operational readiness in this scenario.',
            ],
            nextStep:
              'Safe to open this agent in the next rollout window with current coverage.',
            notes: [
              'Current reviewer baseline is 1, while the readiness target asks for 1.',
              'Current SLA reads on_track, and the simulated review-first SLA reads on_track.',
              'Rollout sequencing places this agent in phase_2.',
              'The same 1 approval policy rule(s) remain the human gate for this readiness call.',
            ],
          },
        ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/approval-launch-workspace should return the tenant-scoped transversal AI approval launch workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/approval-launch-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
        tenantSlug: 'saas-platform',
        generatedAt: expect.any(String),
        counts: {
          totalAgents: 2,
          launchNowAgents: 1,
          pilotAfterCoverageAgents: 1,
          holdAgents: 0,
          totalCoverageGap: 1,
        },
        agents: [
          {
            agentKey: 'invoice-document-assistant',
            title: 'Invoice Document Assistant',
            domainKey: 'invoicing',
            productKey: 'invoicing',
            approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
            currentRequiredReviewerEquivalents: 1,
            recommendedReviewerEquivalents: 1,
            additionalReviewerEquivalentsToAssign: 0,
            rolloutPhase: 'phase_2',
            simulatedSlaStatus: 'on_track',
            launchStatus: 'launch_now',
            launchWindow: 'current_window',
            recommendedAction:
              'Open this agent in the current launch window with the present reviewer coverage.',
            launchChecklist: [
              'Current reviewer coverage already matches the simulated launch target.',
              'Simulated same-day SLA remains on track.',
              'Launch path does not introduce new guarded checkpoints.',
              'No blocked tool is still outside the launch design.',
            ],
            notes: [
              'Rollout phase currently reads phase_2.',
              'Recommended coverage is 1 reviewer-equivalent(s) versus 1 today.',
              'Approval gate stays under invoice-document-assistant-suggestion-review.',
            ],
          },
          {
            agentKey: 'growth-assist-coach',
            title: 'Growth Assist Coach',
            domainKey: 'growth',
            productKey: 'growth',
            approvalPolicyKeys: ['growth-assist-suggestion-review'],
            currentRequiredReviewerEquivalents: 1,
            recommendedReviewerEquivalents: 2,
            additionalReviewerEquivalentsToAssign: 1,
            rolloutPhase: 'phase_1',
            simulatedSlaStatus: 'at_risk',
            launchStatus: 'pilot_after_coverage',
            launchWindow: 'next_window',
            recommendedAction:
              'Fill 1 reviewer-equivalent(s) and re-check SLA before the next launch window.',
            launchChecklist: [
              'Reviewer coverage still needs 1 additional reviewer-equivalent(s).',
              'Simulated same-day SLA is at_risk and should be stabilized before launch.',
              'Launch path would introduce 1 guarded checkpoint(s): growth_case_assignment_execution.',
              'No blocked tool is still outside the launch design.',
            ],
            notes: [
              'Rollout phase currently reads phase_1.',
              'Recommended coverage is 2 reviewer-equivalent(s) versus 1 today.',
              'Approval gate stays under growth-assist-suggestion-review.',
            ],
          },
        ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/guarded-execution-workspace should return the tenant-scoped transversal AI guarded execution workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/guarded-execution-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          counts: {
            totalAgents: 2,
            pilotCandidateAgents: 0,
            needsLaunchReadinessAgents: 1,
            suggestionOnlyAgents: 1,
            executionCandidateTools: 1,
          },
          agents: [
            {
              agentKey: 'growth-assist-coach',
              title: 'Growth Assist Coach',
              domainKey: 'growth',
              productKey: 'growth',
              currentMode: 'suggestion',
              approvalPolicyKeys: ['growth-assist-suggestion-review'],
              executionCandidateToolKeys: ['growth_case_assignment_execution'],
              approvalRequiredToolKeys: [],
              pendingApprovalRequests: 1,
              reviewableSuggestionRuns: 0,
              rolloutPhase: 'phase_1',
              guardedExecutionStatus: 'needs_launch_readiness',
              guardrailChecklist: [
                '1 execution candidate tool(s) are planned for guarded mode.',
                '1 approval policy rule(s) already exist for human gating.',
                '1 pending approval request(s) still compete for reviewer attention.',
                'Simulated review-first SLA is at_risk and should be stabilized first.',
              ],
              nextStep:
                'Finish launch readiness, reviewer coverage, and SLA stabilization before introducing a guarded-execution pilot.',
              notes: [
                'Current mode stays suggestion.',
                'Rollout phase reads phase_1, with 1 extra reviewer-equivalent(s) still needed.',
                'Candidate tools for guarded execution: growth_case_assignment_execution.',
                'No tool is currently exposed as approval-required.',
              ],
            },
            {
              agentKey: 'invoice-document-assistant',
              title: 'Invoice Document Assistant',
              domainKey: 'invoicing',
              productKey: 'invoicing',
              currentMode: 'suggestion',
              approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
              executionCandidateToolKeys: [],
              approvalRequiredToolKeys: ['invoice_document_drafting'],
              pendingApprovalRequests: 0,
              reviewableSuggestionRuns: 1,
              rolloutPhase: 'phase_2',
              guardedExecutionStatus: 'suggestion_only',
              guardrailChecklist: [
                'No execution candidate tool is planned for guarded mode yet.',
                '1 approval policy rule(s) already exist for human gating.',
                'No pending approval request is currently competing for reviewer attention.',
                'Simulated review-first SLA remains on track under the current guardrails.',
              ],
              nextStep:
                'Keep this agent in suggestion mode until at least one guarded-execution candidate tool exists.',
              notes: [
                'Current mode stays suggestion.',
                'Rollout phase reads phase_2, with 0 extra reviewer-equivalent(s) still needed.',
                'This agent currently has no candidate tool for guarded execution.',
                'Already approval-required today: invoice_document_drafting.',
              ],
            },
          ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/guarded-execution-pilot-workspace should return the tenant-scoped transversal AI guarded execution pilot workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/guarded-execution-pilot-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          counts: {
            totalAgents: 2,
            readyForPilotAgents: 0,
            needsOperationalBackingAgents: 1,
            noCandidateAgents: 1,
            candidateToolPilots: 1,
          },
          agents: [
            {
              agentKey: 'growth-assist-coach',
              title: 'Growth Assist Coach',
              domainKey: 'growth',
              productKey: 'growth',
              currentMode: 'suggestion',
              approvalPolicyKeys: ['growth-assist-suggestion-review'],
              candidateToolKey: 'growth_case_assignment_execution',
              rolloutPhase: 'phase_1',
              simulatedSlaStatus: 'at_risk',
              pilotStatus: 'needs_operational_backing',
              pilotType: 'shadow_review',
              additionalReviewerEquivalentsToAssign: 1,
              pilotPreconditions: [
                'Candidate tool selected for the first pilot: growth_case_assignment_execution.',
                '1 approval policy rule(s) are already available to gate the pilot.',
                '1 reviewer-equivalent(s) still need to be staffed before any execute path is opened.',
                'Simulated same-day SLA is at_risk for this pilot shape.',
              ],
              pilotGuardrails: [
                'Start with shadow-review only and keep real mutations disabled.',
                '1 pending approval request(s) should be drained or ring-fenced before pilot start.',
                'No reviewable handoff is still waiting for explicit routing discipline.',
              ],
              recommendedPilotScope:
                'Use growth_case_assignment_execution only as a shadow-review intent until reviewer coverage and SLA are stable.',
              nextStep:
                'Close reviewer-capacity and SLA gaps before converting this lane from shadow review into execution.',
              notes: [
                'Current mode remains suggestion.',
                'Rollout phase reads phase_1.',
                'First pilot candidate tool is growth_case_assignment_execution.',
                'Approval gate stays under growth-assist-suggestion-review.',
              ],
            },
            {
              agentKey: 'invoice-document-assistant',
              title: 'Invoice Document Assistant',
              domainKey: 'invoicing',
              productKey: 'invoicing',
              currentMode: 'suggestion',
              approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
              candidateToolKey: null,
              rolloutPhase: 'phase_2',
              simulatedSlaStatus: 'on_track',
              pilotStatus: 'no_candidate',
              pilotType: 'not_available',
              additionalReviewerEquivalentsToAssign: 0,
              pilotPreconditions: [
                'No candidate tool is available for a guarded-execution pilot.',
                '1 approval policy rule(s) are already available to gate the pilot.',
                'Reviewer coverage is already aligned with the simulated pilot posture.',
                'Simulated same-day SLA stays on track for this pilot shape.',
              ],
              pilotGuardrails: [
                'No guarded execution path should be exposed yet.',
                'No pending approval backlog needs ring-fencing before pilot start.',
                '1 existing suggestion handoff(s) still need explicit human routing discipline.',
              ],
              recommendedPilotScope:
                'Keep this agent in suggestion-only scope.',
              nextStep:
                'Wait until a concrete guarded-execution candidate tool is introduced for this agent.',
              notes: [
                'Current mode remains suggestion.',
                'Rollout phase reads phase_2.',
                'There is no first pilot candidate tool yet.',
                'Approval gate stays under invoice-document-assistant-suggestion-review.',
              ],
            },
          ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/guarded-execution-runbook-workspace should return the tenant-scoped transversal AI guarded execution runbook workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/guarded-execution-runbook-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          counts: {
            totalAgents: 2,
            readyToDocumentAgents: 0,
            needsDesignAgents: 1,
            notAvailableAgents: 1,
            candidateRunbooks: 1,
          },
          agents: [
            {
              agentKey: 'growth-assist-coach',
              title: 'Growth Assist Coach',
              domainKey: 'growth',
              productKey: 'growth',
              currentMode: 'suggestion',
              approvalPolicyKeys: ['growth-assist-suggestion-review'],
              candidateToolKey: 'growth_case_assignment_execution',
              pilotType: 'shadow_review',
              rolloutPhase: 'phase_1',
              simulatedSlaStatus: 'at_risk',
              additionalReviewerEquivalentsToAssign: 1,
              runbookStatus: 'needs_design',
              operatingLane: 'operational_case_assignment_lane',
              namedHumanGate: 'growth-assist-suggestion-review',
              blastRadius: 'single_queue_lane',
              stopConditions: [
                'Stop the pilot if reviewer coverage drops below the recommended minimum for the lane.',
                'Pause the pilot if the simulated SLA drifts from on_track into at_risk or breached.',
                'Pause the pilot if the current approval queue keeps growing faster than same-day review can clear it.',
              ],
              entryChecklist: [
                'Candidate tool growth_case_assignment_execution is selected as the narrow execution scope.',
                'Human gate resolves through growth-assist-suggestion-review.',
                '1 reviewer-equivalent(s) still need to be assigned before this runbook can open execution.',
                'Simulated same-day SLA is at_risk for this runbook shape.',
              ],
              exitCriteria: [
                'The growth_case_assignment_execution lane has an approved human gate and an explicit rollback path.',
                'Required reviewer coverage is assigned and the queue stabilizes under that coverage.',
                'Shadow-review evidence is collected before any execute path is documented as live.',
              ],
              nextStep:
                'Use a shadow-review runbook first, then close reviewer coverage and SLA gaps before documenting execute steps.',
              notes: [
                'Current mode stays suggestion.',
                'Pilot type reads shadow_review and rollout phase reads phase_1.',
                'Blast radius is constrained to single_queue_lane.',
                'Named lane for the first runbook: operational_case_assignment_lane.',
              ],
            },
            {
              agentKey: 'invoice-document-assistant',
              title: 'Invoice Document Assistant',
              domainKey: 'invoicing',
              productKey: 'invoicing',
              currentMode: 'suggestion',
              approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
              candidateToolKey: null,
              pilotType: 'not_available',
              rolloutPhase: 'phase_2',
              simulatedSlaStatus: 'on_track',
              additionalReviewerEquivalentsToAssign: 0,
              runbookStatus: 'not_available',
              operatingLane: 'suggestion_only_lane',
              namedHumanGate: 'invoice-document-assistant-suggestion-review',
              blastRadius: 'no_execution_scope',
              stopConditions: [
                'Stop the pilot if reviewer coverage drops below the recommended minimum for the lane.',
                'Pause the pilot if the simulated SLA drifts from on_track into at_risk or breached.',
                'Pause the pilot if new approval backlog starts accumulating faster than same-day review can clear it.',
              ],
              entryChecklist: [
                'No execution candidate tool has been selected yet.',
                'Human gate resolves through invoice-document-assistant-suggestion-review.',
                'Current reviewer coverage already matches the simulated guarded-execution posture.',
                'Simulated same-day SLA stays on track for this runbook shape.',
              ],
              exitCriteria: [
                'At least one candidate tool is selected before a runbook can be finalized.',
                'Reviewer coverage remains stable for the first guarded-execution window.',
                'Shadow-review evidence is collected before any execute path is documented as live.',
              ],
              nextStep:
                'Stay in suggestion mode until a concrete guarded-execution candidate tool exists.',
              notes: [
                'Current mode stays suggestion.',
                'Pilot type reads not_available and rollout phase reads phase_2.',
                'Blast radius is constrained to no_execution_scope.',
                'No operating lane is defined yet because there is no execution candidate.',
              ],
            },
          ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/guarded-execution-rollback-workspace should return the tenant-scoped transversal AI guarded execution rollback workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/guarded-execution-rollback-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          counts: {
            totalAgents: 2,
            readyWithRollbackAgents: 0,
            needsRollbackDesignAgents: 1,
            notApplicableAgents: 1,
            rollbackCandidateTools: 1,
          },
          agents: [
            {
              agentKey: 'growth-assist-coach',
              title: 'Growth Assist Coach',
              domainKey: 'growth',
              productKey: 'growth',
              currentMode: 'suggestion',
              approvalPolicyKeys: ['growth-assist-suggestion-review'],
              candidateToolKey: 'growth_case_assignment_execution',
              pilotType: 'shadow_review',
              rolloutPhase: 'phase_1',
              simulatedSlaStatus: 'at_risk',
              runbookStatus: 'needs_design',
              rollbackStatus: 'needs_rollback_design',
              rollbackOwner: 'growth-assist-suggestion-review',
              blastRadius: 'single_queue_lane',
              rollbackTriggerSummary: [
                'Any growth_case_assignment_execution attempt that misses explicit human gate approval should fall back immediately.',
                'Rollback should trigger immediately if the pilot keeps the SLA at at_risk.',
                '1 missing reviewer-equivalent(s) remain a hard rollback trigger.',
              ],
              rollbackSteps: [
                'Disable growth_case_assignment_execution execute path and return the lane to explicit human-only handling.',
                'Route the affected work back to suggestion_only_with_manual_assignment.',
                'Log the rollback decision under growth-assist-suggestion-review and capture the operator rationale for follow-up review.',
              ],
              verificationChecks: [
                'Confirm no state mutation was finalized without an approved human gate.',
                'Confirm the affected queue lane is back under manual ownership.',
                'Confirm the next operator flow continues in suggestion mode until the issue is closed.',
              ],
              safeFallbackMode: 'suggestion_only_with_manual_assignment',
              nextStep:
                'Finish the shadow-review design and write the rollback path before any execute step is documented.',
              notes: [
                'Current mode stays suggestion.',
                'Rollback owner resolves through growth-assist-suggestion-review.',
                'Fallback mode is suggestion_only_with_manual_assignment.',
                'Rollback scope is anchored to growth_case_assignment_execution with single_queue_lane blast radius.',
              ],
            },
            {
              agentKey: 'invoice-document-assistant',
              title: 'Invoice Document Assistant',
              domainKey: 'invoicing',
              productKey: 'invoicing',
              currentMode: 'suggestion',
              approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
              candidateToolKey: null,
              pilotType: 'not_available',
              rolloutPhase: 'phase_2',
              simulatedSlaStatus: 'on_track',
              runbookStatus: 'not_available',
              rollbackStatus: 'not_applicable',
              rollbackOwner: 'invoice-document-assistant-suggestion-review',
              blastRadius: 'no_execution_scope',
              rollbackTriggerSummary: [
                'No execute path exists yet, so rollback stays conceptual only.',
                'Escalate rollback if same-day review falls off track during the pilot window.',
                'Any sudden reviewer-coverage drop is a hard rollback trigger.',
              ],
              rollbackSteps: [
                'Keep the agent in suggestion-only mode with no execute path exposed.',
                'Route the affected work back to suggestion_only.',
                'Log the rollback decision under invoice-document-assistant-suggestion-review and capture the operator rationale for follow-up review.',
              ],
              verificationChecks: [
                'Confirm no state mutation was finalized without an approved human gate.',
                'Confirm the affected execution scope is back under manual ownership.',
                'Confirm the next operator flow continues in suggestion mode until the issue is closed.',
              ],
              safeFallbackMode: 'suggestion_only',
              nextStep:
                'Keep rollback planning lightweight until a concrete guarded-execution candidate tool exists.',
              notes: [
                'Current mode stays suggestion.',
                'Rollback owner resolves through invoice-document-assistant-suggestion-review.',
                'Fallback mode is suggestion_only.',
                'There is no rollback scope yet because there is no execution candidate.',
              ],
            },
          ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/guarded-execution-audit-workspace should return the tenant-scoped transversal AI guarded execution audit workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/guarded-execution-audit-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          counts: {
            totalAgents: 2,
            readyForAuditAgents: 0,
            needsEvidenceDesignAgents: 1,
            notApplicableAgents: 1,
            auditCandidateTools: 1,
          },
          agents: [
            {
              agentKey: 'growth-assist-coach',
              title: 'Growth Assist Coach',
              domainKey: 'growth',
              productKey: 'growth',
              currentMode: 'suggestion',
              approvalPolicyKeys: ['growth-assist-suggestion-review'],
              candidateToolKey: 'growth_case_assignment_execution',
              pilotType: 'shadow_review',
              rolloutPhase: 'phase_1',
              simulatedSlaStatus: 'at_risk',
              runbookStatus: 'needs_design',
              rollbackStatus: 'needs_rollback_design',
              auditStatus: 'needs_evidence_design',
              auditOwner: 'growth-assist-suggestion-review',
              safeFallbackMode: 'suggestion_only_with_manual_assignment',
              evidencePackSummary: [
                'Audit evidence should bind every growth_case_assignment_execution decision to a named human gate.',
                'No reviewed approval request exists yet as precedent evidence.',
                'Same-day review is still at_risk, so audit evidence would be noisy until the lane stabilizes.',
              ],
              requiredArtifacts: [
                'Named runbook for growth_case_assignment_execution with entry, rollback, and approval gate references.',
                'Approval-policy reference for growth-assist-suggestion-review.',
                'Operator-visible fallback path to suggestion_only_with_manual_assignment.',
              ],
              loggingChecks: [
                'Every guarded decision should record actor, policy key, and handoff/run identifiers.',
                'Every growth_case_assignment_execution attempt should log whether it stayed in shadow review or crossed a human gate.',
                'Rollback and fallback transitions should be visible in the same audit trail as the approval decision.',
              ],
              reviewTrailSummary: [
                'There is still no reviewed approval trail to reuse as precedent.',
                '1 pending approval request(s) still need resolution before the trail is stable.',
                'No unresolved suggestion run currently weakens the review trail.',
              ],
              nextStep:
                'Stabilize review evidence, rollback references, and approval logging before treating this lane as audit-ready.',
              notes: [
                'Current mode stays suggestion.',
                'Audit owner resolves through growth-assist-suggestion-review.',
                'Fallback mode for audit references is suggestion_only_with_manual_assignment.',
                'Audit scope is anchored to growth_case_assignment_execution.',
              ],
            },
            {
              agentKey: 'invoice-document-assistant',
              title: 'Invoice Document Assistant',
              domainKey: 'invoicing',
              productKey: 'invoicing',
              currentMode: 'suggestion',
              approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
              candidateToolKey: null,
              pilotType: 'not_available',
              rolloutPhase: 'phase_2',
              simulatedSlaStatus: 'on_track',
              runbookStatus: 'not_available',
              rollbackStatus: 'not_applicable',
              auditStatus: 'not_applicable',
              auditOwner: 'invoice-document-assistant-suggestion-review',
              safeFallbackMode: 'suggestion_only',
              evidencePackSummary: [
                'No guarded-execution evidence pack is needed yet because there is no execute path.',
                '1 reviewed approval request(s) already exist as precedent evidence for human oversight.',
                'Same-day review is stable enough to produce auditable reviewer evidence.',
              ],
              requiredArtifacts: [
                'Candidate tool selection before an audit artifact set is required.',
                'Approval-policy reference for invoice-document-assistant-suggestion-review.',
                'Operator-visible fallback path to suggestion_only.',
              ],
              loggingChecks: [
                'Every guarded decision should record actor, policy key, and handoff/run identifiers.',
                'No execute-attempt logging is required yet because there is no candidate tool.',
                'Rollback and fallback transitions should be visible in the same audit trail as the approval decision.',
              ],
              reviewTrailSummary: [
                '1 reviewed approval request(s) already contribute to the human review trail.',
                'No pending approval request currently blocks audit readability.',
                '1 suggestion run(s) still rely on explicit routing before they can support an audit package.',
              ],
              nextStep:
                'Stay in suggestion mode until a concrete guarded-execution candidate tool exists.',
              notes: [
                'Current mode stays suggestion.',
                'Audit owner resolves through invoice-document-assistant-suggestion-review.',
                'Fallback mode for audit references is suggestion_only.',
                'There is no audit scope yet because there is no execution candidate.',
              ],
            },
          ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/guarded-execution-launch-workspace should return the tenant-scoped transversal AI guarded execution launch workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/guarded-execution-launch-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          counts: {
            totalAgents: 2,
            readyToLaunchAgents: 0,
            pilotOnlyAgents: 1,
            holdAgents: 1,
            launchCandidateTools: 1,
          },
          agents: [
            {
              agentKey: 'growth-assist-coach',
              title: 'Growth Assist Coach',
              domainKey: 'growth',
              productKey: 'growth',
              currentMode: 'suggestion',
              approvalPolicyKeys: ['growth-assist-suggestion-review'],
              candidateToolKey: 'growth_case_assignment_execution',
              pilotType: 'shadow_review',
              rolloutPhase: 'phase_1',
              simulatedSlaStatus: 'at_risk',
              runbookStatus: 'needs_design',
              rollbackStatus: 'needs_rollback_design',
              auditStatus: 'needs_evidence_design',
              launchStatus: 'pilot_only',
              launchWindow: 'next_window',
              launchOwner: 'growth-assist-suggestion-review',
              safeFallbackMode: 'suggestion_only_with_manual_assignment',
              launchChecklist: [
                'Launch scope stays constrained to growth_case_assignment_execution.',
                'Launch owner resolves through growth-assist-suggestion-review.',
                '1 reviewer-equivalent(s) still need to be staffed before launch.',
                'No reviewed approval request exists yet as launch evidence.',
              ],
              blockingFactors: [
                'Simulated SLA remains at_risk.',
                'Audit evidence still needs tightening before launch.',
                'Rollback path still needs to be finalized before launch.',
              ],
              successSignals: [
                'growth_case_assignment_execution stays inside the named human gate without bypasses.',
                'Fallback mode remains visible and usable by operators.',
                'Same-day review stays stable through the first guarded-execution window.',
              ],
              nextStep:
                'Keep this agent in a narrow pilot path while audit evidence, rollback shape, or reviewer coverage continue to mature.',
              notes: [
                'Current mode stays suggestion.',
                'Launch owner resolves through growth-assist-suggestion-review.',
                'Fallback mode for launch remains suggestion_only_with_manual_assignment.',
                'Launch scope is anchored to growth_case_assignment_execution.',
              ],
            },
            {
              agentKey: 'invoice-document-assistant',
              title: 'Invoice Document Assistant',
              domainKey: 'invoicing',
              productKey: 'invoicing',
              currentMode: 'suggestion',
              approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
              candidateToolKey: null,
              pilotType: 'not_available',
              rolloutPhase: 'phase_2',
              simulatedSlaStatus: 'on_track',
              runbookStatus: 'not_available',
              rollbackStatus: 'not_applicable',
              auditStatus: 'not_applicable',
              launchStatus: 'hold',
              launchWindow: 'defer',
              launchOwner: 'invoice-document-assistant-suggestion-review',
              safeFallbackMode: 'suggestion_only',
              launchChecklist: [
                'No guarded-execution candidate tool exists yet.',
                'Launch owner resolves through invoice-document-assistant-suggestion-review.',
                'Reviewer coverage already matches the guarded-execution posture.',
                '1 reviewed approval request(s) already support the human oversight trail.',
              ],
              blockingFactors: [
                'No SLA blocker is active right now.',
                'Audit evidence still needs tightening before launch.',
                'Rollback path still needs to be finalized before launch.',
              ],
              successSignals: [
                'Suggestion-only operation remains the safe default until a candidate exists.',
                'Fallback mode remains visible and usable by operators.',
                'Same-day review stays stable through the first guarded-execution window.',
              ],
              nextStep:
                'Hold this agent in suggestion mode until a guarded-execution candidate path is concrete and stable.',
              notes: [
                'Current mode stays suggestion.',
                'Launch owner resolves through invoice-document-assistant-suggestion-review.',
                'Fallback mode for launch remains suggestion_only.',
                'There is no launch scope yet because there is no execution candidate.',
              ],
            },
          ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/guarded-execution-monitor-workspace should return the tenant-scoped transversal AI guarded execution monitor workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/guarded-execution-monitor-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          counts: {
            totalAgents: 2,
            readyToMonitorAgents: 0,
            monitorAfterLaunchAgents: 1,
            notApplicableAgents: 1,
            monitorCandidateTools: 1,
          },
          agents: [
            {
              agentKey: 'growth-assist-coach',
              title: 'Growth Assist Coach',
              domainKey: 'growth',
              productKey: 'growth',
              currentMode: 'suggestion',
              approvalPolicyKeys: ['growth-assist-suggestion-review'],
              candidateToolKey: 'growth_case_assignment_execution',
              launchStatus: 'pilot_only',
              launchWindow: 'next_window',
              monitorStatus: 'monitor_after_launch',
              monitorOwner: 'growth-assist-suggestion-review',
              safeFallbackMode: 'suggestion_only_with_manual_assignment',
              watchWindow: 'next_window',
              watchSignals: [
                'growth_case_assignment_execution stays inside the named human gate on every first-window attempt.',
                'Current pending queue starts at 1 request(s) and should not grow through the watch window.',
                'There is no reviewed baseline yet, so operator behavior should be watched more closely.',
              ],
              escalationSignals: [
                'Escalate immediately if the lane still reads at_risk at launch time.',
                '1 missing reviewer-equivalent(s) are still an escalation trigger.',
                'Escalate if fallback to suggestion_only_with_manual_assignment becomes the default path instead of the exception.',
              ],
              rollbackReadinessChecks: [
                'Confirm the rollback owner can disable the execute path without waiting on additional routing.',
                'Confirm growth_case_assignment_execution can fall back to suggestion mode without leaving orphaned operator state.',
                'Confirm rollback events remain visible in the same oversight trail as approvals and review decisions.',
              ],
              nextStep:
                'Keep these watch and escalation signals ready while the lane stays in pilot or next-window status.',
              notes: [
                'Current mode stays suggestion.',
                'Monitor owner resolves through growth-assist-suggestion-review.',
                'Fallback mode for monitoring remains suggestion_only_with_manual_assignment.',
                'Monitoring scope is anchored to growth_case_assignment_execution.',
              ],
            },
            {
              agentKey: 'invoice-document-assistant',
              title: 'Invoice Document Assistant',
              domainKey: 'invoicing',
              productKey: 'invoicing',
              currentMode: 'suggestion',
              approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
              candidateToolKey: null,
              launchStatus: 'hold',
              launchWindow: 'defer',
              monitorStatus: 'not_applicable',
              monitorOwner: 'invoice-document-assistant-suggestion-review',
              safeFallbackMode: 'suggestion_only',
              watchWindow: 'not_scheduled',
              watchSignals: [
                'Suggestion-only mode stays stable while no execute path exists.',
                'Pending approval queue starts at zero and should stay flat through the watch window.',
                '1 reviewed approval decision(s) already give us baseline operator behavior to compare against.',
              ],
              escalationSignals: [
                'Escalate if same-day review drifts from on_track during the first watch window.',
                'Any sudden reviewer-coverage drop is an escalation trigger.',
                'Escalate if fallback to suggestion_only becomes the default path instead of the exception.',
              ],
              rollbackReadinessChecks: [
                'Confirm the rollback owner can disable the execute path without waiting on additional routing.',
                'Confirm suggestion mode remains the only available path until a candidate tool exists.',
                'Confirm rollback events remain visible in the same oversight trail as approvals and review decisions.',
              ],
              nextStep:
                'No launch monitoring is needed yet beyond keeping the agent in suggestion mode.',
              notes: [
                'Current mode stays suggestion.',
                'Monitor owner resolves through invoice-document-assistant-suggestion-review.',
                'Fallback mode for monitoring remains suggestion_only.',
                'There is no monitoring scope yet because there is no execution candidate.',
              ],
            },
          ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/guarded-execution-control-workspace should return the tenant-scoped transversal AI guarded execution control workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/guarded-execution-control-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          counts: {
            totalAgents: 2,
            openLaneAgents: 0,
            pilotThenOpenAgents: 1,
            holdAgents: 1,
            controlCandidateTools: 1,
          },
          agents: [
            {
              agentKey: 'growth-assist-coach',
              title: 'Growth Assist Coach',
              domainKey: 'growth',
              productKey: 'growth',
              currentMode: 'suggestion',
              approvalPolicyKeys: ['growth-assist-suggestion-review'],
              candidateToolKey: 'growth_case_assignment_execution',
              controlStatus: 'pilot_then_open',
              controlWindow: 'next_window',
              launchStatus: 'pilot_only',
              monitorStatus: 'monitor_after_launch',
              controlOwner: 'growth-assist-suggestion-review',
              escalationOwner: 'growth-assist-suggestion-review',
              safeFallbackMode: 'suggestion_only_with_manual_assignment',
              topAction:
                'Keep this lane in pilot while reviewer coverage, evidence, or SLA mature.',
              controlChecklist: [
                'Candidate tool growth_case_assignment_execution stays inside the named lane scope.',
                'Control owner resolves through growth-assist-suggestion-review.',
                'No reviewed approval decision exists yet as operator precedent.',
                '1 reviewer-equivalent(s) still need to be staffed.',
              ],
              guardrails: [
                'Same-day review remains at_risk under the current lane assumptions.',
                'Fallback path remains suggestion_only_with_manual_assignment.',
                'No extra blocked tool posture is constraining this lane beyond the planned scope.',
              ],
              nextStep:
                'Use this control card to keep the lane in pilot until coverage, evidence, and monitoring are strong enough.',
              notes: [
                'Current mode stays suggestion.',
                'Escalation owner resolves through growth-assist-suggestion-review.',
                'Fallback mode for control remains suggestion_only_with_manual_assignment.',
                'Control scope is anchored to growth_case_assignment_execution.',
              ],
            },
            {
              agentKey: 'invoice-document-assistant',
              title: 'Invoice Document Assistant',
              domainKey: 'invoicing',
              productKey: 'invoicing',
              currentMode: 'suggestion',
              approvalPolicyKeys: ['invoice-document-assistant-suggestion-review'],
              candidateToolKey: null,
              controlStatus: 'hold',
              controlWindow: 'defer',
              launchStatus: 'hold',
              monitorStatus: 'not_applicable',
              controlOwner: 'invoice-document-assistant-suggestion-review',
              escalationOwner: 'invoice-document-assistant-suggestion-review',
              safeFallbackMode: 'suggestion_only',
              topAction:
                'Keep the agent in suggestion mode and do not expose an execute path yet.',
              controlChecklist: [
                'No guarded-execution candidate tool exists yet.',
                'Control owner resolves through invoice-document-assistant-suggestion-review.',
                '1 reviewed approval decision(s) already exist as operator precedent.',
                'Reviewer coverage already matches the guarded lane posture.',
              ],
              guardrails: [
                'Same-day review is on track under the current lane assumptions.',
                'Fallback path remains suggestion_only.',
                'No extra blocked tool posture is constraining this lane beyond the planned scope.',
              ],
              nextStep:
                'Hold this agent in suggestion mode until a guarded lane becomes concrete.',
              notes: [
                'Current mode stays suggestion.',
                'Escalation owner resolves through invoice-document-assistant-suggestion-review.',
                'Fallback mode for control remains suggestion_only.',
                'There is no control scope yet because there is no execution candidate.',
              ],
            },
          ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/guarded-execution-event-log-workspace should return the tenant-scoped transversal AI guarded execution event log workspace', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );
    listTenantAiGuardedExecutionEventsUseCase.execute.mockResolvedValueOnce([
      {
        id: 'ai-guarded-event-001',
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        agentKey: 'growth-assist-coach',
        eventType: 'executed',
        approvalRequestId: 'ai-approval-001',
        suggestionRunId: 'ai-run-001',
        toolKey: 'growth_case_assignment_execution',
        caseId: 'op-case-001',
        safeFallbackMode: null,
        summary:
          'Guarded execution completed for growth_case_assignment_execution after approved request ai-approval-001.',
        detail:
          'Operational case op-case-001 is now assigned to hello@saas-platform.dev under the named human gate.',
        occurredAt: new Date('2026-05-20T10:42:00.000Z'),
        createdByUserId: user.id,
        createdByEmail: user.email,
        createdAt: new Date('2026-05-20T10:42:00.000Z'),
      },
      {
        id: 'ai-guarded-event-002',
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        agentKey: 'growth-assist-coach',
        eventType: 'rolled_back',
        approvalRequestId: 'ai-approval-001',
        suggestionRunId: 'ai-run-001',
        toolKey: 'growth_case_assignment_execution',
        caseId: 'op-case-001',
        safeFallbackMode: 'suggestion_only',
        summary:
          'Guarded execution rolled back for growth_case_assignment_execution after approved request ai-approval-001.',
        detail:
          'Operational case op-case-001 returned to explicit human-only handling for hello@saas-platform.dev.',
        occurredAt: new Date('2026-05-20T10:43:00.000Z'),
        createdByUserId: user.id,
        createdByEmail: user.email,
        createdAt: new Date('2026-05-20T10:43:00.000Z'),
      },
    ]);

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/guarded-execution-event-log-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          counts: {
            totalEvents: 8,
            suggestionRunPreparedEvents: 2,
            approvalRequestedEvents: 2,
            approvalReviewedEvents: 1,
            executedEvents: 1,
            rolledBackEvents: 1,
            guardedExecutionStatusEvents: 1,
          },
          entries: [
            {
              id: 'guarded-log:persisted:ai-guarded-event-002',
              tenantSlug: 'saas-platform',
              agentKey: 'growth-assist-coach',
              eventType: 'guarded_execution_rolled_back',
              occurredAt: '2026-05-20T10:43:00.000Z',
              suggestionRunId: 'ai-run-001',
              approvalRequestId: 'ai-approval-001',
              candidateToolKey: 'growth_case_assignment_execution',
              summary:
                'Guarded execution rolled back for growth_case_assignment_execution after approved request ai-approval-001.',
              detail:
                'Operational case op-case-001 returned to explicit human-only handling for hello@saas-platform.dev.',
            },
            {
              id: 'guarded-log:persisted:ai-guarded-event-001',
              tenantSlug: 'saas-platform',
              agentKey: 'growth-assist-coach',
              eventType: 'guarded_execution_executed',
              occurredAt: '2026-05-20T10:42:00.000Z',
              suggestionRunId: 'ai-run-001',
              approvalRequestId: 'ai-approval-001',
              candidateToolKey: 'growth_case_assignment_execution',
              summary:
                'Guarded execution completed for growth_case_assignment_execution after approved request ai-approval-001.',
              detail:
                'Operational case op-case-001 is now assigned to hello@saas-platform.dev under the named human gate.',
            },
            {
              id: 'guarded-log:approval-reviewed:ai-approval-002',
              tenantSlug: 'saas-platform',
              agentKey: 'invoice-document-assistant',
              eventType: 'approval_reviewed',
              occurredAt: '2026-05-20T10:41:00.000Z',
              suggestionRunId: 'ai-run-002',
              approvalRequestId: 'ai-approval-002',
              candidateToolKey: null,
              summary:
                'Invoice Document Assistant approval request ai-approval-002 was approved.',
              detail: 'Se puede usar como guía.',
            },
            {
              id: 'guarded-log:approval-requested:ai-approval-002',
              tenantSlug: 'saas-platform',
              agentKey: 'invoice-document-assistant',
              eventType: 'approval_requested',
              occurredAt: '2026-05-20T10:40:00.000Z',
              suggestionRunId: 'ai-run-002',
              approvalRequestId: 'ai-approval-002',
              candidateToolKey: null,
              summary:
                'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
              detail: 'Necesito revisión antes de usar esta sugerencia documental.',
            },
            {
              id: 'guarded-log:prepared:ai-run-002',
              tenantSlug: 'saas-platform',
              agentKey: 'invoice-document-assistant',
              eventType: 'suggestion_run_prepared',
              occurredAt: '2026-05-20T10:39:00.000Z',
              suggestionRunId: 'ai-run-002',
              approvalRequestId: null,
              candidateToolKey: null,
              summary:
                'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
              detail:
                'Prepared suggestion handoff with invoice-document-assistant-core@v1.',
            },
            {
              id: 'guarded-log:pilot-only:growth-assist-coach:growth_case_assignment_execution',
              tenantSlug: 'saas-platform',
              agentKey: 'growth-assist-coach',
              eventType: 'guarded_execution_pilot_only',
              occurredAt: '2026-05-20T10:38:01.000Z',
              suggestionRunId: null,
              approvalRequestId: null,
              candidateToolKey: 'growth_case_assignment_execution',
              summary:
                'Growth Assist Coach should stay in pilot-only posture for growth_case_assignment_execution.',
              detail:
                'Coverage, evidence, or monitoring still need to mature before opening the guarded lane.',
            },
            {
              id: 'guarded-log:approval-requested:ai-approval-001',
              tenantSlug: 'saas-platform',
              agentKey: 'growth-assist-coach',
              eventType: 'approval_requested',
              occurredAt: '2026-05-20T10:38:00.000Z',
              suggestionRunId: 'ai-run-001',
              approvalRequestId: 'ai-approval-001',
              candidateToolKey: null,
              summary:
                'Growth Assist Coach requested human review for suggestion handoff ai-run-001 under policy growth-assist-suggestion-review.',
              detail: 'Quiero dejar trazable la revisión humana.',
            },
            {
              id: 'guarded-log:prepared:ai-run-001',
              tenantSlug: 'saas-platform',
              agentKey: 'growth-assist-coach',
              eventType: 'suggestion_run_prepared',
              occurredAt: '2026-05-20T10:37:00.000Z',
              suggestionRunId: 'ai-run-001',
              approvalRequestId: null,
              candidateToolKey: null,
              summary:
                'Growth Assist Coach prepared a suggestion-mode handoff for Growth Assist daily agenda using prompt pack growth-assist-coach-core@v1.',
              detail:
                'Prepared suggestion handoff with growth-assist-coach-core@v1.',
            },
          ],
        });
      });
  });

  it('GET /api/ai/tenants/:slug/handoff-workspace should return the tenant-scoped transversal AI handoff workspace summary', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      envelope: {
        ...growthAssistSuggestionRun.envelope,
        agent: {
          key: 'invoice-document-assistant',
          title: 'Invoice Document Assistant',
          summary:
            'Explains and drafts deterministic invoice-document suggestions without mutating fiscal workflow.',
          domainKey: 'invoicing',
          productKey: 'electronic_invoicing_ec',
          availability: 'ready' as const,
          defaultMode: 'suggestion' as const,
          supportedSurfaceKeys: ['invoice_document_drafting_assist'],
        },
        surface: {
          key: 'invoice_document_drafting_assist',
          title: 'Invoice document drafting assist',
          sourceContractKey: 'invoicing.assist.document_drafting',
          sourceGeneratedAt: '2026-05-20T10:36:00.000Z',
        },
        promptPack: {
          key: 'invoice-document-assistant-core',
          version: 'v1',
          agentKey: 'invoice-document-assistant',
          mode: 'suggestion' as const,
          title: 'Invoice Document Assistant Core',
          summary:
            'Prompt pack for tenant-scoped invoice drafting suggestions that stay advisory.',
          objective:
            'Draft safe invoice-document suggestions without replacing deterministic compliance checks.',
          styleGuidance: [
            'Keep recommendations short and grounded in the document context.',
          ],
          constraints: ['Stay in suggestion mode only.'],
          suggestedOutputs: [
            {
              key: 'document_draft_brief',
              label: 'Document draft brief',
              description: 'Summarize the suggested drafting move.',
            },
          ],
        },
        toolAccess: [],
        contextBlocks: [],
      },
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
    };

    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/handoff-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          counts: {
            totalSuggestionRuns: 2,
            reviewableSuggestionRuns: 1,
            pendingApprovalSuggestionRuns: 1,
            approvedSuggestionRuns: 0,
          },
          agentBreakdown: [
            {
              agentKey: 'growth-assist-coach',
              title: 'Growth Assist Coach',
              totalSuggestionRuns: 1,
              reviewableSuggestionRuns: 0,
              pendingApprovalSuggestionRuns: 1,
              approvedSuggestionRuns: 0,
              latestGeneratedAt: '2026-05-20T10:36:00.000Z',
            },
            {
              agentKey: 'invoice-document-assistant',
              title: 'Invoice Document Assistant',
              totalSuggestionRuns: 1,
              reviewableSuggestionRuns: 1,
              pendingApprovalSuggestionRuns: 0,
              approvedSuggestionRuns: 0,
              latestGeneratedAt: '2026-05-20T10:36:00.000Z',
            },
          ],
          recentSuggestionRuns: [
            expect.objectContaining({
              id: 'ai-run-002',
              agentKey: 'invoice-document-assistant',
              promptPackKey: 'invoice-document-assistant-core',
              approvalSummary: {
                status: 'not_requested',
                totalRequests: 0,
                latestRequestId: null,
                latestPolicyKey: null,
                latestRequestedAt: null,
                latestReviewedAt: null,
              },
            }),
            expect.objectContaining({
              id: 'ai-run-001',
              agentKey: 'growth-assist-coach',
              promptPackKey: 'growth-assist-coach-core',
              approvalSummary: {
                status: 'pending',
                totalRequests: 1,
                latestRequestId: 'ai-approval-001',
                latestPolicyKey: 'growth-assist-suggestion-review',
                latestRequestedAt: '2026-05-20T10:38:00.000Z',
                latestReviewedAt: null,
              },
            }),
          ],
        });
      });

    expect(listTenantAiSuggestionRunsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      null,
    );
    expect(listTenantAiSuggestionRunsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice-document-assistant',
      null,
    );
  });

  it('GET /api/ai/tenants/:slug/suggestion-runs/:runId should return one transversal handoff detail for the tenant workspace', async () => {
    getTenantAiSuggestionRunDetailUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string, runId: string) => {
        if (
          agentKey === 'growth-assist-coach' &&
          runId === 'ai-run-001'
        ) {
          return {
            ...growthAssistSuggestionRun,
            approvalRequests: [growthAssistApprovalRequest],
          };
        }

        throw new AiSuggestionRunNotFoundError(runId);
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/suggestion-runs/ai-run-001')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: 'ai-run-001',
            agentKey: 'growth-assist-coach',
            approvalSummary: {
              status: 'pending',
              totalRequests: 1,
              latestRequestId: 'ai-approval-001',
              latestPolicyKey: 'growth-assist-suggestion-review',
              latestRequestedAt: '2026-05-20T10:38:00.000Z',
              latestReviewedAt: null,
            },
            approvalRequests: [
              expect.objectContaining({
                id: 'ai-approval-001',
                suggestionRunId: 'ai-run-001',
                status: 'pending',
              }),
            ],
          }),
        );
      });

    expect(getTenantAiSuggestionRunDetailUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      'ai-run-001',
    );
  });

  it('GET /api/ai/tenants/:slug/agents/:agentKey/suggestion-runs/:runId should return one suggestion run detail with approval timeline', async () => {
    await request(httpServer)
      .get(
        '/api/ai/tenants/saas-platform/agents/growth-assist-coach/suggestion-runs/ai-run-001',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: 'ai-run-001',
            agentKey: 'growth-assist-coach',
            approvalSummary: {
              status: 'pending',
              totalRequests: 1,
              latestRequestId: 'ai-approval-001',
              latestPolicyKey: 'growth-assist-suggestion-review',
              latestRequestedAt: '2026-05-20T10:38:00.000Z',
              latestReviewedAt: null,
            },
            approvalRequests: [
              expect.objectContaining({
                id: 'ai-approval-001',
                suggestionRunId: 'ai-run-001',
                status: 'pending',
              }),
            ],
          }),
        );
      });

    expect(getTenantAiSuggestionRunDetailUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      'ai-run-001',
    );
  });

  it('GET /api/ai/tenants/:slug/agents/:agentKey/approval-requests should return approval request history', async () => {
    await request(httpServer)
      .get(
        '/api/ai/tenants/saas-platform/agents/growth-assist-coach/approval-requests?limit=5&status=pending',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'ai-approval-001',
          tenantSlug: 'saas-platform',
          agentKey: 'growth-assist-coach',
          policyKey: 'growth-assist-suggestion-review',
          scope: 'suggestion_review',
          suggestionRunId: 'ai-run-001',
          requestedByUserId: user.id,
          requestedByEmail: user.email,
          rationale: 'Quiero dejar trazable la revisión humana.',
          summary:
            'Growth Assist Coach requested human review for suggestion handoff ai-run-001 under policy growth-assist-suggestion-review.',
          status: 'pending',
          reviewedAt: null,
          reviewedByUserId: null,
          reviewedByEmail: null,
          reviewNote: null,
          createdAt: '2026-05-20T10:38:00.000Z',
          updatedAt: '2026-05-20T10:38:00.000Z',
        },
      ]);

    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      {
        limit: 5,
        status: 'pending',
      },
    );
  });

  it('GET /api/ai/tenants/:slug/approval-requests should return the tenant-scoped transversal approval workspace', async () => {
    const invoiceApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'pending' as const,
      reviewedAt: null,
      reviewedByUserId: null,
      reviewedByEmail: null,
      reviewNote: null,
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:40:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/approval-requests?limit=5&status=pending')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'ai-approval-002',
          tenantSlug: 'saas-platform',
          agentKey: 'invoice-document-assistant',
          policyKey: 'invoice-document-assistant-suggestion-review',
          scope: 'suggestion_review',
          suggestionRunId: 'ai-run-002',
          requestedByUserId: user.id,
          requestedByEmail: user.email,
          rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
          summary:
            'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
          status: 'pending',
          reviewedAt: null,
          reviewedByUserId: null,
          reviewedByEmail: null,
          reviewNote: null,
          createdAt: '2026-05-20T10:40:00.000Z',
          updatedAt: '2026-05-20T10:40:00.000Z',
        },
        {
          id: 'ai-approval-001',
          tenantSlug: 'saas-platform',
          agentKey: 'growth-assist-coach',
          policyKey: 'growth-assist-suggestion-review',
          scope: 'suggestion_review',
          suggestionRunId: 'ai-run-001',
          requestedByUserId: user.id,
          requestedByEmail: user.email,
          rationale: 'Quiero dejar trazable la revisión humana.',
          summary:
            'Growth Assist Coach requested human review for suggestion handoff ai-run-001 under policy growth-assist-suggestion-review.',
          status: 'pending',
          reviewedAt: null,
          reviewedByUserId: null,
          reviewedByEmail: null,
          reviewNote: null,
          createdAt: '2026-05-20T10:38:00.000Z',
          updatedAt: '2026-05-20T10:38:00.000Z',
        },
      ]);

    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      {
        limit: 5,
        status: 'pending',
      },
    );
    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice-document-assistant',
      {
        limit: 5,
        status: 'pending',
      },
    );
  });

  it('GET /api/ai/tenants/:slug/approval-workspace should return the tenant-scoped transversal approval workspace summary', async () => {
    const invoicePendingApprovalRequest = {
      id: 'ai-approval-002',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-002',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
      status: 'pending' as const,
      reviewedAt: null,
      reviewedByUserId: null,
      reviewedByEmail: null,
      reviewNote: null,
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
      updatedAt: new Date('2026-05-20T10:40:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-003',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-003',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Se revisó una segunda sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-003 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoicePendingApprovalRequest, invoiceReviewedApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/approval-workspace?limit=5&status=pending')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          counts: {
            totalApprovalRequests: 3,
            pendingApprovalRequests: 2,
            approvedApprovalRequests: 1,
            rejectedApprovalRequests: 0,
          },
          agentBreakdown: [
            {
              agentKey: 'growth-assist-coach',
              title: 'Growth Assist Coach',
              totalApprovalRequests: 1,
              pendingApprovalRequests: 1,
              approvedApprovalRequests: 0,
              rejectedApprovalRequests: 0,
              latestRequestedAt: '2026-05-20T10:38:00.000Z',
              latestReviewedAt: null,
            },
            {
              agentKey: 'invoice-document-assistant',
              title: 'Invoice Document Assistant',
              totalApprovalRequests: 2,
              pendingApprovalRequests: 1,
              approvedApprovalRequests: 1,
              rejectedApprovalRequests: 0,
              latestRequestedAt: '2026-05-20T10:40:00.000Z',
              latestReviewedAt: '2026-05-20T10:41:00.000Z',
            },
          ],
          oldestPendingApprovalRequest: {
            id: 'ai-approval-001',
            tenantSlug: 'saas-platform',
            agentKey: 'growth-assist-coach',
            policyKey: 'growth-assist-suggestion-review',
            scope: 'suggestion_review',
            suggestionRunId: 'ai-run-001',
            requestedByUserId: user.id,
            requestedByEmail: user.email,
            rationale: 'Quiero dejar trazable la revisión humana.',
            summary:
              'Growth Assist Coach requested human review for suggestion handoff ai-run-001 under policy growth-assist-suggestion-review.',
            status: 'pending',
            reviewedAt: null,
            reviewedByUserId: null,
            reviewedByEmail: null,
            reviewNote: null,
            createdAt: '2026-05-20T10:38:00.000Z',
            updatedAt: '2026-05-20T10:38:00.000Z',
          },
          latestReviewedApprovalRequest: {
            id: 'ai-approval-003',
            tenantSlug: 'saas-platform',
            agentKey: 'invoice-document-assistant',
            policyKey: 'invoice-document-assistant-suggestion-review',
            scope: 'suggestion_review',
            suggestionRunId: 'ai-run-003',
            requestedByUserId: user.id,
            requestedByEmail: user.email,
            rationale: 'Se revisó una segunda sugerencia documental.',
            summary:
              'Invoice Document Assistant requested human review for suggestion handoff ai-run-003 under policy invoice-document-assistant-suggestion-review.',
            status: 'approved',
            reviewedAt: '2026-05-20T10:41:00.000Z',
            reviewedByUserId: user.id,
            reviewedByEmail: user.email,
            reviewNote: 'Se puede usar como guía.',
            createdAt: '2026-05-20T10:39:00.000Z',
            updatedAt: '2026-05-20T10:41:00.000Z',
          },
          recentApprovalRequests: [
            {
              id: 'ai-approval-002',
              tenantSlug: 'saas-platform',
              agentKey: 'invoice-document-assistant',
              policyKey: 'invoice-document-assistant-suggestion-review',
              scope: 'suggestion_review',
              suggestionRunId: 'ai-run-002',
              requestedByUserId: user.id,
              requestedByEmail: user.email,
              rationale: 'Necesito revisión antes de usar esta sugerencia documental.',
              summary:
                'Invoice Document Assistant requested human review for suggestion handoff ai-run-002 under policy invoice-document-assistant-suggestion-review.',
              status: 'pending',
              reviewedAt: null,
              reviewedByUserId: null,
              reviewedByEmail: null,
              reviewNote: null,
              createdAt: '2026-05-20T10:40:00.000Z',
              updatedAt: '2026-05-20T10:40:00.000Z',
            },
            {
              id: 'ai-approval-001',
              tenantSlug: 'saas-platform',
              agentKey: 'growth-assist-coach',
              policyKey: 'growth-assist-suggestion-review',
              scope: 'suggestion_review',
              suggestionRunId: 'ai-run-001',
              requestedByUserId: user.id,
              requestedByEmail: user.email,
              rationale: 'Quiero dejar trazable la revisión humana.',
              summary:
                'Growth Assist Coach requested human review for suggestion handoff ai-run-001 under policy growth-assist-suggestion-review.',
              status: 'pending',
              reviewedAt: null,
              reviewedByUserId: null,
              reviewedByEmail: null,
              reviewNote: null,
              createdAt: '2026-05-20T10:38:00.000Z',
              updatedAt: '2026-05-20T10:38:00.000Z',
            },
          ],
        });
      });

    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      {
        limit: null,
        status: null,
      },
    );
    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice-document-assistant',
      {
        limit: null,
        status: null,
      },
    );
  });

  it('GET /api/ai/tenants/:slug/operations-summary should return the tenant-scoped transversal AI operations summary', async () => {
    const invoiceSuggestionRun = {
      ...growthAssistSuggestionRun,
      id: 'ai-run-002',
      agentKey: 'invoice-document-assistant',
      surfaceKey: 'invoice_document_drafting_assist',
      sourceContractKey: 'invoicing.assist.document_drafting',
      promptPackKey: 'invoice-document-assistant-core',
      summary:
        'Invoice Document Assistant prepared a suggestion-mode handoff for invoice document drafting using prompt pack invoice-document-assistant-core@v1.',
      suggestedOutputKeys: ['document_draft_brief', 'risk_checklist'],
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
      createdAt: new Date('2026-05-20T10:40:00.000Z'),
    };
    const invoiceReviewedApprovalRequest = {
      id: 'ai-approval-003',
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      agentKey: 'invoice-document-assistant',
      policyKey: 'invoice-document-assistant-suggestion-review',
      scope: 'suggestion_review' as const,
      suggestionRunId: 'ai-run-003',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Se revisó una segunda sugerencia documental.',
      summary:
        'Invoice Document Assistant requested human review for suggestion handoff ai-run-003 under policy invoice-document-assistant-suggestion-review.',
      status: 'approved' as const,
      reviewedAt: new Date('2026-05-20T10:41:00.000Z'),
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se puede usar como guía.',
      createdAt: new Date('2026-05-20T10:39:00.000Z'),
      updatedAt: new Date('2026-05-20T10:41:00.000Z'),
    };

    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceReviewedApprovalRequest, growthAssistApprovalRequest];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistApprovalRequest];
        }

        return [];
      },
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) => {
        if (agentKey === 'invoice-document-assistant') {
          return [invoiceSuggestionRun];
        }

        if (agentKey === 'growth-assist-coach') {
          return [growthAssistSuggestionRun];
        }

        return [];
      },
    );

    await request(httpServer)
      .get('/api/ai/tenants/saas-platform/operations-summary')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual({
          tenantSlug: 'saas-platform',
          generatedAt: expect.any(String),
          actionCenter: {
            tenantSlug: 'saas-platform',
            generatedAt: expect.any(String),
            counts: {
              pendingApprovalRequests: 2,
              reviewableSuggestionRuns: 1,
              reviewedApprovalRequests: 1,
            },
            featuredPendingApprovalRequest: expect.objectContaining({
              id: 'ai-approval-001',
              agentKey: 'growth-assist-coach',
            }),
            featuredReviewableSuggestionRun: expect.objectContaining({
              id: 'ai-run-002',
              agentKey: 'invoice-document-assistant',
            }),
            latestReviewedApprovalRequest: expect.objectContaining({
              id: 'ai-approval-003',
              status: 'approved',
            }),
          },
          handoffWorkspace: {
            counts: {
              totalSuggestionRuns: 2,
              reviewableSuggestionRuns: 1,
              pendingApprovalSuggestionRuns: 1,
              approvedSuggestionRuns: 0,
            },
            agentBreakdown: [
              {
                agentKey: 'growth-assist-coach',
                title: 'Growth Assist Coach',
                totalSuggestionRuns: 1,
                reviewableSuggestionRuns: 0,
                pendingApprovalSuggestionRuns: 1,
                approvedSuggestionRuns: 0,
                latestGeneratedAt: '2026-05-20T10:36:00.000Z',
              },
              {
                agentKey: 'invoice-document-assistant',
                title: 'Invoice Document Assistant',
                totalSuggestionRuns: 1,
                reviewableSuggestionRuns: 1,
                pendingApprovalSuggestionRuns: 0,
                approvedSuggestionRuns: 0,
                latestGeneratedAt: '2026-05-20T10:36:00.000Z',
              },
            ],
            latestSuggestionRun: expect.objectContaining({
              id: 'ai-run-002',
              agentKey: 'invoice-document-assistant',
            }),
          },
          approvalWorkspace: {
            counts: {
              totalApprovalRequests: 3,
              pendingApprovalRequests: 2,
              approvedApprovalRequests: 1,
              rejectedApprovalRequests: 0,
            },
            agentBreakdown: [
              {
                agentKey: 'growth-assist-coach',
                title: 'Growth Assist Coach',
                totalApprovalRequests: 1,
                pendingApprovalRequests: 1,
                approvedApprovalRequests: 0,
                rejectedApprovalRequests: 0,
                latestRequestedAt: '2026-05-20T10:38:00.000Z',
                latestReviewedAt: null,
              },
              {
                agentKey: 'invoice-document-assistant',
                title: 'Invoice Document Assistant',
                totalApprovalRequests: 2,
                pendingApprovalRequests: 1,
                approvedApprovalRequests: 1,
                rejectedApprovalRequests: 0,
                latestRequestedAt: '2026-05-20T10:39:00.000Z',
                latestReviewedAt: '2026-05-20T10:41:00.000Z',
              },
            ],
            oldestPendingApprovalRequest: expect.objectContaining({
              id: 'ai-approval-001',
              agentKey: 'growth-assist-coach',
            }),
            latestReviewedApprovalRequest: expect.objectContaining({
              id: 'ai-approval-003',
              agentKey: 'invoice-document-assistant',
            }),
          },
        });
      });

    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      {
        limit: null,
        status: null,
      },
    );
    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice-document-assistant',
      {
        limit: null,
        status: null,
      },
    );
    expect(listTenantAiSuggestionRunsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      null,
    );
    expect(listTenantAiSuggestionRunsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice-document-assistant',
      null,
    );
  });

  it('POST /api/ai/tenants/:slug/agents/:agentKey/suggestion-runs should prepare an auditable suggestion handoff', async () => {
    await request(httpServer)
      .post('/api/ai/tenants/saas-platform/agents/growth-assist-coach/suggestion-runs')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: 'ai-run-001',
            agentKey: 'growth-assist-coach',
            status: 'prepared',
            promptPackKey: 'growth-assist-coach-core',
            requestedByUserId: user.id,
            requestedByEmail: user.email,
            approvalSummary: {
              status: 'not_requested',
              totalRequests: 0,
              latestRequestId: null,
              latestPolicyKey: null,
              latestRequestedAt: null,
              latestReviewedAt: null,
            },
          }),
        );
      });

    expect(prepareTenantAiSuggestionRunUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      agentKey: 'growth-assist-coach',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
    });
  });

  it('POST /api/ai/tenants/:slug/agents/:agentKey/suggestion-runs/:runId/approval-requests should request human review for a suggestion handoff', async () => {
    await request(httpServer)
      .post(
        '/api/ai/tenants/saas-platform/agents/growth-assist-coach/suggestion-runs/ai-run-001/approval-requests',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        rationale: 'Quiero dejar trazable la revisión humana.',
      })
      .expect(201)
      .expect({
        id: 'ai-approval-001',
        tenantSlug: 'saas-platform',
        agentKey: 'growth-assist-coach',
        policyKey: 'growth-assist-suggestion-review',
        scope: 'suggestion_review',
        suggestionRunId: 'ai-run-001',
        requestedByUserId: user.id,
        requestedByEmail: user.email,
        rationale: 'Quiero dejar trazable la revisión humana.',
        summary:
          'Growth Assist Coach requested human review for suggestion handoff ai-run-001 under policy growth-assist-suggestion-review.',
        status: 'pending',
        reviewedAt: null,
        reviewedByUserId: null,
        reviewedByEmail: null,
        reviewNote: null,
        createdAt: '2026-05-20T10:38:00.000Z',
        updatedAt: '2026-05-20T10:38:00.000Z',
      });

    expect(
      requestTenantAiSuggestionRunApprovalUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      agentKey: 'growth-assist-coach',
      suggestionRunId: 'ai-run-001',
      requestedByUserId: user.id,
      requestedByEmail: user.email,
      rationale: 'Quiero dejar trazable la revisión humana.',
    });
  });

  it('POST /api/ai/tenants/:slug/agents/:agentKey/approval-requests/:requestId/review should approve an approval request', async () => {
    await request(httpServer)
      .post(
        '/api/ai/tenants/saas-platform/agents/growth-assist-coach/approval-requests/ai-approval-001/review',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        status: 'approved',
        reviewNote: 'Se ve segura para uso guiado.',
      })
      .expect(200)
      .expect({
        id: 'ai-approval-001',
        tenantSlug: 'saas-platform',
        agentKey: 'growth-assist-coach',
        policyKey: 'growth-assist-suggestion-review',
        scope: 'suggestion_review',
        suggestionRunId: 'ai-run-001',
        requestedByUserId: user.id,
        requestedByEmail: user.email,
        rationale: 'Quiero dejar trazable la revisión humana.',
        summary:
          'Growth Assist Coach requested human review for suggestion handoff ai-run-001 under policy growth-assist-suggestion-review.',
        status: 'approved',
        reviewedAt: '2026-05-20T10:39:00.000Z',
        reviewedByUserId: user.id,
        reviewedByEmail: user.email,
        reviewNote: 'Se ve segura para uso guiado.',
        createdAt: '2026-05-20T10:38:00.000Z',
        updatedAt: '2026-05-20T10:39:00.000Z',
      });

    expect(reviewTenantAiApprovalRequestUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      agentKey: 'growth-assist-coach',
      requestId: 'ai-approval-001',
      status: 'approved',
      reviewedByUserId: user.id,
      reviewedByEmail: user.email,
      reviewNote: 'Se ve segura para uso guiado.',
    });
  });

  it('POST /api/ai/tenants/:slug/agents/:agentKey/approval-requests/:requestId/guarded-execution should execute the first guarded lane after approved review', async () => {
    listTenantAiApprovalRequestsUseCase.execute.mockResolvedValueOnce([
      {
        ...growthAssistApprovalRequest,
        status: 'approved',
        reviewedAt: new Date('2026-05-20T10:39:00.000Z'),
        reviewedByUserId: user.id,
        reviewedByEmail: user.email,
        reviewNote: 'Se ve segura para uso guiado.',
        updatedAt: new Date('2026-05-20T10:39:00.000Z'),
      },
    ]);

    await request(httpServer)
      .post(
        '/api/ai/tenants/saas-platform/agents/growth-assist-coach/approval-requests/ai-approval-001/guarded-execution',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        caseId: 'op-case-001',
      })
      .expect(200)
      .expect({
        tenantSlug: 'saas-platform',
        agentKey: 'growth-assist-coach',
        approvalRequestId: 'ai-approval-001',
        suggestionRunId: 'ai-run-001',
        toolKey: 'growth_case_assignment_execution',
        executedAt: '2026-05-20T10:12:00.000Z',
        summary:
          'Guarded execution completed for growth_case_assignment_execution after approved request ai-approval-001.',
        detail:
          'Operational case op-case-001 is now assigned to hello@saas-platform.dev under the named human gate.',
        operationalCase: {
          id: 'op-case-001',
          sourceKey: 'alert:retry_queue_ready',
          caseType: 'alert_escalation',
          status: 'in_progress',
          priority: 'warning',
          title: 'Retry queue has ready-now messages',
          summary: '1 failed outbound messages are ready for retry execution now.',
          nextAction:
            'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
          followUpState: null,
          routingPolicyKey: 'growth_ops',
          threadId: null,
          alertKey: 'retry_queue_ready',
          dueAt: '2026-05-20T11:00:00.000Z',
          assignedUserId: 'user_123',
          assignedUserEmail: 'hello@saas-platform.dev',
          createdByUserId: 'user_123',
          createdByEmail: 'hello@saas-platform.dev',
          resolvedAt: null,
          resolvedByUserId: null,
          resolvedByEmail: null,
          createdAt: '2026-05-20T10:05:00.000Z',
          updatedAt: '2026-05-20T10:12:00.000Z',
        },
      });

    expect(listTenantAiApprovalRequestsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'growth-assist-coach',
      {
        limit: null,
        status: null,
      },
    );
    expect(takeTenantGrowthOperationalCaseUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      caseId: 'op-case-001',
      assignedUserId: 'user_123',
      assignedUserEmail: 'hello@saas-platform.dev',
    });
    expect(createTenantAiGuardedExecutionEventUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      agentKey: 'growth-assist-coach',
      eventType: 'executed',
      approvalRequestId: 'ai-approval-001',
      suggestionRunId: 'ai-run-001',
      toolKey: 'growth_case_assignment_execution',
      caseId: 'op-case-001',
      safeFallbackMode: null,
      summary:
        'Guarded execution completed for growth_case_assignment_execution after approved request ai-approval-001.',
      detail:
        'Operational case op-case-001 is now assigned to hello@saas-platform.dev under the named human gate.',
      occurredAt: new Date('2026-05-20T10:12:00.000Z'),
      createdByUserId: 'user_123',
      createdByEmail: 'hello@saas-platform.dev',
    });
  });

  it('POST /api/ai/tenants/:slug/agents/:agentKey/approval-requests/:requestId/guarded-execution-rollback should return the lane to explicit human-only handling', async () => {
    listTenantAiApprovalRequestsUseCase.execute.mockResolvedValueOnce([
      {
        ...growthAssistApprovalRequest,
        status: 'approved',
        reviewedAt: new Date('2026-05-20T10:39:00.000Z'),
        reviewedByUserId: user.id,
        reviewedByEmail: user.email,
        reviewNote: 'Se ve segura para uso guiado.',
        updatedAt: new Date('2026-05-20T10:39:00.000Z'),
      },
    ]);

    await request(httpServer)
      .post(
        '/api/ai/tenants/saas-platform/agents/growth-assist-coach/approval-requests/ai-approval-001/guarded-execution-rollback',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        caseId: 'op-case-001',
      })
      .expect(200)
      .expect({
        tenantSlug: 'saas-platform',
        agentKey: 'growth-assist-coach',
        approvalRequestId: 'ai-approval-001',
        suggestionRunId: 'ai-run-001',
        toolKey: 'growth_case_assignment_execution',
        rolledBackAt: '2026-05-20T10:14:00.000Z',
        safeFallbackMode: 'suggestion_only',
        summary:
          'Guarded execution rolled back for growth_case_assignment_execution after approved request ai-approval-001.',
        detail:
          'Operational case op-case-001 returned to explicit human-only handling for hello@saas-platform.dev.',
        operationalCase: {
          id: 'op-case-001',
          sourceKey: 'alert:retry_queue_ready',
          caseType: 'alert_escalation',
          status: 'open',
          priority: 'warning',
          title: 'Retry queue has ready-now messages',
          summary: '1 failed outbound messages are ready for retry execution now.',
          nextAction:
            'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
          followUpState: null,
          routingPolicyKey: 'growth_ops',
          threadId: null,
          alertKey: 'retry_queue_ready',
          dueAt: '2026-05-20T11:00:00.000Z',
          assignedUserId: null,
          assignedUserEmail: null,
          createdByUserId: 'user_123',
          createdByEmail: 'hello@saas-platform.dev',
          resolvedAt: null,
          resolvedByUserId: null,
          resolvedByEmail: null,
          createdAt: '2026-05-20T10:05:00.000Z',
          updatedAt: '2026-05-20T10:14:00.000Z',
        },
      });

    expect(releaseTenantGrowthOperationalCaseUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      caseId: 'op-case-001',
    });
    expect(createTenantAiGuardedExecutionEventUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      agentKey: 'growth-assist-coach',
      eventType: 'rolled_back',
      approvalRequestId: 'ai-approval-001',
      suggestionRunId: 'ai-run-001',
      toolKey: 'growth_case_assignment_execution',
      caseId: 'op-case-001',
      safeFallbackMode: 'suggestion_only',
      summary:
        'Guarded execution rolled back for growth_case_assignment_execution after approved request ai-approval-001.',
      detail:
        'Operational case op-case-001 returned to explicit human-only handling for hello@saas-platform.dev.',
      occurredAt: new Date('2026-05-20T10:14:00.000Z'),
      createdByUserId: 'user_123',
      createdByEmail: 'hello@saas-platform.dev',
    });
  });

  it('AI guarded execution loop should stay auditable from prepare to rollback', async () => {
    const originalPrepareImplementation =
      prepareTenantAiSuggestionRunUseCase.execute.getMockImplementation();
    const originalRequestApprovalImplementation =
      requestTenantAiSuggestionRunApprovalUseCase.execute.getMockImplementation();
    const originalReviewImplementation =
      reviewTenantAiApprovalRequestUseCase.execute.getMockImplementation();
    const originalListApprovalRequestsImplementation =
      listTenantAiApprovalRequestsUseCase.execute.getMockImplementation();
    const originalListSuggestionRunsImplementation =
      listTenantAiSuggestionRunsUseCase.execute.getMockImplementation();
    const originalTakeOperationalCaseImplementation =
      takeTenantGrowthOperationalCaseUseCase.execute.getMockImplementation();
    const originalReleaseOperationalCaseImplementation =
      releaseTenantGrowthOperationalCaseUseCase.execute.getMockImplementation();
    const originalCreateGuardedEventImplementation =
      createTenantAiGuardedExecutionEventUseCase.execute.getMockImplementation();
    const originalListGuardedEventsImplementation =
      listTenantAiGuardedExecutionEventsUseCase.execute.getMockImplementation();

    let integratedSuggestionRun: {
      [key: string]: any;
      approvalSummary: {
        status: 'not_requested' | 'pending' | 'approved' | 'rejected';
        totalRequests: number;
        latestRequestId: string | null;
        latestPolicyKey: string | null;
        latestRequestedAt: Date | null;
        latestReviewedAt: Date | null;
      };
    } = {
      ...growthAssistSuggestionRun,
      approvalSummary: {
        status: 'not_requested' as const,
        totalRequests: 0,
        latestRequestId: null,
        latestPolicyKey: null,
        latestRequestedAt: null,
        latestReviewedAt: null,
      },
    };
    let integratedApprovalRequest:
      | (typeof growthAssistApprovalRequest & {
          status: 'pending' | 'approved';
          reviewedAt: Date | null;
          reviewedByUserId: string | null;
          reviewedByEmail: string | null;
          reviewNote: string | null;
          updatedAt: Date;
        })
      | null = null;
    let integratedOperationalCase: {
      [key: string]: any;
      status: 'open' | 'in_progress';
      assignedUserId: string | null;
      assignedUserEmail: string | null;
    } = {
      ...growthOperationalCase,
    };
    const integratedGuardedEvents: Awaited<
      ReturnType<typeof createTenantAiGuardedExecutionEventUseCase.execute>
    >[] = [];

    prepareTenantAiSuggestionRunUseCase.execute.mockImplementation(
      async ({ tenantSlug, agentKey, requestedByUserId, requestedByEmail }) => {
        integratedSuggestionRun = {
          ...integratedSuggestionRun,
          tenantSlug,
          agentKey,
          requestedByUserId,
          requestedByEmail,
        };

        return integratedSuggestionRun;
      },
    );
    requestTenantAiSuggestionRunApprovalUseCase.execute.mockImplementation(
      async ({
        tenantSlug,
        agentKey,
        suggestionRunId,
        requestedByUserId,
        requestedByEmail,
        rationale,
      }) => {
        integratedApprovalRequest = {
          ...growthAssistApprovalRequest,
          tenantSlug,
          agentKey,
          suggestionRunId,
          requestedByUserId,
          requestedByEmail,
          rationale,
          status: 'pending',
          reviewedAt: null,
          reviewedByUserId: null,
          reviewedByEmail: null,
          reviewNote: null,
          updatedAt: new Date('2026-05-20T10:38:00.000Z'),
        };
        integratedSuggestionRun = {
          ...integratedSuggestionRun,
          approvalSummary: {
            status: 'pending',
            totalRequests: 1,
            latestRequestId: integratedApprovalRequest.id,
            latestPolicyKey: integratedApprovalRequest.policyKey,
            latestRequestedAt: integratedApprovalRequest.createdAt,
            latestReviewedAt: null,
          },
        };

        return integratedApprovalRequest;
      },
    );
    reviewTenantAiApprovalRequestUseCase.execute.mockImplementation(
      async ({
        tenantSlug,
        agentKey,
        requestId,
        status,
        reviewedByUserId,
        reviewedByEmail,
        reviewNote,
      }) => {
        integratedApprovalRequest = {
          ...(integratedApprovalRequest ?? growthAssistApprovalRequest),
          tenantSlug,
          agentKey,
          id: requestId,
          status,
          reviewedAt: new Date('2026-05-20T10:39:00.000Z'),
          reviewedByUserId,
          reviewedByEmail,
          reviewNote,
          updatedAt: new Date('2026-05-20T10:39:00.000Z'),
        };
        integratedSuggestionRun = {
          ...integratedSuggestionRun,
          approvalSummary: {
            status,
            totalRequests: 1,
            latestRequestId: integratedApprovalRequest.id,
            latestPolicyKey: integratedApprovalRequest.policyKey,
            latestRequestedAt: integratedApprovalRequest.createdAt,
            latestReviewedAt: integratedApprovalRequest.reviewedAt,
          },
        };

        return integratedApprovalRequest;
      },
    );
    listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) =>
        agentKey === 'growth-assist-coach' && integratedApprovalRequest !== null
          ? [integratedApprovalRequest]
          : [],
    );
    listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
      async (_tenantSlug: string, agentKey: string) =>
        agentKey === 'growth-assist-coach' ? [integratedSuggestionRun] : [],
    );
    takeTenantGrowthOperationalCaseUseCase.execute.mockImplementation(
      async ({ assignedUserId, assignedUserEmail }) => {
        integratedOperationalCase = {
          ...integratedOperationalCase,
          status: 'in_progress',
          assignedUserId,
          assignedUserEmail,
          updatedAt: new Date('2026-05-20T10:12:00.000Z'),
        };

        return integratedOperationalCase;
      },
    );
    releaseTenantGrowthOperationalCaseUseCase.execute.mockImplementation(
      async () => {
        integratedOperationalCase = {
          ...integratedOperationalCase,
          status: 'open',
          assignedUserId: null,
          assignedUserEmail: null,
          updatedAt: new Date('2026-05-20T10:14:00.000Z'),
        };

        return integratedOperationalCase;
      },
    );
    createTenantAiGuardedExecutionEventUseCase.execute.mockImplementation(
      async (command) => {
        const persistedEvent = {
          id: `ai-guarded-event-${String(integratedGuardedEvents.length + 1).padStart(3, '0')}`,
          tenantId: tenant.id,
          ...command,
          createdAt: command.occurredAt,
        };
        integratedGuardedEvents.push(persistedEvent);

        return persistedEvent;
      },
    );
    listTenantAiGuardedExecutionEventsUseCase.execute.mockImplementation(
      async () => integratedGuardedEvents,
    );

    try {
      await request(httpServer)
        .post('/api/ai/tenants/saas-platform/agents/growth-assist-coach/suggestion-runs')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(201)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              id: 'ai-run-001',
              approvalSummary: {
                status: 'not_requested',
                totalRequests: 0,
                latestRequestId: null,
                latestPolicyKey: null,
                latestRequestedAt: null,
                latestReviewedAt: null,
              },
            }),
          );
        });

      await request(httpServer)
        .post(
          '/api/ai/tenants/saas-platform/agents/growth-assist-coach/suggestion-runs/ai-run-001/approval-requests',
        )
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          rationale: 'Necesito aprobación antes del primer lane real.',
        })
        .expect(201)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              id: 'ai-approval-001',
              status: 'pending',
              rationale: 'Necesito aprobación antes del primer lane real.',
            }),
          );
        });

      await request(httpServer)
        .post(
          '/api/ai/tenants/saas-platform/agents/growth-assist-coach/approval-requests/ai-approval-001/review',
        )
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          status: 'approved',
          reviewNote: 'Aprobado para el primer lane con human gate.',
        })
        .expect(200)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              id: 'ai-approval-001',
              status: 'approved',
              reviewNote: 'Aprobado para el primer lane con human gate.',
            }),
          );
        });

      await request(httpServer)
        .post(
          '/api/ai/tenants/saas-platform/agents/growth-assist-coach/approval-requests/ai-approval-001/guarded-execution',
        )
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          caseId: 'op-case-001',
        })
        .expect(200)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              approvalRequestId: 'ai-approval-001',
              toolKey: 'growth_case_assignment_execution',
              operationalCase: expect.objectContaining({
                id: 'op-case-001',
                status: 'in_progress',
                assignedUserId: user.id,
              }),
            }),
          );
        });

      await request(httpServer)
        .post(
          '/api/ai/tenants/saas-platform/agents/growth-assist-coach/approval-requests/ai-approval-001/guarded-execution-rollback',
        )
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          caseId: 'op-case-001',
        })
        .expect(200)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              approvalRequestId: 'ai-approval-001',
              safeFallbackMode: 'suggestion_only',
              operationalCase: expect.objectContaining({
                id: 'op-case-001',
                status: 'open',
                assignedUserId: null,
              }),
            }),
          );
        });

      await request(httpServer)
        .get('/api/ai/tenants/saas-platform/guarded-execution-event-log-workspace')
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              tenantSlug: 'saas-platform',
              generatedAt: expect.any(String),
              counts: expect.objectContaining({
                executedEvents: 1,
                rolledBackEvents: 1,
                suggestionRunPreparedEvents: 1,
                approvalRequestedEvents: 1,
                approvalReviewedEvents: 1,
              }),
            }),
          );
          expect(response.body.entries).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                eventType: 'guarded_execution_executed',
                approvalRequestId: 'ai-approval-001',
                candidateToolKey: 'growth_case_assignment_execution',
              }),
              expect.objectContaining({
                eventType: 'guarded_execution_rolled_back',
                approvalRequestId: 'ai-approval-001',
                candidateToolKey: 'growth_case_assignment_execution',
              }),
            ]),
          );
        });

      expect(integratedGuardedEvents).toHaveLength(2);
      expect(listTenantAiGuardedExecutionEventsUseCase.execute).toHaveBeenLastCalledWith(
        'saas-platform',
        {
          agentKeys: ['growth-assist-coach', 'invoice-document-assistant'],
          limit: null,
          eventTypes: null,
        },
      );
    } finally {
      prepareTenantAiSuggestionRunUseCase.execute.mockImplementation(
        originalPrepareImplementation!,
      );
      requestTenantAiSuggestionRunApprovalUseCase.execute.mockImplementation(
        originalRequestApprovalImplementation!,
      );
      reviewTenantAiApprovalRequestUseCase.execute.mockImplementation(
        originalReviewImplementation!,
      );
      listTenantAiApprovalRequestsUseCase.execute.mockImplementation(
        originalListApprovalRequestsImplementation!,
      );
      listTenantAiSuggestionRunsUseCase.execute.mockImplementation(
        originalListSuggestionRunsImplementation!,
      );
      takeTenantGrowthOperationalCaseUseCase.execute.mockImplementation(
        originalTakeOperationalCaseImplementation!,
      );
      releaseTenantGrowthOperationalCaseUseCase.execute.mockImplementation(
        originalReleaseOperationalCaseImplementation!,
      );
      createTenantAiGuardedExecutionEventUseCase.execute.mockImplementation(
        originalCreateGuardedEventImplementation!,
      );
      listTenantAiGuardedExecutionEventsUseCase.execute.mockImplementation(
        originalListGuardedEventsImplementation!,
      );
    }
  });

  it('GET /api/growth/tenants/:slug/conversations/operational-cases should return persisted operational cases', async () => {
    await request(httpServer)
      .get(
        '/api/growth/tenants/saas-platform/conversations/operational-cases?status=open&routingPolicyKey=growth_ops',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'op-case-001',
          sourceKey: 'alert:retry_queue_ready',
          caseType: 'alert_escalation',
          status: 'open',
          priority: 'warning',
          title: 'Retry queue has ready-now messages',
          summary:
            '1 failed outbound messages are ready for retry execution now.',
          nextAction:
            'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
          followUpState: null,
          routingPolicyKey: 'growth_ops',
          threadId: null,
          alertKey: 'retry_queue_ready',
          dueAt: '2026-05-20T11:00:00.000Z',
          assignedUserId: null,
          assignedUserEmail: null,
          createdByUserId: 'user_123',
          createdByEmail: 'hello@saas-platform.dev',
          resolvedAt: null,
          resolvedByUserId: null,
          resolvedByEmail: null,
          createdAt: '2026-05-20T10:05:00.000Z',
          updatedAt: '2026-05-20T10:05:00.000Z',
        },
      ]);

    expect(listTenantGrowthOperationalCasesUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'open',
      'growth_ops',
    );
  });

  it('POST /api/growth/tenants/:slug/conversations/operational-cases should create or reopen one operational case', async () => {
    await request(httpServer)
      .post('/api/growth/tenants/saas-platform/conversations/operational-cases')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        sourceKey: 'alert:retry_queue_ready',
        caseType: 'alert_escalation',
        priority: 'warning',
        title: 'Retry queue has ready-now messages',
        summary: '1 failed outbound messages are ready for retry execution now.',
        nextAction:
          'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
        alertKey: 'retry_queue_ready',
        dueAt: '2026-05-20T11:00:00.000Z',
      })
      .expect(201)
      .expect({
        id: 'op-case-001',
        sourceKey: 'alert:retry_queue_ready',
        caseType: 'alert_escalation',
        status: 'open',
        priority: 'warning',
        title: 'Retry queue has ready-now messages',
        summary: '1 failed outbound messages are ready for retry execution now.',
        nextAction:
          'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
        followUpState: null,
        routingPolicyKey: 'growth_ops',
        threadId: null,
        alertKey: 'retry_queue_ready',
        dueAt: '2026-05-20T11:00:00.000Z',
        assignedUserId: null,
        assignedUserEmail: null,
        createdByUserId: 'user_123',
        createdByEmail: 'hello@saas-platform.dev',
        resolvedAt: null,
        resolvedByUserId: null,
        resolvedByEmail: null,
        createdAt: '2026-05-20T10:05:00.000Z',
        updatedAt: '2026-05-20T10:05:00.000Z',
      });

    expect(createTenantGrowthOperationalCaseUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      sourceKey: 'alert:retry_queue_ready',
      caseType: 'alert_escalation',
      priority: 'warning',
      title: 'Retry queue has ready-now messages',
      summary: '1 failed outbound messages are ready for retry execution now.',
      nextAction:
        'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
      followUpState: null,
      threadId: null,
      alertKey: 'retry_queue_ready',
      dueAt: new Date('2026-05-20T11:00:00.000Z'),
      createdByUserId: 'user_123',
      createdByEmail: 'hello@saas-platform.dev',
    });
  });

  it('POST /api/growth/tenants/:slug/conversations/operational-cases/review-routing should review and escalate overdue cases', async () => {
    await request(httpServer)
      .post(
        '/api/growth/tenants/saas-platform/conversations/operational-cases/review-routing',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201)
      .expect({
        reviewedCount: 2,
        updatedCount: 1,
        escalationReviewCount: 1,
        cases: [
          {
            id: 'op-case-001',
            sourceKey: 'alert:retry_queue_ready',
            caseType: 'ownership_routing',
            status: 'open',
            priority: 'critical',
            title: 'Retry queue has ready-now messages',
            summary:
              '1 failed outbound messages are ready for retry execution now.',
            nextAction:
              'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
            followUpState: null,
            routingPolicyKey: 'escalation_review',
            threadId: null,
            alertKey: 'retry_queue_ready',
            dueAt: '2026-05-20T09:45:00.000Z',
            assignedUserId: null,
            assignedUserEmail: null,
            createdByUserId: 'user_123',
            createdByEmail: 'hello@saas-platform.dev',
            resolvedAt: null,
            resolvedByUserId: null,
            resolvedByEmail: null,
            createdAt: '2026-05-20T10:05:00.000Z',
            updatedAt: '2026-05-20T10:30:00.000Z',
          },
        ],
      });

    expect(
      reviewTenantGrowthOperationalCaseRoutingUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
    });
  });

  it('GET /api/growth/tenants/:slug/conversations/operational-cases/auto-assignment-settings should return the tenant default pack', async () => {
    await request(httpServer)
      .get(
        '/api/growth/tenants/saas-platform/conversations/operational-cases/auto-assignment-settings',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'tenant_123:growth-operational-case-auto-assignment-settings',
        tenantId: 'tenant_123',
        defaultPolicyKey: 'follow_up_first',
        createdAt: '2026-05-20T10:00:00.000Z',
        updatedAt: '2026-05-20T10:32:00.000Z',
      });

    expect(
      getTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform');
  });

  it('PUT /api/growth/tenants/:slug/conversations/operational-cases/auto-assignment-settings should persist the tenant default pack', async () => {
    await request(httpServer)
      .put(
        '/api/growth/tenants/saas-platform/conversations/operational-cases/auto-assignment-settings',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        defaultPolicyKey: 'owner_queue_first',
      })
      .expect(200)
      .expect({
        id: 'tenant_123:growth-operational-case-auto-assignment-settings',
        tenantId: 'tenant_123',
        defaultPolicyKey: 'owner_queue_first',
        createdAt: '2026-05-20T10:00:00.000Z',
        updatedAt: '2026-05-20T10:35:00.000Z',
      });

    expect(
      upsertTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      defaultPolicyKey: 'owner_queue_first',
    });
  });

  it('POST /api/growth/tenants/:slug/conversations/operational-cases/auto-assign should assign eligible cases to operators', async () => {
    await request(httpServer)
      .post(
        '/api/growth/tenants/saas-platform/conversations/operational-cases/auto-assign',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        policyKey: 'owner_queue_first',
      })
      .expect(201)
      .expect({
        policyKey: 'owner_queue_first',
        candidateCount: 2,
        reviewedCount: 2,
        assignedCount: 2,
        threadAssignmentCount: 1,
        inheritedOwnerCount: 1,
        fallbackAssignmentCount: 1,
        cases: [
          {
            id: 'op-case-001',
            sourceKey: 'alert:retry_queue_ready',
            caseType: 'ownership_routing',
            status: 'open',
            priority: 'warning',
            title: 'Retry queue has ready-now messages',
            summary:
              '1 failed outbound messages are ready for retry execution now.',
            nextAction:
              'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
            followUpState: null,
            routingPolicyKey: 'owner_assignment',
            threadId: 'thread_001',
            alertKey: 'retry_queue_ready',
            dueAt: '2026-05-20T11:00:00.000Z',
            assignedUserId: 'user_456',
            assignedUserEmail: 'ops@saas-platform.dev',
            createdByUserId: 'user_123',
            createdByEmail: 'hello@saas-platform.dev',
            resolvedAt: null,
            resolvedByUserId: null,
            resolvedByEmail: null,
            createdAt: '2026-05-20T10:05:00.000Z',
            updatedAt: '2026-05-20T10:25:00.000Z',
          },
          {
            id: 'op-case-002',
            sourceKey: 'thread:thread_002:follow_up',
            caseType: 'follow_up',
            status: 'open',
            priority: 'warning',
            title: 'Retry queue has ready-now messages',
            summary:
              '1 failed outbound messages are ready for retry execution now.',
            nextAction:
              'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
            followUpState: 'pending_team',
            routingPolicyKey: 'follow_up_team',
            threadId: 'thread_002',
            alertKey: 'retry_queue_ready',
            dueAt: '2026-05-20T11:00:00.000Z',
            assignedUserId: 'user_789',
            assignedUserEmail: 'owner@saas-platform.dev',
            createdByUserId: 'user_123',
            createdByEmail: 'hello@saas-platform.dev',
            resolvedAt: null,
            resolvedByUserId: null,
            resolvedByEmail: null,
            createdAt: '2026-05-20T10:05:00.000Z',
            updatedAt: '2026-05-20T10:25:00.000Z',
          },
        ],
      });

    expect(
      autoAssignTenantGrowthOperationalCasesUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      policyKey: 'owner_queue_first',
    });
  });

  it('POST /api/growth/tenants/:slug/conversations/operational-cases/auto-assign should allow the persisted tenant default when no override is sent', async () => {
    await request(httpServer)
      .post(
        '/api/growth/tenants/saas-platform/conversations/operational-cases/auto-assign',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201);

    expect(
      autoAssignTenantGrowthOperationalCasesUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      policyKey: undefined,
    });
  });

  it('POST /api/growth/tenants/:slug/conversations/operational-cases/:caseId/take should assign the case to the current operator', async () => {
    await request(httpServer)
      .post(
        '/api/growth/tenants/saas-platform/conversations/operational-cases/op-case-001/take',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201)
      .expect({
        id: 'op-case-001',
        sourceKey: 'alert:retry_queue_ready',
        caseType: 'alert_escalation',
        status: 'in_progress',
        priority: 'warning',
        title: 'Retry queue has ready-now messages',
        summary: '1 failed outbound messages are ready for retry execution now.',
        nextAction:
          'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
        followUpState: null,
        routingPolicyKey: 'growth_ops',
        threadId: null,
        alertKey: 'retry_queue_ready',
        dueAt: '2026-05-20T11:00:00.000Z',
        assignedUserId: 'user_123',
        assignedUserEmail: 'hello@saas-platform.dev',
        createdByUserId: 'user_123',
        createdByEmail: 'hello@saas-platform.dev',
        resolvedAt: null,
        resolvedByUserId: null,
        resolvedByEmail: null,
        createdAt: '2026-05-20T10:05:00.000Z',
        updatedAt: '2026-05-20T10:12:00.000Z',
      });

    expect(takeTenantGrowthOperationalCaseUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      caseId: 'op-case-001',
      assignedUserId: 'user_123',
      assignedUserEmail: 'hello@saas-platform.dev',
    });
  });

  it('POST /api/growth/tenants/:slug/conversations/operational-cases/:caseId/resolve should resolve one operational case', async () => {
    await request(httpServer)
      .post(
        '/api/growth/tenants/saas-platform/conversations/operational-cases/op-case-001/resolve',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201)
      .expect({
        id: 'op-case-001',
        sourceKey: 'alert:retry_queue_ready',
        caseType: 'alert_escalation',
        status: 'resolved',
        priority: 'warning',
        title: 'Retry queue has ready-now messages',
        summary: '1 failed outbound messages are ready for retry execution now.',
        nextAction:
          'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
        followUpState: null,
        routingPolicyKey: 'growth_ops',
        threadId: null,
        alertKey: 'retry_queue_ready',
        dueAt: '2026-05-20T11:00:00.000Z',
        assignedUserId: 'user_123',
        assignedUserEmail: 'hello@saas-platform.dev',
        createdByUserId: 'user_123',
        createdByEmail: 'hello@saas-platform.dev',
        resolvedAt: '2026-05-20T10:16:00.000Z',
        resolvedByUserId: 'user_123',
        resolvedByEmail: 'hello@saas-platform.dev',
        createdAt: '2026-05-20T10:05:00.000Z',
        updatedAt: '2026-05-20T10:16:00.000Z',
      });

    expect(resolveTenantGrowthOperationalCaseUseCase.execute).toHaveBeenCalledWith(
      {
        tenantSlug: 'saas-platform',
        caseId: 'op-case-001',
        resolvedByUserId: 'user_123',
        resolvedByEmail: 'hello@saas-platform.dev',
      },
    );
  });

  it('POST /api/growth/tenants/:slug/conversations/operational-cases/:caseId/reopen should reopen one operational case', async () => {
    await request(httpServer)
      .post(
        '/api/growth/tenants/saas-platform/conversations/operational-cases/op-case-001/reopen',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201)
      .expect({
        id: 'op-case-001',
        sourceKey: 'alert:retry_queue_ready',
        caseType: 'alert_escalation',
        status: 'open',
        priority: 'warning',
        title: 'Retry queue has ready-now messages',
        summary: '1 failed outbound messages are ready for retry execution now.',
        nextAction:
          'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
        followUpState: null,
        routingPolicyKey: 'growth_ops',
        threadId: null,
        alertKey: 'retry_queue_ready',
        dueAt: '2026-05-20T11:00:00.000Z',
        assignedUserId: null,
        assignedUserEmail: null,
        createdByUserId: 'user_123',
        createdByEmail: 'hello@saas-platform.dev',
        resolvedAt: null,
        resolvedByUserId: null,
        resolvedByEmail: null,
        createdAt: '2026-05-20T10:05:00.000Z',
        updatedAt: '2026-05-20T10:20:00.000Z',
      });

    expect(reopenTenantGrowthOperationalCaseUseCase.execute).toHaveBeenCalledWith(
      {
        tenantSlug: 'saas-platform',
        caseId: 'op-case-001',
      },
    );
  });

  it('POST /api/growth/tenants/:slug/conversations/operational-cases/:caseId/follow-up-state should update one follow-up case state', async () => {
    await request(httpServer)
      .post(
        '/api/growth/tenants/saas-platform/conversations/operational-cases/op-case-001/follow-up-state',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        followUpState: 'waiting_customer',
        nextAction:
          'Esperar respuesta del cliente antes del siguiente outreach.',
      })
      .expect(201)
      .expect({
        id: 'op-case-001',
        sourceKey: 'alert:retry_queue_ready',
        caseType: 'follow_up',
        status: 'in_progress',
        priority: 'warning',
        title: 'Retry queue has ready-now messages',
        summary: '1 failed outbound messages are ready for retry execution now.',
        nextAction:
          'Esperar respuesta del cliente antes del siguiente outreach.',
        followUpState: 'waiting_customer',
        routingPolicyKey: 'follow_up_waiting_customer',
        threadId: 'thread_001',
        alertKey: 'retry_queue_ready',
        dueAt: null,
        assignedUserId: 'user_123',
        assignedUserEmail: 'hello@saas-platform.dev',
        createdByUserId: 'user_123',
        createdByEmail: 'hello@saas-platform.dev',
        resolvedAt: null,
        resolvedByUserId: null,
        resolvedByEmail: null,
        createdAt: '2026-05-20T10:05:00.000Z',
        updatedAt: '2026-05-20T10:13:00.000Z',
      });

    expect(
      updateTenantGrowthOperationalCaseFollowUpStateUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      caseId: 'op-case-001',
      followUpState: 'waiting_customer',
      nextAction:
        'Esperar respuesta del cliente antes del siguiente outreach.',
      dueAt: undefined,
    });
  });

  it('GET /api/growth/tenants/:slug/conversations/:threadId should return one conversation thread', async () => {
    await request(httpServer)
      .get('/api/growth/tenants/saas-platform/conversations/thread_001')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'thread_001',
        tenantId: 'tenant_123',
        leadId: 'lead_001',
        assigneeUserId: null,
        subject: 'Demo de onboarding facturacion',
        channel: 'manual',
        externalConversationId: null,
        participantDisplayName: null,
        participantHandle: null,
        status: 'open',
        latestMessagePreview:
          'Hola Maria, te comparto los siguientes pasos para la demo.',
        messageCount: 2,
        openedAt: '2026-05-15T14:40:00.000Z',
        closedAt: null,
        lastActivityAt: '2026-05-15T14:45:00.000Z',
        createdAt: '2026-05-15T14:40:00.000Z',
        updatedAt: '2026-05-15T14:45:00.000Z',
      });

    expect(getTenantConversationThreadByIdUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'thread_001',
    );
  });

  it('POST /api/growth/tenants/:slug/conversations should create a conversation thread', async () => {
    await request(httpServer)
      .post('/api/growth/tenants/saas-platform/conversations')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        leadId: 'lead_001',
        subject: 'Demo de onboarding facturacion',
        channel: 'manual',
        status: 'open',
      })
      .expect(201)
      .expect({
        id: 'thread_001',
        tenantId: 'tenant_123',
        leadId: 'lead_001',
        assigneeUserId: null,
        subject: 'Demo de onboarding facturacion',
        channel: 'manual',
        externalConversationId: null,
        participantDisplayName: null,
        participantHandle: null,
        status: 'open',
        latestMessagePreview:
          'Hola Maria, te comparto los siguientes pasos para la demo.',
        messageCount: 2,
        openedAt: '2026-05-15T14:40:00.000Z',
        closedAt: null,
        lastActivityAt: '2026-05-15T14:45:00.000Z',
        createdAt: '2026-05-15T14:40:00.000Z',
        updatedAt: '2026-05-15T14:45:00.000Z',
      });

    expect(createTenantConversationThreadUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      leadId: 'lead_001',
      subject: 'Demo de onboarding facturacion',
      channel: 'manual',
      status: 'open',
    });
  });

  it('POST /api/growth/tenants/:slug/conversations/:threadId/assignment should assign one thread owner', async () => {
    await request(httpServer)
      .post('/api/growth/tenants/saas-platform/conversations/thread_whatsapp_001/assignment')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        assigneeUserId: 'user_456',
      })
      .expect(201)
      .expect({
        id: 'thread_whatsapp_001',
        tenantId: 'tenant_123',
        leadId: 'lead_001',
        assigneeUserId: 'user_456',
        subject: 'Maria Perez',
        channel: 'whatsapp',
        externalConversationId: 'wa_conv_001',
        participantDisplayName: 'Maria Perez',
        participantHandle: '+593999111222',
        status: 'open',
        latestMessagePreview: 'Hola, quiero retomar la propuesta.',
        messageCount: 1,
        openedAt: '2026-05-16T14:00:00.000Z',
        closedAt: null,
        lastActivityAt: '2026-05-16T14:00:00.000Z',
        createdAt: '2026-05-16T14:00:00.000Z',
        updatedAt: '2026-05-16T14:10:00.000Z',
      });

    expect(assignTenantConversationThreadUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      threadId: 'thread_whatsapp_001',
      assigneeUserId: 'user_456',
    });
  });

  it('GET /api/growth/tenants/:slug/conversations/:threadId/messages should return conversation messages', async () => {
    await request(httpServer)
      .get('/api/growth/tenants/saas-platform/conversations/thread_001/messages')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'message_001',
          tenantId: 'tenant_123',
          threadId: 'thread_001',
          direction: 'outbound',
          body: 'Hola Maria, te comparto los siguientes pasos para la demo.',
          templateId: null,
          outboundIntentKey: null,
          provider: null,
          deliveryStatus: null,
          externalMessageId: null,
          failureReason: null,
          deliveredAt: null,
          readAt: null,
          createdAt: '2026-05-15T14:40:00.000Z',
        },
        {
          id: 'message_002',
          tenantId: 'tenant_123',
          threadId: 'thread_001',
          direction: 'inbound',
          body: 'Perfecto, quedo atenta a la hora de la llamada.',
          templateId: null,
          outboundIntentKey: null,
          provider: null,
          deliveryStatus: null,
          externalMessageId: null,
          failureReason: null,
          deliveredAt: null,
          readAt: null,
          createdAt: '2026-05-15T14:45:00.000Z',
        },
      ]);

    expect(listTenantConversationMessagesUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'thread_001',
    );
  });

  it('POST /api/growth/tenants/:slug/conversations/:threadId/messages should create a conversation message', async () => {
    await request(httpServer)
      .post('/api/growth/tenants/saas-platform/conversations/thread_001/messages')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        direction: 'outbound',
        body: 'Hola Maria, te comparto los siguientes pasos para la demo.',
      })
      .expect(201)
      .expect({
        id: 'message_001',
        tenantId: 'tenant_123',
        threadId: 'thread_001',
        direction: 'outbound',
        body: 'Hola Maria, te comparto los siguientes pasos para la demo.',
        templateId: null,
        outboundIntentKey: null,
        provider: null,
        deliveryStatus: null,
        externalMessageId: null,
        failureReason: null,
        deliveredAt: null,
        readAt: null,
        createdAt: '2026-05-15T14:40:00.000Z',
      });

    expect(createTenantConversationMessageUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      threadId: 'thread_001',
      direction: 'outbound',
      body: 'Hola Maria, te comparto los siguientes pasos para la demo.',
      externalMessageId: undefined,
    });
  });

  it('GET /api/growth/tenants/:slug/conversations should require conversation read permission', async () => {
    resolveTenantAccessUseCase.execute.mockResolvedValueOnce({
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      userId: 'user_456',
      membershipId: 'membership_456',
      membershipStatus: MembershipStatus.Active,
      roleKeys: ['tenant_member'],
      permissionKeys: [TENANT_PERMISSIONS.READ],
    });

    await request(httpServer)
      .get('/api/growth/tenants/saas-platform/conversations')
      .set('Authorization', `Bearer ${memberToken}`)
      .expect(403)
      .expect({
        statusCode: 403,
        message:
          'Permission "growth.conversations.read" is required for this tenant resource.',
        error: 'Forbidden',
      });
  });

  it('GET /api/growth/tenants/:slug/conversations/whatsapp-inbox should return whatsapp conversation threads', async () => {
    await request(httpServer)
      .get('/api/growth/tenants/saas-platform/conversations/whatsapp-inbox')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'thread_whatsapp_001',
          tenantId: 'tenant_123',
          leadId: 'lead_001',
          assigneeUserId: null,
          subject: 'Maria Perez',
          channel: 'whatsapp',
          externalConversationId: 'wa_conv_001',
          participantDisplayName: 'Maria Perez',
          participantHandle: '+593999111222',
          status: 'open',
          latestMessagePreview: 'Hola, quiero retomar la propuesta.',
          messageCount: 1,
          openedAt: '2026-05-16T14:00:00.000Z',
          closedAt: null,
          lastActivityAt: '2026-05-16T14:00:00.000Z',
          createdAt: '2026-05-16T14:00:00.000Z',
          updatedAt: '2026-05-16T14:00:00.000Z',
        },
      ]);

    expect(
      listTenantWhatsappConversationThreadsUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform');
  });

  it('GET /api/growth/tenants/:slug/conversations/whatsapp-templates should return whatsapp message templates', async () => {
    await request(httpServer)
      .get('/api/growth/tenants/saas-platform/conversations/whatsapp-templates')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'template_001',
          tenantId: 'tenant_123',
          key: 'follow_up_demo',
          name: 'Follow Up Demo',
          languageCode: 'es_EC',
          category: 'utility',
          bodyTemplate: 'Hola {{firstName}}, retomamos la demo de {{product}}.',
          intentKey: 'follow_up',
          providerTemplateName: 'follow_up_demo_meta',
          providerApprovalStatus: 'approved',
          status: 'active',
          createdAt: '2026-05-18T15:30:00.000Z',
          updatedAt: '2026-05-18T15:30:00.000Z',
        },
      ]);

    expect(listTenantWhatsappMessageTemplatesUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/growth/tenants/:slug/conversations/whatsapp-automations should return whatsapp automation rules', async () => {
    await request(httpServer)
      .get('/api/growth/tenants/saas-platform/conversations/whatsapp-automations')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'automation_001',
          tenantId: 'tenant_123',
          key: 'follow_up_unassigned',
          name: 'Follow Up Unassigned',
          triggerEvent: 'inbound_message',
          matchOutboundIntentKey: 'follow_up',
          matchDeliveryStatus: null,
          matchAssigneeMode: 'unassigned',
          templateId: 'template_001',
          actionType: 'suggest_template',
          actionOutboundIntentKey: 'follow_up',
          status: 'active',
          createdAt: '2026-05-18T15:40:00.000Z',
          updatedAt: '2026-05-18T15:40:00.000Z',
        },
      ]);

    expect(listTenantWhatsappAutomationRulesUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/growth/tenants/:slug/conversations/whatsapp-templates/:templateId should return one whatsapp message template', async () => {
    await request(httpServer)
      .get(
        '/api/growth/tenants/saas-platform/conversations/whatsapp-templates/template_001',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'template_001',
        tenantId: 'tenant_123',
        key: 'follow_up_demo',
        name: 'Follow Up Demo',
        languageCode: 'es_EC',
        category: 'utility',
        bodyTemplate: 'Hola {{firstName}}, retomamos la demo de {{product}}.',
        intentKey: 'follow_up',
        providerTemplateName: 'follow_up_demo_meta',
        providerApprovalStatus: 'approved',
        status: 'active',
        createdAt: '2026-05-18T15:30:00.000Z',
        updatedAt: '2026-05-18T15:30:00.000Z',
      });

    expect(getTenantWhatsappMessageTemplateByIdUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'template_001',
    );
  });

  it('GET /api/growth/tenants/:slug/conversations/whatsapp-automations/:automationId should return one whatsapp automation rule', async () => {
    await request(httpServer)
      .get(
        '/api/growth/tenants/saas-platform/conversations/whatsapp-automations/automation_001',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'automation_001',
        tenantId: 'tenant_123',
        key: 'follow_up_unassigned',
        name: 'Follow Up Unassigned',
        triggerEvent: 'inbound_message',
        matchOutboundIntentKey: 'follow_up',
        matchDeliveryStatus: null,
        matchAssigneeMode: 'unassigned',
        templateId: 'template_001',
        actionType: 'suggest_template',
        actionOutboundIntentKey: 'follow_up',
        status: 'active',
        createdAt: '2026-05-18T15:40:00.000Z',
        updatedAt: '2026-05-18T15:40:00.000Z',
      });

    expect(getTenantWhatsappAutomationRuleByIdUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'automation_001',
    );
  });

  it('POST /api/growth/tenants/:slug/conversations/whatsapp-templates should create one whatsapp message template', async () => {
    await request(httpServer)
      .post('/api/growth/tenants/saas-platform/conversations/whatsapp-templates')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        key: 'follow_up_demo',
        name: 'Follow Up Demo',
        languageCode: 'es_EC',
        category: 'utility',
        bodyTemplate: 'Hola {{firstName}}, retomamos la demo de {{product}}.',
        intentKey: 'follow_up',
        providerTemplateName: 'follow_up_demo_meta',
        providerApprovalStatus: 'approved',
      })
      .expect(201)
      .expect({
        id: 'template_001',
        tenantId: 'tenant_123',
        key: 'follow_up_demo',
        name: 'Follow Up Demo',
        languageCode: 'es_EC',
        category: 'utility',
        bodyTemplate: 'Hola {{firstName}}, retomamos la demo de {{product}}.',
        intentKey: 'follow_up',
        providerTemplateName: 'follow_up_demo_meta',
        providerApprovalStatus: 'approved',
        status: 'active',
        createdAt: '2026-05-18T15:30:00.000Z',
        updatedAt: '2026-05-18T15:30:00.000Z',
      });

    expect(createTenantWhatsappMessageTemplateUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      key: 'follow_up_demo',
      name: 'Follow Up Demo',
      languageCode: 'es_EC',
      category: 'utility',
      bodyTemplate: 'Hola {{firstName}}, retomamos la demo de {{product}}.',
      intentKey: 'follow_up',
      providerTemplateName: 'follow_up_demo_meta',
      providerApprovalStatus: 'approved',
    });
  });

  it('POST /api/growth/tenants/:slug/conversations/whatsapp-automations should create one whatsapp automation rule', async () => {
    await request(httpServer)
      .post('/api/growth/tenants/saas-platform/conversations/whatsapp-automations')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        key: 'follow_up_unassigned',
        name: 'Follow Up Unassigned',
        triggerEvent: 'inbound_message',
        matchOutboundIntentKey: 'follow_up',
        matchAssigneeMode: 'unassigned',
        templateId: 'template_001',
        actionOutboundIntentKey: 'follow_up',
      })
      .expect(201)
      .expect({
        id: 'automation_001',
        tenantId: 'tenant_123',
        key: 'follow_up_unassigned',
        name: 'Follow Up Unassigned',
        triggerEvent: 'inbound_message',
        matchOutboundIntentKey: 'follow_up',
        matchDeliveryStatus: null,
        matchAssigneeMode: 'unassigned',
        templateId: 'template_001',
        actionType: 'suggest_template',
        actionOutboundIntentKey: 'follow_up',
        status: 'active',
        createdAt: '2026-05-18T15:40:00.000Z',
        updatedAt: '2026-05-18T15:40:00.000Z',
      });

    expect(createTenantWhatsappAutomationRuleUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      key: 'follow_up_unassigned',
      name: 'Follow Up Unassigned',
      triggerEvent: 'inbound_message',
      matchOutboundIntentKey: 'follow_up',
      matchDeliveryStatus: undefined,
      matchAssigneeMode: 'unassigned',
      templateId: 'template_001',
      actionOutboundIntentKey: 'follow_up',
    });
  });

  it('GET /api/growth/tenants/:slug/conversations/whatsapp-inbox?assigneeUserId=:userId should forward the assignee filter', async () => {
    await request(httpServer)
      .get(
        '/api/growth/tenants/saas-platform/conversations/whatsapp-inbox?assigneeUserId=user_456',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(
      listTenantWhatsappConversationThreadsUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform', 'user_456');
  });

  it('POST /api/growth/tenants/:slug/conversations/whatsapp-inbox/messages should ingest an inbound whatsapp message', async () => {
    await request(httpServer)
      .post('/api/growth/tenants/saas-platform/conversations/whatsapp-inbox/messages')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        externalConversationId: 'wa_conv_001',
        participantHandle: '+593999111222',
        participantDisplayName: 'Maria Perez',
        leadId: 'lead_001',
        body: 'Hola, quiero retomar la propuesta.',
        externalMessageId: 'wamid-001',
        occurredAt: '2026-05-16T14:00:00.000Z',
      })
      .expect(201)
      .expect({
        createdThread: true,
        thread: {
          id: 'thread_whatsapp_001',
          tenantId: 'tenant_123',
          leadId: 'lead_001',
          assigneeUserId: null,
          subject: 'Maria Perez',
          channel: 'whatsapp',
          externalConversationId: 'wa_conv_001',
          participantDisplayName: 'Maria Perez',
          participantHandle: '+593999111222',
          status: 'open',
          latestMessagePreview: 'Hola, quiero retomar la propuesta.',
          messageCount: 1,
          openedAt: '2026-05-16T14:00:00.000Z',
          closedAt: null,
          lastActivityAt: '2026-05-16T14:00:00.000Z',
          createdAt: '2026-05-16T14:00:00.000Z',
          updatedAt: '2026-05-16T14:00:00.000Z',
        },
        message: {
          id: 'message_whatsapp_001',
          tenantId: 'tenant_123',
          threadId: 'thread_whatsapp_001',
          direction: 'inbound',
          body: 'Hola, quiero retomar la propuesta.',
          templateId: null,
          outboundIntentKey: null,
          provider: 'meta_cloud_api_stub',
          deliveryStatus: 'delivered',
          externalMessageId: 'wamid-001',
          failureReason: null,
          deliveredAt: '2026-05-16T14:00:10.000Z',
          readAt: null,
          createdAt: '2026-05-16T14:00:00.000Z',
        },
      });

    expect(
      ingestTenantWhatsappConversationMessageUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      externalConversationId: 'wa_conv_001',
      participantHandle: '+593999111222',
      participantDisplayName: 'Maria Perez',
      leadId: 'lead_001',
      body: 'Hola, quiero retomar la propuesta.',
      externalMessageId: 'wamid-001',
      occurredAt: new Date('2026-05-16T14:00:00.000Z'),
    });
    expect(
      executeTenantWhatsappAutomationActionsUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      threadId: 'thread_whatsapp_001',
      triggerEvent: 'inbound_message',
      triggerMessageId: 'message_whatsapp_001',
      triggerExternalMessageId: 'wamid-001',
      executionKey: 'wamid-001',
      occurredAt: new Date('2026-05-16T14:00:00.000Z'),
    });
  });

  it('POST /api/growth/tenants/:slug/conversations/whatsapp-inbox/:threadId/outbound-messages should create a whatsapp outbound message', async () => {
    await request(httpServer)
      .post(
        '/api/growth/tenants/saas-platform/conversations/whatsapp-inbox/thread_whatsapp_001/outbound-messages',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        templateId: 'template_001',
        templateVariables: {
          firstName: 'Maria',
          product: 'facturacion',
        },
        outboundIntentKey: 'follow_up',
        externalMessageId: 'wamid-002',
        occurredAt: '2026-05-16T14:05:00.000Z',
      })
      .expect(201)
      .expect({
        id: 'message_whatsapp_002',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_001',
        direction: 'outbound',
        body: 'Perfecto, te escribo en unos minutos.',
        templateId: 'template_001',
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'pending',
        externalMessageId: 'wamid-002',
        failureReason: null,
        deliveredAt: null,
        readAt: null,
        createdAt: '2026-05-16T14:05:00.000Z',
      });

    expect(sendTenantWhatsappConversationMessageUseCase.execute).toHaveBeenCalledWith(
      {
        tenantSlug: 'saas-platform',
        threadId: 'thread_whatsapp_001',
        body: undefined,
        templateId: 'template_001',
        templateVariables: {
          firstName: 'Maria',
          product: 'facturacion',
        },
        outboundIntentKey: 'follow_up',
        externalMessageId: 'wamid-002',
        occurredAt: new Date('2026-05-16T14:05:00.000Z'),
      },
    );
  });

  it('GET /api/growth/tenants/:slug/conversations/:threadId/whatsapp-automation-suggestions should return suggestions for one whatsapp thread', async () => {
    await request(httpServer)
      .get(
        '/api/growth/tenants/saas-platform/conversations/thread_whatsapp_001/whatsapp-automation-suggestions',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        tenantSlug: 'saas-platform',
        threadId: 'thread_whatsapp_001',
        generatedAt: '2026-05-19T09:00:00.000Z',
        suggestions: [
          {
            ruleId: 'automation_001',
            ruleKey: 'follow_up_unassigned',
            ruleName: 'Follow Up Unassigned',
            triggerEvent: 'inbound_message',
            actionType: 'suggest_template',
            actionOutboundIntentKey: 'follow_up',
            templateId: 'template_001',
            templateKey: 'follow_up_demo',
            templateName: 'Follow Up Demo',
            providerTemplateName: 'follow_up_demo_meta',
            providerApprovalStatus: 'approved',
            bodyTemplatePreview:
              'Hola {{firstName}}, retomamos la demo de {{product}}.',
          },
        ],
      });

    expect(
      getTenantWhatsappAutomationSuggestionsUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform', 'thread_whatsapp_001');
  });

  it('POST /api/growth/tenants/:slug/conversations/whatsapp-inbox/delivery-events should update whatsapp delivery state', async () => {
    await request(httpServer)
      .post('/api/growth/tenants/saas-platform/conversations/whatsapp-inbox/delivery-events')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        externalMessageId: 'wamid-002',
        deliveryStatus: 'delivered',
        occurredAt: '2026-05-16T14:06:00.000Z',
      })
      .expect(201)
      .expect({
        id: 'message_whatsapp_002',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_001',
        direction: 'outbound',
        body: 'Perfecto, te escribo en unos minutos.',
        templateId: null,
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'delivered',
        externalMessageId: 'wamid-002',
        failureReason: null,
        deliveredAt: '2026-05-16T14:06:00.000Z',
        readAt: null,
        createdAt: '2026-05-16T14:05:00.000Z',
      });

    expect(ingestTenantWhatsappDeliveryEventUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      externalMessageId: 'wamid-002',
      deliveryStatus: 'delivered',
      provider: undefined,
      providerEventId: undefined,
      payloadJson: undefined,
      eventKey: undefined,
      failureReason: undefined,
      providerStatusDetail: undefined,
      providerConversationCategory: undefined,
      providerPricingCategory: undefined,
      providerErrorCode: undefined,
      occurredAt: new Date('2026-05-16T14:06:00.000Z'),
    });
    expect(
      executeTenantWhatsappAutomationActionsUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      threadId: 'thread_whatsapp_001',
      triggerEvent: 'delivery_status_changed',
      triggerMessageId: 'message_whatsapp_002',
      triggerExternalMessageId: 'wamid-002',
      triggerDeliveryStatus: 'delivered',
      executionKey: 'wamid-002:delivered',
      occurredAt: new Date('2026-05-16T14:06:00.000Z'),
    });
  });

  it('GET /api/growth/tenants/:slug/conversations/:threadId/messages/:messageId/delivery-events should return delivery events for one message', async () => {
    await request(httpServer)
      .get(
        '/api/growth/tenants/saas-platform/conversations/thread_whatsapp_001/messages/message_whatsapp_002/delivery-events',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'delivery_event_001',
          tenantId: 'tenant_123',
          messageId: 'message_whatsapp_002',
          provider: 'meta_cloud_api_stub',
          eventKey: 'wamid-002:delivered:0:0:0',
          providerEventId: 'status:wamid-002',
          externalMessageId: 'wamid-002',
          deliveryStatus: 'delivered',
          failureReason: null,
          providerStatusDetail: 'conversation:service;pricing:utility',
          providerConversationCategory: 'service',
          providerPricingCategory: 'utility',
          providerErrorCode: null,
          payloadJson: '{"status":"delivered"}',
          occurredAt: '2026-05-16T14:06:00.000Z',
          createdAt: '2026-05-16T14:06:00.000Z',
        },
      ]);

    expect(
      listTenantConversationMessageDeliveryEventsUseCase.execute,
    ).toHaveBeenCalledWith(
      'saas-platform',
      'thread_whatsapp_001',
      'message_whatsapp_002',
    );
  });

  it('POST /api/growth/tenants/:slug/conversations/:threadId/messages/:messageId/retry should retry a ready-now failed whatsapp message', async () => {
    retryTenantWhatsappFailedConversationMessageUseCase.execute.mockResolvedValueOnce(
      retriedOutboundWhatsappMessage,
    );

    await request(httpServer)
      .post(
        '/api/growth/tenants/saas-platform/conversations/thread_whatsapp_001/messages/message_whatsapp_002/retry',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        occurredAt: '2026-05-16T14:12:00.000Z',
      })
      .expect(201)
      .expect({
        id: 'message_whatsapp_003',
        tenantId: 'tenant_123',
        threadId: 'thread_whatsapp_001',
        direction: 'outbound',
        body: 'Perfecto, te escribo en unos minutos.',
        templateId: null,
        outboundIntentKey: 'follow_up',
        provider: 'meta_cloud_api_stub',
        deliveryStatus: 'pending',
        externalMessageId: 'wamid-003',
        failureReason: null,
        deliveredAt: null,
        readAt: null,
        createdAt: '2026-05-16T14:12:00.000Z',
      });

    expect(
      retryTenantWhatsappFailedConversationMessageUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      threadId: 'thread_whatsapp_001',
      messageId: 'message_whatsapp_002',
      occurredAt: new Date('2026-05-16T14:12:00.000Z'),
    });
  });

  it('GET /api/growth/tenants/:slug/opportunities should return tenant-scoped opportunities', async () => {
    await request(httpServer)
      .get('/api/growth/tenants/saas-platform/opportunities')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'opportunity_001',
          tenantId: 'tenant_123',
          leadId: 'lead_001',
          threadId: 'thread_001',
          assigneeUserId: null,
          title: 'Onboarding anual facturacion electronica',
          stage: 'proposal',
          amountInCents: 199000,
          currency: 'USD',
          notes: 'Cliente con alto interes y decision esta semana.',
          closedAt: null,
          createdAt: '2026-05-15T15:00:00.000Z',
          updatedAt: '2026-05-15T15:20:00.000Z',
        },
      ]);

    expect(listTenantOpportunitiesUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/growth/tenants/:slug/opportunities?assigneeUserId=:userId should forward the assignee filter', async () => {
    await request(httpServer)
      .get('/api/growth/tenants/saas-platform/opportunities?assigneeUserId=user_456')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200);

    expect(listTenantOpportunitiesUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'user_456',
    );
  });

  it('GET /api/growth/tenants/:slug/assignment-workload should return workload analytics', async () => {
    await request(httpServer)
      .get('/api/growth/tenants/saas-platform/assignment-workload')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        tenantSlug: 'saas-platform',
        generatedAt: '2026-05-18T16:00:00.000Z',
        totals: {
          openThreadCount: 2,
          unassignedOpenThreadCount: 1,
          openOpportunityCount: 2,
          unassignedOpenOpportunityCount: 1,
          openOpportunityAmountInCents: 289000,
        },
        assignees: [
          {
            userId: 'user_456',
            displayName: 'Maria Sales',
            email: 'sales@saas-platform.dev',
            openThreadCount: 1,
            openWhatsappThreadCount: 1,
            openManualThreadCount: 0,
            openOpportunityCount: 1,
            openOpportunityAmountInCents: 199000,
            wonOpportunityCount: 0,
            lostOpportunityCount: 0,
          },
          {
            userId: 'user_123',
            displayName: 'Jorge',
            email: 'hello@saas-platform.dev',
            openThreadCount: 0,
            openWhatsappThreadCount: 0,
            openManualThreadCount: 0,
            openOpportunityCount: 0,
            openOpportunityAmountInCents: 0,
            wonOpportunityCount: 0,
            lostOpportunityCount: 0,
          },
        ],
      });

    expect(getTenantGrowthAssignmentWorkloadUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/growth/tenants/:slug/conversations/whatsapp-reporting/outbound-summary should return outbound reporting analytics', async () => {
    await request(httpServer)
      .get(
        '/api/growth/tenants/saas-platform/conversations/whatsapp-reporting/outbound-summary',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        tenantSlug: 'saas-platform',
        generatedAt: '2026-05-18T16:30:00.000Z',
        totals: {
          outboundMessageCount: 3,
          freeformMessageCount: 1,
          templateMessageCount: 2,
          approvedTemplateMessageCount: 1,
          pendingCount: 1,
          sentCount: 0,
          deliveredCount: 1,
          readCount: 0,
          failedCount: 1,
          immediateSendRejectionFailedCount: 1,
          asynchronousDeliveryFailedCount: 0,
          retryableFailedCount: 1,
          permanentFailedCount: 0,
        },
        byIntent: [
          {
            outboundIntentKey: 'follow_up',
            messageCount: 2,
            pendingCount: 1,
            sentCount: 0,
            deliveredCount: 1,
            readCount: 0,
            failedCount: 0,
          },
          {
            outboundIntentKey: 'renewal_offer',
            messageCount: 1,
            pendingCount: 0,
            sentCount: 0,
            deliveredCount: 0,
            readCount: 0,
            failedCount: 1,
          },
        ],
        byTemplate: [
          {
            templateId: 'template_001',
            templateKey: 'follow_up_demo',
            templateName: 'Follow Up Demo',
            providerTemplateName: 'follow_up_demo_meta',
            providerApprovalStatus: 'approved',
            messageCount: 1,
            pendingCount: 1,
            sentCount: 0,
            deliveredCount: 0,
            readCount: 0,
            failedCount: 0,
          },
          {
            templateId: 'template_002',
            templateKey: 'renewal_offer_demo',
            templateName: 'Renewal Offer Demo',
            providerTemplateName: 'renewal_offer_demo_meta',
            providerApprovalStatus: 'pending_review',
            messageCount: 1,
            pendingCount: 0,
            sentCount: 0,
            deliveredCount: 0,
            readCount: 0,
            failedCount: 1,
          },
        ],
        byProvider: [
          {
            provider: 'meta_cloud_api_stub',
            messageCount: 2,
            pendingCount: 1,
            sentCount: 0,
            deliveredCount: 1,
            readCount: 0,
            failedCount: 0,
          },
          {
            provider: 'meta_cloud_api',
            messageCount: 1,
            pendingCount: 0,
            sentCount: 0,
            deliveredCount: 0,
            readCount: 0,
            failedCount: 1,
          },
        ],
        byFailureClass: [
          {
            provider: 'meta_cloud_api',
            failureClass: 'rate_limited',
            failurePhase: 'immediate_send_rejection',
            messageCount: 1,
            retryableCount: 1,
            permanentCount: 0,
          },
        ],
        byProviderTaxonomy: [
          {
            provider: 'meta_cloud_api',
            providerTaxonomyFamily: 'throughput_limit',
            providerTaxonomyDetail: 'meta_pair_rate_limit',
            failureClass: 'rate_limited',
            failurePhase: 'immediate_send_rejection',
            messageCount: 1,
            retryableCount: 1,
            permanentCount: 0,
          },
        ],
        topProviderErrorCodes: [
          {
            provider: 'meta_cloud_api',
            providerErrorCode: '131053',
            failureClass: 'rate_limited',
            failurePhase: 'immediate_send_rejection',
            retryDisposition: 'retryable',
            providerTaxonomyFamily: 'throughput_limit',
            providerTaxonomyDetail: 'meta_pair_rate_limit',
            occurrenceCount: 1,
            latestFailureReason: 'rate_limit_hit',
            latestProviderStatusDetail: 'temporary_throttle',
          },
        ],
        retryOperations: {
          totalFailedMessageCount: 1,
          retryableFailedMessageCount: 1,
          permanentFailedMessageCount: 0,
          cooldownBlockedCount: 0,
          readyNowCount: 1,
          defaultBaseBackoffMinutes: 5,
          maxBackoffMinutes: 180,
        },
        operationalThresholds: {
          immediateSendRejectionRateWarning: 0.05,
          asynchronousDeliveryFailureRateWarning: 0.03,
          readyRetryQueueWarningCount: 1,
          cooldownRetryQueueWarningCount: 3,
          authOrConfigurationCriticalCount: 1,
          policyBlockCriticalCount: 1,
          rateLimitedWarningCount: 1,
          unknownFailureWarningCount: 1,
        },
        operationalDashboard: {
          overallStatus: 'warning',
          immediateSendRejectionRate: 0.3333,
          asynchronousDeliveryFailureRate: 0,
          readyRetryQueueCount: 1,
          cooldownRetryQueueCount: 0,
          permanentFailureCount: 0,
          leadingFailureClass: 'rate_limited',
          leadingProvider: 'meta_cloud_api',
          leadingProviderTaxonomyFamily: 'throughput_limit',
          leadingProviderTaxonomyDetail: 'meta_pair_rate_limit',
        },
        operationalAlerts: [
          {
            key: 'immediate_send_rejection_rate',
            severity: 'warning',
            title: 'Immediate send rejection rate is elevated',
            summary:
              'Immediate outbound rejections reached 33.33% of outbound traffic.',
            thresholdKey: 'immediateSendRejectionRateWarning',
            observedValue: 0.3333,
            thresholdValue: 0.05,
            thresholdUnit: 'rate',
            provider: 'meta_cloud_api',
            failureClass: 'rate_limited',
            providerTaxonomyFamily: 'throughput_limit',
            providerTaxonomyDetail: 'meta_pair_rate_limit',
            affectedMessageCount: 1,
            recommendedAction:
              'Inspect provider-facing failures before throughput or template automation keeps amplifying the rejection rate.',
          },
          {
            key: 'rate_limit:meta_cloud_api:meta_pair_rate_limit',
            severity: 'warning',
            title: 'Provider throttling is affecting outbound throughput',
            summary:
              '1 outbound failures were classified as provider throttling or rate limiting.',
            thresholdKey: 'rateLimitedWarningCount',
            observedValue: 1,
            thresholdValue: 1,
            thresholdUnit: 'count',
            provider: 'meta_cloud_api',
            failureClass: 'rate_limited',
            providerTaxonomyFamily: 'throughput_limit',
            providerTaxonomyDetail: 'meta_pair_rate_limit',
            affectedMessageCount: 1,
            recommendedAction:
              'Reduce burst size, watch retry queue growth, and consider staggering automation traffic.',
          },
          {
            key: 'retry_queue_ready',
            severity: 'warning',
            title: 'Retry queue has ready-now messages',
            summary:
              '1 failed outbound messages are ready for retry execution now.',
            thresholdKey: 'readyRetryQueueWarningCount',
            observedValue: 1,
            thresholdValue: 1,
            thresholdUnit: 'count',
            provider: null,
            failureClass: null,
            providerTaxonomyFamily: null,
            providerTaxonomyDetail: null,
            affectedMessageCount: 1,
            recommendedAction:
              'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
          },
        ],
      });

    expect(
      getTenantWhatsappOutboundReportingSummaryUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform');
  });

  it('POST /api/growth/tenants/:slug/conversations/whatsapp-reporting/retry-ready should run ready-now retries', async () => {
    await request(httpServer)
      .post(
        '/api/growth/tenants/saas-platform/conversations/whatsapp-reporting/retry-ready',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        limit: 10,
        occurredAt: '2026-05-19T09:15:00.000Z',
      })
      .expect(201)
      .expect({
        tenantSlug: 'saas-platform',
        generatedAt: '2026-05-19T09:15:00.000Z',
        limitApplied: 10,
        candidateFailedMessageCount: 3,
        leafFailedMessageCount: 2,
        supersededFailedMessageCount: 1,
        readyNowCount: 1,
        retriedCount: 1,
        skippedCooldownCount: 1,
        skippedPermanentCount: 0,
        executions: [
          {
            sourceMessageId: 'message_whatsapp_002',
            sourceExternalMessageId: 'wamid-002',
            disposition: 'retryable',
            status: 'retried',
            failedAttemptCount: 1,
            backoffMinutes: 5,
            nextRetryAt: '2026-05-16T14:11:00.000Z',
            retryMessageId: 'message_whatsapp_003',
            retryExternalMessageId: 'wamid-003',
          },
          {
            sourceMessageId: 'message_whatsapp_004',
            sourceExternalMessageId: 'wamid-004',
            disposition: 'retryable',
            status: 'skipped_cooldown',
            failedAttemptCount: 1,
            backoffMinutes: 5,
            nextRetryAt: '2026-05-16T14:18:00.000Z',
            retryMessageId: null,
            retryExternalMessageId: null,
          },
        ],
      });

    expect(runTenantWhatsappReadyRetriesUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      limit: 10,
      occurredAt: new Date('2026-05-19T09:15:00.000Z'),
    });
  });

  it('POST /api/growth/tenants/:slug/conversations/whatsapp-reporting/monitor should return an operational monitor snapshot and optional retry execution', async () => {
    await request(httpServer)
      .post(
        '/api/growth/tenants/saas-platform/conversations/whatsapp-reporting/monitor',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        autoRunReadyRetries: true,
        retryReadyLimit: 10,
        occurredAt: '2026-05-20T10:00:00.000Z',
      })
      .expect(201)
      .expect({
        tenantSlug: 'saas-platform',
        generatedAt: '2026-05-20T10:00:00.000Z',
        autoRunReadyRetriesEnabled: true,
        overallStatus: 'warning',
        totalAlertCount: 3,
        criticalAlertCount: 0,
        warningAlertCount: 3,
        operationalThresholds: {
          immediateSendRejectionRateWarning: 0.05,
          asynchronousDeliveryFailureRateWarning: 0.03,
          readyRetryQueueWarningCount: 1,
          cooldownRetryQueueWarningCount: 3,
          authOrConfigurationCriticalCount: 1,
          policyBlockCriticalCount: 1,
          rateLimitedWarningCount: 1,
          unknownFailureWarningCount: 1,
        },
        operationalDashboard: {
          overallStatus: 'warning',
          immediateSendRejectionRate: 0.3333,
          asynchronousDeliveryFailureRate: 0,
          readyRetryQueueCount: 1,
          cooldownRetryQueueCount: 0,
          permanentFailureCount: 0,
          leadingFailureClass: 'rate_limited',
          leadingProvider: 'meta_cloud_api',
          leadingProviderTaxonomyFamily: 'throughput_limit',
          leadingProviderTaxonomyDetail: 'meta_pair_rate_limit',
        },
        operationalAlerts: [
          {
            key: 'immediate_send_rejection_rate',
            severity: 'warning',
            title: 'Immediate send rejection rate is elevated',
            summary:
              'Immediate outbound rejections reached 33.33% of outbound traffic.',
            thresholdKey: 'immediateSendRejectionRateWarning',
            observedValue: 0.3333,
            thresholdValue: 0.05,
            thresholdUnit: 'rate',
            provider: 'meta_cloud_api',
            failureClass: 'rate_limited',
            providerTaxonomyFamily: 'throughput_limit',
            providerTaxonomyDetail: 'meta_pair_rate_limit',
            affectedMessageCount: 1,
            recommendedAction:
              'Inspect provider-facing failures before throughput or template automation keeps amplifying the rejection rate.',
          },
          {
            key: 'rate_limit:meta_cloud_api:meta_pair_rate_limit',
            severity: 'warning',
            title: 'Provider throttling is affecting outbound throughput',
            summary:
              '1 outbound failures were classified as provider throttling or rate limiting.',
            thresholdKey: 'rateLimitedWarningCount',
            observedValue: 1,
            thresholdValue: 1,
            thresholdUnit: 'count',
            provider: 'meta_cloud_api',
            failureClass: 'rate_limited',
            providerTaxonomyFamily: 'throughput_limit',
            providerTaxonomyDetail: 'meta_pair_rate_limit',
            affectedMessageCount: 1,
            recommendedAction:
              'Reduce burst size, watch retry queue growth, and consider staggering automation traffic.',
          },
          {
            key: 'retry_queue_ready',
            severity: 'warning',
            title: 'Retry queue has ready-now messages',
            summary:
              '1 failed outbound messages are ready for retry execution now.',
            thresholdKey: 'readyRetryQueueWarningCount',
            observedValue: 1,
            thresholdValue: 1,
            thresholdUnit: 'count',
            provider: null,
            failureClass: null,
            providerTaxonomyFamily: null,
            providerTaxonomyDetail: null,
            affectedMessageCount: 1,
            recommendedAction:
              'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
          },
        ],
        retryRunnerExecuted: true,
        retryRunnerSummary: {
          tenantSlug: 'saas-platform',
          generatedAt: '2026-05-19T09:15:00.000Z',
          limitApplied: 10,
          candidateFailedMessageCount: 3,
          leafFailedMessageCount: 2,
          supersededFailedMessageCount: 1,
          readyNowCount: 1,
          retriedCount: 1,
          skippedCooldownCount: 1,
          skippedPermanentCount: 0,
          executions: [
            {
              sourceMessageId: 'message_whatsapp_002',
              sourceExternalMessageId: 'wamid-002',
              disposition: 'retryable',
              status: 'retried',
              failedAttemptCount: 1,
              backoffMinutes: 5,
              nextRetryAt: '2026-05-16T14:11:00.000Z',
              retryMessageId: 'message_whatsapp_003',
              retryExternalMessageId: 'wamid-003',
            },
            {
              sourceMessageId: 'message_whatsapp_004',
              sourceExternalMessageId: 'wamid-004',
              disposition: 'retryable',
              status: 'skipped_cooldown',
              failedAttemptCount: 1,
              backoffMinutes: 5,
              nextRetryAt: '2026-05-16T14:18:00.000Z',
              retryMessageId: null,
              retryExternalMessageId: null,
            },
          ],
        },
      });

    expect(runTenantWhatsappOperationalMonitorUseCase.execute).toHaveBeenCalledWith(
      {
        tenantSlug: 'saas-platform',
        occurredAt: new Date('2026-05-20T10:00:00.000Z'),
        autoRunReadyRetries: true,
        retryReadyLimit: 10,
        triggerSource: 'manual',
      },
    );
  });

  it('GET /api/growth/tenants/:slug/opportunities/:opportunityId should return one opportunity', async () => {
    await request(httpServer)
      .get('/api/growth/tenants/saas-platform/opportunities/opportunity_001')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'opportunity_001',
        tenantId: 'tenant_123',
        leadId: 'lead_001',
        threadId: 'thread_001',
        assigneeUserId: null,
        title: 'Onboarding anual facturacion electronica',
        stage: 'proposal',
        amountInCents: 199000,
        currency: 'USD',
        notes: 'Cliente con alto interes y decision esta semana.',
        closedAt: null,
        createdAt: '2026-05-15T15:00:00.000Z',
        updatedAt: '2026-05-15T15:20:00.000Z',
      });

    expect(getTenantOpportunityByIdUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'opportunity_001',
    );
  });

  it('POST /api/growth/tenants/:slug/opportunities should create an opportunity', async () => {
    await request(httpServer)
      .post('/api/growth/tenants/saas-platform/opportunities')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        leadId: 'lead_001',
        threadId: 'thread_001',
        title: 'Onboarding anual facturacion electronica',
        stage: 'proposal',
        amountInCents: 199000,
        currency: 'USD',
        notes: 'Cliente con alto interes y decision esta semana.',
      })
      .expect(201)
      .expect({
        id: 'opportunity_001',
        tenantId: 'tenant_123',
        leadId: 'lead_001',
        threadId: 'thread_001',
        assigneeUserId: null,
        title: 'Onboarding anual facturacion electronica',
        stage: 'proposal',
        amountInCents: 199000,
        currency: 'USD',
        notes: 'Cliente con alto interes y decision esta semana.',
        closedAt: null,
        createdAt: '2026-05-15T15:00:00.000Z',
        updatedAt: '2026-05-15T15:20:00.000Z',
      });

    expect(createTenantOpportunityUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      leadId: 'lead_001',
      threadId: 'thread_001',
      title: 'Onboarding anual facturacion electronica',
      stage: 'proposal',
      amountInCents: 199000,
      currency: 'USD',
      notes: 'Cliente con alto interes y decision esta semana.',
    });
  });

  it('PUT /api/growth/tenants/:slug/opportunities/:opportunityId/stage should move the opportunity stage', async () => {
    await request(httpServer)
      .put('/api/growth/tenants/saas-platform/opportunities/opportunity_001/stage')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        stage: 'won',
      })
      .expect(200)
      .expect({
        id: 'opportunity_001',
        tenantId: 'tenant_123',
        leadId: 'lead_001',
        threadId: 'thread_001',
        assigneeUserId: null,
        title: 'Onboarding anual facturacion electronica',
        stage: 'won',
        amountInCents: 199000,
        currency: 'USD',
        notes: 'Cliente con alto interes y decision esta semana.',
        closedAt: '2026-05-15T15:45:00.000Z',
        createdAt: '2026-05-15T15:00:00.000Z',
        updatedAt: '2026-05-15T15:45:00.000Z',
      });

    expect(updateTenantOpportunityStageUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      opportunityId: 'opportunity_001',
      stage: 'won',
    });
  });

  it('POST /api/growth/tenants/:slug/opportunities/:opportunityId/assignment should assign one opportunity owner', async () => {
    await request(httpServer)
      .post('/api/growth/tenants/saas-platform/opportunities/opportunity_001/assignment')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        assigneeUserId: 'user_456',
      })
      .expect(201)
      .expect({
        id: 'opportunity_001',
        tenantId: 'tenant_123',
        leadId: 'lead_001',
        threadId: 'thread_001',
        assigneeUserId: 'user_456',
        title: 'Onboarding anual facturacion electronica',
        stage: 'proposal',
        amountInCents: 199000,
        currency: 'USD',
        notes: 'Cliente con alto interes y decision esta semana.',
        closedAt: null,
        createdAt: '2026-05-15T15:00:00.000Z',
        updatedAt: '2026-05-15T15:30:00.000Z',
      });

    expect(assignTenantOpportunityUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      opportunityId: 'opportunity_001',
      assigneeUserId: 'user_456',
    });
  });

  it('GET /api/growth/tenants/:slug/opportunities should require opportunity read permission', async () => {
    resolveTenantAccessUseCase.execute.mockResolvedValueOnce({
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      userId: 'user_456',
      membershipId: 'membership_456',
      membershipStatus: MembershipStatus.Active,
      roleKeys: ['tenant_member'],
      permissionKeys: [TENANT_PERMISSIONS.READ],
    });

    await request(httpServer)
      .get('/api/growth/tenants/saas-platform/opportunities')
      .set('Authorization', `Bearer ${memberToken}`)
      .expect(403)
      .expect({
        statusCode: 403,
        message:
          'Permission "growth.opportunities.read" is required for this tenant resource.',
        error: 'Forbidden',
      });
  });

  it('GET /api/invoicing/tenants/:slug/taxes should return tenant tax rates', async () => {
    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/taxes')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'tax_rate_vat_12',
          tenantId: 'tenant_123',
          name: 'VAT 12%',
          percentage: 12,
          isActive: true,
          createdAt: '2026-04-28T12:00:00.000Z',
          updatedAt: '2026-04-28T12:00:00.000Z',
        },
      ]);

    expect(listTenantTaxRatesUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/invoicing/tenants/:slug/electronic-profile should return the tenant issuer profile', async () => {
    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/electronic-profile')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'issuer_profile_001',
        tenantId: 'tenant_123',
        legalName: 'SaaS Platform S.A.',
        commercialName: 'SaaS Platform',
        taxId: '1790012345001',
        environment: 'test',
        emissionType: 'normal',
        accountingObligated: true,
        specialTaxpayerCode: null,
        rimpeTaxpayerType: null,
        matrixAddress: 'Av. Principal y Calle Secundaria',
        establishmentAddress: 'Sucursal Matriz',
        createdAt: '2026-04-29T16:00:00.000Z',
        updatedAt: '2026-04-29T16:00:00.000Z',
      });

    expect(getTenantIssuerProfileUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('POST /api/invoicing/tenants/:slug/electronic-profile should upsert the tenant issuer profile', async () => {
    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/electronic-profile')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        legalName: 'SaaS Platform S.A.',
        commercialName: 'SaaS Platform',
        taxId: '1790012345001',
        environment: 'test',
        emissionType: 'normal',
        accountingObligated: true,
        specialTaxpayerCode: null,
        rimpeTaxpayerType: null,
        matrixAddress: 'Av. Principal y Calle Secundaria',
        establishmentAddress: 'Sucursal Matriz',
      })
      .expect(201)
      .expect({
        id: 'issuer_profile_001',
        tenantId: 'tenant_123',
        legalName: 'SaaS Platform S.A.',
        commercialName: 'SaaS Platform',
        taxId: '1790012345001',
        environment: 'test',
        emissionType: 'normal',
        accountingObligated: true,
        specialTaxpayerCode: null,
        rimpeTaxpayerType: null,
        matrixAddress: 'Av. Principal y Calle Secundaria',
        establishmentAddress: 'Sucursal Matriz',
        createdAt: '2026-04-29T16:00:00.000Z',
        updatedAt: '2026-04-29T16:00:00.000Z',
      });

    expect(upsertTenantIssuerProfileUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      legalName: 'SaaS Platform S.A.',
      commercialName: 'SaaS Platform',
      taxId: '1790012345001',
      environment: 'test',
      emissionType: 'normal',
      accountingObligated: true,
      specialTaxpayerCode: null,
      rimpeTaxpayerType: null,
      matrixAddress: 'Av. Principal y Calle Secundaria',
      establishmentAddress: 'Sucursal Matriz',
    });
  });

  it('POST /api/invoicing/tenants/:slug/electronic-profile/sync-certificate-tax-id should align the issuer tax id from the certificate', async () => {
    await request(httpServer)
      .post(
        '/api/invoicing/tenants/saas-platform/electronic-profile/sync-certificate-tax-id',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201)
      .expect({
        id: 'issuer_profile_001',
        tenantId: 'tenant_123',
        legalName: 'SaaS Platform S.A.',
        commercialName: 'SaaS Platform',
        taxId: '1790012345001',
        environment: 'test',
        emissionType: 'normal',
        accountingObligated: true,
        specialTaxpayerCode: null,
        rimpeTaxpayerType: null,
        matrixAddress: 'Av. Principal y Calle Secundaria',
        establishmentAddress: 'Sucursal Matriz',
        createdAt: '2026-04-29T16:00:00.000Z',
        updatedAt: '2026-04-29T16:00:00.000Z',
      });

    expect(
      syncTenantIssuerProfileTaxIdFromSignatureUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform');
  });

  it('GET /api/invoicing/tenants/:slug/electronic-signature should return electronic signature settings', async () => {
    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/electronic-signature')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'signature_settings_001',
        tenantId: 'tenant_123',
        provider: 'stub_local',
        certificateLabel: 'Firma pruebas SaaS Platform',
        storageMode: 'stub_inline',
        certificateFingerprint: 'AA:BB:CC:DD',
        pkcs12SecretRef: null,
        privateKeyPasswordSecretRef: null,
        subjectName: null,
        materialConfigured: true,
        isActive: true,
        createdAt: '2026-05-01T16:50:00.000Z',
        updatedAt: '2026-05-01T16:50:00.000Z',
      });

    expect(
      getTenantElectronicSignatureSettingsUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform');
  });

  it('GET /api/invoicing/tenants/:slug/electronic-signature/inspection should return signature material inspection', async () => {
    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/electronic-signature/inspection')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect(electronicSignatureMaterialInspection);

    expect(
      inspectTenantElectronicSignatureMaterialUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform');
  });

  it('POST /api/invoicing/tenants/:slug/electronic-signature should upsert electronic signature settings', async () => {
    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/electronic-signature')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        provider: 'stub_local',
        certificateLabel: 'Firma pruebas SaaS Platform',
        storageMode: 'stub_inline',
        certificateFingerprint: 'AA:BB:CC:DD',
        isActive: true,
      })
      .expect(201)
      .expect({
        id: 'signature_settings_001',
        tenantId: 'tenant_123',
        provider: 'stub_local',
        certificateLabel: 'Firma pruebas SaaS Platform',
        storageMode: 'stub_inline',
        certificateFingerprint: 'AA:BB:CC:DD',
        pkcs12SecretRef: null,
        privateKeyPasswordSecretRef: null,
        subjectName: null,
        materialConfigured: true,
        isActive: true,
        createdAt: '2026-05-01T16:50:00.000Z',
        updatedAt: '2026-05-01T16:50:00.000Z',
      });

    expect(
      upsertTenantElectronicSignatureSettingsUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      provider: 'stub_local',
      certificateLabel: 'Firma pruebas SaaS Platform',
      storageMode: 'stub_inline',
      certificateFingerprint: 'AA:BB:CC:DD',
      pkcs12SecretRef: null,
      privateKeyPasswordSecretRef: null,
      subjectName: null,
      isActive: true,
    });
  });

  it('POST /api/invoicing/tenants/:slug/electronic-signature should forward PKCS#12 metadata hydration when requested', async () => {
    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/electronic-signature')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        provider: 'xades_pkcs12',
        certificateLabel: 'Firma Legal PKCS12',
        storageMode: 'secret_ref',
        pkcs12SecretRef: 'env:EC_PKCS12',
        privateKeyPasswordSecretRef: 'env:EC_PKCS12_PASSWORD',
        hydrateMetadataFromPkcs12: true,
        isActive: true,
      })
      .expect(201);

    expect(
      upsertTenantElectronicSignatureSettingsUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      provider: 'xades_pkcs12',
      certificateLabel: 'Firma Legal PKCS12',
      storageMode: 'secret_ref',
      certificateFingerprint: null,
      pkcs12SecretRef: 'env:EC_PKCS12',
      privateKeyPasswordSecretRef: 'env:EC_PKCS12_PASSWORD',
      subjectName: null,
      hydrateMetadataFromPkcs12: true,
      isActive: true,
    });
  });

  it('GET /api/invoicing/tenants/:slug/electronic-submission should return electronic submission settings', async () => {
    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/electronic-submission')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'submission_settings_001',
        tenantId: 'tenant_123',
        provider: 'stub_sri',
        environment: 'test',
        transmissionMode: 'sync_stub',
        receptionUrl: null,
        authorizationUrl: null,
        credentialsSecretRef: null,
        timeoutMs: 10000,
        gatewayConfigured: true,
        isActive: true,
        createdAt: '2026-05-01T17:20:00.000Z',
        updatedAt: '2026-05-01T17:20:00.000Z',
      });

    expect(
      getTenantElectronicSubmissionSettingsUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform');
  });

  it('GET /api/invoicing/tenants/:slug/electronic-document/readiness should return sandbox readiness', async () => {
    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/electronic-document/readiness')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect(electronicSandboxReadiness);

    expect(
      getTenantElectronicSandboxReadinessUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform');
  });

  it('POST /api/invoicing/tenants/:slug/electronic-submission should upsert electronic submission settings', async () => {
    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/electronic-submission')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        provider: 'stub_sri',
        environment: 'test',
        transmissionMode: 'sync_stub',
        receptionUrl: null,
        authorizationUrl: null,
        credentialsSecretRef: null,
        timeoutMs: 10000,
        isActive: true,
      })
      .expect(201)
      .expect({
        id: 'submission_settings_001',
        tenantId: 'tenant_123',
        provider: 'stub_sri',
        environment: 'test',
        transmissionMode: 'sync_stub',
        receptionUrl: null,
        authorizationUrl: null,
        credentialsSecretRef: null,
        timeoutMs: 10000,
        gatewayConfigured: true,
        isActive: true,
        createdAt: '2026-05-01T17:20:00.000Z',
        updatedAt: '2026-05-01T17:20:00.000Z',
      });

    expect(
      upsertTenantElectronicSubmissionSettingsUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      provider: 'stub_sri',
      environment: 'test',
      transmissionMode: 'sync_stub',
      receptionUrl: null,
      authorizationUrl: null,
      credentialsSecretRef: null,
      timeoutMs: 10000,
      isActive: true,
    });
  });

  it('GET /api/invoicing/tenants/:slug/numbering/invoice should return invoice numbering settings', async () => {
    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/numbering/invoice')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'invoice_numbering_001',
        tenantId: 'tenant_123',
        documentCode: '01',
        establishmentCode: '001',
        emissionPointCode: '002',
        nextSequenceNumber: 31,
        previewNumber: '001-002-000000031',
        createdAt: '2026-04-29T16:05:00.000Z',
        updatedAt: '2026-04-29T16:05:00.000Z',
      });

    expect(getTenantInvoiceNumberingSettingsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      '01',
    );
  });

  it('POST /api/invoicing/tenants/:slug/numbering/invoice should upsert invoice numbering settings', async () => {
    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/numbering/invoice')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        documentCode: '01',
        establishmentCode: '001',
        emissionPointCode: '002',
        nextSequenceNumber: 31,
      })
      .expect(201)
      .expect({
        id: 'invoice_numbering_001',
        tenantId: 'tenant_123',
        documentCode: '01',
        establishmentCode: '001',
        emissionPointCode: '002',
        nextSequenceNumber: 31,
        previewNumber: '001-002-000000031',
        createdAt: '2026-04-29T16:05:00.000Z',
        updatedAt: '2026-04-29T16:05:00.000Z',
      });

    expect(
      upsertTenantInvoiceNumberingSettingsUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      documentCode: '01',
      establishmentCode: '001',
      emissionPointCode: '002',
      nextSequenceNumber: 31,
    });
  });

  it('GET /api/invoicing/tenants/:slug/numbering/credit-note should return credit note numbering settings', async () => {
    getTenantInvoiceNumberingSettingsUseCase.execute.mockResolvedValueOnce(
      creditNoteNumberingSettings,
    );

    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/numbering/credit-note')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'invoice_numbering_004',
        tenantId: 'tenant_123',
        documentCode: '04',
        establishmentCode: '003',
        emissionPointCode: '001',
        nextSequenceNumber: 12,
        previewNumber: '003-001-000000012',
        createdAt: '2026-04-29T16:10:00.000Z',
        updatedAt: '2026-04-29T16:10:00.000Z',
      });

    expect(getTenantInvoiceNumberingSettingsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      '04',
    );
  });

  it('POST /api/invoicing/tenants/:slug/numbering/credit-note should upsert credit note numbering settings', async () => {
    upsertTenantInvoiceNumberingSettingsUseCase.execute.mockResolvedValueOnce(
      creditNoteNumberingSettings,
    );

    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/numbering/credit-note')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        establishmentCode: '003',
        emissionPointCode: '001',
        nextSequenceNumber: 12,
      })
      .expect(201)
      .expect({
        id: 'invoice_numbering_004',
        tenantId: 'tenant_123',
        documentCode: '04',
        establishmentCode: '003',
        emissionPointCode: '001',
        nextSequenceNumber: 12,
        previewNumber: '003-001-000000012',
        createdAt: '2026-04-29T16:10:00.000Z',
        updatedAt: '2026-04-29T16:10:00.000Z',
      });

    expect(
      upsertTenantInvoiceNumberingSettingsUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      documentCode: '04',
      establishmentCode: '003',
      emissionPointCode: '001',
      nextSequenceNumber: 12,
    });
  });

  it('GET /api/invoicing/tenants/:slug/numbering/debit-note should return debit note numbering settings', async () => {
    getTenantInvoiceNumberingSettingsUseCase.execute.mockResolvedValueOnce(
      debitNoteNumberingSettings,
    );

    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/numbering/debit-note')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'invoice_numbering_005',
        tenantId: 'tenant_123',
        documentCode: '05',
        establishmentCode: '004',
        emissionPointCode: '001',
        nextSequenceNumber: 7,
        previewNumber: '004-001-000000007',
        createdAt: '2026-05-08T15:10:00.000Z',
        updatedAt: '2026-05-08T15:10:00.000Z',
      });

    expect(getTenantInvoiceNumberingSettingsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      '05',
    );
  });

  it('POST /api/invoicing/tenants/:slug/numbering/debit-note should upsert debit note numbering settings', async () => {
    upsertTenantInvoiceNumberingSettingsUseCase.execute.mockResolvedValueOnce(
      debitNoteNumberingSettings,
    );

    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/numbering/debit-note')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        establishmentCode: '004',
        emissionPointCode: '001',
        nextSequenceNumber: 7,
      })
      .expect(201)
      .expect({
        id: 'invoice_numbering_005',
        tenantId: 'tenant_123',
        documentCode: '05',
        establishmentCode: '004',
        emissionPointCode: '001',
        nextSequenceNumber: 7,
        previewNumber: '004-001-000000007',
        createdAt: '2026-05-08T15:10:00.000Z',
        updatedAt: '2026-05-08T15:10:00.000Z',
      });

    expect(
      upsertTenantInvoiceNumberingSettingsUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      documentCode: '05',
      establishmentCode: '004',
      emissionPointCode: '001',
      nextSequenceNumber: 7,
    });
  });

  it('GET /api/invoicing/tenants/:slug/numbering/remission-guide should return remission guide numbering settings', async () => {
    getTenantInvoiceNumberingSettingsUseCase.execute.mockResolvedValueOnce(
      remissionGuideNumberingSettings,
    );

    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/numbering/remission-guide')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'invoice_numbering_006',
        tenantId: 'tenant_123',
        documentCode: '06',
        establishmentCode: '006',
        emissionPointCode: '001',
        nextSequenceNumber: 4,
        previewNumber: '006-001-000000004',
        createdAt: '2026-05-12T15:10:00.000Z',
        updatedAt: '2026-05-12T15:10:00.000Z',
      });

    expect(getTenantInvoiceNumberingSettingsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      '06',
    );
  });

  it('POST /api/invoicing/tenants/:slug/numbering/remission-guide should upsert remission guide numbering settings', async () => {
    upsertTenantInvoiceNumberingSettingsUseCase.execute.mockResolvedValueOnce(
      remissionGuideNumberingSettings,
    );

    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/numbering/remission-guide')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        establishmentCode: '006',
        emissionPointCode: '001',
        nextSequenceNumber: 4,
      })
      .expect(201)
      .expect({
        id: 'invoice_numbering_006',
        tenantId: 'tenant_123',
        documentCode: '06',
        establishmentCode: '006',
        emissionPointCode: '001',
        nextSequenceNumber: 4,
        previewNumber: '006-001-000000004',
        createdAt: '2026-05-12T15:10:00.000Z',
        updatedAt: '2026-05-12T15:10:00.000Z',
      });

    expect(
      upsertTenantInvoiceNumberingSettingsUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      documentCode: '06',
      establishmentCode: '006',
      emissionPointCode: '001',
      nextSequenceNumber: 4,
    });
  });

  it('GET /api/invoicing/tenants/:slug/numbering/withholding should return withholding numbering settings', async () => {
    getTenantInvoiceNumberingSettingsUseCase.execute.mockResolvedValueOnce(
      withholdingNumberingSettings,
    );

    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/numbering/withholding')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'invoice_numbering_007',
        tenantId: 'tenant_123',
        documentCode: '07',
        establishmentCode: '005',
        emissionPointCode: '001',
        nextSequenceNumber: 9,
        previewNumber: '005-001-000000009',
        createdAt: '2026-05-08T19:10:00.000Z',
        updatedAt: '2026-05-08T19:10:00.000Z',
      });

    expect(getTenantInvoiceNumberingSettingsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      '07',
    );
  });

  it('POST /api/invoicing/tenants/:slug/numbering/withholding should upsert withholding numbering settings', async () => {
    upsertTenantInvoiceNumberingSettingsUseCase.execute.mockResolvedValueOnce(
      withholdingNumberingSettings,
    );

    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/numbering/withholding')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        establishmentCode: '005',
        emissionPointCode: '001',
        nextSequenceNumber: 9,
      })
      .expect(201)
      .expect({
        id: 'invoice_numbering_007',
        tenantId: 'tenant_123',
        documentCode: '07',
        establishmentCode: '005',
        emissionPointCode: '001',
        nextSequenceNumber: 9,
        previewNumber: '005-001-000000009',
        createdAt: '2026-05-08T19:10:00.000Z',
        updatedAt: '2026-05-08T19:10:00.000Z',
      });

    expect(
      upsertTenantInvoiceNumberingSettingsUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      documentCode: '07',
      establishmentCode: '005',
      emissionPointCode: '001',
      nextSequenceNumber: 9,
    });
  });

  it('GET /api/invoicing/tenants/:slug/reports/summary should return the invoicing report summary', async () => {
    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/reports/summary')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        generatedAt: '2026-04-28T22:30:00.000Z',
        customerCount: 2,
        invoiceCount: 2,
        statusBreakdown: [
          { status: 'draft', count: 1 },
          { status: 'partially_paid', count: 1 },
        ],
        totalsByCurrency: [
          {
            currency: 'USD',
            subtotalInCents: 17500,
            taxInCents: 1200,
            totalInCents: 18700,
            paidInCents: 2500,
            outstandingTotalInCents: 16200,
          },
        ],
        monthlyTotals: [
          {
            month: '2026-04',
            currency: 'USD',
            invoiceCount: 2,
            totalInCents: 18700,
            taxInCents: 1200,
          },
        ],
      });

    expect(getTenantInvoicingReportSummaryUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('POST /api/invoicing/tenants/:slug/taxes should create a tenant tax rate', async () => {
    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/taxes')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: 'VAT 12%',
        percentage: 12,
        isActive: true,
      })
      .expect(201)
      .expect({
        id: 'tax_rate_vat_12',
        tenantId: 'tenant_123',
        name: 'VAT 12%',
        percentage: 12,
        isActive: true,
        createdAt: '2026-04-28T12:00:00.000Z',
        updatedAt: '2026-04-28T12:00:00.000Z',
      });

    expect(createTenantTaxRateUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      name: 'VAT 12%',
      percentage: 12,
      isActive: true,
    });
  });

  it('GET /api/invoicing/tenants/:slug/customers/:customerId should return one tenant customer', async () => {
    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/customers/customer_acme')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'customer_acme',
        tenantId: 'tenant_123',
        name: 'Acme Corp',
        email: 'billing@acme.dev',
        taxId: '1790012345001',
        identificationType: '04',
        identification: '1790012345001',
        billingAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
        createdAt: '2026-04-27T15:00:00.000Z',
        updatedAt: '2026-04-27T15:00:00.000Z',
      });

    expect(getTenantCustomerByIdUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'customer_acme',
    );
  });

  it('POST /api/invoicing/tenants/:slug/customers should create a tenant customer', async () => {
    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/customers')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: 'Acme Corp',
        email: 'Billing@Acme.dev',
        taxId: '1790012345001',
        identificationType: '04',
        identification: '1790012345001',
        billingAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
      })
      .expect(201)
      .expect({
        id: 'customer_acme',
        tenantId: 'tenant_123',
        name: 'Acme Corp',
        email: 'billing@acme.dev',
        taxId: '1790012345001',
        identificationType: '04',
        identification: '1790012345001',
        billingAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
        createdAt: '2026-04-27T15:00:00.000Z',
        updatedAt: '2026-04-27T15:00:00.000Z',
      });

    expect(createTenantCustomerUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      name: 'Acme Corp',
      email: 'Billing@Acme.dev',
      taxId: '1790012345001',
      identificationType: '04',
      identification: '1790012345001',
      billingAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
    });
  });

  it('GET /api/invoicing/tenants/:slug/customers should return 403 when invoicing is not enabled for the tenant', async () => {
    getTenantEnabledProductByKeyUseCase.execute.mockRejectedValueOnce(
      new TenantProductAccessDeniedError('saas-platform', 'invoicing'),
    );

    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/customers')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(403)
      .expect({
        statusCode: 403,
        message: 'Product "invoicing" is not enabled for tenant "saas-platform".',
        error: 'Forbidden',
      });
  });

  it('GET /api/invoicing/tenants/:slug/invoices should return tenant-scoped invoices', async () => {
    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/invoices')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'invoice_001',
          tenantId: 'tenant_123',
          customerId: 'customer_acme',
          number: 'INV-001',
          documentCode: null,
          establishmentCode: null,
          emissionPointCode: null,
          sequenceNumber: null,
          buyerIdentificationType: '04',
          buyerIdentification: '1790012345001',
          buyerName: 'Acme Corp',
          buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
          electronicStatus: null,
          accessKey: null,
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage: null,
          signedAt: null,
          submittedAt: null,
          submissionReference: null,
          status: 'draft',
          currency: 'USD',
          issuedAt: '2026-04-27T16:00:00.000Z',
          dueAt: '2026-05-11T16:00:00.000Z',
          notes: 'Primer borrador para onboarding de invoicing.',
          createdAt: '2026-04-27T16:00:00.000Z',
          updatedAt: '2026-04-27T16:00:00.000Z',
          itemCount: 2,
          totals: {
            subtotalInCents: 12500,
            taxInCents: 1200,
            totalInCents: 13700,
          },
          settlement: {
            paidInCents: 0,
            balanceDueInCents: 13700,
            isFullyPaid: false,
          },
        },
        {
          id: 'invoice_002',
          tenantId: 'tenant_123',
          customerId: 'customer_globex',
          number: 'INV-002',
          documentCode: null,
          establishmentCode: null,
          emissionPointCode: null,
          sequenceNumber: null,
          buyerIdentificationType: null,
          buyerIdentification: null,
          buyerName: 'Globex LLC',
          buyerAddress: null,
          electronicStatus: null,
          accessKey: null,
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage: null,
          signedAt: null,
          submittedAt: null,
          submissionReference: null,
          status: 'partially_paid',
          currency: 'USD',
          issuedAt: '2026-04-27T17:00:00.000Z',
          dueAt: null,
          notes: null,
          createdAt: '2026-04-27T17:00:00.000Z',
          updatedAt: '2026-04-27T17:00:00.000Z',
          itemCount: 0,
          totals: {
            subtotalInCents: 5000,
            taxInCents: 0,
            totalInCents: 5000,
          },
          settlement: {
            paidInCents: 2500,
            balanceDueInCents: 2500,
            isFullyPaid: false,
          },
        },
      ]);

    expect(listTenantInvoiceSummariesUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId should return one invoice', async () => {
    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/invoices/invoice_001')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'invoice_001',
        tenantId: 'tenant_123',
        customerId: 'customer_acme',
        number: 'INV-001',
        documentCode: null,
        establishmentCode: null,
        emissionPointCode: null,
        sequenceNumber: null,
        buyerIdentificationType: '04',
        buyerIdentification: '1790012345001',
        buyerName: 'Acme Corp',
        buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
        electronicStatus: null,
        accessKey: null,
        authorizationNumber: null,
        authorizedAt: null,
        electronicStatusMessage: null,
        signedAt: null,
        submittedAt: null,
        submissionReference: null,
        status: 'draft',
        currency: 'USD',
        issuedAt: '2026-04-27T16:00:00.000Z',
        dueAt: '2026-05-11T16:00:00.000Z',
        notes: 'Primer borrador para onboarding de invoicing.',
        createdAt: '2026-04-27T16:00:00.000Z',
        updatedAt: '2026-04-27T16:00:00.000Z',
        items: [
          {
            id: 'invoice_item_001',
            tenantId: 'tenant_123',
            invoiceId: 'invoice_001',
            position: 1,
            description: 'Suscripcion mensual Growth',
            quantity: 2,
            unitPriceInCents: 5000,
            lineTotalInCents: 10000,
            taxRateId: 'tax_rate_vat_12',
            taxRateName: 'VAT 12%',
            taxRatePercentage: 12,
            lineTaxInCents: 1200,
            createdAt: '2026-04-27T16:05:00.000Z',
            updatedAt: '2026-04-27T16:05:00.000Z',
          },
          {
            id: 'invoice_item_002',
            tenantId: 'tenant_123',
            invoiceId: 'invoice_001',
            position: 2,
            description: 'Setup inicial',
            quantity: 1,
            unitPriceInCents: 2500,
            lineTotalInCents: 2500,
            taxRateId: null,
            taxRateName: null,
            taxRatePercentage: null,
            lineTaxInCents: 0,
            createdAt: '2026-04-27T16:06:00.000Z',
            updatedAt: '2026-04-27T16:06:00.000Z',
          },
        ],
        totals: {
          subtotalInCents: 12500,
          taxInCents: 1200,
          totalInCents: 13700,
        },
        payments: [],
        electronicEvents: [
          {
            id: 'invoice_event_001',
            tenantId: 'tenant_123',
            invoiceId: 'invoice_001',
            eventType: 'submission',
            provider: 'stub_sri',
            providerStatus: 'submitted',
            endpoint: null,
            soapAction: null,
            message: 'Documento enviado al gateway stub del SRI.',
            requestPayload: '{"gateway":"stub_sri"}',
            responsePayload: '{"state":"submitted"}',
            submissionReference: 'stub-sri-invoice_001-123456789',
            authorizationNumber: null,
            occurredAt: '2026-05-01T18:00:00.000Z',
            sriDiagnostics: null,
          },
        ],
        settlement: {
          paidInCents: 0,
          balanceDueInCents: 13700,
          isFullyPaid: false,
        },
      });

    expect(getTenantInvoiceDetailUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId should expose structured SRI diagnostics when the response payload is XML', async () => {
    getTenantInvoiceDetailUseCase.execute.mockResolvedValueOnce({
      invoice: draftInvoice.updateElectronicStatus(
        {
          electronicStatus: 'rejected',
          accessKey:
            '120520260117900123450010010020000000011234567815',
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage:
            '35 - ARCHIVO NO CUMPLE ESTRUCTURA XML · No existe un contribuyente registrado con el RUC 1790012345001',
          signedAt: new Date('2026-05-14T15:39:50.000Z'),
          submittedAt: new Date('2026-05-14T15:39:56.909Z'),
          submissionReference: 'SRI-HTTP-invoice_001-1778815396909',
        },
        new Date('2026-05-14T15:39:56.909Z'),
      ),
      items: [firstInvoiceItem, secondInvoiceItem],
      payments: [],
      electronicEvents: [sriRejectedInvoiceElectronicEvent],
      totals: {
        subtotalInCents: 12500,
        taxInCents: 1200,
        totalInCents: 13700,
      },
      settlement: {
        paidInCents: 0,
        balanceDueInCents: 13700,
        isFullyPaid: false,
      },
    });

    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/invoices/invoice_001')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.electronicStatus).toBe('rejected');
        expect(response.body.electronicStatusMessage).toBe(
          '35 - ARCHIVO NO CUMPLE ESTRUCTURA XML · No existe un contribuyente registrado con el RUC 1790012345001',
        );
        expect(response.body.electronicEvents[0].sriDiagnostics).toEqual({
          state: 'DEVUELTA',
          authorizationNumber: null,
          authorizationDate: null,
          accessKey: '120520260117900123450010010020000000011234567815',
          summary:
            '35 - ARCHIVO NO CUMPLE ESTRUCTURA XML · No existe un contribuyente registrado con el RUC 1790012345001',
          messages: [
            {
              identifier: '35',
              message: 'ARCHIVO NO CUMPLE ESTRUCTURA XML',
              additionalInfo: [
                'No existe un contribuyente registrado con el RUC 1790012345001',
              ],
            },
          ],
        });
      });
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/document should return the invoice document view', async () => {
    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/invoices/invoice_001/document')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        issuer: {
          tenantId: 'tenant_123',
          tenantName: 'SaaS Platform',
          tenantSlug: 'saas-platform',
          legalName: 'SaaS Platform S.A.',
          commercialName: 'SaaS Platform',
          taxId: '1790012345001',
          environment: 'test',
          emissionType: 'normal',
          accountingObligated: true,
          specialTaxpayerCode: null,
          rimpeTaxpayerType: null,
          matrixAddress: 'Av. Principal y Calle Secundaria',
          establishmentAddress: 'Sucursal Matriz',
        },
        customer: {
          name: 'Acme Corp',
          email: 'billing@acme.dev',
          taxId: '1790012345001',
          identificationType: '04',
          identification: '1790012345001',
          billingAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
        },
        invoice: {
          id: 'invoice_001',
          tenantId: 'tenant_123',
          customerId: 'customer_acme',
          number: 'INV-001',
          documentCode: null,
          establishmentCode: null,
          emissionPointCode: null,
          sequenceNumber: null,
          buyerIdentificationType: '04',
          buyerIdentification: '1790012345001',
          buyerName: 'Acme Corp',
          buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
          electronicStatus: null,
          accessKey: null,
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage: null,
          signedAt: null,
          submittedAt: null,
          submissionReference: null,
          status: 'draft',
          currency: 'USD',
          issuedAt: '2026-04-27T16:00:00.000Z',
          dueAt: '2026-05-11T16:00:00.000Z',
          notes: 'Primer borrador para onboarding de invoicing.',
          createdAt: '2026-04-27T16:00:00.000Z',
          updatedAt: '2026-04-27T16:00:00.000Z',
        },
        lines: [
          {
            id: 'invoice_item_001',
            position: 1,
            description: 'Suscripcion mensual Growth',
            quantity: 2,
            unitPriceInCents: 5000,
            lineSubtotalInCents: 10000,
            taxRateId: 'tax_rate_vat_12',
            taxRateName: 'VAT 12%',
            taxRatePercentage: 12,
            lineTaxInCents: 1200,
            lineTotalInCents: 11200,
          },
          {
            id: 'invoice_item_002',
            position: 2,
            description: 'Setup inicial',
            quantity: 1,
            unitPriceInCents: 2500,
            lineSubtotalInCents: 2500,
            taxRateId: null,
            taxRateName: null,
            taxRatePercentage: null,
            lineTaxInCents: 0,
            lineTotalInCents: 2500,
          },
        ],
        totals: {
          subtotalInCents: 12500,
          taxInCents: 1200,
          totalInCents: 13700,
        },
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/document/html should return printable invoice html', async () => {
    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/invoice_001/document/html',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect((response) => {
        expect(response.text).toContain('<!doctype html>');
        expect(response.text).toContain('Invoice INV-001');
        expect(response.text).toContain('Acme Corp');
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/document/html should return printable debit note html', async () => {
    getTenantInvoiceDocumentUseCase.execute.mockResolvedValueOnce(
      debitNoteDocumentView,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/debit_note_001/document/html',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect((response) => {
        expect(response.text).toContain('<!doctype html>');
        expect(response.text).toContain('Debit Note 004-001-000000007');
        expect(response.text).toContain('Acme Corp');
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'debit_note_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/document/html should return printable remission guide html', async () => {
    getTenantInvoiceDocumentUseCase.execute.mockResolvedValueOnce(
      remissionGuideDocumentView,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/remission_001/document/html',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect((response) => {
        expect(response.text).toContain('<!doctype html>');
        expect(response.text).toContain('Remission Guide 006-001-000000004');
        expect(response.text).toContain('Acme Corp');
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'remission_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/ride should return the electronic RIDE view', async () => {
    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/invoice_001/electronic-document/ride',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        issuer: {
          tenantId: 'tenant_123',
          tenantName: 'SaaS Platform',
          tenantSlug: 'saas-platform',
          legalName: 'SaaS Platform S.A.',
          commercialName: 'SaaS Platform',
          taxId: '1790012345001',
          environment: 'test',
          emissionType: 'normal',
          accountingObligated: true,
          specialTaxpayerCode: null,
          rimpeTaxpayerType: null,
          matrixAddress: 'Av. Principal y Calle Secundaria',
          establishmentAddress: 'Sucursal Matriz',
        },
        customer: {
          name: 'Acme Corp',
          email: 'billing@acme.dev',
          taxId: '1790012345001',
          identificationType: '04',
          identification: '1790012345001',
          billingAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
        },
        invoice: {
          id: 'invoice_001',
          tenantId: 'tenant_123',
          customerId: 'customer_acme',
          number: 'INV-001',
          documentCode: null,
          establishmentCode: null,
          emissionPointCode: null,
          sequenceNumber: null,
          buyerIdentificationType: '04',
          buyerIdentification: '1790012345001',
          buyerName: 'Acme Corp',
          buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
          electronicStatus: null,
          accessKey: null,
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage: null,
          signedAt: null,
          submittedAt: null,
          submissionReference: null,
          status: 'draft',
          currency: 'USD',
          issuedAt: '2026-04-27T16:00:00.000Z',
          dueAt: '2026-05-11T16:00:00.000Z',
          notes: 'Primer borrador para onboarding de invoicing.',
          createdAt: '2026-04-27T16:00:00.000Z',
          updatedAt: '2026-04-27T16:00:00.000Z',
        },
        lines: [
          {
            id: 'invoice_item_001',
            position: 1,
            description: 'Suscripcion mensual Growth',
            quantity: 2,
            unitPriceInCents: 5000,
            lineSubtotalInCents: 10000,
            taxRateId: 'tax_rate_vat_12',
            taxRateName: 'VAT 12%',
            taxRatePercentage: 12,
            lineTaxInCents: 1200,
            lineTotalInCents: 11200,
          },
          {
            id: 'invoice_item_002',
            position: 2,
            description: 'Setup inicial',
            quantity: 1,
            unitPriceInCents: 2500,
            lineSubtotalInCents: 2500,
            taxRateId: null,
            taxRateName: null,
            taxRatePercentage: null,
            lineTaxInCents: 0,
            lineTotalInCents: 2500,
          },
        ],
        totals: {
          subtotalInCents: 12500,
          taxInCents: 1200,
          totalInCents: 13700,
        },
        ride: {
          documentLabel: 'RIDE',
          environmentLabel: 'PRUEBAS',
          emissionTypeLabel: 'NORMAL',
          sequenceDisplay: null,
          electronicStatusLabel: 'Sin estado electronico',
          canBePrintedAsAuthorized: false,
          accessKey: null,
          accessKeyChunks: [],
          authorizationNumber: null,
          authorizedAt: null,
          authorizationMessage: null,
          additionalInfoFields: [
            {
              label: 'Email comprador',
              value: 'billing@acme.dev',
            },
            {
              label: 'Direccion comprador',
              value: 'Av. Amazonas N34-451 y Av. Atahualpa',
            },
            {
              label: 'Direccion matriz',
              value: 'Av. Principal y Calle Secundaria',
            },
            {
              label: 'Direccion establecimiento',
              value: 'Sucursal Matriz',
            },
            {
              label: 'Notas',
              value: 'Primer borrador para onboarding de invoicing.',
            },
          ],
        },
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/ride/html should return printable RIDE html', async () => {
    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/invoice_001/electronic-document/ride/html',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect((response) => {
        expect(response.text).toContain('<!doctype html>');
        expect(response.text).toContain('RIDE');
        expect(response.text).toContain('Clave de acceso');
        expect(response.text).toContain('Acme Corp');
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/ride/html should return printable debit note RIDE html', async () => {
    getTenantInvoiceDocumentUseCase.execute.mockResolvedValueOnce(
      debitNoteDocumentView,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/debit_note_001/electronic-document/ride/html',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect((response) => {
        expect(response.text).toContain('<!doctype html>');
        expect(response.text).toContain('RIDE Nota de debito');
        expect(response.text).toContain('Documento modificado');
        expect(response.text).toContain('Acme Corp');
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'debit_note_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/ride should return the electronic RIDE view for a credit note', async () => {
    getTenantInvoiceDocumentUseCase.execute.mockResolvedValueOnce(
      creditNoteDocumentView,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/credit_note_001/electronic-document/ride',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        issuer: creditNoteDocumentView.issuer,
        customer: creditNoteDocumentView.customer,
        invoice: {
          id: 'credit_note_001',
          tenantId: 'tenant_123',
          customerId: 'customer_acme',
          number: '003-001-000000012',
          documentCode: '04',
          establishmentCode: '003',
          emissionPointCode: '001',
          sequenceNumber: 12,
          buyerIdentificationType: '04',
          buyerIdentification: '1790012345001',
          buyerName: 'Acme Corp',
          buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
          electronicStatus: null,
          accessKey: null,
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage: null,
          signedAt: null,
          submittedAt: null,
          submissionReference: null,
          status: 'draft',
          currency: 'USD',
          issuedAt: '2026-05-07T16:00:00.000Z',
          dueAt: null,
          notes: 'Nota de credito de prueba.',
          createdAt: '2026-05-07T16:00:00.000Z',
          updatedAt: '2026-05-07T16:00:00.000Z',
        },
        lines: [
          {
            id: 'credit_note_item_001',
            position: 1,
            description: 'Suscripcion mensual Growth',
            quantity: 2,
            unitPriceInCents: 5000,
            lineSubtotalInCents: 10000,
            taxRateId: 'tax_rate_vat_12',
            taxRateName: 'VAT 12%',
            taxRatePercentage: 12,
            lineTaxInCents: 1200,
            lineTotalInCents: 11200,
          },
          {
            id: 'credit_note_item_002',
            position: 2,
            description: 'Setup inicial',
            quantity: 1,
            unitPriceInCents: 2500,
            lineSubtotalInCents: 2500,
            taxRateId: null,
            taxRateName: null,
            taxRatePercentage: null,
            lineTaxInCents: 0,
            lineTotalInCents: 2500,
          },
        ],
        totals: {
          subtotalInCents: 12500,
          taxInCents: 1200,
          totalInCents: 13700,
        },
        ride: {
          documentLabel: 'RIDE Nota de credito',
          environmentLabel: 'PRUEBAS',
          emissionTypeLabel: 'NORMAL',
          sequenceDisplay: '000000012',
          electronicStatusLabel: 'Sin estado electronico',
          canBePrintedAsAuthorized: false,
          accessKey: null,
          accessKeyChunks: [],
          authorizationNumber: null,
          authorizedAt: null,
          authorizationMessage: null,
          additionalInfoFields: [
            {
              label: 'Email comprador',
              value: 'billing@acme.dev',
            },
            {
              label: 'Direccion comprador',
              value: 'Av. Amazonas N34-451 y Av. Atahualpa',
            },
            {
              label: 'Direccion matriz',
              value: 'Av. Principal y Calle Secundaria',
            },
            {
              label: 'Direccion establecimiento',
              value: 'Sucursal Matriz',
            },
            {
              label: 'Documento modificado',
              value: 'INV-001',
            },
            {
              label: 'Fecha documento sustento',
              value: '2026-04-27T16:00:00.000Z',
            },
            {
              label: 'Motivo',
              value: 'Devolucion parcial de la factura origen.',
            },
            {
              label: 'Notas',
              value: 'Nota de credito de prueba.',
            },
          ],
        },
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'credit_note_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/ride should return the electronic RIDE view for a debit note', async () => {
    getTenantInvoiceDocumentUseCase.execute.mockResolvedValueOnce(
      debitNoteDocumentView,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/debit_note_001/electronic-document/ride',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        issuer: debitNoteDocumentView.issuer,
        customer: debitNoteDocumentView.customer,
        invoice: {
          id: 'debit_note_001',
          tenantId: 'tenant_123',
          customerId: 'customer_acme',
          number: '004-001-000000007',
          documentCode: '05',
          establishmentCode: '004',
          emissionPointCode: '001',
          sequenceNumber: 7,
          buyerIdentificationType: '04',
          buyerIdentification: '1790012345001',
          buyerName: 'Acme Corp',
          buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
          electronicStatus: null,
          accessKey: null,
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage: null,
          signedAt: null,
          submittedAt: null,
          submissionReference: null,
          status: 'draft',
          currency: 'USD',
          issuedAt: '2026-05-08T16:00:00.000Z',
          dueAt: '2026-05-11T16:00:00.000Z',
          notes: 'Nota de debito de prueba.',
          createdAt: '2026-05-08T16:00:00.000Z',
          updatedAt: '2026-05-08T16:00:00.000Z',
        },
        lines: [
          {
            id: 'debit_note_item_001',
            position: 1,
            description: 'Interes por mora de la factura origen.',
            quantity: 1,
            unitPriceInCents: 2500,
            lineSubtotalInCents: 2500,
            taxRateId: 'tax_rate_vat_12',
            taxRateName: 'VAT 12%',
            taxRatePercentage: 12,
            lineTaxInCents: 300,
            lineTotalInCents: 2800,
          },
        ],
        totals: {
          subtotalInCents: 2500,
          taxInCents: 300,
          totalInCents: 2800,
        },
        ride: {
          documentLabel: 'RIDE Nota de debito',
          environmentLabel: 'PRUEBAS',
          emissionTypeLabel: 'NORMAL',
          sequenceDisplay: '000000007',
          electronicStatusLabel: 'Sin estado electronico',
          canBePrintedAsAuthorized: false,
          accessKey: null,
          accessKeyChunks: [],
          authorizationNumber: null,
          authorizedAt: null,
          authorizationMessage: null,
          additionalInfoFields: [
            {
              label: 'Email comprador',
              value: 'billing@acme.dev',
            },
            {
              label: 'Direccion comprador',
              value: 'Av. Amazonas N34-451 y Av. Atahualpa',
            },
            {
              label: 'Direccion matriz',
              value: 'Av. Principal y Calle Secundaria',
            },
            {
              label: 'Direccion establecimiento',
              value: 'Sucursal Matriz',
            },
            {
              label: 'Documento modificado',
              value: 'INV-001',
            },
            {
              label: 'Fecha documento sustento',
              value: '2026-04-27T16:00:00.000Z',
            },
            {
              label: 'Motivo',
              value: 'Interes por mora de la factura origen.',
            },
            {
              label: 'Notas',
              value: 'Nota de debito de prueba.',
            },
          ],
        },
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'debit_note_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/ride should return the electronic RIDE view for a withholding', async () => {
    getTenantInvoiceDocumentUseCase.execute.mockResolvedValueOnce(
      withholdingDocumentView,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/withholding_001/electronic-document/ride',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        issuer: withholdingDocumentView.issuer,
        customer: withholdingDocumentView.customer,
        invoice: {
          id: 'withholding_001',
          tenantId: 'tenant_123',
          customerId: 'customer_acme',
          number: '005-001-000000009',
          documentCode: '07',
          establishmentCode: '005',
          emissionPointCode: '001',
          sequenceNumber: 9,
          buyerIdentificationType: '04',
          buyerIdentification: '1790012345001',
          buyerName: 'Acme Corp',
          buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
          electronicStatus: null,
          accessKey: null,
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage: null,
          signedAt: null,
          submittedAt: null,
          submissionReference: null,
          status: 'draft',
          currency: 'USD',
          issuedAt: '2026-05-08T19:30:00.000Z',
          dueAt: null,
          notes: 'Comprobante de retencion de prueba.',
          createdAt: '2026-05-08T19:30:00.000Z',
          updatedAt: '2026-05-08T19:30:00.000Z',
        },
        lines: [
          {
            id: 'withholding_item_001',
            position: 1,
            description: 'Retencion sobre la factura origen.',
            quantity: 1,
            unitPriceInCents: 1000,
            lineSubtotalInCents: 1000,
            taxRateId: 'tax_rate_vat_12',
            taxRateName: 'VAT 12%',
            taxRatePercentage: 12,
            lineTaxInCents: 0,
            lineTotalInCents: 1000,
          },
        ],
        totals: {
          subtotalInCents: 1000,
          taxInCents: 0,
          totalInCents: 1000,
        },
        ride: {
          documentLabel: 'RIDE Comprobante de retencion',
          environmentLabel: 'PRUEBAS',
          emissionTypeLabel: 'NORMAL',
          sequenceDisplay: '000000009',
          electronicStatusLabel: 'Sin estado electronico',
          canBePrintedAsAuthorized: false,
          accessKey: null,
          accessKeyChunks: [],
          authorizationNumber: null,
          authorizedAt: null,
          authorizationMessage: null,
          additionalInfoFields: [
            {
              label: 'Email comprador',
              value: 'billing@acme.dev',
            },
            {
              label: 'Direccion comprador',
              value: 'Av. Amazonas N34-451 y Av. Atahualpa',
            },
            {
              label: 'Direccion matriz',
              value: 'Av. Principal y Calle Secundaria',
            },
            {
              label: 'Direccion establecimiento',
              value: 'Sucursal Matriz',
            },
            {
              label: 'Documento modificado',
              value: 'INV-001',
            },
            {
              label: 'Fecha documento sustento',
              value: '2026-04-27T16:00:00.000Z',
            },
            {
              label: 'Motivo',
              value: 'Retencion sobre la factura origen.',
            },
            {
              label: 'Notas',
              value: 'Comprobante de retencion de prueba.',
            },
          ],
        },
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'withholding_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/ride should return the electronic RIDE view for a remission guide', async () => {
    getTenantInvoiceDocumentUseCase.execute.mockResolvedValueOnce(
      remissionGuideDocumentView,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/remission_001/electronic-document/ride',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.invoice.number).toBe('006-001-000000004');
        expect(response.body.ride.documentLabel).toBe('RIDE Guia de remision');
        expect(response.body.ride.additionalInfoFields).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              label: 'Direccion partida',
              value: 'Sucursal Matriz',
            }),
            expect.objectContaining({
              label: 'Transportista',
              value: 'Transportes Demo S.A.',
            }),
            expect.objectContaining({
              label: 'Placa',
              value: 'ABC-1234',
            }),
          ]),
        );
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'remission_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/artifacts should return formal electronic artifact metadata', async () => {
    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/invoice_001/electronic-document/artifacts',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        fileBaseName: '1790012345001-invoice-000-000-inv-001',
        rideHtmlFileName: '1790012345001-invoice-000-000-inv-001-ride.html',
        xmlFileName: '1790012345001-invoice-000-000-inv-001.xml',
        accessKey: null,
        electronicStatus: null,
        canDownloadRide: true,
        canDownloadXml: false,
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/artifacts should return credit note electronic artifact metadata', async () => {
    getTenantInvoiceDocumentUseCase.execute.mockResolvedValueOnce(
      creditNoteDocumentView,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/credit_note_001/electronic-document/artifacts',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        fileBaseName: '1790012345001-04-003-001-000000012',
        rideHtmlFileName: '1790012345001-04-003-001-000000012-ride.html',
        xmlFileName: '1790012345001-04-003-001-000000012.xml',
        accessKey: null,
        electronicStatus: null,
        canDownloadRide: true,
        canDownloadXml: true,
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'credit_note_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/artifacts should return debit note electronic artifact metadata', async () => {
    getTenantInvoiceDocumentUseCase.execute.mockResolvedValueOnce(
      debitNoteDocumentView,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/debit_note_001/electronic-document/artifacts',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        fileBaseName: '1790012345001-05-004-001-000000007',
        rideHtmlFileName: '1790012345001-05-004-001-000000007-ride.html',
        xmlFileName: '1790012345001-05-004-001-000000007.xml',
        accessKey: null,
        electronicStatus: null,
        canDownloadRide: true,
        canDownloadXml: true,
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'debit_note_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/artifacts should return withholding electronic artifact metadata', async () => {
    getTenantInvoiceDocumentUseCase.execute.mockResolvedValueOnce(
      withholdingDocumentView,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/withholding_001/electronic-document/artifacts',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        fileBaseName: '1790012345001-07-005-001-000000009',
        rideHtmlFileName: '1790012345001-07-005-001-000000009-ride.html',
        xmlFileName: '1790012345001-07-005-001-000000009.xml',
        accessKey: null,
        electronicStatus: null,
        canDownloadRide: true,
        canDownloadXml: true,
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'withholding_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/artifacts should return remission guide electronic artifact metadata', async () => {
    getTenantInvoiceDocumentUseCase.execute.mockResolvedValueOnce(
      remissionGuideDocumentView,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/remission_001/electronic-document/artifacts',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        fileBaseName: '1790012345001-06-006-001-000000004',
        rideHtmlFileName: '1790012345001-06-006-001-000000004-ride.html',
        xmlFileName: '1790012345001-06-006-001-000000004.xml',
        accessKey: null,
        electronicStatus: null,
        canDownloadRide: true,
        canDownloadXml: true,
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'remission_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/xml should return the Ecuador XML preview', async () => {
    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/invoice_001/electronic-document/xml',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect('Content-Type', /application\/xml/)
      .expect((response) => {
        expect(response.text).toContain('<factura id="comprobante" version="2.1.0">');
        expect(response.text).toContain(
          '<claveAcceso>2904202601179001234500110010020000000311234567815</claveAcceso>',
        );
      });

    expect(
      getTenantInvoiceElectronicXmlPreviewUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform', 'invoice_001');
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/xml should return the Ecuador credit note XML preview', async () => {
    getTenantInvoiceElectronicXmlPreviewUseCase.execute.mockResolvedValueOnce(
      creditNoteXmlPreview,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/credit_note_001/electronic-document/xml',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect('Content-Type', /application\/xml/)
      .expect((response) => {
        expect(response.text).toContain(
          '<notaCredito id="comprobante" version="1.0.0">',
        );
        expect(response.text).toContain('<codDoc>04</codDoc>');
        expect(response.text).toContain(
          '<numDocModificado>INV-001</numDocModificado>',
        );
      });

    expect(
      getTenantInvoiceElectronicXmlPreviewUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform', 'credit_note_001');
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/xml should return the Ecuador debit note XML preview', async () => {
    getTenantInvoiceElectronicXmlPreviewUseCase.execute.mockResolvedValueOnce(
      debitNoteXmlPreview,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/debit_note_001/electronic-document/xml',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect('Content-Type', /application\/xml/)
      .expect((response) => {
        expect(response.text).toContain(
          '<notaDebito id="comprobante" version="1.0.0">',
        );
        expect(response.text).toContain('<codDoc>05</codDoc>');
        expect(response.text).toContain(
          '<numDocModificado>INV-001</numDocModificado>',
        );
        expect(response.text).toContain('<valorTotal>28.00</valorTotal>');
      });

    expect(
      getTenantInvoiceElectronicXmlPreviewUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform', 'debit_note_001');
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/xml should return the Ecuador withholding XML preview', async () => {
    getTenantInvoiceElectronicXmlPreviewUseCase.execute.mockResolvedValueOnce(
      withholdingXmlPreview,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/withholding_001/electronic-document/xml',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect('Content-Type', /application\/xml/)
      .expect((response) => {
        expect(response.text).toContain(
          '<comprobanteRetencion id="comprobante" version="2.0.0">',
        );
        expect(response.text).toContain('<codDoc>07</codDoc>');
        expect(response.text).toContain('<periodoFiscal>05/2026</periodoFiscal>');
        expect(response.text).toContain('<valorRetenido>10.00</valorRetenido>');
      });

    expect(
      getTenantInvoiceElectronicXmlPreviewUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform', 'withholding_001');
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/xml should return the Ecuador remission guide XML preview', async () => {
    getTenantInvoiceElectronicXmlPreviewUseCase.execute.mockResolvedValueOnce(
      remissionGuideXmlPreview,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/remission_001/electronic-document/xml',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect('Content-Type', /application\/xml/)
      .expect((response) => {
        expect(response.text).toContain(
          '<guiaRemision id="comprobante" version="1.0.0">',
        );
        expect(response.text).toContain('<codDoc>06</codDoc>');
        expect(response.text).toContain(
          '<motivoTraslado>Traslado de mercaderia al cliente.</motivoTraslado>',
        );
      });

    expect(
      getTenantInvoiceElectronicXmlPreviewUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform', 'remission_001');
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/ride/download should return the RIDE as attachment', async () => {
    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/invoice_001/electronic-document/ride/download',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect('Content-Disposition', /attachment; filename=/)
      .expect((response) => {
        expect(response.text).toContain('RIDE');
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/ride/download should return the debit note RIDE as attachment', async () => {
    getTenantInvoiceDocumentUseCase.execute.mockResolvedValueOnce(
      debitNoteDocumentView,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/debit_note_001/electronic-document/ride/download',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect('Content-Disposition', /attachment; filename=/)
      .expect((response) => {
        expect(response.text).toContain('RIDE Nota de debito');
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'debit_note_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/ride/download should return the remission guide RIDE as attachment', async () => {
    getTenantInvoiceDocumentUseCase.execute.mockResolvedValueOnce(
      remissionGuideDocumentView,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/remission_001/electronic-document/ride/download',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect('Content-Type', /text\/html/)
      .expect('Content-Disposition', /attachment; filename=/)
      .expect((response) => {
        expect(response.text).toContain('RIDE Guia de remision');
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'remission_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/xml/download should return the XML as attachment', async () => {
    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/invoice_001/electronic-document/xml/download',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect('Content-Type', /application\/xml/)
      .expect('Content-Disposition', /attachment; filename=/)
      .expect((response) => {
        expect(response.text).toContain('<factura id="comprobante" version="2.1.0">');
      });

    expect(getTenantInvoiceDocumentUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice_001',
    );
    expect(
      getTenantInvoiceElectronicXmlPreviewUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform', 'invoice_001');
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/xml/download should return the debit note XML as attachment', async () => {
    getTenantInvoiceElectronicXmlPreviewUseCase.execute.mockResolvedValueOnce(
      debitNoteXmlPreview,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/debit_note_001/electronic-document/xml/download',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect('Content-Type', /application\/xml/)
      .expect('Content-Disposition', /attachment; filename=/)
      .expect((response) => {
        expect(response.text).toContain(
          '<notaDebito id="comprobante" version="1.0.0">',
        );
      });

    expect(
      getTenantInvoiceElectronicXmlPreviewUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform', 'debit_note_001');
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/xml/download should return the remission guide XML as attachment', async () => {
    getTenantInvoiceElectronicXmlPreviewUseCase.execute.mockResolvedValueOnce(
      remissionGuideXmlPreview,
    );

    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/remission_001/electronic-document/xml/download',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect('Content-Type', /application\/xml/)
      .expect('Content-Disposition', /attachment; filename=/)
      .expect((response) => {
        expect(response.text).toContain(
          '<guiaRemision id="comprobante" version="1.0.0">',
        );
      });

    expect(
      getTenantInvoiceElectronicXmlPreviewUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform', 'remission_001');
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/send-email should trigger invoice delivery', async () => {
    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/invoices/invoice_001/send-email')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        recipientEmail: 'finance@acme.dev',
        message: 'Adjuntamos la factura del periodo.',
      })
      .expect(201)
      .expect({
        delivered: true,
      });

    expect(sendTenantInvoiceEmailUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'invoice_001',
      recipientEmail: 'finance@acme.dev',
      message: 'Adjuntamos la factura del periodo.',
    });
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/submit should sign and submit the electronic invoice through the stub pipeline', async () => {
    await request(httpServer)
      .post(
        '/api/invoicing/tenants/saas-platform/invoices/invoice_001/electronic-document/submit',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201)
      .expect({
        submitted: true,
        electronicStatus: 'submitted',
        accessKey: '2904202601179001234500110010020000000311234567815',
        submittedAt: '2026-05-01T15:20:05.000Z',
        submissionReference: 'stub-sri-invoice_001-1746112805000',
      });

    expect(
      submitTenantInvoiceElectronicDocumentUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'invoice_001',
    });
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/submit-presigned should submit an externally signed XML', async () => {
    await request(httpServer)
      .post(
        '/api/invoicing/tenants/saas-platform/invoices/invoice_001/electronic-document/submit-presigned',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        signedXml:
          '<factura id="comprobante" version="2.1.0"><infoTributaria><claveAcceso>2904202601179001234500110010020000000311234567815</claveAcceso></infoTributaria><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"></ds:Signature></factura>',
        signerName: 'sandbox-signer',
      })
      .expect(201)
      .expect({
        submitted: true,
        electronicStatus: 'submitted',
        accessKey: '2904202601179001234500110010020000000311234567815',
        submittedAt: '2026-05-02T18:26:00.000Z',
        submissionReference: 'stub-sri-presigned-invoice_001-123456789',
      });

    expect(
      submitTenantPresignedInvoiceElectronicDocumentUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'invoice_001',
      signedXml:
        '<factura id="comprobante" version="2.1.0"><infoTributaria><claveAcceso>2904202601179001234500110010020000000311234567815</claveAcceso></infoTributaria><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"></ds:Signature></factura>',
      signerName: 'sandbox-signer',
    });
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/submit should return 400 when the generated Ecuador XML fails validation', async () => {
    submitTenantInvoiceElectronicDocumentUseCase.execute.mockRejectedValueOnce(
      new InvoiceElectronicXmlValidationError([
        'invoice.xml:12: element ptoEmi: [facet \'pattern\'] The value \'02\' is not accepted by the pattern',
      ]),
    );

    await request(httpServer)
      .post(
        '/api/invoicing/tenants/saas-platform/invoices/invoice_001/electronic-document/submit',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toContain(
          'El XML del comprobante electronico no paso la validacion previa',
        );
        expect(response.body.message).toContain('invoice.xml:12: element ptoEmi');
      });

    expect(
      submitTenantInvoiceElectronicDocumentUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'invoice_001',
    });
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/submit should return 400 when remote sandbox readiness is still blocked', async () => {
    submitTenantInvoiceElectronicDocumentUseCase.execute.mockRejectedValueOnce(
      new InvoiceElectronicRemoteSubmissionReadinessError(
        'saas-platform',
        'invoice_001',
        'La firma stub_local sirve para demos y previews, pero no genera una firma valida para el esquema offline del SRI.',
      ),
    );

    await request(httpServer)
      .post(
        '/api/invoicing/tenants/saas-platform/invoices/invoice_001/electronic-document/submit',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(400)
      .expect((response) => {
        expect(response.body.message).toContain(
          'not ready for remote SRI offline submission',
        );
      });
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/submit should also submit a credit note when its XSD support is available', async () => {
    submitTenantInvoiceElectronicDocumentUseCase.execute.mockResolvedValueOnce(
      creditNoteDraftInvoice.updateElectronicStatus(
        {
          electronicStatus: 'submitted',
          accessKey: '020520260117900123450010030010000000121234567815',
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage:
            'Nota de credito firmada y enviada al gateway stub del SRI. Pendiente de autorizacion real.',
          signedAt: new Date('2026-05-03T10:10:00.000Z'),
          submittedAt: new Date('2026-05-03T10:10:05.000Z'),
          submissionReference: 'stub-sri-credit_note_001-1746267005000',
        },
        new Date('2026-05-03T10:10:05.000Z'),
      ),
    );

    await request(httpServer)
      .post(
        '/api/invoicing/tenants/saas-platform/invoices/credit_note_001/electronic-document/submit',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201)
      .expect({
        submitted: true,
        electronicStatus: 'submitted',
        accessKey: '020520260117900123450010030010000000121234567815',
        submittedAt: '2026-05-03T10:10:05.000Z',
        submissionReference: 'stub-sri-credit_note_001-1746267005000',
      });

    expect(
      submitTenantInvoiceElectronicDocumentUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'credit_note_001',
    });
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/submit-presigned should also submit a credit note when its XSD support is available', async () => {
    submitTenantPresignedInvoiceElectronicDocumentUseCase.execute.mockResolvedValueOnce(
      creditNoteDraftInvoice.updateElectronicStatus(
        {
          electronicStatus: 'submitted',
          accessKey: '020520260117900123450010030010000000121234567815',
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage:
            'XML firmado externamente por sandbox-signer. Nota de credito enviada al gateway stub del SRI.',
          signedAt: new Date('2026-05-03T10:11:00.000Z'),
          submittedAt: new Date('2026-05-03T10:11:10.000Z'),
          submissionReference: 'stub-sri-presigned-credit_note_001-123456789',
        },
        new Date('2026-05-03T10:11:10.000Z'),
      ),
    );

    await request(httpServer)
      .post(
        '/api/invoicing/tenants/saas-platform/invoices/credit_note_001/electronic-document/submit-presigned',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        signedXml:
          '<notaCredito id="comprobante" version="1.0.0"><infoTributaria><codDoc>04</codDoc><claveAcceso>020520260117900123450010030010000000121234567815</claveAcceso></infoTributaria><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"></ds:Signature></notaCredito>',
        signerName: 'sandbox-signer',
      })
      .expect(201)
      .expect({
        submitted: true,
        electronicStatus: 'submitted',
        accessKey: '020520260117900123450010030010000000121234567815',
        submittedAt: '2026-05-03T10:11:10.000Z',
        submissionReference: 'stub-sri-presigned-credit_note_001-123456789',
      });

    expect(
      submitTenantPresignedInvoiceElectronicDocumentUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'credit_note_001',
      signedXml:
        '<notaCredito id="comprobante" version="1.0.0"><infoTributaria><codDoc>04</codDoc><claveAcceso>020520260117900123450010030010000000121234567815</claveAcceso></infoTributaria><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"></ds:Signature></notaCredito>',
      signerName: 'sandbox-signer',
    });
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/submit should also submit a debit note when its XSD support is available', async () => {
    submitTenantInvoiceElectronicDocumentUseCase.execute.mockResolvedValueOnce(
      debitNoteDraftInvoice.updateElectronicStatus(
        {
          electronicStatus: 'submitted',
          accessKey: '080520260517900123450010040010000000071234567814',
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage:
            'Nota de debito firmada y enviada al gateway stub del SRI. Pendiente de autorizacion real.',
          signedAt: new Date('2026-05-08T18:10:00.000Z'),
          submittedAt: new Date('2026-05-08T18:10:05.000Z'),
          submissionReference: 'stub-sri-debit_note_001-1746727805000',
        },
        new Date('2026-05-08T18:10:05.000Z'),
      ),
    );

    await request(httpServer)
      .post(
        '/api/invoicing/tenants/saas-platform/invoices/debit_note_001/electronic-document/submit',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201)
      .expect({
        submitted: true,
        electronicStatus: 'submitted',
        accessKey: '080520260517900123450010040010000000071234567814',
        submittedAt: '2026-05-08T18:10:05.000Z',
        submissionReference: 'stub-sri-debit_note_001-1746727805000',
      });

    expect(
      submitTenantInvoiceElectronicDocumentUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'debit_note_001',
    });
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/submit-presigned should also submit a debit note when its XSD support is available', async () => {
    submitTenantPresignedInvoiceElectronicDocumentUseCase.execute.mockResolvedValueOnce(
      debitNoteDraftInvoice.updateElectronicStatus(
        {
          electronicStatus: 'submitted',
          accessKey: '080520260517900123450010040010000000071234567814',
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage:
            'XML firmado externamente por sandbox-signer. Nota de debito enviada al gateway stub del SRI.',
          signedAt: new Date('2026-05-08T18:11:00.000Z'),
          submittedAt: new Date('2026-05-08T18:11:10.000Z'),
          submissionReference: 'stub-sri-presigned-debit_note_001-123456789',
        },
        new Date('2026-05-08T18:11:10.000Z'),
      ),
    );

    await request(httpServer)
      .post(
        '/api/invoicing/tenants/saas-platform/invoices/debit_note_001/electronic-document/submit-presigned',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        signedXml:
          '<notaDebito id="comprobante" version="1.0.0"><infoTributaria><codDoc>05</codDoc><claveAcceso>080520260517900123450010040010000000071234567814</claveAcceso></infoTributaria><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"></ds:Signature></notaDebito>',
        signerName: 'sandbox-signer',
      })
      .expect(201)
      .expect({
        submitted: true,
        electronicStatus: 'submitted',
        accessKey: '080520260517900123450010040010000000071234567814',
        submittedAt: '2026-05-08T18:11:10.000Z',
        submissionReference: 'stub-sri-presigned-debit_note_001-123456789',
      });

    expect(
      submitTenantPresignedInvoiceElectronicDocumentUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'debit_note_001',
      signedXml:
        '<notaDebito id="comprobante" version="1.0.0"><infoTributaria><codDoc>05</codDoc><claveAcceso>080520260517900123450010040010000000071234567814</claveAcceso></infoTributaria><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"></ds:Signature></notaDebito>',
      signerName: 'sandbox-signer',
    });
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/submit should also submit a withholding when its XSD support is available', async () => {
    submitTenantInvoiceElectronicDocumentUseCase.execute.mockResolvedValueOnce(
      withholdingDraftInvoice.updateElectronicStatus(
        {
          electronicStatus: 'submitted',
          accessKey: '080520260717900123450010050010000000091234567813',
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage:
            'Comprobante de retencion firmado y enviado al gateway stub del SRI. Pendiente de autorizacion real.',
          signedAt: new Date('2026-05-08T19:50:00.000Z'),
          submittedAt: new Date('2026-05-08T19:50:05.000Z'),
          submissionReference: 'stub-sri-withholding_001-1746733805000',
        },
        new Date('2026-05-08T19:50:05.000Z'),
      ),
    );

    await request(httpServer)
      .post(
        '/api/invoicing/tenants/saas-platform/invoices/withholding_001/electronic-document/submit',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201)
      .expect({
        submitted: true,
        electronicStatus: 'submitted',
        accessKey: '080520260717900123450010050010000000091234567813',
        submittedAt: '2026-05-08T19:50:05.000Z',
        submissionReference: 'stub-sri-withholding_001-1746733805000',
      });

    expect(
      submitTenantInvoiceElectronicDocumentUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'withholding_001',
    });
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/submit-presigned should also submit a withholding when its XSD support is available', async () => {
    submitTenantPresignedInvoiceElectronicDocumentUseCase.execute.mockResolvedValueOnce(
      withholdingDraftInvoice.updateElectronicStatus(
        {
          electronicStatus: 'submitted',
          accessKey: '080520260717900123450010050010000000091234567813',
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage:
            'XML firmado externamente por sandbox-signer. Comprobante de retencion enviado al gateway stub del SRI.',
          signedAt: new Date('2026-05-08T19:51:00.000Z'),
          submittedAt: new Date('2026-05-08T19:51:10.000Z'),
          submissionReference: 'stub-sri-presigned-withholding_001-123456789',
        },
        new Date('2026-05-08T19:51:10.000Z'),
      ),
    );

    await request(httpServer)
      .post(
        '/api/invoicing/tenants/saas-platform/invoices/withholding_001/electronic-document/submit-presigned',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        signedXml:
          '<comprobanteRetencion id="comprobante" version="2.0.0"><infoTributaria><codDoc>07</codDoc><claveAcceso>080520260717900123450010050010000000091234567813</claveAcceso></infoTributaria><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"></ds:Signature></comprobanteRetencion>',
        signerName: 'sandbox-signer',
      })
      .expect(201)
      .expect({
        submitted: true,
        electronicStatus: 'submitted',
        accessKey: '080520260717900123450010050010000000091234567813',
        submittedAt: '2026-05-08T19:51:10.000Z',
        submissionReference: 'stub-sri-presigned-withholding_001-123456789',
      });

    expect(
      submitTenantPresignedInvoiceElectronicDocumentUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'withholding_001',
      signedXml:
        '<comprobanteRetencion id="comprobante" version="2.0.0"><infoTributaria><codDoc>07</codDoc><claveAcceso>080520260717900123450010050010000000091234567813</claveAcceso></infoTributaria><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"></ds:Signature></comprobanteRetencion>',
      signerName: 'sandbox-signer',
    });
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/submit should also submit a remission guide when its XSD support is available', async () => {
    submitTenantInvoiceElectronicDocumentUseCase.execute.mockResolvedValueOnce(
      remissionGuideDraftInvoice.updateElectronicStatus(
        {
          electronicStatus: 'submitted',
          accessKey: '120520260617900123450010060010000000041234567810',
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage:
            'Guia de remision firmada y enviada al gateway stub del SRI. Pendiente de autorizacion real.',
          signedAt: new Date('2026-05-12T15:41:00.000Z'),
          submittedAt: new Date('2026-05-12T15:41:08.000Z'),
          submissionReference: 'stub-sri-remission_001-1747064468000',
        },
        new Date('2026-05-12T15:41:08.000Z'),
      ),
    );

    await request(httpServer)
      .post(
        '/api/invoicing/tenants/saas-platform/invoices/remission_001/electronic-document/submit',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201)
      .expect({
        submitted: true,
        electronicStatus: 'submitted',
        accessKey: '120520260617900123450010060010000000041234567810',
        submittedAt: '2026-05-12T15:41:08.000Z',
        submissionReference: 'stub-sri-remission_001-1747064468000',
      });

    expect(
      submitTenantInvoiceElectronicDocumentUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'remission_001',
    });
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/submit-presigned should also submit a remission guide when its XSD support is available', async () => {
    submitTenantPresignedInvoiceElectronicDocumentUseCase.execute.mockResolvedValueOnce(
      remissionGuideDraftInvoice.updateElectronicStatus(
        {
          electronicStatus: 'submitted',
          accessKey: '120520260617900123450010060010000000041234567810',
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage:
            'XML firmado externamente por sandbox-signer. Guia de remision enviada al gateway stub del SRI.',
          signedAt: new Date('2026-05-12T15:42:00.000Z'),
          submittedAt: new Date('2026-05-12T15:42:09.000Z'),
          submissionReference: 'stub-sri-presigned-remission_001-123456789',
        },
        new Date('2026-05-12T15:42:09.000Z'),
      ),
    );

    await request(httpServer)
      .post(
        '/api/invoicing/tenants/saas-platform/invoices/remission_001/electronic-document/submit-presigned',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        signedXml:
          '<guiaRemision id="comprobante" version="1.0.0"><infoTributaria><codDoc>06</codDoc><claveAcceso>120520260617900123450010060010000000041234567810</claveAcceso></infoTributaria><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"></ds:Signature></guiaRemision>',
        signerName: 'sandbox-signer',
      })
      .expect(201)
      .expect({
        submitted: true,
        electronicStatus: 'submitted',
        accessKey: '120520260617900123450010060010000000041234567810',
        submittedAt: '2026-05-12T15:42:09.000Z',
        submissionReference: 'stub-sri-presigned-remission_001-123456789',
      });

    expect(
      submitTenantPresignedInvoiceElectronicDocumentUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'remission_001',
      signedXml:
        '<guiaRemision id="comprobante" version="1.0.0"><infoTributaria><codDoc>06</codDoc><claveAcceso>120520260617900123450010060010000000041234567810</claveAcceso></infoTributaria><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#"></ds:Signature></guiaRemision>',
      signerName: 'sandbox-signer',
    });
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-document/check-authorization should resolve the stub authorization state', async () => {
    getTenantInvoiceDetailUseCase.execute.mockResolvedValueOnce({
      invoice: draftInvoice.updateElectronicStatus(
        {
          electronicStatus: 'authorized',
          accessKey:
            '2904202601179001234500110010020000000311234567815',
          authorizationNumber:
            '2904202601179001234500110010020000000311234567815',
          authorizedAt: new Date('2026-05-01T15:25:00.000Z'),
          electronicStatusMessage:
            'Documento autorizado por el stub del SRI. Listo para reemplazar por polling real.',
          signedAt: new Date('2026-05-01T15:20:00.000Z'),
          submittedAt: new Date('2026-05-01T15:20:05.000Z'),
          submissionReference: 'stub-sri-invoice_001-1746112805000',
        },
        new Date('2026-05-01T15:25:00.000Z'),
      ),
      items: [firstInvoiceItem, secondInvoiceItem],
      payments: [],
      electronicEvents: [invoiceElectronicEvent],
      totals: {
        subtotalInCents: 12500,
        taxInCents: 1200,
        totalInCents: 13700,
      },
      settlement: {
        paidInCents: 0,
        balanceDueInCents: 13700,
        isFullyPaid: false,
      },
    });

    await request(httpServer)
      .post(
        '/api/invoicing/tenants/saas-platform/invoices/invoice_001/electronic-document/check-authorization',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201)
      .expect((response) => {
        expect(response.body.electronicStatus).toBe('authorized');
        expect(response.body.authorizationNumber).toBe(
          '2904202601179001234500110010020000000311234567815',
        );
        expect(response.body.submissionReference).toBe(
          'stub-sri-invoice_001-1746112805000',
        );
      });

    expect(
      checkTenantInvoiceElectronicAuthorizationUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'invoice_001',
    });
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/status should update the invoice lifecycle status', async () => {
    getTenantInvoiceDetailUseCase.execute.mockResolvedValueOnce({
      invoice: Invoice.create({
        id: 'invoice_001',
        tenantId: 'tenant_123',
        customerId: 'customer_acme',
        number: 'INV-001',
        status: 'issued',
        currency: 'USD',
        issuedAt: invoiceCreatedAt,
        dueAt: new Date('2026-05-11T16:00:00.000Z'),
        notes: 'Primer borrador para onboarding de invoicing.',
        createdAt: invoiceCreatedAt,
        updatedAt: new Date('2026-04-28T23:00:00.000Z'),
      }),
      items: [firstInvoiceItem, secondInvoiceItem],
      payments: [],
      electronicEvents: [],
      totals: {
        subtotalInCents: 12500,
        taxInCents: 1200,
        totalInCents: 13700,
      },
      settlement: {
        paidInCents: 0,
        balanceDueInCents: 13700,
        isFullyPaid: false,
      },
    });

    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/invoices/invoice_001/status')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ status: 'issued' })
      .expect(201)
      .expect((response) => {
        expect(response.body.status).toBe('issued');
        expect(response.body.id).toBe('invoice_001');
      });

    expect(updateTenantInvoiceStatusUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'invoice_001',
      status: 'issued',
    });
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/electronic-status should update the SRI authorization state', async () => {
    getTenantInvoiceDetailUseCase.execute.mockResolvedValueOnce({
      invoice: draftInvoice.updateElectronicStatus(
        {
          electronicStatus: 'authorized',
          accessKey:
            '2904202601179001234500110010020000000311234567815',
          authorizationNumber:
            '2904202601179001234500110010020000000311234567815',
          authorizedAt: new Date('2026-04-29T17:00:00.000Z'),
          electronicStatusMessage: 'AUTORIZADO',
          signedAt: null,
          submittedAt: null,
          submissionReference: null,
        },
        new Date('2026-04-29T17:00:00.000Z'),
      ),
      items: [firstInvoiceItem, secondInvoiceItem],
      payments: [],
      electronicEvents: [],
      totals: {
        subtotalInCents: 12500,
        taxInCents: 1200,
        totalInCents: 13700,
      },
      settlement: {
        paidInCents: 0,
        balanceDueInCents: 13700,
        isFullyPaid: false,
      },
    });

    await request(httpServer)
      .post(
        '/api/invoicing/tenants/saas-platform/invoices/invoice_001/electronic-status',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        electronicStatus: 'authorized',
        authorizedAt: '2026-04-29T17:00:00.000Z',
        electronicStatusMessage: 'AUTORIZADO',
      })
      .expect(201)
      .expect((response) => {
        expect(response.body.electronicStatus).toBe('authorized');
        expect(response.body.accessKey).toBe(
          '2904202601179001234500110010020000000311234567815',
        );
        expect(response.body.authorizationNumber).toBe(
          '2904202601179001234500110010020000000311234567815',
        );
      });

    expect(
      updateTenantInvoiceElectronicStatusUseCase.execute,
    ).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'invoice_001',
      electronicStatus: 'authorized',
      accessKey: null,
      authorizationNumber: null,
      authorizedAt: new Date('2026-04-29T17:00:00.000Z'),
      electronicStatusMessage: 'AUTORIZADO',
    });
  });

  it('POST /api/invoicing/tenants/:slug/invoices should create a tenant invoice tied to a customer', async () => {
    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/invoices')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        customerId: 'customer_acme',
        number: 'inv-001',
        currency: 'usd',
        status: 'draft',
        issuedAt: '2026-04-27T16:00:00.000Z',
        dueAt: '2026-05-11T16:00:00.000Z',
        notes: 'Primer borrador para onboarding de invoicing.',
      })
      .expect(201)
      .expect({
        id: 'invoice_001',
        tenantId: 'tenant_123',
        customerId: 'customer_acme',
        number: 'INV-001',
        documentCode: null,
        establishmentCode: null,
        emissionPointCode: null,
        sequenceNumber: null,
        buyerIdentificationType: '04',
        buyerIdentification: '1790012345001',
        buyerName: 'Acme Corp',
        buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
        electronicStatus: null,
        accessKey: null,
        authorizationNumber: null,
        authorizedAt: null,
        electronicStatusMessage: null,
        signedAt: null,
        submittedAt: null,
        submissionReference: null,
        status: 'draft',
        currency: 'USD',
        issuedAt: '2026-04-27T16:00:00.000Z',
        dueAt: '2026-05-11T16:00:00.000Z',
        notes: 'Primer borrador para onboarding de invoicing.',
        createdAt: '2026-04-27T16:00:00.000Z',
        updatedAt: '2026-04-27T16:00:00.000Z',
        items: [],
        payments: [],
        electronicEvents: [],
        totals: {
          subtotalInCents: 0,
          taxInCents: 0,
          totalInCents: 0,
        },
        settlement: {
          paidInCents: 0,
          balanceDueInCents: 0,
          isFullyPaid: false,
        },
      });

    expect(createTenantInvoiceUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      customerId: 'customer_acme',
      number: 'inv-001',
      currency: 'usd',
      status: 'draft',
      issuedAt: new Date('2026-04-27T16:00:00.000Z'),
      dueAt: new Date('2026-05-11T16:00:00.000Z'),
      notes: 'Primer borrador para onboarding de invoicing.',
    });
  });

  it('POST /api/invoicing/tenants/:slug/credit-notes should create a draft credit note from a source invoice', async () => {
    getTenantInvoiceDetailUseCase.execute.mockResolvedValueOnce({
      invoice: creditNoteDraftInvoice,
      items: [creditNoteFirstItem, creditNoteSecondItem],
      payments: [],
      electronicEvents: [],
      totals: {
        subtotalInCents: -12500,
        taxInCents: -1200,
        totalInCents: -13700,
      },
      settlement: {
        paidInCents: 0,
        balanceDueInCents: 0,
        isFullyPaid: false,
      },
    });

    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/credit-notes')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        sourceInvoiceId: 'invoice_001',
        reason: 'Devolucion parcial de la factura origen.',
        issuedAt: '2026-05-07T16:00:00.000Z',
        notes: 'Nota de credito de prueba.',
      })
      .expect(201)
      .expect({
        invoice: {
          id: 'credit_note_001',
          tenantId: 'tenant_123',
          customerId: 'customer_acme',
          number: '003-001-000000012',
          documentCode: '04',
          establishmentCode: '003',
          emissionPointCode: '001',
          sequenceNumber: 12,
          buyerIdentificationType: '04',
          buyerIdentification: '1790012345001',
          buyerName: 'Acme Corp',
          buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
          electronicStatus: null,
          accessKey: null,
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage: null,
          signedAt: null,
          submittedAt: null,
          submissionReference: null,
          status: 'draft',
          currency: 'USD',
          issuedAt: '2026-05-07T16:00:00.000Z',
          dueAt: null,
          notes: 'Nota de credito de prueba.',
          createdAt: '2026-05-07T16:00:00.000Z',
          updatedAt: '2026-05-07T16:00:00.000Z',
          items: [
            {
              id: 'credit_note_item_001',
              tenantId: 'tenant_123',
              invoiceId: 'credit_note_001',
              position: 1,
              description: 'Suscripcion mensual Growth',
              quantity: 2,
              unitPriceInCents: -5000,
              lineTotalInCents: -10000,
              taxRateId: 'tax_rate_vat_12',
              taxRateName: 'VAT 12%',
              taxRatePercentage: 12,
              lineTaxInCents: -1200,
              createdAt: '2026-05-07T16:00:00.000Z',
              updatedAt: '2026-05-07T16:00:00.000Z',
            },
            {
              id: 'credit_note_item_002',
              tenantId: 'tenant_123',
              invoiceId: 'credit_note_001',
              position: 2,
              description: 'Setup inicial',
              quantity: 1,
              unitPriceInCents: -2500,
              lineTotalInCents: -2500,
              taxRateId: null,
              taxRateName: null,
              taxRatePercentage: null,
              lineTaxInCents: 0,
              createdAt: '2026-05-07T16:00:00.000Z',
              updatedAt: '2026-05-07T16:00:00.000Z',
            },
          ],
          payments: [],
          electronicEvents: [],
          totals: {
            subtotalInCents: -12500,
            taxInCents: -1200,
            totalInCents: -13700,
          },
          settlement: {
            paidInCents: 0,
            balanceDueInCents: 0,
            isFullyPaid: false,
          },
        },
        creditNote: {
          sourceInvoiceId: 'invoice_001',
          sourceInvoiceNumber: 'INV-001',
          sourceInvoiceIssuedAt: '2026-04-27T16:00:00.000Z',
          reason: 'Devolucion parcial de la factura origen.',
        },
      });

    expect(createTenantCreditNoteUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      sourceInvoiceId: 'invoice_001',
      reason: 'Devolucion parcial de la factura origen.',
      number: undefined,
      issuedAt: new Date('2026-05-07T16:00:00.000Z'),
      notes: 'Nota de credito de prueba.',
    });
  });

  it('POST /api/invoicing/tenants/:slug/debit-notes should create a draft debit note from a source invoice', async () => {
    getTenantInvoiceDetailUseCase.execute.mockResolvedValueOnce({
      invoice: debitNoteDraftInvoice,
      items: [debitNoteFirstItem],
      payments: [],
      electronicEvents: [],
      totals: {
        subtotalInCents: 2500,
        taxInCents: 300,
        totalInCents: 2800,
      },
      settlement: {
        paidInCents: 0,
        balanceDueInCents: 2800,
        isFullyPaid: false,
      },
    });

    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/debit-notes')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        sourceInvoiceId: 'invoice_001',
        reason: 'Interes por mora de la factura origen.',
        amountInCents: 2500,
        taxRateId: 'tax_rate_vat_12',
        issuedAt: '2026-05-08T16:00:00.000Z',
        notes: 'Nota de debito de prueba.',
      })
      .expect(201)
      .expect({
        invoice: {
          id: 'debit_note_001',
          tenantId: 'tenant_123',
          customerId: 'customer_acme',
          number: '004-001-000000007',
          documentCode: '05',
          establishmentCode: '004',
          emissionPointCode: '001',
          sequenceNumber: 7,
          buyerIdentificationType: '04',
          buyerIdentification: '1790012345001',
          buyerName: 'Acme Corp',
          buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
          electronicStatus: null,
          accessKey: null,
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage: null,
          signedAt: null,
          submittedAt: null,
          submissionReference: null,
          status: 'draft',
          currency: 'USD',
          issuedAt: '2026-05-08T16:00:00.000Z',
          dueAt: '2026-05-11T16:00:00.000Z',
          notes: 'Nota de debito de prueba.',
          createdAt: '2026-05-08T16:00:00.000Z',
          updatedAt: '2026-05-08T16:00:00.000Z',
          items: [
            {
              id: 'debit_note_item_001',
              tenantId: 'tenant_123',
              invoiceId: 'debit_note_001',
              position: 1,
              description: 'Interes por mora de la factura origen.',
              quantity: 1,
              unitPriceInCents: 2500,
              lineTotalInCents: 2500,
              taxRateId: 'tax_rate_vat_12',
              taxRateName: 'VAT 12%',
              taxRatePercentage: 12,
              lineTaxInCents: 300,
              createdAt: '2026-05-08T16:00:00.000Z',
              updatedAt: '2026-05-08T16:00:00.000Z',
            },
          ],
          payments: [],
          electronicEvents: [],
          totals: {
            subtotalInCents: 2500,
            taxInCents: 300,
            totalInCents: 2800,
          },
          settlement: {
            paidInCents: 0,
            balanceDueInCents: 2800,
            isFullyPaid: false,
          },
        },
        debitNote: {
          sourceInvoiceId: 'invoice_001',
          sourceInvoiceNumber: 'INV-001',
          sourceInvoiceIssuedAt: '2026-04-27T16:00:00.000Z',
          reason: 'Interes por mora de la factura origen.',
          amountInCents: 2500,
        },
      });

    expect(createTenantDebitNoteUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      sourceInvoiceId: 'invoice_001',
      reason: 'Interes por mora de la factura origen.',
      amountInCents: 2500,
      taxRateId: 'tax_rate_vat_12',
      number: undefined,
      issuedAt: new Date('2026-05-08T16:00:00.000Z'),
      notes: 'Nota de debito de prueba.',
    });
  });

  it('POST /api/invoicing/tenants/:slug/withholdings should create a draft withholding from a source invoice', async () => {
    getTenantInvoiceDetailUseCase.execute.mockResolvedValueOnce({
      invoice: withholdingDraftInvoice,
      items: [withholdingFirstItem],
      payments: [],
      electronicEvents: [],
      totals: {
        subtotalInCents: 1000,
        taxInCents: 0,
        totalInCents: 1000,
      },
      settlement: {
        paidInCents: 0,
        balanceDueInCents: 1000,
        isFullyPaid: false,
      },
    });

    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/withholdings')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        sourceInvoiceId: 'invoice_001',
        reason: 'Retencion sobre la factura origen.',
        amountInCents: 1000,
        taxRateId: 'tax_rate_vat_12',
        issuedAt: '2026-05-08T19:30:00.000Z',
        notes: 'Comprobante de retencion de prueba.',
      })
      .expect(201)
      .expect({
        invoice: {
          id: 'withholding_001',
          tenantId: 'tenant_123',
          customerId: 'customer_acme',
          number: '005-001-000000009',
          documentCode: '07',
          establishmentCode: '005',
          emissionPointCode: '001',
          sequenceNumber: 9,
          buyerIdentificationType: '04',
          buyerIdentification: '1790012345001',
          buyerName: 'Acme Corp',
          buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
          electronicStatus: null,
          accessKey: null,
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage: null,
          signedAt: null,
          submittedAt: null,
          submissionReference: null,
          status: 'draft',
          currency: 'USD',
          issuedAt: '2026-05-08T19:30:00.000Z',
          dueAt: null,
          notes: 'Comprobante de retencion de prueba.',
          createdAt: '2026-05-08T19:30:00.000Z',
          updatedAt: '2026-05-08T19:30:00.000Z',
          items: [
            {
              id: 'withholding_item_001',
              tenantId: 'tenant_123',
              invoiceId: 'withholding_001',
              position: 1,
              description: 'Retencion sobre la factura origen.',
              quantity: 1,
              unitPriceInCents: 1000,
              lineTotalInCents: 1000,
              taxRateId: 'tax_rate_vat_12',
              taxRateName: 'VAT 12%',
              taxRatePercentage: 12,
              lineTaxInCents: 0,
              createdAt: '2026-05-08T19:30:00.000Z',
              updatedAt: '2026-05-08T19:30:00.000Z',
            },
          ],
          payments: [],
          electronicEvents: [],
          totals: {
            subtotalInCents: 1000,
            taxInCents: 0,
            totalInCents: 1000,
          },
          settlement: {
            paidInCents: 0,
            balanceDueInCents: 1000,
            isFullyPaid: false,
          },
        },
        withholding: {
          sourceInvoiceId: 'invoice_001',
          sourceInvoiceNumber: 'INV-001',
          sourceInvoiceIssuedAt: '2026-04-27T16:00:00.000Z',
          reason: 'Retencion sobre la factura origen.',
          amountInCents: 1000,
        },
      });

    expect(createTenantWithholdingUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      sourceInvoiceId: 'invoice_001',
      reason: 'Retencion sobre la factura origen.',
      amountInCents: 1000,
      taxRateId: 'tax_rate_vat_12',
      number: undefined,
      issuedAt: new Date('2026-05-08T19:30:00.000Z'),
      notes: 'Comprobante de retencion de prueba.',
    });
  });

  it('POST /api/invoicing/tenants/:slug/remission-guides should create a draft remission guide from a source invoice', async () => {
    getTenantInvoiceDetailUseCase.execute.mockResolvedValueOnce({
      invoice: remissionGuideDraftInvoice,
      items: [remissionGuideFirstItem, remissionGuideSecondItem],
      payments: [],
      electronicEvents: [],
      totals: {
        subtotalInCents: 0,
        taxInCents: 0,
        totalInCents: 0,
      },
      settlement: {
        paidInCents: 0,
        balanceDueInCents: 0,
        isFullyPaid: false,
      },
    });

    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/remission-guides')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        sourceInvoiceId: 'invoice_001',
        shipmentReason: 'Traslado de mercaderia al cliente.',
        shipmentStartAt: '2026-05-12T13:00:00.000Z',
        shipmentEndAt: '2026-05-12T18:00:00.000Z',
        departureAddress: 'Sucursal Matriz',
        arrivalAddress: 'Bodega del cliente',
        carrierName: 'Transportes Demo S.A.',
        carrierIdentificationType: '04',
        carrierIdentification: '1790012345001',
        vehiclePlate: 'ABC-1234',
        destinationRoute: 'Matriz - Cliente',
        issuedAt: '2026-05-12T13:00:00.000Z',
        notes: 'Guia de remision de prueba.',
      })
      .expect(201)
      .expect({
        invoice: {
          id: 'remission_001',
          tenantId: 'tenant_123',
          customerId: 'customer_acme',
          number: '006-001-000000004',
          documentCode: '06',
          establishmentCode: '006',
          emissionPointCode: '001',
          sequenceNumber: 4,
          buyerIdentificationType: '04',
          buyerIdentification: '1790012345001',
          buyerName: 'Acme Corp',
          buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
          electronicStatus: null,
          accessKey: null,
          authorizationNumber: null,
          authorizedAt: null,
          electronicStatusMessage: null,
          signedAt: null,
          submittedAt: null,
          submissionReference: null,
          status: 'draft',
          currency: 'USD',
          issuedAt: '2026-05-12T13:00:00.000Z',
          dueAt: '2026-05-12T18:00:00.000Z',
          notes: 'Guia de remision de prueba.',
          createdAt: '2026-05-12T13:00:00.000Z',
          updatedAt: '2026-05-12T13:00:00.000Z',
          items: [
            {
              id: 'remission_item_001',
              tenantId: 'tenant_123',
              invoiceId: 'remission_001',
              position: 1,
              description: 'Suscripcion mensual Growth',
              quantity: 2,
              unitPriceInCents: 0,
              lineTotalInCents: 0,
              taxRateId: null,
              taxRateName: null,
              taxRatePercentage: null,
              lineTaxInCents: 0,
              createdAt: '2026-05-12T13:00:00.000Z',
              updatedAt: '2026-05-12T13:00:00.000Z',
            },
            {
              id: 'remission_item_002',
              tenantId: 'tenant_123',
              invoiceId: 'remission_001',
              position: 2,
              description: 'Setup inicial',
              quantity: 1,
              unitPriceInCents: 0,
              lineTotalInCents: 0,
              taxRateId: null,
              taxRateName: null,
              taxRatePercentage: null,
              lineTaxInCents: 0,
              createdAt: '2026-05-12T13:00:00.000Z',
              updatedAt: '2026-05-12T13:00:00.000Z',
            },
          ],
          payments: [],
          electronicEvents: [],
          totals: {
            subtotalInCents: 0,
            taxInCents: 0,
            totalInCents: 0,
          },
          settlement: {
            paidInCents: 0,
            balanceDueInCents: 0,
            isFullyPaid: false,
          },
        },
        remissionGuide: {
          sourceInvoiceId: 'invoice_001',
          sourceInvoiceNumber: 'INV-001',
          sourceInvoiceIssuedAt: '2026-04-27T16:00:00.000Z',
          shipmentReason: 'Traslado de mercaderia al cliente.',
          shipmentStartAt: '2026-05-12T13:00:00.000Z',
          shipmentEndAt: '2026-05-12T18:00:00.000Z',
          departureAddress: 'Sucursal Matriz',
          arrivalAddress: 'Bodega del cliente',
          carrierName: 'Transportes Demo S.A.',
          carrierIdentificationType: '04',
          carrierIdentification: '1790012345001',
          vehiclePlate: 'ABC-1234',
          destinationRoute: 'Matriz - Cliente',
        },
      });

    expect(createTenantRemissionGuideUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      sourceInvoiceId: 'invoice_001',
      shipmentReason: 'Traslado de mercaderia al cliente.',
      shipmentStartAt: new Date('2026-05-12T13:00:00.000Z'),
      shipmentEndAt: new Date('2026-05-12T18:00:00.000Z'),
      departureAddress: 'Sucursal Matriz',
      arrivalAddress: 'Bodega del cliente',
      carrierName: 'Transportes Demo S.A.',
      carrierIdentificationType: '04',
      carrierIdentification: '1790012345001',
      vehiclePlate: 'ABC-1234',
      destinationRoute: 'Matriz - Cliente',
      number: undefined,
      issuedAt: new Date('2026-05-12T13:00:00.000Z'),
      notes: 'Guia de remision de prueba.',
    });
  });

  it('POST /api/invoicing/tenants/:slug/invoices should support Ecuador auto-numbering when number is omitted', async () => {
    createTenantInvoiceUseCase.execute.mockResolvedValueOnce(electronicDraftInvoice);

    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/invoices')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        customerId: 'customer_acme',
        currency: 'usd',
        status: 'draft',
        issuedAt: '2026-04-29T16:30:00.000Z',
        dueAt: null,
        notes: 'Factura con numeracion Ecuador.',
      })
      .expect(201)
      .expect({
        id: 'invoice_003',
        tenantId: 'tenant_123',
        customerId: 'customer_acme',
        number: '001-002-000000031',
        documentCode: '01',
        establishmentCode: '001',
        emissionPointCode: '002',
        sequenceNumber: 31,
        buyerIdentificationType: '04',
        buyerIdentification: '1790012345001',
        buyerName: 'Acme Corp',
        buyerAddress: 'Av. Amazonas N34-451 y Av. Atahualpa',
        electronicStatus: null,
        accessKey: null,
        authorizationNumber: null,
        authorizedAt: null,
        electronicStatusMessage: null,
        signedAt: null,
        submittedAt: null,
        submissionReference: null,
        status: 'draft',
        currency: 'USD',
        issuedAt: '2026-04-29T16:30:00.000Z',
        dueAt: null,
        notes: 'Factura con numeracion Ecuador.',
        createdAt: '2026-04-29T16:30:00.000Z',
        updatedAt: '2026-04-29T16:30:00.000Z',
        items: [],
        payments: [],
        electronicEvents: [],
        totals: {
          subtotalInCents: 0,
          taxInCents: 0,
          totalInCents: 0,
        },
        settlement: {
          paidInCents: 0,
          balanceDueInCents: 0,
          isFullyPaid: false,
        },
      });

    expect(createTenantInvoiceUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      customerId: 'customer_acme',
      number: undefined,
      currency: 'usd',
      status: 'draft',
      issuedAt: new Date('2026-04-29T16:30:00.000Z'),
      dueAt: null,
      notes: 'Factura con numeracion Ecuador.',
    });
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/items should return invoice items', async () => {
    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/invoices/invoice_001/items')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'invoice_item_001',
          tenantId: 'tenant_123',
          invoiceId: 'invoice_001',
          position: 1,
          description: 'Suscripcion mensual Growth',
          quantity: 2,
          unitPriceInCents: 5000,
          lineTotalInCents: 10000,
          taxRateId: 'tax_rate_vat_12',
          taxRateName: 'VAT 12%',
          taxRatePercentage: 12,
          lineTaxInCents: 1200,
          createdAt: '2026-04-27T16:05:00.000Z',
          updatedAt: '2026-04-27T16:05:00.000Z',
        },
        {
          id: 'invoice_item_002',
          tenantId: 'tenant_123',
          invoiceId: 'invoice_001',
          position: 2,
          description: 'Setup inicial',
          quantity: 1,
          unitPriceInCents: 2500,
          lineTotalInCents: 2500,
          taxRateId: null,
          taxRateName: null,
          taxRatePercentage: null,
          lineTaxInCents: 0,
          createdAt: '2026-04-27T16:06:00.000Z',
          updatedAt: '2026-04-27T16:06:00.000Z',
        },
      ]);

    expect(listTenantInvoiceItemsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice_001',
    );
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/items/:itemId should return one invoice item', async () => {
    await request(httpServer)
      .get(
        '/api/invoicing/tenants/saas-platform/invoices/invoice_001/items/invoice_item_001',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'invoice_item_001',
        tenantId: 'tenant_123',
        invoiceId: 'invoice_001',
        position: 1,
        description: 'Suscripcion mensual Growth',
        quantity: 2,
        unitPriceInCents: 5000,
        lineTotalInCents: 10000,
        taxRateId: 'tax_rate_vat_12',
        taxRateName: 'VAT 12%',
        taxRatePercentage: 12,
        lineTaxInCents: 1200,
        createdAt: '2026-04-27T16:05:00.000Z',
        updatedAt: '2026-04-27T16:05:00.000Z',
      });

    expect(getTenantInvoiceItemByIdUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice_001',
      'invoice_item_001',
    );
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/items should create an invoice item with calculated line totals', async () => {
    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/invoices/invoice_001/items')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        description: 'Suscripcion mensual Growth',
        quantity: 2,
        unitPriceInCents: 5000,
        taxRateId: 'tax_rate_vat_12',
      })
      .expect(201)
      .expect({
        id: 'invoice_item_001',
        tenantId: 'tenant_123',
        invoiceId: 'invoice_001',
        position: 1,
        description: 'Suscripcion mensual Growth',
        quantity: 2,
        unitPriceInCents: 5000,
        lineTotalInCents: 10000,
        taxRateId: 'tax_rate_vat_12',
        taxRateName: 'VAT 12%',
        taxRatePercentage: 12,
        lineTaxInCents: 1200,
        createdAt: '2026-04-27T16:05:00.000Z',
        updatedAt: '2026-04-27T16:05:00.000Z',
      });

    expect(createTenantInvoiceItemUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'invoice_001',
      description: 'Suscripcion mensual Growth',
      quantity: 2,
      unitPriceInCents: 5000,
      taxRateId: 'tax_rate_vat_12',
    });
  });

  it('GET /api/invoicing/tenants/:slug/invoices/:invoiceId/payments should return invoice payments', async () => {
    await request(httpServer)
      .get('/api/invoicing/tenants/saas-platform/invoices/invoice_002/payments')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'payment_001',
          tenantId: 'tenant_123',
          invoiceId: 'invoice_002',
          amountInCents: 2500,
          currency: 'USD',
          status: 'posted',
          method: 'bank_transfer',
          reference: 'PAY-001',
          paidAt: '2026-04-28T21:00:00.000Z',
          notes: 'Abono inicial de prueba.',
          reversedAt: null,
          reversalReason: null,
          createdAt: '2026-04-28T21:00:00.000Z',
          updatedAt: '2026-04-28T21:00:00.000Z',
        },
      ]);

    expect(listTenantInvoicePaymentsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
      'invoice_002',
    );
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/payments should register a payment', async () => {
    await request(httpServer)
      .post('/api/invoicing/tenants/saas-platform/invoices/invoice_002/payments')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        amountInCents: 2500,
        method: 'bank_transfer',
        reference: 'PAY-001',
        paidAt: '2026-04-28T21:00:00.000Z',
        notes: 'Abono inicial de prueba.',
      })
      .expect(201)
      .expect({
        id: 'payment_001',
        tenantId: 'tenant_123',
        invoiceId: 'invoice_002',
        amountInCents: 2500,
        currency: 'USD',
        status: 'posted',
        method: 'bank_transfer',
        reference: 'PAY-001',
        paidAt: '2026-04-28T21:00:00.000Z',
        notes: 'Abono inicial de prueba.',
        reversedAt: null,
        reversalReason: null,
        createdAt: '2026-04-28T21:00:00.000Z',
        updatedAt: '2026-04-28T21:00:00.000Z',
      });

    expect(createTenantInvoicePaymentUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'invoice_002',
      amountInCents: 2500,
      method: 'bank_transfer',
      reference: 'PAY-001',
      paidAt: new Date('2026-04-28T21:00:00.000Z'),
      notes: 'Abono inicial de prueba.',
    });
  });

  it('POST /api/invoicing/tenants/:slug/invoices/:invoiceId/payments/:paymentId/reverse should reverse a posted payment', async () => {
    await request(httpServer)
      .post(
        '/api/invoicing/tenants/saas-platform/invoices/invoice_002/payments/payment_001/reverse',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        reason: 'Pago duplicado.',
      })
      .expect(201)
      .expect({
        id: 'payment_001',
        tenantId: 'tenant_123',
        invoiceId: 'invoice_002',
        amountInCents: 2500,
        currency: 'USD',
        status: 'reversed',
        method: 'bank_transfer',
        reference: 'PAY-001',
        paidAt: '2026-04-28T21:00:00.000Z',
        notes: 'Abono inicial de prueba.',
        reversedAt: '2026-04-28T22:00:00.000Z',
        reversalReason: 'Pago duplicado.',
        createdAt: '2026-04-28T21:00:00.000Z',
        updatedAt: '2026-04-28T22:00:00.000Z',
      });

    expect(reverseTenantInvoicePaymentUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invoiceId: 'invoice_002',
      paymentId: 'payment_001',
      reason: 'Pago duplicado.',
    });
  });

  it('PUT /api/tenancy/tenants/:slug/subscription should change the tenant plan and return the new commercial snapshot', async () => {
    await request(httpServer)
      .put('/api/tenancy/tenants/saas-platform/subscription')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        planKey: 'growth',
        status: 'active',
      })
      .expect(200)
      .expect({
        subscription: {
          id: 'subscription_123',
          tenantId: 'tenant_123',
          planId: 'plan_growth_monthly',
          status: 'active',
          startedAt: '2026-04-23T18:00:00.000Z',
          expiresAt: null,
          trialEndsAt: null,
          createdAt: '2026-04-23T18:00:00.000Z',
          updatedAt: '2026-04-23T18:00:00.000Z',
        },
        entitlements: [
          {
            id: 'entitlement_tenant_123_max_users',
            tenantId: 'tenant_123',
            key: 'max_users',
            value: 15,
            source: 'plan',
            createdAt: '2026-04-23T18:00:00.000Z',
            updatedAt: '2026-04-23T18:00:00.000Z',
          },
          {
            id: 'entitlement_tenant_123_products',
            tenantId: 'tenant_123',
            key: 'products',
            value: ['invoicing', 'learning'],
            source: 'plan',
            createdAt: '2026-04-23T18:00:00.000Z',
            updatedAt: '2026-04-23T18:00:00.000Z',
          },
        ],
      });

    expect(changeTenantPlanUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      planKey: 'growth',
      status: 'active',
      startedAt: undefined,
      expiresAt: null,
      trialEndsAt: null,
    });
  });

  it('GET /api/tenancy/tenants/:slug/entitlements should return effective tenant entitlements', async () => {
    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/entitlements')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'entitlement_tenant_123_max_users',
          tenantId: 'tenant_123',
          key: 'max_users',
          value: 15,
          source: 'plan',
          createdAt: '2026-04-23T18:00:00.000Z',
          updatedAt: '2026-04-23T18:00:00.000Z',
        },
        {
          id: 'entitlement_tenant_123_products',
          tenantId: 'tenant_123',
          key: 'products',
          value: ['invoicing', 'learning'],
          source: 'plan',
          createdAt: '2026-04-23T18:00:00.000Z',
          updatedAt: '2026-04-23T18:00:00.000Z',
        },
      ]);

    expect(listTenantEntitlementsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/tenancy/tenants/:slug/feature-flags should return tenant feature flags', async () => {
    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/feature-flags')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'feature_flag_tenant_123_product.psychology.enabled',
          tenantId: 'tenant_123',
          key: 'product.psychology.enabled',
          enabled: false,
          createdAt: '2026-04-23T18:00:00.000Z',
          updatedAt: '2026-04-23T18:00:00.000Z',
        },
      ]);

    expect(listTenantFeatureFlagsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('PUT /api/tenancy/tenants/:slug/feature-flags/:key should upsert a tenant feature flag', async () => {
    await request(httpServer)
      .put('/api/tenancy/tenants/saas-platform/feature-flags/product.psychology.enabled')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ enabled: false })
      .expect(200)
      .expect({
        id: 'feature_flag_tenant_123_product.psychology.enabled',
        tenantId: 'tenant_123',
        key: 'product.psychology.enabled',
        enabled: false,
        createdAt: '2026-04-23T18:00:00.000Z',
        updatedAt: '2026-04-23T18:00:00.000Z',
      });

    expect(setTenantFeatureFlagUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      key: 'product.psychology.enabled',
      enabled: false,
    });
  });

  it('GET /api/tenancy/tenants/:slug/feature-flags should require feature flag visibility permission', async () => {
    resolveTenantAccessUseCase.execute.mockResolvedValueOnce({
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      userId: 'user_456',
      membershipId: 'membership_456',
      membershipStatus: MembershipStatus.Active,
      roleKeys: ['tenant_member'],
      permissionKeys: [TENANT_PERMISSIONS.READ],
    });

    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/feature-flags')
      .set('Authorization', `Bearer ${memberToken}`)
      .expect(403)
      .expect({
        statusCode: 403,
        message:
          'Permission "tenant.feature-flags.read" is required for this tenant resource.',
        error: 'Forbidden',
      });
  });

  it('PUT /api/tenancy/tenants/:slug/feature-flags/:key should require feature flag manage permission', async () => {
    resolveTenantAccessUseCase.execute.mockResolvedValueOnce({
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      userId: 'user_456',
      membershipId: 'membership_456',
      membershipStatus: MembershipStatus.Active,
      roleKeys: ['tenant_member'],
      permissionKeys: [TENANT_PERMISSIONS.READ, TENANT_PERMISSIONS.FEATURE_FLAGS_READ],
    });

    await request(httpServer)
      .put('/api/tenancy/tenants/saas-platform/feature-flags/product.psychology.enabled')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ enabled: true })
      .expect(403)
      .expect({
        statusCode: 403,
        message:
          'Permission "tenant.feature-flags.manage" is required for this tenant resource.',
        error: 'Forbidden',
      });
  });

  it('GET /api/auth/me should return the authenticated user session view', async () => {
    await request(httpServer)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'user_123',
        email: 'hello@saas-platform.dev',
        provider: 'password',
        externalAuthId: null,
        pendingInvitations: [],
        sessionState: {
          canSelectTenancy: false,
          hasPendingInvitations: false,
          hasTenancies: true,
          recommendedFlow: 'workspace',
        },
        currentTenancy: {
          tenant: {
            id: 'tenant_123',
            name: 'SaaS Platform',
            slug: 'saas-platform',
            status: TenantStatus.Draft,
          },
          membership: {
            id: 'membership_123',
            status: MembershipStatus.Active,
            invitedBy: 'user_123',
            createdAt: tenantCreatedAt.toISOString(),
            updatedAt: tenantCreatedAt.toISOString(),
          },
          roleKeys: ['tenant_owner'],
          permissionKeys: ownerTenantPermissionKeys,
          subscription: {
            id: 'subscription_123',
            tenantId: 'tenant_123',
            planId: 'plan_growth_monthly',
            status: 'active',
            startedAt: '2026-04-23T18:00:00.000Z',
            expiresAt: null,
            trialEndsAt: null,
            createdAt: '2026-04-23T18:00:00.000Z',
            updatedAt: '2026-04-23T18:00:00.000Z',
          },
          entitlements: [
            {
              id: 'entitlement_tenant_123_max_users',
              tenantId: 'tenant_123',
              key: 'max_users',
              value: 15,
              source: 'plan',
              createdAt: '2026-04-23T18:00:00.000Z',
              updatedAt: '2026-04-23T18:00:00.000Z',
            },
            {
              id: 'entitlement_tenant_123_products',
              tenantId: 'tenant_123',
              key: 'products',
              value: ['invoicing', 'learning'],
              source: 'plan',
              createdAt: '2026-04-23T18:00:00.000Z',
              updatedAt: '2026-04-23T18:00:00.000Z',
            },
          ],
        },
        tenancies: [
          {
            tenant: {
              id: 'tenant_123',
              name: 'SaaS Platform',
              slug: 'saas-platform',
              status: TenantStatus.Draft,
            },
            membership: {
              id: 'membership_123',
              status: MembershipStatus.Active,
              invitedBy: 'user_123',
              createdAt: tenantCreatedAt.toISOString(),
              updatedAt: tenantCreatedAt.toISOString(),
            },
            roleKeys: ['tenant_owner'],
            permissionKeys: ownerTenantPermissionKeys,
          },
        ],
      });

    expect(listUserTenanciesUseCase.execute).toHaveBeenCalledWith('user_123');
  });

  it('GET /api/auth/me should prefer the persisted preferredTenantId when no tenantSlug is provided', async () => {
    userRepository.findById.mockResolvedValueOnce(
      User.create({
        id: 'user_123',
        email: 'hello@saas-platform.dev',
        name: 'Jorge',
        avatarUrl: null,
        authProvider: AuthProvider.Password,
        externalAuthId: null,
        preferredTenantId: 'tenant_456',
        createdAt: registeredAt,
        updatedAt: registeredAt,
      }),
    );
    listUserTenanciesUseCase.execute.mockResolvedValueOnce([
      {
        tenant,
        membership,
        roleKeys: ['tenant_owner'],
        permissionKeys: ownerTenantPermissionKeys,
      },
      {
        tenant: secondaryTenant,
        membership: secondaryMembership,
        roleKeys: ['tenant_member'],
        permissionKeys: [TENANT_PERMISSIONS.READ],
      },
    ]);

    await request(httpServer)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'user_123',
        email: 'hello@saas-platform.dev',
        provider: 'password',
        externalAuthId: null,
        pendingInvitations: [],
        sessionState: {
          canSelectTenancy: true,
          hasPendingInvitations: false,
          hasTenancies: true,
          recommendedFlow: 'select-tenancy',
        },
        currentTenancy: {
          tenant: {
            id: 'tenant_456',
            name: 'Analytics Workspace',
            slug: 'analytics-workspace',
            status: TenantStatus.Active,
          },
          membership: {
            id: 'membership_456',
            status: MembershipStatus.Active,
            invitedBy: 'user_999',
            createdAt: secondaryMembership.toPrimitives().createdAt.toISOString(),
            updatedAt: secondaryMembership.toPrimitives().updatedAt.toISOString(),
          },
          roleKeys: ['tenant_member'],
          permissionKeys: [TENANT_PERMISSIONS.READ],
          subscription: null,
          entitlements: [],
        },
        tenancies: [
          {
            tenant: {
              id: 'tenant_456',
              name: 'Analytics Workspace',
              slug: 'analytics-workspace',
              status: TenantStatus.Active,
            },
            membership: {
              id: 'membership_456',
              status: MembershipStatus.Active,
              invitedBy: 'user_999',
              createdAt: secondaryMembership.toPrimitives().createdAt.toISOString(),
              updatedAt: secondaryMembership.toPrimitives().updatedAt.toISOString(),
            },
            roleKeys: ['tenant_member'],
            permissionKeys: [TENANT_PERMISSIONS.READ],
          },
          {
            tenant: {
              id: 'tenant_123',
              name: 'SaaS Platform',
              slug: 'saas-platform',
              status: TenantStatus.Draft,
            },
            membership: {
              id: 'membership_123',
              status: MembershipStatus.Active,
              invitedBy: 'user_123',
              createdAt: tenantCreatedAt.toISOString(),
              updatedAt: tenantCreatedAt.toISOString(),
            },
            roleKeys: ['tenant_owner'],
            permissionKeys: ownerTenantPermissionKeys,
          },
        ],
      });
  });

  it('GET /api/auth/me should resolve the requested tenant as currentTenancy', async () => {
    listUserTenanciesUseCase.execute.mockResolvedValueOnce([
      {
        tenant: secondaryTenant,
        membership: secondaryMembership,
        roleKeys: ['tenant_member'],
        permissionKeys: [TENANT_PERMISSIONS.READ],
      },
      {
        tenant,
        membership,
        roleKeys: ['tenant_owner'],
        permissionKeys: ownerTenantPermissionKeys,
      },
    ]);

    await request(httpServer)
      .get('/api/auth/me?tenantSlug=analytics-workspace')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'user_123',
        email: 'hello@saas-platform.dev',
        provider: 'password',
        externalAuthId: null,
        pendingInvitations: [],
        sessionState: {
          canSelectTenancy: true,
          hasPendingInvitations: false,
          hasTenancies: true,
          recommendedFlow: 'select-tenancy',
        },
        currentTenancy: {
          tenant: {
            id: 'tenant_456',
            name: 'Analytics Workspace',
            slug: 'analytics-workspace',
            status: TenantStatus.Active,
          },
          membership: {
            id: 'membership_456',
            status: MembershipStatus.Active,
            invitedBy: 'user_999',
            createdAt: secondaryMembership.toPrimitives().createdAt.toISOString(),
            updatedAt: secondaryMembership.toPrimitives().updatedAt.toISOString(),
          },
          roleKeys: ['tenant_member'],
          permissionKeys: [TENANT_PERMISSIONS.READ],
          subscription: null,
          entitlements: [],
        },
        tenancies: [
          {
            tenant: {
              id: 'tenant_456',
              name: 'Analytics Workspace',
              slug: 'analytics-workspace',
              status: TenantStatus.Active,
            },
            membership: {
              id: 'membership_456',
              status: MembershipStatus.Active,
              invitedBy: 'user_999',
              createdAt: secondaryMembership.toPrimitives().createdAt.toISOString(),
              updatedAt: secondaryMembership.toPrimitives().updatedAt.toISOString(),
            },
            roleKeys: ['tenant_member'],
            permissionKeys: [TENANT_PERMISSIONS.READ],
          },
          {
            tenant: {
              id: 'tenant_123',
              name: 'SaaS Platform',
              slug: 'saas-platform',
              status: TenantStatus.Draft,
            },
            membership: {
              id: 'membership_123',
              status: MembershipStatus.Active,
              invitedBy: 'user_123',
              createdAt: tenantCreatedAt.toISOString(),
              updatedAt: tenantCreatedAt.toISOString(),
            },
            roleKeys: ['tenant_owner'],
            permissionKeys: ownerTenantPermissionKeys,
          },
        ],
      });
  });

  it('GET /api/auth/me should reject an unavailable requested tenant', async () => {
    await request(httpServer)
      .get('/api/auth/me?tenantSlug=missing-tenant')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(404);
  });

  it('GET /api/auth/me should expose pending invitations for frontend onboarding', async () => {
    userRepository.findById.mockResolvedValueOnce(
      User.create({
        id: 'user_456',
        email: 'invitee@saas-platform.dev',
        name: 'Invitee',
        avatarUrl: null,
        authProvider: AuthProvider.Password,
        externalAuthId: null,
        preferredTenantId: null,
        createdAt: registeredAt,
        updatedAt: registeredAt,
      }),
    );
    listUserTenanciesUseCase.execute.mockResolvedValueOnce([]);
    listUserPendingInvitationsUseCase.execute.mockResolvedValueOnce([
      {
        invitation,
        tenant,
      },
    ]);

    await request(httpServer)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${inviteeToken}`)
      .expect(200)
      .expect({
        id: 'user_456',
        email: 'invitee@saas-platform.dev',
        provider: 'password',
        externalAuthId: null,
        currentTenancy: null,
        sessionState: {
          canSelectTenancy: false,
          hasPendingInvitations: true,
          hasTenancies: false,
          recommendedFlow: 'accept-invitation',
        },
        pendingInvitations: [
          {
            invitation: {
              id: 'invitation_123',
              email: 'invitee@saas-platform.dev',
              roleKey: 'tenant_member',
              status: InvitationStatus.Pending,
              invitedByUserId: 'user_123',
              acceptedByUserId: null,
              expiresAt: invitation.toPrimitives().expiresAt.toISOString(),
              acceptedAt: null,
              createdAt: invitationCreatedAt.toISOString(),
              updatedAt: invitationCreatedAt.toISOString(),
            },
            tenant: {
              id: 'tenant_123',
              name: 'SaaS Platform',
              slug: 'saas-platform',
              status: TenantStatus.Draft,
            },
          },
        ],
        tenancies: [],
      });
  });

  it('PUT /api/auth/me/current-tenancy should persist a tenant preference and return the updated session', async () => {
    const availableTenancies = [
      {
        tenant,
        membership,
        roleKeys: ['tenant_owner'],
        permissionKeys: ownerTenantPermissionKeys,
      },
      {
        tenant: secondaryTenant,
        membership: secondaryMembership,
        roleKeys: ['tenant_member'],
        permissionKeys: [TENANT_PERMISSIONS.READ],
      },
    ];
    listUserTenanciesUseCase.execute
      .mockResolvedValueOnce(availableTenancies)
      .mockResolvedValueOnce(availableTenancies);

    await request(httpServer)
      .put('/api/auth/me/current-tenancy')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ tenantSlug: 'analytics-workspace' })
      .expect(200)
      .expect({
        id: 'user_123',
        email: 'hello@saas-platform.dev',
        provider: 'password',
        externalAuthId: null,
        pendingInvitations: [],
        sessionState: {
          canSelectTenancy: true,
          hasPendingInvitations: false,
          hasTenancies: true,
          recommendedFlow: 'select-tenancy',
        },
        currentTenancy: {
          tenant: {
            id: 'tenant_456',
            name: 'Analytics Workspace',
            slug: 'analytics-workspace',
            status: TenantStatus.Active,
          },
          membership: {
            id: 'membership_456',
            status: MembershipStatus.Active,
            invitedBy: 'user_999',
            createdAt: secondaryMembership.toPrimitives().createdAt.toISOString(),
            updatedAt: secondaryMembership.toPrimitives().updatedAt.toISOString(),
          },
          roleKeys: ['tenant_member'],
          permissionKeys: [TENANT_PERMISSIONS.READ],
          subscription: null,
          entitlements: [],
        },
        tenancies: [
          {
            tenant: {
              id: 'tenant_456',
              name: 'Analytics Workspace',
              slug: 'analytics-workspace',
              status: TenantStatus.Active,
            },
            membership: {
              id: 'membership_456',
              status: MembershipStatus.Active,
              invitedBy: 'user_999',
              createdAt: secondaryMembership.toPrimitives().createdAt.toISOString(),
              updatedAt: secondaryMembership.toPrimitives().updatedAt.toISOString(),
            },
            roleKeys: ['tenant_member'],
            permissionKeys: [TENANT_PERMISSIONS.READ],
          },
          {
            tenant: {
              id: 'tenant_123',
              name: 'SaaS Platform',
              slug: 'saas-platform',
              status: TenantStatus.Draft,
            },
            membership: {
              id: 'membership_123',
              status: MembershipStatus.Active,
              invitedBy: 'user_123',
              createdAt: tenantCreatedAt.toISOString(),
              updatedAt: tenantCreatedAt.toISOString(),
            },
            roleKeys: ['tenant_owner'],
            permissionKeys: ownerTenantPermissionKeys,
          },
        ],
      });

    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(userRepository.save.mock.calls[0][0].toPrimitives()).toMatchObject({
      id: 'user_123',
      preferredTenantId: 'tenant_456',
    });
  });

  it('PUT /api/auth/me/current-tenancy should clear the tenant preference when tenantSlug is null', async () => {
    userRepository.findById.mockResolvedValueOnce(
      User.create({
        id: 'user_123',
        email: 'hello@saas-platform.dev',
        name: 'Jorge',
        avatarUrl: null,
        authProvider: AuthProvider.Password,
        externalAuthId: null,
        preferredTenantId: 'tenant_456',
        createdAt: registeredAt,
        updatedAt: registeredAt,
      }),
    );

    await request(httpServer)
      .put('/api/auth/me/current-tenancy')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ tenantSlug: null })
      .expect(200);

    expect(userRepository.save.mock.calls.at(-1)?.[0].toPrimitives()).toMatchObject({
      id: 'user_123',
      preferredTenantId: null,
    });
  });

  it('POST /api/auth/invitations/:invitationId/accept should return the refreshed authenticated session', async () => {
    await request(httpServer)
      .post('/api/auth/invitations/invitation_123/accept')
      .set('Authorization', `Bearer ${inviteeToken}`)
      .expect(201)
      .expect({
        id: 'user_456',
        email: 'invitee@saas-platform.dev',
        provider: 'password',
        externalAuthId: null,
        currentTenancy: {
          tenant: {
            id: 'tenant_123',
            name: 'SaaS Platform',
            slug: 'saas-platform',
            status: TenantStatus.Draft,
          },
          membership: {
            id: 'membership_123',
            status: MembershipStatus.Active,
            invitedBy: 'user_123',
            createdAt: tenantCreatedAt.toISOString(),
            updatedAt: tenantCreatedAt.toISOString(),
          },
          roleKeys: ['tenant_member'],
          permissionKeys: [
            TENANT_PERMISSIONS.READ,
            TENANT_PERMISSIONS.SUBSCRIPTION_READ,
            TENANT_PERMISSIONS.ENTITLEMENTS_READ,
          ],
          subscription: {
            id: 'subscription_123',
            tenantId: 'tenant_123',
            planId: 'plan_growth_monthly',
            status: 'active',
            startedAt: '2026-04-23T18:00:00.000Z',
            expiresAt: null,
            trialEndsAt: null,
            createdAt: '2026-04-23T18:00:00.000Z',
            updatedAt: '2026-04-23T18:00:00.000Z',
          },
          entitlements: [
            {
              id: 'entitlement_tenant_123_max_users',
              tenantId: 'tenant_123',
              key: 'max_users',
              value: 15,
              source: 'plan',
              createdAt: '2026-04-23T18:00:00.000Z',
              updatedAt: '2026-04-23T18:00:00.000Z',
            },
            {
              id: 'entitlement_tenant_123_products',
              tenantId: 'tenant_123',
              key: 'products',
              value: ['invoicing', 'learning'],
              source: 'plan',
              createdAt: '2026-04-23T18:00:00.000Z',
              updatedAt: '2026-04-23T18:00:00.000Z',
            },
          ],
        },
        pendingInvitations: [],
        sessionState: {
          canSelectTenancy: false,
          hasPendingInvitations: false,
          hasTenancies: true,
          recommendedFlow: 'workspace',
        },
        tenancies: [
          {
            tenant: {
              id: 'tenant_123',
              name: 'SaaS Platform',
              slug: 'saas-platform',
              status: TenantStatus.Draft,
            },
            membership: {
              id: 'membership_123',
              status: MembershipStatus.Active,
              invitedBy: 'user_123',
              createdAt: tenantCreatedAt.toISOString(),
              updatedAt: tenantCreatedAt.toISOString(),
            },
            roleKeys: ['tenant_member'],
            permissionKeys: [
              TENANT_PERMISSIONS.READ,
              TENANT_PERMISSIONS.SUBSCRIPTION_READ,
              TENANT_PERMISSIONS.ENTITLEMENTS_READ,
            ],
          },
        ],
      });

    expect(acceptAuthenticatedUserInvitationUseCase.execute).toHaveBeenCalledWith({
      invitationId: 'invitation_123',
      authenticatedUser: {
        id: 'user_456',
        email: 'invitee@saas-platform.dev',
        provider: 'password',
        externalAuthId: null,
      },
    });
  });

  it('GET /api/auth/invitations/:invitationId should return invitation detail for the authenticated invitee', async () => {
    await request(httpServer)
      .get('/api/auth/invitations/invitation_123')
      .set('Authorization', `Bearer ${inviteeToken}`)
      .expect(200)
      .expect({
        invitation: {
          id: 'invitation_123',
          email: 'invitee@saas-platform.dev',
          roleKey: 'tenant_member',
          status: InvitationStatus.Pending,
          invitedByUserId: 'user_123',
          acceptedByUserId: null,
          expiresAt: invitation.toPrimitives().expiresAt.toISOString(),
          acceptedAt: null,
          createdAt: invitationCreatedAt.toISOString(),
          updatedAt: invitationCreatedAt.toISOString(),
        },
        tenant: {
          id: 'tenant_123',
          name: 'SaaS Platform',
          slug: 'saas-platform',
          status: TenantStatus.Draft,
        },
        canAccept: true,
      });

    expect(getAuthenticatedUserInvitationUseCase.execute).toHaveBeenCalledWith({
      invitationId: 'invitation_123',
      authenticatedUserEmail: 'invitee@saas-platform.dev',
    });
  });

  it('GET /api/auth/me should require a bearer token', async () => {
    await request(httpServer).get('/api/auth/me').expect(401);
  });

  it('POST /api/identity/users should register a user', async () => {
    await request(httpServer)
      .post('/api/identity/users')
      .send({
        email: 'hello@saas-platform.dev',
        authProvider: AuthProvider.Password,
        name: 'Jorge',
      })
      .expect(200)
      .expect({
        id: 'user_123',
        email: 'hello@saas-platform.dev',
        name: 'Jorge',
        avatarUrl: null,
        authProvider: AuthProvider.Password,
        externalAuthId: null,
        createdAt: registeredAt.toISOString(),
        updatedAt: registeredAt.toISOString(),
      });

    expect(registerUserUseCase.execute).toHaveBeenCalledWith({
      email: 'hello@saas-platform.dev',
      authProvider: AuthProvider.Password,
      name: 'Jorge',
      avatarUrl: null,
      externalAuthId: null,
    });
  });

  it('POST /api/identity/users should validate the payload', async () => {
    await request(httpServer)
      .post('/api/identity/users')
      .send({
        email: 'not-an-email',
        authProvider: 'invalid',
      })
      .expect(400);
  });

  it('POST /api/tenancy/tenants should create a tenant', async () => {
    await request(httpServer)
      .post('/api/tenancy/tenants')
      .send({
        name: 'SaaS Platform',
        slug: 'saas-platform',
        ownerUserId: '54d4a4b1-90ec-485e-8ef6-77fb4a484592',
      })
      .expect(201)
      .expect({
        id: 'tenant_123',
        name: 'SaaS Platform',
        slug: 'saas-platform',
        status: TenantStatus.Draft,
        createdAt: tenantCreatedAt.toISOString(),
        updatedAt: tenantCreatedAt.toISOString(),
      });

    expect(createTenantUseCase.execute).toHaveBeenCalledWith({
      name: 'SaaS Platform',
      slug: 'saas-platform',
      ownerUserId: '54d4a4b1-90ec-485e-8ef6-77fb4a484592',
    });
  });

  it('GET /api/tenancy/tenants/:slug should return a tenant', async () => {
    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'tenant_123',
        name: 'SaaS Platform',
        slug: 'saas-platform',
        status: TenantStatus.Draft,
        createdAt: tenantCreatedAt.toISOString(),
        updatedAt: tenantCreatedAt.toISOString(),
      });

    expect(getTenantBySlugUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
    expect(resolveTenantAccessUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      userId: 'user_123',
    });
  });

  it('GET /api/tenancy/tenants/:slug/memberships should list memberships', async () => {
    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/memberships')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'membership_123',
          tenantId: 'tenant_123',
          userId: 'user_123',
          status: MembershipStatus.Active,
          invitedBy: 'user_123',
          createdAt: tenantCreatedAt.toISOString(),
          updatedAt: tenantCreatedAt.toISOString(),
        },
      ]);

    expect(listTenantMembershipsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
    expect(resolveTenantAccessUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      userId: 'user_123',
    });
  });

  it('GET /api/tenancy/tenants/:slug/memberships/:userId/access should return effective access', async () => {
    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/memberships/user_123/access')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        userId: 'user_123',
        membershipId: 'membership_123',
        membershipStatus: MembershipStatus.Active,
        roleKeys: ['tenant_owner'],
        permissionKeys: ownerTenantPermissionKeys,
      });

    expect(getTenantMemberAccessUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      userId: 'user_123',
    });
  });

  it('GET /api/tenancy/tenants/:slug/memberships/:userId should return one membership', async () => {
    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/memberships/user_123')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'membership_123',
        tenantId: 'tenant_123',
        userId: 'user_123',
        status: MembershipStatus.Active,
        invitedBy: 'user_123',
        createdAt: tenantCreatedAt.toISOString(),
        updatedAt: tenantCreatedAt.toISOString(),
      });

    expect(getTenantMembershipByUserUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      userId: 'user_123',
    });
  });

  it('POST /api/tenancy/tenants/:slug/invitations should create an invitation', async () => {
    await request(httpServer)
      .post('/api/tenancy/tenants/saas-platform/invitations')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ email: 'invitee@saas-platform.dev' })
      .expect(201)
      .expect({
        id: 'invitation_123',
        tenantId: 'tenant_123',
        email: 'invitee@saas-platform.dev',
        roleKey: 'tenant_member',
        status: InvitationStatus.Pending,
        invitedByUserId: 'user_123',
        acceptedByUserId: null,
        expiresAt: invitation.toPrimitives().expiresAt.toISOString(),
        acceptedAt: null,
        createdAt: invitationCreatedAt.toISOString(),
        updatedAt: invitationCreatedAt.toISOString(),
      });

    expect(inviteUserToTenantUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      email: 'invitee@saas-platform.dev',
      invitedByUserId: 'user_123',
    });
  });

  it('GET /api/tenancy/tenants/:slug/invitations should list invitations', async () => {
    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/invitations')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect([
        {
          id: 'invitation_123',
          tenantId: 'tenant_123',
          email: 'invitee@saas-platform.dev',
          roleKey: 'tenant_member',
          status: InvitationStatus.Pending,
          invitedByUserId: 'user_123',
          acceptedByUserId: null,
          expiresAt: invitation.toPrimitives().expiresAt.toISOString(),
          acceptedAt: null,
          createdAt: invitationCreatedAt.toISOString(),
          updatedAt: invitationCreatedAt.toISOString(),
        },
      ]);

    expect(listTenantInvitationsUseCase.execute).toHaveBeenCalledWith(
      'saas-platform',
    );
  });

  it('GET /api/tenancy/tenants/:slug/invitations/:invitationId should return one invitation', async () => {
    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/invitations/invitation_123')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .expect({
        id: 'invitation_123',
        tenantId: 'tenant_123',
        email: 'invitee@saas-platform.dev',
        roleKey: 'tenant_member',
        status: InvitationStatus.Pending,
        invitedByUserId: 'user_123',
        acceptedByUserId: null,
        expiresAt: invitation.toPrimitives().expiresAt.toISOString(),
        acceptedAt: null,
        createdAt: invitationCreatedAt.toISOString(),
        updatedAt: invitationCreatedAt.toISOString(),
      });

    expect(getTenantInvitationByIdUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invitationId: 'invitation_123',
    });
  });

  it('POST /api/tenancy/invitations/:invitationId/accept should accept an invitation', async () => {
    await request(httpServer)
      .post('/api/tenancy/invitations/invitation_123/accept')
      .set('Authorization', `Bearer ${memberToken}`)
      .expect(200)
      .expect({
        id: 'membership_123',
        tenantId: 'tenant_123',
        userId: 'user_123',
        status: MembershipStatus.Active,
        invitedBy: 'user_123',
        createdAt: tenantCreatedAt.toISOString(),
        updatedAt: tenantCreatedAt.toISOString(),
      });

    expect(acceptTenantInvitationUseCase.execute).toHaveBeenCalledWith({
      invitationId: 'invitation_123',
      authenticatedUserId: 'user_456',
      authenticatedUserEmail: 'member@saas-platform.dev',
    });
  });

  it('DELETE /api/tenancy/tenants/:slug/invitations/:invitationId should cancel an invitation', async () => {
    await request(httpServer)
      .delete('/api/tenancy/tenants/saas-platform/invitations/invitation_123')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(204);

    expect(cancelTenantInvitationUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invitationId: 'invitation_123',
    });
  });

  it('POST /api/tenancy/tenants/:slug/invitations/:invitationId/resend should resend an invitation', async () => {
    await request(httpServer)
      .post('/api/tenancy/tenants/saas-platform/invitations/invitation_123/resend')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(201)
      .expect({
        id: 'invitation_123',
        tenantId: 'tenant_123',
        email: 'invitee@saas-platform.dev',
        roleKey: 'tenant_member',
        status: InvitationStatus.Pending,
        invitedByUserId: 'user_123',
        acceptedByUserId: null,
        expiresAt: '2026-04-30T12:00:00.000Z',
        acceptedAt: null,
        createdAt: invitationCreatedAt.toISOString(),
        updatedAt: '2026-04-23T12:00:00.000Z',
      });

    expect(resendTenantInvitationUseCase.execute).toHaveBeenCalledWith({
      tenantSlug: 'saas-platform',
      invitationId: 'invitation_123',
    });
  });

  it('POST /api/tenancy/tenants/:slug/invitations should require invitations permission', async () => {
    resolveTenantAccessUseCase.execute.mockResolvedValueOnce({
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      userId: 'user_456',
      membershipId: 'membership_456',
      membershipStatus: MembershipStatus.Active,
      roleKeys: ['tenant_member'],
      permissionKeys: [TENANT_PERMISSIONS.READ],
    });

    await request(httpServer)
      .post('/api/tenancy/tenants/saas-platform/invitations')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ email: 'invitee@saas-platform.dev' })
      .expect(403);
  });

  it('POST /api/tenancy/tenants/:slug/memberships/:userId/roles should assign a role', async () => {
    await request(httpServer)
      .post('/api/tenancy/tenants/saas-platform/memberships/user_123/roles')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ roleKey: 'tenant_member' })
      .expect(204);

    expect(assignMembershipRoleUseCase.execute).toHaveBeenCalledWith({
      actorRoleKeys: ['tenant_owner'],
      tenantSlug: 'saas-platform',
      userId: 'user_123',
      roleKey: 'tenant_member',
    });
  });

  it('DELETE /api/tenancy/tenants/:slug/memberships/:userId/roles/:roleKey should remove a role', async () => {
    await request(httpServer)
      .delete(
        '/api/tenancy/tenants/saas-platform/memberships/user_123/roles/tenant_member',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(204);

    expect(removeMembershipRoleUseCase.execute).toHaveBeenCalledWith({
      actorMembershipId: 'membership_123',
      actorRoleKeys: ['tenant_owner'],
      tenantSlug: 'saas-platform',
      userId: 'user_123',
      roleKey: 'tenant_member',
    });
  });

  it('GET /api/tenancy/tenants/:slug/memberships should require a bearer token', async () => {
    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/memberships')
      .expect(401);
  });

  it('GET /api/auth/me should require a bearer token', async () => {
    await request(httpServer).get('/api/auth/me').expect(401);
  });

  it('GET /api/tenancy/tenants/:slug/memberships should reject a token with invalid audience', async () => {
    const now = Math.floor(Date.now() / 1000);
    const wrongAudienceToken = signJwt({
      sub: 'user_123',
      iss: issuer,
      aud: 'wrong-audience',
      iat: now,
      exp: now + 3600,
      email: 'hello@saas-platform.dev',
      provider: 'password',
    });

    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/memberships')
      .set('Authorization', `Bearer ${wrongAudienceToken}`)
      .expect(401);
  });

  it('GET /api/tenancy/tenants/:slug/memberships should require membership read permission', async () => {
    resolveTenantAccessUseCase.execute.mockResolvedValueOnce({
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      userId: 'user_456',
      membershipId: 'membership_456',
      membershipStatus: MembershipStatus.Active,
      roleKeys: ['tenant_member'],
      permissionKeys: [TENANT_PERMISSIONS.READ],
    });

    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/memberships')
      .set('Authorization', `Bearer ${memberToken}`)
      .expect(403);
  });

  it('GET /api/tenancy/tenants/:slug/memberships/:userId/access should require access read permission', async () => {
    resolveTenantAccessUseCase.execute.mockResolvedValueOnce({
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      userId: 'user_456',
      membershipId: 'membership_456',
      membershipStatus: MembershipStatus.Active,
      roleKeys: ['tenant_member'],
      permissionKeys: [
        TENANT_PERMISSIONS.READ,
        TENANT_PERMISSIONS.MEMBERSHIPS_READ,
      ],
    });

    await request(httpServer)
      .get('/api/tenancy/tenants/saas-platform/memberships/user_123/access')
      .set('Authorization', `Bearer ${memberToken}`)
      .expect(403);
  });

  it('POST /api/tenancy/tenants/:slug/memberships/:userId/roles should require roles manage permission', async () => {
    resolveTenantAccessUseCase.execute.mockResolvedValueOnce({
      tenantId: 'tenant_123',
      tenantSlug: 'saas-platform',
      userId: 'user_456',
      membershipId: 'membership_456',
      membershipStatus: MembershipStatus.Active,
      roleKeys: ['tenant_member'],
      permissionKeys: [
        TENANT_PERMISSIONS.READ,
        TENANT_PERMISSIONS.MEMBERSHIPS_READ,
        TENANT_PERMISSIONS.MEMBERSHIP_ACCESS_READ,
      ],
    });

    await request(httpServer)
      .post('/api/tenancy/tenants/saas-platform/memberships/user_123/roles')
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ roleKey: 'tenant_member' })
      .expect(403);
  });

  it('POST /api/tenancy/tenants/:slug/memberships/:userId/roles should reject protected owner assignment by policy', async () => {
    assignMembershipRoleUseCase.execute.mockRejectedValueOnce(
      new TenantRoleManagementPolicyError(
        'Only tenant owners can assign the tenant_owner role.',
      ),
    );

    await request(httpServer)
      .post('/api/tenancy/tenants/saas-platform/memberships/user_123/roles')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ roleKey: 'tenant_owner' })
      .expect(403);
  });

  it('DELETE /api/tenancy/tenants/:slug/memberships/:userId/roles/:roleKey should reject removing the last owner', async () => {
    removeMembershipRoleUseCase.execute.mockRejectedValueOnce(
      new TenantRoleManagementPolicyError(
        'A tenant must keep at least one tenant_owner.',
      ),
    );

    await request(httpServer)
      .delete(
        '/api/tenancy/tenants/saas-platform/memberships/user_123/roles/tenant_owner',
      )
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(403);
  });

  it('POST /api/tenancy/tenants should validate the payload', async () => {
    await request(httpServer)
      .post('/api/tenancy/tenants')
      .send({
        name: 'S',
        slug: 'Invalid Slug',
      })
      .expect(400);
  });
});
