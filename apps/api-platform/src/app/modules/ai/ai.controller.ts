import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  DefaultValuePipe,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AiApprovalPolicyNotFoundError,
  AiApprovalRequestAlreadyPendingError,
  AiApprovalRequestAlreadyReviewedError,
  AiApprovalRequestNotFoundError,
  ApplyTenantAiMemoryArchivalPolicyUseCase,
  AiMemoryRecordNotFoundError,
  AiToolNotFoundError,
  CreateTenantAiGuardedExecutionEventUseCase,
  CreateTenantAiMemoryRecordUseCase,
  GetAiPromptRegistryEntryByAgentKeyUseCase,
  GetAiApprovalPoliciesByAgentKeyUseCase,
  GetAiAgentToolAccessByAgentKeyUseCase,
  GetAiToolRegistryEntryByKeyUseCase,
  GetTenantAiMemoryRecordDetailUseCase,
  GetTenantAiMemoryRetrievalUseCase,
  GetTenantAiSuggestionRunDetailUseCase,
  AiAgentNotFoundError,
  GetTenantAiSuggestionEnvelopeUseCase,
  ListTenantAiApprovalRequestsUseCase,
  ListTenantAiGuardedExecutionEventsUseCase,
  ListTenantAiMemoryRecordsUseCase,
  ListTenantAiSuggestionRunsUseCase,
  ListAiApprovalPoliciesUseCase,
  ListAiAgentCatalogUseCase,
  ListAiPromptRegistryUseCase,
  ListAiToolRegistryUseCase,
  PrepareTenantAiSuggestionRunUseCase,
  RequestTenantAiSuggestionRunApprovalUseCase,
  ReviewTenantAiApprovalRequestUseCase,
  UpdateTenantAiMemoryRecordUseCase,
  AiSuggestionRunNotFoundError,
  buildInitialAiSuggestionRunApprovalSummary,
} from '@saas-platform/ai-application';
import { AiApprovalRequestStatus } from '@saas-platform/ai-domain';
import {
  GROWTH_PERMISSIONS,
  GrowthOperationalCaseNotFoundError,
  ReleaseTenantGrowthOperationalCaseUseCase,
  TakeTenantGrowthOperationalCaseUseCase,
} from '@saas-platform/growth-application';
import {
  CreateTenantInvoicePaymentUseCase,
  INVOICING_PERMISSIONS,
  GetTenantInvoiceDetailUseCase,
  InvalidInvoicePaymentStateError,
  InvoiceNotFoundError,
  InvoicePaymentExceedsBalanceError,
  PaymentNotFoundError,
  ReverseTenantInvoicePaymentUseCase,
} from '@saas-platform/invoicing-application';
import { TenantNotFoundError } from '@saas-platform/tenancy-application';
import { AuthenticatedUser } from '../auth/authenticated-user.decorator';
import { AuthenticatedUserContext } from '../auth/authenticated-user-context';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { TenantAccess } from '../tenancy/tenant-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import {
  AiApprovalPolicyResponseDto,
  toAiApprovalPolicyResponseDto,
} from './dto/ai-approval-policy.response';
import {
  AiActivityEventTypeResponseDto,
  AiActivityFeedResponseDto,
  toAiActivityFeedResponseDto,
} from './dto/ai-activity-feed.response';
import {
  AiApprovalRequestResponseDto,
  toAiApprovalRequestResponseDto,
} from './dto/ai-approval-request.response';
import {
  AiApprovalCapacityWorkspaceResponseDto,
  toAiApprovalCapacityWorkspaceResponseDto,
} from './dto/ai-approval-capacity-workspace.response';
import {
  AiApprovalDesignWorkspaceResponseDto,
  toAiApprovalDesignWorkspaceResponseDto,
} from './dto/ai-approval-design-workspace.response';
import {
  AiApprovalLaunchWorkspaceResponseDto,
  toAiApprovalLaunchWorkspaceResponseDto,
} from './dto/ai-approval-launch-workspace.response';
import {
  AiApprovalReadinessWorkspaceResponseDto,
  toAiApprovalReadinessWorkspaceResponseDto,
} from './dto/ai-approval-readiness-workspace.response';
import {
  AiApprovalSlaWorkspaceResponseDto,
  toAiApprovalSlaWorkspaceResponseDto,
} from './dto/ai-approval-sla-workspace.response';
import {
  AiApprovalRolloutWorkspaceResponseDto,
  toAiApprovalRolloutWorkspaceResponseDto,
} from './dto/ai-approval-rollout-workspace.response';
import {
  AiApprovalStaffingWorkspaceResponseDto,
  toAiApprovalStaffingWorkspaceResponseDto,
} from './dto/ai-approval-staffing-workspace.response';
import {
  AiApprovalStaffingPlanWorkspaceResponseDto,
  toAiApprovalStaffingPlanWorkspaceResponseDto,
} from './dto/ai-approval-staffing-plan-workspace.response';
import {
  AiApprovalWorkspaceResponseDto,
  toAiApprovalWorkspaceResponseDto,
} from './dto/ai-approval-workspace.response';
import {
  AiActionCenterResponseDto,
  toAiActionCenterResponseDto,
} from './dto/ai-action-center.response';
import {
  AiAgentCatalogResponseDto,
  toAiAgentCatalogResponseDto,
} from './dto/ai-agent-catalog.response';
import { CreateAiApprovalRequestRequestDto } from './dto/create-ai-approval-request.request';
import { CreateAiMemoryRecordRequestDto } from './dto/create-ai-memory-record.request';
import { UpdateAiMemoryRecordRequestDto } from './dto/update-ai-memory-record.request';
import {
  AiPromptRegistryResponseDto,
  toAiPromptRegistryResponseDto,
} from './dto/ai-prompt-registry.response';
import { ReviewAiApprovalRequestRequestDto } from './dto/review-ai-approval-request.request';
import {
  AiAgentToolAccessResponseDto,
  AiToolRegistryResponseDto,
  toAiAgentToolAccessResponseDto,
  toAiToolRegistryResponseDto,
} from './dto/ai-tool-registry.response';
import {
  AiSuggestionEnvelopeResponseDto,
  toAiSuggestionEnvelopeResponseDto,
} from './dto/ai-suggestion-envelope.response';
import {
  AiSuggestionRunResponseDto,
  toAiSuggestionRunResponseDto,
} from './dto/ai-suggestion-run.response';
import {
  AiSuggestionRunDetailResponseDto,
  toAiSuggestionRunDetailResponseDto,
} from './dto/ai-suggestion-run-detail.response';
import {
  AiEvaluationWorkspaceResponseDto,
  toAiEvaluationWorkspaceResponseDto,
} from './dto/ai-evaluation-workspace.response';
import {
  AiGuardedExecutionAuditWorkspaceResponseDto,
  toAiGuardedExecutionAuditWorkspaceResponseDto,
} from './dto/ai-guarded-execution-audit-workspace.response';
import {
  AiGuardedExecutionExecutionResponseDto,
  toAiGuardedExecutionExecutionResponseDto,
} from './dto/ai-guarded-execution-execution.response';
import {
  AiGuardedExecutionControlWorkspaceResponseDto,
  toAiGuardedExecutionControlWorkspaceResponseDto,
} from './dto/ai-guarded-execution-control-workspace.response';
import {
  AiGuardedExecutionEventLogEntryTypeResponseDto,
  AiGuardedExecutionEventLogWorkspaceResponseDto,
  toAiGuardedExecutionEventLogWorkspaceResponseDto,
} from './dto/ai-guarded-execution-event-log-workspace.response';
import {
  AiGuardedExecutionLaunchWorkspaceResponseDto,
  toAiGuardedExecutionLaunchWorkspaceResponseDto,
} from './dto/ai-guarded-execution-launch-workspace.response';
import {
  AiGuardedExecutionMonitorWorkspaceResponseDto,
  toAiGuardedExecutionMonitorWorkspaceResponseDto,
} from './dto/ai-guarded-execution-monitor-workspace.response';
import {
  AiGuardedExecutionPilotWorkspaceResponseDto,
  toAiGuardedExecutionPilotWorkspaceResponseDto,
} from './dto/ai-guarded-execution-pilot-workspace.response';
import {
  AiGuardedExecutionRollbackWorkspaceResponseDto,
  toAiGuardedExecutionRollbackWorkspaceResponseDto,
} from './dto/ai-guarded-execution-rollback-workspace.response';
import {
  AiGuardedExecutionRollbackExecutionResponseDto,
  toAiGuardedExecutionRollbackExecutionResponseDto,
} from './dto/ai-guarded-execution-rollback-execution.response';
import {
  AiGuardedExecutionRunbookWorkspaceResponseDto,
  toAiGuardedExecutionRunbookWorkspaceResponseDto,
} from './dto/ai-guarded-execution-runbook-workspace.response';
import {
  AiGuardedExecutionWorkspaceResponseDto,
  toAiGuardedExecutionWorkspaceResponseDto,
} from './dto/ai-guarded-execution-workspace.response';
import {
  AiGovernanceWorkspaceResponseDto,
  toAiGovernanceWorkspaceResponseDto,
} from './dto/ai-governance-workspace.response';
import {
  AiHandoffWorkspaceResponseDto,
  toAiHandoffWorkspaceResponseDto,
} from './dto/ai-handoff-workspace.response';
import {
  AiHealthWorkspaceResponseDto,
  toAiHealthWorkspaceResponseDto,
} from './dto/ai-health-workspace.response';
import {
  AiMemoryWorkspaceResponseDto,
  toAiMemoryWorkspaceResponseDto,
} from './dto/ai-memory-workspace.response';
import {
  AiMemoryRecordResponseDto,
  toAiMemoryRecordResponseDto,
} from './dto/ai-memory-record.response';
import {
  AiMemoryRecordDetailResponseDto,
  toAiMemoryRecordDetailResponseDto,
} from './dto/ai-memory-record-detail.response';
import {
  AiOperationsSummaryResponseDto,
  toAiOperationsSummaryResponseDto,
} from './dto/ai-operations-summary.response';
import {
  AiPolicySimulationWorkspaceResponseDto,
  toAiPolicySimulationWorkspaceResponseDto,
} from './dto/ai-policy-simulation-workspace.response';
import {
  AiRetrievalWorkspaceResponseDto,
  toAiRetrievalWorkspaceResponseDto,
} from './dto/ai-retrieval-workspace.response';
import { ExecuteAiGuardedExecutionRequestDto } from './dto/execute-ai-guarded-execution.request';

@Controller('ai')
export class AiController {
  private static readonly APPROVAL_REQUEST_STATUSES: AiApprovalRequestStatus[] = [
    'pending',
    'approved',
    'rejected',
  ];
  private static readonly ACTIVITY_EVENT_TYPES: AiActivityEventTypeResponseDto[] = [
    'suggestion_run_prepared',
    'approval_requested',
    'approval_reviewed',
  ];

  constructor(
    private readonly listAiAgentCatalogUseCase: ListAiAgentCatalogUseCase,
    private readonly listAiApprovalPoliciesUseCase: ListAiApprovalPoliciesUseCase,
    private readonly listAiPromptRegistryUseCase: ListAiPromptRegistryUseCase,
    private readonly listAiToolRegistryUseCase: ListAiToolRegistryUseCase,
    private readonly getAiApprovalPoliciesByAgentKeyUseCase: GetAiApprovalPoliciesByAgentKeyUseCase,
    private readonly getAiPromptRegistryEntryByAgentKeyUseCase: GetAiPromptRegistryEntryByAgentKeyUseCase,
    private readonly getAiToolRegistryEntryByKeyUseCase: GetAiToolRegistryEntryByKeyUseCase,
    private readonly getAiAgentToolAccessByAgentKeyUseCase: GetAiAgentToolAccessByAgentKeyUseCase,
    private readonly applyTenantAiMemoryArchivalPolicyUseCase: ApplyTenantAiMemoryArchivalPolicyUseCase,
    private readonly createTenantAiMemoryRecordUseCase: CreateTenantAiMemoryRecordUseCase,
    private readonly listTenantAiMemoryRecordsUseCase: ListTenantAiMemoryRecordsUseCase,
    private readonly getTenantAiMemoryRecordDetailUseCase: GetTenantAiMemoryRecordDetailUseCase,
    private readonly getTenantAiMemoryRetrievalUseCase: GetTenantAiMemoryRetrievalUseCase,
    private readonly updateTenantAiMemoryRecordUseCase: UpdateTenantAiMemoryRecordUseCase,
    private readonly getTenantAiSuggestionEnvelopeUseCase: GetTenantAiSuggestionEnvelopeUseCase,
    private readonly getTenantAiSuggestionRunDetailUseCase: GetTenantAiSuggestionRunDetailUseCase,
    private readonly listTenantAiApprovalRequestsUseCase: ListTenantAiApprovalRequestsUseCase,
    private readonly listTenantAiSuggestionRunsUseCase: ListTenantAiSuggestionRunsUseCase,
    private readonly prepareTenantAiSuggestionRunUseCase: PrepareTenantAiSuggestionRunUseCase,
    private readonly requestTenantAiSuggestionRunApprovalUseCase: RequestTenantAiSuggestionRunApprovalUseCase,
    private readonly reviewTenantAiApprovalRequestUseCase: ReviewTenantAiApprovalRequestUseCase,
    private readonly createTenantAiGuardedExecutionEventUseCase: CreateTenantAiGuardedExecutionEventUseCase,
    private readonly listTenantAiGuardedExecutionEventsUseCase: ListTenantAiGuardedExecutionEventsUseCase,
    private readonly takeTenantGrowthOperationalCaseUseCase: TakeTenantGrowthOperationalCaseUseCase,
    private readonly releaseTenantGrowthOperationalCaseUseCase: ReleaseTenantGrowthOperationalCaseUseCase,
    private readonly getTenantInvoiceDetailUseCase: GetTenantInvoiceDetailUseCase,
    private readonly createTenantInvoicePaymentUseCase: CreateTenantInvoicePaymentUseCase,
    private readonly reverseTenantInvoicePaymentUseCase: ReverseTenantInvoicePaymentUseCase,
  ) {}

  @Get('agents')
  @UseGuards(JwtAuthenticationGuard)
  listAiAgents(): AiAgentCatalogResponseDto[] {
    return this.listAiAgentCatalogUseCase
      .execute()
      .map((entry) => toAiAgentCatalogResponseDto(entry));
  }

  @Get('approval-policies')
  @UseGuards(JwtAuthenticationGuard)
  listAiApprovalPolicies(): AiApprovalPolicyResponseDto[] {
    return this.listAiApprovalPoliciesUseCase
      .execute()
      .map((entry) => toAiApprovalPolicyResponseDto(entry));
  }

  @Get('prompts')
  @UseGuards(JwtAuthenticationGuard)
  listAiPromptRegistry(): AiPromptRegistryResponseDto[] {
    return this.listAiPromptRegistryUseCase
      .execute()
      .map((entry) => toAiPromptRegistryResponseDto(entry));
  }

  @Get('tools')
  @UseGuards(JwtAuthenticationGuard)
  listAiTools(): AiToolRegistryResponseDto[] {
    return this.listAiToolRegistryUseCase
      .execute()
      .map((entry) => toAiToolRegistryResponseDto(entry));
  }

