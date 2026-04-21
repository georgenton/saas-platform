import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { AuthenticatedUserContext } from './authenticated-user-context';

interface JwtClaims {
  sub?: string;
  email?: string;
  provider?: string;
  externalAuthId?: string;
}

interface JwtHeader {
  alg?: string;
  typ?: string;
}

@Injectable()
export class JwtAuthenticationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization as
      | string
      | undefined;

    if (!authorizationHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization Bearer token is required.',
      );
    }

    const token = authorizationHeader.slice('Bearer '.length).trim();

    if (!token) {
      throw new UnauthorizedException('Authorization Bearer token is required.');
    }

    const claims = this.verifyToken(token);

    if (!claims.sub) {
      throw new UnauthorizedException('JWT subject claim is required.');
    }

    const authenticatedUser: AuthenticatedUserContext = {
      id: claims.sub,
      email: claims.email ?? null,
      provider: claims.provider ?? null,
      externalAuthId: claims.externalAuthId ?? null,
    };

    request.authenticatedUser = authenticatedUser;

    return true;
  }

  private verifyToken(token: string): JwtClaims {
    const secret = process.env.AUTH_JWT_SECRET;

    if (!secret) {
      throw new UnauthorizedException('AUTH_JWT_SECRET is not configured.');
    }

    const segments = token.split('.');

    if (segments.length !== 3) {
      throw new UnauthorizedException('Malformed JWT.');
    }

    const [encodedHeader, encodedPayload, encodedSignature] = segments;
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const header = this.decodeSegment<JwtHeader>(encodedHeader);

    if (header.alg !== 'HS256') {
      throw new UnauthorizedException('Unsupported JWT algorithm.');
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

    const claims = this.decodeSegment<JwtClaims>(encodedPayload);

    if (typeof claims !== 'object' || claims === null) {
      throw new UnauthorizedException('Invalid JWT payload.');
    }

    return claims;
  }

  private decodeSegment<T>(segment: string): T {
    try {
      const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(
        normalized.length + ((4 - (normalized.length % 4)) % 4),
        '=',
      );

      return JSON.parse(Buffer.from(padded, 'base64').toString('utf8')) as T;
    } catch {
      throw new UnauthorizedException('Malformed JWT segment.');
    }
  }

  private base64UrlEncode(buffer: Buffer): string {
    return buffer
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }
}
