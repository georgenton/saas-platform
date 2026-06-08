import { Module } from '@nestjs/common';
import {
  GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase,
  GetTenantMedicalClinicPatientIntakeWorkspaceUseCase,
  GetTenantMedicalClinicProductAnchorUseCase,
  GetTenantMedicalClinicProfileWorkspaceUseCase,
  RequestTenantMedicalClinicBillingTaxBridgeUseCase,
  RequestTenantMedicalClinicGrowthReminderBridgeUseCase,
} from '@saas-platform/medical-clinics-application';
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
  TenancyPersistenceModule,
} from '@saas-platform/infra-prisma';
import {
  ResolveTenantAccessUseCase,
  TENANT_ACCESS_REPOSITORY,
  TENANT_REPOSITORY,
} from '@saas-platform/tenancy-application';
import { AuthModule } from '../auth/auth.module';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { TenantProductAccessGuard } from '../tenancy/tenant-product-access.guard';
import { MedicalClinicsController } from './medical-clinics.controller';

@Module({
  imports: [
    AuthModule,
    CatalogPersistenceModule,
    CommercialPersistenceModule,
    FeatureFlagsPersistenceModule,
    TenancyPersistenceModule,
  ],
  controllers: [MedicalClinicsController],
  providers: [
    GetTenantMedicalClinicProductAnchorUseCase,
    GetTenantMedicalClinicProfileWorkspaceUseCase,
    GetTenantMedicalClinicPatientIntakeWorkspaceUseCase,
    GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase,
    RequestTenantMedicalClinicGrowthReminderBridgeUseCase,
    RequestTenantMedicalClinicBillingTaxBridgeUseCase,
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
export class MedicalClinicsModule {}
