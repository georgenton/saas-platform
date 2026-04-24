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

describe('API', () => {
  let app: INestApplication;
  let httpServer: any;
  let changeTenantPlanUseCase: { execute: jest.Mock };
  let entitlementRepository: { findByTenantId: jest.Mock };
  let getPlanByKeyUseCase: { execute: jest.Mock };
  let getTenantEnabledProductByKeyUseCase: { execute: jest.Mock };
  let getUserByIdUseCase: { execute: jest.Mock };
  let getProductByKeyUseCase: { execute: jest.Mock };
  let getTenantSubscriptionUseCase: { execute: jest.Mock };
  let listTenantEnabledProductsUseCase: { execute: jest.Mock };
  let listTenantFeatureFlagsUseCase: { execute: jest.Mock };
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
    getTenantSubscriptionUseCase = {
      execute: jest.fn().mockResolvedValue(tenantSubscription),
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
    listTenantFeatureFlagsUseCase = {
      execute: jest.fn().mockResolvedValue([psychologyProductDisabledFlag]),
    };
    setTenantFeatureFlagUseCase = {
      execute: jest.fn().mockResolvedValue(psychologyProductDisabledFlag),
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
      .overrideProvider(GetTenantSubscriptionUseCase)
      .useValue(getTenantSubscriptionUseCase)
      .overrideProvider(ListTenantEnabledProductsUseCase)
      .useValue(listTenantEnabledProductsUseCase)
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

    app = moduleFixture.createNestApplication();
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
