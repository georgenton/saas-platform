import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase,
  GetTenantMedicalClinicPatientIntakeWorkspaceUseCase,
  GetTenantMedicalClinicProductAnchorUseCase,
  GetTenantMedicalClinicProfileWorkspaceUseCase,
  MEDICAL_CLINICS_PERMISSIONS,
  RequestTenantMedicalClinicBillingTaxBridgeUseCase,
  RequestTenantMedicalClinicGrowthReminderBridgeUseCase,
} from '@saas-platform/medical-clinics-application';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
import { RequireTenantProductAccess } from '../tenancy/require-tenant-product-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { TenantProductAccessGuard } from '../tenancy/tenant-product-access.guard';
import {
  MedicalClinicAppointmentSchedulingWorkspaceResponseDto,
  MedicalClinicBillingTaxBridgeResponseDto,
  MedicalClinicGrowthReminderBridgeResponseDto,
  MedicalClinicPatientIntakeWorkspaceResponseDto,
  MedicalClinicProductAnchorResponseDto,
  MedicalClinicProfileWorkspaceResponseDto,
  toMedicalClinicAppointmentSchedulingWorkspaceResponseDto,
  toMedicalClinicBillingTaxBridgeResponseDto,
  toMedicalClinicGrowthReminderBridgeResponseDto,
  toMedicalClinicPatientIntakeWorkspaceResponseDto,
  toMedicalClinicProductAnchorResponseDto,
  toMedicalClinicProfileWorkspaceResponseDto,
} from './dto/medical-clinics.response';

@Controller('medical-clinics/tenants')
@UseGuards(
  JwtAuthenticationGuard,
  TenantMembershipGuard,
  TenantProductAccessGuard,
  TenantPermissionGuard,
)
@RequireTenantProductAccess({ productKey: 'medical-clinics' })
@RequireTenantPermission(MEDICAL_CLINICS_PERMISSIONS.READ)
export class MedicalClinicsController {
  constructor(
    private readonly getTenantMedicalClinicProductAnchorUseCase: GetTenantMedicalClinicProductAnchorUseCase,
    private readonly getTenantMedicalClinicProfileWorkspaceUseCase: GetTenantMedicalClinicProfileWorkspaceUseCase,
    private readonly getTenantMedicalClinicPatientIntakeWorkspaceUseCase: GetTenantMedicalClinicPatientIntakeWorkspaceUseCase,
    private readonly getTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase: GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase,
    private readonly requestTenantMedicalClinicGrowthReminderBridgeUseCase: RequestTenantMedicalClinicGrowthReminderBridgeUseCase,
    private readonly requestTenantMedicalClinicBillingTaxBridgeUseCase: RequestTenantMedicalClinicBillingTaxBridgeUseCase,
  ) {}

  @Get(':slug/product-anchor')
  async getProductAnchor(
    @Param('slug') tenantSlug: string,
  ): Promise<MedicalClinicProductAnchorResponseDto> {
    return toMedicalClinicProductAnchorResponseDto(
      await this.getTenantMedicalClinicProductAnchorUseCase.execute({
        tenantSlug,
      }),
    );
  }

  @Get(':slug/profile-workspace')
  async getProfileWorkspace(
    @Param('slug') tenantSlug: string,
  ): Promise<MedicalClinicProfileWorkspaceResponseDto> {
    return toMedicalClinicProfileWorkspaceResponseDto(
      await this.getTenantMedicalClinicProfileWorkspaceUseCase.execute({
        tenantSlug,
      }),
    );
  }

  @Get(':slug/patient-intake-workspace')
  async getPatientIntakeWorkspace(
    @Param('slug') tenantSlug: string,
  ): Promise<MedicalClinicPatientIntakeWorkspaceResponseDto> {
    return toMedicalClinicPatientIntakeWorkspaceResponseDto(
      await this.getTenantMedicalClinicPatientIntakeWorkspaceUseCase.execute({
        tenantSlug,
      }),
    );
  }

  @Get(':slug/appointment-scheduling-workspace')
  async getAppointmentSchedulingWorkspace(
    @Param('slug') tenantSlug: string,
  ): Promise<MedicalClinicAppointmentSchedulingWorkspaceResponseDto> {
    return toMedicalClinicAppointmentSchedulingWorkspaceResponseDto(
      await this.getTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase.execute(
        {
          tenantSlug,
        },
      ),
    );
  }

  @Get(':slug/growth-reminder-bridge')
  async requestGrowthReminderBridge(
    @Param('slug') tenantSlug: string,
  ): Promise<MedicalClinicGrowthReminderBridgeResponseDto> {
    return toMedicalClinicGrowthReminderBridgeResponseDto(
      await this.requestTenantMedicalClinicGrowthReminderBridgeUseCase.execute({
        tenantSlug,
      }),
    );
  }

  @Get(':slug/billing-tax-bridge')
  async requestBillingTaxBridge(
    @Param('slug') tenantSlug: string,
  ): Promise<MedicalClinicBillingTaxBridgeResponseDto> {
    return toMedicalClinicBillingTaxBridgeResponseDto(
      await this.requestTenantMedicalClinicBillingTaxBridgeUseCase.execute({
        tenantSlug,
      }),
    );
  }
}
