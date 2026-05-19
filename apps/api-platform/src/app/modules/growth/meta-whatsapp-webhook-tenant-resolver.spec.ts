import {
  MetaWhatsappWebhookTenantResolutionConflictError,
  MetaWhatsappWebhookTenantResolver,
} from './meta-whatsapp-webhook-tenant-resolver';

describe('MetaWhatsappWebhookTenantResolver', () => {
  const originalPhoneMap =
    process.env.GROWTH_WHATSAPP_META_PHONE_NUMBER_ID_TENANT_MAP;
  const originalBusinessMap =
    process.env.GROWTH_WHATSAPP_META_BUSINESS_ACCOUNT_ID_TENANT_MAP;

  afterEach(() => {
    process.env.GROWTH_WHATSAPP_META_PHONE_NUMBER_ID_TENANT_MAP =
      originalPhoneMap;
    process.env.GROWTH_WHATSAPP_META_BUSINESS_ACCOUNT_ID_TENANT_MAP =
      originalBusinessMap;
  });

  it('resolves a tenant from phone_number_id metadata when no slug is provided', () => {
    process.env.GROWTH_WHATSAPP_META_PHONE_NUMBER_ID_TENANT_MAP = JSON.stringify(
      {
        '1234567890': 'saas-platform-local',
      },
    );
    const resolver = new MetaWhatsappWebhookTenantResolver();

    expect(
      resolver.resolve({
        entry: [
          {
            changes: [
              {
                value: {
                  metadata: {
                    phone_number_id: '1234567890',
                  },
                },
              },
            ],
          },
        ],
      }),
    ).toEqual({
      tenantSlug: 'saas-platform-local',
      source: 'phone_number_id',
      evidence: '1234567890',
    });
  });

  it('rejects an explicit slug that conflicts with the configured provider mapping', () => {
    process.env.GROWTH_WHATSAPP_META_PHONE_NUMBER_ID_TENANT_MAP = JSON.stringify(
      {
        '1234567890': 'tenant-from-provider',
      },
    );
    const resolver = new MetaWhatsappWebhookTenantResolver();

    expect(() =>
      resolver.resolve(
        {
          entry: [
            {
              changes: [
                {
                  value: {
                    metadata: {
                      phone_number_id: '1234567890',
                    },
                  },
                },
              ],
            },
          ],
        },
        'tenant-from-url',
      ),
    ).toThrow(MetaWhatsappWebhookTenantResolutionConflictError);
  });
});
