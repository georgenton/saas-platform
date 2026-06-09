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
  CreateTenantPsychologyClinicSessionUseCase,
  GetTenantPsychologyClinicAssessmentScaleRegistryUseCase,
  GetTenantPsychologyClinicBoundaryComplianceCloseoutUseCase,
  GetTenantPsychologyClinicClinicalAdminHardeningWorkspaceUseCase,
  GetTenantPsychologyClinicClinicalEvidenceRegistryUseCase,
  GetTenantPsychologyClinicCloseoutV4UseCase,
  GetTenantPsychologyClinicCloseoutV5UseCase,
  GetTenantPsychologyClinicCommandCenterV60UseCase,
  GetTenantPsychologyClinicCrossProductHandoffCenterV60UseCase,
  GetTenantPsychologyClinicEhrDiscoveryWorkspaceUseCase,
  GetTenantPsychologyClinicEhrIntegrationEvaluationUseCase,
  GetTenantPsychologyClinicExternalDocumentHandoffContractsUseCase,
  GetTenantPsychologyClinicOperationsCloseoutUseCase,
  GetTenantPsychologyClinicFoundationCloseoutUseCase,
  GetTenantPsychologyClinicFormalRecordSignatureReadinessUseCase,
  GetTenantPsychologyClinicOutcomesReviewWorkspaceUseCase,
  GetTenantPsychologyClinicPatientIntakeWorkspaceUseCase,
  GetTenantPsychologyClinicPatientPrivacyRiskQueueV60UseCase,
  GetTenantPsychologyClinicPatientTimelineWorkspaceUseCase,
  GetTenantPsychologyClinicPrivacyConsentControlCenterUseCase,
  GetTenantPsychologyClinicProductAnchorUseCase,
  GetTenantPsychologyClinicProfileWorkspaceUseCase,
  GetTenantPsychologyClinicRecordsCloseoutV3UseCase,
  GetTenantPsychologyClinicRecordsHardeningWorkspaceUseCase,
  GetTenantPsychologyClinicRiskSafetyReviewWorkspaceUseCase,
  GetTenantPsychologyClinicSessionSchedulingWorkspaceUseCase,
  GetTenantPsychologyClinicSessionTreatmentQueueV60UseCase,
  GetTenantPsychologyClinicTreatmentFollowUpReadinessUseCase,
  GetTenantPsychologyClinicTreatmentPlanWorkspaceUseCase,
  GetTenantPsychologyClinicProductReadinessReportUseCase,
  GetTenantPsychologyClinicTherapistReviewWorkQueueUseCase,
  PSYCHOLOGY_CLINICS_PERMISSIONS,
  RegisterTenantPsychologyClinicPatientIntakeUseCase,
  RequestTenantPsychologyClinicBillingTaxBridgeUseCase,
  RequestTenantPsychologyClinicGrowthReminderBridgeUseCase,
  RequestTenantPsychologyClinicOperatingCloseoutV60UseCase,
  RequestTenantPsychologyClinicSessionNoteDraftPacketUseCase,
  RequestTenantPsychologyClinicSessionNoteReviewLoopUseCase,
  TransitionTenantPsychologyClinicSessionUseCase,
  UpsertTenantPsychologyClinicProfileWorkspaceUseCase,
} from '@saas-platform/psychology-clinics-application';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
import { RequireTenantProductAccess } from '../tenancy/require-tenant-product-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { TenantProductAccessGuard } from '../tenancy/tenant-product-access.guard';
import {
  CreatePsychologyClinicSessionRequestDto,
  PsychologyClinicAssessmentScaleRegistryResponseDto,
  PsychologyClinicBoundaryComplianceCloseoutResponseDto,
  PsychologyClinicBillingTaxBridgeResponseDto,
  PsychologyClinicClinicalAdminHardeningWorkspaceResponseDto,
  PsychologyClinicClinicalEvidenceRegistryResponseDto,
  PsychologyClinicCloseoutV4ResponseDto,
  PsychologyClinicCloseoutV5ResponseDto,
  PsychologyClinicCommandCenterV60ResponseDto,
  PsychologyClinicCrossProductHandoffCenterV60ResponseDto,
  PsychologyClinicEhrDiscoveryWorkspaceResponseDto,
  PsychologyClinicEhrIntegrationEvaluationResponseDto,
  PsychologyClinicExternalDocumentHandoffContractsResponseDto,
  PsychologyClinicFoundationCloseoutResponseDto,
  PsychologyClinicFormalRecordSignatureReadinessResponseDto,
  PsychologyClinicGrowthReminderBridgeResponseDto,
  PsychologyClinicOperationsCloseoutResponseDto,
  PsychologyClinicOutcomesReviewWorkspaceResponseDto,
  PsychologyClinicPatientIntakeWorkspaceResponseDto,
  PsychologyClinicPatientPrivacyRiskQueueV60ResponseDto,
  PsychologyClinicPatientRecordResponseDto,
  PsychologyClinicPatientTimelineWorkspaceResponseDto,
  PsychologyClinicPrivacyConsentControlCenterResponseDto,
  PsychologyClinicProductAnchorResponseDto,
  PsychologyClinicProductReadinessReportResponseDto,
  PsychologyClinicProfileWorkspaceResponseDto,
  PsychologyClinicRecordsCloseoutV3ResponseDto,
  PsychologyClinicRecordsHardeningWorkspaceResponseDto,
  PsychologyClinicRiskSafetyReviewWorkspaceResponseDto,
  PsychologyClinicSessionNoteDraftPacketResponseDto,
  PsychologyClinicSessionNoteReviewLoopResponseDto,
  PsychologyClinicSessionRecordResponseDto,
  PsychologyClinicSessionSchedulingWorkspaceResponseDto,
  PsychologyClinicSessionTreatmentQueueV60ResponseDto,
  PsychologyClinicTreatmentFollowUpReadinessResponseDto,
  PsychologyClinicTreatmentPlanWorkspaceResponseDto,
  PsychologyClinicTherapistReviewWorkQueueResponseDto,
  PsychologyClinicOperatingCloseoutV60ResponseDto,
  RegisterPsychologyClinicPatientIntakeRequestDto,
  TransitionPsychologyClinicSessionRequestDto,
  UpsertPsychologyClinicProfileWorkspaceRequestDto,
  toPsychologyClinicBillingTaxBridgeResponseDto,
  toPsychologyClinicAssessmentScaleRegistryResponseDto,
  toPsychologyClinicBoundaryComplianceCloseoutResponseDto,
  toPsychologyClinicClinicalAdminHardeningWorkspaceResponseDto,
  toPsychologyClinicClinicalEvidenceRegistryResponseDto,
  toPsychologyClinicCloseoutV4ResponseDto,
  toPsychologyClinicCloseoutV5ResponseDto,
  toPsychologyClinicCommandCenterV60ResponseDto,
  toPsychologyClinicCrossProductHandoffCenterV60ResponseDto,
  toPsychologyClinicEhrDiscoveryWorkspaceResponseDto,
  toPsychologyClinicEhrIntegrationEvaluationResponseDto,
  toPsychologyClinicExternalDocumentHandoffContractsResponseDto,
  toPsychologyClinicFoundationCloseoutResponseDto,
  toPsychologyClinicFormalRecordSignatureReadinessResponseDto,
  toPsychologyClinicGrowthReminderBridgeResponseDto,
  toPsychologyClinicOperationsCloseoutResponseDto,
  toPsychologyClinicOutcomesReviewWorkspaceResponseDto,
  toPsychologyClinicPatientIntakeWorkspaceResponseDto,
  toPsychologyClinicPatientPrivacyRiskQueueV60ResponseDto,
  toPsychologyClinicPatientRecordResponseDto,
  toPsychologyClinicPatientTimelineWorkspaceResponseDto,
  toPsychologyClinicPrivacyConsentControlCenterResponseDto,
  toPsychologyClinicProductAnchorResponseDto,
  toPsychologyClinicProductReadinessReportResponseDto,
  toPsychologyClinicProfileWorkspaceResponseDto,
  toPsychologyClinicRecordsCloseoutV3ResponseDto,
  toPsychologyClinicRecordsHardeningWorkspaceResponseDto,
  toPsychologyClinicRiskSafetyReviewWorkspaceResponseDto,
  toPsychologyClinicSessionNoteDraftPacketResponseDto,
  toPsychologyClinicSessionNoteReviewLoopResponseDto,
  toPsychologyClinicSessionRecordResponseDto,
  toPsychologyClinicSessionSchedulingWorkspaceResponseDto,
  toPsychologyClinicSessionTreatmentQueueV60ResponseDto,
  toPsychologyClinicTreatmentFollowUpReadinessResponseDto,
  toPsychologyClinicTreatmentPlanWorkspaceResponseDto,
  toPsychologyClinicTherapistReviewWorkQueueResponseDto,
  toPsychologyClinicOperatingCloseoutV60ResponseDto,
} from './dto/psychology-clinics.response';

