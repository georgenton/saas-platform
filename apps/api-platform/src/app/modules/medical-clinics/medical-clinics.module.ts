import { Module } from '@nestjs/common';
import {
  CreateTenantMedicalClinicAppointmentUseCase,
  GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase,
  GetTenantMedicalClinicCarePlanTaskWorkspaceUseCase,
  GetTenantMedicalClinicClinicalEvidenceRegistryUseCase,
  GetTenantMedicalClinicEncounterWorkspaceUseCase,
  GetTenantMedicalClinicPatientClinicalTimelineWorkspaceUseCase,
  GetTenantMedicalClinicPatientIntakeWorkspaceUseCase,
  GetTenantMedicalClinicProductAnchorUseCase,
  GetTenantMedicalClinicProfileWorkspaceUseCase,
  GetTenantMedicalClinicTreatmentFollowUpReadinessUseCase,
  MEDICAL_CLINIC_ID_GENERATOR,
  MEDICAL_CLINIC_OPERATIONS_REPOSITORY,
  RegisterTenantMedicalClinicPatientIntakeUseCase,
  RequestTenantMedicalClinicClinicalBoundaryCloseoutUseCase,
  RequestTenantMedicalClinicClinicalNoteDraftPacketUseCase,
  RequestTenantMedicalClinicEncounterCloseoutUseCase,
  RequestTenantMedicalClinicPrescriptionReadinessPacketUseCase,
  RequestTenantMedicalClinicBillingTaxBridgeUseCase,
  RequestTenantMedicalClinicGrowthReminderBridgeUseCase,
  RequestTenantMedicalClinicMedicalHistoryDraftRecordUseCase,
  RequestTenantMedicalClinicOrdersReferralReadinessPacketUseCase,
  RequestTenantMedicalClinicRecordsCloseoutUseCase,
  TransitionTenantMedicalClinicAppointmentUseCase,
  UpsertTenantMedicalClinicProfileWorkspaceUseCase,
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
  MedicalClinicsPersistenceModule,
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
    MedicalClinicsPersistenceModule,
    TenancyPersistenceModule,
  ],
  controllers: [MedicalClinicsController],
  providers: [
    GetTenantMedicalClinicProductAnchorUseCase,
    {
      provide: GetTenantMedicalClinicProfileWorkspaceUseCase,
      inject: [MEDICAL_CLINIC_OPERATIONS_REPOSITORY],
      useFactory: (operationsRepository) =>
        new GetTenantMedicalClinicProfileWorkspaceUseCase(operationsRepository),
    },
    {
      provide: UpsertTenantMedicalClinicProfileWorkspaceUseCase,
      inject: [
        MEDICAL_CLINIC_OPERATIONS_REPOSITORY,
        MEDICAL_CLINIC_ID_GENERATOR,
      ],
      useFactory: (operationsRepository, idGenerator) =>
        new UpsertTenantMedicalClinicProfileWorkspaceUseCase(
          operationsRepository,
          idGenerator,
        ),
    },
    {
      provide: GetTenantMedicalClinicPatientIntakeWorkspaceUseCase,
      inject: [MEDICAL_CLINIC_OPERATIONS_REPOSITORY],
      useFactory: (operationsRepository) =>
        new GetTenantMedicalClinicPatientIntakeWorkspaceUseCase(
          operationsRepository,
        ),
    },
    {
      provide: RegisterTenantMedicalClinicPatientIntakeUseCase,
      inject: [
        MEDICAL_CLINIC_OPERATIONS_REPOSITORY,
        MEDICAL_CLINIC_ID_GENERATOR,
      ],
      useFactory: (operationsRepository, idGenerator) =>
        new RegisterTenantMedicalClinicPatientIntakeUseCase(
          operationsRepository,
          idGenerator,
        ),
    },
    {
      provide: GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase,
      inject: [MEDICAL_CLINIC_OPERATIONS_REPOSITORY],
      useFactory: (operationsRepository) =>
        new GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase(
          operationsRepository,
        ),
    },
    {
      provide: CreateTenantMedicalClinicAppointmentUseCase,
      inject: [
        MEDICAL_CLINIC_OPERATIONS_REPOSITORY,
        MEDICAL_CLINIC_ID_GENERATOR,
      ],
      useFactory: (operationsRepository, idGenerator) =>
        new CreateTenantMedicalClinicAppointmentUseCase(
          operationsRepository,
          idGenerator,
        ),
    },
    {
      provide: TransitionTenantMedicalClinicAppointmentUseCase,
      inject: [
        MEDICAL_CLINIC_OPERATIONS_REPOSITORY,
        MEDICAL_CLINIC_ID_GENERATOR,
      ],
      useFactory: (operationsRepository, idGenerator) =>
        new TransitionTenantMedicalClinicAppointmentUseCase(
          operationsRepository,
          idGenerator,
        ),
    },
    {
      provide: RequestTenantMedicalClinicGrowthReminderBridgeUseCase,
      inject: [
        MEDICAL_CLINIC_OPERATIONS_REPOSITORY,
        MEDICAL_CLINIC_ID_GENERATOR,
      ],
      useFactory: (operationsRepository, idGenerator) =>
        new RequestTenantMedicalClinicGrowthReminderBridgeUseCase(
          operationsRepository,
          idGenerator,
        ),
    },
    {
      provide: RequestTenantMedicalClinicBillingTaxBridgeUseCase,
      inject: [
        MEDICAL_CLINIC_OPERATIONS_REPOSITORY,
        MEDICAL_CLINIC_ID_GENERATOR,
      ],
      useFactory: (operationsRepository, idGenerator) =>
        new RequestTenantMedicalClinicBillingTaxBridgeUseCase(
          operationsRepository,
          idGenerator,
        ),
    },
    {
      provide: GetTenantMedicalClinicEncounterWorkspaceUseCase,
      inject: [MEDICAL_CLINIC_OPERATIONS_REPOSITORY],
      useFactory: (operationsRepository) =>
        new GetTenantMedicalClinicEncounterWorkspaceUseCase(
          operationsRepository,
        ),
    },
    {
      provide: RequestTenantMedicalClinicClinicalNoteDraftPacketUseCase,
      inject: [
        MEDICAL_CLINIC_OPERATIONS_REPOSITORY,
        MEDICAL_CLINIC_ID_GENERATOR,
      ],
      useFactory: (operationsRepository, idGenerator) =>
        new RequestTenantMedicalClinicClinicalNoteDraftPacketUseCase(
          operationsRepository,
          idGenerator,
        ),
    },
    {
      provide: GetTenantMedicalClinicTreatmentFollowUpReadinessUseCase,
      inject: [MEDICAL_CLINIC_OPERATIONS_REPOSITORY],
      useFactory: (operationsRepository) =>
        new GetTenantMedicalClinicTreatmentFollowUpReadinessUseCase(
          operationsRepository,
        ),
    },
    {
      provide: RequestTenantMedicalClinicPrescriptionReadinessPacketUseCase,
      inject: [
        MEDICAL_CLINIC_OPERATIONS_REPOSITORY,
        MEDICAL_CLINIC_ID_GENERATOR,
      ],
      useFactory: (operationsRepository, idGenerator) =>
        new RequestTenantMedicalClinicPrescriptionReadinessPacketUseCase(
          operationsRepository,
          idGenerator,
        ),
    },
    {
      provide: RequestTenantMedicalClinicEncounterCloseoutUseCase,
      inject: [
        MEDICAL_CLINIC_OPERATIONS_REPOSITORY,
        MEDICAL_CLINIC_ID_GENERATOR,
      ],
      useFactory: (operationsRepository, idGenerator) =>
        new RequestTenantMedicalClinicEncounterCloseoutUseCase(
          operationsRepository,
          idGenerator,
        ),
    },
    RequestTenantMedicalClinicClinicalBoundaryCloseoutUseCase,
    {
      provide: GetTenantMedicalClinicPatientClinicalTimelineWorkspaceUseCase,
      inject: [MEDICAL_CLINIC_OPERATIONS_REPOSITORY],
      useFactory: (operationsRepository) =>
        new GetTenantMedicalClinicPatientClinicalTimelineWorkspaceUseCase(
          operationsRepository,
        ),
    },
    {
      provide: RequestTenantMedicalClinicMedicalHistoryDraftRecordUseCase,
      inject: [
        MEDICAL_CLINIC_OPERATIONS_REPOSITORY,
        MEDICAL_CLINIC_ID_GENERATOR,
      ],
      useFactory: (operationsRepository, idGenerator) =>
        new RequestTenantMedicalClinicMedicalHistoryDraftRecordUseCase(
          operationsRepository,
          idGenerator,
        ),
    },
    {
      provide: GetTenantMedicalClinicClinicalEvidenceRegistryUseCase,
      inject: [MEDICAL_CLINIC_OPERATIONS_REPOSITORY],
      useFactory: (operationsRepository) =>
        new GetTenantMedicalClinicClinicalEvidenceRegistryUseCase(
          operationsRepository,
        ),
    },
    {
      provide: RequestTenantMedicalClinicOrdersReferralReadinessPacketUseCase,
      inject: [
        MEDICAL_CLINIC_OPERATIONS_REPOSITORY,
        MEDICAL_CLINIC_ID_GENERATOR,
      ],
      useFactory: (operationsRepository, idGenerator) =>
        new RequestTenantMedicalClinicOrdersReferralReadinessPacketUseCase(
          operationsRepository,
          idGenerator,
        ),
    },
    {
      provide: GetTenantMedicalClinicCarePlanTaskWorkspaceUseCase,
      inject: [MEDICAL_CLINIC_OPERATIONS_REPOSITORY],
      useFactory: (operationsRepository) =>
        new GetTenantMedicalClinicCarePlanTaskWorkspaceUseCase(
          operationsRepository,
        ),
    },
    {
      provide: RequestTenantMedicalClinicRecordsCloseoutUseCase,
      inject: [
        MEDICAL_CLINIC_OPERATIONS_REPOSITORY,
        MEDICAL_CLINIC_ID_GENERATOR,
      ],
      useFactory: (operationsRepository, idGenerator) =>
        new RequestTenantMedicalClinicRecordsCloseoutUseCase(
          operationsRepository,
          idGenerator,
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
export class MedicalClinicsModule {}
