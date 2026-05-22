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
  let getTenantInvoiceElectronicXmlPreviewUseCase: { execute: jest.Mock };
  let getTenantInvoiceNumberingSettingsUseCase: { execute: jest.Mock };
  let getTenantInvoicingReportSummaryUseCase: { execute: jest.Mock };
  let getTenantInvoiceByIdUseCase: { execute: jest.Mock };
  let getTenantInvoiceItemByIdUseCase: { execute: jest.Mock };
  let getTenantIssuerProfileUseCase: { execute: jest.Mock };
  let getTenantPartyByIdUseCase: { execute: jest.Mock };
  let getTenantConversationThreadByIdUseCase: { execute: jest.Mock };
  let getTenantGrowthAssistDailyAgendaUseCase: { execute: jest.Mock };
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
    playbooks: [
      {
        key: 'reply-now',
        title: 'Responder primero',
        detail:
          'Antes de abrir nueva prospeccion, responde lo que ya llego caliente. Esa es la forma mas simple de no perder conversion por demora.',
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
        playbooks: [
          {
            key: 'reply-now',
            title: 'Responder primero',
            detail:
              'Antes de abrir nueva prospeccion, responde lo que ya llego caliente. Esa es la forma mas simple de no perder conversion por demora.',
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