@Controller('psychology-clinics/tenants')
@UseGuards(
  JwtAuthenticationGuard,
  TenantMembershipGuard,
  TenantProductAccessGuard,
  TenantPermissionGuard,
)
@RequireTenantProductAccess({ productKey: 'psychology-clinics' })
@RequireTenantPermission(PSYCHOLOGY_CLINICS_PERMISSIONS.read)
export class PsychologyClinicsController {
  constructor(
    private readonly getTenantPsychologyClinicProductAnchorUseCase: GetTenantPsychologyClinicProductAnchorUseCase,
    private readonly getTenantPsychologyClinicProfileWorkspaceUseCase: GetTenantPsychologyClinicProfileWorkspaceUseCase,
    private readonly upsertTenantPsychologyClinicProfileWorkspaceUseCase: UpsertTenantPsychologyClinicProfileWorkspaceUseCase,
    private readonly getTenantPsychologyClinicPatientIntakeWorkspaceUseCase: GetTenantPsychologyClinicPatientIntakeWorkspaceUseCase,
    private readonly registerTenantPsychologyClinicPatientIntakeUseCase: RegisterTenantPsychologyClinicPatientIntakeUseCase,
    private readonly getTenantPsychologyClinicSessionSchedulingWorkspaceUseCase: GetTenantPsychologyClinicSessionSchedulingWorkspaceUseCase,
    private readonly createTenantPsychologyClinicSessionUseCase: CreateTenantPsychologyClinicSessionUseCase,
    private readonly transitionTenantPsychologyClinicSessionUseCase: TransitionTenantPsychologyClinicSessionUseCase,
    private readonly requestTenantPsychologyClinicSessionNoteDraftPacketUseCase: RequestTenantPsychologyClinicSessionNoteDraftPacketUseCase,
    private readonly getTenantPsychologyClinicFoundationCloseoutUseCase: GetTenantPsychologyClinicFoundationCloseoutUseCase,
    private readonly getTenantPsychologyClinicTreatmentPlanWorkspaceUseCase: GetTenantPsychologyClinicTreatmentPlanWorkspaceUseCase,
    private readonly getTenantPsychologyClinicTreatmentFollowUpReadinessUseCase: GetTenantPsychologyClinicTreatmentFollowUpReadinessUseCase,
    private readonly requestTenantPsychologyClinicGrowthReminderBridgeUseCase: RequestTenantPsychologyClinicGrowthReminderBridgeUseCase,
    private readonly requestTenantPsychologyClinicBillingTaxBridgeUseCase: RequestTenantPsychologyClinicBillingTaxBridgeUseCase,
    private readonly getTenantPsychologyClinicPatientTimelineWorkspaceUseCase: GetTenantPsychologyClinicPatientTimelineWorkspaceUseCase,
    private readonly getTenantPsychologyClinicOperationsCloseoutUseCase: GetTenantPsychologyClinicOperationsCloseoutUseCase,
    private readonly getTenantPsychologyClinicRecordsHardeningWorkspaceUseCase: GetTenantPsychologyClinicRecordsHardeningWorkspaceUseCase,
    private readonly getTenantPsychologyClinicClinicalEvidenceRegistryUseCase: GetTenantPsychologyClinicClinicalEvidenceRegistryUseCase,
    private readonly requestTenantPsychologyClinicSessionNoteReviewLoopUseCase: RequestTenantPsychologyClinicSessionNoteReviewLoopUseCase,
    private readonly getTenantPsychologyClinicRiskSafetyReviewWorkspaceUseCase: GetTenantPsychologyClinicRiskSafetyReviewWorkspaceUseCase,
    private readonly getTenantPsychologyClinicPrivacyConsentControlCenterUseCase: GetTenantPsychologyClinicPrivacyConsentControlCenterUseCase,
    private readonly getTenantPsychologyClinicRecordsCloseoutV3UseCase: GetTenantPsychologyClinicRecordsCloseoutV3UseCase,
    private readonly getTenantPsychologyClinicEhrDiscoveryWorkspaceUseCase: GetTenantPsychologyClinicEhrDiscoveryWorkspaceUseCase,
    private readonly getTenantPsychologyClinicFormalRecordSignatureReadinessUseCase: GetTenantPsychologyClinicFormalRecordSignatureReadinessUseCase,
    private readonly getTenantPsychologyClinicOutcomesReviewWorkspaceUseCase: GetTenantPsychologyClinicOutcomesReviewWorkspaceUseCase,
    private readonly getTenantPsychologyClinicAssessmentScaleRegistryUseCase: GetTenantPsychologyClinicAssessmentScaleRegistryUseCase,
    private readonly getTenantPsychologyClinicExternalDocumentHandoffContractsUseCase: GetTenantPsychologyClinicExternalDocumentHandoffContractsUseCase,
    private readonly getTenantPsychologyClinicCloseoutV4UseCase: GetTenantPsychologyClinicCloseoutV4UseCase,
    private readonly getTenantPsychologyClinicEhrIntegrationEvaluationUseCase: GetTenantPsychologyClinicEhrIntegrationEvaluationUseCase,
    private readonly getTenantPsychologyClinicClinicalAdminHardeningWorkspaceUseCase: GetTenantPsychologyClinicClinicalAdminHardeningWorkspaceUseCase,
    private readonly getTenantPsychologyClinicTherapistReviewWorkQueueUseCase: GetTenantPsychologyClinicTherapistReviewWorkQueueUseCase,
    private readonly getTenantPsychologyClinicProductReadinessReportUseCase: GetTenantPsychologyClinicProductReadinessReportUseCase,
    private readonly getTenantPsychologyClinicBoundaryComplianceCloseoutUseCase: GetTenantPsychologyClinicBoundaryComplianceCloseoutUseCase,
    private readonly getTenantPsychologyClinicCloseoutV5UseCase: GetTenantPsychologyClinicCloseoutV5UseCase,
    private readonly getTenantPsychologyClinicCommandCenterV60UseCase: GetTenantPsychologyClinicCommandCenterV60UseCase,
    private readonly getTenantPsychologyClinicPatientPrivacyRiskQueueV60UseCase: GetTenantPsychologyClinicPatientPrivacyRiskQueueV60UseCase,
    private readonly getTenantPsychologyClinicSessionTreatmentQueueV60UseCase: GetTenantPsychologyClinicSessionTreatmentQueueV60UseCase,
    private readonly getTenantPsychologyClinicCrossProductHandoffCenterV60UseCase: GetTenantPsychologyClinicCrossProductHandoffCenterV60UseCase,
    private readonly requestTenantPsychologyClinicOperatingCloseoutV60UseCase: RequestTenantPsychologyClinicOperatingCloseoutV60UseCase,
  ) {}

