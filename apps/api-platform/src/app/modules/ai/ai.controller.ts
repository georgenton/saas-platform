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
  AiApprovalRequestResponseDto,
  toAiApprovalRequestResponseDto,
} from './dto/ai-approval-request.response';
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
  AiHandoffWorkspaceResponseDto,
  toAiHandoffWorkspaceResponseDto,
} from './dto/ai-handoff-workspace.response';
import {
  AiOperationsSummaryResponseDto,
  toAiOperationsSummaryResponseDto,
} from './dto/ai-operations-summary.response';

@Controller('ai')
export class AiController {
  private static readonly APPROVAL_REQUEST_STATUSES: AiApprovalRequestStatus[] = [
    'pending',
    'approved',
    'rejected',
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
