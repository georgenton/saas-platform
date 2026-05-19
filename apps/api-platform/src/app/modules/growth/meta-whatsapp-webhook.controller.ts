import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Header,
  Headers,
  Param,
  Post,
  Query,
  Req,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ReceiveTenantMetaWhatsappWebhookUseCase } from '@saas-platform/growth-application';
import {
  MetaWhatsappWebhookTenantResolutionConflictError,
  MetaWhatsappWebhookTenantNotResolvedError,
  MetaWhatsappWebhookTenantResolver,
} from './meta-whatsapp-webhook-tenant-resolver';
import { MetaWhatsappWebhookSignatureVerifier } from './meta-whatsapp-webhook-signature-verifier';
import { MetaWhatsappWebhookVerifier } from './meta-whatsapp-webhook-verifier';

type VerificationQuery = {
  'hub.mode'?: string;
  'hub.verify_token'?: string;
  'hub.challenge'?: string;
};

type RawBodyRequest = {
  rawBody?: Buffer;
};

@Controller('growth/webhooks/whatsapp/meta')
export class MetaWhatsappWebhookController {
  constructor(
    private readonly metaWhatsappWebhookVerifier: MetaWhatsappWebhookVerifier,
    private readonly metaWhatsappWebhookSignatureVerifier: MetaWhatsappWebhookSignatureVerifier,
    private readonly metaWhatsappWebhookTenantResolver: MetaWhatsappWebhookTenantResolver,
    private readonly receiveTenantMetaWhatsappWebhookUseCase: ReceiveTenantMetaWhatsappWebhookUseCase,
  ) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  verifyGenericWebhook(@Query() query: VerificationQuery): string {
    return this.verifyWebhookChallenge(query);
  }

  @Get('tenants/:slug')
  @Header('Content-Type', 'text/plain')
  verifyWebhook(
    @Param('slug') _slug: string,
    @Query() query: VerificationQuery,
  ): string {
    return this.verifyWebhookChallenge(query);
  }

  @Post()
  async receiveProviderWebhook(
    @Req() request: RawBodyRequest,
    @Headers('x-hub-signature-256') signatureHeader: string | undefined,
    @Body() payload: Record<string, unknown>,
  ): Promise<{
    status: 'EVENT_RECEIVED';
    tenantSlug: string;
    tenantResolutionSource: string;
    envelopeId: string;
    eventKey: string;
    duplicate: boolean;
    envelopeStatus: string;
    processedInboundMessages: number;
    processedDeliveryEvents: number;
  }> {
    if (!this.metaWhatsappWebhookSignatureVerifier.isConfigured()) {
      throw new ServiceUnavailableException(
        'WhatsApp webhook signature verification is not configured for the provider-facing endpoint.',
      );
    }

    if (
      !this.metaWhatsappWebhookSignatureVerifier.verify(
        request.rawBody,
        signatureHeader,
      )
    ) {
      throw new ForbiddenException(
        'WhatsApp webhook signature is invalid.',
      );
    }

    return this.processWebhookPayload(payload, null, signatureHeader, request);
  }

  @Post('tenants/:slug')
  async receiveTenantScopedWebhook(
    @Param('slug') slug: string,
    @Req() request: RawBodyRequest,
    @Headers('x-hub-signature-256') signatureHeader: string | undefined,
    @Body() payload: Record<string, unknown>,
  ): Promise<{
    status: 'EVENT_RECEIVED';
    tenantSlug: string;
    tenantResolutionSource: string;
    envelopeId: string;
    eventKey: string;
    duplicate: boolean;
    envelopeStatus: string;
    processedInboundMessages: number;
    processedDeliveryEvents: number;
  }> {
    if (
      this.metaWhatsappWebhookSignatureVerifier.isConfigured() &&
      signatureHeader &&
      !this.metaWhatsappWebhookSignatureVerifier.verify(
        request.rawBody,
        signatureHeader,
      )
    ) {
      throw new ForbiddenException(
        'WhatsApp webhook signature is invalid.',
      );
    }

    return this.processWebhookPayload(payload, slug, signatureHeader, request);
  }

  private verifyWebhookChallenge(query: VerificationQuery): string {
    if (query['hub.mode'] !== 'subscribe') {
      throw new BadRequestException(
        'Unsupported WhatsApp webhook verification mode.',
      );
    }

    const verifyToken = query['hub.verify_token']?.trim();
    const challenge = query['hub.challenge']?.trim();

    if (!verifyToken || !challenge) {
      throw new BadRequestException(
        'WhatsApp webhook verification token and challenge are required.',
      );
    }

    if (!this.metaWhatsappWebhookVerifier.verify(verifyToken)) {
      throw new ForbiddenException(
        'WhatsApp webhook verification token is invalid.',
      );
    }

    return challenge;
  }

  private async processWebhookPayload(
    payload: Record<string, unknown>,
    explicitTenantSlug: string | null,
    signatureHeader: string | undefined,
    request: RawBodyRequest,
  ): Promise<{
    status: 'EVENT_RECEIVED';
    tenantSlug: string;
    tenantResolutionSource: string;
    envelopeId: string;
    eventKey: string;
    duplicate: boolean;
    envelopeStatus: string;
    processedInboundMessages: number;
    processedDeliveryEvents: number;
  }> {
    const typedPayload = payload as {
      entry?: Array<{
        id?: string;
        changes?: Array<{
          value?: {
            metadata?: {
              phone_number_id?: string;
            };
          };
        }>;
      }>;
    };

    let resolution;

    try {
      resolution = this.metaWhatsappWebhookTenantResolver.resolve(
        typedPayload,
        explicitTenantSlug,
      );
    } catch (error) {
      if (error instanceof MetaWhatsappWebhookTenantNotResolvedError) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof MetaWhatsappWebhookTenantResolutionConflictError) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }

    const result = await this.receiveTenantMetaWhatsappWebhookUseCase.execute({
      tenantSlug: resolution.tenantSlug,
      provider: explicitTenantSlug ? 'meta_cloud_api_stub' : 'meta_cloud_api',
      payload: typedPayload,
      rawPayloadJson:
        request.rawBody?.toString('utf8') ?? JSON.stringify(payload),
      signatureHeader: signatureHeader ?? null,
    });

    return {
      status: 'EVENT_RECEIVED',
      tenantSlug: resolution.tenantSlug,
      tenantResolutionSource: resolution.source,
      envelopeId: result.envelopeId,
      eventKey: result.eventKey,
      duplicate: result.duplicate,
      envelopeStatus: result.envelopeStatus,
      processedInboundMessages: result.processedInboundMessages,
      processedDeliveryEvents: result.processedDeliveryEvents,
    };
  }
}
