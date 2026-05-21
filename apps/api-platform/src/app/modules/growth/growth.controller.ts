import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  AcknowledgeTenantWhatsappOperationalAlertUseCase,
  AutoAssignTenantGrowthOperationalCasesUseCase,
  AssignTenantConversationThreadUseCase,
  AssignTenantOpportunityUseCase,
  ConversationThreadNotFoundError,
  CreateTenantGrowthOperationalCaseUseCase,
  CreateTenantWhatsappAutomationRuleUseCase,
  CreateTenantConversationMessageUseCase,
  CreateTenantConversationThreadUseCase,
  CreateTenantLeadUseCase,
  CreateTenantOpportunityUseCase,
  CreateTenantWhatsappMessageTemplateUseCase,
  DeleteTenantWhatsappOperationalAlertAcknowledgementUseCase,
  ConversationMessageNotFoundError,
  ExecuteTenantWhatsappAutomationActionsUseCase,
  GROWTH_PERMISSIONS,
  GrowthOperationalCaseFollowUpStateNotAllowedError,
  GrowthOperationalCaseNotFoundError,
  GetTenantConversationThreadByIdUseCase,
  GetTenantGrowthConversationWorkbenchUseCase,
  GetTenantGrowthAssignmentWorkloadUseCase,
  GetTenantLeadByIdUseCase,
  GetTenantOpportunityByIdUseCase,
  GetTenantWhatsappAutomationRuleByIdUseCase,
  GetTenantWhatsappAutomationSuggestionsUseCase,
  GetTenantWhatsappOperationalMonitorAnalyticsUseCase,
  GetTenantWhatsappOutboundReportingSummaryUseCase,
  GetTenantWhatsappMessageTemplateByIdUseCase,
  GetTenantWebhookEventEnvelopeByIdUseCase,
  IngestTenantWhatsappConversationMessageUseCase,
  IngestTenantWhatsappDeliveryEventUseCase,
  GrowthAssigneeMembershipNotFoundError,
  LeadNotFoundError,
  ListTenantConversationMessageDeliveryEventsUseCase,
  ListTenantConversationMessagesUseCase,
  ListTenantGrowthOperationalCasesUseCase,
  ListTenantConversationThreadsUseCase,
  ListTenantLeadsUseCase,
  ListTenantOpportunitiesUseCase,
  ListTenantWhatsappOperationalAlertAcknowledgementsUseCase,
  ListTenantWhatsappOperationalMonitorRunsUseCase,
  ListTenantWebhookEventEnvelopesUseCase,
  ListTenantWhatsappAutomationRulesUseCase,
  ListTenantWhatsappConversationThreadsUseCase,
  ListTenantWhatsappMessageTemplatesUseCase,
  OpportunityNotFoundError,
  ReplayTenantWebhookEventEnvelopeUseCase,
  ReviewTenantGrowthOperationalCaseRoutingUseCase,
  ReopenTenantGrowthOperationalCaseUseCase,
  ResolveTenantGrowthOperationalCaseUseCase,
  RetryTenantWhatsappFailedConversationMessageUseCase,
  RunTenantWhatsappOperationalMonitorUseCase,
  RunTenantWhatsappReadyRetriesUseCase,
  SendTenantWhatsappConversationMessageUseCase,
  TakeTenantGrowthOperationalCaseUseCase,
  UpdateTenantGrowthOperationalCaseFollowUpStateUseCase,
  UpdateTenantOpportunityStageUseCase,
  WebhookEventEnvelopeNotFoundError,
  WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_SINK,
  WhatsappOperationalMonitorObservabilitySink,
  WhatsappAutomationRuleNotFoundError,
  WhatsappConversationRecipientUnavailableError,
  WhatsappMessageTemplateNotFoundError,
  WhatsappMessageRetryNotAllowedError,
  WhatsappOutboundMessageContentUnresolvedError,
} from '@saas-platform/growth-application';
import { TenantNotFoundError } from '@saas-platform/tenancy-application';
import { AuthenticatedUser } from '../auth/authenticated-user.decorator';
import { AuthenticatedUserContext } from '../auth/authenticated-user-context';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
import { TenantAccess } from '../tenancy/tenant-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { CreateConversationMessageRequestDto } from './dto/create-conversation-message.request';
import { CreateConversationThreadRequestDto } from './dto/create-conversation-thread.request';
import { CreateGrowthOperationalCaseRequestDto } from './dto/create-growth-operational-case.request';
import { CreateLeadRequestDto } from './dto/create-lead.request';
import { CreateOpportunityRequestDto } from './dto/create-opportunity.request';
import { CreateWhatsappAutomationRuleRequestDto } from './dto/create-whatsapp-automation-rule.request';
import { CreateWhatsappMessageTemplateRequestDto } from './dto/create-whatsapp-message-template.request';
import { UpdateGrowthOperationalCaseFollowUpStateRequestDto } from './dto/update-growth-operational-case-follow-up-state.request';
import { AssignGrowthOwnerRequestDto } from './dto/assign-growth-owner.request';
import { AcknowledgeWhatsappOperationalAlertRequestDto } from './dto/acknowledge-whatsapp-operational-alert.request';
import {
  ConversationDeliveryEventResponseDto,
  toConversationDeliveryEventResponseDto,
} from './dto/conversation-delivery-event.response';
import {
  ConversationMessageResponseDto,
  toConversationMessageResponseDto,
} from './dto/conversation-message.response';
import {
  ConversationThreadResponseDto,
  toConversationThreadResponseDto,
} from './dto/conversation-thread.response';
import { IngestWhatsappConversationMessageRequestDto } from './dto/ingest-whatsapp-conversation-message.request';
import {
  GrowthConversationWorkbenchResponseDto,
  toGrowthConversationWorkbenchResponseDto,
} from './dto/growth-conversation-workbench.response';
import {
  GrowthOperationalCaseAutoAssignmentResponseDto,
  toGrowthOperationalCaseAutoAssignmentResponseDto,
} from './dto/growth-operational-case-auto-assignment.response';
import {
  GrowthOperationalCaseResponseDto,
  toGrowthOperationalCaseResponseDto,
} from './dto/growth-operational-case.response';
import {
  GrowthOperationalCaseRoutingReviewResponseDto,
  toGrowthOperationalCaseRoutingReviewResponseDto,
} from './dto/growth-operational-case-routing-review.response';
import {
  GrowthAssignmentWorkloadResponseDto,
  toGrowthAssignmentWorkloadResponseDto,
} from './dto/growth-assignment-workload.response';
import {
  IngestedWhatsappConversationMessageResponseDto,
  toIngestedWhatsappConversationMessageResponseDto,
} from './dto/ingested-whatsapp-conversation-message.response';
import { IngestWhatsappDeliveryEventRequestDto } from './dto/ingest-whatsapp-delivery-event.request';
import { LeadResponseDto, toLeadResponseDto } from './dto/lead.response';
import {
  OpportunityResponseDto,
  toOpportunityResponseDto,
} from './dto/opportunity.response';
import { RetryWhatsappConversationMessageRequestDto } from './dto/retry-whatsapp-conversation-message.request';
import { RunWhatsappOperationalMonitorRequestDto } from './dto/run-whatsapp-operational-monitor.request';
import { RunWhatsappReadyRetriesRequestDto } from './dto/run-whatsapp-ready-retries.request';
import { SendWhatsappConversationMessageRequestDto } from './dto/send-whatsapp-conversation-message.request';
import {
  toWhatsappOperationalMonitorAnalyticsResponseDto,
  WhatsappOperationalMonitorAnalyticsResponseDto,
} from './dto/whatsapp-operational-monitor-analytics.response';
import {
  toWhatsappOperationalAlertAcknowledgementResponseDto,
  WhatsappOperationalAlertAcknowledgementResponseDto,
} from './dto/whatsapp-operational-alert-acknowledgement.response';
import {
  WhatsappOperationalMonitorSummaryResponseDto,
  toWhatsappOperationalMonitorSummaryResponseDto,
} from './dto/whatsapp-operational-monitor.response';
import {
  toWhatsappOperationalMonitorRunResponseDto,
  WhatsappOperationalMonitorRunResponseDto,
} from './dto/whatsapp-operational-monitor-run.response';
import {
  WhatsappRetryRunnerSummaryResponseDto,
  toWhatsappRetryRunnerSummaryResponseDto,
} from './dto/whatsapp-retry-runner.response';
import { UpdateOpportunityStageRequestDto } from './dto/update-opportunity-stage.request';
import {
  WebhookEventEnvelopeResponseDto,
  toWebhookEventEnvelopeResponseDto,
} from './dto/webhook-event-envelope.response';
import {
  WhatsappMessageTemplateResponseDto,
  toWhatsappMessageTemplateResponseDto,
} from './dto/whatsapp-message-template.response';
import {
  WhatsappAutomationRuleResponseDto,
  toWhatsappAutomationRuleResponseDto,
} from './dto/whatsapp-automation-rule.response';
import {
  WhatsappAutomationSuggestionsResponseDto,
  toWhatsappAutomationSuggestionsResponseDto,
} from './dto/whatsapp-automation-suggestions.response';
import {
  WhatsappOutboundReportingSummaryResponseDto,
  toWhatsappOutboundReportingSummaryResponseDto,
} from './dto/whatsapp-outbound-reporting-summary.response';

