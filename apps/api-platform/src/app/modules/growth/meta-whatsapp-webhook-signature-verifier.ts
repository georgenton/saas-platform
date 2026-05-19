import { Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';

@Injectable()
export class MetaWhatsappWebhookSignatureVerifier {
  isConfigured(): boolean {
    return this.getAppSecret().length > 0;
  }

  verify(
    rawBody: Buffer | string | undefined,
    signatureHeader?: string | string[],
  ): boolean {
    const appSecret = this.getAppSecret();
    const providedSignature = this.normalizeSignatureHeader(signatureHeader);

    if (!appSecret || !providedSignature) {
      return false;
    }

    const rawBodyBuffer = this.normalizeRawBody(rawBody);

    if (!rawBodyBuffer) {
      return false;
    }

    const expectedSignature = createHmac('sha256', appSecret)
      .update(rawBodyBuffer)
      .digest('hex');

    return this.safeCompare(expectedSignature, providedSignature);
  }

  private getAppSecret(): string {
    return process.env.GROWTH_WHATSAPP_META_APP_SECRET?.trim() ?? '';
  }

  private normalizeSignatureHeader(
    signatureHeader?: string | string[],
  ): string | null {
    const rawHeader = Array.isArray(signatureHeader)
      ? signatureHeader[0]
      : signatureHeader;
    const normalizedHeader = rawHeader?.trim();

    if (!normalizedHeader) {
      return null;
    }

    if (!normalizedHeader.startsWith('sha256=')) {
      return null;
    }

    const signature = normalizedHeader.slice('sha256='.length).trim();

    return signature.length > 0 ? signature : null;
  }

  private normalizeRawBody(rawBody: Buffer | string | undefined): Buffer | null {
    if (Buffer.isBuffer(rawBody)) {
      return rawBody;
    }

    if (typeof rawBody === 'string' && rawBody.length > 0) {
      return Buffer.from(rawBody, 'utf8');
    }

    return null;
  }

  private safeCompare(expected: string, provided: string): boolean {
    const expectedBuffer = Buffer.from(expected, 'utf8');
    const providedBuffer = Buffer.from(provided, 'utf8');

    if (expectedBuffer.length !== providedBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, providedBuffer);
  }
}
