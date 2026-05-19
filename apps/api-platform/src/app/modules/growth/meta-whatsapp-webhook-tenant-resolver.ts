import { Injectable } from '@nestjs/common';
import { ProcessTenantMetaWhatsappWebhookInput } from '@saas-platform/growth-application';

export type MetaWhatsappWebhookTenantResolutionSource =
  | 'explicit_slug'
  | 'phone_number_id'
  | 'business_account_id';

export interface MetaWhatsappWebhookTenantResolution {
  tenantSlug: string;
  source: MetaWhatsappWebhookTenantResolutionSource;
  evidence: string;
}

export class MetaWhatsappWebhookTenantNotResolvedError extends Error {
  constructor() {
    super(
      'No se pudo resolver el tenant del webhook de WhatsApp. Configura el slug explicito o un mapping por phone_number_id/business_account_id.',
    );
  }
}

export class MetaWhatsappWebhookTenantResolutionConflictError extends Error {
  constructor(message: string) {
    super(message);
  }
}

type MetaWhatsappWebhookRoutingMetadata = {
  phoneNumberId: string | null;
  businessAccountId: string | null;
};

@Injectable()
export class MetaWhatsappWebhookTenantResolver {
  resolve(
    payload: ProcessTenantMetaWhatsappWebhookInput['payload'],
    explicitTenantSlug?: string | null,
  ): MetaWhatsappWebhookTenantResolution {
    const normalizedExplicitTenantSlug = explicitTenantSlug?.trim() ?? '';
    const routingMetadata = this.extractRoutingMetadata(payload);
    const phoneNumberMappedTenantSlug = routingMetadata.phoneNumberId
      ? this.readTenantMap(
          process.env.GROWTH_WHATSAPP_META_PHONE_NUMBER_ID_TENANT_MAP,
        )[routingMetadata.phoneNumberId]
      : undefined;
    const businessAccountMappedTenantSlug = routingMetadata.businessAccountId
      ? this.readTenantMap(
          process.env.GROWTH_WHATSAPP_META_BUSINESS_ACCOUNT_ID_TENANT_MAP,
        )[routingMetadata.businessAccountId]
      : undefined;

    if (normalizedExplicitTenantSlug) {
      this.assertNoConflict(
        normalizedExplicitTenantSlug,
        phoneNumberMappedTenantSlug,
        routingMetadata.phoneNumberId,
        'phone_number_id',
      );
      this.assertNoConflict(
        normalizedExplicitTenantSlug,
        businessAccountMappedTenantSlug,
        routingMetadata.businessAccountId,
        'business_account_id',
      );

      return {
        tenantSlug: normalizedExplicitTenantSlug,
        source: 'explicit_slug',
        evidence: normalizedExplicitTenantSlug,
      };
    }

    if (phoneNumberMappedTenantSlug && routingMetadata.phoneNumberId) {
      return {
        tenantSlug: phoneNumberMappedTenantSlug,
        source: 'phone_number_id',
        evidence: routingMetadata.phoneNumberId,
      };
    }

    if (businessAccountMappedTenantSlug && routingMetadata.businessAccountId) {
      return {
        tenantSlug: businessAccountMappedTenantSlug,
        source: 'business_account_id',
        evidence: routingMetadata.businessAccountId,
      };
    }

    throw new MetaWhatsappWebhookTenantNotResolvedError();
  }

  private assertNoConflict(
    explicitTenantSlug: string,
    mappedTenantSlug: string | undefined,
    evidence: string | null,
    source: 'phone_number_id' | 'business_account_id',
  ): void {
    if (!mappedTenantSlug || !evidence || mappedTenantSlug === explicitTenantSlug) {
      return;
    }

    throw new MetaWhatsappWebhookTenantResolutionConflictError(
      `El webhook de WhatsApp trae ${source}=${evidence}, pero su mapping apunta a "${mappedTenantSlug}" y no al tenant explicito "${explicitTenantSlug}".`,
    );
  }

  private extractRoutingMetadata(
    payload: ProcessTenantMetaWhatsappWebhookInput['payload'],
  ): MetaWhatsappWebhookRoutingMetadata {
    for (const entry of payload.entry ?? []) {
      const businessAccountId = entry.id?.trim() || null;

      for (const change of entry.changes ?? []) {
        const phoneNumberId = change.value?.metadata?.phone_number_id?.trim();

        if (phoneNumberId || businessAccountId) {
          return {
            phoneNumberId: phoneNumberId || null,
            businessAccountId,
          };
        }
      }

      if (businessAccountId) {
        return {
          phoneNumberId: null,
          businessAccountId,
        };
      }
    }

    return {
      phoneNumberId: null,
      businessAccountId: null,
    };
  }

  private readTenantMap(rawValue: string | undefined): Record<string, string> {
    if (!rawValue?.trim()) {
      return {};
    }

    try {
      const parsedValue = JSON.parse(rawValue) as Record<string, unknown>;

      return Object.fromEntries(
        Object.entries(parsedValue).flatMap(([key, value]) =>
          typeof value === 'string' && value.trim().length > 0
            ? [[key.trim(), value.trim()]]
            : [],
        ),
      );
    } catch {
      return {};
    }
  }
}
