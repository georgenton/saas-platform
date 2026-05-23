import {
  Body,
  ConflictException,
  Controller,
  DefaultValuePipe,
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
  GetAiPromptRegistryEntryByAgentKeyUseCase,
  GetAiApprovalPoliciesByAgentKeyUseCase,
  GetAiAgentToolAccessByAgentKeyUseCase,
  AiAgentNotFoundError,
  GetTenantGrowthAssistAiSuggestionEnvelopeUseCase,
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
} from '@saas-platform/ai-application';
import { TenantNotFoundError } from '@saas-platform/tenancy-application';
import { GROWTH_PERMISSIONS } from '@saas-platform/growth-application';
import { AuthenticatedUser } from '../auth/authenticated-user.decorator';
import { AuthenticatedUserContext } from '../auth/authenticated-user-context';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
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

@Controller('ai')
export class AiController {
  constructor(
    private readonly listAiAgentCatalogUseCase: ListAiAgentCatalogUseCase,
    private readonly listAiApprovalPoliciesUseCase: ListAiApprovalPoliciesUseCase,
    private readonly listAiPromptRegistryUseCase: ListAiPromptRegistryUseCase,
    private readonly listAiToolRegistryUseCase: ListAiToolRegistryUseCase,
    private readonly getAiApprovalPoliciesByAgentKeyUseCase: GetAiApprovalPoliciesByAgentKeyUseCase,
    private readonly getAiPromptRegistryEntryByAgentKeyUseCase: GetAiPromptRegistryEntryByAgentKeyUseCase,
    private readonly getAiAgentToolAccessByAgentKeyUseCase: GetAiAgentToolAccessByAgentKeyUseCase,
    private readonly getTenantGrowthAssistAiSuggestionEnvelopeUseCase: GetTenantGrowthAssistAiSuggestionEnvelopeUseCase,
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
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async getTenantAiSuggestionEnvelope(
    @Param('slug') slug: string,
    @Param('agentKey') agentKey: string,
    @TenantAccess() tenantAccess?: { tenantSlug?: string },
  ): Promise<AiSuggestionEnvelopeResponseDto> {
    try {
      const envelope =
        await this.getTenantGrowthAssistAiSuggestionEnvelopeUseCase.execute(
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
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async listTenantAiApprovalRequests(
    @Param('slug') slug: string,
    @Param('agentKey') agentKey: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @TenantAccess() tenantAccess?: { tenantSlug?: string },
  ): Promise<AiApprovalRequestResponseDto[]> {
    try {
      const records = await this.listTenantAiApprovalRequestsUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        agentKey,
        limit,
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

  @Get('tenants/:slug/agents/:agentKey/suggestion-runs')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async listTenantAiSuggestionRuns(
    @Param('slug') slug: string,
    @Param('agentKey') agentKey: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @TenantAccess() tenantAccess?: { tenantSlug?: string },
  ): Promise<AiSuggestionRunResponseDto[]> {
    try {
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

  @Post('tenants/:slug/agents/:agentKey/suggestion-runs')
  @UseGuards(
    JwtAuthenticationGuard,
    TenantMembershipGuard,
    TenantPermissionGuard,
  )
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async prepareTenantAiSuggestionRun(
    @Param('slug') slug: string,
    @Param('agentKey') agentKey: string,
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserContext | undefined,
    @TenantAccess() tenantAccess?: { tenantSlug?: string },
  ): Promise<AiSuggestionRunResponseDto> {
    if (!authenticatedUser) {
      throw new NotFoundException('Authenticated user context is required.');
    }

    try {
      const record = await this.prepareTenantAiSuggestionRunUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        agentKey,
        requestedByUserId: authenticatedUser.id,
        requestedByEmail: authenticatedUser.email,
      });

      return toAiSuggestionRunResponseDto(record);
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
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async requestTenantAiSuggestionRunApproval(
    @Param('slug') slug: string,
    @Param('agentKey') agentKey: string,
    @Param('runId') runId: string,
    @Body() body: CreateAiApprovalRequestRequestDto,
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserContext | undefined,
    @TenantAccess() tenantAccess?: { tenantSlug?: string },
  ): Promise<AiApprovalRequestResponseDto> {
    if (!authenticatedUser) {
      throw new NotFoundException('Authenticated user context is required.');
    }

    try {
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
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async reviewTenantAiApprovalRequest(
    @Param('slug') slug: string,
    @Param('agentKey') agentKey: string,
    @Param('requestId') requestId: string,
    @Body() body: ReviewAiApprovalRequestRequestDto,
    @AuthenticatedUser() authenticatedUser: AuthenticatedUserContext | undefined,
    @TenantAccess() tenantAccess?: { tenantSlug?: string },
  ): Promise<AiApprovalRequestResponseDto> {
    if (!authenticatedUser) {
      throw new NotFoundException('Authenticated user context is required.');
    }

    try {
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
}
