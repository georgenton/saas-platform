import { Injectable } from '@nestjs/common';

@Injectable()
export class MetaWhatsappWebhookVerifier {
  verify(verifyToken: string): boolean {
    const expectedToken =
      process.env.GROWTH_WHATSAPP_META_VERIFY_TOKEN?.trim() ?? '';

    return expectedToken.length > 0 && verifyToken.trim() === expectedToken;
  }
}
