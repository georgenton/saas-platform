import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  CreateTenantMedicalClinicAppointmentUseCase,
  GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase,
  GetTenantMedicalClinicEncounterWorkspaceUseCase,
  GetTenantMedicalClinicPatientIntakeWorkspaceUseCase,
  GetTenantMedicalClinicProductAnchorUseCase,
  GetTenantMedicalClinicProfileWorkspaceUseCase,
  GetTenantMedicalClinicTreatmentFollowUpReadinessUseCase,
  MEDICAL_CLINICS_PERMISSIONS,
  RegisterTenantMedicalClinicPatientIntakeUseCase,
  RequestTenantMedicalClinicBillingTaxBridgeUseCase,
  RequestTenantMedicalClinicClinicalBoundaryCloseoutUseCase,
  RequestTenantMedicalClinicClinicalNoteDraftPacketUseCase,
  RequestTenantMedicalClinicEncounterCloseoutUseCase,
  RequestTenantMedicalClinicGrowthReminderBridgeUseCase,
  RequestTenantMedicalClinicPrescriptionReadinessPacketUseCase,
  TransitionTenantMedicalClinicAppointmentUseCase,
  UpsertTenantMedicalClinicProfileWorkspaceUseCase,
} from '@saas-platform/medical-clinics-application';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
import { RequireTenantProductAccess } from '../tenancy/require-tenant-product-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { TenantProductAccessGuard } from '../tenancy/tenant-product-access.guard';
import {
  CreateMedicalClinicAppointmentRequestDto,
  MedicalClinicAppointmentRecordResponseDto,
  MedicalClinicAppointmentSchedulingWorkspaceResponseDto,
  MedicalClinicBillingTaxBridgeResponseDto,
  MedicalClinicClinicalBoundaryCloseoutResponseDto,
  MedicalClinicClinicalNoteDraftPacketResponseDto,
  MedicalClinicEncounterCloseoutResponseDto,
  MedicalClinicEncounterWorkspaceResponseDto,
  MedicalClinicGrowthReminderBridgeResponseDto,
  MedicalClinicPatientRecordResponseDto,
  MedicalClinicPatientIntakeWorkspaceResponseDto,
  MedicalClinicPrescriptionReadinessPacketResponseDto,
  MedicalClinicProductAnchorResponseDto,
  MedicalClinicProfileWorkspaceResponseDto,
  MedicalClinicTreatmentFollowUpReadinessResponseDto,
  RegisterMedicalClinicPatientIntakeRequestDto,
  TransitionMedicalClinicAppointmentRequestDto,
  UpsertMedicalClinicProfileWorkspaceRequestDto,
  toMedicalClinicAppointmentRecordResponseDto,
  toMedicalClinicAppointmentSchedulingWorkspaceResponseDto,
  toMedicalClinicBillingTaxBridgeResponseDto,
  toMedicalClinicClinicalBoundaryCloseoutResponseDto,
  toMedicalClinicClinicalNoteDraftPacketResponseDto,
  toMedicalClinicEncounterCloseoutResponseDto,
  toMedicalClinicEncounterWorkspaceResponseDto,
  toMedicalClinicGrowthReminderBridgeResponseDto,
  toMedicalClinicPatientRecordResponseDto,
  toMedicalClinicPatientIntakeWorkspaceResponseDto,
  toMedicalClinicPrescriptionReadinessPacketResponseDto,
  toMedicalClinicProductAnchorResponseDto,
  toMedicalClinicProfileWorkspaceResponseDto,
  toMedicalClinicTreatmentFollowUpReadinessResponseDto,
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
    private readonly upsertTenantMedicalClinicProfileWorkspaceUseCase: UpsertTenantMedicalClinicProfileWorkspaceUseCase,
    private readonly getTenantMedicalClinicPatientIntakeWorkspaceUseCase: GetTenantMedicalClinicPatientIntakeWorkspaceUseCase,
    private readonly registerTenantMedicalClinicPatientIntakeUseCase: RegisterTenantMedicalClinicPatientIntakeUseCase,
    private readonly getTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase: GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase,
    private readonly createTenantMedicalClinicAppointmentUseCase: CreateTenantMedicalClinicAppointmentUseCase,
    private readonly transitionTenantMedicalClinicAppointmentUseCase: TransitionTenantMedicalClinicAppointmentUseCase,
    private readonly requestTenantMedicalClinicGrowthReminderBridgeUseCase: RequestTenantMedicalClinicGrowthReminderBridgeUseCase,
    private readonly requestTenantMedicalClinicBillingTaxBridgeUseCase: RequestTenantMedicalClinicBillingTaxBridgeUseCase,
    private readonly getTenantMedicalClinicEncounterWorkspaceUseCase: GetTenantMedicalClinicEncounterWorkspaceUseCase,
    private readonly requestTenantMedicalClinicClinicalNoteDraftPacketUseCase: RequestTenantMedicalClinicClinicalNoteDraftPacketUseCase,
    private readonly getTenantMedicalClinicTreatmentFollowUpReadinessUseCase: GetTenantMedicalClinicTreatmentFollowUpReadinessUseCase,
    private readonly requestTenantMedicalClinicPrescriptionReadinessPacketUseCase: RequestTenantMedicalClinicPrescriptionReadinessPacketUseCase,
    private readonly requestTenantMedicalClinicEncounterCloseoutUseCase: RequestTenantMedicalClinicEncounterCloseoutUseCase,
    private readonly requestTenantMedicalClinicClinicalBoundaryCloseoutUseCase: RequestTenantMedicalClinicClinicalBoundaryCloseoutUseCase,
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

  @Put(':slug/profile-workspace')
  @RequireTenantPermission(MEDICAL_CLINICS_PERMISSIONS.MANAGE)
  async upsertProfileWorkspace(
    @Param('slug') tenantSlug: string,
    @Body() body: UpsertMedicalClinicProfileWorkspaceRequestDto,
  ): Promise<MedicalClinicProfileWorkspaceResponseDto> {
    return toMedicalClinicProfileWorkspaceResponseDto(
      await this.upsertTenantMedicalClinicProfileWorkspaceUseCase.execute({
        tenantSlug,
        snapshot: body.snapshot,
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

  @Post(':slug/patient-intake')
  @RequireTenantPermission(MEDICAL_CLINICS_PERMISSIONS.MANAGE)
  async registerPatientIntake(
    @Param('slug') tenantSlug: string,
    @Body() body: RegisterMedicalClinicPatientIntakeRequestDto,
  ): Promise<MedicalClinicPatientRecordResponseDto> {
    return toMedicalClinicPatientRecordResponseDto(
      await this.registerTenantMedicalClinicPatientIntakeUseCase.execute({
        tenantSlug,
        ...body,
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

  @Post(':slug/appointments')
  @RequireTenantPermission(MEDICAL_CLINICS_PERMISSIONS.MANAGE)
  async createAppointment(
    @Param('slug') tenantSlug: string,
    @Body() body: CreateMedicalClinicAppointmentRequestDto,
  ): Promise<MedicalClinicAppointmentRecordResponseDto> {
    return toMedicalClinicAppointmentRecordResponseDto(
      await this.createTenantMedicalClinicAppointmentUseCase.execute({
        tenantSlug,
        patientId: body.patientId,
        serviceName: body.serviceName,
        professionalId: body.professionalId,
        professionalName: body.professionalName,
        startsAt: new Date(body.startsAt),
        amountInCents: body.amountInCents,
        currency: body.currency,
        blockers: body.blockers,
      }),
    );
  }

  @Post(':slug/appointments/:appointmentId/transitions')
  @RequireTenantPermission(MEDICAL_CLINICS_PERMISSIONS.MANAGE)
  async transitionAppointment(
    @Param('slug') tenantSlug: string,
    @Param('appointmentId') appointmentId: string,
    @Body() body: TransitionMedicalClinicAppointmentRequestDto,
  ): Promise<MedicalClinicAppointmentRecordResponseDto> {
    const appointment =
      await this.transitionTenantMedicalClinicAppointmentUseCase.execute({
        tenantSlug,
        appointmentId,
        status: body.status,
        blockers: body.blockers,
      });

    if (!appointment) {
      throw new NotFoundException('Medical clinic appointment was not found.');
    }

    return toMedicalClinicAppointmentRecordResponseDto(appointment);
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

  @Get(':slug/appointments/:appointmentId/encounter-workspace')
  async getEncounterWorkspace(
    @Param('slug') tenantSlug: string,
    @Param('appointmentId') appointmentId: string,
  ): Promise<MedicalClinicEncounterWorkspaceResponseDto> {
    return toMedicalClinicEncounterWorkspaceResponseDto(
      await this.getTenantMedicalClinicEncounterWorkspaceUseCase.execute({
        tenantSlug,
        appointmentId,
      }),
    );
  }

  @Get(':slug/appointments/:appointmentId/clinical-note-draft-packet')
  async requestClinicalNoteDraftPacket(
    @Param('slug') tenantSlug: string,
    @Param('appointmentId') appointmentId: string,
  ): Promise<MedicalClinicClinicalNoteDraftPacketResponseDto> {
    return toMedicalClinicClinicalNoteDraftPacketResponseDto(
      await this.requestTenantMedicalClinicClinicalNoteDraftPacketUseCase.execute(
        {
          tenantSlug,
          appointmentId,
        },
      ),
    );
  }

  @Get(':slug/appointments/:appointmentId/treatment-follow-up-readiness')
  async getTreatmentFollowUpReadiness(
    @Param('slug') tenantSlug: string,
    @Param('appointmentId') appointmentId: string,
  ): Promise<MedicalClinicTreatmentFollowUpReadinessResponseDto> {
    return toMedicalClinicTreatmentFollowUpReadinessResponseDto(
      await this.getTenantMedicalClinicTreatmentFollowUpReadinessUseCase.execute(
        {
          tenantSlug,
          appointmentId,
        },
      ),
    );
  }

  @Get(':slug/appointments/:appointmentId/prescription-readiness-packet')
  async requestPrescriptionReadinessPacket(
    @Param('slug') tenantSlug: string,
    @Param('appointmentId') appointmentId: string,
  ): Promise<MedicalClinicPrescriptionReadinessPacketResponseDto> {
    return toMedicalClinicPrescriptionReadinessPacketResponseDto(
      await this.requestTenantMedicalClinicPrescriptionReadinessPacketUseCase.execute(
        {
          tenantSlug,
          appointmentId,
        },
      ),
    );
  }

  @Get(':slug/appointments/:appointmentId/encounter-closeout')
  async requestEncounterCloseout(
    @Param('slug') tenantSlug: string,
    @Param('appointmentId') appointmentId: string,
  ): Promise<MedicalClinicEncounterCloseoutResponseDto> {
    return toMedicalClinicEncounterCloseoutResponseDto(
      await this.requestTenantMedicalClinicEncounterCloseoutUseCase.execute({
        tenantSlug,
        appointmentId,
      }),
    );
  }

  @Get(':slug/clinical-boundary-closeout')
  async requestClinicalBoundaryCloseout(
    @Param('slug') tenantSlug: string,
  ): Promise<MedicalClinicClinicalBoundaryCloseoutResponseDto> {
    return toMedicalClinicClinicalBoundaryCloseoutResponseDto(
      await this.requestTenantMedicalClinicClinicalBoundaryCloseoutUseCase.execute(
        {
          tenantSlug,
        },
      ),
    );
  }
}
