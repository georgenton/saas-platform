import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  createHmac,
  createPublicKey,
  timingSafeEqual,
  verify as verifySignature,
} from 'node:crypto';
import { JwtClaims } from './jwt-claims';
import { JwtVerifier } from './jwt-verifier';

interface JwtHeader {
  alg?: string;
  typ?: string;
}

@Injectable()
export class LocalJwtVerifier implements JwtVerifier {
  verify(token: string): JwtClaims {
    const segments = token.split('.');

    if (segments.length !== 3) {
      throw new UnauthorizedException('Malformed JWT.');
    }

    const [encodedHeader, encodedPayload, encodedSignature] = segments;
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const header = this.decodeSegment<JwtHeader>(encodedHeader);

    if (header.alg === 'HS256') {
      this.verifyHs256(signingInput, encodedSignature);
    } else if (header.alg === 'RS256') {
      this.verifyRs256(signingInput, encodedSignature);
    } else {
      throw new UnauthorizedException('Unsupported JWT algorithm.');
    }

    const claims = this.decodeSegment<JwtClaims>(encodedPayload);

    if (typeof claims !== 'object' || claims === null) {
      throw new UnauthorizedException('Invalid JWT payload.');
    }

    return claims;
  }

  private verifyHs256(signingInput: string, encodedSignature: string): void {
    const secret = process.env.AUTH_JWT_SECRET;

    if (!secret) {
      throw new UnauthorizedException('AUTH_JWT_SECRET is not configured.');
    }

    const expectedSignature = this.base64UrlEncode(
      createHmac('sha256', secret).update(signingInput).digest(),
    );

    const actualSignature = Buffer.from(encodedSignature);
    const computedSignature = Buffer.from(expectedSignature);

    if (
      actualSignature.length !== computedSignature.length ||
      !timingSafeEqual(actualSignature, computedSignature)
    ) {
      throw new UnauthorizedException('Invalid JWT signature.');
    }
  }

  private verifyRs256(signingInput: string, encodedSignature: string): void {
    const publicKeyPem = process.env.AUTH_JWT_PUBLIC_KEY;

    if (!publicKeyPem) {
      throw new UnauthorizedException('AUTH_JWT_PUBLIC_KEY is not configured.');
    }

    const verified = verifySignature(
      'RSA-SHA256',
      Buffer.from(signingInput),
      createPublicKey(publicKeyPem),
      this.base64UrlDecode(encodedSignature),
    );

    if (!verified) {
      throw new UnauthorizedException('Invalid JWT signature.');
    }
  }

  private decodeSegment<T>(segment: string): T {
    try {
      return JSON.parse(this.base64UrlDecode(segment).toString('utf8')) as T;
    } catch {
      throw new UnauthorizedException('Malformed JWT segment.');
    }
  }

  private base64UrlDecode(value: string): Buffer {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '=',
    );

    return Buffer.from(padded, 'base64');
  }

  private base64UrlEncode(buffer: Buffer): string {
    return buffer
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }
}
