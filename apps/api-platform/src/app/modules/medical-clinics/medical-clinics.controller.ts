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
  GetTenantMedicalClinicAppointmentEncounterQueueV60UseCase,
  GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase,
  GetTenantMedicalClinicCarePlanTaskWorkspaceUseCase,
  GetTenantMedicalClinicClinicalEvidenceRegistryUseCase,
  GetTenantMedicalClinicCommandCenterV60UseCase,
  GetTenantMedicalClinicCrossProductHandoffCenterV60UseCase,
  GetTenantMedicalClinicEncounterWorkspaceUseCase,
  GetTenantMedicalClinicPatientIntakeWorkspaceUseCase,
  GetTenantMedicalClinicPatientClinicalTimelineWorkspaceUseCase,
  GetTenantMedicalClinicPatientIdentityConsentQueueV60UseCase,
  GetTenantMedicalClinicProductAnchorUseCase,
  GetTenantMedicalClinicProductCloseoutUseCase,
  GetTenantMedicalClinicProfileWorkspaceUseCase,
  GetTenantMedicalClinicTreatmentFollowUpReadinessUseCase,
  MEDICAL_CLINICS_PERMISSIONS,
  RegisterTenantMedicalClinicPatientIntakeUseCase,
  RequestTenantMedicalClinicBillingTaxBridgeUseCase,
  RequestTenantMedicalClinicClinicalBoundaryCloseoutUseCase,
  RequestTenantMedicalClinicClinicalNoteDraftPacketUseCase,
  RequestTenantMedicalClinicEncounterCloseoutUseCase,
  RequestTenantMedicalClinicGrowthReminderBridgeUseCase,
  RequestTenantMedicalClinicMedicalHistoryDraftRecordUseCase,
  RequestTenantMedicalClinicOrdersReferralReadinessPacketUseCase,
  RequestTenantMedicalClinicOperatingCloseoutV60UseCase,
  RequestTenantMedicalClinicPrescriptionReadinessPacketUseCase,
  RequestTenantMedicalClinicRecordsCloseoutUseCase,
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
  MedicalClinicAppointmentEncounterQueueV60ResponseDto,
  MedicalClinicAppointmentSchedulingWorkspaceResponseDto,
  MedicalClinicBillingTaxBridgeResponseDto,
  MedicalClinicCarePlanTaskWorkspaceResponseDto,
  MedicalClinicClinicalBoundaryCloseoutResponseDto,
  MedicalClinicClinicalEvidenceRegistryResponseDto,
  MedicalClinicClinicalNoteDraftPacketResponseDto,
  MedicalClinicCommandCenterV60ResponseDto,
  MedicalClinicCrossProductHandoffCenterV60ResponseDto,
  MedicalClinicEncounterCloseoutResponseDto,
  MedicalClinicEncounterWorkspaceResponseDto,
  MedicalClinicGrowthReminderBridgeResponseDto,
  MedicalClinicMedicalHistoryDraftRecordResponseDto,
  MedicalClinicOrdersReferralReadinessPacketResponseDto,
  MedicalClinicPatientClinicalTimelineWorkspaceResponseDto,
  MedicalClinicPatientIdentityConsentQueueV60ResponseDto,
  MedicalClinicPatientRecordResponseDto,
  MedicalClinicPatientIntakeWorkspaceResponseDto,
  MedicalClinicPrescriptionReadinessPacketResponseDto,
  MedicalClinicOperatingCloseoutV60ResponseDto,
  MedicalClinicProductAnchorResponseDto,
  MedicalClinicProductCloseoutResponseDto,
  MedicalClinicProfileWorkspaceResponseDto,
  MedicalClinicRecordsCloseoutResponseDto,
  MedicalClinicTreatmentFollowUpReadinessResponseDto,
  RegisterMedicalClinicPatientIntakeRequestDto,
  TransitionMedicalClinicAppointmentRequestDto,
  UpsertMedicalClinicProfileWorkspaceRequestDto,
  toMedicalClinicAppointmentRecordResponseDto,
  toMedicalClinicAppointmentEncounterQueueV60ResponseDto,
  toMedicalClinicAppointmentSchedulingWorkspaceResponseDto,
  toMedicalClinicBillingTaxBridgeResponseDto,
  toMedicalClinicCarePlanTaskWorkspaceResponseDto,
  toMedicalClinicClinicalBoundaryCloseoutResponseDto,
  toMedicalClinicClinicalEvidenceRegistryResponseDto,
  toMedicalClinicClinicalNoteDraftPacketResponseDto,
  toMedicalClinicCommandCenterV60ResponseDto,
  toMedicalClinicCrossProductHandoffCenterV60ResponseDto,
  toMedicalClinicEncounterCloseoutResponseDto,
  toMedicalClinicEncounterWorkspaceResponseDto,
  toMedicalClinicGrowthReminderBridgeResponseDto,
  toMedicalClinicMedicalHistoryDraftRecordResponseDto,
  toMedicalClinicOrdersReferralReadinessPacketResponseDto,
  toMedicalClinicPatientClinicalTimelineWorkspaceResponseDto,
  toMedicalClinicPatientIdentityConsentQueueV60ResponseDto,
  toMedicalClinicPatientRecordResponseDto,
  toMedicalClinicPatientIntakeWorkspaceResponseDto,
  toMedicalClinicPrescriptionReadinessPacketResponseDto,
  toMedicalClinicOperatingCloseoutV60ResponseDto,
  toMedicalClinicProductAnchorResponseDto,
  toMedicalClinicProductCloseoutResponseDto,
  toMedicalClinicProfileWorkspaceResponseDto,
  toMedicalClinicRecordsCloseoutResponseDto,
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
    private readonly getTenantMedicalClinicPatientClinicalTimelineWorkspaceUseCase: GetTenantMedicalClinicPatientClinicalTimelineWorkspaceUseCase,
    private readonly requestTenantMedicalClinicMedicalHistoryDraftRecordUseCase: RequestTenantMedicalClinicMedicalHistoryDraftRecordUseCase,
    private readonly getTenantMedicalClinicClinicalEvidenceRegistryUseCase: GetTenantMedicalClinicClinicalEvidenceRegistryUseCase,
    private readonly requestTenantMedicalClinicOrdersReferralReadinessPacketUseCase: RequestTenantMedicalClinicOrdersReferralReadinessPacketUseCase,
    private readonly getTenantMedicalClinicCarePlanTaskWorkspaceUseCase: GetTenantMedicalClinicCarePlanTaskWorkspaceUseCase,
    private readonly requestTenantMedicalClinicRecordsCloseoutUseCase: RequestTenantMedicalClinicRecordsCloseoutUseCase,
    private readonly getTenantMedicalClinicProductCloseoutUseCase: GetTenantMedicalClinicProductCloseoutUseCase,
    private readonly getTenantMedicalClinicCommandCenterV60UseCase: GetTenantMedicalClinicCommandCenterV60UseCase,
    private readonly getTenantMedicalClinicPatientIdentityConsentQueueV60UseCase: GetTenantMedicalClinicPatientIdentityConsentQueueV60UseCase,
    private readonly getTenantMedicalClinicAppointmentEncounterQueueV60UseCase: GetTenantMedicalClinicAppointmentEncounterQueueV60UseCase,
    private readonly getTenantMedicalClinicCrossProductHandoffCenterV60UseCase: GetTenantMedicalClinicCrossProductHandoffCenterV60UseCase,
    private readonly requestTenantMedicalClinicOperatingCloseoutV60UseCase: RequestTenantMedicalClinicOperatingCloseoutV60UseCase,
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

  @Get(':slug/product-closeout')
  async getProductCloseout(
    @Param('slug') tenantSlug: string,
  ): Promise<MedicalClinicProductCloseoutResponseDto> {
    return toMedicalClinicProductCloseoutResponseDto(
      await this.getTenantMedicalClinicProductCloseoutUseCase.execute({
        tenantSlug,
      }),
    );
  }

  @Get(':slug/command-center-v60')
  async getCommandCenterV60(
    @Param('slug') tenantSlug: string,
  ): Promise<MedicalClinicCommandCenterV60ResponseDto> {
    return toMedicalClinicCommandCenterV60ResponseDto(
      await this.getTenantMedicalClinicCommandCenterV60UseCase.execute({
        tenantSlug,
      }),
    );
  }

  @Get(':slug/patient-identity-consent-queue-v60')
  async getPatientIdentityConsentQueueV60(
    @Param('slug') tenantSlug: string,
  ): Promise<MedicalClinicPatientIdentityConsentQueueV60ResponseDto> {
    return toMedicalClinicPatientIdentityConsentQueueV60ResponseDto(
      await this.getTenantMedicalClinicPatientIdentityConsentQueueV60UseCase.execute(
        {
          tenantSlug,
        },
      ),
    );
  }

  @Get(':slug/appointment-encounter-queue-v60')
  async getAppointmentEncounterQueueV60(
    @Param('slug') tenantSlug: string,
  ): Promise<MedicalClinicAppointmentEncounterQueueV60ResponseDto> {
    return toMedicalClinicAppointmentEncounterQueueV60ResponseDto(
      await this.getTenantMedicalClinicAppointmentEncounterQueueV60UseCase.execute(
        {
          tenantSlug,
        },
      ),
    );
  }

  @Get(':slug/cross-product-handoff-center-v60')
  async getCrossProductHandoffCenterV60(
    @Param('slug') tenantSlug: string,
  ): Promise<MedicalClinicCrossProductHandoffCenterV60ResponseDto> {
    return toMedicalClinicCrossProductHandoffCenterV60ResponseDto(
      await this.getTenantMedicalClinicCrossProductHandoffCenterV60UseCase.execute(
        {
          tenantSlug,
        },
      ),
    );
  }

  @Get(':slug/operating-closeout-v60')
  async getOperatingCloseoutV60(
    @Param('slug') tenantSlug: string,
  ): Promise<MedicalClinicOperatingCloseoutV60ResponseDto> {
    return toMedicalClinicOperatingCloseoutV60ResponseDto(
      await this.requestTenantMedicalClinicOperatingCloseoutV60UseCase.execute({
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

  @Get(':slug/patients/:patientId/clinical-timeline-workspace')
  async getPatientClinicalTimelineWorkspace(
    @Param('slug') tenantSlug: string,
    @Param('patientId') patientId: string,
  ): Promise<MedicalClinicPatientClinicalTimelineWorkspaceResponseDto> {
    return toMedicalClinicPatientClinicalTimelineWorkspaceResponseDto(
      await this.getTenantMedicalClinicPatientClinicalTimelineWorkspaceUseCase.execute(
        {
          tenantSlug,
          patientId,
        },
      ),
    );
  }

  @Get(':slug/patients/:patientId/medical-history-draft-record')
  async requestMedicalHistoryDraftRecord(
    @Param('slug') tenantSlug: string,
    @Param('patientId') patientId: string,
  ): Promise<MedicalClinicMedicalHistoryDraftRecordResponseDto> {
    return toMedicalClinicMedicalHistoryDraftRecordResponseDto(
      await this.requestTenantMedicalClinicMedicalHistoryDraftRecordUseCase.execute(
        {
          tenantSlug,
          patientId,
        },
      ),
    );
  }

  @Get(':slug/patients/:patientId/clinical-evidence-registry')
  async getClinicalEvidenceRegistry(
    @Param('slug') tenantSlug: string,
    @Param('patientId') patientId: string,
  ): Promise<MedicalClinicClinicalEvidenceRegistryResponseDto> {
    return toMedicalClinicClinicalEvidenceRegistryResponseDto(
      await this.getTenantMedicalClinicClinicalEvidenceRegistryUseCase.execute({
        tenantSlug,
        patientId,
      }),
    );
  }

  @Get(':slug/appointments/:appointmentId/orders-referral-readiness-packet')
  async requestOrdersReferralReadinessPacket(
    @Param('slug') tenantSlug: string,
    @Param('appointmentId') appointmentId: string,
  ): Promise<MedicalClinicOrdersReferralReadinessPacketResponseDto> {
    return toMedicalClinicOrdersReferralReadinessPacketResponseDto(
      await this.requestTenantMedicalClinicOrdersReferralReadinessPacketUseCase.execute(
        {
          tenantSlug,
          appointmentId,
        },
      ),
    );
  }

  @Get(':slug/patients/:patientId/care-plan-task-workspace')
  async getCarePlanTaskWorkspace(
    @Param('slug') tenantSlug: string,
    @Param('patientId') patientId: string,
  ): Promise<MedicalClinicCarePlanTaskWorkspaceResponseDto> {
    return toMedicalClinicCarePlanTaskWorkspaceResponseDto(
      await this.getTenantMedicalClinicCarePlanTaskWorkspaceUseCase.execute({
        tenantSlug,
        patientId,
      }),
    );
  }

  @Get(':slug/patients/:patientId/records-closeout')
  async requestRecordsCloseout(
    @Param('slug') tenantSlug: string,
    @Param('patientId') patientId: string,
  ): Promise<MedicalClinicRecordsCloseoutResponseDto> {
    return toMedicalClinicRecordsCloseoutResponseDto(
      await this.requestTenantMedicalClinicRecordsCloseoutUseCase.execute({
        tenantSlug,
        patientId,
      }),
    );
  }
}