  @Get(':slug/product-anchor')
  async getProductAnchor(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicProductAnchorResponseDto> {
    return toPsychologyClinicProductAnchorResponseDto(
      await this.getTenantPsychologyClinicProductAnchorUseCase.execute({
        tenantSlug,
      }),
    );
  }

  @Get(':slug/profile-workspace')
  async getProfileWorkspace(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicProfileWorkspaceResponseDto> {
    return toPsychologyClinicProfileWorkspaceResponseDto(
      await this.getTenantPsychologyClinicProfileWorkspaceUseCase.execute({
        tenantSlug,
      }),
    );
  }

  @Put(':slug/profile-workspace')
  @RequireTenantPermission(PSYCHOLOGY_CLINICS_PERMISSIONS.manage)
  async upsertProfileWorkspace(
    @Param('slug') tenantSlug: string,
    @Body() body: UpsertPsychologyClinicProfileWorkspaceRequestDto,
  ): Promise<PsychologyClinicProfileWorkspaceResponseDto> {
    return toPsychologyClinicProfileWorkspaceResponseDto(
      await this.upsertTenantPsychologyClinicProfileWorkspaceUseCase.execute({
        tenantSlug,
        snapshot: body.snapshot,
      }),
    );
  }

  @Get(':slug/patient-intake-workspace')
  async getPatientIntakeWorkspace(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicPatientIntakeWorkspaceResponseDto> {
    return toPsychologyClinicPatientIntakeWorkspaceResponseDto(
      await this.getTenantPsychologyClinicPatientIntakeWorkspaceUseCase.execute(
        {
          tenantSlug,
        },
      ),
    );
  }

  @Post(':slug/patient-intake')
  @RequireTenantPermission(PSYCHOLOGY_CLINICS_PERMISSIONS.manage)
  async registerPatientIntake(
    @Param('slug') tenantSlug: string,
    @Body() body: RegisterPsychologyClinicPatientIntakeRequestDto,
  ): Promise<PsychologyClinicPatientRecordResponseDto> {
    return toPsychologyClinicPatientRecordResponseDto(
      await this.registerTenantPsychologyClinicPatientIntakeUseCase.execute({
        tenantSlug,
        ...body,
      }),
    );
  }

  @Get(':slug/session-scheduling-workspace')
  async getSessionSchedulingWorkspace(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicSessionSchedulingWorkspaceResponseDto> {
    return toPsychologyClinicSessionSchedulingWorkspaceResponseDto(
      await this.getTenantPsychologyClinicSessionSchedulingWorkspaceUseCase.execute(
        {
          tenantSlug,
        },
      ),
    );
  }

  @Post(':slug/sessions')
  @RequireTenantPermission(PSYCHOLOGY_CLINICS_PERMISSIONS.manage)
  async createSession(
    @Param('slug') tenantSlug: string,
    @Body() body: CreatePsychologyClinicSessionRequestDto,
  ): Promise<PsychologyClinicSessionRecordResponseDto> {
    return toPsychologyClinicSessionRecordResponseDto(
      await this.createTenantPsychologyClinicSessionUseCase.execute({
        tenantSlug,
        patientId: body.patientId,
        serviceName: body.serviceName,
        therapistId: body.therapistId,
        therapistName: body.therapistName,
        modality: body.modality,
        startsAt: new Date(body.startsAt),
        blockers: body.blockers,
      }),
    );
  }

  @Post(':slug/sessions/:sessionId/transitions')
  @RequireTenantPermission(PSYCHOLOGY_CLINICS_PERMISSIONS.manage)
  async transitionSession(
    @Param('slug') tenantSlug: string,
    @Param('sessionId') sessionId: string,
    @Body() body: TransitionPsychologyClinicSessionRequestDto,
  ): Promise<PsychologyClinicSessionRecordResponseDto> {
    const session =
      await this.transitionTenantPsychologyClinicSessionUseCase.execute({
        tenantSlug,
        sessionId,
        status: body.status,
        blockers: body.blockers,
      });

    if (!session) {
      throw new NotFoundException('Psychology clinic session was not found.');
    }

    return toPsychologyClinicSessionRecordResponseDto(session);
  }

  @Get(':slug/sessions/:sessionId/session-note-draft-packet')
  async requestSessionNoteDraftPacket(
    @Param('slug') tenantSlug: string,
    @Param('sessionId') sessionId: string,
  ): Promise<PsychologyClinicSessionNoteDraftPacketResponseDto> {
    return toPsychologyClinicSessionNoteDraftPacketResponseDto(
      await this.requestTenantPsychologyClinicSessionNoteDraftPacketUseCase.execute(
        {
          tenantSlug,
          sessionId,
        },
      ),
    );
  }

  @Get(':slug/foundation-closeout')
  async getFoundationCloseout(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicFoundationCloseoutResponseDto> {
    return toPsychologyClinicFoundationCloseoutResponseDto(
      await this.getTenantPsychologyClinicFoundationCloseoutUseCase.execute({
        tenantSlug,
      }),
    );
  }

  @Get(':slug/operations-closeout')
  async getOperationsCloseout(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicOperationsCloseoutResponseDto> {
    return toPsychologyClinicOperationsCloseoutResponseDto(
      await this.getTenantPsychologyClinicOperationsCloseoutUseCase.execute({
        tenantSlug,
      }),
    );
  }

  @Get(':slug/growth-reminder-bridge')
  async requestGrowthReminderBridge(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicGrowthReminderBridgeResponseDto> {
    return toPsychologyClinicGrowthReminderBridgeResponseDto(
      await this.requestTenantPsychologyClinicGrowthReminderBridgeUseCase.execute(
        {
          tenantSlug,
        },
      ),
    );
  }

  @Get(':slug/billing-tax-bridge')
  async requestBillingTaxBridge(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicBillingTaxBridgeResponseDto> {
    return toPsychologyClinicBillingTaxBridgeResponseDto(
      await this.requestTenantPsychologyClinicBillingTaxBridgeUseCase.execute({
        tenantSlug,
      }),
    );
  }

  @Get(':slug/sessions/:sessionId/treatment-follow-up-readiness')
  async getTreatmentFollowUpReadiness(
    @Param('slug') tenantSlug: string,
    @Param('sessionId') sessionId: string,
  ): Promise<PsychologyClinicTreatmentFollowUpReadinessResponseDto> {
    return toPsychologyClinicTreatmentFollowUpReadinessResponseDto(
      await this.getTenantPsychologyClinicTreatmentFollowUpReadinessUseCase.execute(
        {
          tenantSlug,
          sessionId,
        },
      ),
    );
  }

  @Get(':slug/patients/:patientId/treatment-plan-workspace')
  async getTreatmentPlanWorkspace(
    @Param('slug') tenantSlug: string,
    @Param('patientId') patientId: string,
  ): Promise<PsychologyClinicTreatmentPlanWorkspaceResponseDto> {
    return toPsychologyClinicTreatmentPlanWorkspaceResponseDto(
      await this.getTenantPsychologyClinicTreatmentPlanWorkspaceUseCase.execute(
        {
          tenantSlug,
          patientId,
        },
      ),
    );
  }

  @Get(':slug/patients/:patientId/timeline-workspace')
  async getPatientTimelineWorkspace(
    @Param('slug') tenantSlug: string,
    @Param('patientId') patientId: string,
  ): Promise<PsychologyClinicPatientTimelineWorkspaceResponseDto> {
    return toPsychologyClinicPatientTimelineWorkspaceResponseDto(
      await this.getTenantPsychologyClinicPatientTimelineWorkspaceUseCase.execute(
        {
          tenantSlug,
          patientId,
        },
      ),
    );
  }

  @Get(':slug/patients/:patientId/records-hardening-workspace')
  async getRecordsHardeningWorkspace(
    @Param('slug') tenantSlug: string,
    @Param('patientId') patientId: string,
  ): Promise<PsychologyClinicRecordsHardeningWorkspaceResponseDto> {
    return toPsychologyClinicRecordsHardeningWorkspaceResponseDto(
      await this.getTenantPsychologyClinicRecordsHardeningWorkspaceUseCase.execute(
        { tenantSlug, patientId },
      ),
    );
  }

  @Get(':slug/patients/:patientId/clinical-evidence-registry')
  async getClinicalEvidenceRegistry(
    @Param('slug') tenantSlug: string,
    @Param('patientId') patientId: string,
  ): Promise<PsychologyClinicClinicalEvidenceRegistryResponseDto> {
    return toPsychologyClinicClinicalEvidenceRegistryResponseDto(
      await this.getTenantPsychologyClinicClinicalEvidenceRegistryUseCase.execute(
        { tenantSlug, patientId },
      ),
    );
  }

  @Get(':slug/patients/:patientId/risk-safety-review-workspace')
  async getRiskSafetyReviewWorkspace(
    @Param('slug') tenantSlug: string,
    @Param('patientId') patientId: string,
  ): Promise<PsychologyClinicRiskSafetyReviewWorkspaceResponseDto> {
    return toPsychologyClinicRiskSafetyReviewWorkspaceResponseDto(
      await this.getTenantPsychologyClinicRiskSafetyReviewWorkspaceUseCase.execute(
        { tenantSlug, patientId },
      ),
    );
  }

  @Get(':slug/privacy-consent-control-center')
  async getPrivacyConsentControlCenter(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicPrivacyConsentControlCenterResponseDto> {
    return toPsychologyClinicPrivacyConsentControlCenterResponseDto(
      await this.getTenantPsychologyClinicPrivacyConsentControlCenterUseCase.execute(
        { tenantSlug },
      ),
    );
  }

  @Get(':slug/sessions/:sessionId/session-note-review-loop')
  async requestSessionNoteReviewLoop(
    @Param('slug') tenantSlug: string,
    @Param('sessionId') sessionId: string,
  ): Promise<PsychologyClinicSessionNoteReviewLoopResponseDto> {
    return toPsychologyClinicSessionNoteReviewLoopResponseDto(
      await this.requestTenantPsychologyClinicSessionNoteReviewLoopUseCase.execute(
        { tenantSlug, sessionId },
      ),
    );
  }

  @Get(':slug/records-closeout-v3')
  async getRecordsCloseoutV3(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicRecordsCloseoutV3ResponseDto> {
    return toPsychologyClinicRecordsCloseoutV3ResponseDto(
      await this.getTenantPsychologyClinicRecordsCloseoutV3UseCase.execute({
        tenantSlug,
      }),
    );
  }

  @Get(':slug/ehr-discovery-workspace')
  async getEhrDiscoveryWorkspace(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicEhrDiscoveryWorkspaceResponseDto> {
    return toPsychologyClinicEhrDiscoveryWorkspaceResponseDto(
      await this.getTenantPsychologyClinicEhrDiscoveryWorkspaceUseCase.execute({
        tenantSlug,
      }),
    );
  }

  @Get(':slug/formal-record-signature-readiness')
  async getFormalRecordSignatureReadiness(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicFormalRecordSignatureReadinessResponseDto> {
    return toPsychologyClinicFormalRecordSignatureReadinessResponseDto(
      await this.getTenantPsychologyClinicFormalRecordSignatureReadinessUseCase.execute(
        {
          tenantSlug,
        },
      ),
    );
  }

  @Get(':slug/patients/:patientId/outcomes-review-workspace')
  async getOutcomesReviewWorkspace(
    @Param('slug') tenantSlug: string,
    @Param('patientId') patientId: string,
  ): Promise<PsychologyClinicOutcomesReviewWorkspaceResponseDto> {
    return toPsychologyClinicOutcomesReviewWorkspaceResponseDto(
      await this.getTenantPsychologyClinicOutcomesReviewWorkspaceUseCase.execute(
        {
          tenantSlug,
          patientId,
        },
      ),
    );
  }

  @Get(':slug/patients/:patientId/assessment-scale-registry')
  async getAssessmentScaleRegistry(
    @Param('slug') tenantSlug: string,
    @Param('patientId') patientId: string,
  ): Promise<PsychologyClinicAssessmentScaleRegistryResponseDto> {
    return toPsychologyClinicAssessmentScaleRegistryResponseDto(
      await this.getTenantPsychologyClinicAssessmentScaleRegistryUseCase.execute(
        {
          tenantSlug,
          patientId,
        },
      ),
    );
  }

  @Get(':slug/external-document-handoff-contracts')
  async getExternalDocumentHandoffContracts(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicExternalDocumentHandoffContractsResponseDto> {
    return toPsychologyClinicExternalDocumentHandoffContractsResponseDto(
      await this.getTenantPsychologyClinicExternalDocumentHandoffContractsUseCase.execute(
        {
          tenantSlug,
        },
      ),
    );
  }

  @Get(':slug/closeout-v4')
  async getCloseoutV4(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicCloseoutV4ResponseDto> {
    return toPsychologyClinicCloseoutV4ResponseDto(
      await this.getTenantPsychologyClinicCloseoutV4UseCase.execute({
        tenantSlug,
      }),
    );
  }

  @Get(':slug/ehr-integration-evaluation')
  async getEhrIntegrationEvaluation(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicEhrIntegrationEvaluationResponseDto> {
    return toPsychologyClinicEhrIntegrationEvaluationResponseDto(
      await this.getTenantPsychologyClinicEhrIntegrationEvaluationUseCase.execute(
        { tenantSlug },
      ),
    );
  }

  @Get(':slug/clinical-admin-hardening-workspace')
  async getClinicalAdminHardeningWorkspace(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicClinicalAdminHardeningWorkspaceResponseDto> {
    return toPsychologyClinicClinicalAdminHardeningWorkspaceResponseDto(
      await this.getTenantPsychologyClinicClinicalAdminHardeningWorkspaceUseCase.execute(
        { tenantSlug },
      ),
    );
  }

  @Get(':slug/therapist-review-work-queue')
  async getTherapistReviewWorkQueue(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicTherapistReviewWorkQueueResponseDto> {
    return toPsychologyClinicTherapistReviewWorkQueueResponseDto(
      await this.getTenantPsychologyClinicTherapistReviewWorkQueueUseCase.execute(
        { tenantSlug },
      ),
    );
  }

  @Get(':slug/product-readiness-report')
  async getProductReadinessReport(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicProductReadinessReportResponseDto> {
    return toPsychologyClinicProductReadinessReportResponseDto(
      await this.getTenantPsychologyClinicProductReadinessReportUseCase.execute(
        { tenantSlug },
      ),
    );
  }

  @Get(':slug/boundary-compliance-closeout')
  async getBoundaryComplianceCloseout(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicBoundaryComplianceCloseoutResponseDto> {
    return toPsychologyClinicBoundaryComplianceCloseoutResponseDto(
      await this.getTenantPsychologyClinicBoundaryComplianceCloseoutUseCase.execute(
        { tenantSlug },
      ),
    );
  }

  @Get(':slug/closeout-v5')
  async getCloseoutV5(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicCloseoutV5ResponseDto> {
    return toPsychologyClinicCloseoutV5ResponseDto(
      await this.getTenantPsychologyClinicCloseoutV5UseCase.execute({
        tenantSlug,
      }),
    );
  }

  @Get(':slug/command-center-v60')
  async getCommandCenterV60(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicCommandCenterV60ResponseDto> {
    return toPsychologyClinicCommandCenterV60ResponseDto(
      await this.getTenantPsychologyClinicCommandCenterV60UseCase.execute({
        tenantSlug,
      }),
    );
  }

  @Get(':slug/patient-privacy-risk-queue-v60')
  async getPatientPrivacyRiskQueueV60(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicPatientPrivacyRiskQueueV60ResponseDto> {
    return toPsychologyClinicPatientPrivacyRiskQueueV60ResponseDto(
      await this.getTenantPsychologyClinicPatientPrivacyRiskQueueV60UseCase.execute(
        { tenantSlug },
      ),
    );
  }

  @Get(':slug/session-treatment-queue-v60')
  async getSessionTreatmentQueueV60(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicSessionTreatmentQueueV60ResponseDto> {
    return toPsychologyClinicSessionTreatmentQueueV60ResponseDto(
      await this.getTenantPsychologyClinicSessionTreatmentQueueV60UseCase.execute(
        { tenantSlug },
      ),
    );
  }

  @Get(':slug/cross-product-handoff-center-v60')
  async getCrossProductHandoffCenterV60(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicCrossProductHandoffCenterV60ResponseDto> {
    return toPsychologyClinicCrossProductHandoffCenterV60ResponseDto(
      await this.getTenantPsychologyClinicCrossProductHandoffCenterV60UseCase.execute(
        { tenantSlug },
      ),
    );
  }

  @Get(':slug/operating-closeout-v60')
  async requestOperatingCloseoutV60(
    @Param('slug') tenantSlug: string,
  ): Promise<PsychologyClinicOperatingCloseoutV60ResponseDto> {
    return toPsychologyClinicOperatingCloseoutV60ResponseDto(
      await this.requestTenantPsychologyClinicOperatingCloseoutV60UseCase.execute(
        { tenantSlug },
      ),
    );
  }
}
