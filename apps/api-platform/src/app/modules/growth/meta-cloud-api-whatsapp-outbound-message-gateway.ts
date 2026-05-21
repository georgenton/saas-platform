import { Injectable } from '@nestjs/common';
import {
  SendWhatsappOutboundMessageInput,
  SendWhatsappOutboundMessageResult,
  WhatsappOutboundMessageGateway,
} from '@saas-platform/growth-application';

@Injectable()
export class MetaCloudApiWhatsappOutboundMessageGateway
  implements WhatsappOutboundMessageGateway
{
  async send(
    input: SendWhatsappOutboundMessageInput,
  ): Promise<SendWhatsappOutboundMessageResult> {
    if (!this.shouldUseRealProvider()) {
      return {
        provider: 'meta_cloud_api_stub',
        externalMessageId: this.buildStubExternalMessageId(),
        deliveryStatus: 'pending',
        failureReason: null,
        providerStatusDetail: 'stub_accepted',
        providerConversationCategory: null,
        providerPricingCategory: null,
        providerErrorCode: null,
        providerResponseJson: JSON.stringify({
          mode: 'stub',
          tenantSlug: input.tenantSlug,
          threadId: input.threadId,
          recipientHandle: input.recipientHandle,
          template: input.template ?? null,
        }),
      };
    }

    const response = await fetch(this.buildEndpoint(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.buildProviderPayload(input)),
    });

    const responseText = await response.text();
    const responseJson = this.tryParseJson(responseText);
    const externalMessageId = this.extractExternalMessageId(responseJson);

    if (!response.ok) {
      return {
        provider: 'meta_cloud_api',
        externalMessageId,
        deliveryStatus: 'failed',
        failureReason:
          this.extractFailureReason(responseJson) ??
          `Meta Cloud API outbound request failed with status ${response.status}.`,
        providerStatusDetail:
          this.extractProviderStatusDetail(responseJson) ??
          `http_status:${response.status}`,
        providerConversationCategory: null,
        providerPricingCategory: null,
        providerErrorCode: this.extractFailureCode(responseJson),
        providerResponseJson: responseText || null,
      };
    }

    return {
      provider: 'meta_cloud_api',
      externalMessageId,
      deliveryStatus: 'sent',
      failureReason: null,
      providerStatusDetail:
        this.extractMessageStatus(responseJson) ?? 'accepted_by_provider',
      providerConversationCategory: null,
      providerPricingCategory: null,
      providerErrorCode: null,
      providerResponseJson: responseText || null,
    };
  }

  private shouldUseRealProvider(): boolean {
    return (
      this.getOutboundProvider() === 'meta_cloud_api' &&
      this.getAccessToken().length > 0 &&
      this.getPhoneNumberId().length > 0
    );
  }

  private buildEndpoint(): string {
    return `https://graph.facebook.com/${this.getApiVersion()}/${this.getPhoneNumberId()}/messages`;
  }

  private getOutboundProvider(): string {
    return process.env.GROWTH_WHATSAPP_OUTBOUND_PROVIDER?.trim() ?? '';
  }

  private getAccessToken(): string {
    return process.env.GROWTH_WHATSAPP_META_ACCESS_TOKEN?.trim() ?? '';
  }

  private getPhoneNumberId(): string {
    return process.env.GROWTH_WHATSAPP_META_OUTBOUND_PHONE_NUMBER_ID?.trim() ?? '';
  }

  private getApiVersion(): string {
    return process.env.GROWTH_WHATSAPP_META_API_VERSION?.trim() || 'v20.0';
  }

  private buildStubExternalMessageId(): string {
    return `wamid.stub.${Date.now()}`;
  }

  private buildProviderPayload(
    input: SendWhatsappOutboundMessageInput,
  ): Record<string, unknown> {
    if (input.template) {
      return {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: input.recipientHandle,
        type: 'template',
        template: {
          name: input.template.providerTemplateName,
          language: {
            code: input.template.languageCode,
          },
          components: input.template.bodyParameterValues.length
            ? [
                {
                  type: 'body',
                  parameters: input.template.bodyParameterValues.map((value) => ({
                    type: 'text',
                    text: value,
                  })),
                },
              ]
            : undefined,
        },
      };
    }

    return {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: input.recipientHandle,
      type: 'text',
      text: {
        body: input.body,
      },
    };
  }

  private tryParseJson(value: string): Record<string, unknown> | null {
    if (!value.trim()) {
      return null;
    }

    try {
      return JSON.parse(value) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  private extractExternalMessageId(
    responseJson: Record<string, unknown> | null,
  ): string | null {
    const messages = responseJson?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return null;
    }

    const firstMessage = messages[0];

    if (
      firstMessage &&
      typeof firstMessage === 'object' &&
      'id' in firstMessage &&
      typeof firstMessage.id === 'string' &&
      firstMessage.id.trim().length > 0
    ) {
      return firstMessage.id.trim();
    }

    return null;
  }

  private extractFailureReason(
    responseJson: Record<string, unknown> | null,
  ): string | null {
    const error = responseJson?.error;

    if (!error || typeof error !== 'object') {
      return null;
    }

    if ('error_user_msg' in error && typeof error.error_user_msg === 'string') {
      return error.error_user_msg.trim() || null;
    }

    if ('message' in error && typeof error.message === 'string') {
      return error.message.trim() || null;
    }

    return null;
  }

  private extractFailureCode(
    responseJson: Record<string, unknown> | null,
  ): string | null {
    const error = responseJson?.error;

    if (!error || typeof error !== 'object') {
      return null;
    }

    if ('code' in error && error.code !== undefined && error.code !== null) {
      const code = String(error.code).trim();

      return code || null;
    }

    return null;
  }

  private extractProviderStatusDetail(
    responseJson: Record<string, unknown> | null,
  ): string | null {
    const error = responseJson?.error;

    if (!error || typeof error !== 'object') {
      return null;
    }

    if ('error_subcode' in error && error.error_subcode !== undefined && error.error_subcode !== null) {
      const subcode = String(error.error_subcode).trim();

      if (subcode) {
        return `error_subcode:${subcode}`;
      }
    }

    if ('type' in error && typeof error.type === 'string') {
      const type = error.type.trim();

      return type || null;
    }

    return null;
  }

  private extractMessageStatus(
    responseJson: Record<string, unknown> | null,
  ): string | null {
    const messages = responseJson?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return null;
    }

    const firstMessage = messages[0];

    if (
      firstMessage &&
      typeof firstMessage === 'object' &&
      'message_status' in firstMessage &&
      typeof firstMessage.message_status === 'string'
    ) {
      const status = firstMessage.message_status.trim();

      return status || null;
    }

    return null;
  }
}
