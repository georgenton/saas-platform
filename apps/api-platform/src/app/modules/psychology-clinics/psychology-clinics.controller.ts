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
  GetTenantPsychologyClinicFoundationCloseoutUseCase,
  GetTenantPsychologyClinicPatientIntakeWorkspaceUseCase,
  GetTenantPsychologyClinicProductAnchorUseCase,
  GetTenantPsychologyClinicProfileWorkspaceUseCase,
  GetTenantPsychologyClinicSessionSchedulingWorkspaceUseCase,
  PSYCHOLOGY_CLINICS_PERMISSIONS,
  RegisterTenantPsychologyClinicPatientIntakeUseCase,
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
  PsychologyClinicFoundationCloseoutResponseDto,
  PsychologyClinicPatientIntakeWorkspaceResponseDto,
  PsychologyClinicPatientRecordResponseDto,
  PsychologyClinicProductAnchorResponseDto,
  PsychologyClinicProfileWorkspaceResponseDto,
  PsychologyClinicSessionNoteDraftPacketResponseDto,
  PsychologyClinicSessionRecordResponseDto,
  PsychologyClinicSessionSchedulingWorkspaceResponseDto,
  RegisterPsychologyClinicPatientIntakeRequestDto,
  TransitionPsychologyClinicSessionRequestDto,
  UpsertPsychologyClinicProfileWorkspaceRequestDto,
  toPsychologyClinicFoundationCloseoutResponseDto,
  toPsychologyClinicPatientIntakeWorkspaceResponseDto,
  toPsychologyClinicPatientRecordResponseDto,
  toPsychologyClinicProductAnchorResponseDto,
  toPsychologyClinicProfileWorkspaceResponseDto,
  toPsychologyClinicSessionNoteDraftPacketResponseDto,
  toPsychologyClinicSessionRecordResponseDto,
  toPsychologyClinicSessionSchedulingWorkspaceResponseDto,
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
}