type TenantAccessContext = {
  tenantSlug?: string;
};

@Controller('growth/tenants')
@UseGuards(
  JwtAuthenticationGuard,
  TenantMembershipGuard,
  TenantPermissionGuard,
)
export class GrowthController {
  constructor(
    private readonly acknowledgeTenantWhatsappOperationalAlertUseCase: AcknowledgeTenantWhatsappOperationalAlertUseCase,
    private readonly createTenantConversationMessageUseCase: CreateTenantConversationMessageUseCase,
    private readonly createTenantConversationThreadUseCase: CreateTenantConversationThreadUseCase,
    private readonly createTenantGrowthOperationalCaseUseCase: CreateTenantGrowthOperationalCaseUseCase,
    private readonly createTenantLeadUseCase: CreateTenantLeadUseCase,
    private readonly createTenantOpportunityUseCase: CreateTenantOpportunityUseCase,
    private readonly createTenantWhatsappAutomationRuleUseCase: CreateTenantWhatsappAutomationRuleUseCase,
    private readonly createTenantWhatsappMessageTemplateUseCase: CreateTenantWhatsappMessageTemplateUseCase,
    private readonly deleteTenantWhatsappOperationalAlertAcknowledgementUseCase: DeleteTenantWhatsappOperationalAlertAcknowledgementUseCase,
    private readonly executeTenantWhatsappAutomationActionsUseCase: ExecuteTenantWhatsappAutomationActionsUseCase,
    private readonly assignTenantConversationThreadUseCase: AssignTenantConversationThreadUseCase,
    private readonly assignTenantOpportunityUseCase: AssignTenantOpportunityUseCase,
    private readonly autoAssignTenantGrowthOperationalCasesUseCase: AutoAssignTenantGrowthOperationalCasesUseCase,
    private readonly getTenantConversationThreadByIdUseCase: GetTenantConversationThreadByIdUseCase,
    private readonly getTenantGrowthConversationWorkbenchUseCase: GetTenantGrowthConversationWorkbenchUseCase,
    private readonly getTenantGrowthAssignmentWorkloadUseCase: GetTenantGrowthAssignmentWorkloadUseCase,
    private readonly getTenantLeadByIdUseCase: GetTenantLeadByIdUseCase,
    private readonly getTenantOpportunityByIdUseCase: GetTenantOpportunityByIdUseCase,
    private readonly getTenantWhatsappAutomationRuleByIdUseCase: GetTenantWhatsappAutomationRuleByIdUseCase,
    private readonly getTenantWhatsappAutomationSuggestionsUseCase: GetTenantWhatsappAutomationSuggestionsUseCase,
    private readonly getTenantWhatsappOperationalMonitorAnalyticsUseCase: GetTenantWhatsappOperationalMonitorAnalyticsUseCase,
    private readonly getTenantWhatsappOutboundReportingSummaryUseCase: GetTenantWhatsappOutboundReportingSummaryUseCase,
    private readonly getTenantWhatsappMessageTemplateByIdUseCase: GetTenantWhatsappMessageTemplateByIdUseCase,
    private readonly getTenantWebhookEventEnvelopeByIdUseCase: GetTenantWebhookEventEnvelopeByIdUseCase,
    private readonly ingestTenantWhatsappConversationMessageUseCase: IngestTenantWhatsappConversationMessageUseCase,
    private readonly ingestTenantWhatsappDeliveryEventUseCase: IngestTenantWhatsappDeliveryEventUseCase,
    private readonly listTenantConversationMessageDeliveryEventsUseCase: ListTenantConversationMessageDeliveryEventsUseCase,
    private readonly listTenantConversationMessagesUseCase: ListTenantConversationMessagesUseCase,
    private readonly listTenantGrowthOperationalCasesUseCase: ListTenantGrowthOperationalCasesUseCase,
    private readonly listTenantConversationThreadsUseCase: ListTenantConversationThreadsUseCase,
    private readonly listTenantLeadsUseCase: ListTenantLeadsUseCase,
    private readonly listTenantOpportunitiesUseCase: ListTenantOpportunitiesUseCase,
    private readonly listTenantWhatsappOperationalAlertAcknowledgementsUseCase: ListTenantWhatsappOperationalAlertAcknowledgementsUseCase,
    private readonly listTenantWhatsappOperationalMonitorRunsUseCase: ListTenantWhatsappOperationalMonitorRunsUseCase,
    private readonly listTenantWebhookEventEnvelopesUseCase: ListTenantWebhookEventEnvelopesUseCase,
    private readonly listTenantWhatsappAutomationRulesUseCase: ListTenantWhatsappAutomationRulesUseCase,
    private readonly listTenantWhatsappMessageTemplatesUseCase: ListTenantWhatsappMessageTemplatesUseCase,
    private readonly listTenantWhatsappConversationThreadsUseCase: ListTenantWhatsappConversationThreadsUseCase,
    private readonly replayTenantWebhookEventEnvelopeUseCase: ReplayTenantWebhookEventEnvelopeUseCase,
    private readonly reviewTenantGrowthOperationalCaseRoutingUseCase: ReviewTenantGrowthOperationalCaseRoutingUseCase,
    private readonly reopenTenantGrowthOperationalCaseUseCase: ReopenTenantGrowthOperationalCaseUseCase,
    private readonly resolveTenantGrowthOperationalCaseUseCase: ResolveTenantGrowthOperationalCaseUseCase,
    private readonly retryTenantWhatsappFailedConversationMessageUseCase: RetryTenantWhatsappFailedConversationMessageUseCase,
    private readonly runTenantWhatsappOperationalMonitorUseCase: RunTenantWhatsappOperationalMonitorUseCase,
    private readonly runTenantWhatsappReadyRetriesUseCase: RunTenantWhatsappReadyRetriesUseCase,
    private readonly sendTenantWhatsappConversationMessageUseCase: SendTenantWhatsappConversationMessageUseCase,
    private readonly takeTenantGrowthOperationalCaseUseCase: TakeTenantGrowthOperationalCaseUseCase,
    private readonly updateTenantGrowthOperationalCaseFollowUpStateUseCase: UpdateTenantGrowthOperationalCaseFollowUpStateUseCase,
    private readonly updateTenantOpportunityStageUseCase: UpdateTenantOpportunityStageUseCase,
    @Inject(WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_SINK)
    private readonly whatsappOperationalMonitorObservabilitySink: WhatsappOperationalMonitorObservabilitySink,
  ) {}

