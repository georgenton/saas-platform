import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { RegisterUserUseCase } from '@saas-platform/identity-application';
import { AuthProvider, User } from '@saas-platform/identity-domain';
import { PrismaService } from '@saas-platform/infra-prisma';
import { CreateTenantUseCase } from '@saas-platform/tenancy-application';
import { Tenant, TenantStatus } from '@saas-platform/tenancy-domain';
import { AppModule } from '../../../api-platform/src/app/app.module';
import { configureApp } from '../../../api-platform/src/app/app.setup';

describe('API', () => {
  let app: INestApplication;
  let httpApp: any;
  let registerUserUseCase: { execute: jest.Mock };
  let createTenantUseCase: { execute: jest.Mock };

  const registeredAt = new Date('2026-04-14T17:00:00.000Z');
  const tenantCreatedAt = new Date('2026-04-14T17:30:00.000Z');

  beforeAll(async () => {
    registerUserUseCase = {
      execute: jest.fn().mockResolvedValue(
        User.create({
          id: 'user_123',
          email: 'hello@saas-platform.dev',
          name: 'Jorge',
          avatarUrl: null,
          authProvider: AuthProvider.Password,
          externalAuthId: null,
          createdAt: registeredAt,
          updatedAt: registeredAt,
        }),
      ),
    };

    createTenantUseCase = {
      execute: jest.fn().mockResolvedValue(
        Tenant.create({
          id: 'tenant_123',
          name: 'SaaS Platform',
          slug: 'saas-platform',
          status: TenantStatus.Draft,
          createdAt: tenantCreatedAt,
          updatedAt: tenantCreatedAt,
        }),
      ),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
      })
      .overrideProvider(RegisterUserUseCase)
      .useValue(registerUserUseCase)
      .overrideProvider(CreateTenantUseCase)
      .useValue(createTenantUseCase)
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
    httpApp = app.getHttpAdapter().getInstance();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api should return a message', async () => {
    await request(httpApp)
      .get('/api')
      .expect(200)
      .expect({ message: 'Hello API' });
  });

  it('POST /api/identity/users should register a user', async () => {
    await request(httpApp)
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
    await request(httpApp)
      .post('/api/identity/users')
      .send({
        email: 'not-an-email',
        authProvider: 'invalid',
      })
      .expect(400);
  });

  it('POST /api/tenancy/tenants should create a tenant', async () => {
    await request(httpApp)
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

  it('POST /api/tenancy/tenants should validate the payload', async () => {
    await request(httpApp)
      .post('/api/tenancy/tenants')
      .send({
        name: 'S',
        slug: 'Invalid Slug',
      })
      .expect(400);
  });
});
