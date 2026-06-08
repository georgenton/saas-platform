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
  GetTenantPsychologyClinicClinicalEvidenceRegistryUseCase,
  GetTenantPsychologyClinicCloseoutV4UseCase,
  GetTenantPsychologyClinicEhrDiscoveryWorkspaceUseCase,
  GetTenantPsychologyClinicExternalDocumentHandoffContractsUseCase,
  GetTenantPsychologyClinicOperationsCloseoutUseCase,
  GetTenantPsychologyClinicFoundationCloseoutUseCase,
  GetTenantPsychologyClinicFormalRecordSignatureReadinessUseCase,
  GetTenantPsychologyClinicOutcomesReviewWorkspaceUseCase,
  GetTenantPsychologyClinicPatientIntakeWorkspaceUseCase,
  GetTenantPsychologyClinicPatientTimelineWorkspaceUseCase,
  GetTenantPsychologyClinicPrivacyConsentControlCenterUseCase,
  GetTenantPsychologyClinicProductAnchorUseCase,
  GetTenantPsychologyClinicProfileWorkspaceUseCase,
  GetTenantPsychologyClinicRecordsCloseoutV3UseCase,
  GetTenantPsychologyClinicRecordsHardeningWorkspaceUseCase,
  GetTenantPsychologyClinicRiskSafetyReviewWorkspaceUseCase,
  GetTenantPsychologyClinicSessionSchedulingWorkspaceUseCase,
  GetTenantPsychologyClinicTreatmentFollowUpReadinessUseCase,
  GetTenantPsychologyClinicTreatmentPlanWorkspaceUseCase,
  PSYCHOLOGY_CLINICS_PERMISSIONS,
  RegisterTenantPsychologyClinicPatientIntakeUseCase,
  RequestTenantPsychologyClinicBillingTaxBridgeUseCase,
  RequestTenantPsychologyClinicGrowthReminderBridgeUseCase,
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
  PsychologyClinicBillingTaxBridgeResponseDto,
  PsychologyClinicClinicalEvidenceRegistryResponseDto,
  PsychologyClinicCloseoutV4ResponseDto,
  PsychologyClinicEhrDiscoveryWorkspaceResponseDto,
  PsychologyClinicExternalDocumentHandoffContractsResponseDto,
  PsychologyClinicFoundationCloseoutResponseDto,
  PsychologyClinicFormalRecordSignatureReadinessResponseDto,
  PsychologyClinicGrowthReminderBridgeResponseDto,
  PsychologyClinicOperationsCloseoutResponseDto,
  PsychologyClinicOutcomesReviewWorkspaceResponseDto,
  PsychologyClinicPatientIntakeWorkspaceResponseDto,
  PsychologyClinicPatientRecordResponseDto,
  PsychologyClinicPatientTimelineWorkspaceResponseDto,
  PsychologyClinicPrivacyConsentControlCenterResponseDto,
  PsychologyClinicProductAnchorResponseDto,
  PsychologyClinicProfileWorkspaceResponseDto,
  PsychologyClinicRecordsCloseoutV3ResponseDto,
  PsychologyClinicRecordsHardeningWorkspaceResponseDto,
  PsychologyClinicRiskSafetyReviewWorkspaceResponseDto,
  PsychologyClinicSessionNoteDraftPacketResponseDto,
  PsychologyClinicSessionNoteReviewLoopResponseDto,
  PsychologyClinicSessionRecordResponseDto,
  PsychologyClinicSessionSchedulingWorkspaceResponseDto,
  PsychologyClinicTreatmentFollowUpReadinessResponseDto,
  PsychologyClinicTreatmentPlanWorkspaceResponseDto,
  RegisterPsychologyClinicPatientIntakeRequestDto,
  TransitionPsychologyClinicSessionRequestDto,
  UpsertPsychologyClinicProfileWorkspaceRequestDto,
  toPsychologyClinicBillingTaxBridgeResponseDto,
  toPsychologyClinicAssessmentScaleRegistryResponseDto,
  toPsychologyClinicClinicalEvidenceRegistryResponseDto,
  toPsychologyClinicCloseoutV4ResponseDto,
  toPsychologyClinicEhrDiscoveryWorkspaceResponseDto,
  toPsychologyClinicExternalDocumentHandoffContractsResponseDto,
  toPsychologyClinicFoundationCloseoutResponseDto,
  toPsychologyClinicFormalRecordSignatureReadinessResponseDto,
  toPsychologyClinicGrowthReminderBridgeResponseDto,
  toPsychologyClinicOperationsCloseoutResponseDto,
  toPsychologyClinicOutcomesReviewWorkspaceResponseDto,
  toPsychologyClinicPatientIntakeWorkspaceResponseDto,
  toPsychologyClinicPatientRecordResponseDto,
  toPsychologyClinicPatientTimelineWorkspaceResponseDto,
  toPsychologyClinicPrivacyConsentControlCenterResponseDto,
  toPsychologyClinicProductAnchorResponseDto,
  toPsychologyClinicProfileWorkspaceResponseDto,
  toPsychologyClinicRecordsCloseoutV3ResponseDto,
  toPsychologyClinicRecordsHardeningWorkspaceResponseDto,
  toPsychologyClinicRiskSafetyReviewWorkspaceResponseDto,
  toPsychologyClinicSessionNoteDraftPacketResponseDto,
  toPsychologyClinicSessionNoteReviewLoopResponseDto,
  toPsychologyClinicSessionRecordResponseDto,
  toPsychologyClinicSessionSchedulingWorkspaceResponseDto,
  toPsychologyClinicTreatmentFollowUpReadinessResponseDto,
  toPsychologyClinicTreatmentPlanWorkspaceResponseDto,
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
}