  @Get(':slug/conversations/whatsapp-inbox/webhook-envelopes')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async listTenantWhatsappWebhookEventEnvelopes(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<WebhookEventEnvelopeResponseDto[]> {
    try {
      const envelopes =
        await this.listTenantWebhookEventEnvelopesUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return envelopes.map((envelope) =>
        toWebhookEventEnvelopeResponseDto(envelope),
      );
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/conversations/whatsapp-inbox/webhook-envelopes/:envelopeId')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async getTenantWhatsappWebhookEventEnvelopeById(
    @Param('slug') slug: string,
    @Param('envelopeId') envelopeId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<WebhookEventEnvelopeResponseDto> {
    try {
      const envelope =
        await this.getTenantWebhookEventEnvelopeByIdUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          envelopeId,
        );

      return toWebhookEventEnvelopeResponseDto(envelope);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof WebhookEventEnvelopeNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/whatsapp-inbox/webhook-envelopes/:envelopeId/replay')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async replayTenantWhatsappWebhookEventEnvelope(
    @Param('slug') slug: string,
    @Param('envelopeId') envelopeId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<WebhookEventEnvelopeResponseDto> {
    try {
      const result =
        await this.replayTenantWebhookEventEnvelopeUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          envelopeId,
        );

      return toWebhookEventEnvelopeResponseDto(result.envelope);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof WebhookEventEnvelopeNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/conversations')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async listTenantConversationThreads(
    @Param('slug') slug: string,
    @Query('assigneeUserId') assigneeUserId?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<ConversationThreadResponseDto[]> {
    try {
      const resolvedTenantSlug = tenantAccess?.tenantSlug ?? slug;
      const threads = assigneeUserId?.trim()
        ? await this.listTenantConversationThreadsUseCase.execute(
            resolvedTenantSlug,
            assigneeUserId,
          )
        : await this.listTenantConversationThreadsUseCase.execute(
            resolvedTenantSlug,
          );

      return threads.map((thread) => toConversationThreadResponseDto(thread));
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/conversations/workbench')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async getTenantGrowthConversationWorkbench(
    @Param('slug') slug: string,
    @Query('assigneeUserId') assigneeUserId?: string,
    @Query('channel') channel?: 'manual' | 'whatsapp',
    @Query('firstResponseSlaHours') firstResponseSlaHours?: string,
    @Query('followUpSlaHours') followUpSlaHours?: string,
    @Query('staleThreadHours') staleThreadHours?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<GrowthConversationWorkbenchResponseDto> {
    try {
      const workbench =
        await this.getTenantGrowthConversationWorkbenchUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          {
            assigneeUserId,
            channel,
            firstResponseSlaHours:
              this.parsePositiveNumber(firstResponseSlaHours),
            followUpSlaHours: this.parsePositiveNumber(followUpSlaHours),
            staleThreadHours: this.parsePositiveNumber(staleThreadHours),
          },
        );

      return toGrowthConversationWorkbenchResponseDto(workbench);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/conversations/operational-cases')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async listTenantGrowthOperationalCases(
    @Param('slug') slug: string,
    @Query('status') status?: 'open' | 'in_progress' | 'resolved',
    @Query('routingPolicyKey')
    routingPolicyKey?:
      | 'growth_ops'
      | 'escalation_review'
      | 'owner_assignment'
      | 'follow_up_team'
      | 'follow_up_waiting_customer',
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<GrowthOperationalCaseResponseDto[]> {
    try {
      const cases = await this.listTenantGrowthOperationalCasesUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        status,
        routingPolicyKey,
      );

      return cases.map((record) => toGrowthOperationalCaseResponseDto(record));
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/operational-cases')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async createTenantGrowthOperationalCase(
    @Param('slug') slug: string,
    @Body() body: CreateGrowthOperationalCaseRequestDto,
    @AuthenticatedUser() authenticatedUser?: AuthenticatedUserContext,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<GrowthOperationalCaseResponseDto> {
    if (!authenticatedUser) {
      throw new BadRequestException('Authenticated user context is required.');
    }

    try {
      const record = await this.createTenantGrowthOperationalCaseUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        sourceKey: body.sourceKey,
        caseType: body.caseType,
        priority: body.priority,
        title: body.title,
        summary: body.summary,
        nextAction: body.nextAction,
        followUpState: body.followUpState ?? null,
        threadId: body.threadId ?? null,
        alertKey: body.alertKey ?? null,
        dueAt: body.dueAt ? new Date(body.dueAt) : null,
        createdByUserId: authenticatedUser.id,
        createdByEmail: authenticatedUser.email,
      });

      return toGrowthOperationalCaseResponseDto(record);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/operational-cases/review-routing')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async reviewTenantGrowthOperationalCaseRouting(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<GrowthOperationalCaseRoutingReviewResponseDto> {
    try {
      const result =
        await this.reviewTenantGrowthOperationalCaseRoutingUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
        });

      return toGrowthOperationalCaseRoutingReviewResponseDto(result);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/operational-cases/auto-assign')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async autoAssignTenantGrowthOperationalCases(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<GrowthOperationalCaseAutoAssignmentResponseDto> {
    try {
      const result =
        await this.autoAssignTenantGrowthOperationalCasesUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
        });

      return toGrowthOperationalCaseAutoAssignmentResponseDto(result);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/operational-cases/:caseId/take')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async takeTenantGrowthOperationalCase(
    @Param('slug') slug: string,
    @Param('caseId') caseId: string,
    @AuthenticatedUser() authenticatedUser?: AuthenticatedUserContext,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<GrowthOperationalCaseResponseDto> {
    if (!authenticatedUser) {
      throw new BadRequestException('Authenticated user context is required.');
    }

    try {
      const record = await this.takeTenantGrowthOperationalCaseUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        caseId,
        assignedUserId: authenticatedUser.id,
        assignedUserEmail: authenticatedUser.email,
      });

      return toGrowthOperationalCaseResponseDto(record);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof GrowthOperationalCaseNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/operational-cases/:caseId/resolve')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async resolveTenantGrowthOperationalCase(
    @Param('slug') slug: string,
    @Param('caseId') caseId: string,
    @AuthenticatedUser() authenticatedUser?: AuthenticatedUserContext,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<GrowthOperationalCaseResponseDto> {
    if (!authenticatedUser) {
      throw new BadRequestException('Authenticated user context is required.');
    }

    try {
      const record =
        await this.resolveTenantGrowthOperationalCaseUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          caseId,
          resolvedByUserId: authenticatedUser.id,
          resolvedByEmail: authenticatedUser.email,
        });

      return toGrowthOperationalCaseResponseDto(record);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof GrowthOperationalCaseNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/operational-cases/:caseId/follow-up-state')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async updateTenantGrowthOperationalCaseFollowUpState(
    @Param('slug') slug: string,
    @Param('caseId') caseId: string,
    @Body() body: UpdateGrowthOperationalCaseFollowUpStateRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<GrowthOperationalCaseResponseDto> {
    try {
      const record =
        await this.updateTenantGrowthOperationalCaseFollowUpStateUseCase.execute(
          {
            tenantSlug: tenantAccess?.tenantSlug ?? slug,
            caseId,
            followUpState: body.followUpState,
            nextAction: body.nextAction ?? undefined,
            dueAt: body.dueAt === undefined ? undefined : body.dueAt ? new Date(body.dueAt) : null,
          },
        );

      return toGrowthOperationalCaseResponseDto(record);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof GrowthOperationalCaseNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof GrowthOperationalCaseFollowUpStateNotAllowedError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/operational-cases/:caseId/reopen')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async reopenTenantGrowthOperationalCase(
    @Param('slug') slug: string,
    @Param('caseId') caseId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<GrowthOperationalCaseResponseDto> {
    try {
      const record = await this.reopenTenantGrowthOperationalCaseUseCase.execute(
        {
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          caseId,
        },
      );

      return toGrowthOperationalCaseResponseDto(record);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof GrowthOperationalCaseNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/conversations/whatsapp-inbox')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async listTenantWhatsappConversationThreads(
    @Param('slug') slug: string,
    @Query('assigneeUserId') assigneeUserId?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<ConversationThreadResponseDto[]> {
    try {
      const resolvedTenantSlug = tenantAccess?.tenantSlug ?? slug;
      const threads = assigneeUserId?.trim()
        ? await this.listTenantWhatsappConversationThreadsUseCase.execute(
            resolvedTenantSlug,
            assigneeUserId,
          )
        : await this.listTenantWhatsappConversationThreadsUseCase.execute(
            resolvedTenantSlug,
          );

      return threads.map((thread) => toConversationThreadResponseDto(thread));
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/conversations/whatsapp-templates')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async listTenantWhatsappMessageTemplates(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<WhatsappMessageTemplateResponseDto[]> {
    try {
      const templates =
        await this.listTenantWhatsappMessageTemplatesUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return templates.map((template) =>
        toWhatsappMessageTemplateResponseDto(template),
      );
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/conversations/whatsapp-automations')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async listTenantWhatsappAutomationRules(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<WhatsappAutomationRuleResponseDto[]> {
    try {
      const rules = await this.listTenantWhatsappAutomationRulesUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

      return rules.map((rule) => toWhatsappAutomationRuleResponseDto(rule));
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/conversations/whatsapp-reporting/outbound-summary')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async getTenantWhatsappOutboundReportingSummary(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<WhatsappOutboundReportingSummaryResponseDto> {
    try {
      const summary =
        await this.getTenantWhatsappOutboundReportingSummaryUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return toWhatsappOutboundReportingSummaryResponseDto(summary);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/whatsapp-reporting/retry-ready')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async runTenantWhatsappReadyRetries(
    @Param('slug') slug: string,
    @Body() body: RunWhatsappReadyRetriesRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<WhatsappRetryRunnerSummaryResponseDto> {
    try {
      const summary = await this.runTenantWhatsappReadyRetriesUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        limit: body.limit ?? null,
        occurredAt: body.occurredAt ? new Date(body.occurredAt) : null,
      });

      return toWhatsappRetryRunnerSummaryResponseDto(summary);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/whatsapp-reporting/monitor')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async runTenantWhatsappOperationalMonitor(
    @Param('slug') slug: string,
    @Body() body: RunWhatsappOperationalMonitorRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<WhatsappOperationalMonitorSummaryResponseDto> {
    try {
      const summary =
        await this.runTenantWhatsappOperationalMonitorUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          occurredAt: body.occurredAt ? new Date(body.occurredAt) : null,
          autoRunReadyRetries: body.autoRunReadyRetries ?? null,
          retryReadyLimit: body.retryReadyLimit ?? null,
          triggerSource: 'manual',
        });
      await this.whatsappOperationalMonitorObservabilitySink.publish({
        summary,
      });

      return toWhatsappOperationalMonitorSummaryResponseDto(summary);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/conversations/whatsapp-reporting/monitor-runs')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async listTenantWhatsappOperationalMonitorRuns(
    @Param('slug') slug: string,
    @Query('limit') limitRaw: string | undefined,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<WhatsappOperationalMonitorRunResponseDto[]> {
    try {
      const parsedLimit = limitRaw ? Number(limitRaw) : null;
      const limit =
        parsedLimit && Number.isFinite(parsedLimit)
          ? Math.min(Math.max(Math.trunc(parsedLimit), 1), 50)
          : null;
      const runs =
        await this.listTenantWhatsappOperationalMonitorRunsUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          limit,
        );

      return runs.map((run) => toWhatsappOperationalMonitorRunResponseDto(run));
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/conversations/whatsapp-reporting/monitor-analytics')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async getTenantWhatsappOperationalMonitorAnalytics(
    @Param('slug') slug: string,
    @Query('limit') limitRaw: string | undefined,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<WhatsappOperationalMonitorAnalyticsResponseDto> {
    try {
      const parsedLimit = limitRaw ? Number(limitRaw) : null;
      const limit =
        parsedLimit && Number.isFinite(parsedLimit)
          ? Math.min(Math.max(Math.trunc(parsedLimit), 1), 100)
          : null;
      const analytics =
        await this.getTenantWhatsappOperationalMonitorAnalyticsUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          limit,
        );

      return toWhatsappOperationalMonitorAnalyticsResponseDto(analytics);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/conversations/whatsapp-reporting/alert-acknowledgements')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async listTenantWhatsappOperationalAlertAcknowledgements(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<WhatsappOperationalAlertAcknowledgementResponseDto[]> {
    try {
      const acknowledgements =
        await this.listTenantWhatsappOperationalAlertAcknowledgementsUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return acknowledgements.map((acknowledgement) =>
        toWhatsappOperationalAlertAcknowledgementResponseDto(acknowledgement),
      );
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Put(':slug/conversations/whatsapp-reporting/alert-acknowledgements/:alertKey')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async acknowledgeTenantWhatsappOperationalAlert(
    @Param('slug') slug: string,
    @Param('alertKey') alertKey: string,
    @Body() body: AcknowledgeWhatsappOperationalAlertRequestDto,
    @AuthenticatedUser() authenticatedUser?: AuthenticatedUserContext,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<WhatsappOperationalAlertAcknowledgementResponseDto> {
    if (!authenticatedUser) {
      throw new BadRequestException('Authenticated user context is required.');
    }

    try {
      const acknowledgement =
        await this.acknowledgeTenantWhatsappOperationalAlertUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          alertKey,
          title: body.title,
          severity: body.severity,
          summary: body.summary,
          provider: body.provider ?? null,
          failureClass: body.failureClass ?? null,
          providerTaxonomyFamily: body.providerTaxonomyFamily ?? null,
          providerTaxonomyDetail: body.providerTaxonomyDetail ?? null,
          affectedMessageCount: body.affectedMessageCount ?? 0,
          recommendedAction: body.recommendedAction,
          lastSeenGeneratedAt: body.lastSeenGeneratedAt
            ? new Date(body.lastSeenGeneratedAt)
            : null,
          acknowledgedByUserId: authenticatedUser.id,
          acknowledgedByEmail: authenticatedUser.email,
        });

      return toWhatsappOperationalAlertAcknowledgementResponseDto(
        acknowledgement,
      );
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Delete(':slug/conversations/whatsapp-reporting/alert-acknowledgements/:alertKey')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async deleteTenantWhatsappOperationalAlertAcknowledgement(
    @Param('slug') slug: string,
    @Param('alertKey') alertKey: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<void> {
    try {
      await this.deleteTenantWhatsappOperationalAlertAcknowledgementUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        alertKey,
      );
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/conversations/whatsapp-automations/:automationId')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async getTenantWhatsappAutomationRuleById(
    @Param('slug') slug: string,
    @Param('automationId') automationId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<WhatsappAutomationRuleResponseDto> {
    try {
      const rule =
        await this.getTenantWhatsappAutomationRuleByIdUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          automationId,
        );

      return toWhatsappAutomationRuleResponseDto(rule);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof WhatsappAutomationRuleNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/conversations/whatsapp-templates/:templateId')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async getTenantWhatsappMessageTemplateById(
    @Param('slug') slug: string,
    @Param('templateId') templateId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<WhatsappMessageTemplateResponseDto> {
    try {
      const template =
        await this.getTenantWhatsappMessageTemplateByIdUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          templateId,
        );

      return toWhatsappMessageTemplateResponseDto(template);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof WhatsappMessageTemplateNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/whatsapp-automations')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async createTenantWhatsappAutomationRule(
    @Param('slug') slug: string,
    @Body() body: CreateWhatsappAutomationRuleRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<WhatsappAutomationRuleResponseDto> {
    try {
      const rule =
        await this.createTenantWhatsappAutomationRuleUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          key: body.key,
          name: body.name,
          triggerEvent: body.triggerEvent,
          matchOutboundIntentKey: body.matchOutboundIntentKey,
          matchDeliveryStatus: body.matchDeliveryStatus,
          matchAssigneeMode: body.matchAssigneeMode,
          templateId: body.templateId,
          actionType: body.actionType,
          actionOutboundIntentKey: body.actionOutboundIntentKey,
        });

      return toWhatsappAutomationRuleResponseDto(rule);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof WhatsappMessageTemplateNotFoundError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/whatsapp-templates')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async createTenantWhatsappMessageTemplate(
    @Param('slug') slug: string,
    @Body() body: CreateWhatsappMessageTemplateRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<WhatsappMessageTemplateResponseDto> {
    try {
      const template =
        await this.createTenantWhatsappMessageTemplateUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          key: body.key,
          name: body.name,
          languageCode: body.languageCode,
          category: body.category,
          bodyTemplate: body.bodyTemplate,
          intentKey: body.intentKey,
          providerTemplateName: body.providerTemplateName,
          providerApprovalStatus: body.providerApprovalStatus,
        });

      return toWhatsappMessageTemplateResponseDto(template);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/whatsapp-inbox/messages')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async ingestTenantWhatsappConversationMessage(
    @Param('slug') slug: string,
    @Body() body: IngestWhatsappConversationMessageRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<IngestedWhatsappConversationMessageResponseDto> {
    try {
      const result =
        await this.ingestTenantWhatsappConversationMessageUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          externalConversationId: body.externalConversationId,
          participantHandle: body.participantHandle,
          participantDisplayName: body.participantDisplayName,
          leadId: body.leadId,
          body: body.body,
          externalMessageId: body.externalMessageId,
          occurredAt: body.occurredAt ? new Date(body.occurredAt) : null,
        });
      await this.executeTenantWhatsappAutomationActionsUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        threadId: result.thread.id,
        triggerEvent: 'inbound_message',
        triggerMessageId: result.message.id,
        triggerExternalMessageId: result.message.externalMessageId,
        executionKey:
          result.message.externalMessageId ?? result.message.id,
        occurredAt: result.message.createdAt,
      });

      return toIngestedWhatsappConversationMessageResponseDto(result);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof LeadNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/whatsapp-inbox/:threadId/outbound-messages')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async sendTenantWhatsappConversationMessage(
    @Param('slug') slug: string,
    @Param('threadId') threadId: string,
    @Body() body: SendWhatsappConversationMessageRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<ConversationMessageResponseDto> {
    try {
      const message =
        await this.sendTenantWhatsappConversationMessageUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          threadId,
          body: body.body,
          templateId: body.templateId,
          templateVariables: body.templateVariables,
          outboundIntentKey: body.outboundIntentKey,
          externalMessageId: body.externalMessageId,
          occurredAt: body.occurredAt ? new Date(body.occurredAt) : null,
        });

      return toConversationMessageResponseDto(message);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ConversationThreadNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof WhatsappConversationRecipientUnavailableError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof WhatsappMessageTemplateNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof WhatsappOutboundMessageContentUnresolvedError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/conversations/:threadId/whatsapp-automation-suggestions')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async getTenantWhatsappAutomationSuggestions(
    @Param('slug') slug: string,
    @Param('threadId') threadId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<WhatsappAutomationSuggestionsResponseDto> {
    try {
      const summary =
        await this.getTenantWhatsappAutomationSuggestionsUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          threadId,
        );

      return toWhatsappAutomationSuggestionsResponseDto(summary);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ConversationThreadNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/whatsapp-inbox/delivery-events')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async ingestTenantWhatsappDeliveryEvent(
    @Param('slug') slug: string,
    @Body() body: IngestWhatsappDeliveryEventRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<ConversationMessageResponseDto> {
    try {
      const message = await this.ingestTenantWhatsappDeliveryEventUseCase.execute(
        {
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          externalMessageId: body.externalMessageId,
          deliveryStatus: body.deliveryStatus,
          provider: body.provider,
          providerEventId: body.providerEventId,
          payloadJson: body.payloadJson,
          eventKey: body.eventKey,
          failureReason: body.failureReason,
          providerStatusDetail: body.providerStatusDetail,
          providerConversationCategory: body.providerConversationCategory,
          providerPricingCategory: body.providerPricingCategory,
          providerErrorCode: body.providerErrorCode,
          occurredAt: body.occurredAt ? new Date(body.occurredAt) : null,
        },
      );
      await this.executeTenantWhatsappAutomationActionsUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        threadId: message.threadId,
        triggerEvent: 'delivery_status_changed',
        triggerMessageId: message.id,
        triggerExternalMessageId: message.externalMessageId,
        triggerDeliveryStatus: message.deliveryStatus,
        executionKey: [
          body.eventKey?.trim() || null,
          body.providerEventId?.trim() || null,
          body.externalMessageId.trim(),
          body.deliveryStatus,
        ]
          .filter((value) => !!value)
          .join(':'),
        occurredAt: body.occurredAt ? new Date(body.occurredAt) : null,
      });

      return toConversationMessageResponseDto(message);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ConversationThreadNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/conversations/:threadId/messages/:messageId/delivery-events')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async listTenantConversationMessageDeliveryEvents(
    @Param('slug') slug: string,
    @Param('threadId') threadId: string,
    @Param('messageId') messageId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<ConversationDeliveryEventResponseDto[]> {
    try {
      const deliveryEvents =
        await this.listTenantConversationMessageDeliveryEventsUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          threadId,
          messageId,
        );

      return deliveryEvents.map((event) =>
        toConversationDeliveryEventResponseDto(event),
      );
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ConversationThreadNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/:threadId/messages/:messageId/retry')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async retryTenantWhatsappConversationMessage(
    @Param('slug') slug: string,
    @Param('threadId') threadId: string,
    @Param('messageId') messageId: string,
    @Body() body: RetryWhatsappConversationMessageRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<ConversationMessageResponseDto> {
    try {
      const message =
        await this.retryTenantWhatsappFailedConversationMessageUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          threadId,
          messageId,
          occurredAt: body.occurredAt ? new Date(body.occurredAt) : null,
        });

      return toConversationMessageResponseDto(message);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ConversationThreadNotFoundError ||
        error instanceof ConversationMessageNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      if (
        error instanceof WhatsappMessageRetryNotAllowedError ||
        error instanceof WhatsappConversationRecipientUnavailableError
      ) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof WhatsappMessageTemplateNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof WhatsappOutboundMessageContentUnresolvedError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async createTenantConversationThread(
    @Param('slug') slug: string,
    @Body() body: CreateConversationThreadRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<ConversationThreadResponseDto> {
    try {
      const thread = await this.createTenantConversationThreadUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        leadId: body.leadId,
        subject: body.subject,
        channel: body.channel,
        status: body.status,
      });

      return toConversationThreadResponseDto(thread);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof LeadNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/:threadId/assignment')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async assignTenantConversationThread(
    @Param('slug') slug: string,
    @Param('threadId') threadId: string,
    @Body() body: AssignGrowthOwnerRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<ConversationThreadResponseDto> {
    try {
      const thread = await this.assignTenantConversationThreadUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        threadId,
        assigneeUserId: body.assigneeUserId,
      });

      return toConversationThreadResponseDto(thread);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ConversationThreadNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof GrowthAssigneeMembershipNotFoundError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/conversations/:threadId')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async getTenantConversationThreadById(
    @Param('slug') slug: string,
    @Param('threadId') threadId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<ConversationThreadResponseDto> {
    try {
      const thread = await this.getTenantConversationThreadByIdUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        threadId,
      );

      return toConversationThreadResponseDto(thread);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ConversationThreadNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/conversations/:threadId/messages')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_READ)
  async listTenantConversationMessages(
    @Param('slug') slug: string,
    @Param('threadId') threadId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<ConversationMessageResponseDto[]> {
    try {
      const messages =
        await this.listTenantConversationMessagesUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
          threadId,
        );

      return messages.map((message) =>
        toConversationMessageResponseDto(message),
      );
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ConversationThreadNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/conversations/:threadId/messages')
  @RequireTenantPermission(GROWTH_PERMISSIONS.CONVERSATIONS_MANAGE)
  async createTenantConversationMessage(
    @Param('slug') slug: string,
    @Param('threadId') threadId: string,
    @Body() body: CreateConversationMessageRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<ConversationMessageResponseDto> {
    try {
      const message = await this.createTenantConversationMessageUseCase.execute(
        {
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          threadId,
          direction: body.direction,
          body: body.body,
          externalMessageId: body.externalMessageId,
        },
      );

      return toConversationMessageResponseDto(message);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof ConversationThreadNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/opportunities')
  @RequireTenantPermission(GROWTH_PERMISSIONS.OPPORTUNITIES_READ)
  async listTenantOpportunities(
    @Param('slug') slug: string,
    @Query('assigneeUserId') assigneeUserId?: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<OpportunityResponseDto[]> {
    try {
      const resolvedTenantSlug = tenantAccess?.tenantSlug ?? slug;
      const opportunities = assigneeUserId?.trim()
        ? await this.listTenantOpportunitiesUseCase.execute(
            resolvedTenantSlug,
            assigneeUserId,
          )
        : await this.listTenantOpportunitiesUseCase.execute(resolvedTenantSlug);

      return opportunities.map((opportunity) =>
        toOpportunityResponseDto(opportunity),
      );
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/assignment-workload')
  @RequireTenantPermission(GROWTH_PERMISSIONS.OPPORTUNITIES_READ)
  async getTenantGrowthAssignmentWorkload(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<GrowthAssignmentWorkloadResponseDto> {
    try {
      const workload =
        await this.getTenantGrowthAssignmentWorkloadUseCase.execute(
          tenantAccess?.tenantSlug ?? slug,
        );

      return toGrowthAssignmentWorkloadResponseDto(workload);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  private parsePositiveNumber(value?: string): number | undefined {
    if (!value) {
      return undefined;
    }

    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      throw new BadRequestException(
        'Expected a positive numeric query parameter value.',
      );
    }

    return parsed;
  }

  @Get(':slug/opportunities/:opportunityId')
  @RequireTenantPermission(GROWTH_PERMISSIONS.OPPORTUNITIES_READ)
  async getTenantOpportunityById(
    @Param('slug') slug: string,
    @Param('opportunityId') opportunityId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<OpportunityResponseDto> {
    try {
      const opportunity = await this.getTenantOpportunityByIdUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        opportunityId,
      );

      return toOpportunityResponseDto(opportunity);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof OpportunityNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/opportunities')
  @RequireTenantPermission(GROWTH_PERMISSIONS.OPPORTUNITIES_MANAGE)
  async createTenantOpportunity(
    @Param('slug') slug: string,
    @Body() body: CreateOpportunityRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<OpportunityResponseDto> {
    try {
      const opportunity = await this.createTenantOpportunityUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        leadId: body.leadId,
        threadId: body.threadId,
        title: body.title,
        stage: body.stage,
        amountInCents: body.amountInCents,
        currency: body.currency,
        notes: body.notes,
      });

      return toOpportunityResponseDto(opportunity);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof LeadNotFoundError ||
        error instanceof ConversationThreadNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/opportunities/:opportunityId/assignment')
  @RequireTenantPermission(GROWTH_PERMISSIONS.OPPORTUNITIES_MANAGE)
  async assignTenantOpportunity(
    @Param('slug') slug: string,
    @Param('opportunityId') opportunityId: string,
    @Body() body: AssignGrowthOwnerRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<OpportunityResponseDto> {
    try {
      const opportunity = await this.assignTenantOpportunityUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        opportunityId,
        assigneeUserId: body.assigneeUserId,
      });

      return toOpportunityResponseDto(opportunity);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof OpportunityNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof GrowthAssigneeMembershipNotFoundError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @Put(':slug/opportunities/:opportunityId/stage')
  @RequireTenantPermission(GROWTH_PERMISSIONS.OPPORTUNITIES_MANAGE)
  async updateTenantOpportunityStage(
    @Param('slug') slug: string,
    @Param('opportunityId') opportunityId: string,
    @Body() body: UpdateOpportunityStageRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<OpportunityResponseDto> {
    try {
      const opportunity =
        await this.updateTenantOpportunityStageUseCase.execute({
          tenantSlug: tenantAccess?.tenantSlug ?? slug,
          opportunityId,
          stage: body.stage,
        });

      return toOpportunityResponseDto(opportunity);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof OpportunityNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/leads')
  @RequireTenantPermission(GROWTH_PERMISSIONS.LEADS_READ)
  async listTenantLeads(
    @Param('slug') slug: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<LeadResponseDto[]> {
    try {
      const leads = await this.listTenantLeadsUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
      );

      return leads.map((lead) => toLeadResponseDto(lead));
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Get(':slug/leads/:leadId')
  @RequireTenantPermission(GROWTH_PERMISSIONS.LEADS_READ)
  async getTenantLeadById(
    @Param('slug') slug: string,
    @Param('leadId') leadId: string,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<LeadResponseDto> {
    try {
      const lead = await this.getTenantLeadByIdUseCase.execute(
        tenantAccess?.tenantSlug ?? slug,
        leadId,
      );

      return toLeadResponseDto(lead);
    } catch (error) {
      if (
        error instanceof TenantNotFoundError ||
        error instanceof LeadNotFoundError
      ) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @Post(':slug/leads')
  @RequireTenantPermission(GROWTH_PERMISSIONS.LEADS_MANAGE)
  async createTenantLead(
    @Param('slug') slug: string,
    @Body() body: CreateLeadRequestDto,
    @TenantAccess() tenantAccess?: TenantAccessContext,
  ): Promise<LeadResponseDto> {
    try {
      const lead = await this.createTenantLeadUseCase.execute({
        tenantSlug: tenantAccess?.tenantSlug ?? slug,
        fullName: body.fullName,
        email: body.email,
        phoneE164: body.phoneE164,
        whatsappE164: body.whatsappE164,
        source: body.source,
        status: body.status,
        notes: body.notes,
      });

      return toLeadResponseDto(lead);
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
