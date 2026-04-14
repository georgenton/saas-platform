import { Module } from '@nestjs/common';
import {
  CreateTenantUseCase,
  MEMBERSHIP_ID_GENERATOR,
  TENANT_ID_GENERATOR,
  TENANT_PROVISIONING_REPOSITORY,
  TENANT_REPOSITORY,
} from '@saas-platform/tenancy-application';
import { TenancyPersistenceModule } from '@saas-platform/infra-prisma';
import { TenancyController } from './tenancy.controller';

@Module({
  imports: [TenancyPersistenceModule],
  controllers: [TenancyController],
  providers: [
    {
      provide: CreateTenantUseCase,
      inject: [
        TENANT_REPOSITORY,
        TENANT_ID_GENERATOR,
        MEMBERSHIP_ID_GENERATOR,
        TENANT_PROVISIONING_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        tenantIdGenerator,
        membershipIdGenerator,
        tenantProvisioningRepository,
      ) =>
        new CreateTenantUseCase(
          tenantRepository,
          tenantIdGenerator,
          membershipIdGenerator,
          tenantProvisioningRepository,
        ),
    },
  ],
  exports: [CreateTenantUseCase],
})
export class TenancyModule {}
