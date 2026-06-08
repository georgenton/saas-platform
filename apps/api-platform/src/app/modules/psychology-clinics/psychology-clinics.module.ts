import { Module } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '@saas-platform/catalog-application';
import {
  ENTITLEMENT_REPOSITORY,
  GetTenantEnabledProductByKeyUseCase,
  ListTenantEnabledProductsUseCase,
} from '@saas-platform/commercial-application';
import { FEATURE_FLAG_REPOSITORY } from '@saas-platform/feature-flags-application';
import {
  CatalogPersistenceModule,
  CommercialPersistenceModule,
  FeatureFlagsPersistenceModule,
  PsychologyClinicsPersistenceModule,
  TenancyPersistenceModule,
} from '@saas-platform/infra-prisma';
import {
  ResolveTenantAccessUseCase,
  TENANT_ACCESS_REPOSITORY,
  TENANT_REPOSITORY,
} from '@saas-platform/tenancy-application';
import {
  CreateTenantPsychologyClinicSessionUseCase,
  GetTenantPsychologyClinicFoundationCloseoutUseCase,
  GetTenantPsychologyClinicPatientIntakeWorkspaceUseCase,
  GetTenantPsychologyClinicProductAnchorUseCase,
  GetTenantPsychologyClinicProfileWorkspaceUseCase,
  GetTenantPsychologyClinicSessionSchedulingWorkspaceUseCase,
  PSYCHOLOGY_CLINIC_ID_GENERATOR,
  PSYCHOLOGY_CLINIC_OPERATIONS_REPOSITORY,
  RegisterTenantPsychologyClinicPatientIntakeUseCase,
  RequestTenantPsychologyClinicSessionNoteDraftPacketUseCase,
  TransitionTenantPsychologyClinicSessionUseCase,
  UpsertTenantPsychologyClinicProfileWorkspaceUseCase,
} from '@saas-platform/psychology-clinics-application';
import { AuthModule } from '../auth/auth.module';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { TenantProductAccessGuard } from '../tenancy/tenant-product-access.guard';
import { PsychologyClinicsController } from './psychology-clinics.controller';

@Module({
  imports: [
    AuthModule,
    CatalogPersistenceModule,
    CommercialPersistenceModule,
    FeatureFlagsPersistenceModule,
    PsychologyClinicsPersistenceModule,
    TenancyPersistenceModule,
  ],
  controllers: [PsychologyClinicsController],
  providers: [
    GetTenantPsychologyClinicProductAnchorUseCase,
    {
      provide: GetTenantPsychologyClinicProfileWorkspaceUseCase,
      inject: [PSYCHOLOGY_CLINIC_OPERATIONS_REPOSITORY],
      useFactory: (operationsRepository) =>
        new GetTenantPsychologyClinicProfileWorkspaceUseCase(
          operationsRepository,
        ),
    },
    {
      provide: UpsertTenantPsychologyClinicProfileWorkspaceUseCase,
      inject: [
        PSYCHOLOGY_CLINIC_OPERATIONS_REPOSITORY,
        PSYCHOLOGY_CLINIC_ID_GENERATOR,
      ],
      useFactory: (operationsRepository, idGenerator) =>
        new UpsertTenantPsychologyClinicProfileWorkspaceUseCase(
          operationsRepository,
          idGenerator,
        ),
    },
    {
      provide: GetTenantPsychologyClinicPatientIntakeWorkspaceUseCase,
      inject: [PSYCHOLOGY_CLINIC_OPERATIONS_REPOSITORY],
      useFactory: (operationsRepository) =>
        new GetTenantPsychologyClinicPatientIntakeWorkspaceUseCase(
          operationsRepository,
        ),
    },
    {
      provide: RegisterTenantPsychologyClinicPatientIntakeUseCase,
      inject: [
        PSYCHOLOGY_CLINIC_OPERATIONS_REPOSITORY,
        PSYCHOLOGY_CLINIC_ID_GENERATOR,
      ],
      useFactory: (operationsRepository, idGenerator) =>
        new RegisterTenantPsychologyClinicPatientIntakeUseCase(
          operationsRepository,
          idGenerator,
        ),
    },
    {
      provide: GetTenantPsychologyClinicSessionSchedulingWorkspaceUseCase,
      inject: [PSYCHOLOGY_CLINIC_OPERATIONS_REPOSITORY],
      useFactory: (operationsRepository) =>
        new GetTenantPsychologyClinicSessionSchedulingWorkspaceUseCase(
          operationsRepository,
        ),
    },
    {
      provide: CreateTenantPsychologyClinicSessionUseCase,
      inject: [
        PSYCHOLOGY_CLINIC_OPERATIONS_REPOSITORY,
        PSYCHOLOGY_CLINIC_ID_GENERATOR,
      ],
      useFactory: (operationsRepository, idGenerator) =>
        new CreateTenantPsychologyClinicSessionUseCase(
          operationsRepository,
          idGenerator,
        ),
    },
    {
      provide: TransitionTenantPsychologyClinicSessionUseCase,
      inject: [
        PSYCHOLOGY_CLINIC_OPERATIONS_REPOSITORY,
        PSYCHOLOGY_CLINIC_ID_GENERATOR,
      ],
      useFactory: (operationsRepository, idGenerator) =>
        new TransitionTenantPsychologyClinicSessionUseCase(
          operationsRepository,
          idGenerator,
        ),
    },
    {
      provide: RequestTenantPsychologyClinicSessionNoteDraftPacketUseCase,
      inject: [
        PSYCHOLOGY_CLINIC_OPERATIONS_REPOSITORY,
        PSYCHOLOGY_CLINIC_ID_GENERATOR,
      ],
      useFactory: (operationsRepository, idGenerator) =>
        new RequestTenantPsychologyClinicSessionNoteDraftPacketUseCase(
          operationsRepository,
          idGenerator,
        ),
    },
    {
      provide: GetTenantPsychologyClinicFoundationCloseoutUseCase,
      inject: [PSYCHOLOGY_CLINIC_OPERATIONS_REPOSITORY],
      useFactory: (operationsRepository) =>
        new GetTenantPsychologyClinicFoundationCloseoutUseCase(
          operationsRepository,
        ),
    },
    {
      provide: ResolveTenantAccessUseCase,
      inject: [TENANT_REPOSITORY, TENANT_ACCESS_REPOSITORY],
      useFactory: (tenantRepository, tenantAccessRepository) =>
        new ResolveTenantAccessUseCase(
          tenantRepository,
          tenantAccessRepository,
        ),
    },
    {
      provide: ListTenantEnabledProductsUseCase,
      inject: [
        TENANT_REPOSITORY,
        ENTITLEMENT_REPOSITORY,
        PRODUCT_REPOSITORY,
        FEATURE_FLAG_REPOSITORY,
      ],
      useFactory: (
        tenantRepository,
        entitlementRepository,
        productRepository,
        featureFlagRepository,
      ) =>
        new ListTenantEnabledProductsUseCase(
          tenantRepository,
          entitlementRepository,
          productRepository,
          featureFlagRepository,
        ),
    },
    {
      provide: GetTenantEnabledProductByKeyUseCase,
      inject: [PRODUCT_REPOSITORY, ListTenantEnabledProductsUseCase],
      useFactory: (productRepository, listTenantEnabledProductsUseCase) =>
        new GetTenantEnabledProductByKeyUseCase(
          productRepository,
          listTenantEnabledProductsUseCase,
        ),
    },
    TenantMembershipGuard,
    TenantPermissionGuard,
    TenantProductAccessGuard,
  ],
})
export class PsychologyClinicsModule {}
