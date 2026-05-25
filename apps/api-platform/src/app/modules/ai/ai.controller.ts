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
  AiToolNotFoundError,
  GetAiPromptRegistryEntryByAgentKeyUseCase,
  GetAiApprovalPoliciesByAgentKeyUseCase,
  GetAiAgentToolAccessByAgentKeyUseCase,
  GetAiToolRegistryEntryByKeyUseCase,
  GetTenantAiSuggestionRunDetailUseCase,
  AiAgentNotFoundError,
  GetTenantAiSuggestionEnvelopeUseCase,
  ListTenantAiApprovalRequestsUseCase,
  ListTenantAiSuggestionRunsUseCase,
  ListAiApprovalPoliciesUseCase,
  ListAiAgentCatalogUseCase,
  ListAiPromptRegistryUseCase,
  ListAiToolRegistryUseCase,
  PrepareTenantAiSuggestionRunUseCase,
  RequestTenantAiSuggestionRunApprovalUseCase,
  ReviewTenantAiApprovalRequestUseCase,
  AiSuggestionRunNotFoundError,
  buildInitialAiSuggestionRunApprovalSummary,
} from '@saas-platform/ai-application';
import { AiApprovalRequestStatus } from '@saas-platform/ai-domain';
import { TenantNotFoundError } from '@saas-platform/tenancy-application';
import { GROWTH_PERMISSIONS } from '@saas-platform/growth-application';
import { INVOICING_PERMISSIONS } from '@saas-platform/invoicing-application';
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
  AiOperationsSummaryResponseDto,
  toAiOperationsSummaryResponseDto,
} from './dto/ai-operations-summary.response';
import {
  AiPolicySimulationWorkspaceResponseDto,
  toAiPolicySimulationWorkspaceResponseDto,
} from './dto/ai-policy-simulation-workspace.response';

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
    private readonly getTenantAiSuggestionEnvelopeUseCase: GetTenantAiSuggestionEnvelopeUseCase,
    private readonly getTenantAiSuggestionRunDetailUseCase: GetTenantAiSuggestionRunDetailUseCase,
    private readonly listTenantAiApprovalRequestsUseCase: ListTenantAiApprovalRequestsUseCase,
    private readonly listTenantAiSuggestionRunsUseCase: ListTenantAiSuggestionRunsUseCase,
    private readonly prepareTenantAiSuggestionRunUseCase: PrepareTenantAiSuggestionRunUseCase,
    private readonly requestTenantAiSuggestionRunApprovalUseCase: RequestTenantAiSuggestionRunApprovalUseCase,
    private readonly reviewTenantAiApprovalRequestUseCase: ReviewTenantAiApprovalRequestUseCase,
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
}
