import { INestApplication } from '@nestjs/common';
import { createSign, generateKeyPairSync } from 'node:crypto';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import {
  GetUserByIdUseCase,
  RegisterUserUseCase,
  USER_REPOSITORY,
} from '@saas-platform/identity-application';
import { AuthProvider, User } from '@saas-platform/identity-domain';
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
  let getUserByIdUseCase: { execute: jest.Mock };
  let registerUserUseCase: { execute: jest.Mock };
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
  let listTenantInvitationsUseCase: { execute: jest.Mock };
  let listUserPendingInvitationsUseCase: { execute: jest.Mock };
  let listUserTenanciesUseCase: { execute: jest.Mock };
  let listTenantMembershipsUseCase: { execute: jest.Mock };
  let removeMembershipRoleUseCase: { execute: jest.Mock };
  let resendTenantInvitationUseCase: { execute: jest.Mock };
  let resolveTenantAccessUseCase: { execute: jest.Mock };
  let createTenantUseCase: { execute: jest.Mock };
  let ownerToken: string;
  let inviteeToken: string;
  let memberToken: string;
  let issuer: string;
  let audience: string;

  const registeredAt = new Date('2026-04-14T17:00:00.000Z');
  const tenantCreatedAt = new Date('2026-04-14T17:30:00.000Z');
  const invitationCreatedAt = new Date('2026-04-22T20:00:00.000Z');
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
    getUserByIdUseCase = {
      execute: jest.fn().mockResolvedValue(user),
    };
    registerUserUseCase = {
      execute: jest.fn().mockResolvedValue(user),
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
    listTenantInvitationsUseCase = {
      execute: jest.fn().mockResolvedValue([invitation]),
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
          permissionKeys: [TENANT_PERMISSIONS.READ],
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
            permissionKeys: [TENANT_PERMISSIONS.READ],
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
        permissionKeys: [
          TENANT_PERMISSIONS.READ,
          TENANT_PERMISSIONS.MEMBERSHIPS_READ,
          TENANT_PERMISSIONS.MEMBERSHIP_ACCESS_READ,
          TENANT_PERMISSIONS.MEMBERSHIP_ROLES_MANAGE,
          TENANT_PERMISSIONS.INVITATIONS_MANAGE,
        ],
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
          permissionKeys: [
            TENANT_PERMISSIONS.READ,
            TENANT_PERMISSIONS.MEMBERSHIPS_READ,
            TENANT_PERMISSIONS.MEMBERSHIP_ACCESS_READ,
            TENANT_PERMISSIONS.MEMBERSHIP_ROLES_MANAGE,
            TENANT_PERMISSIONS.INVITATIONS_MANAGE,
          ],
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
        permissionKeys: [
          TENANT_PERMISSIONS.READ,
          TENANT_PERMISSIONS.MEMBERSHIPS_READ,
          TENANT_PERMISSIONS.MEMBERSHIP_ACCESS_READ,
          TENANT_PERMISSIONS.MEMBERSHIP_ROLES_MANAGE,
          TENANT_PERMISSIONS.INVITATIONS_MANAGE,
        ],
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
      .overrideProvider(GetUserByIdUseCase)
      .useValue(getUserByIdUseCase)
      .overrideProvider(RegisterUserUseCase)
      .useValue(registerUserUseCase)
      .overrideProvider(USER_REPOSITORY)
      .useValue(userRepository)
      .overrideProvider(GetTenantBySlugUseCase)
      .useValue(getTenantBySlugUseCase)
      .overrideProvider(InviteUserToTenantUseCase)
      .useValue(inviteUserToTenantUseCase)
      .overrideProvider(ListTenantInvitationsUseCase)
      .useValue(listTenantInvitationsUseCase)
      .overrideProvider(CancelTenantInvitationUseCase)
      .useValue(cancelTenantInvitationUseCase)
      .overrideProvider(GetAuthenticatedUserInvitationUseCase)
      .useValue(getAuthenticatedUserInvitationUseCase)
      .overrideProvider(GetTenantInvitationByIdUseCase)
      .useValue(getTenantInvitationByIdUseCase)
      .overrideProvider(ResendTenantInvitationUseCase)
      .useValue(resendTenantInvitationUseCase)
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
          permissionKeys: [
            TENANT_PERMISSIONS.READ,
            TENANT_PERMISSIONS.MEMBERSHIPS_READ,
            TENANT_PERMISSIONS.MEMBERSHIP_ACCESS_READ,
            TENANT_PERMISSIONS.MEMBERSHIP_ROLES_MANAGE,
            TENANT_PERMISSIONS.INVITATIONS_MANAGE,
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
            permissionKeys: [
              TENANT_PERMISSIONS.READ,
              TENANT_PERMISSIONS.MEMBERSHIPS_READ,
              TENANT_PERMISSIONS.MEMBERSHIP_ACCESS_READ,
              TENANT_PERMISSIONS.MEMBERSHIP_ROLES_MANAGE,
              TENANT_PERMISSIONS.INVITATIONS_MANAGE,
            ],
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
        permissionKeys: [
          TENANT_PERMISSIONS.READ,
          TENANT_PERMISSIONS.MEMBERSHIPS_READ,
          TENANT_PERMISSIONS.MEMBERSHIP_ACCESS_READ,
          TENANT_PERMISSIONS.MEMBERSHIP_ROLES_MANAGE,
          TENANT_PERMISSIONS.INVITATIONS_MANAGE,
        ],
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
            permissionKeys: [
              TENANT_PERMISSIONS.READ,
              TENANT_PERMISSIONS.MEMBERSHIPS_READ,
              TENANT_PERMISSIONS.MEMBERSHIP_ACCESS_READ,
              TENANT_PERMISSIONS.MEMBERSHIP_ROLES_MANAGE,
              TENANT_PERMISSIONS.INVITATIONS_MANAGE,
            ],
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
        permissionKeys: [
          TENANT_PERMISSIONS.READ,
          TENANT_PERMISSIONS.MEMBERSHIPS_READ,
          TENANT_PERMISSIONS.MEMBERSHIP_ACCESS_READ,
          TENANT_PERMISSIONS.MEMBERSHIP_ROLES_MANAGE,
          TENANT_PERMISSIONS.INVITATIONS_MANAGE,
        ],
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
            permissionKeys: [
              TENANT_PERMISSIONS.READ,
              TENANT_PERMISSIONS.MEMBERSHIPS_READ,
              TENANT_PERMISSIONS.MEMBERSHIP_ACCESS_READ,
              TENANT_PERMISSIONS.MEMBERSHIP_ROLES_MANAGE,
              TENANT_PERMISSIONS.INVITATIONS_MANAGE,
            ],
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
        permissionKeys: [
          TENANT_PERMISSIONS.READ,
          TENANT_PERMISSIONS.MEMBERSHIPS_READ,
          TENANT_PERMISSIONS.MEMBERSHIP_ACCESS_READ,
          TENANT_PERMISSIONS.MEMBERSHIP_ROLES_MANAGE,
          TENANT_PERMISSIONS.INVITATIONS_MANAGE,
        ],
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
            permissionKeys: [
              TENANT_PERMISSIONS.READ,
              TENANT_PERMISSIONS.MEMBERSHIPS_READ,
              TENANT_PERMISSIONS.MEMBERSHIP_ACCESS_READ,
              TENANT_PERMISSIONS.MEMBERSHIP_ROLES_MANAGE,
              TENANT_PERMISSIONS.INVITATIONS_MANAGE,
            ],
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
          permissionKeys: [TENANT_PERMISSIONS.READ],
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
            permissionKeys: [TENANT_PERMISSIONS.READ],
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
        permissionKeys: [
          TENANT_PERMISSIONS.READ,
          TENANT_PERMISSIONS.MEMBERSHIPS_READ,
          TENANT_PERMISSIONS.MEMBERSHIP_ACCESS_READ,
          TENANT_PERMISSIONS.MEMBERSHIP_ROLES_MANAGE,
          TENANT_PERMISSIONS.INVITATIONS_MANAGE,
        ],
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