  @Get('tools/:toolKey')
  @UseGuards(JwtAuthenticationGuard)
  getAiTool(
    @Param('toolKey') toolKey: string,
  ): AiToolRegistryResponseDto {
    try {
      return toAiToolRegistryResponseDto(
        this.getAiToolRegistryEntryByKeyUseCase.execute(toolKey),
      );
    } catch (error) {
      if (error instanceof AiToolNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('agents/:agentKey/approval-policies')
  @UseGuards(JwtAuthenticationGuard)
  getAiApprovalPoliciesByAgent(
    @Param('agentKey') agentKey: string,
  ): AiApprovalPolicyResponseDto[] {
    try {
      return this.getAiApprovalPoliciesByAgentKeyUseCase
        .execute(agentKey)
        .map((entry) => toAiApprovalPolicyResponseDto(entry));
    } catch (error) {
      if (error instanceof AiAgentNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('agents/:agentKey/prompt-pack')
  @UseGuards(JwtAuthenticationGuard)
  getAiPromptPack(
    @Param('agentKey') agentKey: string,
  ): AiPromptRegistryResponseDto {
    try {
      return toAiPromptRegistryResponseDto(
        this.getAiPromptRegistryEntryByAgentKeyUseCase.execute(agentKey),
      );
    } catch (error) {
      if (error instanceof AiAgentNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('agents/:agentKey/tool-access')
  @UseGuards(JwtAuthenticationGuard)
  getAiAgentToolAccess(
    @Param('agentKey') agentKey: string,
  ): AiAgentToolAccessResponseDto[] {
    try {
      return this.getAiAgentToolAccessByAgentKeyUseCase
        .execute(agentKey)
        .map((entry) => toAiAgentToolAccessResponseDto(entry));
    } catch (error) {
      if (error instanceof AiAgentNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/agents/:agentKey/suggestion-envelope')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiSuggestionEnvelope(
    @Param('slug') slug: string,
    @Param('agentKey') agentKey: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiSuggestionEnvelopeResponseDto> {
    try {
      this.assertAgentPermission(agentKey, tenantAccess?.permissionKeys);

      const envelope = await this.getTenantAiSuggestionEnvelopeUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        agentKey,
      );

      return toAiSuggestionEnvelopeResponseDto(envelope);
    } catch (error) {
      if (error instanceof AiAgentNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post('tenants/:slug/memory-records')
  @HttpCode(201)
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async createTenantAiMemoryRecord(
    @Param('slug') slug: string,
    @Body() body: CreateAiMemoryRecordRequestDto,
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserContext | undefined,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiMemoryRecordResponseDto> {
    if (!authenticatedUser) {
      throw new NotFoundException('Authenticated user context is required.');
    }

    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    this.assertAtLeastOneAiPermission(
      tenantAccess?.permissionKeys,
      'At least one AI agent permission is required to create tenant memory records.',
    );

    let domainKey = body.domainKey ?? null;
    let agentKey = body.agentKey ?? null;

    if (body.scope === 'tenant' && (body.domainKey || body.agentKey)) {
      throw new BadRequestException(
        'Tenant-scoped AI memory records cannot include domainKey or agentKey.',
      );
    }

    if (body.scope === 'domain') {
      if (!body.domainKey) {
        throw new BadRequestException(
          'Domain-scoped AI memory records require domainKey.',
        );
      }

      if (body.agentKey) {
        throw new BadRequestException(
          'Domain-scoped AI memory records cannot include agentKey.',
        );
      }

      if (
        !this.getAccessibleDomainKeys(tenantAccess?.permissionKeys).includes(
          body.domainKey,
        )
      ) {
        throw new ForbiddenException(
          `Visible AI access for domain "${body.domainKey}" is required to create this memory record.`,
        );
      }
    }

    if (body.scope === 'agent') {
      if (!body.agentKey) {
        throw new BadRequestException(
          'Agent-scoped AI memory records require agentKey.',
        );
      }

      this.assertAgentPermission(body.agentKey, tenantAccess?.permissionKeys);
      domainKey = this.getAgentDomainKey(body.agentKey);
      agentKey = body.agentKey;
    }

    const record = await this.createTenantAiMemoryRecordUseCase.execute({
      tenantSlug,
      scope: body.scope,
      domainKey,
      agentKey,
      sourceKind: body.sourceKind ?? 'operator_note',
      freshness: body.freshness ?? 'working_memory',
      title: body.title,
      summary: body.summary,
      detail: body.detail,
      tags: body.tags ?? [],
      createdByUserId: authenticatedUser.id,
      createdByEmail: authenticatedUser.email,
    });

    return toAiMemoryRecordResponseDto(record);
  }

  @Get('tenants/:slug/memory-records')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async listTenantAiMemoryRecords(
    @Param('slug') slug: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('scope') scope?: string,
    @Query('status') status?: string,
    @Query('domainKey') domainKey?: string,
    @Query('agentKey') agentKey?: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiMemoryRecordResponseDto[]> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgentKeys = this.getAccessibleReadyAiWorkspaceAgentKeys(
      tenantAccess?.permissionKeys,
    );

    if (accessibleAgentKeys.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for tenant memory records.',
      );
    }

    if (agentKey) {
      this.assertAgentPermission(agentKey, tenantAccess?.permissionKeys);
    }

    const accessibleDomainKeys = this.getAccessibleDomainKeys(
      tenantAccess?.permissionKeys,
    );

    if (
      domainKey &&
      !accessibleDomainKeys.includes(
        domainKey as 'growth' | 'invoicing' | 'ecommerce',
      )
    ) {
      throw new ForbiddenException(
        `Visible AI access for domain "${domainKey}" is required to read these memory records.`,
      );
    }

    await this.applyTenantAiMemoryArchivalPolicyUseCase.execute(tenantSlug);

    const records = await this.listTenantAiMemoryRecordsUseCase.execute(
      tenantSlug,
      {
        scopes: this.parseMemoryScopeFilter(scope),
        statuses: this.parseMemoryStatusFilter(status),
        domainKeys: accessibleDomainKeys,
        agentKeys: accessibleAgentKeys,
        limit,
      },
    );

    return records
      .filter((entry) => {
        const visible =
          entry.scope === 'tenant' ||
          (entry.scope === 'domain' &&
            !!entry.domainKey &&
            accessibleDomainKeys.includes(entry.domainKey)) ||
          (entry.scope === 'agent' &&
            !!entry.agentKey &&
            accessibleAgentKeys.includes(entry.agentKey));

        if (!visible) {
          return false;
        }

        if (scope && entry.scope !== scope) {
          return false;
        }

        if (domainKey && entry.domainKey !== domainKey) {
          return false;
        }

        if (agentKey && entry.agentKey !== agentKey) {
          return false;
        }

        return true;
      })
      .map((entry) => toAiMemoryRecordResponseDto(entry));
  }

  @Get('tenants/:slug/memory-records/:recordId')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiMemoryRecordDetail(
    @Param('slug') slug: string,
    @Param('recordId') recordId: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiMemoryRecordDetailResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgentKeys = this.getAccessibleReadyAiWorkspaceAgentKeys(
      tenantAccess?.permissionKeys,
    );

    this.assertAtLeastOneAiPermission(
      tenantAccess?.permissionKeys,
      'At least one AI agent permission is required for tenant memory record detail.',
    );

    const accessibleDomainKeys = this.getAccessibleDomainKeys(
      tenantAccess?.permissionKeys,
    );

    try {
      await this.applyTenantAiMemoryArchivalPolicyUseCase.execute(tenantSlug);

      const detail = await this.getTenantAiMemoryRecordDetailUseCase.execute(
        tenantSlug,
        recordId,
        {
          accessibleAgentKeys,
        },
      );

      if (
        !this.isVisibleAiMemoryRecord(
          detail.record,
          accessibleDomainKeys,
          accessibleAgentKeys,
        )
      ) {
        throw new ForbiddenException(
          `Visible AI access is required to inspect memory record ${recordId}.`,
        );
      }

      const accessibleAgents = this.listAiAgentCatalogUseCase
        .execute()
        .filter((entry) => entry.availability === 'ready')
        .filter((entry) => accessibleAgentKeys.includes(entry.key));

      const currentRetrievalAgents = (
        await Promise.all(
          accessibleAgents.map(async (agent) => {
            const retrieval = await this.getTenantAiMemoryRetrievalUseCase.execute(
              tenantSlug,
              agent.key,
              20,
            );
            const matchingRecord =
              retrieval.records.find((entry) => entry.id === recordId) ?? null;

            if (!matchingRecord) {
              return null;
            }

            return {
              agentKey: agent.key,
              title: agent.title,
              domainKey: agent.domainKey,
              inclusionReason: matchingRecord.inclusionReason,
            };
          }),
        )
      ).filter(
        (
          entry,
        ): entry is {
          agentKey: string;
          title: string;
          domainKey: 'growth' | 'invoicing' | 'ecommerce';
          inclusionReason: string;
        } => entry !== null,
      );

      return toAiMemoryRecordDetailResponseDto(detail, {
        agentCount: currentRetrievalAgents.length,
        agents: currentRetrievalAgents,
        notes: [
          currentRetrievalAgents.length > 0
            ? `${currentRetrievalAgents.length} visible agent(s) would hydrate this memory record right now.`
            : 'No visible agent would hydrate this memory record right now.',
          detail.record.status === 'inactive'
            ? 'Inactive records stay visible for audit and editing, but they do not enter live retrieval until reactivated.'
            : 'Active records remain eligible for live retrieval when they match tenant/domain/agent scope.',
        ],
      });
    } catch (error) {
      if (
        error instanceof AiMemoryRecordNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Patch('tenants/:slug/memory-records/:recordId')
  @HttpCode(200)
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async updateTenantAiMemoryRecord(
    @Param('slug') slug: string,
    @Param('recordId') recordId: string,
    @Body() body: UpdateAiMemoryRecordRequestDto,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiMemoryRecordResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;

    this.assertAtLeastOneAiPermission(
      tenantAccess?.permissionKeys,
      'At least one AI agent permission is required to update tenant memory records.',
    );

    const accessibleAgentKeys = this.getAccessibleReadyAiWorkspaceAgentKeys(
      tenantAccess?.permissionKeys,
    );
    const accessibleDomainKeys = this.getAccessibleDomainKeys(
      tenantAccess?.permissionKeys,
    );

    try {
      const detail = await this.getTenantAiMemoryRecordDetailUseCase.execute(
        tenantSlug,
        recordId,
        {
          accessibleAgentKeys,
        },
      );

      if (
        !this.isVisibleAiMemoryRecord(
          detail.record,
          accessibleDomainKeys,
          accessibleAgentKeys,
        )
      ) {
        throw new ForbiddenException(
          `Visible AI access is required to update memory record ${recordId}.`,
        );
      }

      if (
        body.sourceKind === undefined &&
        body.freshness === undefined &&
        body.title === undefined &&
        body.summary === undefined &&
        body.detail === undefined &&
        body.tags === undefined &&
        body.status === undefined
      ) {
        throw new BadRequestException(
          'At least one editable AI memory record field is required.',
        );
      }

      const record = await this.updateTenantAiMemoryRecordUseCase.execute({
        tenantSlug,
        recordId,
        sourceKind: body.sourceKind ?? undefined,
        freshness: body.freshness ?? undefined,
        title: body.title ?? undefined,
        summary: body.summary ?? undefined,
        detail: body.detail ?? undefined,
        tags: body.tags ?? undefined,
        status: body.status ?? undefined,
      });

      return toAiMemoryRecordResponseDto(record);
    } catch (error) {
      if (
        error instanceof AiMemoryRecordNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/agents/:agentKey/approval-requests')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async listTenantAiApprovalRequests(
    @Param('slug') slug: string,
    @Param('agentKey') agentKey: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiApprovalRequestResponseDto[]> {
    try {
      this.assertAgentPermission(agentKey, tenantAccess?.permissionKeys);

      const records = await this.listTenantAiApprovalRequestsUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        agentKey,
        {
          limit,
          status: this.parseApprovalRequestStatusFilter(status),
        },
      );

      return records.map((entry) => toAiApprovalRequestResponseDto(entry));
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/approval-requests')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async listTenantAiApprovalWorkspace(
    @Param('slug') slug: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiApprovalRequestResponseDto[]> {
    const parsedStatus =
      this.parseApprovalRequestStatusFilter(status);
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgentKeys = this.getAccessibleReadyAiWorkspaceAgentKeys(
      tenantAccess?.permissionKeys,
    );

    if (accessibleAgentKeys.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant approval workspace.',
      );
    }

    try {
      const recordsByAgent = await Promise.all(
        accessibleAgentKeys.map((agentKey) =>
          this.listTenantAiApprovalRequestsUseCase.execute(
            tenantSlug,
            agentKey,
            {
              limit,
              status: parsedStatus,
            },
          ),
        ),
      );

      return recordsByAgent
        .flat()
        .sort(
          (left, right) =>
            right.createdAt.getTime() - left.createdAt.getTime() ||
            right.updatedAt.getTime() - left.updatedAt.getTime(),
        )
        .slice(0, limit)
        .map((entry) => toAiApprovalRequestResponseDto(entry));
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/approval-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiApprovalWorkspace(
    @Param('slug') slug: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiApprovalWorkspaceResponseDto> {
    const parsedStatus = this.parseApprovalRequestStatusFilter(status);
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgentKeys = this.getAccessibleReadyAiWorkspaceAgentKeys(
      tenantAccess?.permissionKeys,
    );

    if (accessibleAgentKeys.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant approval workspace.',
      );
    }

    try {
      const agentCatalog = this.listAiAgentCatalogUseCase.execute();
      const agentCatalogByKey = new Map(
        agentCatalog.map((entry) => [entry.key, entry] as const),
      );
      const approvalRequestsByAgent = await Promise.all(
        accessibleAgentKeys.map(async (agentKey) => ({
          agentKey,
          records: await this.listTenantAiApprovalRequestsUseCase.execute(
            tenantSlug,
            agentKey,
            {
              limit: null,
              status: null,
            },
          ),
        })),
      );

      const approvalRequests = approvalRequestsByAgent
        .flatMap((entry) => entry.records)
        .sort(
          (left, right) =>
            right.createdAt.getTime() - left.createdAt.getTime() ||
            right.updatedAt.getTime() - left.updatedAt.getTime(),
        );
      const filteredApprovalRequests = parsedStatus
        ? approvalRequests.filter((entry) => entry.status === parsedStatus)
        : approvalRequests;
      const pendingApprovalRequests = approvalRequests.filter(
        (entry) => entry.status === 'pending',
      );
      const reviewedApprovalRequests = approvalRequests.filter(
        (entry) => entry.reviewedAt !== null,
      );
      const latestReviewedApprovalRequest = reviewedApprovalRequests.sort(
        (left, right) =>
          (right.reviewedAt?.getTime() ?? 0) -
          (left.reviewedAt?.getTime() ?? 0),
      )[0] ?? null;

      return toAiApprovalWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalApprovalRequests: approvalRequests.length,
          pendingApprovalRequests: pendingApprovalRequests.length,
          approvedApprovalRequests: approvalRequests.filter(
            (entry) => entry.status === 'approved',
          ).length,
          rejectedApprovalRequests: approvalRequests.filter(
            (entry) => entry.status === 'rejected',
          ).length,
        },
        agentBreakdown: approvalRequestsByAgent.map(({ agentKey, records }) => ({
          agentKey,
          title:
            agentCatalogByKey.get(agentKey)?.title ?? agentKey,
          totalApprovalRequests: records.length,
          pendingApprovalRequests: records.filter(
            (entry) => entry.status === 'pending',
          ).length,
          approvedApprovalRequests: records.filter(
            (entry) => entry.status === 'approved',
          ).length,
          rejectedApprovalRequests: records.filter(
            (entry) => entry.status === 'rejected',
          ).length,
          latestRequestedAt: records[0]?.createdAt ?? null,
          latestReviewedAt:
            records
              .filter((entry) => entry.reviewedAt !== null)
              .sort(
                (left, right) =>
                  (right.reviewedAt?.getTime() ?? 0) -
                  (left.reviewedAt?.getTime() ?? 0),
              )[0]?.reviewedAt ?? null,
        })),
        oldestPendingApprovalRequest:
          pendingApprovalRequests
            .slice()
            .sort(
              (left, right) =>
                left.createdAt.getTime() - right.createdAt.getTime() ||
                left.updatedAt.getTime() - right.updatedAt.getTime(),
            )[0] ?? null,
        latestReviewedApprovalRequest,
        recentApprovalRequests: filteredApprovalRequests.slice(0, limit),
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/activity-feed')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiActivityFeed(
    @Param('slug') slug: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('type') type?: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiActivityFeedResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const eventType = this.parseActivityEventTypeFilter(type);
    const accessibleAgentKeys = this.getAccessibleReadyAiWorkspaceAgentKeys(
      tenantAccess?.permissionKeys,
    );

    if (accessibleAgentKeys.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant activity feed.',
      );
    }

    try {
      const [approvalRequestsByAgent, suggestionRunsByAgent] = await Promise.all([
        Promise.all(
          accessibleAgentKeys.map((agentKey) =>
            this.listTenantAiApprovalRequestsUseCase.execute(
              tenantSlug,
              agentKey,
              {
                limit: null,
                status: null,
              },
            ),
          ),
        ),
        Promise.all(
          accessibleAgentKeys.map((agentKey) =>
            this.listTenantAiSuggestionRunsUseCase.execute(
              tenantSlug,
              agentKey,
              null,
            ),
          ),
        ),
      ]);

      const entries = [
        ...suggestionRunsByAgent.flat().map((entry) => ({
          id: `suggestion-run-prepared:${entry.id}`,
          tenantSlug,
          agentKey: entry.agentKey,
          eventType: 'suggestion_run_prepared' as const,
          occurredAt: entry.createdAt,
          suggestionRunId: entry.id,
          approvalRequestId: null,
          actorUserId: entry.requestedByUserId,
          actorEmail: entry.requestedByEmail,
          summary: entry.summary,
          detail: `Prepared handoff with ${entry.promptPackKey}@${entry.promptPackVersion}.`,
        })),
        ...approvalRequestsByAgent.flat().flatMap((entry) => {
          const requestedEvent = {
            id: `approval-requested:${entry.id}`,
            tenantSlug,
            agentKey: entry.agentKey,
            eventType: 'approval_requested' as const,
            occurredAt: entry.createdAt,
            suggestionRunId: entry.suggestionRunId,
            approvalRequestId: entry.id,
            actorUserId: entry.requestedByUserId,
            actorEmail: entry.requestedByEmail,
            summary: entry.summary,
            detail:
              entry.rationale ?? `Approval requested under policy ${entry.policyKey}.`,
          };
          const reviewedEvent =
            entry.reviewedAt !== null
              ? {
                  id: `approval-reviewed:${entry.id}`,
                  tenantSlug,
                  agentKey: entry.agentKey,
                  eventType: 'approval_reviewed' as const,
                  occurredAt: entry.reviewedAt,
                  suggestionRunId: entry.suggestionRunId,
                  approvalRequestId: entry.id,
                  actorUserId: entry.reviewedByUserId,
                  actorEmail: entry.reviewedByEmail,
                  summary: entry.summary,
                  detail:
                    entry.reviewNote ??
                    `Approval ${entry.status} under policy ${entry.policyKey}.`,
                }
              : null;

          return reviewedEvent ? [requestedEvent, reviewedEvent] : [requestedEvent];
        }),
      ]
        .filter((entry) => (eventType ? entry.eventType === eventType : true))
        .sort((left, right) => right.occurredAt.getTime() - left.occurredAt.getTime())
        .slice(0, limit);

      return toAiActivityFeedResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        entries,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/memory-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiMemoryWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiMemoryWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant memory workspace.',
      );
    }

    try {
      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [promptPack, toolAccess, approvalRequests, suggestionRuns] =
            await Promise.all([
              this.getAiPromptRegistryEntryByAgentKeyUseCase.execute(agent.key),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
            ]);

          const pendingApprovalRequests = approvalRequests
            .filter((entry) => entry.status === 'pending')
            .sort(
              (left, right) =>
                left.createdAt.getTime() - right.createdAt.getTime() ||
                left.updatedAt.getTime() - right.updatedAt.getTime(),
            );
          const reviewedApprovalRequests = approvalRequests
            .filter((entry) => entry.reviewedAt !== null)
            .sort(
              (left, right) =>
                (right.reviewedAt?.getTime() ?? 0) -
                  (left.reviewedAt?.getTime() ?? 0) ||
                right.updatedAt.getTime() - left.updatedAt.getTime(),
            );
          const latestSuggestionRun =
            suggestionRuns
              .slice()
              .sort(
                (left, right) =>
                  right.createdAt.getTime() - left.createdAt.getTime(),
              )[0] ?? null;
          const recentActivityCandidates = [
            ...suggestionRuns.map((entry) => entry.createdAt),
            ...approvalRequests.map((entry) => entry.createdAt),
            ...approvalRequests
              .map((entry) => entry.reviewedAt)
              .filter((entry): entry is Date => entry !== null),
          ].sort((left, right) => right.getTime() - left.getTime());
          const toolAccessSummary = {
            allowedCount: toolAccess.filter((entry) => entry.accessLevel === 'allowed')
              .length,
            approvalRequiredCount: toolAccess.filter(
              (entry) => entry.accessLevel === 'approval_required',
            ).length,
            blockedCount: toolAccess.filter((entry) => entry.accessLevel === 'blocked')
              .length,
          };
          const latestReviewedApprovalRequest = reviewedApprovalRequests[0] ?? null;
          const oldestPendingApprovalRequest = pendingApprovalRequests[0] ?? null;
          const memoryNotes = [
            `Prompt pack ${promptPack.key}@${promptPack.version} in ${promptPack.mode} mode.`,
            latestSuggestionRun
              ? `Latest handoff prepared ${latestSuggestionRun.createdAt.toISOString()}.`
              : 'No handoff prepared yet for this tenant.',
            pendingApprovalRequests.length > 0
              ? `${pendingApprovalRequests.length} pending human review request(s).`
              : 'No pending human reviews right now.',
            latestReviewedApprovalRequest?.reviewedAt
              ? `Latest human decision was ${latestReviewedApprovalRequest.status} on ${latestReviewedApprovalRequest.reviewedAt.toISOString()}.`
              : 'No reviewed approvals recorded yet.',
            `Tool posture: ${toolAccessSummary.allowedCount} allowed, ${toolAccessSummary.approvalRequiredCount} approval-required, ${toolAccessSummary.blockedCount} blocked.`,
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            availability: agent.availability,
            defaultMode: agent.defaultMode,
            supportedSurfaceKeys: agent.supportedSurfaceKeys,
            promptPack: {
              key: promptPack.key,
              version: promptPack.version,
              mode: promptPack.mode,
              title: promptPack.title,
              summary: promptPack.summary,
            },
            toolAccessSummary,
            pendingApprovalRequestsCount: pendingApprovalRequests.length,
            oldestPendingApprovalRequest,
            latestReviewedApprovalRequest,
            latestSuggestionRun,
            recentActivityAt: recentActivityCandidates[0] ?? null,
            memoryNotes,
          };
        }),
      );

      const sortedAgents = agents.sort(
        (left, right) =>
          (right.recentActivityAt?.getTime() ?? 0) -
            (left.recentActivityAt?.getTime() ?? 0) ||
          left.title.localeCompare(right.title),
      );

      return toAiMemoryWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: sortedAgents.length,
          agentsWithSuggestionRuns: sortedAgents.filter(
            (entry) => entry.latestSuggestionRun !== null,
          ).length,
          agentsWithPendingApprovals: sortedAgents.filter(
            (entry) => entry.pendingApprovalRequestsCount > 0,
          ).length,
          totalPendingApprovalRequests: sortedAgents.reduce(
            (total, entry) => total + entry.pendingApprovalRequestsCount,
            0,
          ),
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/retrieval-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiRetrievalWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiRetrievalWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant retrieval workspace.',
      );
    }

    const agents = await Promise.all(
      accessibleAgents.map(async (agent) => ({
        agentKey: agent.key,
        title: agent.title,
        domainKey: agent.domainKey,
        productKey: agent.productKey,
        retrieval: await this.getTenantAiMemoryRetrievalUseCase.execute(
          tenantSlug,
          agent.key,
        ),
      })),
    );

    const uniqueRecordIds = new Set(
      agents.flatMap((entry) => entry.retrieval.records.map((record) => record.id)),
    );

    return toAiRetrievalWorkspaceResponseDto({
      tenantSlug,
      generatedAt: new Date(),
      counts: {
        totalAgents: agents.length,
        agentsWithMemory: agents.filter((entry) => entry.retrieval.recordCount > 0)
          .length,
        totalRetrievedRecords: agents.reduce(
          (total, entry) => total + entry.retrieval.recordCount,
          0,
        ),
        uniqueRetrievedRecords: uniqueRecordIds.size,
      },
      agents,
    });
  }

  @Get('tenants/:slug/health-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiHealthWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiHealthWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant health workspace.',
      );
    }

    try {
      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [toolAccess, approvalRequests, suggestionRuns] = await Promise.all([
            this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
            this.listTenantAiApprovalRequestsUseCase.execute(
              tenantSlug,
              agent.key,
              {
                limit: null,
                status: null,
              },
            ),
            this.listTenantAiSuggestionRunsUseCase.execute(
              tenantSlug,
              agent.key,
              null,
            ),
          ]);

          const pendingApprovalRequests = approvalRequests
            .filter((entry) => entry.status === 'pending')
            .sort(
              (left, right) =>
                left.createdAt.getTime() - right.createdAt.getTime() ||
                left.updatedAt.getTime() - right.updatedAt.getTime(),
            );
          const latestSuggestionRun =
            suggestionRuns
              .slice()
              .sort(
                (left, right) =>
                  right.createdAt.getTime() - left.createdAt.getTime(),
              )[0] ?? null;
          const reviewableSuggestionRunsCount = suggestionRuns.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length;
          const toolAccessSummary = {
            allowedCount: toolAccess.filter((entry) => entry.accessLevel === 'allowed')
              .length,
            approvalRequiredCount: toolAccess.filter(
              (entry) => entry.accessLevel === 'approval_required',
            ).length,
            blockedCount: toolAccess.filter((entry) => entry.accessLevel === 'blocked')
              .length,
          };
          const recentActivityAt =
            [
              ...suggestionRuns.map((entry) => entry.createdAt),
              ...approvalRequests.map((entry) => entry.createdAt),
              ...approvalRequests
                .map((entry) => entry.reviewedAt)
                .filter((entry): entry is Date => entry !== null),
            ].sort((left, right) => right.getTime() - left.getTime())[0] ?? null;
          const status: 'healthy' | 'warning' | 'critical' =
            pendingApprovalRequests.length > 0
              ? 'critical'
              : reviewableSuggestionRunsCount > 0 ||
                  toolAccessSummary.approvalRequiredCount > 0 ||
                  toolAccessSummary.blockedCount > 0
                ? 'warning'
                : 'healthy';
          const notes = [
            pendingApprovalRequests.length > 0
              ? `${pendingApprovalRequests.length} pending approval request(s) require attention.`
              : 'No pending approvals right now.',
            reviewableSuggestionRunsCount > 0
              ? `${reviewableSuggestionRunsCount} suggestion run(s) still need an explicit review request.`
              : 'No reviewable handoffs waiting for escalation.',
            `Tool posture: ${toolAccessSummary.allowedCount} allowed, ${toolAccessSummary.approvalRequiredCount} approval-required, ${toolAccessSummary.blockedCount} blocked.`,
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            status,
            pendingApprovalRequestsCount: pendingApprovalRequests.length,
            reviewableSuggestionRunsCount,
            toolAccessSummary,
            recentActivityAt,
            oldestPendingApprovalRequest: pendingApprovalRequests[0] ?? null,
            latestSuggestionRun,
            notes,
          };
        }),
      );

      const statusWeight = (status: 'healthy' | 'warning' | 'critical') =>
        status === 'critical' ? 3 : status === 'warning' ? 2 : 1;
      const sortedAgents = agents.sort(
        (left, right) =>
          statusWeight(right.status) - statusWeight(left.status) ||
          (right.recentActivityAt?.getTime() ?? 0) -
            (left.recentActivityAt?.getTime() ?? 0) ||
          left.title.localeCompare(right.title),
      );
      const overallStatus = sortedAgents.some((entry) => entry.status === 'critical')
        ? 'critical'
        : sortedAgents.some((entry) => entry.status === 'warning')
          ? 'warning'
          : 'healthy';

      return toAiHealthWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        overallStatus,
        counts: {
          totalAgents: sortedAgents.length,
          healthyAgents: sortedAgents.filter((entry) => entry.status === 'healthy')
            .length,
          warningAgents: sortedAgents.filter((entry) => entry.status === 'warning')
            .length,
          criticalAgents: sortedAgents.filter((entry) => entry.status === 'critical')
            .length,
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/evaluation-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiEvaluationWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiEvaluationWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant evaluation workspace.',
      );
    }

    try {
      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const approvalRequests =
            await this.listTenantAiApprovalRequestsUseCase.execute(
              tenantSlug,
              agent.key,
              {
                limit: null,
                status: null,
              },
            );

          const reviewedApprovalRequests = approvalRequests
            .filter((entry) => entry.reviewedAt !== null)
            .sort(
              (left, right) =>
                (right.reviewedAt?.getTime() ?? 0) -
                  (left.reviewedAt?.getTime() ?? 0) ||
                right.updatedAt.getTime() - left.updatedAt.getTime(),
            );
          const approvedReviewedApprovalRequests = reviewedApprovalRequests.filter(
            (entry) => entry.status === 'approved',
          );
          const rejectedReviewedApprovalRequests = reviewedApprovalRequests.filter(
            (entry) => entry.status === 'rejected',
          );
          const approvalRatePercentage =
            reviewedApprovalRequests.length > 0
              ? Math.round(
                  (approvedReviewedApprovalRequests.length /
                    reviewedApprovalRequests.length) *
                    100,
                )
              : null;
          const status: 'healthy' | 'warning' | 'critical' =
            reviewedApprovalRequests.length === 0
              ? 'warning'
              : rejectedReviewedApprovalRequests.length >
                    approvedReviewedApprovalRequests.length
                ? 'critical'
                : rejectedReviewedApprovalRequests.length > 0
                  ? 'warning'
                  : 'healthy';
          const latestReviewedApprovalRequest =
            reviewedApprovalRequests[0] ?? null;
          const notes = [
            reviewedApprovalRequests.length === 0
              ? 'No reviewed outcomes recorded yet for this agent.'
              : `${approvedReviewedApprovalRequests.length} approved and ${rejectedReviewedApprovalRequests.length} rejected reviewed outcome(s).`,
            approvalRatePercentage === null
              ? 'Approval-rate signal is still unavailable.'
              : `Approval rate currently sits at ${approvalRatePercentage}%.`,
            latestReviewedApprovalRequest?.reviewedAt
              ? `Latest reviewed outcome was ${latestReviewedApprovalRequest.status} on ${latestReviewedApprovalRequest.reviewedAt.toISOString()}.`
              : 'No latest reviewed decision is available yet.',
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            status,
            reviewedApprovalRequestsCount: reviewedApprovalRequests.length,
            approvedReviewedApprovalRequestsCount:
              approvedReviewedApprovalRequests.length,
            rejectedReviewedApprovalRequestsCount:
              rejectedReviewedApprovalRequests.length,
            approvalRatePercentage,
            latestReviewedAt: latestReviewedApprovalRequest?.reviewedAt ?? null,
            latestReviewedApprovalRequest,
            notes,
          };
        }),
      );

      const statusWeight = (status: 'healthy' | 'warning' | 'critical') =>
        status === 'critical' ? 3 : status === 'warning' ? 2 : 1;
      const sortedAgents = agents.sort(
        (left, right) =>
          statusWeight(right.status) - statusWeight(left.status) ||
          (right.latestReviewedAt?.getTime() ?? 0) -
            (left.latestReviewedAt?.getTime() ?? 0) ||
          left.title.localeCompare(right.title),
      );
      const overallStatus = sortedAgents.some((entry) => entry.status === 'critical')
        ? 'critical'
        : sortedAgents.some((entry) => entry.status === 'warning')
          ? 'warning'
          : 'healthy';

      return toAiEvaluationWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        overallStatus,
        counts: {
          totalAgents: sortedAgents.length,
          agentsWithReviewedOutcomes: sortedAgents.filter(
            (entry) => entry.reviewedApprovalRequestsCount > 0,
          ).length,
          reviewedApprovalRequests: sortedAgents.reduce(
            (total, entry) => total + entry.reviewedApprovalRequestsCount,
            0,
          ),
          approvedReviewedApprovalRequests: sortedAgents.reduce(
            (total, entry) =>
              total + entry.approvedReviewedApprovalRequestsCount,
            0,
          ),
          rejectedReviewedApprovalRequests: sortedAgents.reduce(
            (total, entry) =>
              total + entry.rejectedReviewedApprovalRequestsCount,
            0,
          ),
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/governance-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiGovernanceWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiGovernanceWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant governance workspace.',
      );
    }

    try {
      const agents = accessibleAgents
        .map((agent) => {
          const promptPack =
            this.getAiPromptRegistryEntryByAgentKeyUseCase.execute(agent.key);
          const approvalPolicies =
            this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key);
          const toolAccess =
            this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key);
          const toolAccessSummary = {
            allowedCount: toolAccess.filter((entry) => entry.accessLevel === 'allowed')
              .length,
            approvalRequiredCount: toolAccess.filter(
              (entry) => entry.accessLevel === 'approval_required',
            ).length,
            blockedCount: toolAccess.filter((entry) => entry.accessLevel === 'blocked')
              .length,
          };
          const executionModes = Array.from(
            new Set(
              toolAccess.map((entry) => entry.tool.executionBoundary.executionMode),
            ),
          ).sort();
          const blockedCapabilities = Array.from(
            new Set(
              toolAccess.flatMap(
                (entry) => entry.tool.executionBoundary.blockedCapabilities,
              ),
            ),
          ).sort();
          const reviewRequirementHighlights = Array.from(
            new Set(
              toolAccess.map(
                (entry) => entry.tool.executionBoundary.reviewRequirement,
              ),
            ),
          );
          const notes = [
            `Prompt pack ${promptPack.key}@${promptPack.version} anchors this agent in ${promptPack.mode} mode.`,
            `${approvalPolicies.length} approval policy rule(s) govern the current handoff posture.`,
            `${toolAccessSummary.allowedCount} allowed, ${toolAccessSummary.approvalRequiredCount} approval-required, ${toolAccessSummary.blockedCount} blocked tool(s).`,
            executionModes.includes('guarded_execution_planned')
              ? 'Guarded execution remains planned, not unlocked.'
              : 'All visible tools stay in suggestion-only mode.',
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            defaultMode: agent.defaultMode,
            promptPack: {
              key: promptPack.key,
              version: promptPack.version,
              mode: promptPack.mode,
              title: promptPack.title,
            },
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            toolAccessSummary,
            executionModes,
            blockedCapabilities,
            reviewRequirementHighlights,
            notes,
          };
        })
        .sort(
          (left, right) =>
            right.toolAccessSummary.blockedCount -
              left.toolAccessSummary.blockedCount ||
            right.toolAccessSummary.approvalRequiredCount -
              left.toolAccessSummary.approvalRequiredCount ||
            left.title.localeCompare(right.title),
        );

      return toAiGovernanceWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: agents.length,
          suggestionModeAgents: agents.filter(
            (entry) => entry.defaultMode === 'suggestion',
          ).length,
          guardedExecutionPlannedAgents: agents.filter((entry) =>
            entry.executionModes.includes('guarded_execution_planned'),
          ).length,
          approvalRequiredTools: agents.reduce(
            (total, entry) => total + entry.toolAccessSummary.approvalRequiredCount,
            0,
          ),
          blockedTools: agents.reduce(
            (total, entry) => total + entry.toolAccessSummary.blockedCount,
            0,
          ),
        },
        agents,
      });
    } catch (error) {
      if (error instanceof AiAgentNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/policy-simulation-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiPolicySimulationWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiPolicySimulationWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant policy simulation workspace.',
      );
    }

    try {
      const agents = accessibleAgents
        .map((agent) => {
          const approvalPolicies =
            this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key);
          const toolAccess =
            this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key);
          const currentToolAccessSummary = {
            allowedCount: toolAccess.filter((entry) => entry.accessLevel === 'allowed')
              .length,
            approvalRequiredCount: toolAccess.filter(
              (entry) => entry.accessLevel === 'approval_required',
            ).length,
            blockedCount: toolAccess.filter((entry) => entry.accessLevel === 'blocked')
              .length,
          };
          const promotedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode ===
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const stillBlockedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode !==
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const simulatedToolAccessSummary = {
            allowedCount: currentToolAccessSummary.allowedCount,
            approvalRequiredCount:
              currentToolAccessSummary.approvalRequiredCount +
              promotedToolKeys.length,
            blockedCount: stillBlockedToolKeys.length,
          };
          const simulationStatus: 'review_ready' | 'more_reviewable' | 'still_blocked' =
            stillBlockedToolKeys.length > 0
              ? 'still_blocked'
              : promotedToolKeys.length > 0
                ? 'more_reviewable'
                : 'review_ready';
          const notes = [
            promotedToolKeys.length > 0
              ? `${promotedToolKeys.length} blocked tool(s) could move to approval-required if guarded execution is unlocked safely.`
              : 'No blocked tool needs promotion in this simulation.',
            stillBlockedToolKeys.length > 0
              ? `${stillBlockedToolKeys.length} tool(s) would stay blocked even after the simulated policy shift.`
              : 'No tool stays blocked after the simulated policy shift.',
            simulatedToolAccessSummary.approvalRequiredCount > 0
              ? `Simulated review-first posture would leave ${simulatedToolAccessSummary.approvalRequiredCount} tool(s) behind explicit human approval.`
              : 'Simulated posture would not require explicit human approval for visible tools.',
            `The same ${approvalPolicies.length} approval policy rule(s) would keep governing this agent in the simulation.`,
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            defaultMode: agent.defaultMode,
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            currentToolAccessSummary,
            simulatedToolAccessSummary,
            simulationStatus,
            promotedToolKeys,
            stillBlockedToolKeys,
            notes,
          };
        })
        .sort(
          (left, right) =>
            right.promotedToolKeys.length - left.promotedToolKeys.length ||
            right.stillBlockedToolKeys.length - left.stillBlockedToolKeys.length ||
            left.title.localeCompare(right.title),
        );

      return toAiPolicySimulationWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: agents.length,
          agentsWithSimulationDelta: agents.filter(
            (entry) => entry.promotedToolKeys.length > 0,
          ).length,
          toolsPromotedToApprovalRequired: agents.reduce(
            (total, entry) => total + entry.promotedToolKeys.length,
            0,
          ),
          toolsStillBlocked: agents.reduce(
            (total, entry) => total + entry.stillBlockedToolKeys.length,
            0,
          ),
        },
        agents,
      });
    } catch (error) {
      if (error instanceof AiAgentNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/approval-design-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiApprovalDesignWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiApprovalDesignWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant approval design workspace.',
      );
    }

    try {
      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [approvalPolicies, toolAccess, approvalRequests, suggestionRuns] =
            await Promise.all([
              this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
            ]);

          const pendingApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'pending',
          ).length;
          const reviewableSuggestionRuns = suggestionRuns.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length;
          const promotedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode ===
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const stillBlockedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode !==
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const currentExpectedReviewLoad = {
            pendingApprovalRequests,
            reviewableSuggestionRuns,
            totalHumanReviewTouches:
              pendingApprovalRequests + reviewableSuggestionRuns,
          };
          const simulatedExpectedReviewLoad = {
            pendingApprovalRequests,
            reviewableSuggestionRuns,
            promotedToolReviewPoints: promotedToolKeys.length,
            totalHumanReviewTouches:
              pendingApprovalRequests +
              reviewableSuggestionRuns +
              promotedToolKeys.length,
          };
          const designStatus: 'unchanged' | 'heavier_review' | 'blocked_design' =
            stillBlockedToolKeys.length > 0
              ? 'blocked_design'
              : promotedToolKeys.length > 0
                ? 'heavier_review'
                : 'unchanged';
          const notes = [
            `Current review load combines ${pendingApprovalRequests} pending approval request(s) and ${reviewableSuggestionRuns} reviewable handoff(s).`,
            promotedToolKeys.length > 0
              ? `${promotedToolKeys.length} additional tool approval checkpoint(s) would appear in a review-first guarded execution design.`
              : 'No extra tool checkpoint would be added in this design scenario.',
            stillBlockedToolKeys.length > 0
              ? `${stillBlockedToolKeys.length} tool(s) would stay blocked and keep the design constrained.`
              : 'No extra blocked tool would constrain this approval design.',
            `The same ${approvalPolicies.length} approval policy rule(s) remain the governance base for this design scenario.`,
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            currentExpectedReviewLoad,
            simulatedExpectedReviewLoad,
            designStatus,
            promotedToolKeys,
            stillBlockedToolKeys,
            notes,
          };
        }),
      );

      const sortedAgents = agents.sort(
        (left, right) =>
          right.simulatedExpectedReviewLoad.totalHumanReviewTouches -
            left.simulatedExpectedReviewLoad.totalHumanReviewTouches ||
          right.promotedToolKeys.length - left.promotedToolKeys.length ||
          left.title.localeCompare(right.title),
      );

      const currentExpectedHumanReviews = sortedAgents.reduce(
        (total, entry) => total + entry.currentExpectedReviewLoad.totalHumanReviewTouches,
        0,
      );
      const simulatedExpectedHumanReviews = sortedAgents.reduce(
        (total, entry) =>
          total + entry.simulatedExpectedReviewLoad.totalHumanReviewTouches,
        0,
      );

      return toAiApprovalDesignWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: sortedAgents.length,
          agentsWithHeavierReview: sortedAgents.filter(
            (entry) => entry.designStatus === 'heavier_review',
          ).length,
          currentExpectedHumanReviews,
          simulatedExpectedHumanReviews,
          addedHumanReviewTouches:
            simulatedExpectedHumanReviews - currentExpectedHumanReviews,
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/approval-capacity-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiApprovalCapacityWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiApprovalCapacityWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant approval capacity workspace.',
      );
    }

    try {
      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [approvalPolicies, toolAccess, approvalRequests, suggestionRuns] =
            await Promise.all([
              this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
            ]);

          const pendingApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'pending',
          ).length;
          const reviewableSuggestionRuns = suggestionRuns.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length;
          const promotedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode ===
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const stillBlockedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode !==
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();

          const currentMinimumReviewsPerDay =
            pendingApprovalRequests + reviewableSuggestionRuns;
          const simulatedMinimumReviewsPerDay =
            currentMinimumReviewsPerDay + promotedToolKeys.length;
          const addedReviewsPerDay =
            simulatedMinimumReviewsPerDay - currentMinimumReviewsPerDay;

          const bottleneckReasons = [
            pendingApprovalRequests > 0
              ? `${pendingApprovalRequests} pending approval request(s) already consume reviewer attention.`
              : null,
            reviewableSuggestionRuns > 0
              ? `${reviewableSuggestionRuns} handoff(s) still need explicit review escalation.`
              : null,
            promotedToolKeys.length > 0
              ? `${promotedToolKeys.length} extra tool checkpoint(s) would enter the daily review path.`
              : null,
            stillBlockedToolKeys.length > 0
              ? `${stillBlockedToolKeys.length} tool(s) stay blocked, so capacity alone would not unlock this path.`
              : null,
          ].filter((entry): entry is string => entry !== null);

          const capacityStatus: 'stable' | 'watch' | 'overloaded' =
            stillBlockedToolKeys.length > 0 || simulatedMinimumReviewsPerDay >= 3
              ? 'overloaded'
              : addedReviewsPerDay > 0 || simulatedMinimumReviewsPerDay >= 2
                ? 'watch'
                : 'stable';

          const notes = [
            `Current posture suggests at least ${currentMinimumReviewsPerDay} human review touch(es) per day-equivalent.`,
            `Simulated review-first posture suggests ${simulatedMinimumReviewsPerDay} touch(es) per day-equivalent.`,
            addedReviewsPerDay > 0
              ? `That means ${addedReviewsPerDay} additional review touch(es) to staff for this agent.`
              : 'This scenario does not add extra review load for this agent.',
            `The same ${approvalPolicies.length} approval policy rule(s) still anchor reviewer governance here.`,
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            currentMinimumReviewsPerDay,
            simulatedMinimumReviewsPerDay,
            addedReviewsPerDay,
            capacityStatus,
            promotedToolKeys,
            stillBlockedToolKeys,
            bottleneckReasons,
            notes,
          };
        }),
      );

      const sortedAgents = agents.sort(
        (left, right) =>
          right.simulatedMinimumReviewsPerDay - left.simulatedMinimumReviewsPerDay ||
          right.addedReviewsPerDay - left.addedReviewsPerDay ||
          left.title.localeCompare(right.title),
      );

      return toAiApprovalCapacityWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: sortedAgents.length,
          agentsAtCapacityRisk: sortedAgents.filter(
            (entry) => entry.capacityStatus !== 'stable',
          ).length,
          currentMinimumReviewsPerDay: sortedAgents.reduce(
            (total, entry) => total + entry.currentMinimumReviewsPerDay,
            0,
          ),
          simulatedMinimumReviewsPerDay: sortedAgents.reduce(
            (total, entry) => total + entry.simulatedMinimumReviewsPerDay,
            0,
          ),
          addedReviewsPerDay: sortedAgents.reduce(
            (total, entry) => total + entry.addedReviewsPerDay,
            0,
          ),
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/approval-sla-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiApprovalSlaWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiApprovalSlaWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant approval SLA workspace.',
      );
    }

    try {
      const getSlaStatus = (
        touches: number,
        stillBlockedToolCount: number,
      ): 'on_track' | 'at_risk' | 'breached' => {
        if (stillBlockedToolCount > 0 || touches >= 3) {
          return 'breached';
        }

        if (touches >= 2) {
          return 'at_risk';
        }

        return 'on_track';
      };

      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [approvalPolicies, toolAccess, approvalRequests, suggestionRuns] =
            await Promise.all([
              this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
            ]);

          const pendingApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'pending',
          ).length;
          const reviewableSuggestionRuns = suggestionRuns.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length;
          const promotedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode ===
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const stillBlockedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode !==
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();

          const currentBacklogTouches =
            pendingApprovalRequests + reviewableSuggestionRuns;
          const simulatedBacklogTouches =
            currentBacklogTouches + promotedToolKeys.length;
          const currentEstimatedClearDays = Math.max(1, currentBacklogTouches);
          const simulatedEstimatedClearDays = Math.max(1, simulatedBacklogTouches);
          const currentSlaStatus = getSlaStatus(
            currentBacklogTouches,
            stillBlockedToolKeys.length,
          );
          const simulatedSlaStatus = getSlaStatus(
            simulatedBacklogTouches,
            stillBlockedToolKeys.length,
          );

          const notes = [
            `Current backlog implies roughly ${currentEstimatedClearDays} day-equivalent(s) to clear if one reviewer-touch per day is available for this agent.`,
            `Simulated review-first backlog implies roughly ${simulatedEstimatedClearDays} day-equivalent(s) to clear under the same baseline.`,
            promotedToolKeys.length > 0
              ? `${promotedToolKeys.length} promoted tool checkpoint(s) would push the same-day SLA closer to risk.`
              : 'No promoted tool checkpoint changes the same-day SLA in this scenario.',
            stillBlockedToolKeys.length > 0
              ? `${stillBlockedToolKeys.length} blocked tool(s) mean SLA risk is not only about capacity yet.`
              : 'No blocked tool is adding extra SLA uncertainty in this scenario.',
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            pendingApprovalRequests,
            reviewableSuggestionRuns,
            promotedToolKeys,
            stillBlockedToolKeys,
            currentEstimatedClearDays,
            simulatedEstimatedClearDays,
            currentSlaStatus,
            simulatedSlaStatus,
            notes,
          };
        }),
      );

      const statusWeight = (status: 'on_track' | 'at_risk' | 'breached') =>
        status === 'breached' ? 3 : status === 'at_risk' ? 2 : 1;
      const sortedAgents = agents.sort(
        (left, right) =>
          statusWeight(right.simulatedSlaStatus) -
            statusWeight(left.simulatedSlaStatus) ||
          right.simulatedEstimatedClearDays - left.simulatedEstimatedClearDays ||
          left.title.localeCompare(right.title),
      );

      const currentBacklogTouches = sortedAgents.reduce(
        (total, entry) =>
          total + entry.pendingApprovalRequests + entry.reviewableSuggestionRuns,
        0,
      );
      const simulatedBacklogTouches = sortedAgents.reduce(
        (total, entry) =>
          total +
          entry.pendingApprovalRequests +
          entry.reviewableSuggestionRuns +
          entry.promotedToolKeys.length,
        0,
      );

      return toAiApprovalSlaWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: sortedAgents.length,
          agentsAtRisk: sortedAgents.filter(
            (entry) => entry.simulatedSlaStatus === 'at_risk',
          ).length,
          agentsBreached: sortedAgents.filter(
            (entry) => entry.simulatedSlaStatus === 'breached',
          ).length,
          currentBacklogTouches,
          simulatedBacklogTouches,
          addedBacklogTouches:
            simulatedBacklogTouches - currentBacklogTouches,
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/approval-staffing-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiApprovalStaffingWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiApprovalStaffingWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant approval staffing workspace.',
      );
    }

    try {
      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [approvalPolicies, toolAccess, approvalRequests, suggestionRuns] =
            await Promise.all([
              this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
            ]);

          const pendingApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'pending',
          ).length;
          const reviewableSuggestionRuns = suggestionRuns.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length;
          const promotedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode ===
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const stillBlockedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode !==
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();

          const currentRequiredReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests + reviewableSuggestionRuns,
          );
          const simulatedRequiredReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests +
              reviewableSuggestionRuns +
              promotedToolKeys.length,
          );
          const addedReviewerEquivalents =
            simulatedRequiredReviewerEquivalents -
            currentRequiredReviewerEquivalents;

          const staffingStatus: 'sufficient' | 'watch' | 'insufficient' =
            stillBlockedToolKeys.length > 0 ||
            simulatedRequiredReviewerEquivalents >= 3
              ? 'insufficient'
              : addedReviewerEquivalents > 0 ||
                  simulatedRequiredReviewerEquivalents >= 2
                ? 'watch'
                : 'sufficient';

          const staffingReasons = [
            pendingApprovalRequests > 0
              ? `${pendingApprovalRequests} pending approval request(s) already need reviewer capacity.`
              : null,
            reviewableSuggestionRuns > 0
              ? `${reviewableSuggestionRuns} handoff(s) would still need manual review escalation.`
              : null,
            promotedToolKeys.length > 0
              ? `${promotedToolKeys.length} promoted tool checkpoint(s) would require additional reviewer coverage.`
              : null,
            stillBlockedToolKeys.length > 0
              ? `${stillBlockedToolKeys.length} tool(s) stay blocked, so staffing alone would not unlock the path.`
              : null,
          ].filter((entry): entry is string => entry !== null);

          const notes = [
            `Current posture needs at least ${currentRequiredReviewerEquivalents} reviewer-equivalent(s) for same-day handling under this simplified model.`,
            `Simulated review-first posture needs ${simulatedRequiredReviewerEquivalents} reviewer-equivalent(s) under the same model.`,
            addedReviewerEquivalents > 0
              ? `That means ${addedReviewerEquivalents} extra reviewer-equivalent(s) to staff for this agent.`
              : 'This scenario does not demand additional reviewer-equivalents for this agent.',
            `The same ${approvalPolicies.length} approval policy rule(s) still define who can review and gate outcomes here.`,
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            currentRequiredReviewerEquivalents,
            simulatedRequiredReviewerEquivalents,
            addedReviewerEquivalents,
            staffingStatus,
            promotedToolKeys,
            stillBlockedToolKeys,
            staffingReasons,
            notes,
          };
        }),
      );

      const sortedAgents = agents.sort(
        (left, right) =>
          right.simulatedRequiredReviewerEquivalents -
            left.simulatedRequiredReviewerEquivalents ||
          right.addedReviewerEquivalents - left.addedReviewerEquivalents ||
          left.title.localeCompare(right.title),
      );

      return toAiApprovalStaffingWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: sortedAgents.length,
          agentsNeedingMoreCoverage: sortedAgents.filter(
            (entry) => entry.staffingStatus !== 'sufficient',
          ).length,
          currentRequiredReviewerEquivalents: sortedAgents.reduce(
            (total, entry) => total + entry.currentRequiredReviewerEquivalents,
            0,
          ),
          simulatedRequiredReviewerEquivalents: sortedAgents.reduce(
            (total, entry) =>
              total + entry.simulatedRequiredReviewerEquivalents,
            0,
          ),
          addedReviewerEquivalents: sortedAgents.reduce(
            (total, entry) => total + entry.addedReviewerEquivalents,
            0,
          ),
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/approval-staffing-plan-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiApprovalStaffingPlanWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiApprovalStaffingPlanWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant approval staffing plan workspace.',
      );
    }

    try {
      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [approvalPolicies, toolAccess, approvalRequests, suggestionRuns] =
            await Promise.all([
              this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
            ]);

          const pendingApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'pending',
          ).length;
          const reviewableSuggestionRuns = suggestionRuns.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length;
          const promotedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode ===
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const stillBlockedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode !==
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();

          const currentRequiredReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests + reviewableSuggestionRuns,
          );
          const simulatedRequiredReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests +
              reviewableSuggestionRuns +
              promotedToolKeys.length,
          );
          const recommendedReviewerEquivalents =
            simulatedRequiredReviewerEquivalents;
          const additionalReviewerEquivalentsToAssign = Math.max(
            0,
            recommendedReviewerEquivalents -
              currentRequiredReviewerEquivalents,
          );
          const planStatus: 'maintain' | 'increase' | 'blocked' =
            stillBlockedToolKeys.length > 0
              ? 'blocked'
              : additionalReviewerEquivalentsToAssign > 0
                ? 'increase'
                : 'maintain';

          const planActions = [
            additionalReviewerEquivalentsToAssign > 0
              ? `Add ${additionalReviewerEquivalentsToAssign} reviewer-equivalent(s) before opening the review-first path.`
              : 'Maintain current reviewer coverage for this agent.',
            promotedToolKeys.length > 0
              ? `Stage explicit review coverage for ${promotedToolKeys.join(', ')} before enabling the new checkpoint.`
              : 'No extra promoted tool checkpoint needs dedicated staging.',
            stillBlockedToolKeys.length > 0
              ? `Keep ${stillBlockedToolKeys.join(', ')} blocked until the operating model is redesigned.`
              : 'No blocked tool forces a separate staffing hold right now.',
          ];
          const notes = [
            `Current coverage baseline is ${currentRequiredReviewerEquivalents} reviewer-equivalent(s).`,
            `Recommended coverage for the simulated target posture is ${recommendedReviewerEquivalents} reviewer-equivalent(s).`,
            additionalReviewerEquivalentsToAssign > 0
              ? `This plan adds ${additionalReviewerEquivalentsToAssign} reviewer-equivalent(s) over the current baseline.`
              : 'This plan keeps reviewer coverage flat versus the current baseline.',
            `The same ${approvalPolicies.length} approval policy rule(s) still govern who can perform the reviews in this plan.`,
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            currentRequiredReviewerEquivalents,
            simulatedRequiredReviewerEquivalents,
            recommendedReviewerEquivalents,
            additionalReviewerEquivalentsToAssign,
            priorityRank: 0,
            planStatus,
            promotedToolKeys,
            stillBlockedToolKeys,
            planActions,
            notes,
          };
        }),
      );

      const sortedAgents = agents
        .sort(
          (left, right) =>
            right.additionalReviewerEquivalentsToAssign -
              left.additionalReviewerEquivalentsToAssign ||
            right.recommendedReviewerEquivalents -
              left.recommendedReviewerEquivalents ||
            right.stillBlockedToolKeys.length - left.stillBlockedToolKeys.length ||
            left.title.localeCompare(right.title),
        )
        .map((entry, index) => ({
          ...entry,
          priorityRank: index + 1,
        }));

      return toAiApprovalStaffingPlanWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: sortedAgents.length,
          agentsRequiringIncrease: sortedAgents.filter(
            (entry) => entry.planStatus === 'increase',
          ).length,
          totalRecommendedReviewerEquivalents: sortedAgents.reduce(
            (total, entry) => total + entry.recommendedReviewerEquivalents,
            0,
          ),
          totalAdditionalReviewerEquivalents: sortedAgents.reduce(
            (total, entry) =>
              total + entry.additionalReviewerEquivalentsToAssign,
            0,
          ),
          highestPriorityAgents: sortedAgents.filter(
            (entry) => entry.additionalReviewerEquivalentsToAssign > 0,
          ).length,
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/approval-rollout-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiApprovalRolloutWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiApprovalRolloutWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant approval rollout workspace.',
      );
    }

    try {
      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [approvalPolicies, toolAccess, approvalRequests, suggestionRuns] =
            await Promise.all([
              this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
            ]);

          const pendingApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'pending',
          ).length;
          const reviewableSuggestionRuns = suggestionRuns.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length;
          const promotedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode ===
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const stillBlockedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode !==
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();

          const currentRequiredReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests + reviewableSuggestionRuns,
          );
          const recommendedReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests +
              reviewableSuggestionRuns +
              promotedToolKeys.length,
          );
          const additionalReviewerEquivalentsToAssign = Math.max(
            0,
            recommendedReviewerEquivalents -
              currentRequiredReviewerEquivalents,
          );

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            currentRequiredReviewerEquivalents,
            recommendedReviewerEquivalents,
            additionalReviewerEquivalentsToAssign,
            priorityRank: 0,
            promotedToolKeys,
            stillBlockedToolKeys,
          };
        }),
      );

      const sortedAgents = agents
        .sort(
          (left, right) =>
            right.additionalReviewerEquivalentsToAssign -
              left.additionalReviewerEquivalentsToAssign ||
            right.recommendedReviewerEquivalents -
              left.recommendedReviewerEquivalents ||
            right.stillBlockedToolKeys.length - left.stillBlockedToolKeys.length ||
            left.title.localeCompare(right.title),
        )
        .map((entry, index) => {
          const rolloutPhase: 'phase_1' | 'phase_2' | 'hold' =
            entry.stillBlockedToolKeys.length > 0
              ? 'hold'
              : entry.additionalReviewerEquivalentsToAssign > 0
                ? 'phase_1'
                : 'phase_2';
          const rolloutStatus:
            | 'increase_then_rollout'
            | 'safe_to_rollout'
            | 'blocked' =
            entry.stillBlockedToolKeys.length > 0
              ? 'blocked'
              : entry.additionalReviewerEquivalentsToAssign > 0
                ? 'increase_then_rollout'
                : 'safe_to_rollout';
          const rolloutActions = [
            rolloutStatus === 'increase_then_rollout'
              ? `Assign ${entry.additionalReviewerEquivalentsToAssign} additional reviewer-equivalent(s), then open this agent in phase 1.`
              : rolloutStatus === 'safe_to_rollout'
                ? 'Keep current reviewer coverage and schedule this agent for phase 2 rollout.'
                : `Keep ${entry.stillBlockedToolKeys.join(', ')} blocked until operating constraints are redesigned.`,
            entry.promotedToolKeys.length > 0
              ? `Gate ${entry.promotedToolKeys.join(', ')} behind explicit review before rollout.`
              : 'No promoted tool checkpoint needs extra rollout gating.',
            `Use policy ${entry.approvalPolicyKeys.join(', ')} as the human gate throughout rollout.`,
          ];
          const notes = [
            `Current reviewer baseline is ${entry.currentRequiredReviewerEquivalents}, while the rollout target asks for ${entry.recommendedReviewerEquivalents}.`,
            entry.additionalReviewerEquivalentsToAssign > 0
              ? `This rollout phase adds ${entry.additionalReviewerEquivalentsToAssign} reviewer-equivalent(s) before activation.`
              : 'This rollout phase can proceed without adding reviewer-equivalents first.',
            entry.stillBlockedToolKeys.length > 0
              ? 'A blocked tool path still prevents safe rollout even if staffing is available.'
              : 'No blocked tool path prevents the rollout once the assigned coverage is in place.',
          ];

          return {
            ...entry,
            priorityRank: index + 1,
            rolloutPhase,
            rolloutStatus,
            rolloutActions,
            notes,
          };
        });

      return toAiApprovalRolloutWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: sortedAgents.length,
          phase1Agents: sortedAgents.filter(
            (entry) => entry.rolloutPhase === 'phase_1',
          ).length,
          phase2Agents: sortedAgents.filter(
            (entry) => entry.rolloutPhase === 'phase_2',
          ).length,
          holdAgents: sortedAgents.filter(
            (entry) => entry.rolloutPhase === 'hold',
          ).length,
          totalAdditionalReviewerEquivalents: sortedAgents.reduce(
            (total, entry) =>
              total + entry.additionalReviewerEquivalentsToAssign,
            0,
          ),
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/approval-readiness-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiApprovalReadinessWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiApprovalReadinessWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant approval readiness workspace.',
      );
    }

    try {
      const getSlaStatus = (
        touches: number,
        stillBlockedToolCount: number,
      ): 'on_track' | 'at_risk' | 'breached' => {
        if (stillBlockedToolCount > 0 || touches >= 3) {
          return 'breached';
        }

        if (touches >= 2) {
          return 'at_risk';
        }

        return 'on_track';
      };

      const readinessWeight = (
        status: 'ready_now' | 'needs_coverage' | 'blocked',
      ): number => {
        switch (status) {
          case 'blocked':
            return 3;
          case 'needs_coverage':
            return 2;
          case 'ready_now':
          default:
            return 1;
        }
      };

      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [approvalPolicies, toolAccess, approvalRequests, suggestionRuns] =
            await Promise.all([
              this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
            ]);

          const pendingApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'pending',
          ).length;
          const reviewableSuggestionRuns = suggestionRuns.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length;
          const promotedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode ===
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const stillBlockedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode !==
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();

          const currentRequiredReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests + reviewableSuggestionRuns,
          );
          const recommendedReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests +
              reviewableSuggestionRuns +
              promotedToolKeys.length,
          );
          const additionalReviewerEquivalentsToAssign = Math.max(
            0,
            recommendedReviewerEquivalents -
              currentRequiredReviewerEquivalents,
          );
          const currentBacklogTouches =
            pendingApprovalRequests + reviewableSuggestionRuns;
          const simulatedBacklogTouches =
            currentBacklogTouches + promotedToolKeys.length;
          const currentSlaStatus = getSlaStatus(
            currentBacklogTouches,
            stillBlockedToolKeys.length,
          );
          const simulatedSlaStatus = getSlaStatus(
            simulatedBacklogTouches,
            stillBlockedToolKeys.length,
          );
          const rolloutPhase: 'phase_1' | 'phase_2' | 'hold' =
            stillBlockedToolKeys.length > 0
              ? 'hold'
              : additionalReviewerEquivalentsToAssign > 0
                ? 'phase_1'
                : 'phase_2';
          const readinessStatus: 'ready_now' | 'needs_coverage' | 'blocked' =
            stillBlockedToolKeys.length > 0
              ? 'blocked'
              : additionalReviewerEquivalentsToAssign > 0 ||
                  simulatedSlaStatus !== 'on_track'
                ? 'needs_coverage'
                : 'ready_now';

          const readinessReasons = [
            pendingApprovalRequests > 0
              ? `${pendingApprovalRequests} pending approval request(s) already consume reviewer capacity.`
              : 'No pending approval request is consuming reviewer capacity right now.',
            reviewableSuggestionRuns > 0
              ? `${reviewableSuggestionRuns} suggestion run(s) still need an explicit review request.`
              : 'No suggestion run is waiting for an explicit review request right now.',
            promotedToolKeys.length > 0
              ? `${promotedToolKeys.length} guarded execution checkpoint(s) would move into the review path.`
              : 'No extra guarded execution checkpoint would widen the review path.',
            stillBlockedToolKeys.length > 0
              ? `${stillBlockedToolKeys.length} tool(s) still stay blocked, so the rollout is not operationally ready yet.`
              : 'No blocked tool is preventing operational readiness in this scenario.',
          ];

          const nextStep =
            readinessStatus === 'blocked'
              ? 'Keep blocked paths closed until the operating model is redesigned.'
              : readinessStatus === 'needs_coverage'
                ? `Assign ${additionalReviewerEquivalentsToAssign} reviewer-equivalent(s) before opening review-first rollout.`
                : 'Safe to open this agent in the next rollout window with current coverage.';

          const notes = [
            `Current reviewer baseline is ${currentRequiredReviewerEquivalents}, while the readiness target asks for ${recommendedReviewerEquivalents}.`,
            `Current SLA reads ${currentSlaStatus}, and the simulated review-first SLA reads ${simulatedSlaStatus}.`,
            `Rollout sequencing places this agent in ${rolloutPhase}.`,
            `The same ${approvalPolicies.length} approval policy rule(s) remain the human gate for this readiness call.`,
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            currentRequiredReviewerEquivalents,
            recommendedReviewerEquivalents,
            additionalReviewerEquivalentsToAssign,
            currentSlaStatus,
            simulatedSlaStatus,
            rolloutPhase,
            readinessStatus,
            readinessReasons,
            nextStep,
            notes,
          };
        }),
      );

      const sortedAgents = agents.sort(
        (left, right) =>
          readinessWeight(right.readinessStatus) -
            readinessWeight(left.readinessStatus) ||
          right.additionalReviewerEquivalentsToAssign -
            left.additionalReviewerEquivalentsToAssign ||
          left.title.localeCompare(right.title),
      );

      return toAiApprovalReadinessWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: sortedAgents.length,
          readyNowAgents: sortedAgents.filter(
            (entry) => entry.readinessStatus === 'ready_now',
          ).length,
          needsCoverageAgents: sortedAgents.filter(
            (entry) => entry.readinessStatus === 'needs_coverage',
          ).length,
          blockedAgents: sortedAgents.filter(
            (entry) => entry.readinessStatus === 'blocked',
          ).length,
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/approval-launch-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiApprovalLaunchWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiApprovalLaunchWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant approval launch workspace.',
      );
    }

    try {
      const getSlaStatus = (
        touches: number,
        stillBlockedToolCount: number,
      ): 'on_track' | 'at_risk' | 'breached' => {
        if (stillBlockedToolCount > 0 || touches >= 3) {
          return 'breached';
        }

        if (touches >= 2) {
          return 'at_risk';
        }

        return 'on_track';
      };

      const launchWeight = (
        status: 'launch_now' | 'pilot_after_coverage' | 'hold',
      ): number => {
        switch (status) {
          case 'launch_now':
            return 3;
          case 'pilot_after_coverage':
            return 2;
          case 'hold':
          default:
            return 1;
        }
      };

      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [approvalPolicies, toolAccess, approvalRequests, suggestionRuns] =
            await Promise.all([
              this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
            ]);

          const pendingApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'pending',
          ).length;
          const reviewableSuggestionRuns = suggestionRuns.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length;
          const promotedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode ===
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const stillBlockedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode !==
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();

          const currentRequiredReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests + reviewableSuggestionRuns,
          );
          const recommendedReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests +
              reviewableSuggestionRuns +
              promotedToolKeys.length,
          );
          const additionalReviewerEquivalentsToAssign = Math.max(
            0,
            recommendedReviewerEquivalents -
              currentRequiredReviewerEquivalents,
          );
          const simulatedBacklogTouches =
            pendingApprovalRequests +
            reviewableSuggestionRuns +
            promotedToolKeys.length;
          const simulatedSlaStatus = getSlaStatus(
            simulatedBacklogTouches,
            stillBlockedToolKeys.length,
          );
          const rolloutPhase: 'phase_1' | 'phase_2' | 'hold' =
            stillBlockedToolKeys.length > 0
              ? 'hold'
              : additionalReviewerEquivalentsToAssign > 0
                ? 'phase_1'
                : 'phase_2';
          const launchStatus: 'launch_now' | 'pilot_after_coverage' | 'hold' =
            stillBlockedToolKeys.length > 0
              ? 'hold'
              : additionalReviewerEquivalentsToAssign > 0 ||
                  simulatedSlaStatus !== 'on_track'
                ? 'pilot_after_coverage'
                : 'launch_now';
          const launchWindow: 'current_window' | 'next_window' | 'defer' =
            launchStatus === 'launch_now'
              ? 'current_window'
              : launchStatus === 'pilot_after_coverage'
                ? 'next_window'
                : 'defer';

          const recommendedAction =
            launchStatus === 'launch_now'
              ? 'Open this agent in the current launch window with the present reviewer coverage.'
              : launchStatus === 'pilot_after_coverage'
                ? `Fill ${additionalReviewerEquivalentsToAssign} reviewer-equivalent(s) and re-check SLA before the next launch window.`
                : 'Keep this agent out of launch scope until blocked paths are redesigned.';

          const launchChecklist = [
            launchStatus === 'launch_now'
              ? 'Current reviewer coverage already matches the simulated launch target.'
              : `Reviewer coverage still needs ${additionalReviewerEquivalentsToAssign} additional reviewer-equivalent(s).`,
            simulatedSlaStatus === 'on_track'
              ? 'Simulated same-day SLA remains on track.'
              : `Simulated same-day SLA is ${simulatedSlaStatus} and should be stabilized before launch.`,
            promotedToolKeys.length > 0
              ? `Launch path would introduce ${promotedToolKeys.length} guarded checkpoint(s): ${promotedToolKeys.join(', ')}.`
              : 'Launch path does not introduce new guarded checkpoints.',
            stillBlockedToolKeys.length > 0
              ? `Blocked tools still outside launch scope: ${stillBlockedToolKeys.join(', ')}.`
              : 'No blocked tool is still outside the launch design.',
          ];

          const notes = [
            `Rollout phase currently reads ${rolloutPhase}.`,
            `Recommended coverage is ${recommendedReviewerEquivalents} reviewer-equivalent(s) versus ${currentRequiredReviewerEquivalents} today.`,
            `Approval gate stays under ${approvalPolicies.map((entry) => entry.policyKey).join(', ')}.`,
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            currentRequiredReviewerEquivalents,
            recommendedReviewerEquivalents,
            additionalReviewerEquivalentsToAssign,
            rolloutPhase,
            simulatedSlaStatus,
            launchStatus,
            launchWindow,
            recommendedAction,
            launchChecklist,
            notes,
          };
        }),
      );

      const sortedAgents = agents.sort(
        (left, right) =>
          launchWeight(right.launchStatus) - launchWeight(left.launchStatus) ||
          left.additionalReviewerEquivalentsToAssign -
            right.additionalReviewerEquivalentsToAssign ||
          left.title.localeCompare(right.title),
      );

      return toAiApprovalLaunchWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: sortedAgents.length,
          launchNowAgents: sortedAgents.filter(
            (entry) => entry.launchStatus === 'launch_now',
          ).length,
          pilotAfterCoverageAgents: sortedAgents.filter(
            (entry) => entry.launchStatus === 'pilot_after_coverage',
          ).length,
          holdAgents: sortedAgents.filter(
            (entry) => entry.launchStatus === 'hold',
          ).length,
          totalCoverageGap: sortedAgents.reduce(
            (total, entry) =>
              total + entry.additionalReviewerEquivalentsToAssign,
            0,
          ),
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/guarded-execution-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiGuardedExecutionWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiGuardedExecutionWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant guarded execution workspace.',
      );
    }

    try {
      const getSlaStatus = (
        touches: number,
        stillBlockedToolCount: number,
      ): 'on_track' | 'at_risk' | 'breached' => {
        if (stillBlockedToolCount > 0 || touches >= 3) {
          return 'breached';
        }

        if (touches >= 2) {
          return 'at_risk';
        }

        return 'on_track';
      };

      const statusWeight = (
        status:
          | 'pilot_candidate'
          | 'needs_launch_readiness'
          | 'suggestion_only',
      ): number => {
        switch (status) {
          case 'pilot_candidate':
            return 3;
          case 'needs_launch_readiness':
            return 2;
          case 'suggestion_only':
          default:
            return 1;
        }
      };

      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [approvalPolicies, toolAccess, approvalRequests, suggestionRuns] =
            await Promise.all([
              this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
            ]);

          const pendingApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'pending',
          ).length;
          const reviewableSuggestionRuns = suggestionRuns.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length;
          const executionCandidateToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode ===
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const approvalRequiredToolKeys = toolAccess
            .filter((entry) => entry.accessLevel === 'approval_required')
            .map((entry) => entry.tool.key)
            .sort();
          const stillBlockedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode !==
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();

          const currentRequiredReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests + reviewableSuggestionRuns,
          );
          const recommendedReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests +
              reviewableSuggestionRuns +
              executionCandidateToolKeys.length,
          );
          const additionalReviewerEquivalentsToAssign = Math.max(
            0,
            recommendedReviewerEquivalents -
              currentRequiredReviewerEquivalents,
          );
          const simulatedBacklogTouches =
            pendingApprovalRequests +
            reviewableSuggestionRuns +
            executionCandidateToolKeys.length;
          const simulatedSlaStatus = getSlaStatus(
            simulatedBacklogTouches,
            stillBlockedToolKeys.length,
          );
          const rolloutPhase: 'phase_1' | 'phase_2' | 'hold' =
            stillBlockedToolKeys.length > 0
              ? 'hold'
              : additionalReviewerEquivalentsToAssign > 0
                ? 'phase_1'
                : 'phase_2';

          const guardedExecutionStatus:
            | 'pilot_candidate'
            | 'needs_launch_readiness'
            | 'suggestion_only' =
            executionCandidateToolKeys.length === 0
              ? 'suggestion_only'
              : additionalReviewerEquivalentsToAssign > 0 ||
                  simulatedSlaStatus !== 'on_track'
                ? 'needs_launch_readiness'
                : 'pilot_candidate';

          const guardrailChecklist = [
            executionCandidateToolKeys.length > 0
              ? `${executionCandidateToolKeys.length} execution candidate tool(s) are planned for guarded mode.`
              : 'No execution candidate tool is planned for guarded mode yet.',
            approvalPolicies.length > 0
              ? `${approvalPolicies.length} approval policy rule(s) already exist for human gating.`
              : 'No explicit approval policy is available yet.',
            pendingApprovalRequests > 0
              ? `${pendingApprovalRequests} pending approval request(s) still compete for reviewer attention.`
              : 'No pending approval request is currently competing for reviewer attention.',
            simulatedSlaStatus === 'on_track'
              ? 'Simulated review-first SLA remains on track under the current guardrails.'
              : `Simulated review-first SLA is ${simulatedSlaStatus} and should be stabilized first.`,
          ];

          const nextStep =
            guardedExecutionStatus === 'pilot_candidate'
              ? 'Safe to design a narrow guarded-execution pilot for this agent without leaving the current approval model.'
              : guardedExecutionStatus === 'needs_launch_readiness'
                ? 'Finish launch readiness, reviewer coverage, and SLA stabilization before introducing a guarded-execution pilot.'
                : 'Keep this agent in suggestion mode until at least one guarded-execution candidate tool exists.';

          const notes = [
            `Current mode stays ${agent.defaultMode}.`,
            `Rollout phase reads ${rolloutPhase}, with ${additionalReviewerEquivalentsToAssign} extra reviewer-equivalent(s) still needed.`,
            executionCandidateToolKeys.length > 0
              ? `Candidate tools for guarded execution: ${executionCandidateToolKeys.join(', ')}.`
              : 'This agent currently has no candidate tool for guarded execution.',
            approvalRequiredToolKeys.length > 0
              ? `Already approval-required today: ${approvalRequiredToolKeys.join(', ')}.`
              : 'No tool is currently exposed as approval-required.',
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            currentMode: agent.defaultMode,
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            executionCandidateToolKeys,
            approvalRequiredToolKeys,
            pendingApprovalRequests,
            reviewableSuggestionRuns,
            rolloutPhase,
            guardedExecutionStatus,
            guardrailChecklist,
            nextStep,
            notes,
          };
        }),
      );

      const sortedAgents = agents.sort(
        (left, right) =>
          statusWeight(right.guardedExecutionStatus) -
            statusWeight(left.guardedExecutionStatus) ||
          right.executionCandidateToolKeys.length -
            left.executionCandidateToolKeys.length ||
          left.title.localeCompare(right.title),
      );

      return toAiGuardedExecutionWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: sortedAgents.length,
          pilotCandidateAgents: sortedAgents.filter(
            (entry) => entry.guardedExecutionStatus === 'pilot_candidate',
          ).length,
          needsLaunchReadinessAgents: sortedAgents.filter(
            (entry) => entry.guardedExecutionStatus === 'needs_launch_readiness',
          ).length,
          suggestionOnlyAgents: sortedAgents.filter(
            (entry) => entry.guardedExecutionStatus === 'suggestion_only',
          ).length,
          executionCandidateTools: sortedAgents.reduce(
            (total, entry) => total + entry.executionCandidateToolKeys.length,
            0,
          ),
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/guarded-execution-pilot-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiGuardedExecutionPilotWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiGuardedExecutionPilotWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant guarded execution pilot workspace.',
      );
    }

    try {
      const getSlaStatus = (
        touches: number,
        stillBlockedToolCount: number,
      ): 'on_track' | 'at_risk' | 'breached' => {
        if (stillBlockedToolCount > 0 || touches >= 3) {
          return 'breached';
        }

        if (touches >= 2) {
          return 'at_risk';
        }

        return 'on_track';
      };

      const statusWeight = (
        status:
          | 'ready_for_pilot'
          | 'needs_operational_backing'
          | 'no_candidate',
      ): number => {
        switch (status) {
          case 'ready_for_pilot':
            return 3;
          case 'needs_operational_backing':
            return 2;
          case 'no_candidate':
          default:
            return 1;
        }
      };

      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [approvalPolicies, toolAccess, approvalRequests, suggestionRuns] =
            await Promise.all([
              this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
            ]);

          const pendingApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'pending',
          ).length;
          const reviewableSuggestionRuns = suggestionRuns.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length;
          const executionCandidateToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode ===
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const stillBlockedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode !==
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();

          const currentRequiredReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests + reviewableSuggestionRuns,
          );
          const recommendedReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests +
              reviewableSuggestionRuns +
              executionCandidateToolKeys.length,
          );
          const additionalReviewerEquivalentsToAssign = Math.max(
            0,
            recommendedReviewerEquivalents -
              currentRequiredReviewerEquivalents,
          );
          const simulatedBacklogTouches =
            pendingApprovalRequests +
            reviewableSuggestionRuns +
            executionCandidateToolKeys.length;
          const simulatedSlaStatus = getSlaStatus(
            simulatedBacklogTouches,
            stillBlockedToolKeys.length,
          );
          const rolloutPhase: 'phase_1' | 'phase_2' | 'hold' =
            stillBlockedToolKeys.length > 0
              ? 'hold'
              : additionalReviewerEquivalentsToAssign > 0
                ? 'phase_1'
                : 'phase_2';

          const pilotStatus:
            | 'ready_for_pilot'
            | 'needs_operational_backing'
            | 'no_candidate' =
            executionCandidateToolKeys.length === 0
              ? 'no_candidate'
              : additionalReviewerEquivalentsToAssign > 0 ||
                  simulatedSlaStatus !== 'on_track'
                ? 'needs_operational_backing'
                : 'ready_for_pilot';
          const pilotType:
            | 'human_gate_then_execute'
            | 'shadow_review'
            | 'not_available' =
            pilotStatus === 'ready_for_pilot'
              ? 'human_gate_then_execute'
              : pilotStatus === 'needs_operational_backing'
                ? 'shadow_review'
                : 'not_available';

          const candidateToolKey = executionCandidateToolKeys[0] ?? null;
          const pilotPreconditions = [
            candidateToolKey
              ? `Candidate tool selected for the first pilot: ${candidateToolKey}.`
              : 'No candidate tool is available for a guarded-execution pilot.',
            approvalPolicies.length > 0
              ? `${approvalPolicies.length} approval policy rule(s) are already available to gate the pilot.`
              : 'No approval policy exists yet to gate a pilot.',
            additionalReviewerEquivalentsToAssign > 0
              ? `${additionalReviewerEquivalentsToAssign} reviewer-equivalent(s) still need to be staffed before any execute path is opened.`
              : 'Reviewer coverage is already aligned with the simulated pilot posture.',
            simulatedSlaStatus === 'on_track'
              ? 'Simulated same-day SLA stays on track for this pilot shape.'
              : `Simulated same-day SLA is ${simulatedSlaStatus} for this pilot shape.`,
          ];
          const pilotGuardrails = [
            pilotType === 'human_gate_then_execute'
              ? 'Keep the first pilot behind an explicit named approver before any state mutation happens.'
              : pilotType === 'shadow_review'
                ? 'Start with shadow-review only and keep real mutations disabled.'
                : 'No guarded execution path should be exposed yet.',
            pendingApprovalRequests > 0
              ? `${pendingApprovalRequests} pending approval request(s) should be drained or ring-fenced before pilot start.`
              : 'No pending approval backlog needs ring-fencing before pilot start.',
            reviewableSuggestionRuns > 0
              ? `${reviewableSuggestionRuns} existing suggestion handoff(s) still need explicit human routing discipline.`
              : 'No reviewable handoff is still waiting for explicit routing discipline.',
          ];

          const recommendedPilotScope =
            pilotType === 'human_gate_then_execute'
              ? `Limit the first pilot to ${candidateToolKey} under one explicit human gate and one narrow operating lane.`
              : pilotType === 'shadow_review'
                ? candidateToolKey
                  ? `Use ${candidateToolKey} only as a shadow-review intent until reviewer coverage and SLA are stable.`
                  : 'No pilot scope should be proposed while the agent has no guarded-execution candidate.'
                : 'Keep this agent in suggestion-only scope.';

          const nextStep =
            pilotStatus === 'ready_for_pilot'
              ? 'Draft the first guarded-execution pilot runbook and choose the named human gate for this lane.'
              : pilotStatus === 'needs_operational_backing'
                ? 'Close reviewer-capacity and SLA gaps before converting this lane from shadow review into execution.'
                : 'Wait until a concrete guarded-execution candidate tool is introduced for this agent.';

          const notes = [
            `Current mode remains ${agent.defaultMode}.`,
            `Rollout phase reads ${rolloutPhase}.`,
            candidateToolKey
              ? `First pilot candidate tool is ${candidateToolKey}.`
              : 'There is no first pilot candidate tool yet.',
            `Approval gate stays under ${approvalPolicies.map((entry) => entry.policyKey).join(', ')}.`,
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            currentMode: agent.defaultMode,
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            candidateToolKey,
            rolloutPhase,
            simulatedSlaStatus,
            pilotStatus,
            pilotType,
            additionalReviewerEquivalentsToAssign,
            pilotPreconditions,
            pilotGuardrails,
            recommendedPilotScope,
            nextStep,
            notes,
          };
        }),
      );

      const sortedAgents = agents.sort(
        (left, right) =>
          statusWeight(right.pilotStatus) - statusWeight(left.pilotStatus) ||
          left.additionalReviewerEquivalentsToAssign -
            right.additionalReviewerEquivalentsToAssign ||
          left.title.localeCompare(right.title),
      );

      return toAiGuardedExecutionPilotWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: sortedAgents.length,
          readyForPilotAgents: sortedAgents.filter(
            (entry) => entry.pilotStatus === 'ready_for_pilot',
          ).length,
          needsOperationalBackingAgents: sortedAgents.filter(
            (entry) => entry.pilotStatus === 'needs_operational_backing',
          ).length,
          noCandidateAgents: sortedAgents.filter(
            (entry) => entry.pilotStatus === 'no_candidate',
          ).length,
          candidateToolPilots: sortedAgents.filter(
            (entry) => entry.candidateToolKey !== null,
          ).length,
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/guarded-execution-runbook-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiGuardedExecutionRunbookWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiGuardedExecutionRunbookWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant guarded execution runbook workspace.',
      );
    }

    try {
      const getSlaStatus = (
        touches: number,
        stillBlockedToolCount: number,
      ): 'on_track' | 'at_risk' | 'breached' => {
        if (stillBlockedToolCount > 0 || touches >= 3) {
          return 'breached';
        }

        if (touches >= 2) {
          return 'at_risk';
        }

        return 'on_track';
      };

      const statusWeight = (
        status: 'ready_to_document' | 'needs_design' | 'not_available',
      ): number => {
        switch (status) {
          case 'ready_to_document':
            return 3;
          case 'needs_design':
            return 2;
          case 'not_available':
          default:
            return 1;
        }
      };

      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [approvalPolicies, toolAccess, approvalRequests, suggestionRuns] =
            await Promise.all([
              this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
            ]);

          const pendingApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'pending',
          ).length;
          const reviewableSuggestionRuns = suggestionRuns.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length;
          const executionCandidateToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode ===
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const stillBlockedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode !==
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();

          const currentRequiredReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests + reviewableSuggestionRuns,
          );
          const recommendedReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests +
              reviewableSuggestionRuns +
              executionCandidateToolKeys.length,
          );
          const additionalReviewerEquivalentsToAssign = Math.max(
            0,
            recommendedReviewerEquivalents -
              currentRequiredReviewerEquivalents,
          );
          const simulatedBacklogTouches =
            pendingApprovalRequests +
            reviewableSuggestionRuns +
            executionCandidateToolKeys.length;
          const simulatedSlaStatus = getSlaStatus(
            simulatedBacklogTouches,
            stillBlockedToolKeys.length,
          );
          const rolloutPhase: 'phase_1' | 'phase_2' | 'hold' =
            stillBlockedToolKeys.length > 0
              ? 'hold'
              : additionalReviewerEquivalentsToAssign > 0
                ? 'phase_1'
                : 'phase_2';

          const candidateToolKey = executionCandidateToolKeys[0] ?? null;
          const pilotType:
            | 'human_gate_then_execute'
            | 'shadow_review'
            | 'not_available' =
            candidateToolKey === null
              ? 'not_available'
              : additionalReviewerEquivalentsToAssign > 0 ||
                  simulatedSlaStatus !== 'on_track'
                ? 'shadow_review'
                : 'human_gate_then_execute';
          const runbookStatus:
            | 'ready_to_document'
            | 'needs_design'
            | 'not_available' =
            candidateToolKey === null
              ? 'not_available'
              : pilotType === 'human_gate_then_execute'
                ? 'ready_to_document'
                : 'needs_design';

          const operatingLane =
            candidateToolKey === 'growth_case_assignment_execution'
              ? 'operational_case_assignment_lane'
              : candidateToolKey === null
                ? 'suggestion_only_lane'
                : 'single_record_execution_lane';
          const namedHumanGate =
            approvalPolicies[0]?.policyKey ?? 'unassigned_human_gate';
          const blastRadius: 'single_record' | 'single_queue_lane' | 'no_execution_scope' =
            candidateToolKey === 'growth_case_assignment_execution'
              ? 'single_queue_lane'
              : candidateToolKey === null
                ? 'no_execution_scope'
                : 'single_record';

          const entryChecklist = [
            candidateToolKey
              ? `Candidate tool ${candidateToolKey} is selected as the narrow execution scope.`
              : 'No execution candidate tool has been selected yet.',
            `Human gate resolves through ${namedHumanGate}.`,
            additionalReviewerEquivalentsToAssign > 0
              ? `${additionalReviewerEquivalentsToAssign} reviewer-equivalent(s) still need to be assigned before this runbook can open execution.`
              : 'Current reviewer coverage already matches the simulated guarded-execution posture.',
            simulatedSlaStatus === 'on_track'
              ? 'Simulated same-day SLA stays on track for this runbook shape.'
              : `Simulated same-day SLA is ${simulatedSlaStatus} for this runbook shape.`,
          ];
          const stopConditions = [
            'Stop the pilot if reviewer coverage drops below the recommended minimum for the lane.',
            simulatedSlaStatus === 'breached'
              ? 'Do not open the pilot while the simulated SLA is already breached.'
              : 'Pause the pilot if the simulated SLA drifts from on_track into at_risk or breached.',
            pendingApprovalRequests > 0
              ? 'Pause the pilot if the current approval queue keeps growing faster than same-day review can clear it.'
              : 'Pause the pilot if new approval backlog starts accumulating faster than same-day review can clear it.',
          ];
          const exitCriteria = [
            candidateToolKey
              ? `The ${candidateToolKey} lane has an approved human gate and an explicit rollback path.`
              : 'At least one candidate tool is selected before a runbook can be finalized.',
            additionalReviewerEquivalentsToAssign > 0
              ? 'Required reviewer coverage is assigned and the queue stabilizes under that coverage.'
              : 'Reviewer coverage remains stable for the first guarded-execution window.',
            pilotType === 'human_gate_then_execute'
              ? 'The first gated execution path can be documented with entry, stop, and rollback steps.'
              : 'Shadow-review evidence is collected before any execute path is documented as live.',
          ];
          const nextStep =
            runbookStatus === 'ready_to_document'
              ? 'Document the first guarded-execution runbook with named approver, rollback path, and lane ownership.'
              : runbookStatus === 'needs_design'
                ? 'Use a shadow-review runbook first, then close reviewer coverage and SLA gaps before documenting execute steps.'
                : 'Stay in suggestion mode until a concrete guarded-execution candidate tool exists.';

          const notes = [
            `Current mode stays ${agent.defaultMode}.`,
            `Pilot type reads ${pilotType} and rollout phase reads ${rolloutPhase}.`,
            `Blast radius is constrained to ${blastRadius}.`,
            candidateToolKey
              ? `Named lane for the first runbook: ${operatingLane}.`
              : 'No operating lane is defined yet because there is no execution candidate.',
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            currentMode: agent.defaultMode,
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            candidateToolKey,
            pilotType,
            rolloutPhase,
            simulatedSlaStatus,
            additionalReviewerEquivalentsToAssign,
            runbookStatus,
            operatingLane,
            namedHumanGate,
            blastRadius,
            stopConditions,
            entryChecklist,
            exitCriteria,
            nextStep,
            notes,
          };
        }),
      );

      const sortedAgents = agents.sort(
        (left, right) =>
          statusWeight(right.runbookStatus) -
            statusWeight(left.runbookStatus) ||
          right.additionalReviewerEquivalentsToAssign -
            left.additionalReviewerEquivalentsToAssign ||
          left.title.localeCompare(right.title),
      );

      return toAiGuardedExecutionRunbookWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: sortedAgents.length,
          readyToDocumentAgents: sortedAgents.filter(
            (entry) => entry.runbookStatus === 'ready_to_document',
          ).length,
          needsDesignAgents: sortedAgents.filter(
            (entry) => entry.runbookStatus === 'needs_design',
          ).length,
          notAvailableAgents: sortedAgents.filter(
            (entry) => entry.runbookStatus === 'not_available',
          ).length,
          candidateRunbooks: sortedAgents.filter(
            (entry) => entry.candidateToolKey !== null,
          ).length,
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/guarded-execution-rollback-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiGuardedExecutionRollbackWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiGuardedExecutionRollbackWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant guarded execution rollback workspace.',
      );
    }

    try {
      const getSlaStatus = (
        touches: number,
        stillBlockedToolCount: number,
      ): 'on_track' | 'at_risk' | 'breached' => {
        if (stillBlockedToolCount > 0 || touches >= 3) {
          return 'breached';
        }

        if (touches >= 2) {
          return 'at_risk';
        }

        return 'on_track';
      };

      const statusWeight = (
        status:
          | 'ready_with_rollback'
          | 'needs_rollback_design'
          | 'not_applicable',
      ): number => {
        switch (status) {
          case 'ready_with_rollback':
            return 3;
          case 'needs_rollback_design':
            return 2;
          case 'not_applicable':
          default:
            return 1;
        }
      };

      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [approvalPolicies, toolAccess, approvalRequests, suggestionRuns] =
            await Promise.all([
              this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
            ]);

          const pendingApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'pending',
          ).length;
          const reviewableSuggestionRuns = suggestionRuns.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length;
          const executionCandidateToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode ===
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const stillBlockedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode !==
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();

          const currentRequiredReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests + reviewableSuggestionRuns,
          );
          const recommendedReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests +
              reviewableSuggestionRuns +
              executionCandidateToolKeys.length,
          );
          const additionalReviewerEquivalentsToAssign = Math.max(
            0,
            recommendedReviewerEquivalents -
              currentRequiredReviewerEquivalents,
          );
          const simulatedBacklogTouches =
            pendingApprovalRequests +
            reviewableSuggestionRuns +
            executionCandidateToolKeys.length;
          const simulatedSlaStatus = getSlaStatus(
            simulatedBacklogTouches,
            stillBlockedToolKeys.length,
          );
          const rolloutPhase: 'phase_1' | 'phase_2' | 'hold' =
            stillBlockedToolKeys.length > 0
              ? 'hold'
              : additionalReviewerEquivalentsToAssign > 0
                ? 'phase_1'
                : 'phase_2';

          const candidateToolKey = executionCandidateToolKeys[0] ?? null;
          const pilotType:
            | 'human_gate_then_execute'
            | 'shadow_review'
            | 'not_available' =
            candidateToolKey === null
              ? 'not_available'
              : additionalReviewerEquivalentsToAssign > 0 ||
                  simulatedSlaStatus !== 'on_track'
                ? 'shadow_review'
                : 'human_gate_then_execute';
          const runbookStatus:
            | 'ready_to_document'
            | 'needs_design'
            | 'not_available' =
            candidateToolKey === null
              ? 'not_available'
              : pilotType === 'human_gate_then_execute'
                ? 'ready_to_document'
                : 'needs_design';
          const rollbackStatus:
            | 'ready_with_rollback'
            | 'needs_rollback_design'
            | 'not_applicable' =
            candidateToolKey === null
              ? 'not_applicable'
              : runbookStatus === 'ready_to_document'
                ? 'ready_with_rollback'
                : 'needs_rollback_design';

          const rollbackOwner =
            approvalPolicies[0]?.policyKey ?? 'unassigned_human_gate';
          const blastRadius: 'single_record' | 'single_queue_lane' | 'no_execution_scope' =
            candidateToolKey === 'growth_case_assignment_execution'
              ? 'single_queue_lane'
              : candidateToolKey === null
                ? 'no_execution_scope'
                : 'single_record';
          const safeFallbackMode =
            candidateToolKey === 'growth_case_assignment_execution'
              ? 'suggestion_only_with_manual_assignment'
              : 'suggestion_only';

          const rollbackTriggerSummary = [
            candidateToolKey
              ? `Any ${candidateToolKey} attempt that misses explicit human gate approval should fall back immediately.`
              : 'No execute path exists yet, so rollback stays conceptual only.',
            simulatedSlaStatus === 'on_track'
              ? 'Escalate rollback if same-day review falls off track during the pilot window.'
              : `Rollback should trigger immediately if the pilot keeps the SLA at ${simulatedSlaStatus}.`,
            additionalReviewerEquivalentsToAssign > 0
              ? `${additionalReviewerEquivalentsToAssign} missing reviewer-equivalent(s) remain a hard rollback trigger.`
              : 'Any sudden reviewer-coverage drop is a hard rollback trigger.',
          ];
          const rollbackSteps = [
            candidateToolKey
              ? `Disable ${candidateToolKey} execute path and return the lane to explicit human-only handling.`
              : 'Keep the agent in suggestion-only mode with no execute path exposed.',
            `Route the affected work back to ${safeFallbackMode}.`,
            `Log the rollback decision under ${rollbackOwner} and capture the operator rationale for follow-up review.`,
          ];
          const verificationChecks = [
            'Confirm no state mutation was finalized without an approved human gate.',
            blastRadius === 'single_queue_lane'
              ? 'Confirm the affected queue lane is back under manual ownership.'
              : 'Confirm the affected execution scope is back under manual ownership.',
            'Confirm the next operator flow continues in suggestion mode until the issue is closed.',
          ];
          const nextStep =
            rollbackStatus === 'ready_with_rollback'
              ? 'Attach these rollback triggers and verification checks to the first guarded-execution runbook before launch.'
              : rollbackStatus === 'needs_rollback_design'
                ? 'Finish the shadow-review design and write the rollback path before any execute step is documented.'
                : 'Keep rollback planning lightweight until a concrete guarded-execution candidate tool exists.';

          const notes = [
            `Current mode stays ${agent.defaultMode}.`,
            `Rollback owner resolves through ${rollbackOwner}.`,
            `Fallback mode is ${safeFallbackMode}.`,
            candidateToolKey
              ? `Rollback scope is anchored to ${candidateToolKey} with ${blastRadius} blast radius.`
              : 'There is no rollback scope yet because there is no execution candidate.',
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            currentMode: agent.defaultMode,
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            candidateToolKey,
            pilotType,
            rolloutPhase,
            simulatedSlaStatus,
            runbookStatus,
            rollbackStatus,
            rollbackOwner,
            blastRadius,
            rollbackTriggerSummary,
            rollbackSteps,
            verificationChecks,
            safeFallbackMode,
            nextStep,
            notes,
          };
        }),
      );

      const sortedAgents = agents.sort(
        (left, right) =>
          statusWeight(right.rollbackStatus) -
            statusWeight(left.rollbackStatus) ||
          left.title.localeCompare(right.title),
      );

      return toAiGuardedExecutionRollbackWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: sortedAgents.length,
          readyWithRollbackAgents: sortedAgents.filter(
            (entry) => entry.rollbackStatus === 'ready_with_rollback',
          ).length,
          needsRollbackDesignAgents: sortedAgents.filter(
            (entry) => entry.rollbackStatus === 'needs_rollback_design',
          ).length,
          notApplicableAgents: sortedAgents.filter(
            (entry) => entry.rollbackStatus === 'not_applicable',
          ).length,
          rollbackCandidateTools: sortedAgents.filter(
            (entry) => entry.candidateToolKey !== null,
          ).length,
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/guarded-execution-audit-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiGuardedExecutionAuditWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiGuardedExecutionAuditWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant guarded execution audit workspace.',
      );
    }

    try {
      const getSlaStatus = (
        touches: number,
        stillBlockedToolCount: number,
      ): 'on_track' | 'at_risk' | 'breached' => {
        if (stillBlockedToolCount > 0 || touches >= 3) {
          return 'breached';
        }

        if (touches >= 2) {
          return 'at_risk';
        }

        return 'on_track';
      };

      const statusWeight = (
        status: 'ready_for_audit' | 'needs_evidence_design' | 'not_applicable',
      ): number => {
        switch (status) {
          case 'ready_for_audit':
            return 3;
          case 'needs_evidence_design':
            return 2;
          case 'not_applicable':
          default:
            return 1;
        }
      };

      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [approvalPolicies, toolAccess, approvalRequests, suggestionRuns] =
            await Promise.all([
              this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
            ]);

          const pendingApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'pending',
          ).length;
          const reviewedApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'approved' || entry.status === 'rejected',
          ).length;
          const reviewableSuggestionRuns = suggestionRuns.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length;
          const executionCandidateToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode ===
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const stillBlockedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode !==
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();

          const currentRequiredReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests + reviewableSuggestionRuns,
          );
          const recommendedReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests +
              reviewableSuggestionRuns +
              executionCandidateToolKeys.length,
          );
          const additionalReviewerEquivalentsToAssign = Math.max(
            0,
            recommendedReviewerEquivalents -
              currentRequiredReviewerEquivalents,
          );
          const simulatedBacklogTouches =
            pendingApprovalRequests +
            reviewableSuggestionRuns +
            executionCandidateToolKeys.length;
          const simulatedSlaStatus = getSlaStatus(
            simulatedBacklogTouches,
            stillBlockedToolKeys.length,
          );
          const rolloutPhase: 'phase_1' | 'phase_2' | 'hold' =
            stillBlockedToolKeys.length > 0
              ? 'hold'
              : additionalReviewerEquivalentsToAssign > 0
                ? 'phase_1'
                : 'phase_2';

          const candidateToolKey = executionCandidateToolKeys[0] ?? null;
          const pilotType:
            | 'human_gate_then_execute'
            | 'shadow_review'
            | 'not_available' =
            candidateToolKey === null
              ? 'not_available'
              : additionalReviewerEquivalentsToAssign > 0 ||
                  simulatedSlaStatus !== 'on_track'
                ? 'shadow_review'
                : 'human_gate_then_execute';
          const runbookStatus:
            | 'ready_to_document'
            | 'needs_design'
            | 'not_available' =
            candidateToolKey === null
              ? 'not_available'
              : pilotType === 'human_gate_then_execute'
                ? 'ready_to_document'
                : 'needs_design';
          const rollbackStatus:
            | 'ready_with_rollback'
            | 'needs_rollback_design'
            | 'not_applicable' =
            candidateToolKey === null
              ? 'not_applicable'
              : runbookStatus === 'ready_to_document'
                ? 'ready_with_rollback'
                : 'needs_rollback_design';
          const auditStatus:
            | 'ready_for_audit'
            | 'needs_evidence_design'
            | 'not_applicable' =
            candidateToolKey === null
              ? 'not_applicable'
              : runbookStatus === 'ready_to_document' &&
                  rollbackStatus === 'ready_with_rollback' &&
                  simulatedSlaStatus === 'on_track'
                ? 'ready_for_audit'
                : 'needs_evidence_design';

          const auditOwner =
            approvalPolicies[0]?.policyKey ?? 'unassigned_human_gate';
          const safeFallbackMode =
            candidateToolKey === 'growth_case_assignment_execution'
              ? 'suggestion_only_with_manual_assignment'
              : 'suggestion_only';

          const evidencePackSummary = [
            candidateToolKey
              ? `Audit evidence should bind every ${candidateToolKey} decision to a named human gate.`
              : 'No guarded-execution evidence pack is needed yet because there is no execute path.',
            reviewedApprovalRequests > 0
              ? `${reviewedApprovalRequests} reviewed approval request(s) already exist as precedent evidence for human oversight.`
              : 'No reviewed approval request exists yet as precedent evidence.',
            simulatedSlaStatus === 'on_track'
              ? 'Same-day review is stable enough to produce auditable reviewer evidence.'
              : `Same-day review is still ${simulatedSlaStatus}, so audit evidence would be noisy until the lane stabilizes.`,
          ];
          const requiredArtifacts = [
            candidateToolKey
              ? `Named runbook for ${candidateToolKey} with entry, rollback, and approval gate references.`
              : 'Candidate tool selection before an audit artifact set is required.',
            `Approval-policy reference for ${auditOwner}.`,
            `Operator-visible fallback path to ${safeFallbackMode}.`,
          ];
          const loggingChecks = [
            'Every guarded decision should record actor, policy key, and handoff/run identifiers.',
            candidateToolKey
              ? `Every ${candidateToolKey} attempt should log whether it stayed in shadow review or crossed a human gate.`
              : 'No execute-attempt logging is required yet because there is no candidate tool.',
            'Rollback and fallback transitions should be visible in the same audit trail as the approval decision.',
          ];
          const reviewTrailSummary = [
            reviewedApprovalRequests > 0
              ? `${reviewedApprovalRequests} reviewed approval request(s) already contribute to the human review trail.`
              : 'There is still no reviewed approval trail to reuse as precedent.',
            pendingApprovalRequests > 0
              ? `${pendingApprovalRequests} pending approval request(s) still need resolution before the trail is stable.`
              : 'No pending approval request currently blocks audit readability.',
            reviewableSuggestionRuns > 0
              ? `${reviewableSuggestionRuns} suggestion run(s) still rely on explicit routing before they can support an audit package.`
              : 'No unresolved suggestion run currently weakens the review trail.',
          ];
          const nextStep =
            auditStatus === 'ready_for_audit'
              ? 'Package the runbook, rollback path, and human review trail into the first guarded-execution audit bundle.'
              : auditStatus === 'needs_evidence_design'
                ? 'Stabilize review evidence, rollback references, and approval logging before treating this lane as audit-ready.'
                : 'Stay in suggestion mode until a concrete guarded-execution candidate tool exists.';

          const notes = [
            `Current mode stays ${agent.defaultMode}.`,
            `Audit owner resolves through ${auditOwner}.`,
            `Fallback mode for audit references is ${safeFallbackMode}.`,
            candidateToolKey
              ? `Audit scope is anchored to ${candidateToolKey}.`
              : 'There is no audit scope yet because there is no execution candidate.',
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            currentMode: agent.defaultMode,
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            candidateToolKey,
            pilotType,
            rolloutPhase,
            simulatedSlaStatus,
            runbookStatus,
            rollbackStatus,
            auditStatus,
            auditOwner,
            safeFallbackMode,
            evidencePackSummary,
            requiredArtifacts,
            loggingChecks,
            reviewTrailSummary,
            nextStep,
            notes,
          };
        }),
      );

      const sortedAgents = agents.sort(
        (left, right) =>
          statusWeight(right.auditStatus) - statusWeight(left.auditStatus) ||
          left.title.localeCompare(right.title),
      );

      return toAiGuardedExecutionAuditWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: sortedAgents.length,
          readyForAuditAgents: sortedAgents.filter(
            (entry) => entry.auditStatus === 'ready_for_audit',
          ).length,
          needsEvidenceDesignAgents: sortedAgents.filter(
            (entry) => entry.auditStatus === 'needs_evidence_design',
          ).length,
          notApplicableAgents: sortedAgents.filter(
            (entry) => entry.auditStatus === 'not_applicable',
          ).length,
          auditCandidateTools: sortedAgents.filter(
            (entry) => entry.candidateToolKey !== null,
          ).length,
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/guarded-execution-launch-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiGuardedExecutionLaunchWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiGuardedExecutionLaunchWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant guarded execution launch workspace.',
      );
    }

    try {
      const getSlaStatus = (
        touches: number,
        stillBlockedToolCount: number,
      ): 'on_track' | 'at_risk' | 'breached' => {
        if (stillBlockedToolCount > 0 || touches >= 3) {
          return 'breached';
        }

        if (touches >= 2) {
          return 'at_risk';
        }

        return 'on_track';
      };

      const statusWeight = (
        status: 'ready_to_launch' | 'pilot_only' | 'hold',
      ): number => {
        switch (status) {
          case 'ready_to_launch':
            return 3;
          case 'pilot_only':
            return 2;
          case 'hold':
          default:
            return 1;
        }
      };

      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [approvalPolicies, toolAccess, approvalRequests, suggestionRuns] =
            await Promise.all([
              this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
            ]);

          const pendingApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'pending',
          ).length;
          const reviewedApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'approved' || entry.status === 'rejected',
          ).length;
          const reviewableSuggestionRuns = suggestionRuns.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length;
          const executionCandidateToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode ===
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const stillBlockedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode !==
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();

          const currentRequiredReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests + reviewableSuggestionRuns,
          );
          const recommendedReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests +
              reviewableSuggestionRuns +
              executionCandidateToolKeys.length,
          );
          const additionalReviewerEquivalentsToAssign = Math.max(
            0,
            recommendedReviewerEquivalents -
              currentRequiredReviewerEquivalents,
          );
          const simulatedBacklogTouches =
            pendingApprovalRequests +
            reviewableSuggestionRuns +
            executionCandidateToolKeys.length;
          const simulatedSlaStatus = getSlaStatus(
            simulatedBacklogTouches,
            stillBlockedToolKeys.length,
          );
          const rolloutPhase: 'phase_1' | 'phase_2' | 'hold' =
            stillBlockedToolKeys.length > 0
              ? 'hold'
              : additionalReviewerEquivalentsToAssign > 0
                ? 'phase_1'
                : 'phase_2';

          const candidateToolKey = executionCandidateToolKeys[0] ?? null;
          const pilotType:
            | 'human_gate_then_execute'
            | 'shadow_review'
            | 'not_available' =
            candidateToolKey === null
              ? 'not_available'
              : additionalReviewerEquivalentsToAssign > 0 ||
                  simulatedSlaStatus !== 'on_track'
                ? 'shadow_review'
                : 'human_gate_then_execute';
          const runbookStatus:
            | 'ready_to_document'
            | 'needs_design'
            | 'not_available' =
            candidateToolKey === null
              ? 'not_available'
              : pilotType === 'human_gate_then_execute'
                ? 'ready_to_document'
                : 'needs_design';
          const rollbackStatus:
            | 'ready_with_rollback'
            | 'needs_rollback_design'
            | 'not_applicable' =
            candidateToolKey === null
              ? 'not_applicable'
              : runbookStatus === 'ready_to_document'
                ? 'ready_with_rollback'
                : 'needs_rollback_design';
          const auditStatus:
            | 'ready_for_audit'
            | 'needs_evidence_design'
            | 'not_applicable' =
            candidateToolKey === null
              ? 'not_applicable'
              : runbookStatus === 'ready_to_document' &&
                  rollbackStatus === 'ready_with_rollback' &&
                  simulatedSlaStatus === 'on_track'
                ? 'ready_for_audit'
                : 'needs_evidence_design';

          const launchStatus: 'ready_to_launch' | 'pilot_only' | 'hold' =
            candidateToolKey === null
              ? 'hold'
              : auditStatus === 'ready_for_audit' &&
                  pilotType === 'human_gate_then_execute'
                ? 'ready_to_launch'
                : pilotType === 'shadow_review' ||
                    auditStatus === 'needs_evidence_design'
                  ? 'pilot_only'
                  : 'hold';
          const launchWindow: 'current_window' | 'next_window' | 'defer' =
            launchStatus === 'ready_to_launch'
              ? 'current_window'
              : launchStatus === 'pilot_only'
                ? 'next_window'
                : 'defer';
          const launchOwner =
            approvalPolicies[0]?.policyKey ?? 'unassigned_human_gate';
          const safeFallbackMode =
            candidateToolKey === 'growth_case_assignment_execution'
              ? 'suggestion_only_with_manual_assignment'
              : 'suggestion_only';

          const launchChecklist = [
            candidateToolKey
              ? `Launch scope stays constrained to ${candidateToolKey}.`
              : 'No guarded-execution candidate tool exists yet.',
            `Launch owner resolves through ${launchOwner}.`,
            additionalReviewerEquivalentsToAssign > 0
              ? `${additionalReviewerEquivalentsToAssign} reviewer-equivalent(s) still need to be staffed before launch.`
              : 'Reviewer coverage already matches the guarded-execution posture.',
            reviewedApprovalRequests > 0
              ? `${reviewedApprovalRequests} reviewed approval request(s) already support the human oversight trail.`
              : 'No reviewed approval request exists yet as launch evidence.',
          ];
          const blockingFactors = [
            simulatedSlaStatus === 'on_track'
              ? 'No SLA blocker is active right now.'
              : `Simulated SLA remains ${simulatedSlaStatus}.`,
            auditStatus === 'ready_for_audit'
              ? 'Audit package is strong enough for a guarded launch.'
              : 'Audit evidence still needs tightening before launch.',
            rollbackStatus === 'ready_with_rollback'
              ? 'Rollback path is already explicit.'
              : 'Rollback path still needs to be finalized before launch.',
          ];
          const successSignals = [
            candidateToolKey
              ? `${candidateToolKey} stays inside the named human gate without bypasses.`
              : 'Suggestion-only operation remains the safe default until a candidate exists.',
            'Fallback mode remains visible and usable by operators.',
            'Same-day review stays stable through the first guarded-execution window.',
          ];
          const nextStep =
            launchStatus === 'ready_to_launch'
              ? 'Open the first guarded-execution lane in the current window with explicit human gate and fallback path.'
              : launchStatus === 'pilot_only'
                ? 'Keep this agent in a narrow pilot path while audit evidence, rollback shape, or reviewer coverage continue to mature.'
                : 'Hold this agent in suggestion mode until a guarded-execution candidate path is concrete and stable.';

          const notes = [
            `Current mode stays ${agent.defaultMode}.`,
            `Launch owner resolves through ${launchOwner}.`,
            `Fallback mode for launch remains ${safeFallbackMode}.`,
            candidateToolKey
              ? `Launch scope is anchored to ${candidateToolKey}.`
              : 'There is no launch scope yet because there is no execution candidate.',
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            currentMode: agent.defaultMode,
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            candidateToolKey,
            pilotType,
            rolloutPhase,
            simulatedSlaStatus,
            runbookStatus,
            rollbackStatus,
            auditStatus,
            launchStatus,
            launchWindow,
            launchOwner,
            safeFallbackMode,
            launchChecklist,
            blockingFactors,
            successSignals,
            nextStep,
            notes,
          };
        }),
      );

      const sortedAgents = agents.sort(
        (left, right) =>
          statusWeight(right.launchStatus) - statusWeight(left.launchStatus) ||
          left.title.localeCompare(right.title),
      );

      return toAiGuardedExecutionLaunchWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: sortedAgents.length,
          readyToLaunchAgents: sortedAgents.filter(
            (entry) => entry.launchStatus === 'ready_to_launch',
          ).length,
          pilotOnlyAgents: sortedAgents.filter(
            (entry) => entry.launchStatus === 'pilot_only',
          ).length,
          holdAgents: sortedAgents.filter(
            (entry) => entry.launchStatus === 'hold',
          ).length,
          launchCandidateTools: sortedAgents.filter(
            (entry) => entry.candidateToolKey !== null,
          ).length,
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/guarded-execution-monitor-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiGuardedExecutionMonitorWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiGuardedExecutionMonitorWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant guarded execution monitor workspace.',
      );
    }

    try {
      const getSlaStatus = (
        touches: number,
        stillBlockedToolCount: number,
      ): 'on_track' | 'at_risk' | 'breached' => {
        if (stillBlockedToolCount > 0 || touches >= 3) {
          return 'breached';
        }

        if (touches >= 2) {
          return 'at_risk';
        }

        return 'on_track';
      };

      const statusWeight = (
        status: 'ready_to_monitor' | 'monitor_after_launch' | 'not_applicable',
      ): number => {
        switch (status) {
          case 'ready_to_monitor':
            return 3;
          case 'monitor_after_launch':
            return 2;
          case 'not_applicable':
          default:
            return 1;
        }
      };

      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [approvalPolicies, toolAccess, approvalRequests, suggestionRuns] =
            await Promise.all([
              this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
            ]);

          const pendingApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'pending',
          ).length;
          const reviewedApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'approved' || entry.status === 'rejected',
          ).length;
          const reviewableSuggestionRuns = suggestionRuns.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length;
          const executionCandidateToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode ===
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const stillBlockedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode !==
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();

          const currentRequiredReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests + reviewableSuggestionRuns,
          );
          const recommendedReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests +
              reviewableSuggestionRuns +
              executionCandidateToolKeys.length,
          );
          const additionalReviewerEquivalentsToAssign = Math.max(
            0,
            recommendedReviewerEquivalents -
              currentRequiredReviewerEquivalents,
          );
          const simulatedBacklogTouches =
            pendingApprovalRequests +
            reviewableSuggestionRuns +
            executionCandidateToolKeys.length;
          const simulatedSlaStatus = getSlaStatus(
            simulatedBacklogTouches,
            stillBlockedToolKeys.length,
          );

          const candidateToolKey = executionCandidateToolKeys[0] ?? null;
          const launchStatus: 'ready_to_launch' | 'pilot_only' | 'hold' =
            candidateToolKey === null
              ? 'hold'
              : additionalReviewerEquivalentsToAssign === 0 &&
                  simulatedSlaStatus === 'on_track' &&
                  stillBlockedToolKeys.length === 0
                ? 'ready_to_launch'
                : 'pilot_only';
          const launchWindow: 'current_window' | 'next_window' | 'defer' =
            launchStatus === 'ready_to_launch'
              ? 'current_window'
              : launchStatus === 'pilot_only'
                ? 'next_window'
                : 'defer';
          const monitorStatus:
            | 'ready_to_monitor'
            | 'monitor_after_launch'
            | 'not_applicable' =
            candidateToolKey === null
              ? 'not_applicable'
              : launchStatus === 'ready_to_launch'
                ? 'ready_to_monitor'
                : 'monitor_after_launch';
          const monitorOwner =
            approvalPolicies[0]?.policyKey ?? 'unassigned_human_gate';
          const safeFallbackMode =
            candidateToolKey === 'growth_case_assignment_execution'
              ? 'suggestion_only_with_manual_assignment'
              : 'suggestion_only';
          const watchWindow: 'day_0' | 'next_window' | 'not_scheduled' =
            monitorStatus === 'ready_to_monitor'
              ? 'day_0'
              : monitorStatus === 'monitor_after_launch'
                ? 'next_window'
                : 'not_scheduled';

          const watchSignals = [
            candidateToolKey
              ? `${candidateToolKey} stays inside the named human gate on every first-window attempt.`
              : 'Suggestion-only mode stays stable while no execute path exists.',
            pendingApprovalRequests > 0
              ? `Current pending queue starts at ${pendingApprovalRequests} request(s) and should not grow through the watch window.`
              : 'Pending approval queue starts at zero and should stay flat through the watch window.',
            reviewedApprovalRequests > 0
              ? `${reviewedApprovalRequests} reviewed approval decision(s) already give us baseline operator behavior to compare against.`
              : 'There is no reviewed baseline yet, so operator behavior should be watched more closely.',
          ];
          const escalationSignals = [
            simulatedSlaStatus === 'on_track'
              ? 'Escalate if same-day review drifts from on_track during the first watch window.'
              : `Escalate immediately if the lane still reads ${simulatedSlaStatus} at launch time.`,
            additionalReviewerEquivalentsToAssign > 0
              ? `${additionalReviewerEquivalentsToAssign} missing reviewer-equivalent(s) are still an escalation trigger.`
              : 'Any sudden reviewer-coverage drop is an escalation trigger.',
            `Escalate if fallback to ${safeFallbackMode} becomes the default path instead of the exception.`,
          ];
          const rollbackReadinessChecks = [
            'Confirm the rollback owner can disable the execute path without waiting on additional routing.',
            candidateToolKey
              ? `Confirm ${candidateToolKey} can fall back to suggestion mode without leaving orphaned operator state.`
              : 'Confirm suggestion mode remains the only available path until a candidate tool exists.',
            'Confirm rollback events remain visible in the same oversight trail as approvals and review decisions.',
          ];
          const nextStep =
            monitorStatus === 'ready_to_monitor'
              ? 'Use this workspace as the day-0 watchlist when the first guarded lane opens.'
              : monitorStatus === 'monitor_after_launch'
                ? 'Keep these watch and escalation signals ready while the lane stays in pilot or next-window status.'
                : 'No launch monitoring is needed yet beyond keeping the agent in suggestion mode.';

          const notes = [
            `Current mode stays ${agent.defaultMode}.`,
            `Monitor owner resolves through ${monitorOwner}.`,
            `Fallback mode for monitoring remains ${safeFallbackMode}.`,
            candidateToolKey
              ? `Monitoring scope is anchored to ${candidateToolKey}.`
              : 'There is no monitoring scope yet because there is no execution candidate.',
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            currentMode: agent.defaultMode,
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            candidateToolKey,
            launchStatus,
            launchWindow,
            monitorStatus,
            monitorOwner,
            safeFallbackMode,
            watchWindow,
            watchSignals,
            escalationSignals,
            rollbackReadinessChecks,
            nextStep,
            notes,
          };
        }),
      );

      const sortedAgents = agents.sort(
        (left, right) =>
          statusWeight(right.monitorStatus) - statusWeight(left.monitorStatus) ||
          left.title.localeCompare(right.title),
      );

      return toAiGuardedExecutionMonitorWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: sortedAgents.length,
          readyToMonitorAgents: sortedAgents.filter(
            (entry) => entry.monitorStatus === 'ready_to_monitor',
          ).length,
          monitorAfterLaunchAgents: sortedAgents.filter(
            (entry) => entry.monitorStatus === 'monitor_after_launch',
          ).length,
          notApplicableAgents: sortedAgents.filter(
            (entry) => entry.monitorStatus === 'not_applicable',
          ).length,
          monitorCandidateTools: sortedAgents.filter(
            (entry) => entry.candidateToolKey !== null,
          ).length,
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/guarded-execution-control-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiGuardedExecutionControlWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiGuardedExecutionControlWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant guarded execution control workspace.',
      );
    }

    try {
      const getSlaStatus = (
        touches: number,
        stillBlockedToolCount: number,
      ): 'on_track' | 'at_risk' | 'breached' => {
        if (stillBlockedToolCount > 0 || touches >= 3) {
          return 'breached';
        }

        if (touches >= 2) {
          return 'at_risk';
        }

        return 'on_track';
      };

      const statusWeight = (
        status: 'open_lane' | 'pilot_then_open' | 'hold',
      ): number => {
        switch (status) {
          case 'open_lane':
            return 3;
          case 'pilot_then_open':
            return 2;
          case 'hold':
          default:
            return 1;
        }
      };

      const agents = await Promise.all(
        accessibleAgents.map(async (agent) => {
          const [approvalPolicies, toolAccess, approvalRequests, suggestionRuns] =
            await Promise.all([
              this.getAiApprovalPoliciesByAgentKeyUseCase.execute(agent.key),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
            ]);

          const pendingApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'pending',
          ).length;
          const reviewedApprovalRequests = approvalRequests.filter(
            (entry) => entry.status === 'approved' || entry.status === 'rejected',
          ).length;
          const reviewableSuggestionRuns = suggestionRuns.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length;
          const executionCandidateToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode ===
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();
          const stillBlockedToolKeys = toolAccess
            .filter(
              (entry) =>
                entry.accessLevel === 'blocked' &&
                entry.tool.executionBoundary.executionMode !==
                  'guarded_execution_planned',
            )
            .map((entry) => entry.tool.key)
            .sort();

          const currentRequiredReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests + reviewableSuggestionRuns,
          );
          const recommendedReviewerEquivalents = Math.max(
            1,
            pendingApprovalRequests +
              reviewableSuggestionRuns +
              executionCandidateToolKeys.length,
          );
          const additionalReviewerEquivalentsToAssign = Math.max(
            0,
            recommendedReviewerEquivalents -
              currentRequiredReviewerEquivalents,
          );
          const simulatedBacklogTouches =
            pendingApprovalRequests +
            reviewableSuggestionRuns +
            executionCandidateToolKeys.length;
          const simulatedSlaStatus = getSlaStatus(
            simulatedBacklogTouches,
            stillBlockedToolKeys.length,
          );

          const candidateToolKey = executionCandidateToolKeys[0] ?? null;
          const launchStatus: 'ready_to_launch' | 'pilot_only' | 'hold' =
            candidateToolKey === null
              ? 'hold'
              : additionalReviewerEquivalentsToAssign === 0 &&
                  simulatedSlaStatus === 'on_track' &&
                  stillBlockedToolKeys.length === 0
                ? 'ready_to_launch'
                : 'pilot_only';
          const launchWindow: 'current_window' | 'next_window' | 'defer' =
            launchStatus === 'ready_to_launch'
              ? 'current_window'
              : launchStatus === 'pilot_only'
                ? 'next_window'
                : 'defer';
          const monitorStatus:
            | 'ready_to_monitor'
            | 'monitor_after_launch'
            | 'not_applicable' =
            candidateToolKey === null
              ? 'not_applicable'
              : launchStatus === 'ready_to_launch'
                ? 'ready_to_monitor'
                : 'monitor_after_launch';
          const controlStatus: 'open_lane' | 'pilot_then_open' | 'hold' =
            launchStatus === 'ready_to_launch' &&
            monitorStatus === 'ready_to_monitor'
              ? 'open_lane'
              : launchStatus === 'pilot_only'
                ? 'pilot_then_open'
                : 'hold';
          const controlWindow: 'current_window' | 'next_window' | 'defer' =
            controlStatus === 'open_lane'
              ? 'current_window'
              : controlStatus === 'pilot_then_open'
                ? 'next_window'
                : 'defer';
          const controlOwner =
            approvalPolicies[0]?.policyKey ?? 'unassigned_human_gate';
          const escalationOwner = controlOwner;
          const safeFallbackMode =
            candidateToolKey === 'growth_case_assignment_execution'
              ? 'suggestion_only_with_manual_assignment'
              : 'suggestion_only';

          const topAction =
            controlStatus === 'open_lane'
              ? 'Open the lane with explicit watch coverage and fallback visibility.'
              : controlStatus === 'pilot_then_open'
                ? 'Keep this lane in pilot while reviewer coverage, evidence, or SLA mature.'
                : 'Keep the agent in suggestion mode and do not expose an execute path yet.';

          const controlChecklist = [
            candidateToolKey
              ? `Candidate tool ${candidateToolKey} stays inside the named lane scope.`
              : 'No guarded-execution candidate tool exists yet.',
            `Control owner resolves through ${controlOwner}.`,
            reviewedApprovalRequests > 0
              ? `${reviewedApprovalRequests} reviewed approval decision(s) already exist as operator precedent.`
              : 'No reviewed approval decision exists yet as operator precedent.',
            additionalReviewerEquivalentsToAssign > 0
              ? `${additionalReviewerEquivalentsToAssign} reviewer-equivalent(s) still need to be staffed.`
              : 'Reviewer coverage already matches the guarded lane posture.',
          ];
          const guardrails = [
            simulatedSlaStatus === 'on_track'
              ? 'Same-day review is on track under the current lane assumptions.'
              : `Same-day review remains ${simulatedSlaStatus} under the current lane assumptions.`,
            `Fallback path remains ${safeFallbackMode}.`,
            stillBlockedToolKeys.length > 0
              ? `${stillBlockedToolKeys.length} non-planned blocked tool(s) still keep this lane constrained.`
              : 'No extra blocked tool posture is constraining this lane beyond the planned scope.',
          ];
          const nextStep =
            controlStatus === 'open_lane'
              ? 'Treat this as the go/no-go control card for the first guarded lane.'
              : controlStatus === 'pilot_then_open'
                ? 'Use this control card to keep the lane in pilot until coverage, evidence, and monitoring are strong enough.'
                : 'Hold this agent in suggestion mode until a guarded lane becomes concrete.';

          const notes = [
            `Current mode stays ${agent.defaultMode}.`,
            `Escalation owner resolves through ${escalationOwner}.`,
            `Fallback mode for control remains ${safeFallbackMode}.`,
            candidateToolKey
              ? `Control scope is anchored to ${candidateToolKey}.`
              : 'There is no control scope yet because there is no execution candidate.',
          ];

          return {
            agentKey: agent.key,
            title: agent.title,
            domainKey: agent.domainKey,
            productKey: agent.productKey,
            currentMode: agent.defaultMode,
            approvalPolicyKeys: approvalPolicies.map((entry) => entry.policyKey),
            candidateToolKey,
            controlStatus,
            controlWindow,
            launchStatus,
            monitorStatus,
            controlOwner,
            escalationOwner,
            safeFallbackMode,
            topAction,
            controlChecklist,
            guardrails,
            nextStep,
            notes,
          };
        }),
      );

      const sortedAgents = agents.sort(
        (left, right) =>
          statusWeight(right.controlStatus) - statusWeight(left.controlStatus) ||
          left.title.localeCompare(right.title),
      );

      return toAiGuardedExecutionControlWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalAgents: sortedAgents.length,
          openLaneAgents: sortedAgents.filter(
            (entry) => entry.controlStatus === 'open_lane',
          ).length,
          pilotThenOpenAgents: sortedAgents.filter(
            (entry) => entry.controlStatus === 'pilot_then_open',
          ).length,
          holdAgents: sortedAgents.filter(
            (entry) => entry.controlStatus === 'hold',
          ).length,
          controlCandidateTools: sortedAgents.filter(
            (entry) => entry.candidateToolKey !== null,
          ).length,
        },
        agents: sortedAgents,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/guarded-execution-event-log-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiGuardedExecutionEventLogWorkspace(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiGuardedExecutionEventLogWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgents = this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .filter((entry) =>
        this.hasAgentPermission(entry.key, tenantAccess?.permissionKeys),
      );

    if (accessibleAgents.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant guarded execution event log workspace.',
      );
    }

    try {
      const persistedExecutionEvents =
        await this.listTenantAiGuardedExecutionEventsUseCase.execute(
          tenantSlug,
          {
            agentKeys: accessibleAgents.map((entry) => entry.key),
            limit: null,
            eventTypes: null,
          },
        );
      const getSlaStatus = (
        touches: number,
        stillBlockedToolCount: number,
      ): 'on_track' | 'at_risk' | 'breached' => {
        if (stillBlockedToolCount > 0 || touches >= 3) {
          return 'breached';
        }

        if (touches >= 2) {
          return 'at_risk';
        }

        return 'on_track';
      };

      const entries = (
        await Promise.all(
          accessibleAgents.map(async (agent) => {
            const [approvalRequests, suggestionRuns, toolAccess] = await Promise.all([
              this.listTenantAiApprovalRequestsUseCase.execute(
                tenantSlug,
                agent.key,
                {
                  limit: null,
                  status: null,
                },
              ),
              this.listTenantAiSuggestionRunsUseCase.execute(
                tenantSlug,
                agent.key,
                null,
              ),
              this.getAiAgentToolAccessByAgentKeyUseCase.execute(agent.key),
            ]);

            const reviewableSuggestionRuns = suggestionRuns.filter(
              (entry) =>
                entry.approvalSummary.status === 'not_requested' ||
                entry.approvalSummary.status === 'rejected',
            ).length;
            const pendingApprovalRequests = approvalRequests.filter(
              (entry) => entry.status === 'pending',
            ).length;
            const executionCandidateToolKeys = toolAccess
              .filter(
                (entry) =>
                  entry.accessLevel === 'blocked' &&
                  entry.tool.executionBoundary.executionMode ===
                    'guarded_execution_planned',
              )
              .map((entry) => entry.tool.key)
              .sort();
            const stillBlockedToolKeys = toolAccess
              .filter(
                (entry) =>
                  entry.accessLevel === 'blocked' &&
                  entry.tool.executionBoundary.executionMode !==
                    'guarded_execution_planned',
              )
              .map((entry) => entry.tool.key)
              .sort();

            const currentRequiredReviewerEquivalents = Math.max(
              1,
              pendingApprovalRequests + reviewableSuggestionRuns,
            );
            const recommendedReviewerEquivalents = Math.max(
              1,
              pendingApprovalRequests +
                reviewableSuggestionRuns +
                executionCandidateToolKeys.length,
            );
            const additionalReviewerEquivalentsToAssign = Math.max(
              0,
              recommendedReviewerEquivalents -
                currentRequiredReviewerEquivalents,
            );
            const simulatedBacklogTouches =
              pendingApprovalRequests +
              reviewableSuggestionRuns +
              executionCandidateToolKeys.length;
            const simulatedSlaStatus = getSlaStatus(
              simulatedBacklogTouches,
              stillBlockedToolKeys.length,
            );
            const candidateToolKey = executionCandidateToolKeys[0] ?? null;
            const controlStatus: 'open_lane' | 'pilot_then_open' | 'hold' =
              candidateToolKey === null
                ? 'hold'
                : additionalReviewerEquivalentsToAssign === 0 &&
                    simulatedSlaStatus === 'on_track' &&
                    stillBlockedToolKeys.length === 0
                  ? 'open_lane'
                  : 'pilot_then_open';

            const baseEntries = suggestionRuns.flatMap((suggestionRun) => {
              const localEntries: Array<{
                id: string;
                tenantSlug: string;
                agentKey: string;
                eventType: AiGuardedExecutionEventLogEntryTypeResponseDto;
                occurredAt: Date;
                suggestionRunId: string | null;
                approvalRequestId: string | null;
                candidateToolKey: string | null;
                summary: string;
                detail: string;
              }> = [
                {
                  id: `guarded-log:prepared:${suggestionRun.id}`,
                  tenantSlug,
                  agentKey: agent.key,
                  eventType: 'suggestion_run_prepared',
                  occurredAt: suggestionRun.createdAt,
                  suggestionRunId: suggestionRun.id,
                  approvalRequestId: null,
                  candidateToolKey: null,
                  summary: suggestionRun.summary,
                  detail: `Prepared suggestion handoff with ${suggestionRun.promptPackKey}@${suggestionRun.promptPackVersion}.`,
                },
              ];

              return localEntries;
            });

            const approvalEntries = approvalRequests.flatMap((approvalRequest) => {
              const localEntries: Array<{
                id: string;
                tenantSlug: string;
                agentKey: string;
                eventType: AiGuardedExecutionEventLogEntryTypeResponseDto;
                occurredAt: Date;
                suggestionRunId: string | null;
                approvalRequestId: string | null;
                candidateToolKey: string | null;
                summary: string;
                detail: string;
              }> = [
                {
                  id: `guarded-log:approval-requested:${approvalRequest.id}`,
                  tenantSlug,
                  agentKey: agent.key,
                  eventType: 'approval_requested',
                  occurredAt: approvalRequest.createdAt,
                  suggestionRunId: approvalRequest.suggestionRunId,
                  approvalRequestId: approvalRequest.id,
                  candidateToolKey: null,
                  summary: approvalRequest.summary,
                  detail:
                    approvalRequest.rationale ??
                    `Approval requested under policy ${approvalRequest.policyKey}.`,
                },
              ];

              if (approvalRequest.reviewedAt !== null) {
                localEntries.push({
                  id: `guarded-log:approval-reviewed:${approvalRequest.id}`,
                  tenantSlug,
                  agentKey: agent.key,
                  eventType: 'approval_reviewed',
                  occurredAt: approvalRequest.reviewedAt,
                  suggestionRunId: approvalRequest.suggestionRunId,
                  approvalRequestId: approvalRequest.id,
                  candidateToolKey: null,
                  summary: `${agent.title} approval request ${approvalRequest.id} was ${approvalRequest.status}.`,
                  detail:
                    approvalRequest.reviewNote ??
                    `Reviewed under policy ${approvalRequest.policyKey}.`,
                });
              }

              return localEntries;
            });

            const statusEntries: Array<{
              id: string;
              tenantSlug: string;
              agentKey: string;
              eventType: AiGuardedExecutionEventLogEntryTypeResponseDto;
              occurredAt: Date;
              suggestionRunId: string | null;
              approvalRequestId: string | null;
              candidateToolKey: string | null;
              summary: string;
              detail: string;
            }> = [];

            if (candidateToolKey !== null) {
              const anchorCandidates = [
                ...suggestionRuns.map((entry) => entry.createdAt.getTime()),
                ...approvalRequests.map((entry) =>
                  (entry.reviewedAt ?? entry.createdAt).getTime(),
                ),
              ];
              const anchorTimestamp =
                Math.max(...anchorCandidates, new Date('2026-01-01T00:00:00.000Z').getTime()) +
                1000;

              if (controlStatus === 'open_lane') {
                statusEntries.push({
                  id: `guarded-log:lane-ready:${agent.key}:${candidateToolKey}`,
                  tenantSlug,
                  agentKey: agent.key,
                  eventType: 'guarded_execution_lane_ready',
                  occurredAt: new Date(anchorTimestamp),
                  suggestionRunId: null,
                  approvalRequestId: null,
                  candidateToolKey,
                  summary: `${agent.title} is ready to open a guarded-execution lane for ${candidateToolKey}.`,
                  detail:
                    'Control, launch, and monitor signals are aligned for a narrow guarded-execution opening.',
                });
              } else if (controlStatus === 'pilot_then_open') {
                statusEntries.push({
                  id: `guarded-log:pilot-only:${agent.key}:${candidateToolKey}`,
                  tenantSlug,
                  agentKey: agent.key,
                  eventType: 'guarded_execution_pilot_only',
                  occurredAt: new Date(anchorTimestamp),
                  suggestionRunId: null,
                  approvalRequestId: null,
                  candidateToolKey,
                  summary: `${agent.title} should stay in pilot-only posture for ${candidateToolKey}.`,
                  detail:
                    'Coverage, evidence, or monitoring still need to mature before opening the guarded lane.',
                });
              }
            }

            return [...baseEntries, ...approvalEntries, ...statusEntries];
          }),
        )
      )
        .flat()
        .concat(
          persistedExecutionEvents.map((event) => ({
            id: `guarded-log:persisted:${event.id}`,
            tenantSlug: event.tenantSlug,
            agentKey: event.agentKey,
            eventType:
              event.eventType === 'executed'
                ? ('guarded_execution_executed' as const)
                : ('guarded_execution_rolled_back' as const),
            occurredAt: event.occurredAt,
            suggestionRunId: event.suggestionRunId,
            approvalRequestId: event.approvalRequestId,
            candidateToolKey: event.toolKey,
            summary: event.summary,
            detail: event.detail,
          })),
        )
        .flat()
        .sort((left, right) => {
          const byTime = right.occurredAt.getTime() - left.occurredAt.getTime();
          if (byTime !== 0) {
            return byTime;
          }

          return left.id.localeCompare(right.id);
        });

      return toAiGuardedExecutionEventLogWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          totalEvents: entries.length,
          suggestionRunPreparedEvents: entries.filter(
            (entry) => entry.eventType === 'suggestion_run_prepared',
          ).length,
          approvalRequestedEvents: entries.filter(
            (entry) => entry.eventType === 'approval_requested',
          ).length,
          approvalReviewedEvents: entries.filter(
            (entry) => entry.eventType === 'approval_reviewed',
          ).length,
          executedEvents: entries.filter(
            (entry) => entry.eventType === 'guarded_execution_executed',
          ).length,
          rolledBackEvents: entries.filter(
            (entry) => entry.eventType === 'guarded_execution_rolled_back',
          ).length,
          guardedExecutionStatusEvents: entries.filter(
            (entry) =>
              entry.eventType === 'guarded_execution_pilot_only' ||
              entry.eventType === 'guarded_execution_lane_ready',
          ).length,
        },
        entries,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/operations-summary')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiOperationsSummary(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiOperationsSummaryResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgentKeys = this.getAccessibleReadyAiWorkspaceAgentKeys(
      tenantAccess?.permissionKeys,
    );

    if (accessibleAgentKeys.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant operations summary.',
      );
    }

    try {
      const agentCatalog = this.listAiAgentCatalogUseCase.execute();
      const agentCatalogByKey = new Map(
        agentCatalog.map((entry) => [entry.key, entry] as const),
      );
      const [approvalRequestsByAgent, suggestionRunsByAgent] = await Promise.all([
        Promise.all(
          accessibleAgentKeys.map(async (agentKey) => ({
            agentKey,
            records: await this.listTenantAiApprovalRequestsUseCase.execute(
              tenantSlug,
              agentKey,
              {
                limit: null,
                status: null,
              },
            ),
          })),
        ),
        Promise.all(
          accessibleAgentKeys.map(async (agentKey) => ({
            agentKey,
            records: await this.listTenantAiSuggestionRunsUseCase.execute(
              tenantSlug,
              agentKey,
              null,
            ),
          })),
        ),
      ]);

      const approvalRequests = approvalRequestsByAgent
        .flatMap((entry) => entry.records)
        .sort(
          (left, right) =>
            right.createdAt.getTime() - left.createdAt.getTime() ||
            right.updatedAt.getTime() - left.updatedAt.getTime(),
        );
      const suggestionRuns = suggestionRunsByAgent
        .flatMap((entry) => entry.records)
        .sort(
          (left, right) =>
            right.createdAt.getTime() - left.createdAt.getTime() ||
            right.generatedAt.getTime() - left.generatedAt.getTime(),
        );

      const pendingApprovalRequests = approvalRequests.filter(
        (entry) => entry.status === 'pending',
      );
      const reviewedApprovalRequests = approvalRequests.filter(
        (entry) => entry.reviewedAt !== null,
      );
      const reviewableSuggestionRuns = suggestionRuns.filter(
        (entry) =>
          entry.approvalSummary.status === 'not_requested' ||
          entry.approvalSummary.status === 'rejected',
      );
      const latestReviewedApprovalRequest = reviewedApprovalRequests
        .slice()
        .sort(
          (left, right) =>
            (right.reviewedAt?.getTime() ?? 0) -
            (left.reviewedAt?.getTime() ?? 0),
        )[0] ?? null;
      const oldestPendingApprovalRequest = pendingApprovalRequests
        .slice()
        .sort(
          (left, right) =>
            left.createdAt.getTime() - right.createdAt.getTime() ||
            left.updatedAt.getTime() - right.updatedAt.getTime(),
        )[0] ?? null;

      return toAiOperationsSummaryResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        actionCenter: {
          tenantSlug,
          generatedAt: new Date(),
          counts: {
            pendingApprovalRequests: pendingApprovalRequests.length,
            reviewableSuggestionRuns: reviewableSuggestionRuns.length,
            reviewedApprovalRequests: reviewedApprovalRequests.length,
          },
          featuredPendingApprovalRequest: pendingApprovalRequests[0] ?? null,
          featuredReviewableSuggestionRun: reviewableSuggestionRuns[0] ?? null,
          latestReviewedApprovalRequest,
        },
        handoffWorkspace: {
          counts: {
            totalSuggestionRuns: suggestionRuns.length,
            reviewableSuggestionRuns: reviewableSuggestionRuns.length,
            pendingApprovalSuggestionRuns: suggestionRuns.filter(
              (entry) => entry.approvalSummary.status === 'pending',
            ).length,
            approvedSuggestionRuns: suggestionRuns.filter(
              (entry) => entry.approvalSummary.status === 'approved',
            ).length,
          },
          agentBreakdown: suggestionRunsByAgent.map(({ agentKey, records }) => ({
            agentKey,
            title: agentCatalogByKey.get(agentKey)?.title ?? agentKey,
            totalSuggestionRuns: records.length,
            reviewableSuggestionRuns: records.filter(
              (entry) =>
                entry.approvalSummary.status === 'not_requested' ||
                entry.approvalSummary.status === 'rejected',
            ).length,
            pendingApprovalSuggestionRuns: records.filter(
              (entry) => entry.approvalSummary.status === 'pending',
            ).length,
            approvedSuggestionRuns: records.filter(
              (entry) => entry.approvalSummary.status === 'approved',
            ).length,
            latestGeneratedAt: records[0]?.generatedAt?.toISOString() ?? null,
          })),
          latestSuggestionRun: suggestionRuns[0] ?? null,
        },
        approvalWorkspace: {
          counts: {
            totalApprovalRequests: approvalRequests.length,
            pendingApprovalRequests: pendingApprovalRequests.length,
            approvedApprovalRequests: approvalRequests.filter(
              (entry) => entry.status === 'approved',
            ).length,
            rejectedApprovalRequests: approvalRequests.filter(
              (entry) => entry.status === 'rejected',
            ).length,
          },
          agentBreakdown: approvalRequestsByAgent.map(({ agentKey, records }) => ({
            agentKey,
            title: agentCatalogByKey.get(agentKey)?.title ?? agentKey,
            totalApprovalRequests: records.length,
            pendingApprovalRequests: records.filter(
              (entry) => entry.status === 'pending',
            ).length,
            approvedApprovalRequests: records.filter(
              (entry) => entry.status === 'approved',
            ).length,
            rejectedApprovalRequests: records.filter(
              (entry) => entry.status === 'rejected',
            ).length,
            latestRequestedAt: records[0]?.createdAt?.toISOString() ?? null,
            latestReviewedAt:
              records
                .filter((entry) => entry.reviewedAt !== null)
                .sort(
                  (left, right) =>
                    (right.reviewedAt?.getTime() ?? 0) -
                    (left.reviewedAt?.getTime() ?? 0),
                )[0]?.reviewedAt?.toISOString() ?? null,
          })),
          oldestPendingApprovalRequest,
          latestReviewedApprovalRequest,
        },
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/action-center')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiActionCenter(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiActionCenterResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgentKeys = this.getAccessibleReadyAiWorkspaceAgentKeys(
      tenantAccess?.permissionKeys,
    );

    if (accessibleAgentKeys.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant action center.',
      );
    }

    try {
      const [approvalRequestsByAgent, suggestionRunsByAgent] = await Promise.all([
        Promise.all(
          accessibleAgentKeys.map((agentKey) =>
            this.listTenantAiApprovalRequestsUseCase.execute(
              tenantSlug,
              agentKey,
              {
                limit: null,
                status: null,
              },
            ),
          ),
        ),
        Promise.all(
          accessibleAgentKeys.map((agentKey) =>
            this.listTenantAiSuggestionRunsUseCase.execute(
              tenantSlug,
              agentKey,
              null,
            ),
          ),
        ),
      ]);

      const approvalRequests = approvalRequestsByAgent
        .flat()
        .sort(
          (left, right) =>
            right.createdAt.getTime() - left.createdAt.getTime() ||
            right.updatedAt.getTime() - left.updatedAt.getTime(),
        );
      const suggestionRuns = suggestionRunsByAgent
        .flat()
        .sort(
          (left, right) =>
            right.createdAt.getTime() - left.createdAt.getTime() ||
            right.generatedAt.getTime() - left.generatedAt.getTime(),
        );

      const pendingApprovalRequests = approvalRequests.filter(
        (entry) => entry.status === 'pending',
      );
      const reviewedApprovalRequests = approvalRequests.filter(
        (entry) => entry.reviewedAt !== null,
      );
      const reviewableSuggestionRuns = suggestionRuns.filter(
        (entry) =>
          entry.approvalSummary.status === 'not_requested' ||
          entry.approvalSummary.status === 'rejected',
      );

      return toAiActionCenterResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts: {
          pendingApprovalRequests: pendingApprovalRequests.length,
          reviewableSuggestionRuns: reviewableSuggestionRuns.length,
          reviewedApprovalRequests: reviewedApprovalRequests.length,
        },
        featuredPendingApprovalRequest: pendingApprovalRequests[0] ?? null,
        featuredReviewableSuggestionRun: reviewableSuggestionRuns[0] ?? null,
        latestReviewedApprovalRequest: reviewedApprovalRequests.sort(
          (left, right) =>
            (right.reviewedAt?.getTime() ?? 0) -
            (left.reviewedAt?.getTime() ?? 0),
        )[0] ?? null,
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/handoff-workspace')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiHandoffWorkspace(
    @Param('slug') slug: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiHandoffWorkspaceResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgentKeys = this.getAccessibleReadyAiWorkspaceAgentKeys(
      tenantAccess?.permissionKeys,
    );

    if (accessibleAgentKeys.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant handoff workspace.',
      );
    }

    try {
      const agentCatalog = this.listAiAgentCatalogUseCase.execute();
      const agentCatalogByKey = new Map(
        agentCatalog.map((entry) => [entry.key, entry] as const),
      );
      const suggestionRunsByAgent = await Promise.all(
        accessibleAgentKeys.map(async (agentKey) => ({
          agentKey,
          records: await this.listTenantAiSuggestionRunsUseCase.execute(
            tenantSlug,
            agentKey,
            null,
          ),
        })),
      );

      const suggestionRuns = suggestionRunsByAgent
        .flatMap((entry) => entry.records)
        .sort(
          (left, right) =>
            right.createdAt.getTime() - left.createdAt.getTime() ||
            right.generatedAt.getTime() - left.generatedAt.getTime(),
        );

      const counts = {
        totalSuggestionRuns: suggestionRuns.length,
        reviewableSuggestionRuns: suggestionRuns.filter(
          (entry) =>
            entry.approvalSummary.status === 'not_requested' ||
            entry.approvalSummary.status === 'rejected',
        ).length,
        pendingApprovalSuggestionRuns: suggestionRuns.filter(
          (entry) => entry.approvalSummary.status === 'pending',
        ).length,
        approvedSuggestionRuns: suggestionRuns.filter(
          (entry) => entry.approvalSummary.status === 'approved',
        ).length,
      };

      return toAiHandoffWorkspaceResponseDto({
        tenantSlug,
        generatedAt: new Date(),
        counts,
        agentBreakdown: suggestionRunsByAgent.map(({ agentKey, records }) => ({
          agentKey,
          title:
            agentCatalogByKey.get(agentKey)?.title ?? agentKey,
          totalSuggestionRuns: records.length,
          reviewableSuggestionRuns: records.filter(
            (entry) =>
              entry.approvalSummary.status === 'not_requested' ||
              entry.approvalSummary.status === 'rejected',
          ).length,
          pendingApprovalSuggestionRuns: records.filter(
            (entry) => entry.approvalSummary.status === 'pending',
          ).length,
          approvedSuggestionRuns: records.filter(
            (entry) => entry.approvalSummary.status === 'approved',
          ).length,
          latestGeneratedAt: records[0]?.generatedAt ?? null,
        })),
        recentSuggestionRuns: suggestionRuns.slice(0, limit),
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/suggestion-runs')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async listTenantAiSuggestionWorkspace(
    @Param('slug') slug: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiSuggestionRunResponseDto[]> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgentKeys = this.getAccessibleReadyAiWorkspaceAgentKeys(
      tenantAccess?.permissionKeys,
    );

    if (accessibleAgentKeys.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant suggestion workspace.',
      );
    }

    try {
      const recordsByAgent = await Promise.all(
        accessibleAgentKeys.map((agentKey) =>
          this.listTenantAiSuggestionRunsUseCase.execute(
            tenantSlug,
            agentKey,
            limit,
          ),
        ),
      );

      return recordsByAgent
        .flat()
        .sort(
          (left, right) =>
            right.createdAt.getTime() - left.createdAt.getTime() ||
            right.generatedAt.getTime() - left.generatedAt.getTime(),
        )
        .slice(0, limit)
        .map((entry) => toAiSuggestionRunResponseDto(entry));
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/suggestion-runs/:runId')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiSuggestionWorkspaceDetail(
    @Param('slug') slug: string,
    @Param('runId') runId: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiSuggestionRunDetailResponseDto> {
    const tenantSlug = tenantAccess?.tenantSlug ?? slug;
    const accessibleAgentKeys = this.getAccessibleReadyAiWorkspaceAgentKeys(
      tenantAccess?.permissionKeys,
    );

    if (accessibleAgentKeys.length === 0) {
      throw new ForbiddenException(
        'At least one AI agent permission is required for the tenant suggestion workspace.',
      );
    }

    for (const agentKey of accessibleAgentKeys) {
      try {
        const record = await this.getTenantAiSuggestionRunDetailUseCase.execute(
          tenantSlug,
          agentKey,
          runId,
        );

        return toAiSuggestionRunDetailResponseDto(record);
      } catch (error) {
        if (
          error instanceof AiSuggestionRunNotFoundError ||
          error instanceof AiAgentNotFoundError
        ) {
          continue;
        }

        if (error instanceof TenantNotFoundError) {
          throw new NotFoundException(error.message);
        }

        throw error;
      }
    }

    throw new NotFoundException(
      `AI suggestion run ${runId} was not found for tenant ${tenantSlug}.`,
    );
  }

  @Get('tenants/:slug/agents/:agentKey/suggestion-runs')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async listTenantAiSuggestionRuns(
    @Param('slug') slug: string,
    @Param('agentKey') agentKey: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiSuggestionRunResponseDto[]> {
    try {
      this.assertAgentPermission(agentKey, tenantAccess?.permissionKeys);

      const records = await this.listTenantAiSuggestionRunsUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        agentKey,
        limit,
      );

      return records.map((entry) => toAiSuggestionRunResponseDto(entry));
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get('tenants/:slug/agents/:agentKey/suggestion-runs/:runId')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async getTenantAiSuggestionRunDetail(
    @Param('slug') slug: string,
    @Param('agentKey') agentKey: string,
    @Param('runId') runId: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiSuggestionRunDetailResponseDto> {
    try {
      this.assertAgentPermission(agentKey, tenantAccess?.permissionKeys);

      const record = await this.getTenantAiSuggestionRunDetailUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        agentKey,
        runId,
      );

      return toAiSuggestionRunDetailResponseDto(record);
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof AiSuggestionRunNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post('tenants/:slug/agents/:agentKey/suggestion-runs')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async prepareTenantAiSuggestionRun(
    @Param('slug') slug: string,
    @Param('agentKey') agentKey: string,
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserContext | undefined,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiSuggestionRunResponseDto> {
    if (!authenticatedUser) {
      throw new NotFoundException('Authenticated user context is required.');
    }

    try {
      this.assertAgentPermission(agentKey, tenantAccess?.permissionKeys);

      const record = await this.prepareTenantAiSuggestionRunUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        agentKey,
        requestedByUserId: authenticatedUser.id,
        requestedByEmail: authenticatedUser.email,
      });

      return toAiSuggestionRunResponseDto({
        ...record,
        approvalSummary: buildInitialAiSuggestionRunApprovalSummary(),
      });
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post('tenants/:slug/agents/:agentKey/suggestion-runs/:runId/approval-requests')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async requestTenantAiSuggestionRunApproval(
    @Param('slug') slug: string,
    @Param('agentKey') agentKey: string,
    @Param('runId') runId: string,
    @Body() body: CreateAiApprovalRequestRequestDto,
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserContext | undefined,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiApprovalRequestResponseDto> {
    if (!authenticatedUser) {
      throw new NotFoundException('Authenticated user context is required.');
    }

    try {
      this.assertAgentPermission(agentKey, tenantAccess?.permissionKeys);

      const record =
        await this.requestTenantAiSuggestionRunApprovalUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          agentKey,
          suggestionRunId: runId,
          requestedByUserId: authenticatedUser.id,
          requestedByEmail: authenticatedUser.email,
          rationale: body.rationale ?? null,
        });

      return toAiApprovalRequestResponseDto(record);
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof AiApprovalPolicyNotFoundError ||
        error instanceof AiSuggestionRunNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof AiApprovalRequestAlreadyPendingError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  @Post('tenants/:slug/agents/:agentKey/approval-requests/:requestId/review')
  @HttpCode(200)
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async reviewTenantAiApprovalRequest(
    @Param('slug') slug: string,
    @Param('agentKey') agentKey: string,
    @Param('requestId') requestId: string,
    @Body() body: ReviewAiApprovalRequestRequestDto,
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserContext | undefined,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiApprovalRequestResponseDto> {
    if (!authenticatedUser) {
      throw new NotFoundException('Authenticated user context is required.');
    }

    try {
      this.assertAgentPermission(agentKey, tenantAccess?.permissionKeys);

      const record = await this.reviewTenantAiApprovalRequestUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        agentKey,
        requestId,
        status: body.status,
        reviewedByUserId: authenticatedUser.id,
        reviewedByEmail: authenticatedUser.email,
        reviewNote: body.reviewNote ?? null,
      });

      if (record.status === 'approved' || record.status === 'rejected') {
        await this.captureAiApprovalMemory({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          agentKey,
          approvalRequestId: record.id,
          suggestionRunId: record.suggestionRunId,
          policyKey: record.policyKey,
          status: record.status,
          reviewNote: record.reviewNote,
          actorUserId: authenticatedUser.id,
          actorEmail: authenticatedUser.email,
        });
      }

      return toAiApprovalRequestResponseDto(record);
    } catch (error) {
      if (
        error instanceof AiApprovalRequestNotFoundError ||
        error instanceof TenantNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof AiApprovalRequestAlreadyReviewedError) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  @Post('tenants/:slug/agents/:agentKey/approval-requests/:requestId/guarded-execution')
  @HttpCode(200)
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async executeTenantAiGuardedExecution(
    @Param('slug') slug: string,
    @Param('agentKey') agentKey: string,
    @Param('requestId') requestId: string,
    @Body() body: ExecuteAiGuardedExecutionRequestDto,
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserContext | undefined,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiGuardedExecutionExecutionResponseDto> {
    if (!authenticatedUser) {
      throw new NotFoundException('Authenticated user context is required.');
    }

    const tenantSlug = tenantAccess?.tenantSlug ?? slug;

    try {
      this.assertAgentPermission(agentKey, tenantAccess?.permissionKeys);

      const candidateToolKey = this.getGuardedExecutionCandidateToolKey(agentKey);

      const approvalRequests =
        await this.listTenantAiApprovalRequestsUseCase.execute(
          tenantSlug,
          agentKey,
          {
            limit: null,
            status: null,
          },
        );
      const approvalRequest =
        approvalRequests.find((entry) => entry.id === requestId) ?? null;

      if (!approvalRequest) {
        throw new NotFoundException(
          `AI approval request ${requestId} was not found.`,
        );
      }

      if (approvalRequest.status !== 'approved') {
        throw new ConflictException(
          `AI approval request ${requestId} must be approved before guarded execution.`,
        );
      }

      if (candidateToolKey === 'growth_case_assignment_execution') {
        if (!body.caseId) {
          throw new BadRequestException(
            'caseId is required for growth guarded execution.',
          );
        }

        const operationalCase =
          await this.takeTenantGrowthOperationalCaseUseCase.execute({
            tenantSlug,
            caseId: body.caseId,
            assignedUserId: authenticatedUser.id,
            assignedUserEmail: authenticatedUser.email,
          });

        const summary = `Guarded execution completed for ${candidateToolKey} after approved request ${approvalRequest.id}.`;
        const detail = `Operational case ${operationalCase.id} is now assigned to ${authenticatedUser.email ?? authenticatedUser.id} under the named human gate.`;

        await this.createTenantAiGuardedExecutionEventUseCase.execute({
          tenantSlug,
          agentKey,
          eventType: 'executed',
          approvalRequestId: approvalRequest.id,
          suggestionRunId: approvalRequest.suggestionRunId,
          toolKey: candidateToolKey,
          caseId: operationalCase.id,
          safeFallbackMode: null,
          summary,
          detail,
          occurredAt: operationalCase.updatedAt,
          createdByUserId: authenticatedUser.id,
          createdByEmail: authenticatedUser.email,
        });

        await this.captureAiGuardedExecutionMemory({
          tenantSlug,
          agentKey,
          approvalRequestId: approvalRequest.id,
          suggestionRunId: approvalRequest.suggestionRunId,
          toolKey: candidateToolKey,
          targetId: operationalCase.id,
          eventType: 'executed',
          safeFallbackMode: null,
          occurredAt: operationalCase.updatedAt,
          actorUserId: authenticatedUser.id,
          actorEmail: authenticatedUser.email,
        });

        return toAiGuardedExecutionExecutionResponseDto({
          tenantSlug,
          agentKey,
          approvalRequestId: approvalRequest.id,
          suggestionRunId: approvalRequest.suggestionRunId,
          toolKey: candidateToolKey,
          targetKind: 'growth_operational_case',
          executedAt: operationalCase.updatedAt,
          summary,
          detail,
          operationalCase,
        });
      }

      if (candidateToolKey === 'invoice_payment_collection_execution') {
        if (!body.invoiceId) {
          throw new BadRequestException(
            'invoiceId is required for invoicing guarded execution.',
          );
        }

        const invoiceDetail = await this.getTenantInvoiceDetailUseCase.execute(
          tenantSlug,
          body.invoiceId,
        );

        if (invoiceDetail.settlement.balanceDueInCents <= 0) {
          throw new ConflictException(
            `Invoice ${body.invoiceId} has no outstanding balance for guarded payment posting.`,
          );
        }

        const payment =
          await this.createTenantInvoicePaymentUseCase.execute({
            tenantSlug,
            invoiceId: body.invoiceId,
            amountInCents: invoiceDetail.settlement.balanceDueInCents,
            method: 'ai_guarded_execution',
            reference: `ai-approval:${approvalRequest.id}`,
            notes: `Guarded execution payment posted from approval request ${approvalRequest.id}.`,
          });
        const updatedInvoiceDetail =
          await this.getTenantInvoiceDetailUseCase.execute(
            tenantSlug,
            body.invoiceId,
          );

        const summary = `Guarded execution completed for ${candidateToolKey} after approved request ${approvalRequest.id}.`;
        const detail = `Invoice ${body.invoiceId} received guarded payment ${payment.id} for ${payment.amountInCents} ${payment.currency} under the named human gate.`;

        await this.createTenantAiGuardedExecutionEventUseCase.execute({
          tenantSlug,
          agentKey,
          eventType: 'executed',
          approvalRequestId: approvalRequest.id,
          suggestionRunId: approvalRequest.suggestionRunId,
          toolKey: candidateToolKey,
          caseId: body.invoiceId,
          safeFallbackMode: null,
          summary,
          detail,
          occurredAt: payment.updatedAt,
          createdByUserId: authenticatedUser.id,
          createdByEmail: authenticatedUser.email,
        });

        await this.captureAiGuardedExecutionMemory({
          tenantSlug,
          agentKey,
          approvalRequestId: approvalRequest.id,
          suggestionRunId: approvalRequest.suggestionRunId,
          toolKey: candidateToolKey,
          targetId: body.invoiceId,
          eventType: 'executed',
          safeFallbackMode: null,
          occurredAt: payment.updatedAt,
          actorUserId: authenticatedUser.id,
          actorEmail: authenticatedUser.email,
        });

        return toAiGuardedExecutionExecutionResponseDto({
          tenantSlug,
          agentKey,
          approvalRequestId: approvalRequest.id,
          suggestionRunId: approvalRequest.suggestionRunId,
          toolKey: candidateToolKey,
          targetKind: 'invoice_payment',
          executedAt: payment.updatedAt,
          summary,
          detail,
          invoice: updatedInvoiceDetail,
          payment,
        });
      }

      throw new BadRequestException(
        `AI agent ${agentKey} does not support a guarded execution lane yet.`,
      );
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError ||
        error instanceof GrowthOperationalCaseNotFoundError ||
        error instanceof InvoiceNotFoundError ||
        error instanceof PaymentNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      if (
        error instanceof InvalidInvoicePaymentStateError ||
        error instanceof InvoicePaymentExceedsBalanceError
      ) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  @Post('tenants/:slug/agents/:agentKey/approval-requests/:requestId/guarded-execution-rollback')
  @HttpCode(200)
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  async rollbackTenantAiGuardedExecution(
    @Param('slug') slug: string,
    @Param('agentKey') agentKey: string,
    @Param('requestId') requestId: string,
    @Body() body: ExecuteAiGuardedExecutionRequestDto,
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserContext | undefined,
    @TenantAccess() tenantAccess?: { tenantSlug?: string; permissionKeys?: string[] },
  ): Promise<AiGuardedExecutionRollbackExecutionResponseDto> {
    if (!authenticatedUser) {
      throw new NotFoundException('Authenticated user context is required.');
    }

    const tenantSlug = tenantAccess?.tenantSlug ?? slug;

    try {
      this.assertAgentPermission(agentKey, tenantAccess?.permissionKeys);

      const candidateToolKey = this.getGuardedExecutionCandidateToolKey(agentKey);

      const approvalRequests =
        await this.listTenantAiApprovalRequestsUseCase.execute(
          tenantSlug,
          agentKey,
          {
            limit: null,
            status: null,
          },
        );
      const approvalRequest =
        approvalRequests.find((entry) => entry.id === requestId) ?? null;

      if (!approvalRequest) {
        throw new NotFoundException(
          `AI approval request ${requestId} was not found.`,
        );
      }

      if (approvalRequest.status !== 'approved') {
        throw new ConflictException(
          `AI approval request ${requestId} must be approved before guarded execution rollback.`,
        );
      }

      if (candidateToolKey === 'growth_case_assignment_execution') {
        if (!body.caseId) {
          throw new BadRequestException(
            'caseId is required for growth guarded execution rollback.',
          );
        }

        const operationalCase =
          await this.releaseTenantGrowthOperationalCaseUseCase.execute({
            tenantSlug,
            caseId: body.caseId,
          });

        const summary = `Guarded execution rolled back for ${candidateToolKey} after approved request ${approvalRequest.id}.`;
        const detail = `Operational case ${operationalCase.id} returned to explicit human-only handling for ${authenticatedUser.email ?? authenticatedUser.id}.`;

        await this.createTenantAiGuardedExecutionEventUseCase.execute({
          tenantSlug,
          agentKey,
          eventType: 'rolled_back',
          approvalRequestId: approvalRequest.id,
          suggestionRunId: approvalRequest.suggestionRunId,
          toolKey: candidateToolKey,
          caseId: operationalCase.id,
          safeFallbackMode: 'suggestion_only',
          summary,
          detail,
          occurredAt: operationalCase.updatedAt,
          createdByUserId: authenticatedUser.id,
          createdByEmail: authenticatedUser.email,
        });

        await this.captureAiGuardedExecutionMemory({
          tenantSlug,
          agentKey,
          approvalRequestId: approvalRequest.id,
          suggestionRunId: approvalRequest.suggestionRunId,
          toolKey: candidateToolKey,
          targetId: operationalCase.id,
          eventType: 'rolled_back',
          safeFallbackMode: 'suggestion_only',
          occurredAt: operationalCase.updatedAt,
          actorUserId: authenticatedUser.id,
          actorEmail: authenticatedUser.email,
        });

        return toAiGuardedExecutionRollbackExecutionResponseDto({
          tenantSlug,
          agentKey,
          approvalRequestId: approvalRequest.id,
          suggestionRunId: approvalRequest.suggestionRunId,
          toolKey: candidateToolKey,
          targetKind: 'growth_operational_case',
          rolledBackAt: operationalCase.updatedAt,
          summary,
          detail,
          operationalCase,
        });
      }

      if (candidateToolKey === 'invoice_payment_collection_execution') {
        if (!body.invoiceId) {
          throw new BadRequestException(
            'invoiceId is required for invoicing guarded execution rollback.',
          );
        }

        const invoiceDetail = await this.getTenantInvoiceDetailUseCase.execute(
          tenantSlug,
          body.invoiceId,
        );
        const matchingPayment = [...invoiceDetail.payments]
          .reverse()
          .find(
            (entry) =>
              entry.reference === `ai-approval:${approvalRequest.id}` &&
              entry.status === 'posted' &&
              entry.reversedAt === null,
          );

        if (!matchingPayment) {
          throw new NotFoundException(
            `No guarded payment linked to approval request ${approvalRequest.id} was found for invoice ${body.invoiceId}.`,
          );
        }

        const payment =
          await this.reverseTenantInvoicePaymentUseCase.execute({
            tenantSlug,
            invoiceId: body.invoiceId,
            paymentId: matchingPayment.id,
            reason: `Guarded execution rollback for approval request ${approvalRequest.id}.`,
          });
        const updatedInvoiceDetail =
          await this.getTenantInvoiceDetailUseCase.execute(
            tenantSlug,
            body.invoiceId,
          );

        const summary = `Guarded execution rolled back for ${candidateToolKey} after approved request ${approvalRequest.id}.`;
        const detail = `Invoice ${body.invoiceId} reversed guarded payment ${payment.id} and returned the lane to explicit human-only handling.`;

        await this.createTenantAiGuardedExecutionEventUseCase.execute({
          tenantSlug,
          agentKey,
          eventType: 'rolled_back',
          approvalRequestId: approvalRequest.id,
          suggestionRunId: approvalRequest.suggestionRunId,
          toolKey: candidateToolKey,
          caseId: body.invoiceId,
          safeFallbackMode: 'suggestion_only',
          summary,
          detail,
          occurredAt: payment.updatedAt,
          createdByUserId: authenticatedUser.id,
          createdByEmail: authenticatedUser.email,
        });

        await this.captureAiGuardedExecutionMemory({
          tenantSlug,
          agentKey,
          approvalRequestId: approvalRequest.id,
          suggestionRunId: approvalRequest.suggestionRunId,
          toolKey: candidateToolKey,
          targetId: body.invoiceId,
          eventType: 'rolled_back',
          safeFallbackMode: 'suggestion_only',
          occurredAt: payment.updatedAt,
          actorUserId: authenticatedUser.id,
          actorEmail: authenticatedUser.email,
        });

        return toAiGuardedExecutionRollbackExecutionResponseDto({
          tenantSlug,
          agentKey,
          approvalRequestId: approvalRequest.id,
          suggestionRunId: approvalRequest.suggestionRunId,
          toolKey: candidateToolKey,
          targetKind: 'invoice_payment',
          rolledBackAt: payment.updatedAt,
          summary,
          detail,
          invoice: updatedInvoiceDetail,
          payment,
        });
      }

      throw new BadRequestException(
        `AI agent ${agentKey} does not support a guarded execution rollback lane yet.`,
      );
    } catch (error) {
      if (
        error instanceof AiAgentNotFoundError ||
        error instanceof TenantNotFoundError ||
        error instanceof GrowthOperationalCaseNotFoundError ||
        error instanceof InvoiceNotFoundError ||
        error instanceof PaymentNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      if (
        error instanceof InvalidInvoicePaymentStateError ||
        error instanceof InvoicePaymentExceedsBalanceError
      ) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  private assertAgentPermission(
    agentKey: string,
    permissionKeys: string[] | undefined,
  ): void {
    const requiredPermission = this.getRequiredPermissionForAgent(agentKey);

    if (!permissionKeys?.includes(requiredPermission)) {
      throw new ForbiddenException(
        `Permission "${requiredPermission}" is required for AI agent ${agentKey}.`,
      );
    }
  }

  private parseApprovalRequestStatusFilter(
    status: string | undefined,
  ): AiApprovalRequestStatus | null {
    if (!status) {
      return null;
    }

    if (
      !AiController.APPROVAL_REQUEST_STATUSES.includes(
        status as AiApprovalRequestStatus,
      )
    ) {
      throw new BadRequestException(
        `Unsupported AI approval request status "${status}".`,
      );
    }

    return status as AiApprovalRequestStatus;
  }

  private parseActivityEventTypeFilter(
    type: string | undefined,
  ): AiActivityEventTypeResponseDto | null {
    if (!type) {
      return null;
    }

    if (
      !AiController.ACTIVITY_EVENT_TYPES.includes(
        type as AiActivityEventTypeResponseDto,
      )
    ) {
      throw new BadRequestException(
        `Unsupported AI activity feed type "${type}".`,
      );
    }

    return type as AiActivityEventTypeResponseDto;
  }

  private parseMemoryScopeFilter(
    scope: string | undefined,
  ): Array<'tenant' | 'domain' | 'agent'> | null {
    if (!scope) {
      return null;
    }

    if (!['tenant', 'domain', 'agent'].includes(scope)) {
      throw new BadRequestException(
        `Unsupported AI memory record scope "${scope}".`,
      );
    }

    return [scope as 'tenant' | 'domain' | 'agent'];
  }

  private parseMemoryStatusFilter(
    status: string | undefined,
  ): Array<'active' | 'inactive'> | null {
    if (!status || status === 'all') {
      return null;
    }

    if (!['active', 'inactive'].includes(status)) {
      throw new BadRequestException(
        `Unsupported AI memory record status "${status}".`,
      );
    }

    return [status as 'active' | 'inactive'];
  }

  private getAccessibleReadyAiWorkspaceAgentKeys(
    permissionKeys: string[] | undefined,
  ): string[] {
    return this.listAiAgentCatalogUseCase
      .execute()
      .filter((entry) => entry.availability === 'ready')
      .map((entry) => entry.key)
      .filter((agentKey) => this.hasAgentPermission(agentKey, permissionKeys));
  }

  private hasAgentPermission(
    agentKey: string,
    permissionKeys: string[] | undefined,
  ): boolean {
    return permissionKeys?.includes(this.getRequiredPermissionForAgent(agentKey)) ?? false;
  }

  private getRequiredPermissionForAgent(agentKey: string): string {
    return agentKey === 'invoice-document-assistant'
      ? INVOICING_PERMISSIONS.REPORTS_READ
      : GROWTH_PERMISSIONS.CONVERSATIONS_READ;
  }

  private getAccessibleDomainKeys(
    permissionKeys: string[] | undefined,
  ): Array<'growth' | 'invoicing' | 'ecommerce'> {
    return Array.from(
      new Set(
        this.getAccessibleReadyAiWorkspaceAgentKeys(permissionKeys).map((entry) =>
          this.getAgentDomainKey(entry),
        ),
      ),
    );
  }

  private getAgentDomainKey(
    agentKey: string,
  ): 'growth' | 'invoicing' | 'ecommerce' {
    const agent = this.listAiAgentCatalogUseCase
      .execute()
      .find((entry) => entry.key === agentKey);

    if (!agent) {
      throw new NotFoundException(`AI agent ${agentKey} was not found.`);
    }

    return agent.domainKey;
  }

  private isVisibleAiMemoryRecord(
    record: {
      scope: 'tenant' | 'domain' | 'agent';
      domainKey: 'growth' | 'invoicing' | 'ecommerce' | null;
      agentKey: string | null;
    },
    accessibleDomainKeys: Array<'growth' | 'invoicing' | 'ecommerce'>,
    accessibleAgentKeys: string[],
  ): boolean {
    if (record.scope === 'tenant') {
      return true;
    }

    if (record.scope === 'domain') {
      return !!record.domainKey && accessibleDomainKeys.includes(record.domainKey);
    }

    return !!record.agentKey && accessibleAgentKeys.includes(record.agentKey);
  }

  private assertAtLeastOneAiPermission(
    permissionKeys: string[] | undefined,
    message: string,
  ): void {
    if (this.getAccessibleReadyAiWorkspaceAgentKeys(permissionKeys).length === 0) {
      throw new ForbiddenException(message);
    }
  }

  private getGuardedExecutionCandidateToolKey(agentKey: string): string | null {
    return (
      this.getAiAgentToolAccessByAgentKeyUseCase
        .execute(agentKey)
        .find(
          (entry) =>
            entry.tool.executionBoundary.executionMode ===
            'guarded_execution_planned',
        )?.tool.key ?? null
    );
  }

  private async captureAiApprovalMemory(input: {
    tenantSlug: string;
    agentKey: string;
    approvalRequestId: string;
    suggestionRunId: string;
    policyKey: string;
    status: 'approved' | 'rejected';
    reviewNote: string | null;
    actorUserId: string;
    actorEmail: string | null;
  }): Promise<void> {
    const decisionLabel = input.status === 'approved' ? 'approved' : 'rejected';

    // Memory automation should never block the primary audited review path.
    await this.createTenantAiMemoryRecordUseCase
      .execute({
        tenantSlug: input.tenantSlug,
        scope: 'agent',
        domainKey: this.getAgentDomainKey(input.agentKey),
        agentKey: input.agentKey,
        sourceKind: 'approval_memory',
        freshness:
          input.status === 'approved' ? 'durable_memory' : 'working_memory',
        title: `Approval review: ${input.policyKey}`,
        summary: `Human review ${decisionLabel} ${input.suggestionRunId} for ${input.agentKey} under ${input.policyKey}.`,
        detail: input.reviewNote
          ? `Approval request ${input.approvalRequestId} was ${decisionLabel} for suggestion run ${input.suggestionRunId}. Reviewer note: ${input.reviewNote}`
          : `Approval request ${input.approvalRequestId} was ${decisionLabel} for suggestion run ${input.suggestionRunId} without an additional review note.`,
        tags: [
          `agent:${input.agentKey}`,
          `policy:${input.policyKey}`,
          `decision:${decisionLabel}`,
          `run:${input.suggestionRunId}`,
          `request:${input.approvalRequestId}`,
        ],
        createdByUserId: input.actorUserId,
        createdByEmail: input.actorEmail,
      })
      .catch(() => undefined);
  }

  private async captureAiGuardedExecutionMemory(input: {
    tenantSlug: string;
    agentKey: string;
    approvalRequestId: string;
    suggestionRunId: string;
    toolKey: string;
    targetId: string;
    eventType: 'executed' | 'rolled_back';
    safeFallbackMode: string | null;
    occurredAt: Date;
    actorUserId: string;
    actorEmail: string | null;
  }): Promise<void> {
    const eventLabel =
      input.eventType === 'executed' ? 'executed' : 'rolled back';

    // Memory automation should never block the primary audited execution path.
    await this.createTenantAiMemoryRecordUseCase
      .execute({
        tenantSlug: input.tenantSlug,
        scope: 'agent',
        domainKey: this.getAgentDomainKey(input.agentKey),
        agentKey: input.agentKey,
        sourceKind: 'guarded_execution_memory',
        freshness: 'working_memory',
        title: `Guarded execution: ${input.toolKey}`,
        summary: `Guarded execution ${eventLabel} ${input.toolKey} on ${input.targetId} after ${input.approvalRequestId}.`,
        detail:
          input.eventType === 'executed'
            ? `Guarded execution ran ${input.toolKey} for suggestion run ${input.suggestionRunId} on target ${input.targetId} at ${input.occurredAt.toISOString()}.`
            : `Guarded execution rolled back ${input.toolKey} for suggestion run ${input.suggestionRunId} on target ${input.targetId} at ${input.occurredAt.toISOString()}, returning to ${input.safeFallbackMode ?? 'unknown'} mode.`,
        tags: [
          `agent:${input.agentKey}`,
          `tool:${input.toolKey}`,
          `event:${input.eventType}`,
          `target:${input.targetId}`,
          `run:${input.suggestionRunId}`,
        ],
        createdByUserId: input.actorUserId,
        createdByEmail: input.actorEmail,
      })
      .catch(() => undefined);
  }
}
