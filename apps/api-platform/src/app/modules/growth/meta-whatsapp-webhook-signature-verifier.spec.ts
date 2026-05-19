import { createHmac } from 'node:crypto';
import { MetaWhatsappWebhookSignatureVerifier } from './meta-whatsapp-webhook-signature-verifier';

describe('MetaWhatsappWebhookSignatureVerifier', () => {
  const originalAppSecret = process.env.GROWTH_WHATSAPP_META_APP_SECRET;

  afterEach(() => {
    process.env.GROWTH_WHATSAPP_META_APP_SECRET = originalAppSecret;
  });

  it('verifies a valid x-hub-signature-256 header against the raw body', () => {
    process.env.GROWTH_WHATSAPP_META_APP_SECRET = 'super-secret';
    const verifier = new MetaWhatsappWebhookSignatureVerifier();
    const rawBody = Buffer.from('{"object":"whatsapp_business_account"}');
    const signature = createHmac('sha256', 'super-secret')
      .update(rawBody)
      .digest('hex');

    expect(verifier.verify(rawBody, `sha256=${signature}`)).toBe(true);
  });

  it('rejects a malformed or mismatched signature', () => {
    process.env.GROWTH_WHATSAPP_META_APP_SECRET = 'super-secret';
    const verifier = new MetaWhatsappWebhookSignatureVerifier();
    const rawBody = Buffer.from('{"object":"whatsapp_business_account"}');

    expect(verifier.verify(rawBody, 'sha256=deadbeef')).toBe(false);
    expect(verifier.verify(rawBody, 'deadbeef')).toBe(false);
  });
});
