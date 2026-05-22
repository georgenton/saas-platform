import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  GetAiPromptRegistryEntryByAgentKeyUseCase,
  AiAgentNotFoundError,
  GetTenantGrowthAssistAiSuggestionEnvelopeUseCase,
  ListAiAgentCatalogUseCase,
  ListAiPromptRegistryUseCase,
} from '@saas-platform/ai-application';
import { GROWTH_PERMISSIONS } from '@saas-platform/growth-application';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
import { TenantAccess } from '../tenancy/tenant-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import {
  AiAgentCatalogResponseDto,
  toAiAgentCatalogResponseDto,
} from './dto/ai-agent-catalog.response';
import {
  AiPromptRegistryResponseDto,
  toAiPromptRegistryResponseDto,
} from './dto/ai-prompt-registry.response';
import {
  AiSuggestionEnvelopeResponseDto,
  toAiSuggestionEnvelopeResponseDto,
} from './dto/ai-suggestion-envelope.response';

@Controller('ai')
export class AiController {
  constructor(
    private readonly listAiAgentCatalogUseCase: ListAiAgentCatalogUseCase,
    private readonly listAiPromptRegistryUseCase: ListAiPromptRegistryUseCase,
    private readonly getAiPromptRegistryEntryByAgentKeyUseCase: GetAiPromptRegistryEntryByAgentKeyUseCase,
    private readonly getTenantGrowthAssistAiSuggestionEnvelopeUseCase: GetTenantGrowthAssistAiSuggestionEnvelopeUseCase,
  ) {}

  @Get('agents')
  @UseGuards(JwtAuthenticationGuard)
  listAiAgents(): AiAgentCatalogResponseDto[] {
    return this.listAiAgentCatalogUseCase
      .execute()
      .map((entry) => toAiAgentCatalogResponseDto(entry));
  }

  @Get('prompts')
  @UseGuards(JwtAuthenticationGuard)
  listAiPromptRegistry(): AiPromptRegistryResponseDto[] {
    return this.listAiPromptRegistryUseCase
      .execute()
      .map((entry) => toAiPromptRegistryResponseDto(entry));
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
}
