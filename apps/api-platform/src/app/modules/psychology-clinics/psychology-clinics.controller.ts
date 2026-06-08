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
  GetTenantPsychologyClinicOperationsCloseoutUseCase,
  GetTenantPsychologyClinicFoundationCloseoutUseCase,
  GetTenantPsychologyClinicPatientIntakeWorkspaceUseCase,
  GetTenantPsychologyClinicPatientTimelineWorkspaceUseCase,
  GetTenantPsychologyClinicProductAnchorUseCase,
  GetTenantPsychologyClinicProfileWorkspaceUseCase,
  GetTenantPsychologyClinicSessionSchedulingWorkspaceUseCase,
  GetTenantPsychologyClinicTreatmentFollowUpReadinessUseCase,
  GetTenantPsychologyClinicTreatmentPlanWorkspaceUseCase,
  PSYCHOLOGY_CLINICS_PERMISSIONS,
  RegisterTenantPsychologyClinicPatientIntakeUseCase,
  RequestTenantPsychologyClinicBillingTaxBridgeUseCase,
  RequestTenantPsychologyClinicGrowthReminderBridgeUseCase,
  RequestTenantPsychologyClinicSessionNoteDraftPacketUseCase,
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
  PsychologyClinicBillingTaxBridgeResponseDto,
  PsychologyClinicFoundationCloseoutResponseDto,
  PsychologyClinicGrowthReminderBridgeResponseDto,
  PsychologyClinicOperationsCloseoutResponseDto,
  PsychologyClinicPatientIntakeWorkspaceResponseDto,
  PsychologyClinicPatientRecordResponseDto,
  PsychologyClinicPatientTimelineWorkspaceResponseDto,
  PsychologyClinicProductAnchorResponseDto,
  PsychologyClinicProfileWorkspaceResponseDto,
  PsychologyClinicSessionNoteDraftPacketResponseDto,
  PsychologyClinicSessionRecordResponseDto,
  PsychologyClinicSessionSchedulingWorkspaceResponseDto,
  PsychologyClinicTreatmentFollowUpReadinessResponseDto,
  PsychologyClinicTreatmentPlanWorkspaceResponseDto,
  RegisterPsychologyClinicPatientIntakeRequestDto,
  TransitionPsychologyClinicSessionRequestDto,
  UpsertPsychologyClinicProfileWorkspaceRequestDto,
  toPsychologyClinicBillingTaxBridgeResponseDto,
  toPsychologyClinicFoundationCloseoutResponseDto,
  toPsychologyClinicGrowthReminderBridgeResponseDto,
  toPsychologyClinicOperationsCloseoutResponseDto,
  toPsychologyClinicPatientIntakeWorkspaceResponseDto,
  toPsychologyClinicPatientRecordResponseDto,
  toPsychologyClinicPatientTimelineWorkspaceResponseDto,
  toPsychologyClinicProductAnchorResponseDto,
  toPsychologyClinicProfileWorkspaceResponseDto,
  toPsychologyClinicSessionNoteDraftPacketResponseDto,
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
}
