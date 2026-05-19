import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  AssignTenantConversationThreadUseCase,
  AssignTenantOpportunityUseCase,
  ConversationThreadNotFoundError,
  CreateTenantWhatsappAutomationRuleUseCase,
  CreateTenantConversationMessageUseCase,
  CreateTenantConversationThreadUseCase,
  CreateTenantLeadUseCase,
  CreateTenantOpportunityUseCase,
  CreateTenantWhatsappMessageTemplateUseCase,
  GROWTH_PERMISSIONS,
  GetTenantConversationThreadByIdUseCase,
  GetTenantGrowthAssignmentWorkloadUseCase,
  GetTenantLeadByIdUseCase,
  GetTenantOpportunityByIdUseCase,
  GetTenantWhatsappAutomationRuleByIdUseCase,
  GetTenantWhatsappAutomationSuggestionsUseCase,
  GetTenantWhatsappOutboundReportingSummaryUseCase,
  GetTenantWhatsappMessageTemplateByIdUseCase,
  GetTenantWebhookEventEnvelopeByIdUseCase,
  IngestTenantWhatsappConversationMessageUseCase,
  IngestTenantWhatsappDeliveryEventUseCase,
  GrowthAssigneeMembershipNotFoundError,
  LeadNotFoundError,
  ListTenantConversationMessageDeliveryEventsUseCase,
  ListTenantConversationMessagesUseCase,
  ListTenantConversationThreadsUseCase,
  ListTenantLeadsUseCase,
  ListTenantOpportunitiesUseCase,
  ListTenantWebhookEventEnvelopesUseCase,
  ListTenantWhatsappAutomationRulesUseCase,
  ListTenantWhatsappConversationThreadsUseCase,
  ListTenantWhatsappMessageTemplatesUseCase,
  OpportunityNotFoundError,
  ReplayTenantWebhookEventEnvelopeUseCase,
  SendTenantWhatsappConversationMessageUseCase,
  UpdateTenantOpportunityStageUseCase,
  WebhookEventEnvelopeNotFoundError,
  WhatsappAutomationRuleNotFoundError,
  WhatsappConversationRecipientUnavailableError,
  WhatsappMessageTemplateNotFoundError,
  WhatsappOutboundMessageContentUnresolvedError,
} from '@saas-platform/growth-application';
import { TenantNotFoundError } from '@saas-platform/tenancy-application';
import { JwtAuthenticationGuard } from '../auth/jwt-authentication.guard';
import { RequireTenantPermission } from '../tenancy/require-tenant-permission.decorator';
import { TenantAccess } from '../tenancy/tenant-access.decorator';
import { TenantMembershipGuard } from '../tenancy/tenant-membership.guard';
import { TenantPermissionGuard } from '../tenancy/tenant-permission.guard';
import { CreateConversationMessageRequestDto } from './dto/create-conversation-message.request';
import { CreateConversationThreadRequestDto } from './dto/create-conversation-thread.request';
import { CreateLeadRequestDto } from './dto/create-lead.request';
import { CreateOpportunityRequestDto } from './dto/create-opportunity.request';
import { CreateWhatsappAutomationRuleRequestDto } from './dto/create-whatsapp-automation-rule.request';
import { CreateWhatsappMessageTemplateRequestDto } from './dto/create-whatsapp-message-template.request';
import { AssignGrowthOwnerRequestDto } from './dto/assign-growth-owner.request';
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
import { SendWhatsappConversationMessageRequestDto } from './dto/send-whatsapp-conversation-message.request';
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
    private readonly createTenantConversationMessageUseCase: CreateTenantConversationMessageUseCase,
    private readonly createTenantConversationThreadUseCase: CreateTenantConversationThreadUseCase,
    private readonly createTenantLeadUseCase: CreateTenantLeadUseCase,
    private readonly createTenantOpportunityUseCase: CreateTenantOpportunityUseCase,
    private readonly createTenantWhatsappAutomationRuleUseCase: CreateTenantWhatsappAutomationRuleUseCase,
    private readonly createTenantWhatsappMessageTemplateUseCase: CreateTenantWhatsappMessageTemplateUseCase,
    private readonly assignTenantConversationThreadUseCase: AssignTenantConversationThreadUseCase,
    private readonly assignTenantOpportunityUseCase: AssignTenantOpportunityUseCase,
    private readonly getTenantConversationThreadByIdUseCase: GetTenantConversationThreadByIdUseCase,
    private readonly getTenantGrowthAssignmentWorkloadUseCase: GetTenantGrowthAssignmentWorkloadUseCase,
    private readonly getTenantLeadByIdUseCase: GetTenantLeadByIdUseCase,
    private readonly getTenantOpportunityByIdUseCase: GetTenantOpportunityByIdUseCase,
    private readonly getTenantWhatsappAutomationRuleByIdUseCase: GetTenantWhatsappAutomationRuleByIdUseCase,
    private readonly getTenantWhatsappAutomationSuggestionsUseCase: GetTenantWhatsappAutomationSuggestionsUseCase,
    private readonly getTenantWhatsappOutboundReportingSummaryUseCase: GetTenantWhatsappOutboundReportingSummaryUseCase,
    private readonly getTenantWhatsappMessageTemplateByIdUseCase: GetTenantWhatsappMessageTemplateByIdUseCase,
    private readonly getTenantWebhookEventEnvelopeByIdUseCase: GetTenantWebhookEventEnvelopeByIdUseCase,
    private readonly ingestTenantWhatsappConversationMessageUseCase: IngestTenantWhatsappConversationMessageUseCase,
    private readonly ingestTenantWhatsappDeliveryEventUseCase: IngestTenantWhatsappDeliveryEventUseCase,
    private readonly listTenantConversationMessageDeliveryEventsUseCase: ListTenantConversationMessageDeliveryEventsUseCase,
    private readonly listTenantConversationMessagesUseCase: ListTenantConversationMessagesUseCase,
    private readonly listTenantConversationThreadsUseCase: ListTenantConversationThreadsUseCase,
    private readonly listTenantLeadsUseCase: ListTenantLeadsUseCase,
    private readonly listTenantOpportunitiesUseCase: ListTenantOpportunitiesUseCase,
    private readonly listTenantWebhookEventEnvelopesUseCase: ListTenantWebhookEventEnvelopesUseCase,
    private readonly listTenantWhatsappAutomationRulesUseCase: ListTenantWhatsappAutomationRulesUseCase,
    private readonly listTenantWhatsappMessageTemplatesUseCase: ListTenantWhatsappMessageTemplatesUseCase,
    private readonly listTenantWhatsappConversationThreadsUseCase: ListTenantWhatsappConversationThreadsUseCase,
    private readonly replayTenantWebhookEventEnvelopeUseCase: ReplayTenantWebhookEventEnvelopeUseCase,
    private readonly sendTenantWhatsappConversationMessageUseCase: SendTenantWhatsappConversationMessageUseCase,
    private readonly updateTenantOpportunityStageUseCase: UpdateTenantOpportunityStageUseCase,
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
