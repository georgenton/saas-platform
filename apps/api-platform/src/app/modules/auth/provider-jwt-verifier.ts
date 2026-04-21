import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  createPublicKey,
  verify as verifySignature,
} from 'node:crypto';
import { JwtClaims } from './jwt-claims';
import { JwtVerifier } from './jwt-verifier';

interface JwtHeader {
  alg?: string;
  typ?: string;
}

@Injectable()
export class ProviderJwtVerifier implements JwtVerifier {
  verify(token: string): JwtClaims {
    const segments = token.split('.');

    if (segments.length !== 3) {
      throw new UnauthorizedException('Malformed JWT.');
    }

    const [encodedHeader, encodedPayload, encodedSignature] = segments;
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const header = this.decodeSegment<JwtHeader>(encodedHeader);

    if (header.alg !== 'RS256') {
      throw new UnauthorizedException(
        'Provider-backed JWT verification requires RS256.',
      );
    }

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

    const claims = this.decodeSegment<JwtClaims>(encodedPayload);

    if (typeof claims !== 'object' || claims === null) {
      throw new UnauthorizedException('Invalid JWT payload.');
    }

    this.assertIssuer(claims);
    this.assertAudience(claims);
    this.assertTemporalClaims(claims);

    return claims;
  }

  private assertIssuer(claims: JwtClaims): void {
    const expectedIssuer = process.env.AUTH_JWT_ISSUER;

    if (expectedIssuer && claims.iss !== expectedIssuer) {
      throw new UnauthorizedException('Invalid JWT issuer.');
    }
  }

  private assertAudience(claims: JwtClaims): void {
    const expectedAudience = process.env.AUTH_JWT_AUDIENCE;

    if (!expectedAudience) {
      return;
    }

    const audiences = Array.isArray(claims.aud)
      ? claims.aud
      : claims.aud
        ? [claims.aud]
        : [];

    if (!audiences.includes(expectedAudience)) {
      throw new UnauthorizedException('Invalid JWT audience.');
    }
  }

  private assertTemporalClaims(claims: JwtClaims): void {
    const now = Math.floor(Date.now() / 1000);

    if (typeof claims.nbf === 'number' && claims.nbf > now) {
      throw new UnauthorizedException('JWT is not active yet.');
    }

    if (typeof claims.exp === 'number' && claims.exp <= now) {
      throw new UnauthorizedException('JWT is expired.');
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
}
